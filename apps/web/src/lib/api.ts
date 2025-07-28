import axios from 'axios';
import type { 
  User, 
  Session, 
  Message, 
  GeneratedPrompt, 
  CodeGeneration,
  AuthTokens,
  LoginForm,
  RegisterForm,
  SessionCreateForm,
  MessageCreateForm 
} from '@/types';

// 真实后端API地址（仅用于聊天和文档功能）
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证令牌
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 清除过期的令牌
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // 重定向到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关 API - 使用Mock API（因为后端没有认证端点）
export const authAPI = {
  async login(data: LoginForm): Promise<AuthTokens> {
    // 使用Mock认证，返回模拟令牌
    const mockToken = `mock-jwt-token-${data.username}-${Date.now()}`;
    return {
      access_token: mockToken,
      refresh_token: `mock-refresh-${data.username}-${Date.now()}`,
      token_type: 'bearer'
    };
  },

  async register(data: RegisterForm): Promise<User> {
    // 使用Mock注册，返回模拟用户
    const mockUser: User = {
      id: Date.now(),
      username: data.username,
      email: data.email,
      full_name: data.full_name || data.username,
      is_active: true,
      created_at: new Date().toISOString()
    };
    return mockUser;
  },

  async getCurrentUser(): Promise<User> {
    // 使用Mock用户数据
    const mockUser: User = {
      id: 1,
      username: 'demo',
      email: 'demo@deepneed.com',
      full_name: 'Demo User',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    };
    return mockUser;
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    // 使用Mock刷新令牌
    const mockToken = `mock-jwt-token-refreshed-${Date.now()}`;
    return {
      access_token: mockToken,
      refresh_token: `mock-refresh-${Date.now()}`,
      token_type: 'bearer'
    };
  },

  async logout(): Promise<void> {
    // Mock登出，清除本地存储
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// 会话相关 API - 使用真实后端
export const sessionAPI = {
  async createSession(data: SessionCreateForm): Promise<Session> {
    const response = await api.post('/chat/sessions', data);
    return response.data;
  },

  async getUserSessions(): Promise<Session[]> {
    const response = await api.get('/chat/sessions');
    return response.data;
  },

  async getSession(sessionId: string): Promise<Session> {
    const response = await api.get(`/chat/sessions/${sessionId}`);
    return response.data;
  },

  async getMessages(sessionId: string): Promise<Message[]> {
    const response = await api.get(`/chat/sessions/${sessionId}/messages`);
    return response.data;
  },

  async addMessage(sessionId: string, content: string): Promise<Message> {
    const response = await api.post(`/chat/sessions/${sessionId}/messages`, {
      content,
    });
    return response.data;
  },

  async deleteSession(sessionId: string): Promise<void> {
    await api.delete(`/chat/sessions/${sessionId}`);
  },
};

// 文档生成 API - 使用真实后端
export const documentAPI = {
  async generateDocuments(sessionId: string): Promise<any> {
    const response = await api.post('/documents/generate', {
      session_id: sessionId
    });
    return response.data;
  },

  async getDocuments(sessionId: string): Promise<any[]> {
    const response = await api.get('/documents', {
      params: { session_id: sessionId }
    });
    return response.data;
  }
};

// 提示词相关 API - 使用Mock API（因为后端没有这些端点）
export const promptAPI = {
  async generatePrompts(sessionId: string): Promise<GeneratedPrompt> {
    // 使用Mock提示词生成
    return {
      id: String(Date.now()),
      session_id: sessionId,
      type: 'prd',
      content: 'Mock PRD prompt content',
      status: 'draft',
      created_at: new Date().toISOString()
    };
  },

  async getSessionPrompts(sessionId: string): Promise<GeneratedPrompt[]> {
    return [];
  },

  async getPrompt(promptId: string): Promise<GeneratedPrompt> {
    return {
      id: promptId,
      session_id: 'mock-session',
      type: 'prd',
      content: 'Mock prompt content',
      status: 'draft',
      created_at: new Date().toISOString()
    };
  },

  async confirmPrompt(promptId: string): Promise<{ message: string; prompt_id: string }> {
    return {
      message: 'Prompt confirmed successfully',
      prompt_id: promptId
    };
  },
};

// 代码生成相关 API - 使用Mock API
export const generationAPI = {
  async generateCode(promptId: string): Promise<CodeGeneration> {
    return {
      id: Date.now(),
      prompt_id: promptId,
      type: 'code',
      content: 'Mock generated code',
      status: 'completed',
      created_at: new Date().toISOString()
    };
  },

  async generateProjectPlan(promptId: string): Promise<CodeGeneration> {
    return {
      id: Date.now(),
      prompt_id: promptId,
      type: 'plan',
      content: 'Mock project plan',
      status: 'completed',
      created_at: new Date().toISOString()
    };
  },

  async getGenerationResults(promptId: string): Promise<CodeGeneration[]> {
    return [];
  }
};

// 健康检查 API - 使用真实后端
export const healthAPI = {
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api; 