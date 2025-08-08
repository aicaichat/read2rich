"""Main entry point for the Embedding Service.

Consumes clean items from Kafka, generates embeddings using OpenAI or local models,
and stores vectors in Qdrant or pgvector.
"""

import asyncio
import signal
from loguru import logger

from config import Settings
from consumers.kafka_consumer import EmbeddingKafkaConsumer
from embedders.embedding_manager import EmbeddingManager
from storage.vector_store import VectorStore


class EmbeddingService:
    """Main embedding service coordinator."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.embedding_manager = EmbeddingManager(settings)
        self.vector_store = VectorStore(settings)
        self.kafka_consumer = EmbeddingKafkaConsumer(
            settings, self.embedding_manager, self.vector_store
        )
        self.running = True
    
    async def start(self):
        """Start the embedding service."""
        logger.info("Starting AI Opportunity Finder Embedding Service")
        
        # Initialize components
        await self.embedding_manager.initialize()
        await self.vector_store.initialize()
        
        try:
            # Start Kafka consumer
            await self.kafka_consumer.start_consuming()
        finally:
            await self.shutdown()
    
    async def shutdown(self):
        """Graceful shutdown."""
        logger.info("Shutting down embedding service...")
        self.running = False
        
        if self.kafka_consumer:
            self.kafka_consumer.stop()
        
        if self.vector_store:
            await self.vector_store.close()
        
        if self.embedding_manager:
            await self.embedding_manager.cleanup()


async def main():
    """Main application entry point."""
    settings = Settings()
    service = EmbeddingService(settings)
    
    # Setup signal handlers
    def signal_handler(signum, frame):
        logger.info(f"Received signal {signum}, initiating shutdown...")
        asyncio.create_task(service.shutdown())
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        await service.start()
    except KeyboardInterrupt:
        logger.info("Keyboard interrupt received")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
    finally:
        await service.shutdown()


if __name__ == "__main__":
    asyncio.run(main())