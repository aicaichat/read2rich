#!/usr/bin/env python3
"""
DeepNeed AI 完整后端服务快速启动脚本
自动检查依赖并启动完整的FastAPI后端服务
"""

import sys
import subprocess
import os
import asyncio
from pathlib import Path

def check_and_install_dependencies():
    """检查并安装后端依赖"""
    print("🔍 检查后端依赖...")
    
    required_packages = [
        'fastapi==0.104.1',
        'uvicorn[standard]==0.24.0',
        'sqlalchemy==2.0.23', 
        'python-jose[cryptography]==3.3.0',
        'passlib[bcrypt]==1.7.4',
        'httpx==0.25.2',
        'pydantic==2.5.0',
        'email-validator==2.1.0',
        'python-multipart==0.0.6'
    ]
    
    try:
        # 检查关键包
        import fastapi
        import uvicorn
        import sqlalchemy
        import httpx
        from jose import jwt
        import passlib
        print("✅ 后端依赖已安装")
        return True
    except ImportError as e:
        print(f"⚠️ 缺少依赖: {e}")
        print("📦 正在安装后端依赖...")
        
        try:
            for package in required_packages:
                print(f"  安装 {package}...")
                subprocess.check_call([
                    sys.executable, "-m", "pip", "install", package, "--user", "--quiet"
                ])
            print("✅ 后端依赖安装完成")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ 依赖安装失败: {e}")
            return False

def create_backend_structure():
    """创建后端目录结构"""
    print("📁 创建后端目录结构...")
    
    backend_dir = Path("backend")
    backend_dir.mkdir(exist_ok=True)
    
    # 创建必要的目录
    dirs_to_create = [
        "backend/app",
        "backend/app/routers", 
        "backend/data",
        "backend/logs"
    ]
    
    for dir_path in dirs_to_create:
        Path(dir_path).mkdir(exist_ok=True)
    
    print("✅ 后端目录结构创建完成")

def create_simple_backend():
    """创建简化的后端服务"""
    print("⚡ 创建简化后端服务...")
    
    backend_code = '''"""
DeepNeed AI 完整后端服务
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import uvicorn
import httpx
import json
import os
from jose import JWTError, jwt
from passlib.context import CryptContext

# 应用配置
class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "deepneed-secret-key-2025")
    CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY", "your-claude-api-key-here")
    DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "sk-dc146c694369404abde7e6b734a635f2")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

config = Config()

# 创建FastAPI应用
app = FastAPI(
    title="DeepNeed AI API",
    description="完整的AI需求分析和文档生成平台",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 认证
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 内存存储（生产环境应使用数据库）
users_db = {
    "admin@deepneed.ai": {
        "id": 1,
        "email": "admin@deepneed.ai",
        "username": "admin",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # admin123
        "full_name": "DeepNeed Admin",
        "is_active": True
    }
}

sessions_db = {}
messages_db = {}
documents_db = {}

# AI服务类
class AIService:
    def __init__(self):
        self.claude_api_key = config.CLAUDE_API_KEY
        self.deepseek_api_key = config.DEEPSEEK_API_KEY
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def call_claude_api(self, messages: List[Dict[str, str]], max_tokens: int = 1500) -> str:
        if not self.claude_api_key:
            raise Exception("Claude API密钥未配置")
        
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
                    "Authorization": f"Bearer {self.claude_api_key}"
                },
                json=request_data
            )
            
            if response.status_code != 200:
                raise Exception(f"Claude API错误: {response.status_code}")
            
            result = response.json()
            content = result.get("content", [])
            if content and len(content) > 0:
                return content[0].get("text", "")
            else:
                raise Exception("Claude API返回格式错误")
                
        except Exception as e:
            print(f"❌ Claude API调用失败: {e}")
            raise e
    
    async def chat_completion(self, messages: List[Dict[str, str]], max_tokens: int = 1000) -> str:
        try:
            return await self.call_claude_api(messages, max_tokens)
        except Exception as e:
            return f"抱歉，AI服务暂时不可用。错误：{str(e)}"

# 全局AI服务实例
ai_service = AIService()

# 认证功能
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, config.SECRET_KEY, algorithm=config.ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="无效的令牌")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="无效的令牌")

def get_current_user(email: str = Depends(verify_token)):
    user = users_db.get(email)
    if user is None:
        raise HTTPException(status_code=401, detail="用户不存在")
    return user

# 数据模型
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    max_tokens: Optional[int] = 1000

class CreateSessionRequest(BaseModel):
    initial_idea: Optional[str] = None

class SendMessageRequest(BaseModel):
    content: str

class GenerateDocumentsRequest(BaseModel):
    session_id: str

# API路由
@app.get("/")
async def root():
    return {
        "service": "DeepNeed AI API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "components": {
            "api": "ok",
            "ai_service": "ok"
        },
        "version": "1.0.0"
    }

@app.post("/api/auth/login")
async def login(login_data: LoginRequest):
    user = users_db.get(login_data.email)
    if not user or not pwd_context.verify(login_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="邮箱或密码错误")
    
    access_token = create_access_token(data={"sub": user["email"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "full_name": user["full_name"]
        }
    }

@app.get("/api/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "username": current_user["username"],
        "full_name": current_user["full_name"],
        "is_active": current_user["is_active"]
    }

@app.post("/api/chat/sessions")
async def create_session(
    session_data: CreateSessionRequest,
    current_user: dict = Depends(get_current_user)
):
    session_id = f"session-{current_user['id']}-{int(datetime.now().timestamp() * 1000)}"
    
    session = {
        "id": len(sessions_db) + 1,
        "session_id": session_id,
        "user_id": current_user["id"],
        "title": f"对话 - {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "initial_idea": session_data.initial_idea,
        "status": "active",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "messages": []
    }
    
    sessions_db[session_id] = session
    
    # 添加欢迎消息
    if session_data.initial_idea:
        welcome_message = {
            "id": len(messages_db) + 1,
            "session_id": session_id,
            "role": "assistant",
            "content": f"""您好！我是DeepNeed AI助手，很高兴为您服务。

我看到您的项目想法是：{session_data.initial_idea}

为了更好地帮助您完善这个项目，我想了解以下几个方面：

1. **目标用户**：这个项目主要面向哪些用户群体？
2. **核心功能**：您希望实现哪些主要功能？
3. **技术偏好**：您有特定的技术栈要求吗？
4. **时间计划**：项目的预期完成时间是多久？

请随意分享您的想法，我会根据您的回答生成专业的项目文档。""",
            "created_at": datetime.now().isoformat()
        }
        
        messages_db[welcome_message["id"]] = welcome_message
        session["messages"].append(welcome_message)
    
    return session

@app.get("/api/chat/sessions")
async def get_user_sessions(current_user: dict = Depends(get_current_user)):
    user_sessions = [
        session for session in sessions_db.values()
        if session["user_id"] == current_user["id"]
    ]
    return sorted(user_sessions, key=lambda x: x["updated_at"], reverse=True)

@app.get("/api/chat/sessions/{session_id}")
async def get_session(session_id: str, current_user: dict = Depends(get_current_user)):
    session = sessions_db.get(session_id)
    if not session or session["user_id"] != current_user["id"]:
        raise HTTPException(status_code=404, detail="会话不存在")
    
    # 获取会话的所有消息
    session_messages = [
        msg for msg in messages_db.values()
        if msg["session_id"] == session_id
    ]
    session["messages"] = sorted(session_messages, key=lambda x: x["created_at"])
    
    return session

@app.post("/api/chat/sessions/{session_id}/messages")
async def send_message(
    session_id: str,
    message_data: SendMessageRequest,
    current_user: dict = Depends(get_current_user)
):
    session = sessions_db.get(session_id)
    if not session or session["user_id"] != current_user["id"]:
        raise HTTPException(status_code=404, detail="会话不存在")
    
    # 创建用户消息
    user_message = {
        "id": len(messages_db) + 1,
        "session_id": session_id,
        "role": "user",
        "content": message_data.content,
        "created_at": datetime.now().isoformat()
    }
    
    messages_db[user_message["id"]] = user_message
    
    # 获取对话历史
    conversation_messages = [
        msg for msg in messages_db.values()
        if msg["session_id"] == session_id
    ]
    
    # 构造AI对话上下文
    messages_for_ai = [
        {
            "role": "system",
            "content": "你是DeepNeed AI，专业的产品需求分析师。请与用户进行深入的需求访谈，了解项目想法，引导用户明确项目需求。"
        }
    ]
    
    for msg in sorted(conversation_messages, key=lambda x: x["created_at"]):
        if msg["role"] in ["user", "assistant"]:
            messages_for_ai.append({
                "role": msg["role"],
                "content": msg["content"]
            })
    
    # 生成AI回复
    try:
        ai_response = await ai_service.chat_completion(messages_for_ai, max_tokens=1000)
        
        ai_message = {
            "id": len(messages_db) + 1,
            "session_id": session_id,
            "role": "assistant",
            "content": ai_response,
            "created_at": datetime.now().isoformat()
        }
        
        messages_db[ai_message["id"]] = ai_message
        
        # 更新会话时间
        session["updated_at"] = datetime.now().isoformat()
        
        return {
            "message": ai_message,
            "session": session
        }
        
    except Exception as e:
        error_message = {
            "id": len(messages_db) + 1,
            "session_id": session_id,
            "role": "assistant",
            "content": f"抱歉，AI服务暂时不可用。请稍后重试。错误：{str(e)}",
            "created_at": datetime.now().isoformat()
        }
        
        messages_db[error_message["id"]] = error_message
        session["updated_at"] = datetime.now().isoformat()
        
        return {
            "message": error_message,
            "session": session
        }

@app.post("/api/documents/generate")
async def generate_documents(
    request: GenerateDocumentsRequest,
    current_user: dict = Depends(get_current_user)
):
    session = sessions_db.get(request.session_id)
    if not session or session["user_id"] != current_user["id"]:
        raise HTTPException(status_code=404, detail="会话不存在")
    
    # 获取对话历史
    conversation_messages = [
        msg for msg in messages_db.values()
        if msg["session_id"] == request.session_id
    ]
    
    if not conversation_messages:
        raise HTTPException(status_code=400, detail="会话中没有足够的信息生成文档")
    
    # 构造项目信息
    project_info = {
        "name": session["title"] or session["initial_idea"] or "未命名项目",
        "description": session["initial_idea"] or "无描述",
        "conversation_summary": "\\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation_messages[-5:]])
    }
    
    # 生成文档内容
    documents = {}
    
    doc_types = {
        "prd": "产品需求文档(PRD)",
        "technical": "技术架构文档", 
        "design": "设计文档",
        "project_management": "项目管理文档"
    }
    
    for doc_type, doc_name in doc_types.items():
        try:
            # 构造生成提示
            messages_for_ai = [
                {
                    "role": "system",
                    "content": f"你是一位资深的{doc_name}专家。请根据项目信息生成详细的{doc_name}。"
                },
                {
                    "role": "user",
                    "content": f"""请为以下项目生成完整的{doc_name}：

项目名称：{project_info['name']}
项目描述：{project_info['description']}

对话摘要：
{project_info['conversation_summary']}

请生成专业、详细、可执行的{doc_name}，使用Markdown格式。"""
                }
            ]
            
            content = await ai_service.chat_completion(messages_for_ai, max_tokens=2000)
            
            document = {
                "id": len(documents_db) + 1,
                "title": f"{project_info['name']} - {doc_name}",
                "doc_type": doc_type,
                "content": content,
                "format": "markdown",
                "status": "final",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            documents_db[document["id"]] = document
            documents[doc_type] = document
            
        except Exception as e:
            # 创建默认文档
            default_content = f"# {doc_name}\\n\\n项目名称：{project_info['name']}\\n\\n**注意：由于AI服务暂时不可用，这是一个默认模板。请手动完善内容。**"
            
            document = {
                "id": len(documents_db) + 1,
                "title": f"{project_info['name']} - {doc_name}（模板）",
                "doc_type": doc_type,
                "content": default_content,
                "format": "markdown",
                "status": "draft",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            documents_db[document["id"]] = document
            documents[doc_type] = document
    
    return {
        "session_id": request.session_id,
        "documents": documents,
        "generation_time": datetime.now().isoformat(),
        "total_documents": len(documents)
    }

@app.get("/api/documents")
async def get_user_documents(current_user: dict = Depends(get_current_user)):
    # 返回所有文档（在实际应用中应该根据用户ID过滤）
    user_documents = list(documents_db.values())
    return sorted(user_documents, key=lambda x: x["created_at"], reverse=True)

if __name__ == "__main__":
    print("🚀 启动DeepNeed AI完整后端服务...")
    print("📡 服务地址: http://localhost:8000")
    print("📚 API文档: http://localhost:8000/docs")
    print("🔑 默认账户: admin@deepneed.ai / admin123")
    print()
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
'''
    
    # 写入后端服务文件
    with open("backend/complete_backend.py", "w", encoding="utf-8") as f:
        f.write(backend_code)
    
    print("✅ 简化后端服务创建完成")

def start_backend_service():
    """启动后端服务"""
    print("🚀 启动完整后端服务...")
    
    try:
        # 切换到backend目录
        os.chdir("backend")
        
        # 启动服务
        subprocess.run([sys.executable, "complete_backend.py"])
        
    except KeyboardInterrupt:
        print("\\n🛑 服务已停止")
    except Exception as e:
        print(f"❌ 启动失败: {e}")

def main():
    """主函数"""
    print("=" * 60)
    print("🎯 DeepNeed AI 完整后端服务启动器")
    print("=" * 60)
    print()
    
    # 检查依赖
    if not check_and_install_dependencies():
        print("❌ 依赖检查失败，请手动安装依赖后重试")
        return
    
    # 创建后端结构
    create_backend_structure()
    
    # 创建后端服务
    create_simple_backend()
    
    print("✅ 所有准备工作完成")
    print()
    print("🚀 正在启动完整后端服务...")
    print("📡 服务将在 http://localhost:8000 启动")
    print("📚 API文档: http://localhost:8000/docs")
    print("🔑 默认管理员账户: admin@deepneed.ai / admin123")
    print()
    print("按 Ctrl+C 停止服务")
    print("=" * 60)
    
    # 启动后端服务
    start_backend_service()

if __name__ == "__main__":
    main() 