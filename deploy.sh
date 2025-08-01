#!/bin/bash

# DeepNeed 完整部署脚本 v2.0.0
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置变量
PROJECT_NAME="deepneed"
DOMAIN="${1:-deepneed.com.cn}"
WEB_PORT="3000"
API_PORT="8000"

# 日志函数
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# 检查系统要求
check_requirements() {
    log_info "检查系统要求..."
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装"
        exit 1
    fi
    
    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose未安装"
        exit 1
    fi
    
    # 检查Nginx
    if ! command -v nginx &> /dev/null; then
        log_warning "Nginx未安装，将跳过Nginx配置"
    fi
    
    log_success "系统要求检查通过"
}

# 配置环境变量
setup_env() {
    log_info "配置环境变量..."
    
    if [[ ! -f ".env" ]]; then
        if [[ -f "env.example" ]]; then
            cp env.example .env
            sed -i "s/your-domain.com/$DOMAIN/g" .env
            log_success "已创建.env文件"
            log_warning "请编辑.env文件，填入您的API keys"
            read -p "按回车键继续..."
        else
            log_error "未找到env.example文件"
            exit 1
        fi
    fi
    
    # 检查API key
    if ! grep -q "DEEPSEEK_API_KEY=.*[^[:space:]]" .env; then
        log_error "请在.env文件中设置DEEPSEEK_API_KEY"
        exit 1
    fi
    
    log_success "环境变量配置完成"
}

# 部署Docker服务
deploy_docker() {
    log_info "部署Docker服务..."
    
    # 停止现有容器
    docker-compose -f docker-compose.production.yml down 2>/dev/null || true
    
    # 构建镜像
    docker-compose -f docker-compose.production.yml build
    
    # 启动服务
    docker-compose -f docker-compose.production.yml up -d
    
    # 等待启动
    sleep 15
    
    log_success "Docker服务部署完成"
}

# 配置Nginx
configure_nginx() {
    if ! command -v nginx &> /dev/null; then
        log_warning "跳过Nginx配置"
        return
    fi
    
    log_info "配置Nginx..."
    
    local nginx_conf="/etc/nginx/conf.d/$DOMAIN.conf"
    
    # 备份现有配置
    if [[ -f "$nginx_conf" ]]; then
        cp "$nginx_conf" "$nginx_conf.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # 生成配置
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
        proxy_pass http://localhost:$WEB_PORT;
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
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:$WEB_PORT;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    server_tokens off;
}
EOF
    
    sudo cp /tmp/deepneed.conf "$nginx_conf"
    
    # 测试配置
    if sudo nginx -t; then
        sudo systemctl reload nginx
        log_success "Nginx配置完成"
    else
        log_error "Nginx配置错误"
        exit 1
    fi
}

# 创建系统服务
create_service() {
    log_info "创建系统服务..."
    
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
    
    sudo cp /tmp/deepneed.service /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable $PROJECT_NAME
    
    log_success "系统服务创建完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 检查前端
    if curl -f http://localhost:$WEB_PORT > /dev/null 2>&1; then
        log_success "前端服务正常"
    else
        log_error "前端服务异常"
    fi
    
    # 检查后端
    if curl -f http://localhost:$API_PORT/health > /dev/null 2>&1; then
        log_success "后端服务正常"
    else
        log_warning "后端健康检查失败"
    fi
    
    # 检查Nginx
    if curl -f http://$DOMAIN > /dev/null 2>&1; then
        log_success "Nginx代理正常"
    else
        log_error "Nginx代理异常"
    fi
}

# 显示部署信息
show_info() {
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
    echo "  查看状态: sudo systemctl status $PROJECT_NAME"
    echo "  重启服务: sudo systemctl restart $PROJECT_NAME"
    echo "  查看日志: sudo journalctl -u $PROJECT_NAME -f"
    echo ""
    echo -e "${BLUE}📝 下一步:${NC}"
    echo "  1. 访问 http://$DOMAIN 查看应用"
    echo "  2. 如需SSL: sudo certbot --nginx -d $DOMAIN"
    echo "  3. 配置防火墙: sudo ufw allow 80,443"
    echo ""
}

# 主执行流程
main() {
    echo -e "${GREEN}🚀 DeepNeed 部署开始${NC}"
    echo "域名: $DOMAIN"
    echo ""
    
    check_requirements
    setup_env
    deploy_docker
    configure_nginx
    create_service
    health_check
    show_info
}

main "$@" 