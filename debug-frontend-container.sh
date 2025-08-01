#!/bin/bash

echo "🔍 调试前端容器内部文件结构..."

# 检查容器是否运行
echo "=== 容器状态 ==="
docker-compose -f docker-compose.production.yml ps frontend

# 进入容器检查文件结构
echo "=== 检查容器内 /usr/share/nginx/html 目录 ==="
docker exec deepneed-frontend-prod ls -la /usr/share/nginx/html/

echo "=== 检查容器内 assets 目录 ==="
docker exec deepneed-frontend-prod ls -la /usr/share/nginx/html/assets/ 2>/dev/null || echo "assets 目录不存在"

echo "=== 检查容器内 index.html 内容 ==="
docker exec deepneed-frontend-prod cat /usr/share/nginx/html/index.html

echo "=== 检查 nginx 配置 ==="
docker exec deepneed-frontend-prod cat /etc/nginx/conf.d/default.conf

echo "=== 检查 nginx 错误日志 ==="
docker exec deepneed-frontend-prod tail -20 /var/log/nginx/error.log 2>/dev/null || echo "无错误日志"

echo "=== 检查 nginx 访问日志 ==="
docker exec deepneed-frontend-prod tail -10 /var/log/nginx/access.log 2>/dev/null || echo "无访问日志"