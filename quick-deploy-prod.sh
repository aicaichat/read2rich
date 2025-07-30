#!/bin/bash

# DeepNeed AI 快速生产环境部署脚本
# 适用于大多数云服务器环境

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}🚀 DeepNeed AI 快速生产环境部署${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

# 检查是否为root用户
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ 请不要使用root用户运行此脚本${NC}"
    echo -e "${YELLOW}💡 建议使用具有sudo权限的普通用户${NC}"
    exit 1
fi

# 检查Docker
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

# 检查Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}📦 安装Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose安装完成${NC}"
fi

# 创建环境配置文件
create_env_file() {
    echo -e "${YELLOW}⚙️ 创建环境配置文件...${NC}"
    
    # 生成随机密码
    SECRET_KEY=$(openssl rand -hex 32)
    POSTGRES_PASSWORD=$(openssl rand -base64 32)
    GRAFANA_PASSWORD=$(openssl rand -base64 16)
    
    cat > .env << EOF
# DeepNeed AI 生产环境配置
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
EOF

    echo -e "${GREEN}✅ 环境配置文件已创建: .env${NC}"
    echo -e "${YELLOW}⚠️ 请编辑 .env 文件，填入您的实际配置${NC}"
}

# 创建SSL证书
create_ssl_cert() {
    echo -e "${YELLOW}🔒 创建SSL证书...${NC}"
    
    # 创建SSL目录
    mkdir -p docker/nginx/ssl
    
    # 生成自签名证书（用于测试）
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout docker/nginx/ssl/key.pem \
        -out docker/nginx/ssl/cert.pem \
        -subj "/C=CN/ST=State/L=City/O=Organization/CN=localhost"
    
    echo -e "${GREEN}✅ SSL证书已创建${NC}"
    echo -e "${YELLOW}💡 生产环境建议使用Let's Encrypt证书${NC}"
}

# 创建Nginx配置
create_nginx_config() {
    echo -e "${YELLOW}🌐 创建Nginx配置...${NC}"
    
    mkdir -p docker/nginx
    
    cat > docker/nginx/default.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name localhost;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # 前端静态文件
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=31536000" always;
    }

    # API代理
    location /api/ {
        proxy_pass http://backend:8000/;
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
        proxy_pass http://backend:8000/health;
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
EOF

    echo -e "${GREEN}✅ Nginx配置已创建${NC}"
}

# 创建简化的生产环境Docker Compose配置
create_prod_compose() {
    echo -e "${YELLOW}🐳 创建生产环境Docker Compose配置...${NC}"
    
    cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  # Nginx 反向代理
  nginx:
    build:
      context: .
      dockerfile: docker/frontend.Dockerfile
      target: production
    container_name: deepneed-nginx-prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/ssl:/etc/nginx/ssl:ro
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - backend
    networks:
      - deepneed-prod
    restart: unless-stopped

  # 后端API服务
  backend:
    build:
      context: .
      dockerfile: docker/backend.Dockerfile
      target: production
    container_name: deepneed-backend-prod
    expose:
      - "8000"
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

  # Grafana监控
  grafana:
    image: grafana/grafana:latest
    container_name: deepneed-grafana-prod
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
    networks:
      - deepneed-prod
    restart: unless-stopped

volumes:
  backend-data:
  postgres-data:
  redis-data:
  grafana-data:

networks:
  deepneed-prod:
    driver: bridge
EOF

    echo -e "${GREEN}✅ Docker Compose配置已创建${NC}"
}

# 部署应用
deploy_app() {
    echo -e "${YELLOW}🚀 开始部署应用...${NC}"
    
    # 构建镜像
    echo -e "${BLUE}📦 构建Docker镜像...${NC}"
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # 启动服务
    echo -e "${BLUE}🔄 启动服务...${NC}"
    docker-compose -f docker-compose.prod.yml up -d
    
    # 等待服务启动
    echo -e "${BLUE}⏳ 等待服务启动...${NC}"
    sleep 30
    
    # 健康检查
    echo -e "${BLUE}🏥 执行健康检查...${NC}"
    if curl -f http://localhost/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 应用部署成功！${NC}"
    else
        echo -e "${YELLOW}⚠️ 健康检查失败，请检查日志${NC}"
        docker-compose -f docker-compose.prod.yml logs
    fi
}

# 显示部署信息
show_info() {
    echo -e "${BLUE}======================================================${NC}"
    echo -e "${GREEN}🎉 DeepNeed AI 生产环境部署完成！${NC}"
    echo -e "${BLUE}======================================================${NC}"
    echo
    
    echo -e "${YELLOW}🌐 访问地址：${NC}"
    echo -e "  🏠 应用首页:      https://localhost"
    echo -e "  🔧 API文档:       https://localhost/docs"
    echo -e "  📊 监控面板:      http://localhost:3000"
    echo
    
    echo -e "${YELLOW}🔑 默认密码：${NC}"
    echo -e "  Grafana管理员:   admin / ${GRAFANA_PASSWORD}"
    echo
    
    echo -e "${YELLOW}🔧 管理命令：${NC}"
    echo -e "  查看状态:         docker-compose -f docker-compose.prod.yml ps"
    echo -e "  查看日志:         docker-compose -f docker-compose.prod.yml logs -f"
    echo -e "  停止服务:         docker-compose -f docker-compose.prod.yml down"
    echo -e "  重启服务:         docker-compose -f docker-compose.prod.yml restart"
    echo
    
    echo -e "${YELLOW}⚠️ 重要提醒：${NC}"
    echo -e "  1. 请编辑 .env 文件，填入您的实际AI API密钥"
    echo -e "  2. 生产环境建议使用Let's Encrypt SSL证书"
    echo -e "  3. 请修改域名配置为您的实际域名"
    echo -e "  4. 建议配置防火墙，只开放必要端口"
    echo -e "  5. 定期备份数据库和应用数据"
    echo
    
    echo -e "${YELLOW}📝 下一步操作：${NC}"
    echo -e "  1. 编辑 .env 文件，配置AI API密钥"
    echo -e "  2. 配置域名和SSL证书"
    echo -e "  3. 设置防火墙规则"
    echo -e "  4. 配置监控告警"
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
            ;;
        --stop)
            echo -e "${YELLOW}🛑 停止服务...${NC}"
            docker-compose -f docker-compose.prod.yml down
            echo -e "${GREEN}✅ 服务已停止${NC}"
            ;;
        --logs)
            docker-compose -f docker-compose.prod.yml logs -f
            ;;
        --restart)
            echo -e "${YELLOW}🔄 重启服务...${NC}"
            docker-compose -f docker-compose.prod.yml restart
            echo -e "${GREEN}✅ 服务已重启${NC}"
            ;;
        *)
            create_env_file
            create_ssl_cert
            create_nginx_config
            create_prod_compose
            deploy_app
            show_info
            ;;
    esac
}

# 执行主函数
main "$@" 