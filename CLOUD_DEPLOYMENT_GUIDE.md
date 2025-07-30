# ☁️ DeepNeed AI 云服务器部署指南

## 📋 目录
1. [云服务器选择](#云服务器选择)
2. [阿里云部署](#阿里云部署)
3. [腾讯云部署](#腾讯云部署)
4. [AWS部署](#aws部署)
5. [通用部署步骤](#通用部署步骤)
6. [域名和SSL配置](#域名和ssl配置)
7. [监控和维护](#监控和维护)

## 🖥️ 云服务器选择

### 推荐配置
- **CPU**: 2核以上
- **内存**: 4GB以上
- **存储**: 50GB SSD
- **带宽**: 5Mbps以上
- **操作系统**: Ubuntu 20.04 LTS / CentOS 8+

### 成本估算
- **阿里云**: 约 ¥200-500/月
- **腾讯云**: 约 ¥180-450/月
- **AWS**: 约 $30-80/月

---

## 🚀 阿里云部署

### 1. 购买ECS实例
```bash
# 推荐配置
实例规格: ecs.g6.large (2核4GB)
系统盘: 40GB SSD
带宽: 5Mbps
操作系统: Ubuntu 20.04 LTS
```

### 2. 安全组配置
```bash
# 开放端口
22    SSH
80    HTTP
443   HTTPS
3000  Grafana监控
```

### 3. 连接服务器
```bash
# 使用SSH连接
ssh root@your-server-ip

# 创建部署用户
adduser deepneed
usermod -aG sudo deepneed
su - deepneed
```

### 4. 一键部署
```bash
# 下载项目
git clone https://github.com/your-username/deepneed-ai.git
cd deepneed-ai

# 执行快速部署
chmod +x quick-deploy-prod.sh
./quick-deploy-prod.sh
```

---

## 🚀 腾讯云部署

### 1. 购买CVM实例
```bash
# 推荐配置
实例规格: S5.MEDIUM2 (2核4GB)
系统盘: 50GB SSD
带宽: 5Mbps
操作系统: Ubuntu 20.04 LTS
```

### 2. 安全组配置
```bash
# 开放端口
22    SSH
80    HTTP
443   HTTPS
3000  Grafana监控
```

### 3. 部署步骤
```bash
# 连接服务器
ssh ubuntu@your-server-ip

# 下载并部署
git clone https://github.com/your-username/deepneed-ai.git
cd deepneed-ai
chmod +x quick-deploy-prod.sh
./quick-deploy-prod.sh
```

---

## 🚀 AWS部署

### 1. 启动EC2实例
```bash
# 推荐配置
实例类型: t3.medium (2核4GB)
存储: 50GB gp3
安全组: 开放22, 80, 443, 3000端口
AMI: Ubuntu Server 20.04 LTS
```

### 2. 连接实例
```bash
# 使用SSH连接
ssh -i your-key.pem ubuntu@your-ec2-ip

# 部署应用
git clone https://github.com/your-username/deepneed-ai.git
cd deepneed-ai
chmod +x quick-deploy-prod.sh
./quick-deploy-prod.sh
```

---

## 🔧 通用部署步骤

### 1. 系统准备
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y curl wget git vim htop

# 设置时区
sudo timedatectl set-timezone Asia/Shanghai
```

### 2. 安装Docker
```bash
# 自动安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 添加用户到docker组
sudo usermod -aG docker $USER

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 重新登录或运行
newgrp docker
```

### 3. 下载项目
```bash
# 克隆项目
git clone https://github.com/your-username/deepneed-ai.git
cd deepneed-ai

# 或下载ZIP包
wget https://github.com/your-username/deepneed-ai/archive/main.zip
unzip main.zip
cd deepneed-ai-main
```

### 4. 配置环境
```bash
# 编辑环境配置
nano .env

# 重要配置项
SECRET_KEY=your_secure_secret_key
CLAUDE_API_KEY=sk-ant-api03-your-claude-key
DEEPSEEK_API_KEY=sk-your-deepseek-key
POSTGRES_PASSWORD=your_secure_db_password
GRAFANA_PASSWORD=your_secure_grafana_password
```

### 5. 执行部署
```bash
# 执行快速部署脚本
chmod +x quick-deploy-prod.sh
./quick-deploy-prod.sh
```

### 6. 验证部署
```bash
# 检查服务状态
docker-compose -f docker-compose.prod.yml ps

# 测试应用访问
curl -k https://localhost/health

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🌐 域名和SSL配置

### 1. 域名解析
```bash
# 在域名服务商处添加A记录
yourdomain.com      A    your-server-ip
www.yourdomain.com  A    your-server-ip
```

### 2. Let's Encrypt SSL证书
```bash
# 安装certbot
sudo apt install -y certbot

# 申请证书
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# 复制证书到项目目录
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem docker/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem docker/nginx/ssl/key.pem
sudo chown $USER:$USER docker/nginx/ssl/*

# 设置自动续期
sudo crontab -e
# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet && cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /path/to/deepneed-ai/docker/nginx/ssl/cert.pem && cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /path/to/deepneed-ai/docker/nginx/ssl/key.pem && docker-compose -f /path/to/deepneed-ai/docker-compose.prod.yml restart nginx
```

### 3. 更新Nginx配置
```bash
# 编辑Nginx配置
nano docker/nginx/default.conf

# 修改server_name
server_name yourdomain.com www.yourdomain.com;
```

### 4. 重启服务
```bash
# 重启Nginx服务
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 📊 监控和维护

### 1. 系统监控
```bash
# 查看系统资源
htop
df -h
free -h

# 查看Docker资源使用
docker stats
```

### 2. 应用监控
```bash
# 访问Grafana监控面板
http://yourdomain.com:3000
用户名: admin
密码: 在.env文件中设置的GRAFANA_PASSWORD
```

### 3. 日志管理
```bash
# 查看应用日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### 4. 数据备份
```bash
# 创建备份脚本
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/deepneed"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# 备份数据库
docker-compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U deepneed deepneed_prod > $BACKUP_DIR/db_$DATE.sql

# 备份应用数据
tar -czf $BACKUP_DIR/app_$DATE.tar.gz data/

# 删除7天前的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x backup.sh

# 设置定时备份
crontab -e
# 添加以下行（每天凌晨2点备份）
0 2 * * * /path/to/deepneed-ai/backup.sh
```

### 5. 更新维护
```bash
# 更新应用
git pull origin main
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# 清理Docker资源
docker system prune -f
docker volume prune -f
```

---

## 🔒 安全加固

### 1. 防火墙配置
```bash
# 安装UFW
sudo apt install -y ufw

# 配置防火墙规则
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

### 2. SSH安全
```bash
# 编辑SSH配置
sudo nano /etc/ssh/sshd_config

# 修改以下配置
PermitRootLogin no
PasswordAuthentication no
Port 2222  # 修改默认端口

# 重启SSH服务
sudo systemctl restart sshd
```

### 3. 系统更新
```bash
# 设置自动安全更新
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 🆘 故障排除

### 常见问题

1. **容器启动失败**
```bash
# 查看详细错误
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

# 重新申请证书
sudo certbot renew --dry-run
```

4. **内存不足**
```bash
# 查看内存使用
free -h

# 增加swap空间
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📞 技术支持

### 获取帮助
- 📧 Email: support@deepneed.com
- 💬 微信: DeepNeed-Support
- 📱 QQ群: 123456789
- 📖 文档: https://docs.deepneed.com

### 社区资源
- GitHub Issues: https://github.com/your-username/deepneed-ai/issues
- 讨论区: https://github.com/your-username/deepneed-ai/discussions

---

**祝您部署成功！** 🎉

> 💡 **提示**: 部署完成后，建议定期检查系统状态、更新应用版本、备份重要数据。 