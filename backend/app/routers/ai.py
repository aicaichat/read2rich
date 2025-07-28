"""
AI服务相关API路由
直接AI调用、模板生成等
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

from app.database import get_db, User
from app.auth import get_current_user
from app.ai_service import get_ai_service

router = APIRouter()

# 请求模型
class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    max_tokens: Optional[int] = 1000
    temperature: Optional[float] = 0.7

class GenerateDocumentRequest(BaseModel):
    project_info: Dict[str, Any]
    document_type: str  # prd, technical, design, project_management

# 响应模型
class ChatResponse(BaseModel):
    response: str
    model: str
    timestamp: str

class GenerateDocumentResponse(BaseModel):
    document_type: str
    content: str
    generated_at: str

@router.post("/chat", response_model=ChatResponse)
async def ai_chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """直接AI聊天接口"""
    
    try:
        ai_service = get_ai_service()
        
        response = await ai_service.chat_completion(
            messages=request.messages,
            max_tokens=request.max_tokens
        )
        
        return ChatResponse(
            response=response,
            model="ai_assistant",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI服务错误: {str(e)}"
        )

@router.post("/generate-document", response_model=GenerateDocumentResponse)
async def generate_single_document(
    request: GenerateDocumentRequest,
    current_user: User = Depends(get_current_user)
):
    """生成单个文档"""
    
    try:
        ai_service = get_ai_service()
        
        if request.document_type == "prd":
            content = await ai_service.generate_requirements_document(request.project_info)
        elif request.document_type == "technical":
            content = await ai_service.generate_technical_document(request.project_info)
        elif request.document_type == "design":
            content = await ai_service.generate_design_document(request.project_info)
        elif request.document_type == "project_management":
            content = await ai_service.generate_project_management_document(request.project_info)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"不支持的文档类型: {request.document_type}"
            )
        
        return GenerateDocumentResponse(
            document_type=request.document_type,
            content=content,
            generated_at=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"文档生成失败: {str(e)}"
        )

@router.get("/status")
async def ai_service_status():
    """AI服务状态检查"""
    
    try:
        ai_service = get_ai_service()
        
        # 简单的健康检查
        test_messages = [{"role": "user", "content": "Hello"}]
        
        status_info = {
            "service": "AI Service",
            "status": "unknown",
            "timestamp": datetime.now().isoformat(),
            "providers": {}
        }
        
        # 检查Claude API
        try:
            await ai_service.call_claude_api(test_messages, max_tokens=10)
            status_info["providers"]["claude"] = "available"
        except Exception as e:
            status_info["providers"]["claude"] = f"unavailable: {str(e)}"
        
        # 检查DeepSeek API
        try:
            await ai_service.call_deepseek_api(test_messages, max_tokens=10)
            status_info["providers"]["deepseek"] = "available"
        except Exception as e:
            status_info["providers"]["deepseek"] = f"unavailable: {str(e)}"
        
        # 确定总体状态
        available_providers = [k for k, v in status_info["providers"].items() if v == "available"]
        if available_providers:
            status_info["status"] = "healthy"
        else:
            status_info["status"] = "degraded"
        
        return status_info
        
    except Exception as e:
        return {
            "service": "AI Service",
            "status": "error",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        } 