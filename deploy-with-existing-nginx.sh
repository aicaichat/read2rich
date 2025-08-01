#!/bin/bash

# DeepNeed 项目部署脚本 - 使用现有nginx
# 适用于已有nginx的服务器

set -e

echo "🚀 开始部署 DeepNeed 项目..."

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

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_NAME="deepneed"
DOMAIN="${1:-your-domain.com}"
WEB_PORT="3000"
API_PORT="8000"
NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"

# 检查环境变量文件
check_env_file() {
    echo -e "${BLUE}🔍 检查环境变量配置...${NC}"
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  未找到 .env 文件${NC}"
        echo "请按照以下步骤配置环境变量："
        echo "1. 复制 env.example 为 .env"
        echo "2. 编辑 .env 文件，填入您的API keys"
        echo ""
        echo "是否要现在创建 .env 文件？(y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            if [ -f "env.example" ]; then
                cp env.example .env
                echo -e "${GREEN}✅ 已创建 .env 文件${NC}"
                echo -e "${YELLOW}⚠️  请编辑 .env 文件，填入您的API keys${NC}"
                echo "按回车键继续..."
                read
            else
                echo -e "${RED}❌ 未找到 env.example 文件${NC}"
                exit 1
            fi
        else
            echo -e "${RED}❌ 部署已取消${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ 找到 .env 文件${NC}"
    fi
    
    # 检查必需的API key
    if ! grep -q "DEEPSEEK_API_KEY=.*[^[:space:]]" .env; then
        echo -e "${RED}❌ 请在 .env 文件中设置 DEEPSEEK_API_KEY${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 环境变量检查通过${NC}"
}

echo -e "${BLUE}📋 部署配置:${NC}"
echo "  域名: $DOMAIN"
echo "  前端端口: $WEB_PORT"
echo "  后端端口: $API_PORT"
echo ""

# 检查Docker和Docker Compose
check_dependencies() {
    echo -e "${BLUE}🔍 检查依赖...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker 未安装${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose 未安装${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 依赖检查通过${NC}"
}

# 创建项目目录
setup_project() {
    echo -e "${BLUE}📁 设置项目目录...${NC}"
    
    # 创建项目目录
    mkdir -p /opt/$PROJECT_NAME
    
    # 如果是root用户，设置适当的权限
    if [ "$EUID" -eq 0 ]; then
        # 获取当前用户（如果通过sudo运行）
        ACTUAL_USER=${SUDO_USER:-$USER}
        chown $ACTUAL_USER:$ACTUAL_USER /opt/$PROJECT_NAME
    fi
    
    # 复制项目文件
    cp -r . /opt/$PROJECT_NAME/
    cd /opt/$PROJECT_NAME
    
    echo -e "${GREEN}✅ 项目目录设置完成${NC}"
}

# 构建和启动服务
deploy_services() {
    echo -e "${BLUE}🐳 构建和启动Docker服务...${NC}"
    
    # 停止现有容器
    docker-compose -f docker-compose.production.yml down 2>/dev/null || true
    
    # 构建镜像
    echo "构建前端镜像..."
    docker-compose -f docker-compose.production.yml build web
    
    echo "构建后端镜像..."
    docker-compose -f docker-compose.production.yml build api
    
    # 启动服务
    echo "启动服务..."
    docker-compose -f docker-compose.production.yml up -d
    
    echo -e "${GREEN}✅ 服务启动完成${NC}"
}

# 配置nginx
configure_nginx() {
    echo -e "${BLUE}🌐 配置nginx...${NC}"
    
    # 创建nginx配置文件
    cat > /tmp/deepneed.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # 前端静态文件
    location / {
        proxy_pass http://localhost:$WEB_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://localhost:$API_PORT/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:$WEB_PORT;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    # 复制配置文件
    cp /tmp/deepneed.conf $NGINX_CONF_DIR/deepneed
    
    # 启用站点
    ln -sf $NGINX_CONF_DIR/deepneed $NGINX_ENABLED_DIR/deepneed
    
    # 测试nginx配置
    if nginx -t; then
        systemctl reload nginx
        echo -e "${GREEN}✅ nginx配置完成${NC}"
    else
        echo -e "${RED}❌ nginx配置错误${NC}"
        exit 1
    fi
}

# 设置SSL证书（可选）
setup_ssl() {
    echo -e "${BLUE}🔒 设置SSL证书...${NC}"
    
    if command -v certbot &> /dev/null; then
        echo "检测到certbot，是否要设置SSL证书？(y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            certbot --nginx -d $DOMAIN
            echo -e "${GREEN}✅ SSL证书设置完成${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  certbot未安装，跳过SSL设置${NC}"
        echo "如需SSL，请手动安装certbot: apt install certbot python3-certbot-nginx"
    fi
}

# 创建systemd服务
create_systemd_service() {
    echo -e "${BLUE}⚙️ 创建systemd服务...${NC}"
    
    # 创建服务文件
    cat > /tmp/deepneed.service << EOF
[Unit]
Description=DeepNeed Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/$PROJECT_NAME
ExecStart=/usr/local/bin/docker-compose -f docker-compose.production.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.production.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF
    
    cp /tmp/deepneed.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable deepneed
    
    echo -e "${GREEN}✅ systemd服务创建完成${NC}"
}

# 健康检查
health_check() {
    echo -e "${BLUE}🏥 健康检查...${NC}"
    
    # 等待服务启动
    sleep 10
    
    # 检查前端
    if curl -f http://localhost:$WEB_PORT > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 前端服务正常${NC}"
    else
        echo -e "${RED}❌ 前端服务异常${NC}"
    fi
    
    # 检查后端
    if curl -f http://localhost:$API_PORT/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 后端服务正常${NC}"
    else
        echo -e "${YELLOW}⚠️ 后端健康检查失败（可能没有/health端点）${NC}"
    fi
    
    # 检查nginx
    if curl -f http://$DOMAIN > /dev/null 2>&1; then
        echo -e "${GREEN}✅ nginx代理正常${NC}"
    else
        echo -e "${RED}❌ nginx代理异常${NC}"
    fi
}

# 显示部署信息
show_deployment_info() {
    echo ""
    echo -e "${GREEN}🎉 部署完成！${NC}"
    echo ""
    echo -e "${BLUE}📊 部署信息:${NC}"
    echo "  域名: http://$DOMAIN"
    echo "  前端端口: $WEB_PORT"
    echo "  后端端口: $API_PORT"
    echo "  项目目录: /opt/$PROJECT_NAME"
    echo ""
    echo -e "${BLUE}🔧 管理命令:${NC}"
    echo "  查看服务状态: sudo systemctl status deepneed"
    echo "  重启服务: sudo systemctl restart deepneed"
    echo "  查看日志: sudo journalctl -u deepneed -f"
    echo "  查看容器: docker-compose -f /opt/$PROJECT_NAME/docker-compose.production.yml ps"
    echo ""
    echo -e "${BLUE}📝 下一步:${NC}"
    echo "  1. 访问 http://$DOMAIN 查看应用"
    echo "  2. 如需SSL，运行: sudo certbot --nginx -d $DOMAIN"
    echo "  3. 配置防火墙: sudo ufw allow 80,443"
    echo ""
}

# 主执行流程
main() {
    echo -e "${GREEN}🚀 DeepNeed 项目部署开始${NC}"
    echo ""
    
    check_dependencies
    check_env_file
    setup_project
    deploy_services
    configure_nginx
    setup_ssl
    create_systemd_service
    health_check
    show_deployment_info
}

# 执行主函数
main "$@" 