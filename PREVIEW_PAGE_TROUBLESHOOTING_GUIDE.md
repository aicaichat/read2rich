# 🔍 预览页面故障排除指南
## 解决"预览页面显示为空"的问题

---

## 🚨 **问题现象**
访问预览页面URL（如 `http://localhost:5177/preview/session-2-1753354824775`）时显示为空白或"没有找到提示词数据"的提示。

---

## 🔍 **问题原因分析**

### **1. 数据传递机制**
预览页面的数据通过以下两种方式获取：
```typescript
1. 路由状态传递 (location.state) - 主要方式
2. 本地存储恢复 (localStorage) - 备用方式
```

### **2. 常见失败场景**
- ✅ **正常流程**: 对话 → 生成提示词 → 自动跳转预览页面 ✓
- ❌ **直接访问**: 直接在地址栏输入预览URL ✗
- ❌ **页面刷新**: 在预览页面按F5刷新 ✗
- ❌ **跨标签页**: 从其他标签页复制链接访问 ✗

---

## 🛠 **解决方案**

### **方案1: 标准流程（推荐）**
```
1. 访问聊天页面: http://localhost:5177/chat/session-2-1753354824775
2. 确保有足够的对话内容（建议3-5轮对话）
3. 点击"生成专业提示词"按钮
4. 等待生成完成后自动跳转到预览页面
```

### **方案2: 数据恢复**
如果已经生成过提示词但页面显示为空：
```
1. 检查浏览器控制台是否有错误信息
2. 检查localStorage中是否有数据:
   - 打开开发者工具 (F12)
   - 切换到 Application/Storage 标签
   - 查看 localStorage 中的 generated-prompts-* 条目
3. 如果有数据但页面仍为空，尝试刷新页面
```

### **方案3: 重新生成**
如果数据确实丢失：
```
1. 返回对话页面
2. 继续完善对话内容
3. 重新生成提示词
```

---

## 🔧 **技术实现改进**

### **新增功能**
1. **数据持久化**: 自动保存生成的提示词到localStorage
2. **智能恢复**: 页面加载时自动尝试恢复数据
3. **友好提示**: 提供清晰的错误信息和解决方案
4. **快速导航**: 提供返回对话和新建对话的快捷按钮

### **代码改进**
```typescript
// 智能数据获取
const getPromptsData = (): GeneratedPrompts | null => {
  // 1. 优先使用路由传递的数据
  if (location.state) {
    return location.state as GeneratedPrompts;
  }
  
  // 2. 尝试从localStorage恢复
  try {
    const savedPrompts = localStorage.getItem(`generated-prompts-${sessionId}`);
    if (savedPrompts) {
      return JSON.parse(savedPrompts);
    }
  } catch (error) {
    console.warn('无法从localStorage恢复提示词数据:', error);
  }
  
  return null;
};
```

---

## 📊 **数据保存时机**

### **保存触发点**
1. **生成成功时**: ChatPage中生成提示词成功后自动保存
2. **页面加载时**: PreviewPage加载时检查并保存当前数据
3. **数据更新时**: 任何提示词数据变化时自动保存

### **存储键命名**
```
格式: generated-prompts-{sessionId}
示例: generated-prompts-session-2-1753354824775
```

---

## 🎯 **最佳使用实践**

### **推荐流程**
1. **充分对话**: 与AI进行至少3-5轮深度对话
2. **关键信息**: 确保涵盖项目目标、技术需求、用户群体等关键信息
3. **适时生成**: 当信息足够丰富时点击生成按钮
4. **即时查看**: 生成完成后立即查看预览页面
5. **及时下载**: 下载Markdown文档作为备份

### **避免的操作**
- ❌ 不要直接访问预览URL
- ❌ 不要在对话不充分时急于生成
- ❌ 不要频繁刷新预览页面
- ❌ 不要清除浏览器数据后期望恢复

---

## 🔧 **开发者调试**

### **控制台命令**
```javascript
// 检查当前会话的提示词数据
const sessionId = window.location.pathname.split('/').pop();
const data = localStorage.getItem(`generated-prompts-${sessionId}`);
console.log('保存的提示词数据:', JSON.parse(data || '{}'));

// 清除特定会话的数据
localStorage.removeItem(`generated-prompts-${sessionId}`);

// 查看所有保存的提示词
Object.keys(localStorage)
  .filter(key => key.startsWith('generated-prompts-'))
  .forEach(key => console.log(key, localStorage.getItem(key)));
```

### **常见错误和解决方案**
```
Error: 无法解析localStorage数据
解决: 检查数据格式，清除损坏的数据

Error: sessionId undefined
解决: 检查URL格式，确保包含有效的sessionId

Error: 路由状态为空
解决: 通过正常流程导航到预览页面
```

---

## 🎉 **修复确认**

现在预览页面具备以下能力：
1. ✅ **智能数据恢复**: 自动从多个来源恢复数据
2. ✅ **友好错误提示**: 清晰的问题描述和解决方案
3. ✅ **数据持久化**: 自动保存到localStorage防止丢失
4. ✅ **快速导航**: 一键返回对话或开始新对话
5. ✅ **视觉优化**: 美观的错误页面设计

**🚀 用户现在可以放心使用预览功能，即使页面刷新也能恢复数据！** 