"""Base scraper class with common functionality."""

import asyncio
from abc import ABC, abstractmethod
from typing import Dict, Any, List
from datetime import datetime, timedelta
import redis
from loguru import logger

from config import Settings
from producers.kafka_producer import KafkaProducer


class BaseScraper(ABC):
    """Abstract base class for all scrapers."""
    
    def __init__(self, kafka_producer: KafkaProducer, settings: Settings):
        self.kafka_producer = kafka_producer
        self.settings = settings
        self.redis_client = redis.from_url(settings.redis_url)
        self.source_type = self.get_source_type()
        
    @abstractmethod
    def get_source_type(self) -> str:
        """Return the source type identifier."""
        pass
    
    @abstractmethod
    async def scrape_batch(self) -> List[Dict[str, Any]]:
        """Scrape a batch of items from the source."""
        pass
    
    async def run(self):
        """Main scraper loop."""
        logger.info(f"Starting {self.source_type} scraper")
        
        while True:
            try:
                # Check if we should skip this run (rate limiting)
                if self._should_skip_run():
                    await asyncio.sleep(60)  # Wait 1 minute
                    continue
                
                # Scrape batch of items
                items = await self.scrape_batch()
                
                if items:
                    # Publish each item to Kafka
                    published_count = 0
                    for item in items:
                        if self.kafka_producer.publish_raw_item(self.source_type, item):
                            published_count += 1
                    
                    logger.info(
                        f"{self.source_type}: scraped {len(items)} items, "
                        f"published {published_count}"
                    )
                    
                    # Update last run timestamp
                    self._update_last_run()
                else:
                    logger.debug(f"{self.source_type}: no new items found")
                
                # Wait before next scrape
                await asyncio.sleep(self.settings.scrape_interval_minutes * 60)
                
            except Exception as e:
                logger.error(f"Error in {self.source_type} scraper: {e}")
                await asyncio.sleep(300)  # Wait 5 minutes on error
    
    def _should_skip_run(self) -> bool:
        """Check if this scraper should skip the current run."""
        last_run_key = f"last_run:{self.source_type}"
        last_run = self.redis_client.get(last_run_key)
        
        if not last_run:
            return False
        
        last_run_time = datetime.fromisoformat(last_run.decode())
        min_interval = timedelta(minutes=self.settings.scrape_interval_minutes)
        
        return datetime.utcnow() - last_run_time < min_interval
    
    def _update_last_run(self):
        """Update the last run timestamp in Redis."""
        last_run_key = f"last_run:{self.source_type}"
        self.redis_client.set(
            last_run_key, 
            datetime.utcnow().isoformat(), 
            ex=3600  # Expire after 1 hour
        )
    
    def _is_duplicate(self, item_id: str) -> bool:
        """Check if an item has already been scraped."""
        dup_key = f"scraped:{self.source_type}:{item_id}"
        return self.redis_client.exists(dup_key)
    
    def _mark_as_scraped(self, item_id: str):
        """Mark an item as already scraped."""
        dup_key = f"scraped:{self.source_type}:{item_id}"
        self.redis_client.set(dup_key, "1", ex=86400 * 7)  # Keep for 7 days