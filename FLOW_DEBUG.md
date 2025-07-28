# 🔧 项目想法传递功能调试指南

## 🎯 问题描述
用户点击"开始需求澄清"按钮后，聊天页面没有带入之前输入的项目想法。

## 🔍 调试步骤

### 1. 打开浏览器开发者工具
- 按 F12 或右键选择"检查"
- 切换到 Console 标签页

### 2. 测试完整流程

#### 步骤1: 访问首页
```
访问: http://localhost:5177/
登录: admin / admin123
```

#### 步骤2: 输入项目想法
```
在"立即开始你的创业之旅"输入框中输入:
"我想做一个帮助宠物主人的社交APP"
```

#### 步骤3: 点击按钮并观察控制台
```
点击"免费验证想法"按钮
观察控制台输出:
- "提交表单，quickIdea: 我想做一个帮助宠物主人的社交APP"
- "跳转到/chat，传递initialIdea: 我想做一个帮助宠物主人的社交APP"
```

#### 步骤4: 检查NewSessionPage
```
观察控制台输出:
- "NewSessionPage useEffect，location.state: {initialIdea: '我想做一个帮助宠物主人的社交APP'}"
- "设置初始想法: 我想做一个帮助宠物主人的社交APP"
```

#### 步骤5: 创建会话
```
点击"开始需求澄清"按钮
观察控制台输出:
- "创建会话，数据: {title: '...', initial_idea: '我想做一个帮助宠物主人的社交APP'}"
```

#### 步骤6: 检查ChatPage
```
观察控制台输出:
- "获取会话信息，sessionId: session-..."
- "获取到的会话: {...}"
- "会话的initial_idea: 我想做一个帮助宠物主人的社交APP"
```

## 🚨 常见问题及解决方案

### 问题1: 控制台没有输出
**原因**: 代码没有正确加载
**解决**: 
1. 刷新页面 (Ctrl+F5)
2. 检查是否有JavaScript错误
3. 确认前端服务正常运行

### 问题2: LandingPage没有输出"提交表单"
**原因**: 表单提交事件没有触发
**解决**:
1. 检查输入框是否为空
2. 确认按钮类型是"submit"
3. 检查表单的onSubmit事件

### 问题3: NewSessionPage没有输出"设置初始想法"
**原因**: location.state没有正确传递
**解决**:
1. 检查navigate调用是否包含state
2. 确认路由配置正确
3. 检查浏览器历史记录

### 问题4: ChatPage没有显示initial_idea
**原因**: 会话创建时没有保存initial_idea
**解决**:
1. 检查createSession API调用
2. 确认MockStorage正确保存数据
3. 检查getSession API返回数据

## 📊 预期控制台输出

### 成功流程的完整日志:
```
提交表单，quickIdea: 我想做一个帮助宠物主人的社交APP
跳转到/chat，传递initialIdea: 我想做一个帮助宠物主人的社交APP
NewSessionPage useEffect，location.state: {initialIdea: "我想做一个帮助宠物主人的社交APP"}
设置初始想法: 我想做一个帮助宠物主人的社交APP
创建会话，数据: {title: "宠物主人社交APP需求分析", initial_idea: "我想做一个帮助宠物主人的社交APP"}
创建新会话，sessionId: session-2-1234567890
会话创建完成，存储的会话数量: 1
获取会话信息，sessionId: session-2-1234567890
获取到的会话: {id: "session-2-1234567890", title: "...", initial_idea: "我想做一个帮助宠物主人的社交APP", ...}
会话的initial_idea: 我想做一个帮助宠物主人的社交APP
```

## 🔧 手动测试命令

### 在浏览器控制台中执行:
```javascript
// 检查当前用户
console.log('当前用户:', JSON.parse(localStorage.getItem('mock_user')));

// 检查所有会话
console.log('所有会话:', Array.from(MockStorage.getInstance().sessions.values()));

// 检查特定会话
const sessionId = 'session-2-1234567890'; // 替换为实际的sessionId
console.log('会话详情:', MockStorage.getInstance().getSession(sessionId));

// 检查会话消息
console.log('会话消息:', MockStorage.getInstance().getMessages(sessionId));
```

## 📝 修复建议

如果发现问题，请按以下顺序检查:

1. **LandingPage**: 确认表单提交和navigate调用
2. **NewSessionPage**: 确认location.state接收和useEffect执行
3. **API层**: 确认createSession和getSession调用
4. **存储层**: 确认MockStorage数据保存和读取
5. **ChatPage**: 确认会话信息显示

## 🎯 成功标准

当整个流程正常工作时，用户应该看到:

1. ✅ 首页输入框正常工作
2. ✅ 点击按钮后正确跳转到NewSessionPage
3. ✅ NewSessionPage显示绿色提示框
4. ✅ 输入框已预填充项目想法
5. ✅ 成功创建会话并跳转到ChatPage
6. ✅ ChatPage显示会话信息，AI回复中包含初始想法

---

**💡 提示**: 如果按照这个指南仍然无法解决问题，请提供完整的控制台日志，这将帮助快速定位问题所在。 