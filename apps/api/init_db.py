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
from app.db.models import User, Session, Message, GeneratedPrompt, CodeGeneration, PromptTemplate
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
            
    except Exception as e:
        print(f"❌ Error initializing data: {e}")
        db.rollback()
    finally:
        db.close()
        
    print("🎉 Database initialization completed!")

if __name__ == "__main__":
    init_database() 