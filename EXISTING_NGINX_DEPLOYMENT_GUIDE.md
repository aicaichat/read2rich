# DeepNeed 现有nginx配置部署指南

## 🎯 部署目标

在现有的 `deepneed.com.cn` 网站基础上，添加新的API服务支持，实现：
- 保持现有网站功能不变
- 添加 `/api/` 路径的API代理
- 支持新的React前端和FastAPI后端

## 📋 现有配置分析

### 当前nginx配置
- **域名**: `deepneed.com.cn` 和 `www.deepneed.com.cn`
- **SSL**: 已配置Let's Encrypt证书
- **静态文件**: `/var/www/deepneed.com.cn`
- **PPT功能**: `/ppt/` 路径
- **HTTPS重定向**: 已配置

### 新增功能
- **API代理**: `/api/` → `localhost:8000`
- **前端服务**: React应用 (端口3000)
- **后端服务**: FastAPI应用 (端口8000)

## 🚀 部署步骤

### 1. 准备环境变量
```bash
# 复制环境变量示例文件
cp env.example .env

# 编辑配置文件
nano .env

# 必需配置
DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here
DOMAIN=deepneed.com.cn
FRONTEND_URL=https://deepneed.com.cn
BACKEND_URL=https://deepneed.com.cn/api
```

### 2. 运行部署脚本
```bash
# 快速部署（自动检测现有配置）
./quick-deploy-nginx.sh deepneed.com.cn

# 或详细部署（交互式）
./deploy-with-existing-nginx.sh deepneed.com.cn
```

### 3. 验证部署
```bash
# 检查服务状态
docker-compose -f docker-compose.production.yml ps

# 检查nginx配置
nginx -t

# 测试API
curl https://deepneed.com.cn/api/health
```

## 🔧 配置变更说明

### nginx配置更新
部署脚本会自动：
1. **备份原配置**: `deepneed.com.cn.conf.backup.YYYYMMDD_HHMMSS`
2. **添加API代理**: 新增 `/api/` 路径代理到后端服务
3. **保持现有功能**: 所有现有配置保持不变

### 新增的API代理配置
```nginx
# API代理 - 新增
location /api/ {
    proxy_pass http://localhost:8000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## 📊 服务架构

### 部署前
```
用户 → nginx → /var/www/deepneed.com.cn (静态文件)
```

### 部署后
```
用户 → nginx → /var/www/deepneed.com.cn (静态文件)
                ↓
              /api/ → localhost:8000 (FastAPI后端)
```

## 🔒 安全考虑

### SSL证书
- 现有Let's Encrypt证书继续有效
- API请求也通过HTTPS加密

### 防火墙
```bash
# 确保端口开放
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=8000/tcp
firewall-cmd --reload
```

### 文件权限
```bash
# 设置环境变量文件权限
chmod 600 .env
chown root:root .env
```

## 🐛 故障排除

### 1. nginx配置错误
```bash
# 检查配置语法
nginx -t

# 查看错误日志
tail -f /var/log/nginx/deepneed.com.cn.error.log

# 恢复备份配置
cp /etc/nginx/conf.d/deepneed.com.cn.conf.backup.* /etc/nginx/conf.d/deepneed.com.cn.conf
systemctl reload nginx
```

### 2. Docker服务问题
```bash
# 查看容器状态
docker-compose -f docker-compose.production.yml ps

# 查看容器日志
docker-compose -f docker-compose.production.yml logs frontend
docker-compose -f docker-compose.production.yml logs backend

# 重启服务
docker-compose -f docker-compose.production.yml restart
```

### 3. API连接问题
```bash
# 测试本地API
curl http://localhost:8000/health

# 测试通过nginx的API
curl https://deepneed.com.cn/api/health

# 检查端口监听
netstat -tlnp | grep :8000
```

## 📝 回滚方案

### 快速回滚
```bash
# 停止Docker服务
docker-compose -f docker-compose.production.yml down

# 恢复nginx配置
cp /etc/nginx/conf.d/deepneed.com.cn.conf.backup.* /etc/nginx/conf.d/deepneed.com.cn.conf

# 重载nginx
systemctl reload nginx
```

### 完全回滚
```bash
# 停止所有服务
docker-compose -f docker-compose.production.yml down

# 删除容器和镜像
docker-compose -f docker-compose.production.yml down --rmi all

# 恢复nginx配置
cp /etc/nginx/conf.d/deepneed.com.cn.conf.backup.* /etc/nginx/conf.d/deepneed.com.cn.conf

# 重载nginx
systemctl reload nginx
```

## 🎉 部署完成

部署成功后，您将拥有：

1. **现有网站**: `https://deepneed.com.cn` (保持不变)
2. **PPT功能**: `https://deepneed.com.cn/ppt/` (保持不变)
3. **API服务**: `https://deepneed.com.cn/api/` (新增)
4. **前端应用**: React应用 (新增)

### 访问地址
- **主站**: https://deepneed.com.cn
- **API文档**: https://deepneed.com.cn/api/docs
- **健康检查**: https://deepneed.com.cn/api/health

---

## 📞 支持

如果遇到问题：
1. 检查nginx错误日志
2. 检查Docker容器日志
3. 验证环境变量配置
4. 确认API key有效性
5. 检查防火墙设置

部署完成后，您的DeepNeed项目将同时支持现有网站功能和新的API服务！ 