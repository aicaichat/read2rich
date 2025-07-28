from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from contextlib import asynccontextmanager

from .db.database import engine, Base
from .db import models
from .routers import auth, sessions, prompts, generation
from .core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时创建表
    Base.metadata.create_all(bind=engine)
    yield
    # 关闭时清理资源
    pass

app = FastAPI(
    title="DeepNeed API",
    description="AI-powered requirement specification and code generation platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 路由注册
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(sessions.router, prefix="/api/v1/sessions", tags=["sessions"])
app.include_router(prompts.router, prefix="/api/v1/prompts", tags=["prompts"])
app.include_router(generation.router, prefix="/api/v1/generation", tags=["generation"])

@app.get("/")
async def root():
    return {"message": "DeepNeed API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2025-01-24T10:00:00Z"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 