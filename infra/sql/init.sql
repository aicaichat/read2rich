-- 创建 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建数据库 (如果不存在)
SELECT 'CREATE DATABASE deepneed'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'deepneed');

-- 切换到 deepneed 数据库
\c deepneed;

-- 创建 pgvector 扩展 (在目标数据库中)
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建会话表
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    initial_idea TEXT NOT NULL,
    current_requirements JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建消息表
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES sessions(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建生成的提示词表
CREATE TABLE IF NOT EXISTS generated_prompts (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES sessions(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    code_prompt TEXT NOT NULL,
    pm_prompt TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建代码生成表
CREATE TABLE IF NOT EXISTS code_generations (
    id SERIAL PRIMARY KEY,
    prompt_id INTEGER REFERENCES generated_prompts(id) ON DELETE CASCADE,
    generated_code TEXT NOT NULL,
    file_structure JSONB DEFAULT '{}',
    pm_plan TEXT,
    model_used VARCHAR(100) DEFAULT 'claude-3-sonnet',
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建提示词模板表
CREATE TABLE IF NOT EXISTS prompt_templates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    role VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags JSONB DEFAULT '[]',
    language VARCHAR(10) DEFAULT 'zh',
    source_repo VARCHAR(255),
    embedding vector(1536),
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_generated_prompts_session_id ON generated_prompts(session_id);
CREATE INDEX IF NOT EXISTS idx_code_generations_prompt_id ON code_generations(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_title ON prompt_templates(title);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_tags ON prompt_templates USING GIN(tags);

-- 创建向量相似度搜索索引
CREATE INDEX IF NOT EXISTS idx_prompt_templates_embedding 
ON prompt_templates USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- 插入示例数据
INSERT INTO users (email, username, hashed_password, full_name, is_superuser) 
VALUES (
    'admin@deepneed.com.cn',
    'admin',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewkqSJlCFjRzWKkK', -- password: admin123
    'DeepNeed 管理员',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- 插入示例提示词模板
INSERT INTO prompt_templates (title, description, role, content, tags, language) VALUES
(
    '前端 React 项目生成',
    '用于生成现代化 React + TypeScript 项目的提示词模板',
    'Frontend Developer',
    '请根据以下需求生成一个完整的 React + TypeScript 项目：

技术栈要求：
- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS 样式
- React Router 路由
- React Query 状态管理

项目结构：
- 现代化的组件架构
- 响应式设计
- 代码分割和懒加载
- 完整的类型定义

请生成：
1. 完整的项目目录结构
2. 主要组件代码
3. 路由配置
4. 样式配置
5. 构建配置
6. README 文档

需求详情：{requirements}',
    '["react", "typescript", "frontend", "vite", "tailwind"]',
    'zh'
),
(
    '后端 FastAPI 项目生成',
    '用于生成 FastAPI + PostgreSQL 后端项目的提示词模板',
    'Backend Developer',
    '请根据以下需求生成一个完整的 FastAPI + PostgreSQL 项目：

技术栈要求：
- FastAPI + Python 3.11
- PostgreSQL 数据库
- SQLAlchemy ORM
- Pydantic 数据验证
- JWT 认证
- Redis 缓存

项目结构：
- 模块化的目录结构
- RESTful API 设计
- 数据库迁移脚本
- 单元测试
- API 文档

请生成：
1. 完整的项目目录结构
2. 数据库模型定义
3. API 路由和控制器
4. 认证和权限系统
5. 数据库迁移脚本
6. 单元测试用例
7. Docker 配置
8. README 文档

需求详情：{requirements}',
    '["fastapi", "python", "backend", "postgresql", "api"]',
    'zh'
),
(
    '项目管理计划生成',
    '用于生成详细的项目管理计划和里程碑的提示词模板',
    'Project Manager',
    '请根据以下项目需求生成详细的项目管理计划：

项目信息：{requirements}

请生成包含以下内容的完整项目管理计划：

1. 项目概述
   - 项目目标和范围
   - 主要交付物
   - 成功标准

2. 项目计划
   - 详细的 WBS（工作分解结构）
   - 时间线和里程碑
   - 关键路径分析

3. 资源规划
   - 人员配置需求
   - 技能要求
   - 预算估算

4. 风险管理
   - 潜在风险识别
   - 风险应对策略
   - 应急计划

5. 质量管理
   - 质量标准
   - 测试策略
   - 代码审查流程

6. 沟通计划
   - 沟通矩阵
   - 会议安排
   - 报告制度

请使用表格、图表等形式使计划更加清晰可读。',
    '["project-management", "planning", "milestone", "agile"]',
    'zh'
)
ON CONFLICT (title) DO NOTHING;

-- 更新统计信息
ANALYZE; 