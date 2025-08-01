# DeepNeed 项目部署指南 - 使用现有nginx

## 🚀 快速部署（推荐）

### 前提条件
- 服务器已安装 Docker 和 Docker Compose
- 服务器已安装并运行 nginx
- 有 sudo 权限的普通用户或 root 用户
- 已获取必要的API Keys（DeepSeek API Key必需）

### 用户权限说明
- **普通用户**：推荐使用，脚本会自动使用sudo处理权限问题
- **root用户**：可以使用，脚本会提示确认后继续执行

### 一键部署

1. **配置API Keys**
```bash
# 复制环境变量示例文件
cp env.example .env

# 编辑配置文件，填入您的API Keys
nano .env
```

2. **上传项目文件到服务器**
```bash
# 在本地打包项目
tar -czf deepneed.tar.gz .

# 上传到服务器
scp deepneed.tar.gz user@your-server:/tmp/

# 在服务器上解压
cd /tmp
tar -xzf deepneed.tar.gz
cd deepneed
```

3. **运行快速部署脚本**
```bash
# 使用您的域名
./quick-deploy-nginx.sh your-domain.com

# 或者使用默认域名
./quick-deploy-nginx.sh
```

4. **访问应用**
```
http://your-domain.com
```

## 🔧 手动部署步骤

### 1. 准备环境
```bash
# 检查Docker
docker --version
docker-compose --version

# 检查nginx
nginx -v
sudo systemctl status nginx
```

### 2. 部署应用
```bash
# 创建项目目录
mkdir -p /opt/deepneed

# 如果是普通用户，需要sudo权限
if [ "$EUID" -ne 0 ]; then
    sudo chown $USER:$USER /opt/deepneed
fi

# 复制项目文件
cp -r . /opt/deepneed/
cd /opt/deepneed

# 启动Docker服务
docker-compose -f docker-compose.production.yml up -d
```

### 3. 配置nginx
```bash
# 创建nginx配置
sudo tee /etc/nginx/sites-available/deepneed > /dev/null << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    
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
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/deepneed /etc/nginx/sites-enabled/

# 测试并重载nginx
nginx -t
systemctl reload nginx
```

### 4. 创建系统服务
```bash
# 创建systemd服务
sudo tee /etc/systemd/system/deepneed.service > /dev/null << 'EOF'
[Unit]
Description=DeepNeed Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/deepneed
ExecStart=/usr/local/bin/docker-compose -f docker-compose.production.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.production.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# 启用服务
systemctl daemon-reload
systemctl enable deepneed
```

## 🔒 SSL证书配置（可选）

### 使用Let's Encrypt
```bash
# 安装certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 服务管理

### 查看服务状态
```bash
# 查看systemd服务状态
sudo systemctl status deepneed

# 查看Docker容器状态
docker-compose -f /opt/deepneed/docker-compose.production.yml ps

# 查看nginx状态
sudo systemctl status nginx
```

### 重启服务
```bash
# 重启整个应用
sudo systemctl restart deepneed

# 重启nginx
sudo systemctl restart nginx

# 重启Docker容器
cd /opt/deepneed
docker-compose -f docker-compose.production.yml restart
```

### 查看日志
```bash
# 查看应用日志
sudo journalctl -u deepneed -f

# 查看nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 查看Docker容器日志
docker-compose -f /opt/deepneed/docker-compose.production.yml logs -f
```

## 🔧 故障排除

### 常见问题

1. **端口被占用**
```bash
# 检查端口占用
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8000

# 停止占用端口的服务
sudo systemctl stop conflicting-service
```

2. **nginx配置错误**
```bash
# 测试nginx配置
sudo nginx -t

# 查看nginx错误日志
sudo tail -f /var/log/nginx/error.log
```

3. **Docker容器启动失败**
```bash
# 查看容器日志
docker-compose -f /opt/deepneed/docker-compose.production.yml logs

# 重新构建镜像
docker-compose -f /opt/deepneed/docker-compose.production.yml build --no-cache
```

4. **权限问题**
```bash
# 确保项目目录权限正确
sudo chown -R $USER:$USER /opt/deepneed

# 确保nginx配置权限正确
sudo chown root:root /etc/nginx/sites-available/deepneed
sudo chmod 644 /etc/nginx/sites-available/deepneed
```

### 健康检查
```bash
# 检查前端服务
curl -f http://localhost:3000

# 检查后端服务
curl -f http://localhost:8000

# 检查nginx代理
curl -f http://your-domain.com
```

## 📝 更新部署

### 更新应用
```bash
# 停止服务
sudo systemctl stop deepneed

# 备份当前版本
sudo cp -r /opt/deepneed /opt/deepneed.backup.$(date +%Y%m%d)

# 更新代码
cd /opt/deepneed
git pull origin main  # 如果使用git
# 或者重新上传新版本

# 重新构建并启动
docker-compose -f docker-compose.production.yml build
sudo systemctl start deepneed
```

### 回滚
```bash
# 停止服务
sudo systemctl stop deepneed

# 恢复备份
sudo rm -rf /opt/deepneed
sudo cp -r /opt/deepneed.backup.20231201 /opt/deepneed

# 重启服务
sudo systemctl start deepneed
```

## 🎯 性能优化

### nginx优化
```bash
# 在nginx配置中添加缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    proxy_pass http://localhost:3000;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Docker优化
```bash
# 清理未使用的Docker资源
docker system prune -a

# 限制容器资源使用
# 在docker-compose.production.yml中添加：
# deploy:
#   resources:
#     limits:
#       memory: 1G
#       cpus: '0.5'
```

---

## 📞 支持

如果遇到问题，请检查：
1. 服务器日志
2. Docker容器日志
3. nginx错误日志
4. 网络连接和防火墙设置

部署完成后，您的DeepNeed应用将在 `http://your-domain.com` 上运行！ 