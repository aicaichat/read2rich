from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base

# 开发环境使用 SQLite，不支持 pgvector
# 在生产环境中可以切换回 PostgreSQL + pgvector
try:
    from pgvector.sqlalchemy import Vector
    VECTOR_SUPPORT = True
except ImportError:
    # SQLite 环境下的备用方案
    Vector = Text  # 在 SQLite 中将向量存储为文本
    VECTOR_SUPPORT = False

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    sessions = relationship("Session", back_populates="user")

class Instructor(Base):
    __tablename__ = "instructors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    avatar = Column(String)
    bio = Column(Text)
    title = Column(String)
    expertise = Column(JSON, default=[])  # 存储为JSON数组
    experience = Column(Integer, default=0)  # 工作年限
    courses = Column(Integer, default=0)  # 课程数量
    students = Column(Integer, default=0)  # 学生总数
    rating = Column(Float, default=0.0)  # 评分
    status = Column(String, default="pending")  # active, inactive, pending
    social_links = Column(JSON, default={})  # 存储为JSON对象
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    courses_rel = relationship("Course", back_populates="instructor")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    subtitle = Column(String)
    description = Column(Text)
    instructor_id = Column(Integer, ForeignKey("instructors.id"), nullable=False)
    price = Column(Float, default=0.0)
    original_price = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    rating = Column(Float, default=0.0)
    students = Column(Integer, default=0)
    duration = Column(String, default="0小时")
    lessons = Column(Integer, default=0)
    level = Column(String, default="beginner")  # beginner, intermediate, advanced
    category = Column(String, index=True)
    status = Column(String, default="draft")  # draft, published, archived
    is_hot = Column(Boolean, default=False)
    is_new = Column(Boolean, default=False)
    is_free = Column(Boolean, default=False)
    tags = Column(JSON, default=[])  # 存储为JSON数组
    image = Column(String)
    video_url = Column(String)
    modules = Column(JSON, default=[])  # 存储为JSON数组
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    instructor = relationship("Instructor", back_populates="courses_rel")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_name = Column(String)
    user_email = Column(String)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    course_title = Column(String)
    course_image = Column(String)
    instructor_name = Column(String)
    amount = Column(Float, nullable=False)
    original_amount = Column(Float, nullable=False)
    discount = Column(Float, default=0.0)
    payment_method = Column(String, default="other")  # alipay, wechat, card, other
    status = Column(String, default="pending")  # pending, paid, completed, cancelled, refunded
    payment_time = Column(DateTime(timezone=True))
    completed_time = Column(DateTime(timezone=True))
    refund_time = Column(DateTime(timezone=True))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    user = relationship("User")
    course = relationship("Course")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(String, primary_key=True, index=True)  # UUID
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    initial_idea = Column(Text, nullable=False)
    current_requirements = Column(JSON, default={})
    status = Column(String, default="active")  # active, completed, archived
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    user = relationship("User", back_populates="sessions")
    messages = relationship("Message", back_populates="session")
    prompts = relationship("GeneratedPrompt", back_populates="session")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    message_metadata = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关系
    session = relationship("Session", back_populates="messages")

class GeneratedPrompt(Base):
    __tablename__ = "generated_prompts"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.id"), nullable=False)
    summary = Column(Text, nullable=False)
    code_prompt = Column(Text, nullable=False)
    pm_prompt = Column(Text, nullable=False)
    status = Column(String, default="draft")  # draft, confirmed, used
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关系
    session = relationship("Session", back_populates="prompts")
    generations = relationship("CodeGeneration", back_populates="prompt")

class CodeGeneration(Base):
    __tablename__ = "code_generations"
    
    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("generated_prompts.id"), nullable=False)
    generated_code = Column(Text, nullable=False)
    file_structure = Column(JSON, default={})
    pm_plan = Column(Text)
    model_used = Column(String, default="claude-3-sonnet")
    status = Column(String, default="completed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关系
    prompt = relationship("GeneratedPrompt", back_populates="generations")

class PromptTemplate(Base):
    __tablename__ = "prompt_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(JSON, default=[])
    language = Column(String, default="zh")
    source_repo = Column(String)
    embedding = Column(Vector(1536))  # OpenAI embedding dimension
    is_active = Column(Boolean, default=True)
    usage_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 


class PaymentSettings(Base):
    __tablename__ = "payment_settings"

    id = Column(Integer, primary_key=True, index=True)
    # WeChat
    wechat_app_id = Column(String, default="")
    wechat_merchant_id = Column(String, default="")
    wechat_api_key = Column(String, default="")
    wechat_cert_path = Column(String, default="")
    wechat_key_path = Column(String, default="")
    # Alipay
    alipay_app_id = Column(String, default="")
    alipay_private_key = Column(Text, default="")
    alipay_public_key = Column(Text, default="")
    # Stripe
    stripe_secret_key = Column(String, default="")
    stripe_webhook_secret = Column(String, default="")
    # Metadata
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())