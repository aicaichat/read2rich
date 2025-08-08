"""Celery tasks for processing raw opportunity items."""

import json
from typing import Dict, Any, Optional
from datetime import datetime
from kafka import KafkaProducer
from loguru import logger

from .celery_app import celery_app
from processors.text_processor import TextProcessor
from processors.entity_extractor import EntityExtractor
from config import Settings

# Initialize processors (lazy loading)
_text_processor = None
_entity_extractor = None
_kafka_producer = None
_settings = None


def get_processors():
    """Lazy initialization of processors."""
    global _text_processor, _entity_extractor, _kafka_producer, _settings
    
    if _text_processor is None:
        _settings = Settings()
        _text_processor = TextProcessor(_settings)
        _entity_extractor = EntityExtractor(_settings)
        _kafka_producer = KafkaProducer(
            bootstrap_servers=_settings.kafka_bootstrap_servers.split(','),
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            key_serializer=lambda k: k.encode('utf-8') if k else None
        )
    
    return _text_processor, _entity_extractor, _kafka_producer, _settings


@celery_app.task(bind=True, max_retries=3)
def process_raw_item(self, raw_item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Process a single raw opportunity item.
    
    Args:
        raw_item: Raw item from ingestion service
        
    Returns:
        Processed item or None if processing failed
    """
    try:
        text_processor, entity_extractor, kafka_producer, settings = get_processors()
        
        logger.debug(f"Processing item {raw_item.get('id', 'unknown')}")
        
        # Extract text content based on source type
        text_content = _extract_text_content(raw_item)
        
        if not text_content:
            logger.warning(f"No text content found in item {raw_item.get('id')}")
            return None
        
        # Clean and normalize text
        cleaned_text = text_processor.clean_text(text_content)
        
        # Language detection and filtering
        if not text_processor.is_supported_language(cleaned_text):
            logger.debug(f"Unsupported language for item {raw_item.get('id')}")
            return None
        
        # Extract entities and keywords
        entities = entity_extractor.extract_entities(cleaned_text)
        keywords = entity_extractor.extract_keywords(cleaned_text)
        
        # Create processed item
        processed_item = {
            'id': raw_item.get('id'),
            'source_type': raw_item.get('source_type'),
            'original_data': raw_item.get('raw_data', {}),
            'cleaned_text': cleaned_text,
            'entities': entities,
            'keywords': keywords,
            'processed_at': datetime.utcnow().isoformat(),
            'processor_version': '1.0'
        }
        
        # Publish to clean items topic
        kafka_producer.send(
            settings.kafka_topic_clean_items,
            key=raw_item.get('source_type'),
            value=processed_item
        )
        kafka_producer.flush()
        
        logger.debug(f"Successfully processed item {raw_item.get('id')}")
        return processed_item
        
    except Exception as e:
        logger.error(f"Error processing item {raw_item.get('id', 'unknown')}: {e}")
        
        # Retry with exponential backoff
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=60 * (2 ** self.request.retries))
        else:
            logger.error(f"Max retries exceeded for item {raw_item.get('id')}")
            return None


def _extract_text_content(raw_item: Dict[str, Any]) -> str:
    """Extract relevant text content from raw item based on source type."""
    source_type = raw_item.get('source_type', '')
    raw_data = raw_item.get('raw_data', {})
    
    text_parts = []
    
    if source_type == 'reddit':
        title = raw_data.get('title', '')
        selftext = raw_data.get('selftext', '')
        text_parts = [title, selftext]
        
    elif source_type == 'hackernews':
        title = raw_data.get('title', '')
        text = raw_data.get('text', '')
        text_parts = [title, text]
        
    elif source_type == 'g2':
        review_text = raw_data.get('review_text', '')
        text_parts = [review_text]
        
    elif source_type == 'linkedin':
        title = raw_data.get('title', '')
        description = raw_data.get('description', '')
        text_parts = [title, description]
        
    elif source_type == 'newsletter':
        title = raw_data.get('title', '')
        summary = raw_data.get('summary', '')
        content = raw_data.get('content', '')
        text_parts = [title, summary, content]
    
    # Combine and clean text parts
    combined_text = ' '.join(filter(None, text_parts))
    return combined_text.strip()