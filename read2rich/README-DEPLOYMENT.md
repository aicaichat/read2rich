# Read2Rich 服务器部署指南

## 🚀 快速部署

### 1. 服务器要求
- Ubuntu 18.04+ 或 CentOS 7+
- Docker 和 Docker Compose
- Nginx
- 域名解析到服务器IP

### 2. 一键部署命令

```bash
# 1. 克隆代码
git clone https://github.com/aicaichat/read2rich.git
cd read2rich

# 2. 运行完整安装脚本 (包含nginx和SSL)
sudo ./nginx-setup.sh

# 3. 部署应用
./deploy-server.sh
```

### 3. 手动部署步骤

#### 3.1 部署应用服务
```bash
# 构建并启动
docker compose -f docker-compose.prod.yml up -d

# 检查状态
docker compose -f docker-compose.prod.yml ps
```

#### 3.2 配置Nginx (如果已有nginx)
```bash
# 复制配置文件
sudo cp nginx-read2rich.conf /etc/nginx/conf.d/read2rich.com.conf

# 测试配置
sudo nginx -t

# 重载nginx
sudo systemctl reload nginx
```

#### 3.3 申请SSL证书 (如果已有nginx)
```bash
# 运行快速SSL设置
sudo ./quick-ssl-setup.sh
```

## 📋 服务端口

- **前端**: 8080 (Docker容器)
- **后端**: 8001 (Docker容器)
- **Nginx**: 80, 443 (对外访问)

## 🔧 常用命令

```bash
# 查看服务状态
docker compose -f docker-compose.prod.yml ps

# 查看日志
docker compose -f docker-compose.prod.yml logs -f

# 重启服务
docker compose -f docker-compose.prod.yml restart

# 更新部署
git pull && ./deploy-server.sh

# 查看nginx状态
sudo systemctl status nginx

# 查看SSL证书状态
sudo certbot certificates
```

## 🐛 故障排除

### 服务无法启动
```bash
# 检查端口占用
sudo netstat -tlnp | grep :8080
sudo netstat -tlnp | grep :8001

# 查看详细日志
docker compose -f docker-compose.prod.yml logs
```

### SSL证书问题
```bash
# 手动续期证书
sudo certbot renew

# 测试证书配置
sudo nginx -t
```

### 域名解析问题
```bash
# 检查域名解析
dig read2rich.com
nslookup read2rich.com

# 检查服务器IP
curl ifconfig.me
```

## 📞 支持

如有问题，请检查：
1. 域名是否正确解析
2. 防火墙是否开放80/443端口
3. Docker服务是否正常运行
4. Nginx配置是否正确
