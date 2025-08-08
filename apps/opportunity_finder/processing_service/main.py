"""Main entry point for the Processing Service.

Consumes raw items from Kafka, performs NLP cleaning and entity extraction,
then publishes cleaned items back to Kafka for embedding generation.
"""

import asyncio
import signal
from loguru import logger

from config import Settings
from consumers.kafka_consumer import KafkaConsumer
from workers.celery_app import celery_app


class ProcessingService:
    """Main processing service coordinator."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.kafka_consumer = KafkaConsumer(settings)
        self.running = True
    
    async def start(self):
        """Start the processing service."""
        logger.info("Starting AI Opportunity Finder Processing Service")
        
        # Start Celery worker in the background
        celery_process = await asyncio.create_subprocess_exec(
            "celery", "-A", "workers.celery_app", "worker", 
            "--loglevel=info", "--concurrency=4"
        )
        
        try:
            # Start Kafka consumer
            await self.kafka_consumer.start_consuming()
        finally:
            # Clean shutdown
            celery_process.terminate()
            await celery_process.wait()
    
    def shutdown(self):
        """Graceful shutdown."""
        logger.info("Shutting down processing service...")
        self.running = False
        if self.kafka_consumer:
            self.kafka_consumer.stop()


async def main():
    """Main application entry point."""
    settings = Settings()
    service = ProcessingService(settings)
    
    # Setup signal handlers
    def signal_handler(signum, frame):
        logger.info(f"Received signal {signum}, initiating shutdown...")
        service.shutdown()
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        await service.start()
    except KeyboardInterrupt:
        logger.info("Keyboard interrupt received")
    finally:
        service.shutdown()


if __name__ == "__main__":
    asyncio.run(main())