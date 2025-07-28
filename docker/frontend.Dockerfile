# DeepNeed AI 前端应用 Dockerfile
# 多阶段构建：开发和生产环境

# =====================================================
# 开发阶段 (Development Stage)
# =====================================================
FROM node:18-alpine AS development

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# 安装系统依赖
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

# 复制package文件
COPY apps/web/package*.json ./

# 尝试复制pnpm-lock.yaml，如果不存在则跳过
COPY apps/web/pnpm-lock.yaml* ./

# 全局安装pnpm
RUN npm install -g pnpm

# 安装依赖（如果有pnpm-lock.yaml使用它，否则使用npm）
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm install; \
    else \
        npm install; \
    fi

# 复制源代码
COPY apps/web/ ./

# 暴露端口
EXPOSE 5173

# 开发环境启动命令
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# =====================================================
# 构建阶段 (Build Stage)
# =====================================================
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

# 安装系统依赖
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

# 复制package文件
COPY apps/web/package*.json ./

# 尝试复制pnpm-lock.yaml，如果不存在则跳过
COPY apps/web/pnpm-lock.yaml* ./

# 全局安装pnpm
RUN npm install -g pnpm

# 安装依赖（如果有pnpm-lock.yaml使用它，否则使用npm）
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm install --frozen-lockfile --prod=false; \
    else \
        npm install; \
    fi

# 复制源代码
COPY apps/web/ ./

# 构建应用
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm build; \
    else \
        npm run build; \
    fi

# =====================================================
# 生产阶段 (Production Stage)
# =====================================================
FROM nginx:alpine AS production

# 安装必要工具
RUN apk add --no-cache curl

# 复制自定义nginx配置
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 创建nginx用户
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S nginx-app -u 1001

# 设置权限
RUN chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    chown -R nginx-app:nginx-app /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-app:nginx-app /var/run/nginx.pid

# 切换到非root用户
USER nginx-app

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 