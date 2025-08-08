#!/bin/bash

# 服务器端部署修复脚本
# 解决 pycryptodome 依赖和部署问题

set -e

echo "🔧 开始修复服务器端部署问题..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查是否在服务器环境
if [ ! -d "/opt/deepneed" ]; then
    echo -e "${RED}❌ 请在服务器上运行此脚本${NC}"
    exit 1
fi

cd /opt/deepneed

echo -e "${BLUE}📋 当前状态检查...${NC}"

# 1. 停止所有服务
echo -e "${BLUE}🛑 停止所有服务...${NC}"
docker compose -f docker-compose.production.yml down 2>/dev/null || true
docker compose down 2>/dev/null || true

# 2. 检查并修复 API 服务依赖
echo -e "${BLUE}🔧 修复 API 服务依赖...${NC}"
if [ -d "apps/api" ]; then
    cd apps/api
    
    # 检查虚拟环境
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}⚠️  创建虚拟环境...${NC}"
        python3 -m venv venv
    fi
    
    # 激活虚拟环境并安装依赖
    echo -e "${BLUE}📦 安装依赖...${NC}"
    source venv/bin/activate
    
    # 升级 pip
    pip install --upgrade pip
    
    # 安装必需依赖
    pip install pycryptodome fastapi uvicorn sqlalchemy psycopg2-binary python-multipart python-jose[cryptography] passlib[bcrypt] redis
    
    # 检查 poetry 依赖
    if [ -f "pyproject.toml" ]; then
        echo -e "${BLUE}📦 安装 Poetry 依赖...${NC}"
        pip install poetry
        poetry install --no-dev
    fi
    
    cd /opt/deepneed
fi

# 3. 检查前端依赖
echo -e "${BLUE}🔧 修复前端依赖...${NC}"
if [ -d "apps/web" ]; then
    cd apps/web
    
    # 检查 node_modules
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠️  安装前端依赖...${NC}"
        npm install -g pnpm
        pnpm install --no-frozen-lockfile
    fi
    
    cd /opt/deepneed
fi

# 4. 重新构建 Docker 镜像
echo -e "${BLUE}🐳 重新构建 Docker 镜像...${NC}"
docker compose -f docker-compose.production.yml build --no-cache

# 5. 启动服务
echo -e "${BLUE}🚀 启动服务...${NC}"
docker compose -f docker-compose.production.yml up -d

# 6. 检查服务状态
echo -e "${BLUE}📊 检查服务状态...${NC}"
sleep 10
docker compose -f docker-compose.production.yml ps

# 7. 检查健康状态
echo -e "${BLUE}🔍 检查健康状态...${NC}"
if curl -s http://localhost:8000/health >/dev/null; then
    echo -e "${GREEN}✅ API 服务健康${NC}"
else
    echo -e "${RED}❌ API 服务异常${NC}"
    echo -e "${YELLOW}📋 查看日志：docker compose -f docker-compose.production.yml logs backend${NC}"
fi

if curl -s http://localhost:3000 >/dev/null; then
    echo -e "${GREEN}✅ 前端服务健康${NC}"
else
    echo -e "${RED}❌ 前端服务异常${NC}"
    echo -e "${YELLOW}📋 查看日志：docker compose -f docker-compose.production.yml logs frontend${NC}"
fi

echo -e "${GREEN}🎉 服务器端修复完成！${NC}"
echo -e "${BLUE}📋 访问地址：${NC}"
echo "  前端: http://$(hostname -I | awk '{print $1}'):3000"
echo "  API: http://$(hostname -I | awk '{print $1}'):8000"
echo "  API 文档: http://$(hostname -I | awk '{print $1}'):8000/docs"
