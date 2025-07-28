#!/bin/bash

echo "🚀 初始化 DeepNeed 项目..."

# 检查依赖
command -v node >/dev/null 2>&1 || { echo "❌ 需要安装 Node.js"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ 需要安装 Python 3.11+"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ 需要安装 Docker"; exit 1; }

# 安装 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装 pnpm..."
    npm install -g pnpm
fi

# 安装依赖
echo "📦 安装前端依赖..."
pnpm install

# 设置环境变量
if [ ! -f .env ]; then
    echo "⚙️ 创建环境配置..."
    cp .env.example .env
    echo "请编辑 .env 文件，填入必要的 API Keys"
fi

# 启动数据库
echo "🗄️ 启动数据库服务..."
docker-compose up -d postgres redis

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 安装 Python 依赖
echo "🐍 安装 Python 依赖..."
cd apps/api
if ! command -v poetry &> /dev/null; then
    pip install poetry
fi
poetry install
cd ../..

# 初始化数据库
echo "🗄️ 初始化数据库..."
cd apps/api
poetry run python -c "
from app.db.database import engine, Base
from app.db import models
print('Creating database tables...')
Base.metadata.create_all(bind=engine)
print('Database tables created successfully!')
"
cd ../..

echo "✅ 项目初始化完成！"
echo ""
echo "🚀 启动开发服务器："
echo "   pnpm dev"
echo ""
echo "🌐 访问地址："
echo "   前端: http://localhost:5173"
echo "   API:  http://localhost:8000/docs"
echo ""
echo "📝 下一步："
echo "   1. 编辑 .env 文件，配置 API Keys"
echo "   2. 运行 'pnpm dev' 启动开发服务器"
echo "   3. 访问 http://localhost:5173 开始使用" 