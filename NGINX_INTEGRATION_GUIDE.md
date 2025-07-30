# 🌐 DeepNeed AI 与现有Nginx集成指南

## 📋 目录
1. [集成方案概述](#集成方案概述)
2. [端口冲突解决方案](#端口冲突解决方案)
3. [Nginx配置集成](#nginx配置集成)
4. [SSL证书配置](#ssl证书配置)
5. [域名配置](#域名配置)
6. [常见问题解决](#常见问题解决)

## 🎯 集成方案概述

### 架构设计
```
用户请求 → 现有Nginx (80/443) → DeepNeed应用
                    ↓
            - 静态文件: /var/www/deepneed
            - API代理: localhost:8001
            - 监控: localhost:3001
```

### 端口分配
- **80/443**: 现有Nginx (保持不变)
- **8001**: DeepNeed后端API
- **3001**: Grafana监控面板
- **5432**: PostgreSQL数据库 (内部)
- **6379**: Redis缓存 (内部)

---

## 🔧 端口冲突解决方案

### 1. 检查现有端口占用
```bash
# 检查端口占用情况
sudo netstat -tlnp | grep -E ":(80|443|8001|3001)"

# 或者使用ss命令
sudo ss -tlnp | grep -E ":(80|443|8001|3001)"
```

### 2. 端口映射调整
如果8001或3001端口被占用，可以修改为其他端口：

```bash
# 编辑环境配置
nano .env

# 修改端口配置
BACKEND_PORT=8002  # 如果8001被占用
GRAFANA_PORT=3002  # 如果3001被占用
```

### 3. 更新Docker Compose配置
```yaml
# docker-compose.nginx-compatible.yml
services:
  backend:
    ports:
      - "8002:8000"  # 使用8002端口
  
  grafana:
    ports:
      - "3002:3000"  # 使用3002端口
```

---

## 🌐 Nginx配置集成

### 1. 生成Nginx配置
```bash
# 运行配置生成脚本
chmod +x deploy-with-existing-nginx.sh
./deploy-with-existing-nginx.sh --nginx-config
```

### 2. 集成到现有Nginx配置

#### 方法一：作为独立站点
```bash
# 复制配置文件到Nginx目录
sudo cp deepneed.conf /etc/nginx/sites-available/deepneed

# 启用站点
sudo ln -s /etc/nginx/sites-available/deepneed /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载Nginx
sudo systemctl reload nginx
```

#### 方法二：集成到现有配置
编辑您现有的Nginx配置文件（通常在 `/etc/nginx/sites-available/default` 或 `/etc/nginx/nginx.conf`）：

```nginx
# 在现有配置中添加DeepNeed配置

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # 现有配置...
    
    # DeepNeed重定向
    location /deepneed {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS主配置
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # 现有SSL配置...
    
    # 现有location配置...
    
    # DeepNeed前端静态文件
    location /deepneed {
        alias /var/www/deepneed;
        try_files $uri $uri/ /deepneed/index.html;
        add_header Cache-Control "public, max-age=31536000" always;
    }
    
    # DeepNeed API代理
    location /deepneed/api/ {
        proxy_pass http://localhost:8001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # DeepNeed健康检查
    location /deepneed/health {
        proxy_pass http://localhost:8001/health;
        access_log off;
    }
}
```

#### 方法三：子域名配置
如果您想使用子域名（如 `deepneed.yourdomain.com`）：

```nginx
# DeepNeed子域名配置
server {
    listen 80;
    server_name deepneed.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name deepneed.yourdomain.com;
    
    # SSL配置
    ssl_certificate /etc/nginx/ssl/deepneed/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/deepneed/key.pem;
    
    # 前端静态文件
    location / {
        root /var/www/deepneed;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=31536000" always;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://localhost:8001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔒 SSL证书配置

### 1. 使用现有SSL证书
如果您的Nginx已经有SSL证书，可以直接使用：

```nginx
# 在DeepNeed配置中使用现有证书
ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
```

### 2. 为DeepNeed申请专用证书
```bash
# 安装certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书（子域名方式）
sudo certbot certonly --standalone -d deepneed.yourdomain.com

# 申请证书（路径方式）
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# 复制证书到DeepNeed目录
sudo cp /etc/letsencrypt/live/deepneed.yourdomain.com/fullchain.pem /etc/nginx/ssl/deepneed/cert.pem
sudo cp /etc/letsencrypt/live/deepneed.yourdomain.com/privkey.pem /etc/nginx/ssl/deepneed/key.pem
sudo chown -R www-data:www-data /etc/nginx/ssl/deepneed/
```

### 3. 自动续期配置
```bash
# 编辑crontab
sudo crontab -e

# 添加自动续期任务
0 12 * * * /usr/bin/certbot renew --quiet && \
  cp /etc/letsencrypt/live/deepneed.yourdomain.com/fullchain.pem /etc/nginx/ssl/deepneed/cert.pem && \
  cp /etc/letsencrypt/live/deepneed.yourdomain.com/privkey.pem /etc/nginx/ssl/deepneed/key.pem && \
  systemctl reload nginx
```

---

## 🌍 域名配置

### 1. DNS记录配置
根据您的集成方式，配置相应的DNS记录：

#### 子域名方式
```
deepneed.yourdomain.com  A    your-server-ip
```

#### 路径方式
```
yourdomain.com           A    your-server-ip
www.yourdomain.com       A    your-server-ip
```

### 2. 环境变量配置
```bash
# 编辑.env文件
nano .env

# 根据集成方式修改域名配置
# 子域名方式
DOMAIN=deepneed.yourdomain.com
CORS_ORIGINS=https://deepneed.yourdomain.com

# 路径方式
DOMAIN=yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 🔧 部署步骤

### 1. 完整部署流程
```bash
# 1. 下载项目
git clone https://github.com/your-username/deepneed-ai.git
cd deepneed-ai

# 2. 执行适配现有Nginx的部署
chmod +x deploy-with-existing-nginx.sh
./deploy-with-existing-nginx.sh

# 3. 编辑环境配置
nano .env
# 填入您的AI API密钥和域名配置

# 4. 集成Nginx配置
# 根据上述方法选择适合的集成方式

# 5. 重新加载Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 2. 验证部署
```bash
# 检查服务状态
docker-compose -f docker-compose.nginx-compatible.yml ps

# 测试API访问
curl -f http://localhost:8001/health

# 测试前端访问
curl -I https://yourdomain.com/deepneed

# 检查Nginx配置
sudo nginx -t
```

---

## 🆘 常见问题解决

### 1. 端口冲突
```bash
# 检查端口占用
sudo netstat -tlnp | grep :8001

# 修改端口配置
nano .env
# 修改 BACKEND_PORT=8002

# 重新部署
docker-compose -f docker-compose.nginx-compatible.yml down
docker-compose -f docker-compose.nginx-compatible.yml up -d
```

### 2. Nginx配置错误
```bash
# 测试Nginx配置
sudo nginx -t

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# 重新加载配置
sudo systemctl reload nginx
```

### 3. 静态文件404错误
```bash
# 检查文件权限
sudo ls -la /var/www/deepneed/

# 修复权限
sudo chown -R www-data:www-data /var/www/deepneed/
sudo chmod -R 755 /var/www/deepneed/

# 重新构建前端
docker-compose -f docker-compose.nginx-compatible.yml run --rm frontend-builder
sudo docker cp deepneed-frontend-builder:/app/dist/. /var/www/deepneed/
```

### 4. API代理失败
```bash
# 检查后端服务状态
docker-compose -f docker-compose.nginx-compatible.yml logs backend

# 测试后端直接访问
curl -f http://localhost:8001/health

# 检查防火墙
sudo ufw status
sudo ufw allow 8001/tcp
```

### 5. SSL证书问题
```bash
# 检查证书文件
sudo ls -la /etc/nginx/ssl/deepneed/

# 验证证书
openssl x509 -in /etc/nginx/ssl/deepneed/cert.pem -text -noout

# 重新申请证书
sudo certbot renew --dry-run
```

---

## 📊 监控和维护

### 1. 日志监控
```bash
# Nginx访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# DeepNeed应用日志
docker-compose -f docker-compose.nginx-compatible.yml logs -f backend
```

### 2. 性能监控
```bash
# 查看Nginx状态
sudo nginx -V

# 查看连接数
sudo netstat -an | grep :80 | wc -l

# 查看Docker资源使用
docker stats
```

### 3. 备份配置
```bash
# 备份Nginx配置
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
sudo cp -r /etc/nginx/sites-available /etc/nginx/sites-available.backup

# 备份SSL证书
sudo cp -r /etc/nginx/ssl /etc/nginx/ssl.backup
```

---

## 📞 技术支持

如果在集成过程中遇到问题，请：

1. 检查Nginx错误日志：`sudo tail -f /var/log/nginx/error.log`
2. 检查应用日志：`docker-compose -f docker-compose.nginx-compatible.yml logs`
3. 验证配置：`sudo nginx -t`
4. 联系技术支持：support@deepneed.com

---

**祝您集成成功！** 🎉 