# 🌐 CORS问题解决方案
## 前端调用AI API的代理服务器方案

---

## 🔍 **问题描述**

```
Access to fetch at 'https://api.anthropic.com/v1/messages' from origin 'http://localhost:5176' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**根本原因**: 浏览器的同源策略（CORS）阻止前端直接调用第三方API（Claude、DeepSeek等）

---

## ✅ **解决方案**

### **创建本地代理服务器**
通过在本地8000端口运行代理服务器，前端调用本地API，由代理服务器转发到真实的AI API。

#### **架构图**
```
前端 (localhost:5176) 
    ↓ 调用本地API
代理服务器 (localhost:8000)
    ↓ 转发请求
Claude/DeepSeek API
    ↓ 返回响应
代理服务器
    ↓ 添加CORS头
前端 (收到响应)
```

---

## 🔧 **技术实现**

### **1. 代理服务器 (`simple_proxy_server.py`)**

#### **核心功能**
- **CORS处理**: 自动添加必要的CORS头
- **API路由**: 支持Claude和DeepSeek两个API端点
- **错误处理**: 完善的错误处理和日志记录
- **依赖管理**: 自动安装requests库，回退到内置urllib

#### **支持的端点**
```
POST http://localhost:8000/claude     - Claude API代理
POST http://localhost:8000/deepseek   - DeepSeek API代理
```

#### **关键代码**
```python
def do_OPTIONS(self):
    """处理预检请求"""
    self.send_response(200)
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')
    self.end_headers()
```

### **2. 前端API调用修改**

#### **修改前 (直接调用)**
```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  headers: {
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01'
  }
});
```

#### **修改后 (通过代理)**
```typescript
const response = await fetch('http://localhost:8000/claude', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestData)
});
```

---

## 🚀 **使用方式**

### **方法1: 使用启动脚本（推荐）**
```bash
./start_dev_servers.sh
```

### **方法2: 手动启动**
```bash
# 终端1: 启动代理服务器
python3 simple_proxy_server.py

# 终端2: 启动前端开发服务器
cd apps/web && npm run dev
```

### **方法3: 分步启动**
```bash
# 1. 启动代理服务器
python3 simple_proxy_server.py &

# 2. 启动前端
cd apps/web
npm run dev
```

---

## 🧪 **测试验证**

### **1. 检查代理服务器状态**
```bash
curl http://localhost:8000/health
# 应该返回: {"status":"ok","deepseek_key":"sk-dc146c694369404a..."}
```

### **2. 测试Claude API代理**
```bash
curl -X POST http://localhost:8000/claude \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-haiku-20240307",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### **3. 测试DeepSeek API代理**
```bash
curl -X POST http://localhost:8000/deepseek \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 100
  }'
```

### **4. 前端测试**
访问 `http://localhost:5176/test-ai` 点击测试按钮

---

## 📊 **运行状态监控**

### **代理服务器日志**
```
🚀 启动代理服务器...
📡 服务地址: http://localhost:8000
🔗 支持的API端点:
   - POST /claude - Claude API代理
   - POST /deepseek - DeepSeek API代理

✅ 代理服务器启动成功，端口: 8000
💡 在前端可以通过以下方式调用:
   - Claude: http://localhost:8000/claude
   - DeepSeek: http://localhost:8000/deepseek

📥 收到请求: /claude
🤖 代理Claude API请求...
✅ API调用成功 (状态码: 200)
```

### **前端控制台日志**
```
🤖 调用Claude API (通过代理服务器)...
📝 输入消息数量: 2
📤 发送数据: {model: "claude-3-haiku-20240307", ...}
✅ Claude API 响应: {content: [{text: "..."}]}
📄 AI回复内容: 您好！我是Claude，一个AI助手...
```

---

## 🔒 **安全注意事项**

### **API密钥管理**
- Claude API Key: 硬编码在代理服务器中
- DeepSeek API Key: 硬编码在代理服务器中
- **生产环境**: 应使用环境变量管理API密钥

### **CORS配置**
- 当前设置: `Access-Control-Allow-Origin: *` (允许所有来源)
- **生产环境**: 应限制为特定域名

### **推荐的生产配置**
```python
# 环境变量方式
import os
CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')

# 限制CORS来源
allowed_origins = ['https://yourapp.com', 'http://localhost:3000']
```

---

## 🛠️ **故障排除**

### **常见问题**

#### **1. 端口占用**
```
❌ 端口 8000 已被占用
💡 请停止其他服务或使用不同端口
```
**解决方案**: 
```bash
lsof -ti:8000 | xargs kill  # 停止占用端口的进程
```

#### **2. Python依赖问题**
```
❌ 无法安装 requests，使用内置库
```
**解决方案**: 代理服务器会自动回退到内置urllib库，无需处理

#### **3. API调用失败**
```
❌ API调用失败 (HTTP 401): {"error": {"message": "Invalid API key"}}
```
**解决方案**: 检查API密钥是否有效

#### **4. 前端连接失败**
```
TypeError: Failed to fetch
```
**解决方案**: 确认代理服务器是否运行在8000端口

---

## 📈 **性能优化**

### **当前配置**
- **超时时间**: 30秒
- **最大Token**: 1500
- **Temperature**: 0.5

### **优化建议**
1. **连接池**: 使用requests.Session()进行连接复用
2. **缓存**: 对相同请求进行缓存
3. **负载均衡**: 多个代理服务器实例
4. **监控**: 添加性能监控和日志分析

---

## 🎉 **解决成果**

### **✅ 问题解决**
- CORS错误完全消除
- 前端可以正常调用Claude和DeepSeek API
- 完整的错误处理和日志记录

### **🚀 开发体验提升**
- 一键启动脚本 (`./start_dev_servers.sh`)
- 详细的调试日志
- 自动依赖管理
- 完善的错误提示

### **🔧 技术架构优化**
- 分离前端和API调用逻辑
- 统一的API代理层
- 易于扩展新的AI服务商

**🎯 现在前端可以正常调用AI API，完整文档生成功能可以正常工作！** 