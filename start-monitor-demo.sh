#!/bin/bash

echo "🚀 启动 AI Opportunity Finder 监控演示"
echo "====================================="

# 确保在正确的目录
cd /Users/mac/deepneed

# 检查前端依赖
echo "📦 检查前端依赖..."
if [ ! -d "apps/web/node_modules" ]; then
    echo "安装前端依赖..."
    cd apps/web && npm install && cd ../..
fi

# 启动前端开发服务器
echo "🌐 启动前端开发服务器..."
cd apps/web && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 服务启动完成！"
echo ""
echo "📱 前端界面: http://localhost:5173"
echo "🔧 管理界面: http://localhost:5173/admin/opportunity-finder"
echo ""
echo "📋 登录信息:"
echo "   管理员登录: http://localhost:5173/admin/login"
echo "   (如果需要的话)"
echo ""
echo "🎯 功能说明:"
echo "   • 实时监控爬虫服务状态"
echo "   • 查看数据源连接情况"
echo "   • 监控系统指标和日志"
echo "   • 配置通知和告警"
echo "   • 手动触发数据抓取"
echo ""
echo "⚡ 后端状态:"
echo "   Opportunity Finder API: http://localhost:8081"
echo "   (连接后端以获取真实数据)"
echo ""
echo "💡 提示:"
echo "   • 当前使用Mock数据进行演示"
echo "   • 可配置Slack Webhook接收通知"
echo "   • 支持浏览器桌面通知"
echo ""
echo "按 Ctrl+C 停止服务..."

# 等待用户中断
wait $FRONTEND_PID