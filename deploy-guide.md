# DEEPNEED 网站部署指南

## 🚀 CentOS + Nginx 部署步骤

### 1. 服务器准备

#### 1.1 连接服务器
```bash
ssh root@your-server-ip
# 或使用密钥
ssh -i /path/to/your-key.pem root@your-server-ip
```

#### 1.2 系统更新
```bash
yum update -y
yum install -y wget curl vim
```

### 2. 安装 Nginx

#### 2.1 安装 Nginx
```bash
# 安装 EPEL 源
yum install -y epel-release

# 安装 Nginx
yum install -y nginx

# 启动并设置开机自启
systemctl start nginx
systemctl enable nginx

# 检查状态
systemctl status nginx
```

#### 2.2 配置防火墙
```bash
# 开放 HTTP 和 HTTPS 端口
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 或者直接开放端口
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --reload
```

### 3. 域名配置

#### 3.1 DNS 解析设置
在域名管理后台添加 A 记录：
```
主机记录: @
记录类型: A
记录值: your-server-ip
TTL: 600

主机记录: www
记录类型: A  
记录值: your-server-ip
TTL: 600
```

### 4. 网站文件部署

#### 4.1 创建网站目录
```bash
mkdir -p /var/www/deepneed.com.cn
chown -R nginx:nginx /var/www/deepneed.com.cn
chmod -R 755 /var/www/deepneed.com.cn
```

#### 4.2 上传网站文件
```bash
# 方法1: 使用 scp 上传
scp -r deepneed_site/* root@your-server-ip:/var/www/deepneed.com.cn/

# 方法2: 使用 rsync 同步
rsync -avz --delete deepneed_site/ root@your-server-ip:/var/www/deepneed.com.cn/

# 方法3: 在服务器上直接下载
cd /var/www/deepneed.com.cn
# 如果有 Git 仓库
git clone https://github.com/your-username/deepneed-site.git .
```

#### 4.3 设置文件权限
```bash
chown -R nginx:nginx /var/www/deepneed.com.cn
find /var/www/deepneed.com.cn -type f -exec chmod 644 {} \;
find /var/www/deepneed.com.cn -type d -exec chmod 755 {} \;
```

### 5. Nginx 配置

#### 5.1 创建站点配置文件
```bash
vim /etc/nginx/conf.d/deepneed.com.cn.conf
```

#### 5.2 基础配置（HTTP）
```nginx
server {
    listen 80;
    server_name deepneed.com.cn www.deepneed.com.cn;
    root /var/www/deepneed.com.cn;
    index index.html index.htm;

    # 日志配置
    access_log /var/log/nginx/deepneed.com.cn.access.log;
    error_log /var/log/nginx/deepneed.com.cn.error.log;

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

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }

    # 主页面
    location / {
        try_files $uri $uri/ /index.html;
        
        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }

    # 隐藏 Nginx 版本
    server_tokens off;

    # 404 页面
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
```

#### 5.3 测试配置并重启
```bash
# 测试配置文件语法
nginx -t

# 重启 Nginx
systemctl restart nginx

# 查看状态
systemctl status nginx
```

### 6. SSL 证书配置（HTTPS）

#### 6.1 安装 Certbot
```bash
yum install -y certbot python3-certbot-nginx
```

#### 6.2 申请 SSL 证书
```bash
# 自动配置 SSL
certbot --nginx -d deepneed.com.cn -d www.deepneed.com.cn

# 手动指定邮箱
certbot --nginx -d deepneed.com.cn -d www.deepneed.com.cn --email your-email@example.com --agree-tos --no-eff-email
```

#### 6.3 设置自动续期
```bash
# 测试自动续期
certbot renew --dry-run

# 添加定时任务
crontab -e
# 添加以下行（每天凌晨2点检查续期）
0 2 * * * /usr/bin/certbot renew --quiet
```

#### 6.4 完整 HTTPS 配置
```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name deepneed.com.cn www.deepneed.com.cn;
    return 301 https://$server_name$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    server_name deepneed.com.cn www.deepneed.com.cn;
    root /var/www/deepneed.com.cn;
    index index.html index.htm;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/deepneed.com.cn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deepneed.com.cn/privkey.pem;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 其他配置同上...
    # 日志、Gzip、缓存、安全头等配置
}
```

### 7. 性能优化

#### 7.1 优化 Nginx 配置
```bash
vim /etc/nginx/nginx.conf
```

```nginx
# 在 http 块中添加
client_max_body_size 20M;
client_body_buffer_size 128k;
client_header_buffer_size 32k;
large_client_header_buffers 4 32k;

# 连接优化
keepalive_timeout 65;
keepalive_requests 100;

# 工作进程优化
worker_processes auto;
worker_connections 1024;
```

#### 7.2 启用 Brotli 压缩（可选）
```bash
# 安装 Brotli 模块
yum install -y nginx-module-brotli

# 在 nginx.conf 顶部添加
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;

# 在 http 块中添加
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 8. 监控和维护

#### 8.1 日志监控
```bash
# 实时查看访问日志
tail -f /var/log/nginx/deepneed.com.cn.access.log

# 实时查看错误日志
tail -f /var/log/nginx/deepneed.com.cn.error.log

# 分析访问日志
awk '{print $1}' /var/log/nginx/deepneed.com.cn.access.log | sort | uniq -c | sort -nr | head -10
```

#### 8.2 性能测试
```bash
# 安装压测工具
yum install -y httpd-tools

# 压力测试
ab -n 1000 -c 10 https://deepneed.com.cn/
```

### 9. 备份策略

#### 9.1 创建备份脚本
```bash
vim /root/backup-website.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
SITE_DIR="/var/www/deepneed.com.cn"

mkdir -p $BACKUP_DIR

# 备份网站文件
tar -czf $BACKUP_DIR/deepneed_site_$DATE.tar.gz -C $SITE_DIR .

# 备份 Nginx 配置
tar -czf $BACKUP_DIR/nginx_conf_$DATE.tar.gz /etc/nginx/conf.d/

# 删除7天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x /root/backup-website.sh

# 添加定时备份
crontab -e
# 每天凌晨3点备份
0 3 * * * /root/backup-website.sh
```

### 10. 故障排查

#### 10.1 常见问题
```bash
# 检查 Nginx 状态
systemctl status nginx

# 检查配置文件语法
nginx -t

# 检查端口占用
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# 检查防火墙
firewall-cmd --list-all

# 检查 SELinux
sestatus
# 如果需要临时关闭
setenforce 0
```

#### 10.2 权限问题
```bash
# 检查文件权限
ls -la /var/www/deepneed.com.cn/

# 重新设置权限
chown -R nginx:nginx /var/www/deepneed.com.cn
chmod -R 755 /var/www/deepneed.com.cn
```

## 🎯 **快速部署命令**

```bash
# 一键部署脚本
curl -sSL https://raw.githubusercontent.com/your-repo/deploy.sh | bash
```

## 📞 **技术支持**

如果遇到问题，请检查：
1. 域名 DNS 解析是否正确
2. 服务器防火墙设置
3. Nginx 配置文件语法
4. SSL 证书状态
5. 文件权限设置

---
*部署完成后，访问 https://deepneed.com.cn 查看效果* 