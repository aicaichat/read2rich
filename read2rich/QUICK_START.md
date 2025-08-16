# 🚀 Read2Rich 快速启动指南

## 📋 前置要求

- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- Git

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd read2rich
```

### 2. 环境配置
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置文件
vim .env
```

### 3. 启动开发环境
```bash
# 启动所有服务
./scripts/start-dev.sh

# 或者手动启动
docker-compose up -d
cd frontend && npm install && npm run dev
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
```

### 4. 访问应用
- 🌐 前端: http://localhost:3000
- 📚 后端 API: http://localhost:8000
- 📖 API 文档: http://localhost:8000/docs

## 🐳 Docker 部署

### 开发环境
```bash
docker-compose up -d
```

### 生产环境
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔧 开发模式

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

### 后端开发
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 微服务开发
```bash
cd microservices/ingestion
pip install -r requirements.txt
python main.py
```

## 🌍 多语言配置

### 添加新语言
1. 在 `frontend/src/locales/` 下创建新语言目录
2. 添加 `translation.json` 文件
3. 在 `frontend/src/i18n/config.ts` 中注册新语言

### 语言切换
- 使用 `useTranslation()` hook
- 通过 `i18n.changeLanguage()` 切换语言
- 支持自动语言检测

## 📊 数据库管理

### 初始化数据库
```bash
# 创建数据库表
docker-compose exec backend python -c "from app.models import Base; from app.core.database import engine; Base.metadata.create_all(bind=engine)"
```

### 数据库迁移
```bash
# 使用 Alembic 进行数据库迁移
cd backend
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## 🔐 OAuth 配置

### GitHub OAuth
1. 访问 GitHub Developer Settings
2. 创建 OAuth App
3. 设置回调 URL: `http://localhost:8000/api/v1/auth/github/callback`
4. 更新 `.env` 文件

### Google OAuth
1. 访问 Google Cloud Console
2. 创建 OAuth 2.0 客户端
3. 设置回调 URL: `http://localhost:8000/api/v1/auth/google/callback`
4. 更新 `.env` 文件

## 🧪 测试

### 运行测试
```bash
# 前端测试
cd frontend
npm test

# 后端测试
cd backend
pytest

# 集成测试
docker-compose exec backend pytest tests/
```

## 📈 监控和日志

### 查看日志
```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs backend
docker-compose logs frontend
```

### 健康检查
```bash
# API 健康检查
curl http://localhost:8000/health

# 服务状态
docker-compose ps
```

## 🚀 生产部署

### 1. 构建生产镜像
```bash
docker-compose -f docker-compose.prod.yml build
```

### 2. 启动生产服务
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. 配置 Nginx
```bash
# 复制 Nginx 配置
sudo cp docker/nginx/nginx.conf /etc/nginx/
sudo systemctl reload nginx
```

## 🆘 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :3000
   lsof -i :8000
   ```

2. **数据库连接失败**
   ```bash
   # 检查数据库状态
   docker-compose exec postgres pg_isready
   ```

3. **前端构建失败**
   ```bash
   # 清理缓存
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **微服务启动失败**
   ```bash
   # 检查依赖
   docker-compose exec ingestion_service pip list
   ```

### 获取帮助

- 📖 查看完整文档: `docs/`
- 🐛 报告问题: GitHub Issues
- 💬 社区讨论: GitHub Discussions

## 📚 下一步

1. 阅读 [README.md](README.md) 了解项目详情
2. 查看 [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md) 配置认证
3. 探索 `docs/` 目录获取详细文档
4. 贡献代码: 查看 [CONTRIBUTING.md](CONTRIBUTING.md)

---

🎉 **恭喜！** 你已经成功启动了 Read2Rich 项目！

现在你可以：
- 访问前端应用开始探索
- 查看 API 文档了解后端功能
- 开始开发新功能
- 配置 OAuth 登录

如有问题，请查看故障排除部分或提交 Issue。
