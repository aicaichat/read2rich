# 🐳 DeepNeed AI Docker 快速参考

## 🚀 一键启动命令

```bash
# 当前演示环境 (正在运行) ✅
./docker-demo.sh

# 完整开发环境
./scripts/deploy-dev.sh

# 生产环境
./scripts/deploy-prod.sh

# 智能选择模式
./quick-start.sh
```

## 📡 服务地址

| 环境 | 前端 | 后端API | API文档 | 数据库管理 | 状态 |
|------|------|---------|---------|------------|------|
| **演示** | - | http://localhost:8001 | http://localhost:8001/docs | - | ✅ **运行中** |
| **开发** | http://localhost:5173 | http://localhost:8001 | http://localhost:8001/docs | http://localhost:8080 | ✅ 已配置 |
| **生产** | http://yourdomain.com | http://yourdomain.com/api | http://yourdomain.com/docs | - | ✅ 已配置 |

## 🔧 管理命令

### 演示环境 (当前运行)
```bash
./docker-demo.sh --status    # 查看状态
./docker-demo.sh --logs      # 查看日志
./docker-demo.sh --test      # 运行测试
./docker-demo.sh --stop      # 停止服务
```

### 开发环境
```bash
./scripts/deploy-dev.sh --restart   # 重启服务
./scripts/deploy-dev.sh --logs      # 查看日志
./scripts/deploy-dev.sh --stop      # 停止服务
```

### 生产环境
```bash
./scripts/deploy-prod.sh --rolling-update  # 滚动更新
./scripts/deploy-prod.sh --backup          # 创建备份
./scripts/deploy-prod.sh --health-check    # 健康检查
```

## 🧪 快速测试

```bash
# 健康检查
curl http://localhost:8001/health

# API测试
curl http://localhost:8001/

# 查看容器状态
docker ps | grep deepneed
```

## 📁 重要文件

```
📦 DeepNeed AI Docker
├── 🐳 Docker配置
│   ├── docker/frontend.Dockerfile      # 前端构建
│   ├── docker/backend.Dockerfile       # 后端构建
│   └── docker/nginx/                   # Nginx配置
├── 🚀 Compose文件
│   ├── docker-compose.demo.yml   ✅    # 演示环境
│   ├── docker-compose.dev.yml          # 开发环境
│   └── docker-compose.prod.yml         # 生产环境
├── ⚙️ 环境配置
│   ├── docker/env/dev.env              # 开发变量
│   └── docker/env/prod.env             # 生产变量
└── 🔧 部署脚本
    ├── docker-demo.sh            ✅    # 演示脚本
    ├── scripts/deploy-dev.sh           # 开发部署
    ├── scripts/deploy-prod.sh          # 生产部署
    └── quick-start.sh                  # 快速启动
```

## ⚡ 故障排除

### 常见问题

1. **端口占用**
   ```bash
   lsof -i :8001
   ./docker-demo.sh --stop
   ```

2. **容器启动失败**
   ```bash
   docker-compose -f docker-compose.demo.yml logs
   ```

3. **API无响应**
   ```bash
   curl http://localhost:8001/health
   docker restart deepneed-backend-demo
   ```

### 重置环境
```bash
# 停止所有服务
./docker-demo.sh --stop
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.prod.yml down

# 清理容器和镜像
docker system prune -f

# 重新启动
./docker-demo.sh
```

## 🎯 下一步操作

### 体验演示环境
✅ 当前演示环境正在运行，可以直接测试：
- 访问 http://localhost:8001/docs 查看API文档
- 运行 `curl http://localhost:8001/health` 测试健康检查

### 切换到开发环境
```bash
./docker-demo.sh --stop
./scripts/deploy-dev.sh
```

### 部署到生产环境
```bash
# 1. 配置环境变量
cp docker/env/prod.env.example docker/env/prod.env
vim docker/env/prod.env  # 修改配置

# 2. 部署
./scripts/deploy-prod.sh
```

---

## 📞 需要帮助？

- 📚 查看完整文档: `DEPLOYMENT.md`
- 📊 查看部署总结: `DOCKER_DEPLOYMENT_SUMMARY.md`
- 🔧 运行快速诊断: `./docker-demo.sh --test`

**当前状态**: ✅ Docker演示环境运行正常 🚀 