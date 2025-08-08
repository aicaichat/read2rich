"""Configuration settings for the processing service."""

from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Kafka Configuration
    kafka_bootstrap_servers: str = "localhost:9092"
    kafka_topic_raw_items: str = "raw_opportunities"
    kafka_topic_clean_items: str = "clean_opportunities"
    kafka_consumer_group: str = "processing_service"
    
    # Redis Configuration (for Celery)
    redis_url: str = "redis://localhost:6379/1"
    
    # OpenAI Configuration
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-3.5-turbo"
    openai_max_tokens: int = 500
    
    # Processing Configuration
    batch_size: int = 10
    max_text_length: int = 10000
    min_text_length: int = 50
    
    # Language Detection
    supported_languages: List[str] = ["en"]
    
    # Entity Extraction
    extract_entities: bool = True
    extract_keywords: bool = True
    
    # Celery Configuration
    celery_task_timeout: int = 300  # 5 minutes
    celery_max_retries: int = 3
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_prefix = ""