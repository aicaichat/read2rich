# 认证功能测试指南

## 功能概述

已完成 DeepNeed 网站的注册和登录功能，包括：

### 后端功能
- ✅ 用户注册 (`POST /api/v1/auth/register`)
- ✅ 用户登录 (`POST /api/v1/auth/login`)
- ✅ 获取当前用户 (`GET /api/v1/auth/me`)
- ✅ 用户登出 (`POST /api/v1/auth/logout`)
- ✅ JWT 令牌认证
- ✅ 密码加密存储
- ✅ 邮箱和用户名唯一性验证

### 前端功能
- ✅ 注册页面 (`/register`)
- ✅ 登录页面 (`/login`)
- ✅ 认证状态管理
- ✅ 令牌自动存储和清除
- ✅ 错误处理和用户反馈

## 测试步骤

### 1. 启动服务

```bash
# 启动后端服务
cd apps/api
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 启动前端服务
cd apps/web
pnpm dev
```

### 2. 测试注册功能

1. 访问 `http://localhost:5173/register`
2. 填写注册信息：
   - 邮箱：`test@example.com`
   - 用户名：`testuser`
   - 密码：`password123`
   - 姓名：`Test User`
3. 点击"创建账户"
4. 验证是否成功跳转到仪表板

### 3. 测试登录功能

1. 访问 `http://localhost:5173/login`
2. 填写登录信息：
   - 用户名：`testuser`
   - 密码：`password123`
3. 点击"登录"
4. 验证是否成功跳转到仪表板

### 4. 测试认证状态

1. 登录后，刷新页面
2. 验证是否保持登录状态
3. 检查浏览器开发者工具中的 localStorage
4. 应该看到 `access_token` 和 `refresh_token`

### 5. 测试登出功能

1. 在应用中点击登出按钮
2. 验证是否跳转到登录页面
3. 检查 localStorage 中的令牌是否被清除

## API 端点测试

### 注册用户
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### 用户登录
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123"
```

### 获取当前用户
```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 用户登出
```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 错误处理测试

### 1. 重复注册测试
- 尝试使用相同的邮箱或用户名注册
- 应该返回 400 错误

### 2. 错误密码测试
- 使用错误的密码登录
- 应该返回 401 错误

### 3. 无效令牌测试
- 使用无效的令牌访问受保护的端点
- 应该返回 401 错误

## 安全特性

- ✅ 密码使用 bcrypt 加密存储
- ✅ JWT 令牌有过期时间
- ✅ 用户名和邮箱唯一性验证
- ✅ 输入验证和清理
- ✅ 错误信息不泄露敏感信息

## 部署测试

在服务器上测试：

1. 确保后端服务正常运行
2. 确保前端服务正常运行
3. 通过域名访问注册和登录页面
4. 测试完整的注册-登录-登出流程

## 常见问题

### 1. 登录失败
- 检查后端服务是否正常运行
- 检查数据库连接
- 检查 JWT 配置

### 2. 注册失败
- 检查邮箱和用户名是否已存在
- 检查密码长度是否符合要求
- 检查数据库连接

### 3. 令牌过期
- 检查 JWT_EXPIRE_HOURS 配置
- 实现令牌刷新机制

## 下一步改进

1. 添加邮箱验证功能
2. 实现密码重置功能
3. 添加社交登录（GitHub、Google）
4. 实现记住登录状态
5. 添加双因素认证
6. 实现用户角色和权限管理
