"""
用户管理相关API路由
用户信息、统计数据等
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

from app.database import get_db, User, ChatSession, Document, Message
from app.auth import get_current_user, require_admin

router = APIRouter()

# 响应模型
class UserStatsResponse(BaseModel):
    total_sessions: int
    total_messages: int
    total_documents: int
    account_created: datetime
    last_activity: Optional[datetime]

class UserProfileResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime
    stats: UserStatsResponse

@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取用户档案和统计信息"""
    
    # 获取用户统计数据
    total_sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).count()
    total_messages = db.query(Message).join(ChatSession).filter(ChatSession.user_id == current_user.id).count()
    total_documents = db.query(Document).filter(Document.user_id == current_user.id).count()
    
    # 获取最后活动时间
    last_session = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.updated_at.desc()).first()
    
    last_activity = last_session.updated_at if last_session else None
    
    stats = UserStatsResponse(
        total_sessions=total_sessions,
        total_messages=total_messages,
        total_documents=total_documents,
        account_created=current_user.created_at,
        last_activity=last_activity
    )
    
    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
        stats=stats
    )

@router.get("/stats", response_model=UserStatsResponse)
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取用户统计数据"""
    
    total_sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).count()
    total_messages = db.query(Message).join(ChatSession).filter(ChatSession.user_id == current_user.id).count()
    total_documents = db.query(Document).filter(Document.user_id == current_user.id).count()
    
    last_session = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.updated_at.desc()).first()
    
    last_activity = last_session.updated_at if last_session else None
    
    return UserStatsResponse(
        total_sessions=total_sessions,
        total_messages=total_messages,
        total_documents=total_documents,
        account_created=current_user.created_at,
        last_activity=last_activity
    )

# 管理员路由
@router.get("/admin/users", response_model=List[UserProfileResponse])
async def list_all_users(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
    limit: int = 50,
    offset: int = 0
):
    """管理员查看所有用户（需要管理员权限）"""
    
    users = db.query(User).offset(offset).limit(limit).all()
    
    profiles = []
    for user in users:
        # 计算每个用户的统计数据
        total_sessions = db.query(ChatSession).filter(ChatSession.user_id == user.id).count()
        total_messages = db.query(Message).join(ChatSession).filter(ChatSession.user_id == user.id).count()
        total_documents = db.query(Document).filter(Document.user_id == user.id).count()
        
        last_session = db.query(ChatSession).filter(
            ChatSession.user_id == user.id
        ).order_by(ChatSession.updated_at.desc()).first()
        
        last_activity = last_session.updated_at if last_session else None
        
        stats = UserStatsResponse(
            total_sessions=total_sessions,
            total_messages=total_messages,
            total_documents=total_documents,
            account_created=user.created_at,
            last_activity=last_activity
        )
        
        profiles.append(UserProfileResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at,
            stats=stats
        ))
    
    return profiles 