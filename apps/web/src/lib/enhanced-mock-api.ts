// 增强的模拟 API，集成真实的 DeepSeek API
import type { 
  User, 
  Session,
  Message,
  AuthTokens,
  LoginForm,
  RegisterForm,
  SessionCreateForm,
  MessageCreateForm
} from '@/types';
import { callDeepSeekAPI } from './mock-api';

// 模拟数据存储
class MockStorage {
  private static instance: MockStorage;
  private users: Map<string, User & { password: string }> = new Map();
  private sessions: Map<string, Session> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private currentUserId: number = 1;
  private currentSessionId: number = 1;
  private currentMessageId: number = 1;

  static getInstance(): MockStorage {
    if (!MockStorage.instance) {
      MockStorage.instance = new MockStorage();
      MockStorage.instance.initializeData();
    }
    return MockStorage.instance;
  }

  private initializeData() {
    // 初始化测试用户
    this.users.set('admin', {
      id: 1,
      username: 'admin',
      email: process.env.VITE_ADMIN_EMAIL || 'admin@example.com',
      full_name: 'Administrator',
      password: 'admin123',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    });

    this.users.set('demo', {
      id: 2,
      username: 'demo',
      email: 'demo@example.com',
      full_name: 'Demo User',
      password: 'demo123',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    });
  }

  // 用户管理
  getUser(username: string): (User & { password: string }) | undefined {
    return this.users.get(username);
  }

  createUser(userData: RegisterForm): User {
    const userId = ++this.currentUserId;
    const user = {
      id: userId,
      username: userData.username,
      email: userData.email,
      full_name: userData.full_name || userData.username,
      password: userData.password,
      is_active: true,
      created_at: new Date().toISOString()
    };
    this.users.set(userData.username, user);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      is_active: user.is_active,
      created_at: user.created_at
    };
  }

  // 会话管理
  createSession(userId: number, sessionData: SessionCreateForm): Session {
    const sessionId = `session-${++this.currentSessionId}-${Date.now()}`;
    console.log('创建新会话，sessionId:', sessionId);
    const session: Session = {
      id: sessionId,
      title: sessionData.title || '新的需求分析',
      initial_idea: sessionData.initial_idea,
      status: 'active',
      current_requirements: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.sessions.set(sessionId, session);
    this.messages.set(sessionId, []);
    console.log('会话创建完成，存储的会话数量:', this.sessions.size);
    return session;
  }

  getUserSessions(userId: number): Session[] {
    return Array.from(this.sessions.values()).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  // 消息管理
  getMessages(sessionId: string): Message[] {
    console.log('MockStorage.getMessages 调用，sessionId:', sessionId);
    console.log('当前存储的会话keys:', Array.from(this.sessions.keys()));
    console.log('当前存储的消息keys:', Array.from(this.messages.keys()));
    const result = this.messages.get(sessionId) || [];
    console.log('返回的消息数量:', result.length);
    return result;
  }

  async addMessage(sessionId: string, content: string): Promise<Message> {
    const messages = this.messages.get(sessionId) || [];
    
    // 添加用户消息
    const userMessage: Message = {
      id: String(++this.currentMessageId),
      session_id: sessionId,
      role: 'user',
      content,
      metadata: {},
      created_at: new Date().toISOString()
    };
    
    messages.push(userMessage);
    
    // 获取会话上下文
    const session = this.getSession(sessionId);
    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // 构建 AI 对话上下文
    const aiMessages = [
      {
        role: 'system',
        content: `你是 AI 助手，专门帮助用户澄清和完善项目需求。

初始想法：${session?.initial_idea || '未知'}

你的任务是：
1. 通过提问帮助用户完善需求细节
2. 了解技术背景、目标用户、功能范围、技术约束等
3. 引导用户思考项目的关键问题
4. 当信息足够详细时，建议用户生成专业提示词

请用中文回复，语气友好专业，每次回复都要有针对性的问题来推进需求澄清。`
      },
      ...conversationHistory
    ];

    // 调用真实的 DeepSeek API
    const aiResponse = await callDeepSeekAPI(aiMessages);
    
    // 添加 AI 回复
    const assistantMessage: Message = {
      id: String(++this.currentMessageId),
      session_id: sessionId,
      role: 'assistant',
      content: aiResponse,
      metadata: {},
      created_at: new Date().toISOString()
    };
    
    messages.push(assistantMessage);
    this.messages.set(sessionId, messages);
    
    console.log('消息添加完成，当前消息数量:', messages.length);
    
    return assistantMessage;
  }
}

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成模拟 JWT token
const generateMockToken = (username: string): string => {
  return `mock-jwt-token-${username}-${Date.now()}`;
};

// 增强的认证 API
export const enhancedAuthAPI = {
  async login(data: LoginForm): Promise<AuthTokens> {
    await delay(800);
    
    const storage = MockStorage.getInstance();
    const user = storage.getUser(data.username);
    
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
      refresh_token: `mock-refresh-${Date.now()}`,
      token_type: 'bearer'
    };
  },

  async register(data: RegisterForm): Promise<User> {
    await delay(1000);
    
    const storage = MockStorage.getInstance();
    
    if (storage.getUser(data.username)) {
      throw new Error('用户名已存在');
    }
    
    return storage.createUser(data);
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

// 增强的会话 API
export const enhancedSessionAPI = {
  async createSession(data: SessionCreateForm): Promise<Session> {
    await delay(500);
    
    const storage = MockStorage.getInstance();
    const user = await enhancedAuthAPI.getCurrentUser();
    
    return storage.createSession(user.id, data);
  },

  async getUserSessions(): Promise<Session[]> {
    await delay(400);
    
    const storage = MockStorage.getInstance();
    const user = await enhancedAuthAPI.getCurrentUser();
    
    return storage.getUserSessions(user.id);
  },

  async getSession(sessionId: string): Promise<Session> {
    await delay(300);
    
    const storage = MockStorage.getInstance();
    const session = storage.getSession(sessionId);
    
    if (!session) {
      throw new Error('会话不存在');
    }
    
    return session;
  },

  async getMessages(sessionId: string): Promise<Message[]> {
    await delay(200);
    
    const storage = MockStorage.getInstance();
    console.log('getMessages 调用，sessionId:', sessionId);
    const result = storage.getMessages(sessionId);
    console.log('getMessages 结果:', result);
    return result;
  },

  async addMessage(sessionId: string, content: string): Promise<Message> {
    await delay(100); // 减少延迟，因为 AI 调用已经有延迟了
    
    const storage = MockStorage.getInstance();
    return storage.addMessage(sessionId, content);
  },

  async deleteSession(sessionId: string): Promise<void> {
    await delay(300);
    // 模拟删除操作
    console.log(`Deleted session: ${sessionId}`);
  }
};

export { USING_MOCK_API } from './mock-api'; 