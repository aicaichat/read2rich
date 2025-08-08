# 服务器端部署指南

## 问题诊断

当前服务器端遇到的主要问题：
1. **pycryptodome 依赖缺失** - 导致 API 服务无法启动
2. **pnpm lockfile 版本不匹配** - 导致前端构建失败
3. **端口占用** - 服务启动冲突

## 快速修复方案

### 方案一：使用修复脚本（推荐）

1. **上传修复脚本到服务器**
```bash
# 在本地执行
scp fix-server-deployment.sh root@your-server:/tmp/
```

2. **在服务器上执行修复**
```bash
# 登录服务器
ssh root@your-server

# 执行修复脚本
chmod +x /tmp/fix-server-deployment.sh
/tmp/fix-server-deployment.sh
```

### 方案二：手动修复

#### 1. 修复 API 服务依赖

```bash
cd /opt/deepneed/apps/api

# 激活虚拟环境
source venv/bin/activate

# 安装缺失的依赖
pip install pycryptodome

# 检查其他依赖
pip install -r requirements.txt 2>/dev/null || pip install fastapi uvicorn sqlalchemy psycopg2-binary python-multipart python-jose[cryptography] passlib[bcrypt] redis
```

#### 2. 修复前端构建问题

```bash
cd /opt/deepneed/apps/web

# 清理并重新安装依赖
rm -rf node_modules pnpm-lock.yaml
pnpm install --no-frozen-lockfile
```

#### 3. 重新构建和启动服务

```bash
cd /opt/deepneed

# 停止现有服务
docker compose -f docker-compose.production.yml down

# 清理 Docker 缓存
docker system prune -f

# 重新构建
docker compose -f docker-compose.production.yml build --no-cache

# 启动服务
docker compose -f docker-compose.production.yml up -d
```

## 验证部署

### 1. 检查服务状态
```bash
docker compose -f docker-compose.production.yml ps
```

### 2. 检查健康状态
```bash
# API 健康检查
curl http://localhost:8000/health

# 前端访问
curl http://localhost:3000
```

### 3. 查看日志
```bash
# API 日志
docker compose -f docker-compose.production.yml logs backend

# 前端日志
docker compose -f docker-compose.production.yml logs frontend
```

## 常见问题解决

### 1. 端口被占用
```bash
# 查看端口占用
lsof -i :8000
lsof -i :3000

# 强制释放端口
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### 2. 数据库连接问题
```bash
# 检查数据库服务
docker compose -f docker-compose.production.yml logs postgres

# 重新初始化数据库
docker compose -f docker-compose.production.yml down -v
docker compose -f docker-compose.production.yml up -d
```

### 3. 权限问题
```bash
# 修复文件权限
chown -R www-data:www-data /opt/deepneed
chmod -R 755 /opt/deepneed
```

## 支付配置页面访问

修复完成后，支付配置页面可以通过以下方式访问：

1. **直接访问**：`http://your-domain/admin/payment-settings`
2. **通过管理后台**：
   - 访问：`http://your-domain/admin/login`
   - 登录后点击左侧导航 **"系统管理"** → **"支付配置"**

## 监控和日志

### 实时监控
```bash
# 监控所有服务
docker compose -f docker-compose.production.yml logs -f

# 监控特定服务
docker compose -f docker-compose.production.yml logs -f backend
docker compose -f docker-compose.production.yml logs -f frontend
```

### 系统资源监控
```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

## 备份和恢复

### 备份数据
```bash
# 备份数据库
docker compose -f docker-compose.production.yml exec postgres pg_dump -U postgres deepneed > backup.sql

# 备份配置文件
tar -czf config-backup.tar.gz .env apps/api/.env apps/web/.env
```

### 恢复数据
```bash
# 恢复数据库
docker compose -f docker-compose.production.yml exec -T postgres psql -U postgres deepneed < backup.sql

# 恢复配置
tar -xzf config-backup.tar.gz
```

## 联系支持

如果遇到其他问题，请提供以下信息：
1. 服务器操作系统版本
2. Docker 和 Docker Compose 版本
3. 错误日志内容
4. 服务状态输出
