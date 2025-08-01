# 服务器更新部署指南

## 🚀 快速更新部署

### 1. 在服务器上执行更新

```bash
# 进入项目目录
cd /path/to/deepneed

# 运行更新部署脚本
./update-deploy.sh your-domain.com
```

### 2. 脚本会自动执行以下操作：

- ✅ 检查现有服务和配置
- ✅ 备份现有配置（nginx、环境变量）
- ✅ 拉取最新代码
- ✅ 重新构建Docker镜像
- ✅ 停止并重启服务
- ✅ 更新nginx配置（保持SSL证书）
- ✅ 执行健康检查
- ✅ 清理Docker缓存

## 📋 更新前准备

### 1. 确认服务器环境
```bash
# 检查Docker
docker --version
docker-compose --version

# 检查nginx
nginx -v

# 检查SSL证书
ls -la /etc/letsencrypt/live/your-domain.com/
```

### 2. 确认项目目录
```bash
# 确认在正确的项目目录
pwd
ls -la

# 确认.env文件存在
cat .env | grep DEEPSEEK_API_KEY
```

## 🔧 手动更新步骤（如果脚本失败）

### 1. 备份配置
```bash
# 备份nginx配置
sudo cp /etc/nginx/conf.d/your-domain.com.conf /etc/nginx/conf.d/your-domain.com.conf.backup.$(date +%Y%m%d_%H%M%S)

# 备份环境变量
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```

### 2. 拉取最新代码
```bash
git pull origin main
```

### 3. 重新构建和部署
```bash
# 停止现有服务
docker-compose -f docker-compose.production.yml down

# 重新构建镜像
docker-compose -f docker-compose.production.yml build --no-cache

# 启动服务
docker-compose -f docker-compose.production.yml up -d
```

### 4. 检查服务状态
```bash
# 查看容器状态
docker-compose -f docker-compose.production.yml ps

# 查看日志
docker-compose -f docker-compose.production.yml logs -f
```

## 🔍 故障排除

### 1. 容器启动失败
```bash
# 查看详细错误日志
docker-compose -f docker-compose.production.yml logs frontend
docker-compose -f docker-compose.production.yml logs backend

# 检查端口占用
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8000
```

### 2. nginx配置错误
```bash
# 测试nginx配置
sudo nginx -t

# 查看nginx错误日志
sudo tail -f /var/log/nginx/your-domain.com.error.log

# 恢复备份配置
sudo cp /etc/nginx/conf.d/your-domain.com.conf.backup.* /etc/nginx/conf.d/your-domain.com.conf
sudo systemctl reload nginx
```

### 3. SSL证书问题
```bash
# 检查证书状态
sudo certbot certificates

# 续期证书
sudo certbot renew

# 重新配置nginx
sudo certbot --nginx -d your-domain.com
```

### 4. 环境变量问题
```bash
# 检查.env文件
cat .env

# 恢复备份
cp .env.backup.* .env

# 重新启动服务
docker-compose -f docker-compose.production.yml restart
```

## 📊 健康检查

### 1. 服务检查
```bash
# 检查前端服务
curl -f http://localhost:3000

# 检查后端服务
curl -f http://localhost:8000/health

# 检查域名访问
curl -f https://your-domain.com
```

### 2. 容器检查
```bash
# 查看容器资源使用
docker stats

# 查看容器进程
docker-compose -f docker-compose.production.yml exec frontend ps aux
docker-compose -f docker-compose.production.yml exec backend ps aux
```

## 🔄 回滚操作

### 1. 快速回滚
```bash
# 停止新服务
docker-compose -f docker-compose.production.yml down

# 恢复备份配置
sudo cp /etc/nginx/conf.d/your-domain.com.conf.backup.* /etc/nginx/conf.d/your-domain.com.conf
cp .env.backup.* .env

# 重新启动旧版本
git checkout HEAD~1
docker-compose -f docker-compose.production.yml up -d
```

### 2. 完全回滚
```bash
# 停止所有服务
docker-compose -f docker-compose.production.yml down

# 删除新镜像
docker rmi $(docker images | grep deepneed | awk '{print $3}')

# 恢复所有备份
sudo cp /etc/nginx/conf.d/your-domain.com.conf.backup.* /etc/nginx/conf.d/your-domain.com.conf
cp .env.backup.* .env

# 重新部署旧版本
git reset --hard HEAD~1
docker-compose -f docker-compose.production.yml up -d
```

## 📝 更新日志

### 更新检查清单
- [ ] 备份现有配置
- [ ] 拉取最新代码
- [ ] 重新构建镜像
- [ ] 重启服务
- [ ] 更新nginx配置
- [ ] 执行健康检查
- [ ] 验证功能正常
- [ ] 清理临时文件

### 更新后验证
- [ ] 前端页面正常访问
- [ ] 后端API正常响应
- [ ] 数据库连接正常
- [ ] SSL证书有效
- [ ] 日志无错误信息
- [ ] 性能指标正常

## 🆘 紧急联系

如果遇到无法解决的问题：

1. 立即回滚到上一个版本
2. 检查服务器资源使用情况
3. 查看所有相关日志
4. 联系技术支持

## 📞 技术支持

- 查看项目文档
- 检查GitHub Issues
- 联系开发团队 