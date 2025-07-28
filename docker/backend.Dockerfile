# DeepNeed AI 后端应用 Dockerfile
# 多阶段构建：开发和生产环境

# =====================================================
# 基础阶段 (Base Stage)
# =====================================================
FROM python:3.11-slim AS base

# 设置环境变量
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 创建应用用户
RUN groupadd -r appuser && useradd -r -g appuser appuser

# 设置工作目录
WORKDIR /app

# =====================================================
# 开发阶段 (Development Stage)
# =====================================================
FROM base AS development

# 安装开发工具
RUN apt-get update && apt-get install -y \
    git \
    vim \
    htop \
    && rm -rf /var/lib/apt/lists/*

# 复制requirements文件
COPY backend/requirements.txt ./

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements.txt

# 安装开发依赖
RUN pip install --no-cache-dir \
    pytest \
    pytest-asyncio \
    black \
    isort \
    flake8

# 复制应用代码
COPY backend/ ./

# 设置权限
RUN chown -R appuser:appuser /app

# 切换到应用用户
USER appuser

# 暴露端口
EXPOSE 8000

# 开发环境启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# =====================================================
# 生产构建阶段 (Production Build Stage)
# =====================================================
FROM base AS builder

# 复制requirements文件
COPY backend/requirements.txt ./

# 安装Python依赖到临时目录
RUN pip install --no-cache-dir --user -r requirements.txt

# =====================================================
# 生产阶段 (Production Stage)
# =====================================================
FROM base AS production

# 复制Python依赖
COPY --from=builder /root/.local /home/appuser/.local

# 更新PATH
ENV PATH=/home/appuser/.local/bin:$PATH

# 复制应用代码
COPY backend/ ./

# 创建必要目录
RUN mkdir -p /app/data /app/logs

# 设置权限
RUN chown -R appuser:appuser /app

# 切换到应用用户
USER appuser

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 生产环境启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"] 