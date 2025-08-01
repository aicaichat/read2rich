#!/bin/bash

# DeepNeed 更新部署脚本 - 保持现有nginx和SSL配置
# 适用于已有运行版本的服务器更新

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

echo -e "${GREEN}🔄 DeepNeed 更新部署开始${NC}"
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

# 检查现有服务
echo -e "${BLUE}🔍 检查现有服务...${NC}"

# 检查现有容器
if docker-compose -f docker-compose.production.yml ps -q | grep -q .; then
    echo -e "${GREEN}✅ 检测到现有容器${NC}"
    EXISTING_CONTAINERS=true
else
    echo -e "${YELLOW}⚠️  未检测到现有容器${NC}"
    EXISTING_CONTAINERS=false
fi

# 检查nginx配置
if [[ -f "/etc/nginx/conf.d/$DOMAIN.conf" ]]; then
    echo -e "${GREEN}✅ 检测到现有nginx配置${NC}"
    EXISTING_NGINX=true
else
    echo -e "${YELLOW}⚠️  未检测到nginx配置${NC}"
    EXISTING_NGINX=false
fi

# 检查SSL证书
if [[ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]]; then
    echo -e "${GREEN}✅ 检测到SSL证书${NC}"
    SSL_EXISTS=true
else
    echo -e "${YELLOW}⚠️  未检测到SSL证书${NC}"
    SSL_EXISTS=false
fi

# 检查环境变量
if [[ ! -f ".env" ]]; then
    echo -e "${RED}❌ 未找到.env文件${NC}"
    echo "请确保.env文件存在并配置正确"
    exit 1
fi

# 检查API key
if ! grep -q "DEEPSEEK_API_KEY=.*[^[:space:]]" .env; then
    echo -e "${RED}❌ 请在.env文件中设置DEEPSEEK_API_KEY${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 环境检查完成${NC}"
echo ""

# 备份现有配置
echo -e "${BLUE}💾 备份现有配置...${NC}"

# 备份nginx配置
if [[ "$EXISTING_NGINX" == "true" ]]; then
    BACKUP_TIME=$(date +%Y%m%d_%H%M%S)
    sudo cp "/etc/nginx/conf.d/$DOMAIN.conf" "/etc/nginx/conf.d/$DOMAIN.conf.backup.$BACKUP_TIME"
    echo -e "${GREEN}✅ 已备份nginx配置${NC}"
fi

# 备份.env文件
if [[ -f ".env" ]]; then
    cp .env ".env.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}✅ 已备份.env文件${NC}"
fi

echo ""

# 停止现有服务
echo -e "${BLUE}🛑 停止现有服务...${NC}"
if [[ "$EXISTING_CONTAINERS" == "true" ]]; then
    docker-compose -f docker-compose.production.yml down
    echo -e "${GREEN}✅ 已停止现有容器${NC}"
else
    echo -e "${YELLOW}⚠️  无需停止容器${NC}"
fi

# 拉取最新代码（如果在git仓库中）
if [[ -d ".git" ]]; then
    echo -e "${BLUE}📥 拉取最新代码...${NC}"
    git pull origin main
    echo -e "${GREEN}✅ 代码更新完成${NC}"
fi

# 重新构建镜像
echo -e "${BLUE}🔨 重新构建镜像...${NC}"
docker-compose -f docker-compose.production.yml build --no-cache
echo -e "${GREEN}✅ 镜像构建完成${NC}"

# 启动服务
echo -e "${BLUE}🚀 启动服务...${NC}"
docker-compose -f docker-compose.production.yml up -d
echo -e "${GREEN}✅ 服务启动完成${NC}"

# 等待服务启动
echo "等待服务启动..."
sleep 20

# 更新nginx配置（如果需要）
if [[ "$EXISTING_NGINX" == "true" ]]; then
    echo -e "${BLUE}🌐 更新nginx配置...${NC}"
    
    # 生成新的nginx配置
    if [[ "$SSL_EXISTS" == "true" ]]; then
        # HTTPS配置
        cat > /tmp/deepneed_update.conf << EOF
# HTTPS配置 - $DOMAIN
server {
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

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

# HTTP重定向到HTTPS
server {
    if (\$host = www.$DOMAIN) {
        return 301 https://\$host\$request_uri;
    }

    if (\$host = $DOMAIN) {
        return 301 https://\$host\$request_uri;
    }

    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 404;
}
EOF
    else
        # HTTP配置
        cat > /tmp/deepneed_update.conf << EOF
# HTTP配置 - $DOMAIN
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
    fi
    
    # 更新nginx配置
    sudo cp /tmp/deepneed_update.conf "/etc/nginx/conf.d/$DOMAIN.conf"
    
    # 测试配置
    if sudo nginx -t; then
        sudo systemctl reload nginx
        echo -e "${GREEN}✅ nginx配置更新完成${NC}"
    else
        echo -e "${RED}❌ nginx配置错误，恢复备份${NC}"
        sudo cp "/etc/nginx/conf.d/$DOMAIN.conf.backup.$BACKUP_TIME" "/etc/nginx/conf.d/$DOMAIN.conf"
        sudo systemctl reload nginx
        exit 1
    fi
fi

# 健康检查
echo -e "${BLUE}🏥 健康检查...${NC}"

# 检查前端服务
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 前端服务正常${NC}"
else
    echo -e "${RED}❌ 前端服务异常${NC}"
    FRONTEND_ERROR=true
fi

# 检查后端服务
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端服务正常${NC}"
else
    echo -e "${YELLOW}⚠️  后端健康检查失败${NC}"
fi

# 检查域名访问
if [[ "$SSL_EXISTS" == "true" ]]; then
    PROTOCOL="https"
else
    PROTOCOL="http"
fi

if curl -f $PROTOCOL://$DOMAIN > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 域名访问正常 ($PROTOCOL://$DOMAIN)${NC}"
else
    echo -e "${RED}❌ 域名访问异常${NC}"
    DOMAIN_ERROR=true
fi

# 清理Docker缓存
echo -e "${BLUE}🧹 清理Docker缓存...${NC}"
docker system prune -f > /dev/null 2>&1 || true
echo -e "${GREEN}✅ 清理完成${NC}"

# 显示部署信息
echo ""
echo -e "${GREEN}🎉 更新部署完成！${NC}"
echo ""
echo -e "${BLUE}📊 部署信息:${NC}"
echo "  域名: $PROTOCOL://$DOMAIN"
echo "  前端端口: 3000"
echo "  后端端口: 8000"
echo "  项目目录: $(pwd)"
echo ""
echo -e "${BLUE}🔧 管理命令:${NC}"
echo "  查看容器状态: docker-compose -f docker-compose.production.yml ps"
echo "  查看容器日志: docker-compose -f docker-compose.production.yml logs -f"
echo "  重启服务: docker-compose -f docker-compose.production.yml restart"
echo "  查看nginx状态: sudo systemctl status nginx"
echo ""
echo -e "${BLUE}📝 备份文件:${NC}"
if [[ "$EXISTING_NGINX" == "true" ]]; then
    echo "  nginx配置: /etc/nginx/conf.d/$DOMAIN.conf.backup.$BACKUP_TIME"
fi
if [[ -f ".env.backup.$(date +%Y%m%d_%H%M%S)" ]]; then
    echo "  环境变量: .env.backup.$(date +%Y%m%d_%H%M%S)"
fi
echo ""

# 错误提示
if [[ "$FRONTEND_ERROR" == "true" || "$DOMAIN_ERROR" == "true" ]]; then
    echo -e "${YELLOW}⚠️  部分服务可能存在问题，请检查日志${NC}"
    echo "  查看前端日志: docker-compose -f docker-compose.production.yml logs frontend"
    echo "  查看后端日志: docker-compose -f docker-compose.production.yml logs backend"
    echo "  查看nginx日志: sudo tail -f /var/log/nginx/$DOMAIN.error.log"
    echo ""
fi

echo -e "${GREEN}✅ 更新部署流程完成${NC}" 