from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..db.database import get_db
from ..db.models import Session as SessionModel, Message, User
from ..schemas.session import SessionCreate, Session as SessionSchema, MessageCreate, Message as MessageSchema
from ..core.auth import get_current_active_user
from ..services.ai_service import ai_service

router = APIRouter()

@router.post("/", response_model=SessionSchema)
async def create_session(
    session_data: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """创建新的需求澄清会话"""
    session_id = str(uuid.uuid4())
    
    db_session = SessionModel(
        id=session_id,
        user_id=current_user.id,
        title=session_data.title or "新需求澄清",
        initial_idea=session_data.initial_idea,
        current_requirements={}
    )
    
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    # 创建初始系统消息
    system_message = Message(
        session_id=session_id,
        role="system",
        content="我是 DeepNeed AI，专门帮助你把模糊的想法转化为清晰的技术需求。让我们开始吧！"
    )
    
    # 创建用户初始消息
    user_message = Message(
        session_id=session_id,
        role="user",
        content=session_data.initial_idea
    )
    
    db.add_all([system_message, user_message])
    
    # 生成AI澄清问题
    try:
        clarification = await ai_service.generate_clarification_questions(session_data.initial_idea)
        
        ai_message = Message(
            session_id=session_id,
            role="assistant",
            content=clarification
        )
        
        db.add(ai_message)
    except Exception as e:
        # 如果AI服务失败，使用备用回复
        fallback_message = Message(
            session_id=session_id,
            role="assistant", 
            content="很高兴帮助您澄清需求！请告诉我更多关于您想法的细节，比如目标用户、主要功能、技术偏好等。"
        )
        db.add(fallback_message)
    
    db.commit()
    
    return db_session

@router.get("/", response_model=List[SessionSchema])
async def get_user_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取用户的所有会话"""
    sessions = db.query(SessionModel).filter(
        SessionModel.user_id == current_user.id
    ).order_by(SessionModel.updated_at.desc()).all()
    
    return sessions

@router.get("/{session_id}", response_model=SessionSchema)
async def get_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取指定会话"""
    session = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session

@router.get("/{session_id}/messages", response_model=List[MessageSchema])
async def get_session_messages(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取会话的所有消息"""
    # 验证会话所有权
    session = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    messages = db.query(Message).filter(
        Message.session_id == session_id
    ).order_by(Message.created_at).all()
    
    return messages

@router.post("/{session_id}/messages", response_model=MessageSchema)
async def add_message(
    session_id: str,
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """向会话添加新消息并生成AI回复"""
    # 验证会话所有权
    session = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # 添加用户消息
    user_message = Message(
        session_id=session_id,
        role="user",
        content=message_data.content
    )
    
    db.add(user_message)
    db.commit()
    
    # 获取会话历史
    messages = db.query(Message).filter(
        Message.session_id == session_id
    ).order_by(Message.created_at).all()
    
    # 生成AI回复
    try:
        conversation_history = [
            {"role": msg.role, "content": msg.content} 
            for msg in messages
        ]
        
        ai_response = await ai_service.continue_clarification(conversation_history)
        
        # 保存AI回复
        ai_message = Message(
            session_id=session_id,
            role="assistant",
            content=ai_response
        )
        
        db.add(ai_message)
        db.commit()
        db.refresh(ai_message)
        
        return ai_message
        
    except Exception as e:
        # AI服务出错时的备用回复
        fallback_message = Message(
            session_id=session_id,
            role="assistant",
            content="谢谢您的补充信息！请继续告诉我更多细节，这样我可以更好地帮助您澄清需求。"
        )
        
        db.add(fallback_message)
        db.commit()
        db.refresh(fallback_message)
        
        return fallback_message

@router.delete("/{session_id}")
async def delete_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """删除会话"""
    session = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # 删除相关消息
    db.query(Message).filter(Message.session_id == session_id).delete()
    
    # 删除会话
    db.delete(session)
    db.commit()
    
    return {"message": "Session deleted successfully"} 