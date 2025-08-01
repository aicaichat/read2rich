#!/bin/bash

# DeepNeed 部署修复脚本
# 解决Nginx配置和Docker服务问题

set -e

echo "🔧 开始修复 DeepNeed 部署问题..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_NAME="deepneed"
DOMAIN="deepneed.com.cn"
WEB_PORT="3000"
API_PORT="8000"
PROJECT_DIR="/opt/deepneed"

echo -e "${BLUE}📋 修复配置:${NC}"
echo "  域名: $DOMAIN"
echo "  前端端口: $WEB_PORT"
echo "  后端端口: $API_PORT"
echo "  项目目录: $PROJECT_DIR"
echo ""

# 1. 检查Docker服务状态
check_docker_services() {
    echo -e "${BLUE}🔍 检查Docker服务状态...${NC}"
    
    if [ ! -d "$PROJECT_DIR" ]; then
        echo -e "${RED}❌ 项目目录不存在: $PROJECT_DIR${NC}"
        exit 1
    fi
    
    cd "$PROJECT_DIR"
    
    # 检查容器状态
    echo "检查容器状态..."
    docker-compose -f docker-compose.production.yml ps
    
    # 检查容器日志
    echo -e "\n${YELLOW}📋 前端容器日志:${NC}"
    docker-compose -f docker-compose.production.yml logs --tail=20 frontend
    
    echo -e "\n${YELLOW}📋 后端容器日志:${NC}"
    docker-compose -f docker-compose.production.yml logs --tail=20 backend
}

# 2. 重启Docker服务
restart_docker_services() {
    echo -e "${BLUE}🔄 重启Docker服务...${NC}"
    
    cd "$PROJECT_DIR"
    
    # 停止现有服务
    echo "停止现有服务..."
    docker-compose -f docker-compose.production.yml down
    
    # 重新构建并启动
    echo "重新构建并启动服务..."
    docker-compose -f docker-compose.production.yml up -d --build
    
    # 等待服务启动
    echo "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    echo "检查服务状态..."
    docker-compose -f docker-compose.production.yml ps
}

# 3. 修复Nginx配置
fix_nginx_config() {
    echo -e "${BLUE}🔧 修复Nginx配置...${NC}"
    
    # 备份当前配置
    if [ -f "/etc/nginx/conf.d/$DOMAIN.conf" ]; then
        cp "/etc/nginx/conf.d/$DOMAIN.conf" "/etc/nginx/conf.d/$DOMAIN.conf.backup.$(date +%Y%m%d_%H%M%S)"
        echo -e "${GREEN}✅ 已备份当前Nginx配置${NC}"
    fi
    
    # 创建正确的Nginx配置
    cat > "/etc/nginx/conf.d/$DOMAIN.conf" << EOF
server {
    server_name $DOMAIN www.$DOMAIN;
    
    # 日志配置
    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log /var/log/nginx/$DOMAIN.error.log;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # 前端代理
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
        
        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
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
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # 隐藏 Nginx 版本
    server_tokens off;

    # 404 页面
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    listen 80;
}

# HTTPS配置（如果存在SSL证书）
server {
    server_name $DOMAIN www.$DOMAIN;
    
    # 日志配置
    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log /var/log/nginx/$DOMAIN.error.log;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # 前端代理
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
        
        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
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
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # 隐藏 Nginx 版本
    server_tokens off;

    # 404 页面
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if (\$host = www.$DOMAIN) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot

    if (\$host = $DOMAIN) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot

    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 404; # managed by Certbot
}
EOF

    echo -e "${GREEN}✅ 已创建正确的Nginx配置${NC}"
    
    # 测试Nginx配置
    echo "测试Nginx配置..."
    nginx -t
    
    # 重新加载Nginx
    echo "重新加载Nginx..."
    systemctl reload nginx
    
    echo -e "${GREEN}✅ Nginx配置修复完成${NC}"
}

# 4. 健康检查
health_check() {
    echo -e "${BLUE}🏥 健康检查...${NC}"
    
    # 检查Docker服务
    echo "检查Docker服务..."
    if curl -s http://localhost:$WEB_PORT > /dev/null; then
        echo -e "${GREEN}✅ 前端服务正常${NC}"
    else
        echo -e "${RED}❌ 前端服务异常${NC}"
    fi
    
    if curl -s http://localhost:$API_PORT > /dev/null; then
        echo -e "${GREEN}✅ 后端服务正常${NC}"
    else
        echo -e "${YELLOW}⚠️  后端服务异常（可能没有/health端点）${NC}"
    fi
    
    # 检查Nginx代理
    if curl -s http://localhost > /dev/null; then
        echo -e "${GREEN}✅ Nginx代理正常${NC}"
    else
        echo -e "${RED}❌ Nginx代理异常${NC}"
    fi
}

# 5. 显示修复结果
show_results() {
    echo -e "\n${GREEN}🎉 修复完成！${NC}"
    echo ""
    echo -e "${BLUE}📊 修复信息:${NC}"
    echo "  域名: https://$DOMAIN"
    echo "  前端端口: $WEB_PORT"
    echo "  后端端口: $API_PORT"
    echo "  项目目录: $PROJECT_DIR"
    echo ""
    echo -e "${BLUE}🔧 管理命令:${NC}"
    echo "  查看服务状态: sudo systemctl status deepneed"
    echo "  重启服务: sudo systemctl restart deepneed"
    echo "  查看日志: sudo journalctl -u deepneed -f"
    echo "  查看容器: docker-compose -f $PROJECT_DIR/docker-compose.production.yml ps"
    echo ""
    echo -e "${BLUE}📝 下一步:${NC}"
    echo "  1. 访问 https://$DOMAIN 查看应用"
    echo "  2. 如果仍有问题，检查容器日志"
    echo "  3. 确保.env文件配置正确"
}

# 主执行流程
main() {
    check_docker_services
    echo ""
    restart_docker_services
    echo ""
    fix_nginx_config
    echo ""
    health_check
    echo ""
    show_results
}

# 执行主函数
main 