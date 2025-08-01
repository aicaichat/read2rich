#!/bin/bash

# DeepNeed 快速部署脚本 - 使用现有nginx
# 适用于已有nginx的服务器

set -e

# 检查是否为root用户（可选）
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  检测到使用root用户运行"
    echo "建议使用普通用户运行以提高安全性"
    echo "是否继续？(y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "部署已取消"
        exit 1
    fi
fi

# 配置
DOMAIN="${1:-your-domain.com}"
PROJECT_DIR="/opt/deepneed"

echo "🚀 DeepNeed 快速部署开始..."
echo "域名: $DOMAIN"

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "❌ 未找到 .env 文件"
    echo "请先配置环境变量："
    echo "1. 复制 env.example 为 .env"
    echo "2. 编辑 .env 文件，填入您的API keys"
    echo "3. 重新运行此脚本"
    exit 1
fi

# 检查必需的API key
if ! grep -q "DEEPSEEK_API_KEY=.*[^[:space:]]" .env; then
    echo "❌ 请在 .env 文件中设置 DEEPSEEK_API_KEY"
    exit 1
fi

echo "✅ 环境变量检查通过"

# 1. 创建项目目录
echo "📁 创建项目目录..."
mkdir -p $PROJECT_DIR

# 如果是root用户，设置适当的权限
if [ "$EUID" -eq 0 ]; then
    # 获取当前用户（如果通过sudo运行）
    ACTUAL_USER=${SUDO_USER:-$USER}
    chown $ACTUAL_USER:$ACTUAL_USER $PROJECT_DIR
fi

cp -r . $PROJECT_DIR/
cd $PROJECT_DIR

# 2. 启动Docker服务
echo "🐳 启动Docker服务..."
docker-compose -f docker-compose.production.yml down 2>/dev/null || true
docker-compose -f docker-compose.production.yml up -d

# 3. 配置nginx
echo "🌐 配置nginx..."
sudo tee /etc/nginx/sites-available/deepneed > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/deepneed /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 4. 创建systemd服务
echo "⚙️ 创建systemd服务..."
sudo tee /etc/systemd/system/deepneed.service > /dev/null << EOF
[Unit]
Description=DeepNeed Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.production.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.production.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable deepneed

# 5. 等待服务启动
echo "⏳ 等待服务启动..."
sleep 15

# 6. 检查服务状态
echo "🏥 检查服务状态..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 前端服务正常"
else
    echo "❌ 前端服务异常"
fi

if curl -f http://localhost:8000 > /dev/null 2>&1; then
    echo "✅ 后端服务正常"
else
    echo "❌ 后端服务异常"
fi

echo ""
echo "🎉 部署完成！"
echo "访问地址: http://$DOMAIN"
echo ""
echo "管理命令:"
echo "  重启服务: sudo systemctl restart deepneed"
echo "  查看状态: sudo systemctl status deepneed"
echo "  查看日志: sudo journalctl -u deepneed -f" 