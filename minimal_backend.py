#!/usr/bin/env python3
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
import os
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY", "your-claude-api-key-here")

# AI服务
class SimpleAIService:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def call_claude_api(self, messages: List[Dict], max_tokens: int = 1000) -> str:
        # 如果没有有效的API key，返回 mock 回复
        if not CLAUDE_API_KEY or CLAUDE_API_KEY.startswith("your-claude-api-key"):
            return await self.get_mock_response(messages)
            
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
            
            # 如果API调用失败，回退到mock回复
            return await self.get_mock_response(messages)
            
        except Exception as e:
            # 如果出现异常，回退到mock回复
            return await self.get_mock_response(messages)
    
    async def get_mock_response(self, messages: List[Dict]) -> str:
        """生成Mock AI回复"""
        if not messages:
            return "您好！我是 DeepNeed AI 助手，很高兴为您服务！请告诉我您的项目想法。"
        
        user_message = messages[-1].get("content", "").lower()
        
        # 简单的关键词匹配回复
        mock_responses = {
            "目标用户": "很好的问题！请详细描述一下您的目标用户群体，比如他们的年龄、职业、使用场景等。这将帮助我们更好地定义产品需求。",
            "技术栈": "关于技术栈选择，我需要了解更多信息：\n1. 您的团队有哪些技术背景？\n2. 项目的性能要求如何？\n3. 是否有特定的技术偏好？\n请分享这些信息，我会给出专业建议。",
            "功能": "让我们梳理一下核心功能需求：\n1. 主要功能模块有哪些？\n2. 用户的典型使用流程是什么？\n3. 是否需要特殊功能如支付、通知等？\n请详细描述，这样我能帮您完善功能架构。",
            "预算": "关于项目预算，我需要了解：\n1. 大概的预算范围\n2. 开发团队规模\n3. 预期开发周期\n这些信息将帮助我制定合适的技术方案和实施计划。",
            "时间": "项目时间规划很重要，请告诉我：\n1. 期望的上线时间\n2. 是否有关键里程碑\n3. 团队的开发能力\n我会帮您制定合理的开发计划。"
        }
        
        # 根据关键词匹配回复
        for keyword, response in mock_responses.items():
            if keyword in user_message:
                return response
        
        # 默认回复
        return f"谢谢您的分享！基于您提到的内容，我想进一步了解：\n\n1. 这个项目的核心目标是什么？\n2. 主要面向哪些用户群体？\n3. 您希望实现哪些关键功能？\n4. 有什么技术偏好或约束吗？\n\n请详细描述这些方面，我会帮您完善项目需求。\n\n💡 提示：当前使用演示模式，如需完整AI功能，请配置有效的Claude API密钥。"

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
        session["messages"].append(welcome_msg["id"])
    
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

@app.get("/api/chat/sessions/{session_id}/messages")
async def get_session_messages(session_id: str):
    """获取会话的所有消息"""
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="会话不存在")
    
    # 获取该会话的所有消息
    session_messages = [
        msg for msg in messages.values() 
        if msg["id"] in session.get("messages", [])
    ]
    
    # 按时间戳排序
    session_messages.sort(key=lambda x: x["timestamp"])
    
    return session_messages

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
    
    # 将消息ID添加到会话中
    if "messages" not in session:
        session["messages"] = []
    session["messages"].append(user_msg["id"])
    
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
    
    # 将AI消息ID也添加到会话中
    session["messages"].append(ai_msg["id"])
    
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
    print("📡 服务地址: http://localhost:8001") 
    print("📚 API文档: http://localhost:8001/docs")
    print()
    
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
