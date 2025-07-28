#!/usr/bin/env python3
"""
DeepNeed AI 后端服务启动脚本
自动检查依赖、初始化数据库、启动服务
"""

import sys
import subprocess
import os
import asyncio
from pathlib import Path

# 检查Python版本
if sys.version_info < (3, 8):
    print("❌ 需要Python 3.8或更高版本")
    sys.exit(1)

def check_and_install_dependencies():
    """检查并安装依赖"""
    print("🔍 检查Python依赖...")
    
    try:
        # 检查关键依赖
        import fastapi
        import uvicorn
        import sqlalchemy
        import httpx
        import jwt
        import passlib
        print("✅ 所有依赖已安装")
        return True
    except ImportError as e:
        print(f"⚠️ 缺少依赖: {e}")
        print("📦 正在安装依赖...")
        
        try:
            # 安装依赖
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", 
                "-r", "requirements.txt", "--user"
            ])
            print("✅ 依赖安装完成")
            return True
        except subprocess.CalledProcessError:
            print("❌ 依赖安装失败，请手动安装:")
            print("pip install -r requirements.txt")
            return False

def setup_environment():
    """设置环境变量"""
    print("🔧 设置环境变量...")
    
    # 设置默认环境变量
    env_vars = {
        "SECRET_KEY": "deepneed-secret-key-2025",
        "DATABASE_URL": "sqlite:///./deepneed.db",
        "HOST": "0.0.0.0",
        "PORT": "8000",
        "DEBUG": "true"
    }
    
    for key, default_value in env_vars.items():
        if key not in os.environ:
            os.environ[key] = default_value
            print(f"  - {key}: {default_value}")
    
    print("✅ 环境变量设置完成")

async def init_database():
    """初始化数据库"""
    print("🗄️ 初始化数据库...")
    
    try:
        # 添加当前目录到Python路径
        current_dir = Path(__file__).parent
        sys.path.insert(0, str(current_dir))
        
        from app.database import init_database
        await init_database()
        print("✅ 数据库初始化完成")
        return True
    except Exception as e:
        print(f"❌ 数据库初始化失败: {e}")
        return False

def start_server():
    """启动服务器"""
    print("🚀 启动DeepNeed AI后端服务...")
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    print(f"📡 服务地址: http://{host}:{port}")
    print(f"📚 API文档: http://localhost:{port}/docs")
    print(f"🔄 调试模式: {'开启' if debug else '关闭'}")
    print()
    
    try:
        import uvicorn
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=debug,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ 服务启动失败: {e}")
        sys.exit(1)

async def main():
    """主函数"""
    print("=" * 50)
    print("🎯 DeepNeed AI 后端服务启动器")
    print("=" * 50)
    
    # 检查依赖
    if not check_and_install_dependencies():
        sys.exit(1)
    
    # 设置环境
    setup_environment()
    
    # 初始化数据库
    if not await init_database():
        sys.exit(1)
    
    print("✅ 所有初始化完成，启动服务...")
    print()
    
    # 启动服务器
    start_server()

if __name__ == "__main__":
    # 切换到脚本目录
    os.chdir(Path(__file__).parent)
    
    # 运行主函数
    asyncio.run(main()) 