#!/usr/bin/env python3
"""
数据库初始化脚本
创建表并插入初始数据
"""

import os
import sys
from pathlib import Path

# 添加当前目录到 Python 路径
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# 设置环境变量
os.environ["DATABASE_URL"] = "sqlite:///./deepneed_dev.db"

from sqlalchemy import create_engine
from app.db.database import Base
from app.db.models import User, Session, Message, GeneratedPrompt, CodeGeneration, PromptTemplate, Instructor, Course
from app.core.auth import get_password_hash

def init_database():
    """初始化数据库"""
    print("🗄️  Initializing database...")
    
    # 创建数据库引擎
    engine = create_engine("sqlite:///./deepneed_dev.db")
    
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    
    print("✅ Database tables created successfully!")
    
    # 创建数据库会话
    from sqlalchemy.orm import sessionmaker
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # 检查是否已有用户
        existing_user = db.query(User).filter(User.username == "admin").first()
        if not existing_user:
            # 创建管理员用户
            admin_user = User(
                email="admin@deepneed.com",
                username="admin",
                hashed_password=get_password_hash("admin123"),
                full_name="Administrator",
                is_active=True,
                is_superuser=True
            )
            db.add(admin_user)
            
            # 创建演示用户
            demo_user = User(
                email="demo@deepneed.com", 
                username="demo",
                hashed_password=get_password_hash("demo123"),
                full_name="Demo User",
                is_active=True,
                is_superuser=False
            )
            db.add(demo_user)
            
            db.commit()
            print("✅ Initial users created:")
            print("   👤 Admin: admin / admin123")
            print("   👤 Demo:  demo / demo123")
        else:
            print("ℹ️  Users already exist, skipping user creation")
            
                # 插入示例提示词模板
        existing_template = db.query(PromptTemplate).first()
        if not existing_template:
            template1 = PromptTemplate(
                title="Web应用开发",
                description="用于Web应用开发的标准提示词模板",
                role="developer",
                content="# 项目需求分析\n\n## 背景信息\n{background}\n\n## 功能需求\n{requirements}\n\n## 技术约束\n{constraints}\n\n## 期望输出\n请生成完整的技术方案",
                tags=["web", "fullstack", "development"]
            )
            
            template2 = PromptTemplate(
                title="移动应用开发", 
                description="用于移动应用开发的提示词模板",
                role="mobile_developer",
                content="# 移动应用需求分析\n\n## 应用类型\n{app_type}\n\n## 目标平台\n{platforms}\n\n## 核心功能\n{core_features}",
                tags=["mobile", "ios", "android", "react-native", "flutter"]
            )
             
            db.add(template1)
            db.add(template2)
            db.commit()
            print("✅ Sample prompt templates created")
        else:
            print("ℹ️  Templates already exist, skipping template creation")
        
        # 插入示例讲师数据
        existing_instructor = db.query(Instructor).first()
        if not existing_instructor:
            instructor1 = Instructor(
                name="张教授",
                email="zhang@deepneed.com",
                avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=zhang",
                bio="资深AI产品专家，拥有10年+产品开发经验，曾主导多个百万级用户产品。专注于AI时代的产品设计和商业模式创新。",
                title="AI产品专家",
                expertise=["AI产品设计", "产品管理", "商业模式", "用户体验"],
                experience=12,
                status="active",
                social_links={
                    "linkedin": "https://linkedin.com/in/zhang-professor",
                    "twitter": "https://twitter.com/zhang_ai",
                    "website": "https://zhang-ai.com"
                }
            )
            
            instructor2 = Instructor(
                name="李老师",
                email="li@deepneed.com",
                avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=li",
                bio="资深产品经理，专注于AI产品设计，曾负责多个知名AI产品。擅长用户研究和产品策略制定。",
                title="产品经理",
                expertise=["产品设计", "AI产品", "用户体验", "用户研究"],
                experience=8,
                status="active",
                social_links={
                    "linkedin": "https://linkedin.com/in/li-pm",
                    "github": "https://github.com/li-pm"
                }
            )
            
            db.add(instructor1)
            db.add(instructor2)
            db.commit()
            print("✅ Sample instructors created")
        else:
            print("ℹ️  Instructors already exist, skipping instructor creation")
        
        # 插入示例课程数据
        existing_course = db.query(Course).first()
        if not existing_course:
            course1 = Course(
                title="价值百万的 AI 应用公开课",
                subtitle="从0到1打造AI应用，抓住AI时代红利",
                description="本课程将带你深入了解AI应用开发的全流程，从需求分析到产品上线，掌握AI时代的产品设计和商业模式创新。",
                instructor_id=1,
                price=299.0,
                original_price=599.0,
                level="intermediate",
                category="AI产品设计",
                status="published",
                is_hot=True,
                is_new=True,
                tags=["AI", "产品设计", "商业模式", "创新"],
                image="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
                video_url="https://ssswork.oss-cn-hangzhou.aliyuncs.com/%E7%99%BE%E4%B8%87%E5%BA%94%E7%94%A8%E5%85%AC%E5%BC%80%E8%AF%BE.mp4",
                modules=[
                    {"id": 1, "title": "AI时代的产品思维", "description": "理解AI时代的产品设计理念"},
                    {"id": 2, "title": "需求分析与用户研究", "description": "掌握AI产品的需求分析方法"},
                    {"id": 3, "title": "商业模式设计", "description": "设计可持续的AI产品商业模式"}
                ]
            )
            
            db.add(course1)
            db.commit()
            print("✅ Sample courses created")
        else:
            print("ℹ️  Courses already exist, skipping course creation")
            
    except Exception as e:
        print(f"❌ Error initializing data: {e}")
        db.rollback()
    finally:
        db.close()
        
    print("🎉 Database initialization completed!")

if __name__ == "__main__":
    init_database() 