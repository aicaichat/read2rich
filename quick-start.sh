#!/bin/bash

# DeepNeed AI 快速启动脚本
# 选择开发或生产环境部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}🚀 DeepNeed AI 快速启动脚本${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

# 检查Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker 未安装，请先安装 Docker${NC}"
        echo -e "${YELLOW}💡 安装指南: https://docs.docker.com/engine/install/${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}❌ Docker Compose 未安装${NC}"
        echo -e "${YELLOW}💡 安装指南: https://docs.docker.com/compose/install/${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Docker 环境检查通过${NC}"
}

# 创建环境文件
create_env_files() {
    echo -e "${YELLOW}📝 创建环境配置文件...${NC}"
    
    # 创建目录
    mkdir -p docker/env
    
    # 开发环境配置
    if [ ! -f "docker/env/dev.env" ]; then
        cat > docker/env/dev.env << 'EOF'
# DeepNeed AI 开发环境配置
APP_NAME=DeepNeed AI
APP_VERSION=1.0.0
APP_ENVIRONMENT=development
DEBUG=true

# 安全配置
SECRET_KEY=dev-secret-key-change-in-production-2025

# 数据库配置
DATABASE_URL=postgresql://deepneed:deepneed_dev_password@postgres:5432/deepneed_dev
POSTGRES_PASSWORD=deepneed_dev_password

# Redis配置
REDIS_URL=redis://redis:6379/0

# AI API 配置
CLAUDE_API_KEY=your-claude-api-key-here
DEEPSEEK_API_KEY=sk-dc146c694369404abde7e6b734a635f2

# 日志配置
LOG_LEVEL=debug
LOG_FORMAT=colored

# CORS配置
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
EOF
        echo -e "${GREEN}  ✅ 创建开发环境配置文件${NC}"
    fi
    
    # 生产环境配置模板
    if [ ! -f "docker/env/prod.env" ]; then
        cat > docker/env/prod.env << 'EOF'
# DeepNeed AI 生产环境配置
# ⚠️ 请务必修改所有敏感信息后再部署到生产环境

APP_NAME=DeepNeed AI
APP_VERSION=1.0.0
APP_ENVIRONMENT=production
DEBUG=false

# 安全配置 (⚠️ 必须修改)
SECRET_KEY=CHANGE_THIS_TO_A_SECURE_SECRET_KEY_IN_PRODUCTION

# 数据库配置 (⚠️ 必须修改密码)
DATABASE_URL=postgresql://deepneed:CHANGE_THIS_PASSWORD@postgres:5432/deepneed_prod
POSTGRES_PASSWORD=CHANGE_THIS_TO_A_SECURE_PASSWORD

# Redis配置
REDIS_URL=redis://redis:6379/0

# AI API 配置 (⚠️ 请填入有效的API密钥)
CLAUDE_API_KEY=your_claude_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 监控配置 (⚠️ 必须修改密码)
GRAFANA_PASSWORD=CHANGE_THIS_TO_A_SECURE_PASSWORD

# 日志配置
LOG_LEVEL=info
LOG_FORMAT=json

# CORS配置 (⚠️ 请修改为实际域名)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
EOF
        echo -e "${GREEN}  ✅ 创建生产环境配置模板${NC}"
    fi
}

# 创建简化的Docker Compose文件
create_simple_compose() {
    echo -e "${YELLOW}📦 创建简化的Docker配置...${NC}"
    
    cat > docker-compose.simple.yml << 'EOF'
# DeepNeed AI 简化版 Docker Compose 配置
version: '3.8'

services:
  # 前端服务 (直接使用当前的简化版本)
  frontend:
    image: node:18-alpine
    container_name: deepneed-frontend-simple
    working_dir: /app
    ports:
      - "5173:5173"
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: sh -c "npm install -g pnpm && pnpm install && pnpm dev --host 0.0.0.0"
    networks:
      - deepneed-network

  # 后端服务 (使用我们创建的最小化后端)
  backend:
    image: python:3.11-slim
    container_name: deepneed-backend-simple
    working_dir: /app
    ports:
      - "8001:8001"
    volumes:
      - .:/app
    environment:
      - PYTHONPATH=/app
      - PYTHONUNBUFFERED=1
    command: sh -c "pip install --break-system-packages fastapi uvicorn httpx pydantic && python3 minimal_backend.py"
    networks:
      - deepneed-network

networks:
  deepneed-network:
    driver: bridge
EOF
    
    echo -e "${GREEN}  ✅ 创建简化Docker配置${NC}"
}

# 选择部署模式
choose_deployment_mode() {
    echo -e "${YELLOW}🎯 请选择部署模式：${NC}"
    echo "1. 🛠️  开发环境 (完整功能，包含数据库)"
    echo "2. ⚡ 简化模式 (快速启动，基于现有最小后端)"
    echo "3. 🏭 生产环境 (需要配置生产环境变量)"
    echo "4. 🛑 停止所有服务"
    echo

    read -p "请输入选择 (1-4): " choice

    case $choice in
        1)
            deploy_development
            ;;
        2)
            deploy_simple
            ;;
        3)
            deploy_production
            ;;
        4)
            stop_all_services
            ;;
        *)
            echo -e "${RED}❌ 无效选择${NC}"
            choose_deployment_mode
            ;;
    esac
}

# 部署开发环境
deploy_development() {
    echo -e "${BLUE}🛠️ 启动开发环境...${NC}"
    
    if [ ! -f "docker-compose.dev.yml" ]; then
        echo -e "${RED}❌ 开发环境配置文件不存在${NC}"
        echo -e "${YELLOW}💡 请确保 docker-compose.dev.yml 文件存在${NC}"
        return 1
    fi
    
    # 加载环境变量
    if [ -f "docker/env/dev.env" ]; then
        export $(grep -v '^#' docker/env/dev.env | xargs) 2>/dev/null || true
    fi
    
    # 启动服务
    docker-compose -f docker-compose.dev.yml up -d
    
    echo -e "${GREEN}✅ 开发环境启动完成${NC}"
    show_development_info
}

# 部署简化模式
deploy_simple() {
    echo -e "${BLUE}⚡ 启动简化模式...${NC}"
    
    # 确保最小化后端文件存在
    if [ ! -f "minimal_backend.py" ]; then
        echo -e "${RED}❌ minimal_backend.py 不存在${NC}"
        echo -e "${YELLOW}💡 请确保已通过前面的步骤创建了最小化后端${NC}"
        return 1
    fi
    
    # 停止现有服务
    docker-compose -f docker-compose.simple.yml down 2>/dev/null || true
    
    # 启动简化服务
    docker-compose -f docker-compose.simple.yml up -d
    
    echo -e "${GREEN}✅ 简化模式启动完成${NC}"
    show_simple_info
}

# 部署生产环境
deploy_production() {
    echo -e "${BLUE}🏭 启动生产环境...${NC}"
    
    # 检查生产环境配置
    if grep -q "CHANGE_THIS" docker/env/prod.env 2>/dev/null; then
        echo -e "${RED}❌ 生产环境配置包含默认值，请先修改配置${NC}"
        echo -e "${YELLOW}💡 请编辑 docker/env/prod.env 文件并修改所有敏感配置${NC}"
        return 1
    fi
    
    if [ ! -f "docker-compose.prod.yml" ]; then
        echo -e "${RED}❌ 生产环境配置文件不存在${NC}"
        return 1
    fi
    
    # 确认部署
    echo -e "${YELLOW}⚠️ 即将部署到生产环境，确认继续？ (y/N)${NC}"
    read -r confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🛑 已取消部署${NC}"
        return 0
    fi
    
    # 加载环境变量
    if [ -f "docker/env/prod.env" ]; then
        export $(grep -v '^#' docker/env/prod.env | xargs) 2>/dev/null || true
    fi
    
    # 启动生产服务
    docker-compose -f docker-compose.prod.yml up -d
    
    echo -e "${GREEN}✅ 生产环境启动完成${NC}"
    show_production_info
}

# 停止所有服务
stop_all_services() {
    echo -e "${BLUE}🛑 停止所有服务...${NC}"
    
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    docker-compose -f docker-compose.simple.yml down 2>/dev/null || true
    
    echo -e "${GREEN}✅ 所有服务已停止${NC}"
}

# 显示开发环境信息
show_development_info() {
    echo -e "${BLUE}======================================================${NC}"
    echo -e "${GREEN}🎉 开发环境启动成功！${NC}"
    echo -e "${BLUE}======================================================${NC}"
    echo
    echo -e "${YELLOW}📡 服务地址：${NC}"
    echo -e "  🌐 前端应用:     http://localhost:5173"
    echo -e "  🔧 后端API:      http://localhost:8001"
    echo -e "  📚 API文档:      http://localhost:8001/docs"
    echo -e "  🗄️ 数据库管理:    http://localhost:8080"
    echo
    echo -e "${YELLOW}🔧 管理命令：${NC}"
    echo -e "  查看日志:        docker-compose -f docker-compose.dev.yml logs -f"
    echo -e "  停止服务:        $0"
    echo
}

# 显示简化模式信息
show_simple_info() {
    echo -e "${BLUE}======================================================${NC}"
    echo -e "${GREEN}🎉 简化模式启动成功！${NC}"
    echo -e "${BLUE}======================================================${NC}"
    echo
    echo -e "${YELLOW}📡 服务地址：${NC}"
    echo -e "  🌐 前端应用:     http://localhost:5173"
    echo -e "  🔧 后端API:      http://localhost:8001"
    echo
    echo -e "${YELLOW}💡 说明：${NC}"
    echo -e "  - 这是基于现有最小化后端的快速启动模式"
    echo -e "  - 数据存储在内存中，重启后会丢失"
    echo -e "  - 适合快速测试和演示"
    echo
}

# 显示生产环境信息
show_production_info() {
    echo -e "${BLUE}======================================================${NC}"
    echo -e "${GREEN}🎉 生产环境启动成功！${NC}"
    echo -e "${BLUE}======================================================${NC}"
    echo
    echo -e "${YELLOW}📡 服务地址：${NC}"
    echo -e "  🌐 应用首页:     http://your-domain.com"
    echo -e "  📊 监控面板:     http://your-domain.com:3000"
    echo
    echo -e "${YELLOW}⚠️ 重要提醒：${NC}"
    echo -e "  1. 请配置防火墙和SSL证书"
    echo -e "  2. 定期备份数据库"
    echo -e "  3. 监控系统资源使用情况"
    echo
}

# 主函数
main() {
    echo -e "${YELLOW}🔍 检查Docker环境...${NC}"
    check_docker
    
    echo -e "${YELLOW}📝 准备配置文件...${NC}"
    create_env_files
    create_simple_compose
    
    echo
    choose_deployment_mode
}

# 执行主函数
main "$@" 