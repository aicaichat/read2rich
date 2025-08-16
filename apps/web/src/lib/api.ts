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

// 真实后端API地址
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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

// 认证相关 API - 使用真实后端
export const authAPI = {
  async login(data: LoginForm): Promise<AuthTokens> {
    // 使用 FormData 格式发送登录请求
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const tokens: AuthTokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token || '',
      token_type: response.data.token_type
    };
    
    // 保存令牌到本地存储
    localStorage.setItem('access_token', tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
    
    return tokens;
  },

  async register(data: RegisterForm): Promise<User> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken
    });
    
    const tokens: AuthTokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token || refreshToken,
      token_type: response.data.token_type
    };
    
    // 更新本地存储
    localStorage.setItem('access_token', tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
    
    return tokens;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed, but clearing local storage');
    } finally {
      // 清除本地存储
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
};

// 会话相关 API - 使用真实后端
export const sessionAPI = {
  async createSession(data: SessionCreateForm): Promise<Session> {
    const response = await api.post('/sessions', data);
    return response.data;
  },

  async getUserSessions(): Promise<Session[]> {
    const response = await api.get('/sessions');
    return response.data;
  },

  async getSession(sessionId: string): Promise<Session> {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  async getMessages(sessionId: string): Promise<Message[]> {
    const response = await api.get(`/sessions/${sessionId}/messages`);
    return response.data;
  },

  async addMessage(sessionId: string, content: string): Promise<Message> {
    const response = await api.post(`/sessions/${sessionId}/messages`, {
      content,
    });
    return response.data;
  },

  async deleteSession(sessionId: string): Promise<void> {
    await api.delete(`/sessions/${sessionId}`);
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

// 提示词相关 API - 使用真实后端
export const promptAPI = {
  async generatePrompts(sessionId: string): Promise<GeneratedPrompt> {
    const response = await api.post('/prompts/generate', {
      session_id: sessionId
    });
    return response.data;
  },

  async getSessionPrompts(sessionId: string): Promise<GeneratedPrompt[]> {
    const response = await api.get('/prompts', {
      params: { session_id: sessionId }
    });
    return response.data;
  },

  async getPrompt(promptId: string): Promise<GeneratedPrompt> {
    const response = await api.get(`/prompts/${promptId}`);
    return response.data;
  },

  async confirmPrompt(promptId: string): Promise<{ message: string; prompt_id: string }> {
    const response = await api.post(`/prompts/${promptId}/confirm`);
    return response.data;
  },
};

// 代码生成相关 API - 使用真实后端
export const generationAPI = {
  async generateCode(promptId: string): Promise<CodeGeneration> {
    const response = await api.post('/generation/code', {
      prompt_id: promptId
    });
    return response.data;
  },

  async generateProjectPlan(promptId: string): Promise<CodeGeneration> {
    const response = await api.post('/generation/plan', {
      prompt_id: promptId
    });
    return response.data;
  },

  async getGenerationResults(promptId: string): Promise<CodeGeneration[]> {
    const response = await api.get('/generation/results', {
      params: { prompt_id: promptId }
    });
    return response.data;
  }
};

// 健康检查 API - 使用真实后端
export const healthAPI = {
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  }
};

// 报告生成 API（后端HTML生成接口）
export const reportsAPI = {
  async generateHTML(projectId: string, titleZh?: string, titleEn?: string): Promise<string> {
    // 注意：后端路由未带 /api/v1 前缀的情况下，需拼完整URL；这里api实例已指向 /api/v1
    const response = await api.post('/reports/html', {
      project_id: projectId,
      title_zh: titleZh,
      title_en: titleEn
    });
    return response.data.html as string;
  },
  async publish(projectId: string, title: string, html: string): Promise<{ htmlUrl: string; pdfUrl?: string; storage: string }> {
    const response = await api.post('/reports/publish', {
      project_id: projectId,
      title,
      html
    });
    return response.data;
  }
};

// 定制订单 API
export const customOrderAPI = {
  async create(payload: {
    project_id?: string;
    project_title?: string;
    company: string;
    name: string;
    contact: string;
    requirement: string;
    budget_timeline?: string;
  }): Promise<{ order_number: string; status: string }> {
    const response = await api.post('/orders/custom', payload); // reports.router 挂载在 /api/v1 根下
    return response.data;
  },
  async list(): Promise<Array<{ order_number: string; company: string; name: string; contact: string; status: string; project_title?: string; created_at?: string }>> {
    const resp = await api.get('/orders/custom');
    return resp.data;
  }
};

export const analyticsAPI = {
  async track(name: string, props?: Record<string, any>) {
    try {
      const res = await fetch('/api/v1/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, props })
      });
      if (!res.ok) throw new Error('track failed');
    } catch (e) {
      // ignore
    }
  }
};

export default api; 