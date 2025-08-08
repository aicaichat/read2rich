"""Main entry point for AI Opportunity Finder Ingestion Service.

Orchestrates multiple scrapers to collect pain signals from:
- Reddit (r/entrepreneur, r/startups, r/SaaS, etc.)
- Hacker News (Show HN, Ask HN)
- G2 reviews and feature requests
- LinkedIn posts and job listings
- YC Request for Startups
- Newsletter pain points

Publishes raw items to Kafka for downstream processing.
"""

import asyncio
import signal
from typing import List
from loguru import logger
from aiohttp import web
import json
from datetime import datetime

from config import Settings
from scrapers.reddit_scraper import RedditScraper
from scrapers.hackernews_scraper import HackerNewsScraper
from scrapers.g2_scraper import G2Scraper
from scrapers.linkedin_scraper import LinkedInScraper
from scrapers.newsletter_scraper import NewsletterScraper
from scrapers.browser_scraper import BrowserScraper
from scrapers.smart_http_scraper import SmartHttpScraper
from producers.kafka_producer import KafkaProducer


class IngestionOrchestrator:
    """Coordinates all scraping activities and manages lifecycle."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.kafka_producer = KafkaProducer(settings)
        self.scrapers = self._initialize_scrapers()
        self.running = True
        
    def _initialize_scrapers(self) -> List:
        """Initialize all scraper instances."""
        return [
            BrowserScraper(self.kafka_producer, self.settings),    # Primary: Visual browser automation
            # SmartHttpScraper(self.kafka_producer, self.settings),  # Backup: Smart HTTP scraping
            # Comment out original scrapers to focus on browser automation for visibility
            # RedditScraper(self.kafka_producer, self.settings),     
            # HackerNewsScraper(self.kafka_producer, self.settings), 
            # G2Scraper(self.kafka_producer, self.settings),
            # LinkedInScraper(self.kafka_producer, self.settings),
            # NewsletterScraper(self.kafka_producer, self.settings),
        ]
    
    async def start_scraping(self):
        """Start all scrapers concurrently."""
        logger.info("Starting AI Opportunity Finder Ingestion Service")
        
        # Start all scrapers as concurrent tasks
        tasks = []
        for scraper in self.scrapers:
            task = asyncio.create_task(scraper.run())
            tasks.append(task)
            
        # Wait for all tasks to complete or until shutdown signal
        try:
            await asyncio.gather(*tasks)
        except asyncio.CancelledError:
            logger.info("Scraping tasks cancelled")
            
    def shutdown(self):
        """Graceful shutdown."""
        logger.info("Shutting down ingestion service...")
        self.running = False
        self.kafka_producer.close()


async def main():
    """Main application entry point."""
    settings = Settings()
    orchestrator = IngestionOrchestrator(settings)
    
    # Setup signal handlers for graceful shutdown
    def signal_handler(signum, frame):
        logger.info(f"Received signal {signum}, initiating shutdown...")
        orchestrator.shutdown()
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        await orchestrator.start_scraping()
    except KeyboardInterrupt:
        logger.info("Keyboard interrupt received")
    finally:
        orchestrator.shutdown()


if __name__ == "__main__":
    asyncio.run(main())