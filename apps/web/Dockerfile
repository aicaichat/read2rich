FROM node:18-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制包管理文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖（服务器可能存在锁文件滞后，放宽限制以避免构建失败）
RUN pnpm install --no-frozen-lockfile

# 复制源码
COPY . .

# 构建应用（静态报告已在仓库中，无需在服务器再生成）
RUN pnpm build

# 生产环境
FROM nginx:alpine

# 复制构建产物到nginx目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 3000

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 