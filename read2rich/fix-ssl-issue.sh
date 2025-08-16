#!/bin/bash

# 修复SSL证书申请问题的脚本
# 先用HTTP配置申请证书，再切换到HTTPS

echo "🔧 修复SSL证书申请问题..."

# 1. 创建临时的HTTP-only nginx配置
echo "📝 创建临时HTTP配置..."
cat > /tmp/read2rich-http-only.conf << 'HTTP_CONF'
# 临时HTTP配置 - 用于SSL证书申请
server {
    listen 80;
    server_name read2rich.com www.read2rich.com;
    
    # 日志
    access_log /var/log/nginx/read2rich.com.access.log;
    error_log /var/log/nginx/read2rich.com.error.log;
    
    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # 临时根目录
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ =404;
    }
}
HTTP_CONF

# 2. 备份当前配置并使用临时配置
echo "💾 备份当前nginx配置..."
if [ -f "/etc/nginx/conf.d/read2rich.com.conf" ]; then
    cp /etc/nginx/conf.d/read2rich.com.conf /etc/nginx/conf.d/read2rich.com.conf.backup
fi

# 3. 应用临时HTTP配置
echo "🔄 应用临时HTTP配置..."
cp /tmp/read2rich-http-only.conf /etc/nginx/conf.d/read2rich.com.conf

# 4. 创建临时网页
mkdir -p /var/www/html
echo "<h1>Read2Rich - SSL Setup in Progress...</h1>" > /var/www/html/index.html

# 5. 测试并重载nginx
echo "🔧 测试nginx配置..."
nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo "✅ 临时配置已生效"
else
    echo "❌ nginx配置测试失败"
    exit 1
fi

# 6. 使用certbot only模式申请证书
echo "🔒 申请SSL证书 (certbot only模式)..."
certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email admin@read2rich.com \
    --agree-tos \
    --non-interactive \
    -d read2rich.com \
    -d www.read2rich.com

# 检查证书是否申请成功
if [ -f "/etc/letsencrypt/live/read2rich.com/fullchain.pem" ]; then
    echo "✅ SSL证书申请成功!"
    
    # 7. 创建完整的HTTPS配置
    echo "📝 创建完整HTTPS配置..."
    cat > /etc/nginx/conf.d/read2rich.com.conf << 'HTTPS_CONF'
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name read2rich.com www.read2rich.com;
    
    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # 重定向到 HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 主配置
server {
    listen 443 ssl http2;
    server_name read2rich.com www.read2rich.com;
    
    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/read2rich.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/read2rich.com/privkey.pem;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
    # 日志
    access_log /var/log/nginx/read2rich.com.access.log;
    error_log /var/log/nginx/read2rich.com.error.log;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:8001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 前端代理
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:8080;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
HTTPS_CONF
    
    # 8. 测试并应用HTTPS配置
    echo "🔧 测试HTTPS配置..."
    nginx -t
    if [ $? -eq 0 ]; then
        systemctl reload nginx
        echo "✅ HTTPS配置已生效"
    else
        echo "❌ HTTPS配置测试失败，恢复备份"
        if [ -f "/etc/nginx/conf.d/read2rich.com.conf.backup" ]; then
            cp /etc/nginx/conf.d/read2rich.com.conf.backup /etc/nginx/conf.d/read2rich.com.conf
            systemctl reload nginx
        fi
        exit 1
    fi
    
    # 9. 设置自动续期
    echo "⏰ 设置SSL证书自动续期..."
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && /usr/bin/systemctl reload nginx") | crontab -
    
    echo "🎉 SSL证书配置完成!"
    echo "测试访问: curl -I https://read2rich.com"
    
else
    echo "❌ SSL证书申请失败"
    echo "请检查:"
    echo "1. 域名是否正确解析到此服务器"
    echo "2. 80端口是否开放"
    echo "3. 防火墙设置"
    exit 1
fi

# 清理临时文件
rm -f /tmp/read2rich-http-only.conf

echo "✅ SSL修复完成!"
