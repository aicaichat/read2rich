#!/usr/bin/env python3
"""
DeepNeed AI 后端服务 - 简化启动版本
解决macOS系统包管理问题
"""

import sys
import subprocess
import os

def install_with_break_system_packages():
    """使用break-system-packages安装依赖"""
    print("📦 安装后端依赖（使用系统包管理绕过）...")
    
    packages = [
        'fastapi', 'uvicorn[standard]', 'sqlalchemy', 
        'python-jose[cryptography]', 'passlib[bcrypt]', 
        'httpx', 'pydantic', 'email-validator', 'python-multipart'
    ]
    
    try:
        for package in packages:
            print(f"  安装 {package}...")
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", package, 
                "--break-system-packages", "--quiet"
            ])
        print("✅ 依赖安装成功")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ 安装失败: {e}")
        return False

def create_minimal_backend():
    """创建最小化后端服务"""
    print("⚡ 创建最小化后端服务...")
    
    backend_code = '''#!/usr/bin/env python3
"""
DeepNeed AI 最小化后端服务
"""

import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any, Optional
import httpx
import asyncio

# 创建FastAPI应用
app = FastAPI(
    title="DeepNeed AI Backend",
    description="AI需求分析和文档生成平台",
    version="1.0.0"
)

# CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 内存存储
sessions = {}
messages = {}
documents = {}

# 配置
CLAUDE_API_KEY = "your-claude-api-key-here"

# AI服务
class SimpleAIService:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def call_claude_api(self, messages: List[Dict], max_tokens: int = 1000) -> str:
        try:
            request_data = {
                "model": "claude-3-haiku-20240307",
                "max_tokens": max_tokens,
                "temperature": 0.7,
                "messages": messages
            }
            
            response = await self.client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "Content-Type": "application/json",
                    "anthropic-version": "2023-06-01",
                    "Authorization": f"Bearer {CLAUDE_API_KEY}"
                },
                json=request_data
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("content", [])
                if content:
                    return content[0].get("text", "API响应格式错误")
            
            return f"AI服务暂时不可用 (状态码: {response.status_code})"
            
        except Exception as e:
            return f"AI服务错误: {str(e)}"

ai_service = SimpleAIService()

# 数据模型
class CreateSessionRequest(BaseModel):
    initial_idea: Optional[str] = None

class SendMessageRequest(BaseModel):
    content: str

class GenerateDocsRequest(BaseModel):
    session_id: str

# API路由
@app.get("/")
async def root():
    return {
        "service": "DeepNeed AI Backend",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "api_version": "1.0.0"
    }

@app.post("/api/chat/sessions")
async def create_session(request: CreateSessionRequest):
    session_id = f"session-{len(sessions)+1}-{int(datetime.now().timestamp()*1000)}"
    
    session = {
        "id": session_id,
        "title": f"对话 - {datetime.now().strftime('%m-%d %H:%M')}",
        "initial_idea": request.initial_idea,
        "created_at": datetime.now().isoformat(),
        "messages": []
    }
    
    sessions[session_id] = session
    
    # 添加欢迎消息
    if request.initial_idea:
        welcome_msg = {
            "id": f"msg-{len(messages)+1}",
            "role": "assistant",
            "content": f"""您好！我是DeepNeed AI助手。

我看到您的项目想法是：{request.initial_idea}

为了更好地帮助您，请告诉我：
1. 这个项目的目标用户是谁？
2. 您希望实现哪些核心功能？
3. 有什么特殊的技术要求吗？

我会根据您的回答生成专业的项目文档。""",
            "timestamp": datetime.now().isoformat()
        }
        
        messages[welcome_msg["id"]] = welcome_msg
        session["messages"].append(welcome_msg)
    
    return session

@app.get("/api/chat/sessions")
async def get_sessions():
    return list(sessions.values())

@app.get("/api/chat/sessions/{session_id}")
async def get_session(session_id: str):
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="会话不存在")
    
    # 获取会话消息
    session_messages = [
        msg for msg in messages.values() 
        if any(msg["id"] in session["messages"] for session in sessions.values())
    ]
    session["messages"] = session_messages
    
    return session

@app.post("/api/chat/sessions/{session_id}/messages")
async def send_message(session_id: str, request: SendMessageRequest):
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="会话不存在")
    
    # 用户消息
    user_msg = {
        "id": f"msg-{len(messages)+1}",
        "role": "user",
        "content": request.content,
        "timestamp": datetime.now().isoformat()
    }
    messages[user_msg["id"]] = user_msg
    
    # AI回复
    conversation = [
        {"role": "system", "content": "你是DeepNeed AI，专业的产品需求分析师。帮助用户完善项目需求。"},
        {"role": "user", "content": request.content}
    ]
    
    ai_response = await ai_service.call_claude_api(conversation)
    
    ai_msg = {
        "id": f"msg-{len(messages)+1}",
        "role": "assistant", 
        "content": ai_response,
        "timestamp": datetime.now().isoformat()
    }
    messages[ai_msg["id"]] = ai_msg
    
    return {
        "message": ai_msg,
        "session": session
    }

@app.post("/api/documents/generate")
async def generate_documents(request: GenerateDocsRequest):
    session = sessions.get(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="会话不存在")
    
    project_name = session.get("title", "未命名项目")
    initial_idea = session.get("initial_idea", "无描述")
    
    # 生成四种文档
    docs = {}
    doc_types = {
        "prd": "产品需求文档",
        "technical": "技术架构文档", 
        "design": "设计文档",
        "project_management": "项目管理文档"
    }
    
    for doc_type, doc_name in doc_types.items():
        prompt = f"""请为项目"{project_name}"生成专业的{doc_name}。

项目描述：{initial_idea}

请生成详细、专业、可执行的{doc_name}，使用Markdown格式。"""

        content = await ai_service.call_claude_api([
            {"role": "system", "content": f"你是资深的{doc_name}专家。"},
            {"role": "user", "content": prompt}
        ], max_tokens=2000)
        
        doc = {
            "id": f"doc-{len(documents)+1}",
            "title": f"{project_name} - {doc_name}",
            "type": doc_type,
            "content": content,
            "created_at": datetime.now().isoformat()
        }
        
        documents[doc["id"]] = doc
        docs[doc_type] = doc
    
    return {
        "session_id": request.session_id,
        "documents": docs,
        "generated_at": datetime.now().isoformat()
    }

@app.get("/api/documents")
async def get_documents():
    return list(documents.values())

if __name__ == "__main__":
    print("🚀 启动DeepNeed AI后端服务...")
    print("📡 服务地址: http://localhost:8000") 
    print("📚 API文档: http://localhost:8000/docs")
    print()
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
'''
    
    with open("minimal_backend.py", "w", encoding="utf-8") as f:
        f.write(backend_code)
    
    print("✅ 最小化后端服务创建完成")

def main():
    print("=" * 50)
    print("🎯 DeepNeed AI 简化后端启动器")
    print("=" * 50)
    
    # 检查是否已有依赖
    try:
        import fastapi
        import uvicorn
        print("✅ 依赖已安装")
    except ImportError:
        if not install_with_break_system_packages():
            print("❌ 无法安装依赖，请手动安装")
            return
    
    # 创建后端服务
    create_minimal_backend()
    
    print("🚀 启动后端服务...")
    print("📡 服务地址: http://localhost:8000")
    print("📚 API文档: http://localhost:8000/docs") 
    print("按 Ctrl+C 停止服务")
    print()
    
    # 启动服务
    os.system("python3 minimal_backend.py")

if __name__ == "__main__":
    main() 