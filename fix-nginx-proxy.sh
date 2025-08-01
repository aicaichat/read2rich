#!/bin/bash

echo "🔧 修复Nginx代理配置..."

# 备份当前配置
cp /etc/nginx/conf.d/deepneed.com.cn.conf /etc/nginx/conf.d/deepneed.com.cn.conf.backup.$(date +%Y%m%d_%H%M%S)

# 检查SSL证书
SSL_CERT_EXISTS=false
if [ -f "/etc/letsencrypt/live/deepneed.com.cn/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/deepneed.com.cn/privkey.pem" ]; then
    SSL_CERT_EXISTS=true
    echo "✅ 检测到SSL证书"
else
    echo "⚠️  未检测到SSL证书"
fi

# 生成新的Nginx配置
if [ "$SSL_CERT_EXISTS" = true ]; then
    cat > /etc/nginx/conf.d/deepneed.com.cn.conf << 'EOF'
# HTTPS配置 - 主服务器
server {
    server_name deepneed.com.cn www.deepneed.com.cn;
    
    # 日志配置
    access_log /var/log/nginx/deepneed.com.cn.access.log;
    error_log /var/log/nginx/deepneed.com.cn.error.log;

    # 前端代理 - 指向Docker容器
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API代理 - 指向Docker容器
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态资源直接代理
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 缓存设置
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/deepneed.com.cn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deepneed.com.cn/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

# HTTP重定向到HTTPS
server {
    if ($host = www.deepneed.com.cn) {
        return 301 https://$host$request_uri;
    }

    if ($host = deepneed.com.cn) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name deepneed.com.cn www.deepneed.com.cn;
    return 404;
}
EOF
else
    cat > /etc/nginx/conf.d/deepneed.com.cn.conf << 'EOF'
# HTTP配置
server {
    listen 80;
    server_name deepneed.com.cn www.deepneed.com.cn;
    
    # 日志配置
    access_log /var/log/nginx/deepneed.com.cn.access.log;
    error_log /var/log/nginx/deepneed.com.cn.error.log;

    # 前端代理 - 指向Docker容器
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API代理 - 指向Docker容器
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态资源直接代理
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 缓存设置
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
fi

# 测试配置
echo "🔍 测试Nginx配置..."
if nginx -t; then
    echo "✅ Nginx配置语法正确"
    
    # 重新加载配置
    systemctl reload nginx
    echo "✅ Nginx配置已重新加载"
    
    # 测试连接
    echo "🔍 测试连接..."
    sleep 2
    
    echo "测试直接访问容器:"
    curl -I http://127.0.0.1:3000/ 2>/dev/null | head -1
    
    echo "测试通过域名访问:"
    if [ "$SSL_CERT_EXISTS" = true ]; then
        curl -I https://deepneed.com.cn/ 2>/dev/null | head -1
    else
        curl -I http://deepneed.com.cn/ 2>/dev/null | head -1
    fi
    
else
    echo "❌ Nginx配置语法错误"
    echo "恢复备份配置..."
    cp /etc/nginx/conf.d/deepneed.com.cn.conf.backup.$(date +%Y%m%d_%H%M%S) /etc/nginx/conf.d/deepneed.com.cn.conf
    exit 1
fi

echo "✅ Nginx代理配置修复完成"