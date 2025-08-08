"""Configuration settings for the embedding service."""

from pydantic_settings import BaseSettings
from typing import Optional, Literal


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Kafka Configuration
    kafka_bootstrap_servers: str = "localhost:9092"
    kafka_topic_clean_items: str = "clean_opportunities"
    kafka_consumer_group: str = "embedding_service"
    
    # Vector Store Configuration
    vector_store_type: Literal["qdrant", "pgvector"] = "qdrant"
    
    # Qdrant Configuration
    qdrant_url: str = "http://localhost:6333"
    qdrant_collection_name: str = "opportunities"
    qdrant_vector_size: int = 1536  # OpenAI text-embedding-3-small
    
    # PostgreSQL Configuration (for pgvector)
    database_url: str = "postgresql://deepneed:deepneed@localhost:5433/deepneed_opf"
    
    # Embedding Configuration
    embedding_provider: Literal["openai", "deepseek", "local"] = "deepseek"
    
    # OpenAI Configuration
    openai_api_key: Optional[str] = None
    openai_model: str = "text-embedding-3-small"
    openai_batch_size: int = 100
    openai_max_retries: int = 3
    openai_timeout: int = 60
    
    # DeepSeek Configuration
    deepseek_api_key: Optional[str] = None
    deepseek_model: str = "text-embedding-ada-002"  # DeepSeek compatible model
    deepseek_batch_size: int = 20
    deepseek_max_retries: int = 3
    deepseek_timeout: int = 30
    deepseek_requests_per_minute: int = 60
    
    # Local Model Configuration
    local_model_name: str = "all-MiniLM-L6-v2"
    local_batch_size: int = 32
    device: str = "cuda"  # cuda, cpu, or auto
    
    # Processing Configuration
    batch_size: int = 50
    max_text_length: int = 8000  # Max tokens for embedding
    concurrent_batches: int = 3
    
    # Rate Limiting
    requests_per_minute: int = 3000  # OpenAI tier limit
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_prefix = ""