// 会话fallback机制
import { unifiedSessionAPI } from './session-api';
import type { Session } from '@/types';

// 确保会话存在，如果不存在则创建一个默认会话
export const ensureSessionExists = async (sessionId: string): Promise<Session> => {
  try {
    // 先尝试获取会话
    const session = await unifiedSessionAPI.getSession(sessionId);
    return session;
  } catch (error) {
    console.log('会话不存在，创建新会话:', sessionId);
    
    // 如果会话不存在，创建一个默认会话
    const newSession = await unifiedSessionAPI.createSession({
      title: '恢复的会话',
      initial_idea: '这是一个恢复的会话，请继续您的需求分析。'
    });
    
    console.log('新会话已创建:', newSession.id);
    
    // 如果新创建的会话ID与URL中的不匹配，需要重定向
    if (newSession.id !== sessionId) {
      console.warn('会话ID不匹配，可能需要重定向');
    }
    
    return newSession;
  }
};

// 检查会话是否有效
export const isValidSession = (session: Session | undefined): boolean => {
  return !!(session && session.id && session.title);
}; 