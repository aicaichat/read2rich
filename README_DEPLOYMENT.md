# DeepNeed 部署脚本说明

## 📋 概述

本项目提供了多个部署脚本，满足不同场景的部署需求。所有脚本都经过优化，确保部署过程简单、可靠。

## 🚀 部署脚本对比

| 脚本名称 | 用途 | 特点 | 适用场景 |
|---------|------|------|----------|
| `deploy.sh` | 完整部署脚本 | 功能全面，支持多种模式 | 生产环境，需要完整功能 |
| `quick-deploy.sh` | 快速部署脚本 | 简化流程，快速部署 | 生产环境，快速部署 |
| `deploy-with-existing-nginx.sh` | 现有Nginx部署 | 兼容现有Nginx配置 | 已有Nginx的服务器 |

## 🎯 推荐使用

### 新服务器部署
```bash
# 推荐使用快速部署脚本
./quick-deploy.sh your-domain.com
```

### 已有Nginx服务器
```bash
# 使用兼容脚本
./deploy-with-existing-nginx.sh your-domain.com
```

### 需要完整功能
```bash
# 使用完整部署脚本
./deploy.sh your-domain.com
```

## 📦 脚本功能对比

### deploy.sh (完整版)
- ✅ 系统要求检查
- ✅ 环境变量配置
- ✅ Docker服务部署
- ✅ Nginx配置
- ✅ SSL证书支持
- ✅ 系统服务创建
- ✅ 健康检查
- ✅ 详细日志输出
- ✅ 错误处理
- ✅ 清理功能

### quick-deploy.sh (快速版)
- ✅ 基础检查
- ✅ 环境变量配置
- ✅ Docker服务部署
- ✅ Nginx配置
- ✅ 系统服务创建
- ✅ 健康检查
- ⚠️ 简化错误处理
- ⚠️ 无SSL自动配置

### deploy-with-existing-nginx.sh (兼容版)
- ✅ 现有Nginx兼容
- ✅ SSL证书检测
- ✅ 配置备份
- ✅ 多种部署模式
- ⚠️ 较复杂配置

## 🔧 使用步骤

### 1. 准备环境
```bash
# 克隆项目
git clone https://github.com/aicaichat/deepneed.git
cd deepneed

# 给脚本添加执行权限
chmod +x deploy.sh quick-deploy.sh deploy-with-existing-nginx.sh
```

### 2. 配置环境变量
```bash
# 复制环境变量模板
cp env.example .env

# 编辑配置文件
nano .env
```

### 3. 运行部署脚本
```bash
# 快速部署 (推荐)
./quick-deploy.sh your-domain.com

# 或完整部署
./deploy.sh your-domain.com
```

## 📊 部署结果

部署成功后，您将获得：

### 服务信息
- **前端服务**: http://localhost:3000
- **后端服务**: http://localhost:8000
- **域名访问**: http://your-domain.com
- **项目目录**: /opt/deepneed (完整版) 或当前目录 (快速版)

### 管理命令
```bash
# 查看服务状态
sudo systemctl status deepneed

# 重启服务
sudo systemctl restart deepneed

# 查看日志
sudo journalctl -u deepneed -f

# 查看容器状态
docker-compose -f docker-compose.production.yml ps
```

## 🔍 故障排除

### 常见问题

#### 1. 权限问题
```bash
# 修复Docker权限
sudo usermod -aG docker $USER
newgrp docker

# 修复文件权限
sudo chown -R $USER:$USER /opt/deepneed
```

#### 2. 端口冲突
```bash
# 检查端口占用
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8000

# 修改端口 (编辑 docker-compose.production.yml)
```

#### 3. Nginx配置错误
```bash
# 测试Nginx配置
sudo nginx -t

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/error.log
```

### 重置部署
```bash
# 完全重置
sudo systemctl stop deepneed
docker-compose -f docker-compose.production.yml down -v
sudo rm -rf /opt/deepneed
sudo rm /etc/systemd/system/deepneed.service
sudo systemctl daemon-reload

# 重新部署
./quick-deploy.sh your-domain.com
```

## 📝 脚本选择建议

### 选择 quick-deploy.sh 如果：
- 需要快速部署
- 服务器环境简单
- 不需要复杂的配置选项
- 首次部署

### 选择 deploy.sh 如果：
- 需要完整的部署功能
- 需要详细的错误处理
- 需要SSL自动配置
- 生产环境部署

### 选择 deploy-with-existing-nginx.sh 如果：
- 服务器已有Nginx配置
- 需要保持现有配置
- 需要SSL证书兼容
- 复杂环境部署

## 🔄 更新部署

### 代码更新
```bash
# 拉取最新代码
git pull origin main

# 重新部署
./quick-deploy.sh your-domain.com
```

### 配置更新
```bash
# 编辑配置文件
nano .env

# 重启服务
sudo systemctl restart deepneed
```

## 📞 技术支持

如果遇到问题：

1. 查看脚本输出和错误信息
2. 检查系统日志
3. 验证配置文件
4. 参考故障排除部分
5. 联系技术支持

## 📝 更新日志

### v2.0.0 (2024-01-XX)
- 新增 `quick-deploy.sh` 快速部署脚本
- 优化 `deploy.sh` 完整部署脚本
- 改进错误处理和日志输出
- 简化配置流程
- 增强兼容性

### v1.0.0 (2024-01-XX)
- 初始版本
- 基础部署功能
- Nginx配置支持
- SSL证书支持 