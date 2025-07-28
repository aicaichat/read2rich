# ☁️ DeepNeed AI 云服务器快速部署指南

## 🎯 选择一：一键快速部署（推荐新手）

### 1. 购买云服务器
推荐配置：
- **阿里云/腾讯云/华为云**: 2核4GB，40GB SSD
- **操作系统**: Ubuntu 20.04 LTS
- **网络**: 带宽不少于1Mbps

### 2. 连接服务器
```bash
# 使用SSH连接（替换为您的服务器IP）
ssh root@your_server_ip
```

### 3. 一键部署
```bash
# 下载项目
git clone https://github.com/your-username/deepneed-ai.git
cd deepneed-ai

# 执行一键部署
./quick-deploy-prod.sh
```

### 4. 配置域名（可选）
```bash
# 编辑配置文件
nano .env

# 修改以下配置
CORS_ORIGINS=https://yourdomain.com
CLAUDE_API_KEY=your_claude_api_key
```

---

## 🎯 选择二：详细配置部署（推荐有经验用户）

### 第一步：服务器基础配置

#### 1.1 更新系统
```bash
sudo apt update && sudo apt upgrade -y
```

#### 1.2 安装Docker
```bash
# 安装Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 重新登录以应用组权限
logout
```

#### 1.3 配置防火墙
```bash
# Ubuntu UFW
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 检查状态
sudo ufw status
```

### 第二步：部署应用

#### 2.1 下载代码
```bash
# 创建工作目录
mkdir -p /opt/deepneed
cd /opt/deepneed

# 克隆项目
git clone https://github.com/your-username/deepneed-ai.git .
```

#### 2.2 配置环境
```bash
# 创建环境配置
cat > .env << 'EOF'
# DeepNeed AI 生产环境配置
SECRET_KEY=your_very_long_and_secure_secret_key_here
CLAUDE_API_KEY=sk-ant-api03-your-claude-api-key
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
EOF

# 设置权限
chmod 600 .env
```

#### 2.3 SSL证书设置
```bash
# 方法1：自签名证书（快速测试）
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem \
  -subj "/C=CN/ST=State/L=City/O=Organization/CN=yourdomain.com"

# 方法2：Let's Encrypt（生产推荐）
sudo apt install certbot -y
sudo certbot certonly --standalone -d yourdomain.com
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

#### 2.4 启动服务
```bash
# 启动部署
./quick-deploy-prod.sh

# 检查服务状态
docker-compose -f docker-compose.production.yml ps
```

### 第三步：域名配置

#### 3.1 DNS设置
在您的域名提供商管理面板中：
```
类型    名称    值
A      @       your_server_ip
A      www     your_server_ip
```

#### 3.2 验证部署
```bash
# 检查服务
curl -k https://yourdomain.com/api/health

# 查看日志
docker-compose -f docker-compose.production.yml logs -f
```

---

## 🚀 各大云平台快速部署

### 阿里云ECS

#### 1. 购买服务器
- 进入阿里云控制台 → 云服务器ECS
- 选择: 2核4GB，Ubuntu 20.04
- 网络: 分配公网IP

#### 2. 安全组配置
```
方向    端口范围      源地址
入方向  22/22        0.0.0.0/0
入方向  80/80        0.0.0.0/0
入方向  443/443      0.0.0.0/0
```

#### 3. 连接部署
```bash
ssh root@your_ecs_ip
git clone https://github.com/your-username/deepneed-ai.git
cd deepneed-ai
./quick-deploy-prod.sh
```

### 腾讯云CVM

#### 1. 购买配置
- 腾讯云控制台 → 云服务器
- 2核4GB，Ubuntu 20.04
- 勾选"分配免费公网IP"

#### 2. 防火墙设置
- 安全组 → 添加规则
- 开放22, 80, 443端口

#### 3. 部署命令
```bash
ssh ubuntu@your_cvm_ip
sudo su -
git clone https://github.com/your-username/deepneed-ai.git
cd deepneed-ai
./quick-deploy-prod.sh
```

### 华为云ECS

#### 1. 创建实例
- 华为云控制台 → 弹性云服务器
- 通用计算型，2核4GB
- Ubuntu 20.04，绑定弹性公网IP

#### 2. 安全组
- 添加入方向规则：22, 80, 443端口

#### 3. 部署
```bash
ssh root@your_huawei_ip
git clone https://github.com/your-username/deepneed-ai.git
cd deepneed-ai
./quick-deploy-prod.sh
```

---

## 📊 监控和维护

### 日常管理命令
```bash
# 查看服务状态
docker-compose -f docker-compose.production.yml ps

# 查看实时日志
docker-compose -f docker-compose.production.yml logs -f

# 重启服务
./quick-deploy-prod.sh --restart

# 停止服务
./quick-deploy-prod.sh --stop
```

### 性能监控
```bash
# 查看资源使用
docker stats

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

### 备份数据
```bash
# 备份配置文件
tar -czf backup_$(date +%Y%m%d).tar.gz .env ssl/ data/

# 定期清理日志
docker system prune -f
```

---

## 🛡️ 安全建议

### 基础安全
```bash
# 更改SSH端口
sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# 禁用密码登录（使用SSH密钥）
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# 设置自动更新
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 应用安全
```bash
# 定期更新镜像
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d

# 监控日志异常
tail -f /var/log/nginx/error.log
```

---

## 🆘 常见问题解决

### 1. 容器启动失败
```bash
# 查看详细错误
docker-compose -f docker-compose.production.yml logs

# 检查端口占用
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

### 2. 无法访问网站
```bash
# 检查防火墙
sudo ufw status

# 检查DNS解析
nslookup yourdomain.com

# 检查SSL证书
openssl x509 -in ssl/cert.pem -text -noout
```

### 3. 性能问题
```bash
# 增加内存限制
# 编辑 docker-compose.production.yml
deploy:
  resources:
    limits:
      memory: 2G
    reservations:
      memory: 1G
```

---

## 📞 技术支持

遇到问题？联系我们：
- 📧 Email: support@deepneed.com  
- 💬 QQ群: 123456789
- 📚 文档: https://docs.deepneed.com

**祝您部署顺利！** 🎉 