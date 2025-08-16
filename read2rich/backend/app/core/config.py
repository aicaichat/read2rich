from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./read2rich.db"
    
    # JWT
    JWT_SECRET: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 24
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    # AI API Keys
    OPENAI_API_KEY: str = ""
    DEEPSEEK_API_KEY: str = ""
    CLAUDE_API_KEY: str = ""
    
    # OAuth
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    
    # External Services (简化开发环境)
    REDIS_URL: str = "redis://localhost:6379"
    KAFKA_BROKERS: str = "localhost:9092"
    QDRANT_URL: str = "http://localhost:6333"
    
    class Config:
        env_file = ".env"

settings = Settings()