#!/bin/bash

# 修复域名和SSL问题的脚本

echo "🔧 修复域名和SSL问题"
echo "=================================="

# 1. 获取当前服务器IP
CURRENT_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null)
echo "当前服务器IP: $CURRENT_IP"

# 2. 检查域名解析
echo "检查域名解析..."
DOMAIN_IP=$(dig +short read2rich.com | tail -n1)
WWW_DOMAIN_IP=$(dig +short www.read2rich.com | tail -n1)

echo "read2rich.com 解析到: $DOMAIN_IP"
echo "www.read2rich.com 解析到: $WWW_DOMAIN_IP"

# 3. 如果域名解析不正确，提供临时解决方案
if [ "$CURRENT_IP" != "$DOMAIN_IP" ] || [ "$CURRENT_IP" != "$WWW_DOMAIN_IP" ]; then
    echo "⚠️  域名解析不正确！"
    echo "请在域名管理面板设置以下DNS记录:"
    echo "A记录: read2rich.com -> $CURRENT_IP"
    echo "A记录: www.read2rich.com -> $CURRENT_IP"
    echo ""
    echo "🔄 临时解决方案: 仅为主域名申请证书"
    
    # 仅为解析正确的域名申请证书
    DOMAINS_TO_CERT=""
    if [ "$CURRENT_IP" = "$DOMAIN_IP" ]; then
        DOMAINS_TO_CERT="$DOMAINS_TO_CERT -d read2rich.com"
    fi
    if [ "$CURRENT_IP" = "$WWW_DOMAIN_IP" ]; then
        DOMAINS_TO_CERT="$DOMAINS_TO_CERT -d www.read2rich.com"
    fi
    
    if [ -z "$DOMAINS_TO_CERT" ]; then
        echo "❌ 没有正确解析的域名，无法申请证书"
        echo "请先修复DNS解析后再运行此脚本"
        exit 1
    fi
    
    echo "将为以下域名申请证书: $DOMAINS_TO_CERT"
else
    DOMAINS_TO_CERT="-d read2rich.com -d www.read2rich.com"
    echo "✅ 域名解析正确"
fi

# 4. 确保webroot目录存在且权限正确
echo "📁 设置webroot目录..."
mkdir -p /var/www/html/.well-known/acme-challenge/
chown -R www-data:www-data /var/www/html 2>/dev/null || chown -R nginx:nginx /var/www/html 2>/dev/null
chmod -R 755 /var/www/html

# 5. 创建简单的HTTP配置（确保Let's Encrypt可以访问）
echo "📝 创建简单HTTP配置..."
cat > /etc/nginx/conf.d/read2rich.com.conf << 'SIMPLE_HTTP'
server {
    listen 80;
    server_name read2rich.com www.read2rich.com;
    
    root /var/www/html;
    index index.html;
    
    # 日志
    access_log /var/log/nginx/read2rich.com.access.log;
    error_log /var/log/nginx/read2rich.com.error.log;
    
    # Let's Encrypt 验证
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files $uri =404;
    }
    
    # 其他请求
    location / {
        try_files $uri $uri/ =404;
    }
}
SIMPLE_HTTP

# 6. 创建测试页面
echo "<h1>Read2Rich - SSL Setup</h1><p>Server IP: $CURRENT_IP</p>" > /var/www/html/index.html

# 7. 测试nginx配置
echo "🔧 测试nginx配置..."
nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo "✅ Nginx配置已更新"
else
    echo "❌ Nginx配置错误"
    exit 1
fi

# 8. 开放防火墙端口
echo "🔥 配置防火墙..."
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
    echo "✅ Firewalld规则已添加"
elif command -v ufw &> /dev/null; then
    ufw allow 'Nginx Full'
    echo "✅ UFW规则已添加"
fi

# 9. 测试HTTP访问
echo "🧪 测试HTTP访问..."
sleep 2
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ 本地HTTP访问正常 (状态码: $HTTP_STATUS)"
else
    echo "⚠️  本地HTTP访问异常 (状态码: $HTTP_STATUS)"
fi

# 10. 申请SSL证书
echo "🔒 申请SSL证书..."
certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email admin@read2rich.com \
    --agree-tos \
    --non-interactive \
    $DOMAINS_TO_CERT

# 11. 检查证书申请结果
if [ -f "/etc/letsencrypt/live/read2rich.com/fullchain.pem" ]; then
    echo "✅ SSL证书申请成功!"
    
    # 创建HTTPS配置
    echo "📝 创建HTTPS配置..."
    cat > /etc/nginx/conf.d/read2rich.com.conf << 'HTTPS_CONFIG'
# HTTP 重定向
server {
    listen 80;
    server_name read2rich.com www.read2rich.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    server_name read2rich.com www.read2rich.com;
    
    ssl_certificate /etc/letsencrypt/live/read2rich.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/read2rich.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
    access_log /var/log/nginx/read2rich.com.access.log;
    error_log /var/log/nginx/read2rich.com.error.log;
    
    # API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:8001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 前端代理
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
HTTPS_CONFIG
    
    # 测试HTTPS配置
    nginx -t && systemctl reload nginx
    
    # 设置自动续期
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && /usr/bin/systemctl reload nginx") | crontab -
    
    echo "🎉 SSL配置完成!"
    echo "现在可以启动Docker服务:"
    echo "docker compose -f docker-compose.prod.yml up -d"
    
else
    echo "❌ SSL证书申请失败"
    echo "请检查域名解析和网络连接"
fi

