#!/bin/bash

# Read2Rich Nginx & SSL Setup Script
# 为 read2rich.com 设置 Nginx 和 HTTPS 证书

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
DOMAIN="read2rich.com"
WWW_DOMAIN="www.read2rich.com"
EMAIL="admin@read2rich.com"  # 请修改为您的邮箱
NGINX_CONF_DIR="/etc/nginx/conf.d"
NGINX_CONF_FILE="${NGINX_CONF_DIR}/${DOMAIN}.conf"
FRONTEND_PORT="8080"
BACKEND_PORT="8001"

echo -e "${BLUE}🚀 Read2Rich Nginx & SSL 配置脚本${NC}"
echo "=================================="

# 检查是否为 root 用户
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ 此脚本需要 root 权限运行${NC}"
   echo "请使用: sudo $0"
   exit 1
fi

# 1. 检查并安装必要软件
echo -e "${YELLOW}📦 检查并安装必要软件...${NC}"

# 检查 nginx
if ! command -v nginx &> /dev/null; then
    echo "安装 Nginx..."
    if command -v yum &> /dev/null; then
        yum install -y nginx
    elif command -v apt &> /dev/null; then
        apt update && apt install -y nginx
    else
        echo -e "${RED}❌ 无法检测包管理器，请手动安装 nginx${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Nginx 已安装${NC}"
fi

# 检查 certbot
if ! command -v certbot &> /dev/null; then
    echo "安装 Certbot..."
    if command -v yum &> /dev/null; then
        yum install -y certbot python3-certbot-nginx
    elif command -v apt &> /dev/null; then
        apt install -y certbot python3-certbot-nginx
    else
        echo -e "${RED}❌ 无法检测包管理器，请手动安装 certbot${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Certbot 已安装${NC}"
fi

# 2. 创建初始 HTTP 配置
echo -e "${YELLOW}📝 创建初始 HTTP Nginx 配置...${NC}"

cat > "${NGINX_CONF_FILE}" << EOF
# Read2Rich HTTP 配置 (临时用于 SSL 证书申请)
server {
    listen 80;
    server_name ${DOMAIN} ${WWW_DOMAIN};
    
    # 日志配置
    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;
    
    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # 临时根目录（用于证书验证）
    location / {
        root /var/www/html;
        index index.html;
    }
}
EOF

# 创建临时网页目录
mkdir -p /var/www/html
echo "<h1>Read2Rich - Setting up...</h1>" > /var/www/html/index.html

# 3. 测试并重载 Nginx
echo -e "${YELLOW}🔧 测试 Nginx 配置...${NC}"
nginx -t
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx 配置语法正确${NC}"
    systemctl reload nginx
    systemctl enable nginx
    systemctl start nginx
else
    echo -e "${RED}❌ Nginx 配置有误${NC}"
    exit 1
fi

# 4. 申请 SSL 证书
echo -e "${YELLOW}🔒 申请 SSL 证书...${NC}"
echo "域名: ${DOMAIN}, ${WWW_DOMAIN}"
echo "邮箱: ${EMAIL}"

# 检查域名是否解析到当前服务器
echo -e "${BLUE}📡 检查域名解析...${NC}"
CURRENT_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short ${DOMAIN} | tail -n1)

if [ "${CURRENT_IP}" != "${DOMAIN_IP}" ]; then
    echo -e "${YELLOW}⚠️  警告: 域名 ${DOMAIN} 解析IP (${DOMAIN_IP}) 与当前服务器IP (${CURRENT_IP}) 不匹配${NC}"
    echo "请确保域名已正确解析到此服务器"
    read -p "是否继续申请证书? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "已取消证书申请"
        exit 1
    fi
fi

# 申请证书
certbot certonly \
    --nginx \
    --non-interactive \
    --agree-tos \
    --email "${EMAIL}" \
    -d "${DOMAIN}" \
    -d "${WWW_DOMAIN}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SSL 证书申请成功${NC}"
else
    echo -e "${RED}❌ SSL 证书申请失败${NC}"
    echo "请检查:"
    echo "1. 域名是否正确解析到此服务器"
    echo "2. 80端口是否开放"
    echo "3. 防火墙设置"
    exit 1
fi

# 5. 创建完整的 HTTPS 配置
echo -e "${YELLOW}🔧 创建完整的 HTTPS Nginx 配置...${NC}"

cat > "${NGINX_CONF_FILE}" << EOF
# Read2Rich 完整配置 - HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name ${DOMAIN} ${WWW_DOMAIN};
    
    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # 其他请求重定向到 HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# Read2Rich HTTPS 主配置
server {
    listen 443 ssl http2;
    server_name ${DOMAIN} ${WWW_DOMAIN};
    
    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # 日志配置
    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;
    
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
    
    # API 代理到后端服务
    location /api/ {
        proxy_pass http://127.0.0.1:${BACKEND_PORT}/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓冲设置
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    
    # 前端静态文件代理
    location / {
        proxy_pass http://127.0.0.1:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态资源缓存优化
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:${FRONTEND_PORT};
        proxy_set_header Host \$host;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # 隐藏 Nginx 版本
    server_tokens off;
}
EOF

# 6. 测试并重载配置
echo -e "${YELLOW}🔧 测试新的 HTTPS 配置...${NC}"
nginx -t
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ HTTPS 配置语法正确${NC}"
    systemctl reload nginx
else
    echo -e "${RED}❌ HTTPS 配置有误${NC}"
    exit 1
fi

# 7. 设置证书自动续期
echo -e "${YELLOW}⏰ 设置 SSL 证书自动续期...${NC}"

# 创建续期脚本
cat > /usr/local/bin/renew-read2rich-ssl.sh << 'EOF'
#!/bin/bash
# Read2Rich SSL 证书续期脚本

/usr/bin/certbot renew --quiet --nginx
if [ $? -eq 0 ]; then
    /usr/bin/systemctl reload nginx
    echo "$(date): Read2Rich SSL 证书续期成功" >> /var/log/ssl-renew.log
else
    echo "$(date): Read2Rich SSL 证书续期失败" >> /var/log/ssl-renew.log
fi
EOF

chmod +x /usr/local/bin/renew-read2rich-ssl.sh

# 添加到 crontab
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/local/bin/renew-read2rich-ssl.sh") | crontab -

echo -e "${GREEN}✅ SSL 证书自动续期已设置 (每天12点检查)${NC}"

# 8. 防火墙配置
echo -e "${YELLOW}🔥 配置防火墙...${NC}"

if command -v firewall-cmd &> /dev/null; then
    # CentOS/RHEL 使用 firewalld
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
    echo -e "${GREEN}✅ Firewalld 规则已添加${NC}"
elif command -v ufw &> /dev/null; then
    # Ubuntu 使用 ufw
    ufw allow 'Nginx Full'
    echo -e "${GREEN}✅ UFW 规则已添加${NC}"
else
    echo -e "${YELLOW}⚠️  请手动配置防火墙开放 80 和 443 端口${NC}"
fi

# 9. 完成提示
echo
echo -e "${GREEN}🎉 Read2Rich Nginx & SSL 配置完成!${NC}"
echo "=================================="
echo -e "${BLUE}📋 配置摘要:${NC}"
echo "• 域名: ${DOMAIN}, ${WWW_DOMAIN}"
echo "• SSL 证书: Let's Encrypt"
echo "• 前端端口: ${FRONTEND_PORT}"
echo "• 后端端口: ${BACKEND_PORT}"
echo "• 配置文件: ${NGINX_CONF_FILE}"
echo "• 日志目录: /var/log/nginx/"
echo
echo -e "${BLUE}🔧 下一步操作:${NC}"
echo "1. 确保 Docker 服务正在运行:"
echo "   docker compose -f docker-compose.prod.yml up -d"
echo
echo "2. 检查服务状态:"
echo "   docker compose -f docker-compose.prod.yml ps"
echo
echo "3. 测试网站访问:"
echo "   curl -I https://${DOMAIN}"
echo
echo "4. 查看 Nginx 日志:"
echo "   tail -f /var/log/nginx/${DOMAIN}.access.log"
echo
echo -e "${GREEN}✅ 配置完成! 您的网站现在应该可以通过 https://${DOMAIN} 访问${NC}"
