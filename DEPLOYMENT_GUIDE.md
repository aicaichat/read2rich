# DeepNeed 完整部署指南

## 📋 概述

本指南提供 DeepNeed 项目的完整部署方案，支持多种部署模式和服务器环境。

## 🚀 快速部署

### 1. 一键部署脚本

```bash
# 克隆项目
git clone https://github.com/aicaichat/deepneed.git
cd deepneed

# 运行部署脚本
chmod +x deploy.sh
./deploy.sh [域名]
```

### 2. 部署示例

```bash
# 部署到默认域名
./deploy.sh

# 部署到自定义域名
./deploy.sh example.com

# 仅检查环境
./deploy.sh --check
```

## 🔧 系统要求

### 必需软件
- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **Nginx** (1.18+)
- **Git**

### 推荐配置
- **CPU**: 2核心以上
- **内存**: 4GB以上
- **存储**: 20GB以上
- **操作系统**: Ubuntu 20.04+ / CentOS 8+

## 📦 安装依赖

### Ubuntu/Debian
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 安装Nginx
sudo apt install nginx -y

# 安装Certbot (SSL证书)
sudo apt install certbot python3-certbot-nginx -y
```

### CentOS/RHEL
```bash
# 安装Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io -y
sudo systemctl start docker
sudo systemctl enable docker

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 安装Nginx
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

## ⚙️ 环境配置

### 1. 配置环境变量

```bash
# 复制环境变量模板
cp env.example .env

# 编辑配置文件
nano .env
```

### 2. 必需配置项

```bash
# API Keys (必需)
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 域名配置
DOMAIN=your-domain.com
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://your-domain.com/api

# 安全配置
JWT_SECRET=your-super-secret-jwt-key
```

### 3. 可选配置项

```bash
# 其他AI API Keys
CLAUDE_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# 数据库配置
DATABASE_URL=sqlite:///./deepneed_prod.db

# CORS配置
ALLOWED_ORIGINS=https://your-domain.com,http://localhost:5173
```

## 🐳 Docker 部署

### 1. 构建镜像

```bash
# 构建所有服务
docker-compose -f docker-compose.production.yml build

# 构建特定服务
docker-compose -f docker-compose.production.yml build frontend
docker-compose -f docker-compose.production.yml build backend
```

### 2. 启动服务

```bash
# 启动所有服务
docker-compose -f docker-compose.production.yml up -d

# 查看服务状态
docker-compose -f docker-compose.production.yml ps

# 查看日志
docker-compose -f docker-compose.production.yml logs -f
```

### 3. 停止服务

```bash
# 停止所有服务
docker-compose -f docker-compose.production.yml down

# 停止并删除数据卷
docker-compose -f docker-compose.production.yml down -v
```

## 🌐 Nginx 配置

### 1. 自动配置

部署脚本会自动生成 Nginx 配置文件：

```bash
# 配置文件位置
/etc/nginx/conf.d/your-domain.com.conf
```

### 2. 手动配置

如果需要手动配置，创建配置文件：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    access_log /var/log/nginx/your-domain.com.access.log;
    error_log /var/log/nginx/your-domain.com.error.log;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    server_tokens off;
}
```

### 3. 测试配置

```bash
# 测试Nginx配置
sudo nginx -t

# 重新加载配置
sudo systemctl reload nginx
```

## 🔒 SSL 证书配置

### 1. 自动配置

```bash
# 使用Certbot自动配置SSL
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. 手动配置

```bash
# 生成证书
sudo certbot certonly --nginx -d your-domain.com

# 更新Nginx配置以支持HTTPS
sudo nano /etc/nginx/conf.d/your-domain.com.conf
```

## 🛠️ 系统服务

### 1. 创建服务

部署脚本会自动创建 systemd 服务：

```bash
# 服务文件位置
/etc/systemd/system/deepneed.service
```

### 2. 管理服务

```bash
# 启动服务
sudo systemctl start deepneed

# 停止服务
sudo systemctl stop deepneed

# 重启服务
sudo systemctl restart deepneed

# 查看状态
sudo systemctl status deepneed

# 查看日志
sudo journalctl -u deepneed -f

# 设置开机自启
sudo systemctl enable deepneed
```

## 🔍 健康检查

### 1. 服务检查

```bash
# 检查前端服务
curl -f http://localhost:3000

# 检查后端服务
curl -f http://localhost:8000/health

# 检查Nginx代理
curl -f http://your-domain.com
```

### 2. 容器检查

```bash
# 查看容器状态
docker-compose -f docker-compose.production.yml ps

# 查看容器日志
docker-compose -f docker-compose.production.yml logs -f

# 进入容器
docker-compose -f docker-compose.production.yml exec backend bash
```

## 🔧 故障排除

### 1. 常见问题

#### 端口冲突
```bash
# 检查端口占用
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8000

# 修改端口
# 编辑 docker-compose.production.yml
```

#### 权限问题
```bash
# 修复Docker权限
sudo usermod -aG docker $USER
newgrp docker

# 修复文件权限
sudo chown -R $USER:$USER /opt/deepneed
```

#### 内存不足
```bash
# 增加swap空间
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 2. 日志查看

```bash
# Nginx错误日志
sudo tail -f /var/log/nginx/your-domain.com.error.log

# 应用日志
sudo journalctl -u deepneed -f

# Docker容器日志
docker-compose -f docker-compose.production.yml logs -f frontend
docker-compose -f docker-compose.production.yml logs -f backend
```

### 3. 重置部署

```bash
# 完全重置
sudo systemctl stop deepneed
docker-compose -f docker-compose.production.yml down -v
sudo rm -rf /opt/deepneed
sudo rm /etc/systemd/system/deepneed.service
sudo systemctl daemon-reload

# 重新部署
./deploy.sh your-domain.com
```

## 📊 监控和维护

### 1. 性能监控

```bash
# 查看系统资源
htop
df -h
free -h

# 查看Docker资源
docker stats
```

### 2. 备份策略

```bash
# 备份数据
docker-compose -f docker-compose.production.yml exec backend tar -czf /app/backup-$(date +%Y%m%d).tar.gz /app/data

# 备份配置
sudo tar -czf deepneed-config-$(date +%Y%m%d).tar.gz /opt/deepneed/.env /etc/nginx/conf.d/your-domain.com.conf
```

### 3. 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新部署
./deploy.sh your-domain.com
```

## 📞 技术支持

如果遇到问题，请：

1. 查看日志文件
2. 检查系统资源
3. 验证配置文件
4. 联系技术支持

## 📝 更新日志

### v2.0.0 (2024-01-XX)
- 重构部署脚本
- 简化配置流程
- 增强错误处理
- 添加健康检查
- 支持多种部署模式

### v1.0.0 (2024-01-XX)
- 初始版本
- 基础Docker部署
- Nginx配置
- SSL支持 