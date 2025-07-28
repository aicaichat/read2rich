#!/usr/bin/env python3
"""
简化的 DeepNeed API 服务器
集成 DeepSeek API 进行真实的对话功能
"""

import os
import json
import sqlite3
import hashlib
import httpx
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt

# 设置环境变量
DEEPSEEK_API_KEY = "sk-dc146c694369404abbc1eb7bac2eb41d"
DEEPSEEK_BASE_URL = "https://api.deepseek.com"
JWT_SECRET = "dev-secret-key"
DATABASE_PATH = "./deepneed_dev.db"

app = FastAPI(title="DeepNeed API", version="1.0.0")

# CORS 设置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Pydantic 模型
class LoginRequest(BaseModel):
    username: str
    password: str

class MessageRequest(BaseModel):
    content: str

class SessionCreate(BaseModel):
    title: str
    initial_idea: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    is_active: bool
    created_at: str

class MessageResponse(BaseModel):
    id: int
    session_id: str
    role: str
    content: str
    created_at: str

class SessionResponse(BaseModel):
    id: str
    title: str
    initial_idea: str
    status: str
    created_at: str

# 工具函数
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(username: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode = {"sub": username, "exp": expire}
    return jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")

def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None

def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    username = verify_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return dict(user)

async def call_deepseek_api(messages: List[Dict]) -> str:
    """调用 DeepSeek API"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{DEEPSEEK_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": messages,
                    "max_tokens": 2000,
                    "temperature": 0.7,
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                print(f"DeepSeek API error: {response.status_code} - {response.text}")
                return "抱歉，AI 服务暂时不可用，请稍后再试。"
                
    except Exception as e:
        print(f"Error calling DeepSeek API: {e}")
        return "抱歉，AI 服务出现问题，请稍后再试。"

# API 路由
@app.get("/")
async def root():
    return {"message": "DeepNeed API is running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.post("/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE username = ?", 
        (request.username,)
    ).fetchone()
    conn.close()
    
    if not user or hash_password(request.password) != user["hashed_password"]:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    token = create_access_token(request.username)
    return TokenResponse(access_token=token, token_type="bearer")

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        username=current_user["username"],
        email=current_user["email"],
        full_name=current_user["full_name"] or current_user["username"],
        is_active=bool(current_user["is_active"]),
        created_at=current_user["created_at"]
    )

@app.post("/sessions", response_model=SessionResponse)
async def create_session(request: SessionCreate, current_user = Depends(get_current_user)):
    import uuid
    session_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()
    
    conn = get_db()
    conn.execute(
        """INSERT INTO sessions (id, user_id, title, initial_idea, status, current_requirements, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (session_id, current_user["id"], request.title, request.initial_idea, "active", "{}", created_at)
    )
    conn.commit()
    conn.close()
    
    return SessionResponse(
        id=session_id,
        title=request.title,
        initial_idea=request.initial_idea,
        status="active",
        created_at=created_at
    )

@app.get("/sessions", response_model=List[SessionResponse])
async def get_user_sessions(current_user = Depends(get_current_user)):
    conn = get_db()
    sessions = conn.execute(
        "SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC",
        (current_user["id"],)
    ).fetchall()
    conn.close()
    
    return [
        SessionResponse(
            id=session["id"],
            title=session["title"],
            initial_idea=session["initial_idea"],
            status=session["status"],
            created_at=session["created_at"]
        )
        for session in sessions
    ]

@app.get("/sessions/{session_id}/messages", response_model=List[MessageResponse])
async def get_session_messages(session_id: str, current_user = Depends(get_current_user)):
    conn = get_db()
    messages = conn.execute(
        """SELECT * FROM messages WHERE session_id = ? 
           ORDER BY created_at ASC""",
        (session_id,)
    ).fetchall()
    conn.close()
    
    return [
        MessageResponse(
            id=message["id"],
            session_id=message["session_id"],
            role=message["role"],
            content=message["content"],
            created_at=message["created_at"]
        )
        for message in messages
    ]

@app.post("/sessions/{session_id}/messages", response_model=MessageResponse)
async def add_message(
    session_id: str, 
    request: MessageRequest, 
    current_user = Depends(get_current_user)
):
    created_at = datetime.utcnow().isoformat()
    
    conn = get_db()
    
    # 添加用户消息
    cursor = conn.execute(
        """INSERT INTO messages (session_id, role, content, message_metadata, created_at)
           VALUES (?, ?, ?, ?, ?)""",
        (session_id, "user", request.content, "{}", created_at)
    )
    user_message_id = cursor.lastrowid
    
    # 获取对话历史
    messages = conn.execute(
        "SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC",
        (session_id,)
    ).fetchall()
    
    # 获取会话的初始想法
    session = conn.execute(
        "SELECT initial_idea FROM sessions WHERE id = ?",
        (session_id,)
    ).fetchone()
    
    conn.commit()
    
    # 构建对话上下文
    conversation = [
        {
            "role": "system",
            "content": f"""你是 DeepNeed 的 AI 助手，专门帮助用户澄清和完善项目需求。

初始想法：{session['initial_idea'] if session else '未知'}

你的任务是：
1. 通过提问帮助用户完善需求细节
2. 了解技术背景、目标用户、功能范围、技术约束等
3. 当信息足够详细时，建议用户生成专业提示词

请用中文回复，语气友好专业。"""
        }
    ]
    
    # 添加历史对话
    for msg in messages:
        conversation.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    
    # 调用 DeepSeek API
    ai_response = await call_deepseek_api(conversation)
    ai_created_at = datetime.utcnow().isoformat()
    
    # 保存 AI 回复
    cursor = conn.execute(
        """INSERT INTO messages (session_id, role, content, message_metadata, created_at)
           VALUES (?, ?, ?, ?, ?)""",
        (session_id, "assistant", ai_response, "{}", ai_created_at)
    )
    ai_message_id = cursor.lastrowid
    
    conn.commit()
    conn.close()
    
    # 返回 AI 回复消息
    return MessageResponse(
        id=ai_message_id,
        session_id=session_id,
        role="assistant",
        content=ai_response,
        created_at=ai_created_at
    )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting DeepNeed API Server")
    print("🔑 DeepSeek API Key configured")
    print("🌐 Frontend: http://localhost:5175")
    print("📊 API Docs: http://localhost:8000/docs")
    print("🔗 Health Check: http://localhost:8000/health")
    print("-" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False) 