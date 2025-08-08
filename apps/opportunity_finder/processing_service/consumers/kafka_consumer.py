"""Kafka consumer for processing raw opportunity items."""

import json
import asyncio
from typing import Dict, Any
from kafka import KafkaConsumer as Consumer
from loguru import logger

from config import Settings
from workers.tasks import process_raw_item


class KafkaConsumer:
    """Handles consuming raw items from Kafka and dispatching to workers."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.consumer = Consumer(
            settings.kafka_topic_raw_items,
            bootstrap_servers=settings.kafka_bootstrap_servers.split(','),
            group_id=settings.kafka_consumer_group,
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            auto_offset_reset='latest',
            enable_auto_commit=True
        )
        self.running = False
        logger.info(f"Kafka consumer initialized for topic: {settings.kafka_topic_raw_items}")
    
    async def start_consuming(self):
        """Start consuming messages from Kafka."""
        self.running = True
        logger.info("Starting Kafka message consumption")
        
        # Run consumer in executor to avoid blocking
        loop = asyncio.get_event_loop()
        
        try:
            await loop.run_in_executor(None, self._consume_messages)
        except Exception as e:
            logger.error(f"Error in Kafka consumer: {e}")
        finally:
            self.stop()
    
    def _consume_messages(self):
        """Consume messages in a blocking manner."""
        batch = []
        
        for message in self.consumer:
            if not self.running:
                break
            
            try:
                # Add message to batch
                batch.append(message.value)
                
                # Process batch when it reaches target size
                if len(batch) >= self.settings.batch_size:
                    self._process_batch(batch)
                    batch = []
                    
            except Exception as e:
                logger.error(f"Error processing message: {e}")
                continue
        
        # Process remaining items in batch
        if batch:
            self._process_batch(batch)
    
    def _process_batch(self, batch: list):
        """Send batch to Celery workers for processing."""
        logger.debug(f"Processing batch of {len(batch)} items")
        
        for item in batch:
            try:
                # Dispatch to Celery worker
                process_raw_item.delay(item)
            except Exception as e:
                logger.error(f"Failed to dispatch item to worker: {e}")
    
    def stop(self):
        """Stop consuming messages."""
        self.running = False
        if self.consumer:
            self.consumer.close()
            logger.info("Kafka consumer stopped")