#!/bin/bash

# DeepNeed AI 生产环境快速部署脚本
# 基于当前的minimal_backend.py架构

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}🚀 DeepNeed AI 生产环境快速部署${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

# 检查系统
check_system() {
    echo -e "${YELLOW}🔍 检查系统环境...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker 未安装${NC}"
        echo -e "${YELLOW}请先安装Docker: curl -fsSL https://get.docker.com | sh${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose 未安装${NC}"
        echo -e "${YELLOW}请先安装Docker Compose${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 系统检查通过${NC}"
}

# 创建生产环境配置
create_production_config() {
    echo -e "${YELLOW}⚙️ 创建生产环境配置...${NC}"
    
    # 创建生产环境docker-compose文件
    cat > docker-compose.production.yml << 'EOF'
version: '3.8'

services:
  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    container_name: deepneed-nginx-prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - nginx-logs:/var/log/nginx
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - deepneed-prod

  # 前端静态文件服务
  frontend:
    image: node:18-alpine
    container_name: deepneed-frontend-prod
    working_dir: /app
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    environment:
      - NODE_ENV=production
      - VITE_API_URL=https://yourdomain.com/api
    command: sh -c "npm install -g pnpm && pnpm install && pnpm build && pnpm preview --host 0.0.0.0 --port 5173"
    expose:
      - "5173"
    restart: unless-stopped
    networks:
      - deepneed-prod

  # 后端服务（基于minimal_backend.py）
  backend:
    image: python:3.11-slim
    container_name: deepneed-backend-prod
    working_dir: /app
    volumes:
      - .:/app
      - backend-data:/app/data
    environment:
      - PYTHONPATH=/app
      - PYTHONUNBUFFERED=1
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
      - SECRET_KEY=${SECRET_KEY}
      - CORS_ORIGINS=${CORS_ORIGINS}
    command: sh -c "pip install --break-system-packages fastapi uvicorn httpx pydantic && python3 minimal_backend.py"
    expose:
      - "8001"
    restart: unless-stopped
    deploy:
      replicas: 2
    networks:
      - deepneed-prod

volumes:
  backend-data:
  nginx-logs:

networks:
  deepneed-prod:
    driver: bridge
EOF

    # 创建Nginx配置
    cat > nginx-prod.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 负载均衡后端
    upstream backend {
        server backend:8001;
    }
    
    # HTTP重定向到HTTPS
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }
    
    # HTTPS主配置
    server {
        listen 443 ssl http2;
        server_name _;
        
        # SSL配置
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
        # 安全头
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
        
        # API代理
        location /api/ {
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }
        
        # 静态文件
        location / {
            proxy_pass http://frontend:5173;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket支持
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
EOF

    echo -e "${GREEN}✅ 配置文件创建完成${NC}"
}

# 设置环境变量
setup_environment() {
    echo -e "${YELLOW}🔧 设置环境变量...${NC}"
    
    # 创建.env文件
    cat > .env << 'EOF'
# DeepNeed AI 生产环境配置

# 安全密钥（请修改为随机字符串）
SECRET_KEY=your_very_long_and_secure_secret_key_here

# Claude API密钥（请填入有效密钥）
CLAUDE_API_KEY=sk-ant-api03-your-claude-api-key

# CORS配置（请修改为您的域名）
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
EOF

    echo -e "${GREEN}✅ 环境变量配置完成${NC}"
    echo -e "${YELLOW}⚠️ 请编辑 .env 文件，修改API密钥和域名配置${NC}"
}

# 设置SSL证书
setup_ssl() {
    echo -e "${YELLOW}🔒 设置SSL证书...${NC}"
    
    mkdir -p ssl
    
    echo -e "${BLUE}请选择SSL证书配置方式：${NC}"
    echo "1) 自签名证书（测试用）"
    echo "2) Let's Encrypt证书（生产推荐）"
    echo "3) 已有证书文件"
    
    read -p "请选择 [1-3]: " ssl_choice
    
    case $ssl_choice in
        1)
            echo -e "${YELLOW}生成自签名证书...${NC}"
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout ssl/key.pem \
                -out ssl/cert.pem \
                -subj "/C=CN/ST=State/L=City/O=Organization/CN=localhost"
            ;;
        2)
            echo -e "${YELLOW}配置Let's Encrypt证书...${NC}"
            read -p "请输入您的域名: " domain
            
            # 安装certbot
            if command -v apt &> /dev/null; then
                sudo apt update && sudo apt install -y certbot
            elif command -v yum &> /dev/null; then
                sudo yum install -y certbot
            fi
            
            # 申请证书
            sudo certbot certonly --standalone -d $domain
            sudo cp /etc/letsencrypt/live/$domain/fullchain.pem ssl/cert.pem
            sudo cp /etc/letsencrypt/live/$domain/privkey.pem ssl/key.pem
            sudo chown $USER:$USER ssl/*
            ;;
        3)
            echo -e "${YELLOW}请将证书文件复制到以下位置：${NC}"
            echo "  证书文件: ssl/cert.pem"
            echo "  私钥文件: ssl/key.pem"
            read -p "完成后按Enter继续..."
            ;;
    esac
    
    if [ -f ssl/cert.pem ] && [ -f ssl/key.pem ]; then
        echo -e "${GREEN}✅ SSL证书配置完成${NC}"
    else
        echo -e "${RED}❌ SSL证书配置失败${NC}"
        exit 1
    fi
}

# 部署应用
deploy_application() {
    echo -e "${YELLOW}🚀 部署应用...${NC}"
    
    # 构建并启动服务
    docker-compose -f docker-compose.production.yml up -d --build
    
    # 等待服务启动
    echo -e "${BLUE}⏳ 等待服务启动...${NC}"
    sleep 30
    
    # 健康检查
    echo -e "${BLUE}🏥 执行健康检查...${NC}"
    if curl -k -f https://localhost/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 应用部署成功！${NC}"
    else
        echo -e "${YELLOW}⚠️ 健康检查未通过，请检查日志${NC}"
        docker-compose -f docker-compose.production.yml logs --tail=50
    fi
}

# 显示部署信息
show_deployment_info() {
    echo -e "${BLUE}======================================================${NC}"
    echo -e "${GREEN}🎉 DeepNeed AI 部署完成！${NC}"
    echo -e "${BLUE}======================================================${NC}"
    echo
    
    echo -e "${YELLOW}📡 服务地址：${NC}"
    echo -e "  🌐 应用首页:   https://yourdomain.com"
    echo -e "  🔧 API接口:    https://yourdomain.com/api"
    echo -e "  📊 健康检查:   https://yourdomain.com/api/health"
    echo
    
    echo -e "${YELLOW}🔧 管理命令：${NC}"
    echo -e "  查看状态:     docker-compose -f docker-compose.production.yml ps"
    echo -e "  查看日志:     docker-compose -f docker-compose.production.yml logs -f"
    echo -e "  重启服务:     docker-compose -f docker-compose.production.yml restart"
    echo -e "  停止服务:     docker-compose -f docker-compose.production.yml down"
    echo
    
    echo -e "${YELLOW}⚠️ 重要提醒：${NC}"
    echo -e "  1. 请修改 .env 文件中的API密钥和域名"
    echo -e "  2. 确保防火墙开放80和443端口"
    echo -e "  3. 配置DNS将域名指向服务器IP"
    echo -e "  4. 定期备份数据和更新证书"
    echo
}

# 主函数
main() {
    case "${1:-}" in
        --stop)
            echo -e "${YELLOW}🛑 停止生产环境...${NC}"
            docker-compose -f docker-compose.production.yml down
            echo -e "${GREEN}✅ 生产环境已停止${NC}"
            ;;
        --logs)
            docker-compose -f docker-compose.production.yml logs -f
            ;;
        --status)
            docker-compose -f docker-compose.production.yml ps
            ;;
        --restart)
            echo -e "${YELLOW}🔄 重启服务...${NC}"
            docker-compose -f docker-compose.production.yml restart
            echo -e "${GREEN}✅ 服务重启完成${NC}"
            ;;
        *)
            check_system
            create_production_config
            setup_environment
            setup_ssl
            deploy_application
            show_deployment_info
            ;;
    esac
}

# 执行主函数
main "$@" 