from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # 数据库配置
    DATABASE_URL: str = "sqlite:///./deepneed_dev.db"
    
    # JWT 配置
    JWT_SECRET: str = "dev-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 24
    
    # CORS 配置
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000"
    
    # 环境配置
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # 域名配置
    DOMAIN: str = "localhost"
    FRONTEND_URL: str = "http://localhost:5175"
    BACKEND_URL: str = "http://localhost:8000"
    
    # AI API Keys
    DEEPSEEK_API_KEY: str = "sk-dc146c694369404abbc1eb7bac2eb41d"
    CLAUDE_API_KEY: str = "dummy-claude-key"
    OPENAI_API_KEY: str = "dummy-openai-key"
    
    # AI Models
    DEEPSEEK_MODEL: str = "deepseek-chat"
    CLAUDE_MODEL: str = "claude-3-sonnet-20240229"
    OPENAI_MODEL: str = "gpt-4"
    EMBEDDING_MODEL: str = "text-embedding-ada-002"
    
    # OAuth 配置
    # GitHub OAuth
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GITHUB_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/github/callback"
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"
    
    class Config:
        env_file = ".env"

settings = Settings() 