#!/bin/bash

# Read2Rich 服务器部署脚本
# 一键部署到生产服务器

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Read2Rich 服务器部署脚本${NC}"
echo "=================================="

# 1. 更新代码
echo -e "${YELLOW}📥 拉取最新代码...${NC}"
git pull origin main

# 2. 构建并启动服务
echo -e "${YELLOW}🔨 构建 Docker 镜像...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

echo -e "${YELLOW}🚀 启动服务...${NC}"
docker compose -f docker-compose.prod.yml up -d

# 3. 检查服务状态
echo -e "${YELLOW}📊 检查服务状态...${NC}"
sleep 5
docker compose -f docker-compose.prod.yml ps

# 4. 测试服务
echo -e "${YELLOW}🧪 测试服务连接...${NC}"
echo "前端服务 (端口 8080):"
curl -s -o /dev/null -w "HTTP状态: %{http_code}\n" http://localhost:8080 || echo "前端服务未响应"

echo "后端服务 (端口 8001):"
curl -s -o /dev/null -w "HTTP状态: %{http_code}\n" http://localhost:8001/health || echo "后端服务未响应"

# 5. 显示日志
echo -e "${YELLOW}📋 显示最近日志...${NC}"
docker compose -f docker-compose.prod.yml logs --tail=20

echo -e "${GREEN}✅ 部署完成!${NC}"
echo "前端: http://localhost:8080"
echo "后端: http://localhost:8001"
echo
echo "查看实时日志: docker compose -f docker-compose.prod.yml logs -f"
