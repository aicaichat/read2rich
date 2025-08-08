"""Kafka consumer for processing clean opportunity items."""

import json
import asyncio
from typing import Dict, Any, List
from kafka import KafkaConsumer as Consumer
from loguru import logger

from config import Settings
from embedders.embedding_manager import EmbeddingManager
from storage.vector_store import VectorStore


class EmbeddingKafkaConsumer:
    """Handles consuming clean items from Kafka and generating embeddings."""
    
    def __init__(self, settings: Settings, embedding_manager: EmbeddingManager, vector_store: VectorStore):
        self.settings = settings
        self.embedding_manager = embedding_manager
        self.vector_store = vector_store
        self.consumer = Consumer(
            settings.kafka_topic_clean_items,
            bootstrap_servers=settings.kafka_bootstrap_servers.split(','),
            group_id=settings.kafka_consumer_group,
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            auto_offset_reset='latest',
            enable_auto_commit=True,
            max_poll_records=settings.batch_size
        )
        self.running = False
        logger.info(f"Embedding Kafka consumer initialized for topic: {settings.kafka_topic_clean_items}")
    
    async def start_consuming(self):
        """Start consuming messages from Kafka."""
        self.running = True
        logger.info("Starting Kafka message consumption for embeddings")
        
        # Run consumer in executor to avoid blocking
        loop = asyncio.get_event_loop()
        
        try:
            await loop.run_in_executor(None, self._consume_messages)
        except Exception as e:
            logger.error(f"Error in embedding Kafka consumer: {e}")
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
                    asyncio.run(self._process_batch(batch))
                    batch = []
                    
            except Exception as e:
                logger.error(f"Error processing embedding message: {e}")
                continue
        
        # Process remaining items in batch
        if batch:
            asyncio.run(self._process_batch(batch))
    
    async def _process_batch(self, batch: List[Dict[str, Any]]):
        """Process a batch of clean items for embedding generation."""
        logger.debug(f"Processing embedding batch of {len(batch)} items")
        
        try:
            # Extract texts for embedding
            texts = []
            items_metadata = []
            
            for item in batch:
                text = item.get('cleaned_text', '')
                if text and len(text.strip()) > 10:  # Skip very short texts
                    # Truncate if too long
                    if len(text) > self.settings.max_text_length:
                        text = text[:self.settings.max_text_length]
                    
                    texts.append(text)
                    items_metadata.append(item)
            
            if not texts:
                logger.debug("No valid texts found in batch")
                return
            
            # Generate embeddings
            embeddings = await self.embedding_manager.generate_embeddings(texts)
            
            if len(embeddings) != len(texts):
                logger.error(f"Embedding count mismatch: {len(embeddings)} vs {len(texts)}")
                return
            
            # Store embeddings with metadata
            await self._store_embeddings(items_metadata, embeddings)
            
            logger.info(f"Successfully processed {len(embeddings)} embeddings")
            
        except Exception as e:
            logger.error(f"Error processing embedding batch: {e}")
    
    async def _store_embeddings(self, items_metadata: List[Dict[str, Any]], embeddings: List[List[float]]):
        """Store embeddings in vector store."""
        for item, embedding in zip(items_metadata, embeddings):
            try:
                # Prepare vector store payload
                payload = {
                    'id': item.get('id'),
                    'source_type': item.get('source_type'),
                    'cleaned_text': item.get('cleaned_text', ''),
                    'entities': item.get('entities', {}),
                    'keywords': item.get('keywords', []),
                    'processed_at': item.get('processed_at'),
                    'original_data': item.get('original_data', {})
                }
                
                # Store in vector store
                await self.vector_store.store_embedding(
                    vector_id=item.get('id'),
                    embedding=embedding,
                    payload=payload
                )
                
            except Exception as e:
                logger.error(f"Error storing embedding for item {item.get('id')}: {e}")
    
    def stop(self):
        """Stop consuming messages."""
        self.running = False
        if self.consumer:
            self.consumer.close()
            logger.info("Embedding Kafka consumer stopped")