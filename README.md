# DeepNeed - AI 驱动的需求分析与代码生成平台

![GitHub Stars](https://img.shields.io/github/stars/aicaichat/deepneed?style=social)
![GitHub Forks](https://img.shields.io/github/forks/aicaichat/deepneed?style=social)
![License](https://img.shields.io/github/license/aicaichat/deepneed)
![CI Status](https://github.com/aicaichat/deepneed/workflows/CI/badge.svg)

> 🚀 通过多轮 AI 对话将模糊想法转化为清晰技术需求，自动生成高质量代码和项目管理方案

## ✨ 核心特性

- 🤖 **智能需求澄清**: 多轮 AI 对话，逐步细化模糊需求
- 📝 **专业提示词生成**: 自动生成代码提示词和项目管理提示词  
- 💻 **AI 代码生成**: 集成 Claude/GPT，生成完整项目代码
- 📊 **项目管理**: 自动生成开发计划、里程碑和任务分解
- 🎯 **提示词资源库**: 整合 GitHub 优质提示词模板
- 🔍 **语义搜索**: 基于向量数据库的智能提示词检索

## 🏗️ 技术架构

### 前端技术栈
- **框架**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS + Framer Motion
- **状态管理**: TanStack Query + Zustand
- **路由**: React Router v6
- **构建**: Vite + SWC

### 后端技术栈  
- **框架**: FastAPI + Python 3.11
- **数据库**: PostgreSQL 14 + pgvector
- **缓存**: Redis 7
- **AI 集成**: DeepSeek + Claude + OpenAI
- **认证**: JWT + OAuth2

### 基础设施
- **容器化**: Docker + Docker Compose
- **编排**: Kubernetes + Helm
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana + Sentry

## 🚀 快速开始

### 前置要求
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 14+ (可选，可用 Docker)

### 1. 克隆项目
```bash
git clone https://github.com/aicaichat/deepneed.git
cd deepneed
```

### 2. 环境配置
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置文件，填入必要的 API Keys
vim .env
```

### 3. 启动服务
```bash
# 方式一：使用 Docker Compose (推荐)
pnpm run docker:dev

# 方式二：本地开发
pnpm install
pnpm dev
```

### 4. 初始化数据
```bash
# 运行数据库迁移
docker-compose exec api python -m app.db.init_db

# 导入提示词模板 (可选)
docker-compose exec api python -m app.scripts.import_prompts
```

### 5. 访问应用
- 🌐 前端应用: http://localhost:5173
- 📚 API 文档: http://localhost:8000/docs
- 🗄️ 数据库: localhost:5432

## 📁 项目结构

```
deepneed/
├── apps/
│   ├── web/              # React 前端应用
│   ├── api/              # FastAPI 后端服务  
│   └── landing/          # 营销站点 (Astro)
├── packages/
│   ├── ui/               # 共享 UI 组件库
│   ├── types/            # TypeScript 类型定义
│   └── config/           # 共享配置
├── infra/                # 基础设施配置
├── docs/                 # 项目文档
└── .github/              # CI/CD 配置
```

## 🛠️ 开发指南

### API 开发
```bash
cd apps/api
poetry install
poetry run uvicorn app.main:app --reload
```

### 前端开发
```bash
cd apps/web
pnpm install
pnpm dev
```

### 运行测试
```bash
# 运行所有测试
pnpm test

# API 测试
cd apps/api && poetry run pytest

# 前端测试  
cd apps/web && pnpm test
```

## 🔑 环境变量配置

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `DATABASE_URL` | PostgreSQL 连接 | `postgresql://user:pass@localhost/db` |
| `REDIS_URL` | Redis 连接 | `redis://localhost:6379` |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | `sk-xxx` |
| `CLAUDE_API_KEY` | Claude API 密钥 | `sk-ant-xxx` |
| `OPENAI_API_KEY` | OpenAI API 密钥 | `sk-xxx` |

详细配置说明请查看 [配置文档](./docs/development/setup.md)

## 📊 API 接口

### 认证相关
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录

### 会话管理
- `POST /api/v1/sessions` - 创建需求澄清会话
- `GET /api/v1/sessions` - 获取用户会话列表
- `POST /api/v1/sessions/{id}/messages` - 发送消息

### 提示词生成
- `POST /api/v1/prompts/{session_id}/generate` - 生成专业提示词
- `GET /api/v1/prompts/{session_id}/prompts` - 获取会话提示词

### 代码生成
- `POST /api/v1/generation/code/{prompt_id}` - 生成项目代码
- `POST /api/v1/generation/plan/{prompt_id}` - 生成项目计划

完整 API 文档: http://localhost:8000/docs

## 🚀 部署指南

### 生产环境部署

1. **构建镜像**
```bash
docker build -t deepneed-api ./apps/api
docker build -t deepneed-web ./apps/web
```

2. **Kubernetes 部署**
```bash
kubectl apply -f infra/k8s/
```

3. **Docker Compose 部署**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

详细部署说明请查看 [部署文档](./docs/deployment/)

## 🧪 测试策略

- **单元测试**: Jest + pytest
- **集成测试**: Supertest + TestClient  
- **E2E 测试**: Playwright
- **API 测试**: Postman + Newman
- **性能测试**: K6 + Artillery

```bash
# 测试覆盖率报告
pnpm test:coverage
```

## 📈 监控和日志

- **应用监控**: Sentry 错误追踪
- **性能监控**: Prometheus + Grafana
- **日志聚合**: ELK Stack
- **健康检查**: /health 端点

## 🤝 贡献指南

我们欢迎所有形式的贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

详细贡献指南请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 开源协议

本项目采用 [MIT 协议](./LICENSE) 开源。

## 🌟 贡献者

感谢所有为项目做出贡献的开发者！

## 📞 联系我们

- 🌐 官网: https://deepneed.com.cn
- 📧 邮箱: contact@deepneed.com.cn
- 💬 社区: [Discord](https://discord.gg/deepneed)
- 🐦 Twitter: [@DeepNeedAI](https://twitter.com/DeepNeedAI)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/aicaichat">DeepNeed Team</a>
</p> 