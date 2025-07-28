#!/bin/bash

echo "🚀 启动 DeepNeed 开发环境..."

# 检查是否已有进程在运行
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ 代理服务器已在运行 (端口 8000)"
else
    echo "📡 启动代理服务器..."
    python3 simple_proxy_server.py &
    PROXY_PID=$!
    echo "✅ 代理服务器已启动 (PID: $PROXY_PID)"
fi

# 等待代理服务器启动
sleep 2

echo "🌐 启动前端开发服务器..."
cd apps/web
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 开发环境启动完成！"
echo ""
echo "📡 代理服务器: http://localhost:8000"
echo "🌐 前端应用: http://localhost:5176"
echo ""
echo "💡 使用说明:"
echo "1. 访问 http://localhost:5176 使用应用"
echo "2. 访问 http://localhost:5176/test-ai 测试AI功能"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户停止
wait $FRONTEND_PID 