"""
DeepNeed AI 后端服务
完整的API服务，支持用户管理、AI对话、文档生成等功能
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import asyncio
from datetime import datetime
import os
from pathlib import Path

# 导入应用模块
from app.database import init_database, get_db
from app.auth import AuthManager
from app.ai_service import AIService
from app.models import User, Session, Message, Document
from app.routers import auth, chat, documents, users, ai

# 配置
class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "deepneed-secret-key-2025")
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./deepneed.db")
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
    CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY", "your-claude-api-key-here")
    DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "sk-dc146c694369404abde7e6b734a635f2")
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "8000"))
    DEBUG = os.getenv("DEBUG", "true").lower() == "true"

config = Config()

# 应用生命周期管理
@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用启动和关闭时的生命周期管理"""
    print("🚀 启动DeepNeed AI后端服务...")
    
    # 初始化数据库
    await init_database()
    print("✅ 数据库初始化完成")
    
    # 初始化AI服务
    ai_service = AIService(
        claude_api_key=config.CLAUDE_API_KEY,
        deepseek_api_key=config.DEEPSEEK_API_KEY
    )
    app.state.ai_service = ai_service
    print("✅ AI服务初始化完成")
    
    # 初始化认证管理器
    auth_manager = AuthManager(secret_key=config.SECRET_KEY)
    app.state.auth_manager = auth_manager
    print("✅ 认证服务初始化完成")
    
    print(f"📡 服务地址: http://{config.HOST}:{config.PORT}")
    print("🔗 API文档: http://localhost:8000/docs")
    print("📝 交互式文档: http://localhost:8000/redoc")
    
    yield
    
    print("🛑 正在关闭DeepNeed AI后端服务...")

# 创建FastAPI应用
app = FastAPI(
    title="DeepNeed AI API",
    description="完整的AI需求分析和文档生成平台",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 安全认证
security = HTTPBearer()

# 全局异常处理
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.detail,
                "type": "http_error",
                "code": exc.status_code
            },
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "message": "内部服务器错误",
                "type": "server_error",
                "code": 500,
                "detail": str(exc) if config.DEBUG else None
            },
            "timestamp": datetime.now().isoformat()
        }
    )

# 根路径
@app.get("/")
async def root():
    """API根端点"""
    return {
        "service": "DeepNeed AI API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "docs": "/docs",
        "health": "/health"
    }

# 健康检查
@app.get("/health")
async def health_check():
    """系统健康检查"""
    try:
        # 检查数据库连接
        db_status = "ok"
        try:
            from app.database import engine
            db_status = "ok" if engine else "error"
        except Exception:
            db_status = "error"
        
        # 检查AI服务
        ai_status = "ok"
        try:
            ai_service = app.state.ai_service
            ai_status = "ok" if ai_service else "error"
        except Exception:
            ai_status = "error"
        
        return {
            "status": "healthy" if db_status == "ok" and ai_status == "ok" else "degraded",
            "timestamp": datetime.now().isoformat(),
            "components": {
                "database": db_status,
                "ai_service": ai_status,
                "auth": "ok"
            },
            "uptime": "running",
            "version": "1.0.0"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"服务不健康: {str(e)}")

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(users.router, prefix="/api/users", tags=["用户管理"])
app.include_router(chat.router, prefix="/api/chat", tags=["对话"])
app.include_router(documents.router, prefix="/api/documents", tags=["文档管理"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI服务"])

# 开发模式启动
if __name__ == "__main__":
    print("🔧 开发模式启动...")
    uvicorn.run(
        "main:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.DEBUG,
        log_level="info" if not config.DEBUG else "debug"
    ) 