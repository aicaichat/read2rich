from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # 数据库配置
    DATABASE_URL: str = "sqlite:///./deepneed_dev.db"
    REDIS_URL: str = "redis://localhost:6379"
    
    # API Keys
    DEEPSEEK_API_KEY: str = ""
    CLAUDE_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    
    # JWT 配置
    JWT_SECRET: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 24
    
    # 应用配置
    DOMAIN: str = "deepneed.com.cn"
    FRONTEND_URL: str = "https://deepneed.com.cn"
    BACKEND_URL: str = "https://api.deepneed.com.cn"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://localhost:5175,https://deepneed.com.cn"
    
    # AI 模型配置
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"
    CLAUDE_MODEL: str = "claude-3-sonnet-20240229"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-ada-002"
    
    # 环境配置
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "info"
    
    class Config:
        env_file = ".env"

settings = Settings() 