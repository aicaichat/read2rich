#!/usr/bin/env python3
"""
开发环境启动脚本
设置环境变量并启动 FastAPI 服务器
"""

import os
import sys
import uvicorn
from pathlib import Path

# 设置环境变量
os.environ.update({
    # Database
    "DATABASE_URL": "sqlite:///./deepneed_dev.db",
    
    # Redis (可选)
    "REDIS_URL": "redis://localhost:6379/0",
    
    # AI API Keys
    "DEEPSEEK_API_KEY": "sk-dc146c694369404abbc1eb7bac2eb41d",
    "CLAUDE_API_KEY": "dummy-claude-key", 
    "OPENAI_API_KEY": "dummy-openai-key",
    
    # JWT
    "JWT_SECRET": "dev-secret-key-change-in-production",
    "JWT_ALGORITHM": "HS256",
    "JWT_EXPIRE_HOURS": "24",
    
    # CORS
    "ALLOWED_ORIGINS": "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000",
    
    # Environment
    "ENVIRONMENT": "development",
    "DEBUG": "true",
    
    # Domain
    "DOMAIN": "localhost",
    "FRONTEND_URL": "http://localhost:5175",
    "BACKEND_URL": "http://localhost:8000",
    
    # AI Models
    "DEEPSEEK_MODEL": "deepseek-chat",
    "CLAUDE_MODEL": "claude-3-sonnet-20240229", 
    "OPENAI_MODEL": "gpt-4",
    "EMBEDDING_MODEL": "text-embedding-ada-002"
})

# 添加当前目录到 Python 路径
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

if __name__ == "__main__":
    print("🚀 Starting DeepNeed API Server (Development Mode)")
    print("🔑 DeepSeek API Key: sk-dc146c694369404a...") 
    print("🌐 Frontend: http://localhost:5175")
    print("📊 API Docs: http://localhost:8000/docs")
    print("🔗 Health Check: http://localhost:8000/health")
    print("-" * 50)
    
    try:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            reload_dirs=["app"],
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1) 