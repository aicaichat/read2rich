// 会话 API 封装
import { sessionAPI } from './api';
import { enhancedSessionAPI, USING_MOCK_API } from './enhanced-mock-api';
import { optimizedSessionAPI, USING_OPTIMIZED_API } from './optimized-mock-api';
import { ultraFastSessionAPI, USING_ULTRA_FAST_API } from './ultra-fast-mock-api';
import type { Session, Message, SessionCreateForm } from '@/types';

export const getSessionAPI = () => {
  if (USING_ULTRA_FAST_API) {
    console.log('🚀 使用超快速API');
    return ultraFastSessionAPI;
  }
  if (USING_OPTIMIZED_API) {
    console.log('⚡ 使用优化API');
    return optimizedSessionAPI;
  }
  if (USING_MOCK_API) {
    console.log('🔧 使用增强Mock API');
    return enhancedSessionAPI;
  }
  console.log('🌐 使用真实API');
  return sessionAPI;
};

// 统一的会话 API 接口
export const unifiedSessionAPI = {
  async createSession(data: SessionCreateForm): Promise<Session> {
    return getSessionAPI().createSession(data);
  },

  async getUserSessions(): Promise<Session[]> {
    return getSessionAPI().getUserSessions();
  },

  async getSession(sessionId: string): Promise<Session> {
    return getSessionAPI().getSession(sessionId);
  },

  async getMessages(sessionId: string): Promise<Message[]> {
    return getSessionAPI().getMessages(sessionId);
  },

  async addMessage(sessionId: string, content: string): Promise<Message> {
    return getSessionAPI().addMessage(sessionId, content);
  },

  async deleteSession(sessionId: string): Promise<void> {
    return getSessionAPI().deleteSession(sessionId);
  }
}; 