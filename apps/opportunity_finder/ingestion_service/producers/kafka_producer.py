"""Kafka producer for publishing raw opportunity data."""

import json
import uuid
from datetime import datetime
from typing import Dict, Any
from kafka import KafkaProducer as Producer
from loguru import logger

from config import Settings


class KafkaProducer:
    """Handles publishing raw opportunity items to Kafka."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.producer = Producer(
            bootstrap_servers=settings.kafka_bootstrap_servers.split(','),
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            key_serializer=lambda k: k.encode('utf-8') if k else None,
            batch_size=settings.kafka_batch_size,
            linger_ms=settings.kafka_linger_ms,
            retries=3,
            acks='all'
        )
        logger.info(f"Kafka producer initialized for {settings.kafka_bootstrap_servers}")
    
    def publish_raw_item(self, source_type: str, item_data: Dict[str, Any]) -> bool:
        """Publish a raw opportunity item to Kafka.
        
        Args:
            source_type: Type of source (reddit, hackernews, g2, etc.)
            item_data: Raw item data from scraper
            
        Returns:
            True if successfully published, False otherwise
        """
        try:
            # Create standardized message format
            message = {
                "id": str(uuid.uuid4()),
                "source_type": source_type,
                "scraped_at": datetime.utcnow().isoformat(),
                "raw_data": item_data
            }
            
            # Use source_type as partition key for even distribution
            future = self.producer.send(
                self.settings.kafka_topic_raw_items,
                key=source_type,
                value=message
            )
            
            # Wait for send to complete (with timeout)
            record_metadata = future.get(timeout=10)
            
            logger.debug(
                f"Published {source_type} item to {record_metadata.topic} "
                f"partition {record_metadata.partition} offset {record_metadata.offset}"
            )
            return True
            
        except Exception as e:
            logger.error(f"Failed to publish {source_type} item: {e}")
            return False
    
    def flush(self):
        """Flush any pending messages."""
        self.producer.flush()
    
    def close(self):
        """Close the producer connection."""
        try:
            self.producer.flush()
            self.producer.close()
            logger.info("Kafka producer closed")
        except Exception as e:
            logger.error(f"Error closing Kafka producer: {e}")