"""
文档管理相关API路由
文档生成、保存、下载等
"""

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any
import json

from app.database import get_db, User, ChatSession, Document, Message
from app.auth import get_current_user
from app.ai_service import get_ai_service

router = APIRouter()

# 请求模型
class GenerateDocumentsRequest(BaseModel):
    session_id: str
    document_types: List[str] = ["prd", "technical", "design", "project_management"]

class SaveDocumentRequest(BaseModel):
    title: str
    doc_type: str
    content: str
    format: str = "markdown"
    metadata: Optional[Dict[str, Any]] = None

# 响应模型
class DocumentResponse(BaseModel):
    id: int
    title: str
    doc_type: str
    content: str
    format: str
    status: str
    metadata: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GeneratedDocumentsResponse(BaseModel):
    session_id: str
    documents: Dict[str, DocumentResponse]
    generation_time: str
    total_documents: int

@router.post("/generate", response_model=GeneratedDocumentsResponse)
async def generate_documents(
    request: GenerateDocumentsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """根据聊天会话生成项目文档"""
    
    # 获取会话
    session = db.query(ChatSession).filter(
        ChatSession.session_id == request.session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会话不存在"
        )
    
    # 获取对话历史
    messages = db.query(Message).filter(
        Message.session_id == session.id
    ).order_by(Message.created_at.asc()).all()
    
    if not messages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="会话中没有足够的信息生成文档"
        )
    
    # 构造项目信息
    project_info = {
        "name": session.title or session.initial_idea or "未命名项目",
        "type": session.project_type or "通用项目",
        "description": session.initial_idea or "无描述",
        "conversation_summary": "\n".join([f"{msg.role}: {msg.content}" for msg in messages[-10:]]),  # 最近10条消息
        "target_users": "待确定",
        "technical_requirements": "待确定",
        "timeline": "待确定"
    }
    
    # 从对话中提取更多信息
    conversation_text = " ".join([msg.content for msg in messages if msg.role == "user"])
    if "用户" in conversation_text or "客户" in conversation_text:
        project_info["target_users"] = "从对话中识别的用户群体"
    
    try:
        ai_service = get_ai_service()
        generated_docs = {}
        
        # 并行生成文档
        import asyncio
        
        async def generate_single_doc(doc_type: str):
            try:
                if doc_type == "prd":
                    content = await ai_service.generate_requirements_document(project_info)
                elif doc_type == "technical":
                    content = await ai_service.generate_technical_document(project_info)
                elif doc_type == "design":
                    content = await ai_service.generate_design_document(project_info)
                elif doc_type == "project_management":
                    content = await ai_service.generate_project_management_document(project_info)
                else:
                    raise ValueError(f"不支持的文档类型: {doc_type}")
                
                # 保存文档到数据库
                document = Document(
                    user_id=current_user.id,
                    session_id=session.id,
                    title=f"{project_info['name']} - {doc_type.upper()}文档",
                    doc_type=doc_type,
                    content=content,
                    format="markdown",
                    status="final",
                    metadata={
                        "generated_at": datetime.now().isoformat(),
                        "generation_method": "ai_generated",
                        "session_id": request.session_id
                    }
                )
                db.add(document)
                db.commit()
                db.refresh(document)
                
                return doc_type, DocumentResponse.from_orm(document)
                
            except Exception as e:
                print(f"❌ 生成{doc_type}文档失败: {e}")
                # 创建默认文档
                default_content = f"# {doc_type.upper()}文档\n\n项目名称：{project_info['name']}\n\n**注意：由于AI服务暂时不可用，这是一个默认模板。请手动完善内容。**\n\n## 待完善内容\n\n请根据项目需求完善此文档。"
                
                document = Document(
                    user_id=current_user.id,
                    session_id=session.id,
                    title=f"{project_info['name']} - {doc_type.upper()}文档（模板）",
                    doc_type=doc_type,
                    content=default_content,
                    format="markdown",
                    status="draft",
                    metadata={
                        "generated_at": datetime.now().isoformat(),
                        "generation_method": "fallback_template",
                        "error": str(e),
                        "session_id": request.session_id
                    }
                )
                db.add(document)
                db.commit()
                db.refresh(document)
                
                return doc_type, DocumentResponse.from_orm(document)
        
        # 并行生成所有文档
        tasks = [generate_single_doc(doc_type) for doc_type in request.document_types]
        results = await asyncio.gather(*tasks)
        
        # 整理结果
        for doc_type, document in results:
            generated_docs[doc_type] = document
        
        return GeneratedDocumentsResponse(
            session_id=request.session_id,
            documents=generated_docs,
            generation_time=datetime.now().isoformat(),
            total_documents=len(generated_docs)
        )
        
    except Exception as e:
        print(f"❌ 文档生成失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"文档生成失败: {str(e)}"
        )

@router.get("/", response_model=List[DocumentResponse])
async def get_user_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    doc_type: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
):
    """获取用户的文档列表"""
    
    query = db.query(Document).filter(Document.user_id == current_user.id)
    
    if doc_type:
        query = query.filter(Document.doc_type == doc_type)
    
    documents = query.order_by(Document.created_at.desc()).offset(offset).limit(limit).all()
    
    return [DocumentResponse.from_orm(doc) for doc in documents]

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取特定文档"""
    
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文档不存在"
        )
    
    return DocumentResponse.from_orm(document)

@router.get("/{document_id}/download")
async def download_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    format: str = "markdown"
):
    """下载文档"""
    
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文档不存在"
        )
    
    # 设置文件名和内容类型
    filename = f"{document.title}.md"
    content_type = "text/markdown"
    
    if format == "json":
        content = json.dumps({
            "title": document.title,
            "type": document.doc_type,
            "content": document.content,
            "metadata": document.metadata,
            "created_at": document.created_at.isoformat()
        }, ensure_ascii=False, indent=2)
        filename = f"{document.title}.json"
        content_type = "application/json"
    else:
        content = document.content
    
    return Response(
        content=content.encode('utf-8'),
        media_type=content_type,
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

@router.post("/", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def save_document(
    document_data: SaveDocumentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """保存新文档"""
    
    document = Document(
        user_id=current_user.id,
        title=document_data.title,
        doc_type=document_data.doc_type,
        content=document_data.content,
        format=document_data.format,
        status="draft",
        metadata=document_data.metadata or {}
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return DocumentResponse.from_orm(document)

@router.put("/{document_id}", response_model=DocumentResponse)
async def update_document(
    document_id: int,
    document_data: SaveDocumentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新文档"""
    
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文档不存在"
        )
    
    # 更新字段
    document.title = document_data.title
    document.content = document_data.content
    document.format = document_data.format
    document.metadata = document_data.metadata or {}
    document.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(document)
    
    return DocumentResponse.from_orm(document)

@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除文档"""
    
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文档不存在"
        )
    
    db.delete(document)
    db.commit()
    
    return {
        "message": "文档删除成功",
        "document_id": document_id,
        "timestamp": datetime.now().isoformat()
    } 