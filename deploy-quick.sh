#!/bin/bash
echo "🚀 DeepNeed 快速部署"

# 构建最新前端
echo "📦 构建前端..."
pnpm build

# 构建 Docker 镜像
echo "🐳 构建 Docker 镜像..."
docker build -f apps/web/Dockerfile -t deepneed-web:latest apps/web

# 启动服务
echo "🔄 启动服务..."
docker-compose -f docker-compose.simple.yml up -d

echo "✅ 部署完成！"
echo "🌐 访问: http://localhost:5173"
