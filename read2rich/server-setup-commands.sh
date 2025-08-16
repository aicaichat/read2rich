#!/bin/bash

# 服务器端快速设置命令
# 在服务器上运行这些命令

echo "🚀 Read2Rich 服务器快速设置"
echo "=================================="

# 1. 确保在正确目录
cd /var/www/read2rich.com/read2rich || cd ~/read2rich || { echo "错误: 找不到read2rich目录"; exit 1; }

# 2. 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 3. 检查文件是否存在
echo "📋 检查必要文件..."
if [ ! -f "nginx-read2rich.conf" ]; then
    echo "❌ nginx-read2rich.conf 文件不存在，创建中..."
    cat > nginx-read2rich.conf << 'NGINX_EOF'
# Read2Rich Nginx 配置文件
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
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
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
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:8080;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF
    echo "✅ nginx-read2rich.conf 已创建"
fi

# 4. 安装 certbot (检测系统类型)
echo "📦 检查并安装 certbot..."
if ! command -v certbot &> /dev/null; then
    if command -v yum &> /dev/null; then
        echo "检测到 CentOS/RHEL 系统，安装 certbot..."
        yum install -y epel-release
        yum install -y certbot python3-certbot-nginx
    elif command -v apt &> /dev/null; then
        echo "检测到 Ubuntu/Debian 系统，安装 certbot..."
        apt update
        apt install -y certbot python3-certbot-nginx
    else
        echo "❌ 无法检测系统类型，请手动安装 certbot"
        exit 1
    fi
else
    echo "✅ certbot 已安装"
fi

# 5. 创建临时网页目录
mkdir -p /var/www/html
echo "<h1>Read2Rich - Setting up...</h1>" > /var/www/html/index.html

# 6. 复制 nginx 配置
echo "📝 复制 nginx 配置..."
cp nginx-read2rich.conf /etc/nginx/conf.d/read2rich.com.conf

# 7. 测试 nginx 配置
echo "🔧 测试 nginx 配置..."
nginx -t
if [ $? -eq 0 ]; then
    echo "✅ nginx 配置正确"
    systemctl reload nginx
else
    echo "❌ nginx 配置有误"
    exit 1
fi

# 8. 申请 SSL 证书
echo "🔒 申请 SSL 证书..."
certbot --nginx -d read2rich.com -d www.read2rich.com --email admin@read2rich.com --agree-tos --non-interactive

# 9. 启动 Docker 服务
echo "🚀 启动 Docker 服务..."
docker compose -f docker-compose.prod.yml up -d

# 10. 检查服务状态
echo "📊 检查服务状态..."
sleep 5
docker compose -f docker-compose.prod.yml ps

echo "✅ 设置完成!"
echo "前端: https://read2rich.com"
echo "后端: https://read2rich.com/api/"
