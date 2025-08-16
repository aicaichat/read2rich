# Read2Rich.com - AI-Powered Business Opportunity Discovery

## 🌟 项目概述

Read2Rich.com 是一个基于 AI 的多语言商业机会发现平台，支持英语、韩语和日语。平台通过智能数据分析和机器学习，帮助用户发现和评估商业机会。

## 🚀 核心功能

- **多语言支持**: 英语、韩语、日语
- **AI 机会发现**: 智能分析和推荐
- **实时数据抓取**: 多源数据整合
- **个性化推荐**: 基于用户偏好的智能推荐
- **商业报告生成**: 自动生成详细分析报告

## 🏗️ 技术架构

### 前端
- React 18 + TypeScript
- Next.js 14 (SSR/SSG)
- Tailwind CSS + Framer Motion
- i18next (国际化)

### 后端
- FastAPI + Python 3.11+
- SQLAlchemy + Alembic
- PostgreSQL + Qdrant
- Redis + Kafka

### 微服务
- 数据摄入服务
- 数据处理服务
- 向量化服务
- 评分服务
- API 网关

## 📁 项目结构

```
read2rich/
├── frontend/                 # React 前端应用
├── backend/                  # FastAPI 后端服务
├── microservices/           # 微服务集群
├── docker/                  # Docker 配置文件
├── scripts/                 # 部署和运维脚本
└── docs/                    # 项目文档
```

## 🚀 快速开始

### 环境要求
- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+

### 本地开发
```bash
# 克隆项目
git clone <repository-url>
cd read2rich

# 启动所有服务
docker-compose up -d

# 前端开发
cd frontend
npm install
npm run dev

# 后端开发
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 生产部署
```bash
# 构建和部署
./scripts/deploy.sh

# 查看服务状态
docker-compose ps
```

## 🌍 多语言支持

- **英语 (en)**: 默认语言，完整功能支持
- **韩语 (ko)**: 韩语用户界面和内容
- **日语 (ja)**: 日语用户界面和内容

## 📊 API 文档

启动后端服务后，访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 联系我们

- 网站: https://read2rich.com
- 邮箱: contact@read2rich.com
- GitHub: [项目地址] 