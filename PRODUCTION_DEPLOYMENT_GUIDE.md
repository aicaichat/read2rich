# 🚀 DeepNeed AI 生产环境部署指南

## 📋 目录
1. [部署准备](#部署准备)
2. [服务器配置](#服务器配置)
3. [环境配置](#环境配置)
4. [部署执行](#部署执行)
5. [监控配置](#监控配置)
6. [安全配置](#安全配置)
7. [维护操作](#维护操作)

## 🛠 部署准备

### 系统要求
- **操作系统**: Ubuntu 20.04 LTS 或 CentOS 8+
- **内存**: 最少 4GB，推荐 8GB+
- **CPU**: 最少 2核，推荐 4核+
- **存储**: 最少 50GB SSD
- **网络**: 稳定的互联网连接

### 依赖安装
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose git curl nginx

# CentOS/RHEL
sudo yum install -y docker docker-compose git curl nginx

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 添加用户到docker组
sudo usermod -aG docker $USER
```

## 🖥 服务器配置

### 1. 创建部署用户
```bash
# 创建专用用户
sudo useradd -m -s /bin/bash deepneed
sudo usermod -aG docker deepneed

# 设置SSH密钥（推荐）
sudo -u deepneed mkdir -p /home/deepneed/.ssh
# 将您的公钥添加到 /home/deepneed/.ssh/authorized_keys
```

### 2. 下载项目代码
```bash
# 切换到部署用户
sudo su - deepneed

# 克隆项目（替换为您的仓库地址）
git clone https://github.com/your-username/deepneed-ai.git
cd deepneed-ai
```

## ⚙️ 环境配置

### 1. 配置生产环境变量
```bash
# 复制环境文件模板
cp docker/env/prod.env.example docker/env/prod.env

# 编辑生产环境配置
nano docker/env/prod.env
```

### 2. 必须修改的配置项

```bash
# ⚠️ 安全配置 - 必须修改
SECRET_KEY=your_very_long_and_secure_secret_key_here

# ⚠️ 数据库密码 - 必须修改
POSTGRES_PASSWORD=your_secure_database_password

# ⚠️ 监控密码 - 必须修改
GRAFANA_PASSWORD=your_secure_grafana_password

# ⚠️ AI API 密钥 - 填入有效密钥
CLAUDE_API_KEY=sk-ant-api03-your-claude-api-key
DEEPSEEK_API_KEY=sk-your-deepseek-api-key

# ⚠️ 域名配置 - 修改为您的域名
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. SSL 证书配置
```bash
# 创建SSL证书目录
sudo mkdir -p /etc/nginx/ssl

# 方法1: 使用Let's Encrypt（推荐）
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 方法2: 使用自签名证书（仅用于测试）
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/key.pem \
  -out /etc/nginx/ssl/cert.pem

# 复制证书到项目目录
sudo cp /etc/nginx/ssl/* docker/nginx/ssl/
sudo chown deepneed:deepneed docker/nginx/ssl/*
```

## 🚀 部署执行

### 1. 执行部署脚本
```bash
# 使部署脚本可执行
chmod +x scripts/deploy-prod.sh

# 执行生产环境部署
./scripts/deploy-prod.sh
```

### 2. 验证部署
```bash
# 检查容器状态
docker-compose -f docker-compose.prod.yml ps

# 检查服务健康状态
./scripts/deploy-prod.sh --health-check

# 测试应用访问
curl -k https://yourdomain.com/health
```

## 📊 监控配置

### 1. Grafana 监控面板
访问 `https://yourdomain.com:3000`
- 用户名: `admin`
- 密码: 在 `prod.env` 中设置的 `GRAFANA_PASSWORD`

### 2. 导入监控面板
```bash
# Grafana面板配置在
docker/grafana/provisioning/dashboards/
```

### 3. 告警配置
```bash
# 配置钉钉/邮件告警
# 编辑 docker/grafana/provisioning/alerting/
```

## 🔒 安全配置

### 1. 防火墙配置
```bash
# Ubuntu UFW
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS Firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. 系统安全加固
```bash
# 禁用root登录
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# 自动安全更新
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 3. Docker安全配置
```bash
# 限制Docker daemon权限
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "userns-remap": "default",
  "live-restore": true,
  "userland-proxy": false,
  "no-new-privileges": true
}
EOF
sudo systemctl restart docker
```

## 🔧 维护操作

### 日常管理命令
```bash
# 查看服务状态
./scripts/deploy-prod.sh --health-check

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 滚动更新
./scripts/deploy-prod.sh --rolling-update

# 创建备份
./scripts/deploy-prod.sh --backup

# 停止服务
./scripts/deploy-prod.sh --stop
```

### 数据备份
```bash
# 手动备份数据库
docker-compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U deepneed deepneed_prod > backup_$(date +%Y%m%d).sql

# 自动备份脚本已配置在容器中，每天执行
```

### 日志管理
```bash
# 查看nginx日志
docker-compose -f docker-compose.prod.yml logs nginx

# 查看后端日志
docker-compose -f docker-compose.prod.yml logs backend

# 清理旧日志
docker system prune -f --volumes
```

## 🌐 域名配置

### DNS 设置
```bash
# A记录指向服务器IP
yourdomain.com      A    your.server.ip
www.yourdomain.com  A    your.server.ip

# 或使用CNAME
www.yourdomain.com  CNAME  yourdomain.com
```

### CDN 配置（可选）
推荐使用 Cloudflare 等CDN服务来提高访问速度和安全性。

## 🔄 CI/CD 配置

### GitHub Actions 示例
创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /home/deepneed/deepneed-ai
            git pull origin main
            ./scripts/deploy-prod.sh --rolling-update
```

## 📈 性能优化

### 1. 数据库优化
```bash
# PostgreSQL配置优化
# 编辑 docker/postgres/postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
```

### 2. 应用缓存
```bash
# Redis缓存已配置
# 可在应用中使用Redis进行缓存优化
```

### 3. 静态资源优化
```bash
# Nginx配置已包含Gzip压缩
# 可配置CDN进一步优化
```

## 🆘 故障排除

### 常见问题

1. **容器启动失败**
```bash
# 查看详细错误信息
docker-compose -f docker-compose.prod.yml logs

# 检查端口占用
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

2. **数据库连接失败**
```bash
# 检查数据库状态
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# 重置数据库密码
docker-compose -f docker-compose.prod.yml exec postgres \
  psql -U postgres -c "ALTER USER deepneed PASSWORD 'new_password';"
```

3. **SSL证书问题**
```bash
# 检查证书有效性
openssl x509 -in docker/nginx/ssl/cert.pem -text -noout

# 重新申请Let's Encrypt证书
sudo certbot renew --dry-run
```

## 📞 技术支持

如需技术支持，请联系：
- 📧 Email: support@deepneed.com
- 💬 微信: DeepNeed-Support
- 📱 QQ群: 123456789

---

**祝您部署成功！** 🎉 