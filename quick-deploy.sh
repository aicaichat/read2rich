#!/bin/bash

# DeepNeed 快速部署脚本 - 生产环境专用
# 使用方法: ./quick-deploy.sh [域名]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
DOMAIN="${1:-deepneed.com.cn}"
PROJECT_NAME="deepneed"

echo -e "${GREEN}🚀 DeepNeed 快速部署开始${NC}"
echo "域名: $DOMAIN"
echo ""

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker未安装${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose未安装${NC}"
    exit 1
fi

# 配置环境变量
if [[ ! -f ".env" ]]; then
    if [[ -f "env.example" ]]; then
        cp env.example .env
        sed -i "s/your-domain.com/$DOMAIN/g" .env
        echo -e "${GREEN}✅ 已创建.env文件${NC}"
        echo -e "${YELLOW}⚠️  请编辑.env文件，填入您的API keys${NC}"
        read -p "按回车键继续..."
    else
        echo -e "${RED}❌ 未找到env.example文件${NC}"
        exit 1
    fi
fi

# 检查API key
if ! grep -q "DEEPSEEK_API_KEY=.*[^[:space:]]" .env; then
    echo -e "${RED}❌ 请在.env文件中设置DEEPSEEK_API_KEY${NC}"
    exit 1
fi

# 部署Docker服务
echo -e "${BLUE}🐳 部署Docker服务...${NC}"
docker-compose -f docker-compose.production.yml down 2>/dev/null || true
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d

# 等待服务启动
echo "等待服务启动..."
sleep 15

# 配置Nginx (如果存在)
if command -v nginx &> /dev/null; then
    echo -e "${BLUE}🌐 配置Nginx...${NC}"
    
    # 备份现有配置
    if [[ -f "/etc/nginx/conf.d/$DOMAIN.conf" ]]; then
        cp "/etc/nginx/conf.d/$DOMAIN.conf" "/etc/nginx/conf.d/$DOMAIN.conf.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # 生成Nginx配置
    cat > /tmp/deepneed.conf << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log /var/log/nginx/$DOMAIN.error.log;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript;

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
        
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
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
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    server_tokens off;
}
EOF
    
    sudo cp /tmp/deepneed.conf "/etc/nginx/conf.d/$DOMAIN.conf"
    
    if sudo nginx -t; then
        sudo systemctl reload nginx
        echo -e "${GREEN}✅ Nginx配置完成${NC}"
    else
        echo -e "${RED}❌ Nginx配置错误${NC}"
        exit 1
    fi
fi

# 创建系统服务
echo -e "${BLUE}⚙️ 创建系统服务...${NC}"
cat > /tmp/deepneed.service << EOF
[Unit]
Description=DeepNeed Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$(pwd)
ExecStart=/usr/local/bin/docker-compose -f docker-compose.production.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.production.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo cp /tmp/deepneed.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable $PROJECT_NAME

# 健康检查
echo -e "${BLUE}🏥 健康检查...${NC}"
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 前端服务正常${NC}"
else
    echo -e "${RED}❌ 前端服务异常${NC}"
fi

if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端服务正常${NC}"
else
    echo -e "${YELLOW}⚠️ 后端健康检查失败${NC}"
fi

if curl -f http://$DOMAIN > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Nginx代理正常${NC}"
else
    echo -e "${RED}❌ Nginx代理异常${NC}"
fi

# 显示部署信息
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo ""
echo -e "${BLUE}📊 部署信息:${NC}"
echo "  域名: http://$DOMAIN"
echo "  前端端口: 3000"
echo "  后端端口: 8000"
echo "  项目目录: $(pwd)"
echo ""
echo -e "${BLUE}🔧 管理命令:${NC}"
echo "  查看状态: sudo systemctl status $PROJECT_NAME"
echo "  重启服务: sudo systemctl restart $PROJECT_NAME"
echo "  查看日志: sudo journalctl -u $PROJECT_NAME -f"
echo ""
echo -e "${BLUE}📝 下一步:${NC}"
echo "  1. 访问 http://$DOMAIN 查看应用"
echo "  2. 如需SSL: sudo certbot --nginx -d $DOMAIN"
echo "  3. 配置防火墙: sudo ufw allow 80,443"
echo "" 