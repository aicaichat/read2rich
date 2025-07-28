# DeepNeed AI Docker 部署指南

## 🚀 快速开始

### 一键启动
```bash
# 使用快速启动脚本
./quick-start.sh
```

选择部署模式：
1. **开发环境** - 完整功能，包含数据库
2. **简化模式** - 快速启动，基于现有最小后端
3. **生产环境** - 需要配置生产环境变量

## 📋 系统要求

- **Docker**: >= 20.10.0
- **Docker Compose**: >= 2.0.0
- **内存**: 最少 4GB，推荐 8GB
- **磁盘**: 最少 10GB 可用空间
- **网络**: 开放端口 80, 443, 5173, 8001

## 🛠️ 开发环境部署

### 手动部署
```bash
# 1. 启动开发环境
./scripts/deploy-dev.sh

# 2. 查看日志
./scripts/deploy-dev.sh --logs

# 3. 重启服务
./scripts/deploy-dev.sh --restart

# 4. 停止服务
./scripts/deploy-dev.sh --stop
```

### 服务访问
- **前端应用**: http://localhost:5173
- **后端API**: http://localhost:8001
- **API文档**: http://localhost:8001/docs
- **数据库管理**: http://localhost:8080 (Adminer)
- **Redis**: localhost:6379

### 开发环境配置
编辑 `docker/env/dev.env` 文件：
```env
# AI API配置
CLAUDE_API_KEY=your_claude_key_here
DEEPSEEK_API_KEY=your_deepseek_key_here

# 数据库配置
POSTGRES_PASSWORD=deepneed_dev_password
```

## 🏭 生产环境部署

### 前置准备
1. **配置环境变量**
   ```bash
   cp docker/env/prod.env.example docker/env/prod.env
   # 编辑 docker/env/prod.env，修改所有 CHANGE_THIS 配置
   ```

2. **SSL证书** (可选)
   ```bash
   mkdir -p docker/nginx/ssl
   # 将证书文件放入 docker/nginx/ssl/
   ```

### 部署命令
```bash
# 1. 部署生产环境
./scripts/deploy-prod.sh

# 2. 滚动更新
./scripts/deploy-prod.sh --rolling-update

# 3. 健康检查
./scripts/deploy-prod.sh --health-check

# 4. 创建备份
./scripts/deploy-prod.sh --backup
```

### 生产环境配置

#### 必须修改的配置
```env
# 安全密钥
SECRET_KEY=your_super_secure_secret_key_here

# 数据库密码
POSTGRES_PASSWORD=your_secure_db_password

# AI API密钥
CLAUDE_API_KEY=your_claude_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# 监控面板密码
GRAFANA_PASSWORD=your_grafana_password

# 域名配置
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 监控和日志
- **Grafana监控**: http://your-domain.com:3000
- **日志查看**: `docker-compose -f docker-compose.prod.yml logs -f`
- **系统状态**: `./scripts/deploy-prod.sh --health-check`

## 📦 服务架构

### 开发环境服务
```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (React+Vite)  │    │   (FastAPI)     │
│   Port: 5173    │    │   Port: 8001    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────┬───────────────┘
                 │
    ┌─────────────────┐    ┌─────────────────┐
    │   PostgreSQL    │    │   Redis         │
    │   Port: 5432    │    │   Port: 6379    │
    └─────────────────┘    └─────────────────┘
```

### 生产环境服务
```
┌─────────────────┐
│   Nginx         │
│   Port: 80/443  │
└─────────────────┘
         │
    ┌─────────────────┐    ┌─────────────────┐
    │   Frontend      │    │   Backend       │
    │   (Static)      │    │   (FastAPI)     │
    └─────────────────┘    └─────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         │                                                   │
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │   PostgreSQL    │    │   Redis         │    │   Monitoring    │
    │                 │    │                 │    │   (Grafana)     │
    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 常用命令

### Docker管理
```bash
# 查看容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f [service_name]

# 重启特定服务
docker-compose restart [service_name]

# 进入容器
docker-compose exec [service_name] /bin/bash

# 清理未使用的资源
docker system prune -f
```

### 数据库管理
```bash
# 连接数据库
docker-compose exec postgres psql -U deepneed -d deepneed_dev

# 备份数据库
docker-compose exec postgres pg_dump -U deepneed deepneed_dev > backup.sql

# 恢复数据库
docker-compose exec -T postgres psql -U deepneed deepneed_dev < backup.sql
```

### 应用管理
```bash
# 重建镜像
docker-compose build --no-cache

# 更新依赖
docker-compose down && docker-compose up -d

# 查看资源使用
docker stats
```

## 🛡️ 安全配置

### 生产环境安全清单
- [ ] 修改所有默认密码
- [ ] 配置SSL/TLS证书
- [ ] 设置防火墙规则
- [ ] 启用日志监控
- [ ] 配置自动备份
- [ ] 限制数据库访问
- [ ] 禁用调试模式
- [ ] 设置资源限制

### 防火墙配置
```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 5432/tcp  # 禁止外部访问数据库
sudo ufw deny 6379/tcp  # 禁止外部访问Redis

# CentOS/RHEL
sudo firewall-cmd --add-port=80/tcp --permanent
sudo firewall-cmd --add-port=443/tcp --permanent
sudo firewall-cmd --reload
```

## 📊 监控和维护

### 健康检查
```bash
# 检查所有服务状态
curl http://localhost/health

# 检查后端API
curl http://localhost:8001/health

# 检查数据库连接
docker-compose exec postgres pg_isready
```

### 性能监控
- **CPU使用率**: `docker stats`
- **内存使用**: `docker stats`
- **磁盘空间**: `df -h`
- **网络流量**: `docker-compose logs nginx`

### 日志管理
```bash
# 查看错误日志
docker-compose logs --tail=100 backend | grep ERROR

# 清理日志
docker-compose down && docker system prune -f

# 设置日志轮转
sudo logrotate -f /etc/logrotate.d/deepneed
```

## 🔄 CI/CD 集成

### GitHub Actions 示例
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to production
        run: |
          ./scripts/deploy-prod.sh --rolling-update
```

### 自动备份
```bash
# 设置定时备份
echo "0 2 * * * /path/to/scripts/deploy-prod.sh --backup" | crontab -
```

## 🚨 故障排除

### 常见问题

#### 端口冲突
```bash
# 查看端口占用
lsof -i :8001
sudo netstat -tulpn | grep :8001

# 修改端口配置
vi docker-compose.yml
```

#### 内存不足
```bash
# 增加Docker内存限制
docker-compose.yml:
  deploy:
    resources:
      limits:
        memory: 2G
```

#### 数据库连接失败
```bash
# 检查数据库状态
docker-compose exec postgres pg_isready

# 重置数据库
docker-compose down postgres
docker volume rm $(docker volume ls -q | grep postgres)
docker-compose up -d postgres
```

#### 构建失败
```bash
# 清理构建缓存
docker builder prune -f

# 重新构建
docker-compose build --no-cache
```

### 日志分析
```bash
# 后端错误日志
docker-compose logs backend | grep "ERROR\|CRITICAL"

# 前端构建日志
docker-compose logs frontend

# 数据库日志
docker-compose logs postgres

# Nginx访问日志
docker-compose exec nginx tail -f /var/log/nginx/access.log
```

## 📞 技术支持

### 获取帮助
- **文档**: 查看本文档和代码注释
- **日志**: 先查看相关服务日志
- **健康检查**: 运行 `./scripts/deploy-prod.sh --health-check`

### 系统信息收集
```bash
# 收集系统信息用于故障排除
echo "=== Docker版本 ===" > debug.log
docker --version >> debug.log
docker-compose --version >> debug.log

echo "=== 容器状态 ===" >> debug.log
docker-compose ps >> debug.log

echo "=== 资源使用 ===" >> debug.log
docker stats --no-stream >> debug.log

echo "=== 磁盘空间 ===" >> debug.log
df -h >> debug.log
```

---

## 🎉 部署完成

恭喜！您已经成功部署了 DeepNeed AI 系统。

### 下一步
1. 配置域名和SSL证书
2. 设置监控告警
3. 配置自动备份
4. 进行性能调优
5. 准备用户培训 