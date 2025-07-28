from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict

from ..db.database import get_db
from ..db.models import GeneratedPrompt, CodeGeneration, User, Session as SessionModel
from ..core.auth import get_current_active_user
from ..services.ai_service import ai_service

router = APIRouter()

@router.post("/code/{prompt_id}")
async def generate_code(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict:
    """使用 Claude 生成代码"""
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
    
    try:
        # 使用 Claude 生成代码
        result = await ai_service.generate_code_with_claude(prompt.code_prompt)
        
        if result.get("status") == "error":
            raise HTTPException(
                status_code=500,
                detail=f"Code generation failed: {result.get('error')}"
            )
        
        # 保存生成结果
        generation = CodeGeneration(
            prompt_id=prompt_id,
            generated_code=result["code"],
            model_used=result["model"],
            status="completed"
        )
        
        db.add(generation)
        db.commit()
        db.refresh(generation)
        
        return {
            "id": generation.id,
            "prompt_id": prompt_id,
            "generated_code": generation.generated_code,
            "model_used": generation.model_used,
            "status": generation.status,
            "created_at": generation.created_at
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Code generation failed: {str(e)}"
        )

@router.post("/plan/{prompt_id}")
async def generate_project_plan(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict:
    """生成项目管理计划"""
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
    
    try:
        # 生成项目计划
        plan = await ai_service.generate_project_plan(prompt.pm_prompt)
        
        # 更新代码生成记录，添加项目计划
        generation = db.query(CodeGeneration).filter(
            CodeGeneration.prompt_id == prompt_id
        ).first()
        
        if generation:
            generation.pm_plan = plan
            db.commit()
            db.refresh(generation)
            
            return {
                "id": generation.id,
                "prompt_id": prompt_id,
                "pm_plan": generation.pm_plan,
                "status": generation.status
            }
        else:
            # 如果没有代码生成记录，创建一个只有计划的记录
            generation = CodeGeneration(
                prompt_id=prompt_id,
                generated_code="",
                pm_plan=plan,
                status="plan_only"
            )
            
            db.add(generation)
            db.commit()
            db.refresh(generation)
            
            return {
                "id": generation.id,
                "prompt_id": prompt_id,
                "pm_plan": generation.pm_plan,
                "status": generation.status
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Project plan generation failed: {str(e)}"
        )

@router.get("/results/{prompt_id}")
async def get_generation_results(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取生成结果"""
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
    
    # 获取生成结果
    generations = db.query(CodeGeneration).filter(
        CodeGeneration.prompt_id == prompt_id
    ).order_by(CodeGeneration.created_at.desc()).all()
    
    return [
        {
            "id": gen.id,
            "prompt_id": gen.prompt_id,
            "generated_code": gen.generated_code,
            "pm_plan": gen.pm_plan,
            "model_used": gen.model_used,
            "status": gen.status,
            "created_at": gen.created_at
        }
        for gen in generations
    ]

@router.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "service": "generation"} 