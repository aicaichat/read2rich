"""
数据库配置和管理
使用SQLAlchemy + SQLite进行数据持久化
"""

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime
import os
import asyncio
from typing import Generator

# 数据库配置
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./deepneed.db")

# 创建数据库引擎
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False  # 设置为True可以看到SQL查询日志
)

# 创建会话
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 声明基类
Base = declarative_base()

# 数据库模型定义
class User(Base):
    """用户模型"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    sessions = relationship("ChatSession", back_populates="user")
    documents = relationship("Document", back_populates="user")

class ChatSession(Base):
    """对话会话模型"""
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=True)
    initial_idea = Column(Text, nullable=True)
    project_type = Column(String(100), nullable=True)
    status = Column(String(50), default="active")  # active, completed, archived
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = relationship("User", back_populates="sessions")
    messages = relationship("Message", back_populates="session")
    documents = relationship("Document", back_populates="session")

class Message(Base):
    """消息模型"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 关系
    session = relationship("ChatSession", back_populates="messages")

class Document(Base):
    """文档模型"""
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=True)
    title = Column(String(255), nullable=False)
    doc_type = Column(String(50), nullable=False)  # prd, technical, design, project_management
    content = Column(Text, nullable=False)
    format = Column(String(20), default="markdown")  # markdown, pdf, docx
    status = Column(String(20), default="draft")  # draft, final, archived
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = relationship("User", back_populates="documents")
    session = relationship("ChatSession", back_populates="documents")

class PromptTemplate(Base):
    """提示词模板模型"""
    __tablename__ = "prompt_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # prd, technical, design, project_management
    template = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    variables = Column(JSON, nullable=True)  # 模板变量定义
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# 数据库依赖注入
def get_db() -> Generator[Session, None, None]:
    """获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def init_database():
    """初始化数据库"""
    print("🗄️ 初始化数据库...")
    
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    
    # 创建默认数据
    db = SessionLocal()
    try:
        # 检查是否需要创建默认用户
        existing_user = db.query(User).filter(User.email == "admin@deepneed.ai").first()
        if not existing_user:
            from app.auth import AuthManager
            auth_manager = AuthManager()
            
            admin_user = User(
                email="admin@deepneed.ai",
                username="admin",
                hashed_password=auth_manager.hash_password("admin123"),
                full_name="DeepNeed Admin",
                is_active=True,
                is_verified=True
            )
            db.add(admin_user)
            
        # 创建默认提示词模板
        existing_template = db.query(PromptTemplate).first()
        if not existing_template:
            templates = [
                PromptTemplate(
                    name="产品需求文档模板",
                    category="prd",
                    template="""# 产品需求文档(PRD)

## 项目概述
**项目名称**: {project_name}
**项目类型**: {project_type}
**创建时间**: {created_date}

## 需求背景
{background}

## 目标用户
{target_users}

## 功能需求
{functional_requirements}

## 非功能需求
{non_functional_requirements}

## 技术要求
{technical_requirements}

## 项目计划
{project_timeline}
""",
                    description="标准的产品需求文档模板",
                    variables=["project_name", "project_type", "created_date", "background", "target_users", "functional_requirements", "non_functional_requirements", "technical_requirements", "project_timeline"]
                ),
                PromptTemplate(
                    name="技术架构文档模板",
                    category="technical",
                    template="""# 技术架构文档

## 架构概述
{architecture_overview}

## 技术栈选择
{tech_stack}

## 系统架构图
{architecture_diagram}

## 数据库设计
{database_design}

## API设计
{api_design}

## 部署架构
{deployment_architecture}

## 安全考虑
{security_considerations}
""",
                    description="技术架构设计文档模板",
                    variables=["architecture_overview", "tech_stack", "architecture_diagram", "database_design", "api_design", "deployment_architecture", "security_considerations"]
                )
            ]
            
            for template in templates:
                db.add(template)
        
        db.commit()
        print("✅ 数据库初始化完成")
        
    except Exception as e:
        db.rollback()
        print(f"❌ 数据库初始化失败: {e}")
        raise
    finally:
        db.close()

# 数据库工具函数
def get_user_by_email(db: Session, email: str) -> User:
    """根据邮箱获取用户"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> User:
    """根据用户名获取用户"""
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, email: str, username: str, hashed_password: str, full_name: str = None) -> User:
    """创建新用户"""
    user = User(
        email=email,
        username=username,
        hashed_password=hashed_password,
        full_name=full_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_chat_session(db: Session, session_id: str) -> ChatSession:
    """根据session_id获取会话"""
    return db.query(ChatSession).filter(ChatSession.session_id == session_id).first()

def create_chat_session(db: Session, user_id: int, session_id: str, initial_idea: str = None) -> ChatSession:
    """创建新的聊天会话"""
    session = ChatSession(
        session_id=session_id,
        user_id=user_id,
        initial_idea=initial_idea,
        title=f"对话 - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session 