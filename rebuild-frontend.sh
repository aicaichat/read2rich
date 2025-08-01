#!/bin/bash

echo "🔄 重新构建前端容器..."

# 进入项目目录
cd /opt/deepneed

# 拉取最新代码
git pull origin main

# 停止前端容器
docker-compose -f docker-compose.production.yml stop frontend

# 删除旧的前端镜像和容器
docker-compose -f docker-compose.production.yml rm -f frontend
docker rmi deepneed-frontend 2>/dev/null || true

# 重新构建前端镜像
echo "构建前端镜像..."
docker-compose -f docker-compose.production.yml build --no-cache frontend

# 启动前端容器
echo "启动前端容器..."
docker-compose -f docker-compose.production.yml up -d frontend

# 检查容器状态
echo "检查容器状态..."
docker-compose -f docker-compose.production.yml ps

# 检查前端日志
echo "前端日志："
docker-compose -f docker-compose.production.yml logs --tail=20 frontend

echo "✅ 前端重新构建完成"