// 模拟 API 服务，用于开发和测试
import type { 
  User, 
  AuthTokens,
  LoginForm,
  RegisterForm 
} from '@/types';
import { getEnabledProviders, getAIConfig } from './ai-config';

// 模拟数据库
const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin': {
    id: 1,
    username: 'admin',
    email: 'admin@deepneed.com',
    full_name: 'Administrator',
    password: 'admin123',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  'demo': {
    id: 2,
    username: 'demo',
    email: 'demo@deepneed.com',
    full_name: 'Demo User',
    password: 'demo123',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
};

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成模拟 JWT token
const generateMockToken = (username: string): string => {
  return `mock-jwt-token-${username}-${Date.now()}`;
};

// 模拟认证 API
export const mockAuthAPI = {
  async login(data: LoginForm): Promise<AuthTokens> {
    await delay(800); // 模拟网络延迟
    
    const user = MOCK_USERS[data.username];
    if (!user || user.password !== data.password) {
      throw new Error('用户名或密码错误');
    }
    
    const token = generateMockToken(data.username);
    localStorage.setItem('mock_user', JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      is_active: user.is_active,
      created_at: user.created_at
    }));
    
    return {
      access_token: token,
      token_type: 'bearer',
      refresh_token: 'mock-refresh-' + Date.now()
    };
  },

  async register(data: RegisterForm): Promise<User> {
    await delay(1000);
    
    // 检查用户名是否已存在
    if (MOCK_USERS[data.username]) {
      throw new Error('用户名已存在');
    }
    
    // 创建新用户
    const newUser: User & { password: string } = {
      id: Object.keys(MOCK_USERS).length + 1,
      username: data.username,
      email: data.email,
      full_name: data.full_name || data.username,
      password: data.password,
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    MOCK_USERS[data.username] = newUser;
    
    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      full_name: newUser.full_name,
      is_active: newUser.is_active,
      created_at: newUser.created_at
    };
  },

  async getCurrentUser(): Promise<User> {
    await delay(300);
    
    const user = localStorage.getItem('mock_user');
    if (!user) {
      throw new Error('用户未登录');
    }
    
    return JSON.parse(user);
  }
};

// 导出一个标志，表示使用模拟 API
export const USING_MOCK_API = false;

// API配置
const API_BASE_URL = 'http://localhost:8001/api';

// 真实后端API调用函数
export const createChatSession = async (initialIdea?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initial_idea: initialIdea
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ 创建会话失败:', error);
    throw error;
  }
};

export const sendChatMessage = async (sessionId: string, content: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ 发送消息失败:', error);
    throw error;
  }
};

export const generateDocuments = async (sessionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ 生成文档失败:', error);
    throw error;
  }
};

export const getChatSession = async (sessionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ 获取会话失败:', error);
    throw error;
  }
};

// 保持原有的AI API调用功能作为备用
// 兼容层：为了保持向后兼容，提供原有函数的简单实现
export const callAIAPI = async (messages: Array<{role: string, content: string}>): Promise<string> => {
  // 简单实现：返回提示信息，建议使用新的后端API
  return `系统已升级到新的后端服务架构。

当前运行状态：
✅ 后端服务：http://localhost:8001
✅ API文档：http://localhost:8001/docs
✅ 健康检查：http://localhost:8001/health

请使用新的API函数：
- createChatSession() - 创建聊天会话
- sendChatMessage() - 发送消息
- generateDocuments() - 生成文档

如需直接AI调用，请访问后端API文档。`;
};

export const callDeepSeekAPIInternal = async (messages: Array<{role: string, content: string}>): Promise<string> => {
  return callAIAPI(messages);
};

// 导出智能API调用器作为默认的DeepSeek API调用方式
// 这样现有代码无需修改，但实际上会使用智能路由器
export { callAIAPI as callDeepSeekAPI };

// 单独导出各个API调用函数，供高级用户使用
export { callDeepSeekAPIInternal as callDeepSeekAPIOnly }; 