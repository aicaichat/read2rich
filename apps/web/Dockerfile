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

# 先生成静态报告与BP，再构建应用
RUN pnpm run gen:reports && pnpm build

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