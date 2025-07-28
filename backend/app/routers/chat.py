"""
聊天对话相关API路由
会话管理、消息处理、AI对话等
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any
import uuid

from app.database import get_db, User, ChatSession, Message, create_chat_session, get_chat_session
from app.auth import get_current_user
from app.ai_service import get_ai_service

router = APIRouter()

# 请求模型
class CreateSessionRequest(BaseModel):
    initial_idea: Optional[str] = None
    project_type: Optional[str] = None

class SendMessageRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None

class UpdateSessionRequest(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

# 响应模型
class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    metadata: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True

class SessionResponse(BaseModel):
    id: int
    session_id: str
    title: Optional[str]
    initial_idea: Optional[str]
    project_type: Optional[str]
    status: str
    metadata: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    message: MessageResponse
    session: SessionResponse

@router.post("/sessions", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: CreateSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建新的聊天会话"""
    
    # 生成唯一的session_id
    session_id = f"session-{current_user.id}-{int(datetime.now().timestamp() * 1000)}"
    
    # 创建会话
    new_session = create_chat_session(
        db=db,
        user_id=current_user.id,
        session_id=session_id,
        initial_idea=session_data.initial_idea
    )
    
    # 如果有初始想法，创建初始消息
    if session_data.initial_idea:
        # 用户消息
        user_message = Message(
            session_id=new_session.id,
            role="user",
            content=session_data.initial_idea
        )
        db.add(user_message)
        
        # 系统欢迎消息
        welcome_content = f"""您好！我是DeepNeed AI助手，很高兴为您服务。

我看到您的项目想法是：{session_data.initial_idea}

为了更好地帮助您完善这个项目，我想了解以下几个方面：

1. **目标用户**：这个项目主要面向哪些用户群体？
2. **核心功能**：您希望实现哪些主要功能？
3. **技术偏好**：您有特定的技术栈要求吗？
4. **时间计划**：项目的预期完成时间是多久？
5. **资源投入**：团队规模和预算范围大概是怎样的？

请随意分享您的想法，我会根据您的回答逐步完善项目需求，最终生成专业的PRD、技术文档、设计文档和项目管理文档。"""

        ai_message = Message(
            session_id=new_session.id,
            role="assistant",
            content=welcome_content,
            metadata={"type": "welcome", "generated_at": datetime.now().isoformat()}
        )
        db.add(ai_message)
        
        db.commit()
        db.refresh(new_session)
    
    # 获取完整的会话信息
    session_with_messages = db.query(ChatSession).filter(
        ChatSession.id == new_session.id
    ).first()
    
    return SessionResponse.from_orm(session_with_messages)

@router.get("/sessions", response_model=List[SessionResponse])
async def get_user_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 20,
    offset: int = 0
):
    """获取用户的聊天会话列表"""
    
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.updated_at.desc()).offset(offset).limit(limit).all()
    
    return [SessionResponse.from_orm(session) for session in sessions]

@router.get("/sessions/{session_id}", response_model=SessionResponse)
async def get_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取特定的聊天会话"""
    
    session = db.query(ChatSession).filter(
        ChatSession.session_id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会话不存在"
        )
    
    return SessionResponse.from_orm(session)

@router.post("/sessions/{session_id}/messages", response_model=ChatResponse)
async def send_message(
    session_id: str,
    message_data: SendMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """发送消息到聊天会话"""
    
    # 获取会话
    session = db.query(ChatSession).filter(
        ChatSession.session_id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会话不存在"
        )
    
    # 创建用户消息
    user_message = Message(
        session_id=session.id,
        role="user",
        content=message_data.content,
        metadata=message_data.metadata
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    
    # 生成AI回复
    try:
        ai_service = get_ai_service()
        
        # 获取对话历史
        conversation_messages = db.query(Message).filter(
            Message.session_id == session.id
        ).order_by(Message.created_at.asc()).all()
        
        # 构造AI对话上下文
        messages_for_ai = []
        
        # 添加系统提示
        system_prompt = """你是DeepNeed AI，一位专业的产品需求分析师和项目顾问。你的任务是：

1. 与用户进行深入的需求访谈，了解他们的项目想法
2. 逐步引导用户明确项目的核心需求和目标
3. 通过专业的提问，帮助用户完善项目细节
4. 为用户提供有价值的建议和洞察

请保持专业、友好的语调，提出有针对性的问题，帮助用户梳理项目需求。
不要急于给出解决方案，而是要充分了解用户的真实需求。"""

        messages_for_ai.append({"role": "system", "content": system_prompt})
        
        # 添加对话历史
        for msg in conversation_messages:
            if msg.role in ["user", "assistant"]:
                messages_for_ai.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        # 调用AI生成回复
        ai_response = await ai_service.chat_completion(messages_for_ai, max_tokens=1000)
        
        # 创建AI消息
        ai_message = Message(
            session_id=session.id,
            role="assistant",
            content=ai_response,
            metadata={
                "generated_at": datetime.now().isoformat(),
                "model": "ai_assistant"
            }
        )
        db.add(ai_message)
        
        # 更新会话时间
        session.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(ai_message)
        db.refresh(session)
        
        return ChatResponse(
            message=MessageResponse.from_orm(ai_message),
            session=SessionResponse.from_orm(session)
        )
        
    except Exception as e:
        print(f"❌ AI回复生成失败: {e}")
        
        # 创建错误回复
        error_message = Message(
            session_id=session.id,
            role="assistant",
            content=f"抱歉，AI服务暂时不可用。错误信息：{str(e)}\n\n请稍后重试，或者继续描述您的项目需求，我会尽快为您提供帮助。",
            metadata={
                "error": True,
                "error_message": str(e),
                "generated_at": datetime.now().isoformat()
            }
        )
        db.add(error_message)
        session.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(error_message)
        db.refresh(session)
        
        return ChatResponse(
            message=MessageResponse.from_orm(error_message),
            session=SessionResponse.from_orm(session)
        )

@router.put("/sessions/{session_id}", response_model=SessionResponse)
async def update_session(
    session_id: str,
    update_data: UpdateSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新聊天会话信息"""
    
    session = db.query(ChatSession).filter(
        ChatSession.session_id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会话不存在"
        )
    
    # 更新允许的字段
    update_fields = update_data.dict(exclude_unset=True)
    for field, value in update_fields.items():
        if hasattr(session, field):
            setattr(session, field, value)
    
    session.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(session)
    
    return SessionResponse.from_orm(session)

@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除聊天会话"""
    
    session = db.query(ChatSession).filter(
        ChatSession.session_id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会话不存在"
        )
    
    # 删除相关消息
    db.query(Message).filter(Message.session_id == session.id).delete()
    
    # 删除会话
    db.delete(session)
    db.commit()
    
    return {
        "message": "会话删除成功",
        "session_id": session_id,
        "timestamp": datetime.now().isoformat()
    } 