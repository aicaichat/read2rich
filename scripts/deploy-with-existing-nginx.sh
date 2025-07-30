#!/bin/bash

# DeepNeed AI 适配现有Nginx环境的部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}🚀 DeepNeed AI 适配现有Nginx环境部署${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

# 检查是否为root用户
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ 请不要使用root用户运行此脚本${NC}"
    echo -e "${YELLOW}💡 建议使用具有sudo权限的普通用户${NC}"
    exit 1
fi

# 检查现有Nginx
check_existing_nginx() {
    echo -e "${YELLOW}🔍 检查现有Nginx配置...${NC}"
    
    if ! command -v nginx &> /dev/null; then
        echo -e "${RED}❌ 未找到Nginx，请先安装Nginx${NC}"
        exit 1
    fi
    
    # 检查Nginx状态
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx服务正在运行${NC}"
    else
        echo -e "${YELLOW}⚠️ Nginx服务未运行，正在启动...${NC}"
        sudo systemctl start nginx
        sudo systemctl enable nginx
    fi
    
    # 检查端口占用
    if netstat -tlnp 2>/dev/null | grep -q ":80 "; then
        echo -e "${GREEN}✅ 端口80已被占用（可能是Nginx）${NC}"
    fi
    
    if netstat -tlnp 2>/dev/null | grep -q ":443 "; then
        echo -e "${GREEN}✅ 端口443已被占用（可能是Nginx）${NC}"
    fi
    
    # 获取Nginx配置目录
    NGINX_CONF_DIR=$(nginx -t 2>&1 | grep "test is successful" | sed 's/.*configuration file \(.*\):.*/\1/' | xargs dirname 2>/dev/null || echo "/etc/nginx")
    echo -e "${BLUE}📁 Nginx配置目录: $NGINX_CONF_DIR${NC}"
}

# 检查Docker
check_docker() {
    echo -e "${YELLOW}🐳 检查Docker环境...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}📦 安装Docker...${NC}"
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        echo -e "${GREEN}✅ Docker安装完成${NC}"
        echo -e "${YELLOW}⚠️ 请重新登录或运行: newgrp docker${NC}"
        exit 0
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${YELLOW}📦 安装Docker Compose...${NC}"
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        echo -e "${GREEN}✅ Docker Compose安装完成${NC}"
    fi
}

# 创建环境配置文件
create_env_file() {
    echo -e "${YELLOW}⚙️ 创建环境配置文件...${NC}"
    
    # 生成随机密码
    SECRET_KEY=$(openssl rand -hex 32)
    POSTGRES_PASSWORD=$(openssl rand -base64 32)
    GRAFANA_PASSWORD=$(openssl rand -base64 16)
    
    cat > .env << EOF
# DeepNeed AI 生产环境配置（适配现有Nginx）
# ⚠️ 请根据实际情况修改以下配置

# 安全配置
SECRET_KEY=${SECRET_KEY}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
GRAFANA_PASSWORD=${GRAFANA_PASSWORD}

# AI API 密钥 (请填入您的实际密钥)
CLAUDE_API_KEY=sk-ant-api03-your-claude-api-key-here
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here

# 数据库配置
DATABASE_URL=postgresql://deepneed:${POSTGRES_PASSWORD}@postgres:5432/deepneed_prod

# Redis配置
REDIS_URL=redis://redis:6379/0

# 应用配置
DEBUG=false
LOG_LEVEL=info
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 域名配置 (请修改为您的实际域名)
DOMAIN=yourdomain.com
WWW_DOMAIN=www.yourdomain.com

# 端口配置（避免与现有Nginx冲突）
BACKEND_PORT=8001
GRAFANA_PORT=3001
EOF

    echo -e "${GREEN}✅ 环境配置文件已创建: .env${NC}"
    echo -e "${YELLOW}⚠️ 请编辑 .env 文件，填入您的实际配置${NC}"
}

# 创建适配现有Nginx的Docker Compose配置
create_nginx_compatible_compose() {
    echo -e "${YELLOW}🐳 创建适配现有Nginx的Docker Compose配置...${NC}"
    
    cat > docker-compose.nginx-compatible.yml << 'EOF'
version: '3.8'

services:
  # 后端API服务（不暴露80/443端口）
  backend:
    build:
      context: .
      dockerfile: docker/backend.Dockerfile
      target: production
    container_name: deepneed-backend-prod
    ports:
      - "8001:8000"  # 使用8001端口避免冲突
    volumes:
      - backend-data:/app/data
    environment:
      - PYTHONPATH=/app
      - DEBUG=false
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=${DATABASE_URL}
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - REDIS_URL=${REDIS_URL}
      - LOG_LEVEL=${LOG_LEVEL}
    depends_on:
      - postgres
      - redis
    networks:
      - deepneed-prod
    restart: unless-stopped

  # PostgreSQL数据库
  postgres:
    image: postgres:15-alpine
    container_name: deepneed-postgres-prod
    expose:
      - "5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=deepneed_prod
      - POSTGRES_USER=deepneed
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    networks:
      - deepneed-prod
    restart: unless-stopped

  # Redis缓存
  redis:
    image: redis:7-alpine
    container_name: deepneed-redis-prod
    expose:
      - "6379"
    volumes:
      - redis-data:/data
    networks:
      - deepneed-prod
    restart: unless-stopped

  # Grafana监控（使用3001端口避免冲突）
  grafana:
    image: grafana/grafana:latest
    container_name: deepneed-grafana-prod
    ports:
      - "3001:3000"  # 使用3001端口避免冲突
    volumes:
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
    networks:
      - deepneed-prod
    restart: unless-stopped

  # 前端构建服务（仅用于构建，不暴露端口）
  frontend-builder:
    build:
      context: .
      dockerfile: docker/frontend.Dockerfile
      target: production
    container_name: deepneed-frontend-builder
    volumes:
      - frontend-dist:/app/dist
    command: sh -c "cd /app && npm install -g pnpm && pnpm install && pnpm build"
    networks:
      - deepneed-prod

volumes:
  backend-data:
  postgres-data:
  redis-data:
  grafana-data:
  frontend-dist:

networks:
  deepneed-prod:
    driver: bridge
EOF

    echo -e "${GREEN}✅ Docker Compose配置已创建${NC}"
}

# 创建Nginx配置文件
create_nginx_config() {
    echo -e "${YELLOW}🌐 创建Nginx配置文件...${NC}"
    
    # 创建DeepNeed专用配置目录
    sudo mkdir -p /etc/nginx/sites-available/deepneed
    sudo mkdir -p /etc/nginx/sites-enabled/deepneed
    
    # 创建SSL证书目录
    sudo mkdir -p /etc/nginx/ssl/deepneed
    
    # 生成自签名证书（用于测试）
    if [ ! -f "/etc/nginx/ssl/deepneed/cert.pem" ]; then
        echo -e "${YELLOW}🔒 生成SSL证书...${NC}"
        sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/nginx/ssl/deepneed/key.pem \
            -out /etc/nginx/ssl/deepneed/cert.pem \
            -subj "/C=CN/ST=State/L=City/O=Organization/CN=localhost"
        sudo chmod 600 /etc/nginx/ssl/deepneed/key.pem
        sudo chmod 644 /etc/nginx/ssl/deepneed/cert.pem
    fi
    
    # 创建Nginx配置文件
    cat > deepneed.conf << 'EOF'
# DeepNeed AI Nginx配置
# 将此配置添加到您的Nginx配置中

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS主配置
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL配置
    ssl_certificate /etc/nginx/ssl/deepneed/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/deepneed/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # 前端静态文件
    location / {
        root /var/www/deepneed;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=31536000" always;
    }

    # API代理到后端服务
    location /api/ {
        proxy_pass http://localhost:8001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # 健康检查
    location /health {
        proxy_pass http://localhost:8001/health;
        access_log off;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}

# Grafana监控面板（可选）
server {
    listen 3001;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    echo -e "${GREEN}✅ Nginx配置文件已创建: deepneed.conf${NC}"
    echo -e "${YELLOW}⚠️ 请将此配置添加到您的Nginx配置中${NC}"
}

# 部署应用
deploy_app() {
    echo -e "${YELLOW}🚀 开始部署应用...${NC}"
    
    # 构建镜像
    echo -e "${BLUE}📦 构建Docker镜像...${NC}"
    docker-compose -f docker-compose.nginx-compatible.yml build --no-cache
    
    # 启动服务
    echo -e "${BLUE}🔄 启动服务...${NC}"
    docker-compose -f docker-compose.nginx-compatible.yml up -d
    
    # 等待服务启动
    echo -e "${BLUE}⏳ 等待服务启动...${NC}"
    sleep 30
    
    # 构建前端静态文件
    echo -e "${BLUE}🏗️ 构建前端静态文件...${NC}"
    docker-compose -f docker-compose.nginx-compatible.yml run --rm frontend-builder
    
    # 复制前端文件到Nginx目录
    echo -e "${BLUE}📁 复制前端文件到Nginx目录...${NC}"
    sudo mkdir -p /var/www/deepneed
    sudo docker cp deepneed-frontend-builder:/app/dist/. /var/www/deepneed/
    sudo chown -R www-data:www-data /var/www/deepneed
    
    # 健康检查
    echo -e "${BLUE}🏥 执行健康检查...${NC}"
    if curl -f http://localhost:8001/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 应用部署成功！${NC}"
    else
        echo -e "${YELLOW}⚠️ 健康检查失败，请检查日志${NC}"
        docker-compose -f docker-compose.nginx-compatible.yml logs
    fi
}

# 显示部署信息
show_info() {
    echo -e "${BLUE}======================================================${NC}"
    echo -e "${GREEN}🎉 DeepNeed AI 部署完成！${NC}"
    echo -e "${BLUE}======================================================${NC}"
    echo
    
    echo -e "${YELLOW}🌐 访问地址：${NC}"
    echo -e "  🏠 应用首页:      https://yourdomain.com"
    echo -e "  🔧 API文档:       https://yourdomain.com/docs"
    echo -e "  📊 监控面板:      http://yourdomain.com:3001"
    echo
    
    echo -e "${YELLOW}🔑 默认密码：${NC}"
    echo -e "  Grafana管理员:   admin / ${GRAFANA_PASSWORD}"
    echo
    
    echo -e "${YELLOW}🔧 管理命令：${NC}"
    echo -e "  查看状态:         docker-compose -f docker-compose.nginx-compatible.yml ps"
    echo -e "  查看日志:         docker-compose -f docker-compose.nginx-compatible.yml logs -f"
    echo -e "  停止服务:         docker-compose -f docker-compose.nginx-compatible.yml down"
    echo -e "  重启服务:         docker-compose -f docker-compose.nginx-compatible.yml restart"
    echo
    
    echo -e "${YELLOW}📝 Nginx配置：${NC}"
    echo -e "  配置文件:         deepneed.conf"
    echo -e "  静态文件目录:     /var/www/deepneed"
    echo -e "  SSL证书目录:      /etc/nginx/ssl/deepneed"
    echo
    
    echo -e "${YELLOW}⚠️ 重要提醒：${NC}"
    echo -e "  1. 请编辑 .env 文件，填入您的实际AI API密钥"
    echo -e "  2. 将 deepneed.conf 配置添加到您的Nginx配置中"
    echo -e "  3. 重新加载Nginx配置: sudo nginx -t && sudo systemctl reload nginx"
    echo -e "  4. 生产环境建议使用Let's Encrypt SSL证书"
    echo -e "  5. 请修改域名配置为您的实际域名"
    echo
    
    echo -e "${YELLOW}📝 下一步操作：${NC}"
    echo -e "  1. 编辑 .env 文件，配置AI API密钥"
    echo -e "  2. 将 deepneed.conf 添加到Nginx配置"
    echo -e "  3. 配置域名和SSL证书"
    echo -e "  4. 重新加载Nginx配置"
    echo
}

# 主函数
main() {
    case "${1:-}" in
        --help|-h)
            echo "使用方法: $0 [选项]"
            echo "选项:"
            echo "  --help, -h     显示帮助信息"
            echo "  --stop         停止服务"
            echo "  --logs         查看日志"
            echo "  --restart      重启服务"
            echo "  --nginx-config 仅生成Nginx配置"
            ;;
        --stop)
            echo -e "${YELLOW}🛑 停止服务...${NC}"
            docker-compose -f docker-compose.nginx-compatible.yml down
            echo -e "${GREEN}✅ 服务已停止${NC}"
            ;;
        --logs)
            docker-compose -f docker-compose.nginx-compatible.yml logs -f
            ;;
        --restart)
            echo -e "${YELLOW}🔄 重启服务...${NC}"
            docker-compose -f docker-compose.nginx-compatible.yml restart
            echo -e "${GREEN}✅ 服务已重启${NC}"
            ;;
        --nginx-config)
            check_existing_nginx
            create_nginx_config
            echo -e "${GREEN}✅ Nginx配置已生成${NC}"
            ;;
        *)
            check_existing_nginx
            check_docker
            create_env_file
            create_nginx_compatible_compose
            create_nginx_config
            deploy_app
            show_info
            ;;
    esac
}

# 执行主函数
main "$@" 