# OAuth 登录配置指南

## 概述

DeepNeed 现在支持 GitHub 和 Google OAuth 登录，用户可以使用第三方账户快速注册和登录。

## 功能特性

- ✅ GitHub OAuth 登录
- ✅ Google OAuth 登录
- ✅ 自动用户创建和关联
- ✅ JWT 令牌认证
- ✅ 用户头像同步
- ✅ 邮箱唯一性验证

## 配置步骤

### 1. GitHub OAuth 应用配置

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: `DeepNeed`
   - **Homepage URL**: `https://deepneed.com.cn` (生产环境) 或 `http://localhost:5173` (开发环境)
   - **Authorization callback URL**: `https://deepneed.com.cn/api/v1/auth/github/callback` (生产环境) 或 `http://localhost:8000/api/v1/auth/github/callback` (开发环境)
4. 点击 "Register application"
5. 复制 **Client ID** 和 **Client Secret**

### 2. Google OAuth 应用配置

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API：
   - 进入 "APIs & Services" > "Library"
   - 搜索并启用 "Google+ API"
4. 创建 OAuth 2.0 客户端：
   - 进入 "APIs & Services" > "Credentials"
   - 点击 "Create Credentials" > "OAuth 2.0 Client IDs"
   - 选择 "Web application"
   - 添加授权重定向 URI：
     - 生产环境：`https://deepneed.com.cn/api/v1/auth/google/callback`
     - 开发环境：`http://localhost:8000/api/v1/auth/google/callback`
5. 复制 **Client ID** 和 **Client Secret**

### 3. 环境变量配置

在 `.env` 文件中添加以下配置：

```bash
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:8000/api/v1/auth/github/callback

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
```

### 4. 生产环境配置

在生产环境中，更新重定向 URI：

```bash
# 生产环境
GITHUB_REDIRECT_URI=https://deepneed.com.cn/api/v1/auth/github/callback
GOOGLE_REDIRECT_URI=https://deepneed.com.cn/api/v1/auth/google/callback
```

## 使用方法

### 用户登录流程

1. 用户访问登录页面 (`/login`)
2. 点击 "使用 GitHub 登录" 或 "使用 Google 登录"
3. 重定向到相应的 OAuth 提供商
4. 用户授权应用访问其信息
5. 重定向回应用，自动创建或登录用户账户
6. 用户被重定向到仪表板

### 开发者测试

1. 启动后端服务：
   ```bash
   cd apps/api
   source venv/bin/activate
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. 启动前端服务：
   ```bash
   cd apps/web
   pnpm dev
   ```

3. 访问 `http://localhost:5173/login`
4. 测试 OAuth 登录功能

## API 端点

### GitHub OAuth
- `GET /api/v1/auth/github/login` - 重定向到 GitHub 授权页面
- `GET /api/v1/auth/github/callback` - GitHub 授权回调

### Google OAuth
- `GET /api/v1/auth/google/login` - 重定向到 Google 授权页面
- `GET /api/v1/auth/google/callback` - Google 授权回调

## 数据库变更

用户表新增字段：
- `oauth_provider` - OAuth 提供商 (github, google)
- `oauth_id` - OAuth 提供商返回的用户 ID
- `oauth_access_token` - OAuth 访问令牌
- `avatar_url` - 用户头像 URL
- `hashed_password` - 改为可选 (OAuth 用户可能没有密码)

## 安全考虑

1. **令牌安全**：OAuth 访问令牌存储在数据库中，应定期刷新
2. **HTTPS**：生产环境必须使用 HTTPS
3. **状态验证**：OAuth 流程包含状态验证防止 CSRF 攻击
4. **权限范围**：只请求必要的用户信息权限

## 故障排除

### 常见问题

1. **重定向 URI 不匹配**
   - 确保 GitHub/Google 应用配置中的重定向 URI 与代码中的完全一致
   - 检查协议 (http/https)、域名、端口号

2. **Client ID/Secret 错误**
   - 验证环境变量中的 Client ID 和 Secret 是否正确
   - 确保没有多余的空格或换行符

3. **CORS 错误**
   - 确保后端 CORS 配置包含前端域名
   - 检查 OAuth 回调 URL 是否在允许列表中

4. **数据库错误**
   - 确保数据库表结构已更新
   - 检查用户表是否包含新的 OAuth 字段

### 调试步骤

1. 检查后端日志：
   ```bash
   docker compose logs backend
   ```

2. 检查前端控制台错误

3. 验证 OAuth 配置：
   ```bash
   curl http://localhost:8000/api/v1/auth/github/login
   ```

4. 测试回调端点：
   ```bash
   curl "http://localhost:8000/api/v1/auth/github/callback?code=test_code"
   ```

## 下一步改进

1. **令牌刷新**：实现 OAuth 令牌自动刷新机制
2. **账户关联**：允许用户关联多个 OAuth 账户
3. **权限管理**：基于 OAuth 提供商实现不同的用户权限
4. **社交功能**：利用 OAuth 信息实现社交功能
5. **更多提供商**：添加微信、QQ 等国内 OAuth 提供商

## 支持

如果遇到问题，请检查：
1. OAuth 应用配置是否正确
2. 环境变量是否设置
3. 网络连接是否正常
4. 数据库是否正常运行
