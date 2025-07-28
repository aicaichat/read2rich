#!/bin/bash

echo "======================================================"
echo "🐳 DeepNeed AI Docker 环境状态检查"
echo "======================================================"

echo ""
echo "📦 Docker 容器状态:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🔧 后端服务检查:"
if curl -s http://localhost:8001/health > /dev/null; then
    echo "✅ 后端服务正常 (http://localhost:8001)"
    echo "📊 健康状态: $(curl -s http://localhost:8001/health | jq -r '.status')"
else
    echo "❌ 后端服务未响应"
fi

echo ""
echo "🌐 前端服务检查:"
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ 前端服务正常 (http://localhost:5173)"
else
    echo "⏳ 前端服务启动中..."
    echo "📋 前端日志:"
    docker logs deepneed-frontend-simple --tail 5
fi

echo ""
echo "📡 服务地址:"
echo "  🌐 前端应用: http://localhost:5173"
echo "  🔧 后端API:  http://localhost:8001"
echo "  📚 API文档: http://localhost:8001/docs"
echo "  🏥 健康检查: http://localhost:8001/health"

echo ""
echo "💡 管理命令:"
echo "  查看日志: docker logs deepneed-frontend-simple"
echo "  查看日志: docker logs deepneed-backend-simple"
echo "  停止服务: ./quick-start.sh (选择4)"
echo "  重启服务: ./quick-start.sh (选择2)" 