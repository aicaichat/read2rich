"""Main entry point for the Scoring Service.

Processes clean opportunity items and generates multi-dimensional scores:
- Pain Score: How severe is the pain point
- TAM Score: Total Addressable Market size
- Gap Score: How underserved is this market
- AI Fit Score: How suitable for AI solution
- Solo Fit Score: How feasible for 1-3 person team
- Risk Score: Implementation and market risks

Uses CatBoost models with Reinforcement Learning Bandit for online learning.
"""

import asyncio
import signal
from loguru import logger

from config import Settings
from consumers.kafka_consumer import ScoringKafkaConsumer
from models.scoring_engine import ScoringEngine
from database.db_manager import DatabaseManager


class ScoringService:
    """Main scoring service coordinator."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.db_manager = DatabaseManager(settings)
        self.scoring_engine = ScoringEngine(settings, self.db_manager)
        self.kafka_consumer = ScoringKafkaConsumer(
            settings, self.scoring_engine, self.db_manager
        )
        self.running = True
    
    async def start(self):
        """Start the scoring service."""
        logger.info("Starting AI Opportunity Finder Scoring Service")
        
        # Initialize components
        await self.db_manager.initialize()
        await self.scoring_engine.initialize()
        
        # Start background model training task
        training_task = asyncio.create_task(self._background_training_loop())
        
        try:
            # Start Kafka consumer
            await self.kafka_consumer.start_consuming()
        finally:
            training_task.cancel()
            await self.shutdown()
    
    async def _background_training_loop(self):
        """Background task for periodic model retraining."""
        while self.running:
            try:
                # Wait 1 hour between training cycles
                await asyncio.sleep(3600)
                
                if self.running:
                    logger.info("Starting background model retraining")
                    await self.scoring_engine.retrain_models()
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in background training: {e}")
                await asyncio.sleep(300)  # Wait 5 minutes on error
    
    async def shutdown(self):
        """Graceful shutdown."""
        logger.info("Shutting down scoring service...")
        self.running = False
        
        if self.kafka_consumer:
            self.kafka_consumer.stop()
        
        if self.scoring_engine:
            await self.scoring_engine.cleanup()
        
        if self.db_manager:
            await self.db_manager.close()


async def main():
    """Main application entry point."""
    settings = Settings()
    service = ScoringService(settings)
    
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