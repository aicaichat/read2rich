from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict

from ..db.database import get_db
from ..db.models import Session as SessionModel, Message, GeneratedPrompt, User
from ..core.auth import get_current_active_user
from ..services.ai_service import ai_service

router = APIRouter()

@router.post("/{session_id}/generate")
async def generate_prompts(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, str]:
    """生成三段专业提示词"""
    # 验证会话所有权
    session = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # 获取会话消息历史
    messages = db.query(Message).filter(
        Message.session_id == session_id
    ).order_by(Message.created_at).all()
    
    if len(messages) < 3:  # 至少需要初始对话
        raise HTTPException(
            status_code=400, 
            detail="Need more conversation to generate prompts"
        )
    
    # 构建对话历史
    conversation_history = [
        {"role": msg.role, "content": msg.content} 
        for msg in messages
    ]
    
    try:
        # 生成提示词
        prompts = await ai_service.generate_prompts(conversation_history)
        
        # 保存到数据库
        db_prompt = GeneratedPrompt(
            session_id=session_id,
            summary=prompts.get("summary", ""),
            code_prompt=prompts.get("code_prompt", ""),
            pm_prompt=prompts.get("pm_prompt", ""),
            status="draft"
        )
        
        db.add(db_prompt)
        db.commit()
        db.refresh(db_prompt)
        
        return {
            "id": db_prompt.id,
            "summary": db_prompt.summary,
            "code_prompt": db_prompt.code_prompt,
            "pm_prompt": db_prompt.pm_prompt,
            "status": db_prompt.status
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate prompts: {str(e)}"
        )

@router.get("/{session_id}/prompts")
async def get_session_prompts(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取会话的所有提示词"""
    # 验证会话所有权
    session = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    prompts = db.query(GeneratedPrompt).filter(
        GeneratedPrompt.session_id == session_id
    ).order_by(GeneratedPrompt.created_at.desc()).all()
    
    return prompts

@router.put("/prompts/{prompt_id}/confirm")
async def confirm_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """确认提示词"""
    # 获取提示词
    prompt = db.query(GeneratedPrompt).filter(
        GeneratedPrompt.id == prompt_id
    ).first()
    
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    # 验证权限
    session = db.query(SessionModel).filter(
        SessionModel.id == prompt.session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # 更新状态
    prompt.status = "confirmed"
    db.commit()
    
    return {"message": "Prompt confirmed successfully", "prompt_id": prompt_id}

@router.get("/prompts/{prompt_id}")
async def get_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取指定提示词"""
    prompt = db.query(GeneratedPrompt).filter(
        GeneratedPrompt.id == prompt_id
    ).first()
    
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    # 验证权限
    session = db.query(SessionModel).filter(
        SessionModel.id == prompt.session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    return {
        "id": prompt.id,
        "session_id": prompt.session_id,
        "summary": prompt.summary,
        "code_prompt": prompt.code_prompt,
        "pm_prompt": prompt.pm_prompt,
        "status": prompt.status,
        "created_at": prompt.created_at
    } 