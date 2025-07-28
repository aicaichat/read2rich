// 优化的模拟 API 服务，减少延迟并提升用户体验
import type { 
  User, 
  AuthTokens,
  LoginForm,
  RegisterForm,
  Session,
  Message,
  SessionCreateForm
} from '@/types';

// 导入原有的DeepSeek API调用
import { callDeepSeekAPI } from './mock-api';

// 优化的存储类
class OptimizedMockStorage {
  private static instance: OptimizedMockStorage;
  private users: Map<string, User & { password: string }> = new Map();
  private sessions: Map<string, Session> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private currentUserId: number = 1;
  private currentSessionId: number = 1;
  private currentMessageId: number = 1;
  
  // AI回复缓存
  private aiResponseCache: Map<string, string> = new Map();
  
  // 快速回复模板
  private quickResponses = [
    "好的，我理解您的想法。让我帮您进一步分析一下...",
    "这是一个很有趣的项目！我想了解更多细节...",
    "听起来很有潜力！让我们深入探讨一下...",
    "我明白了，让我为您提供一些专业的建议...",
    "这个想法很棒！我想了解您的目标用户群体...",
    "非常有意思！让我们从技术角度分析一下...",
    "我看到了很多可能性！让我帮您梳理一下需求...",
    "这个方向很有前景！我想了解您的商业模式...",
    "很好的想法！让我们讨论一下技术实现方案...",
    "我理解您的需求，让我为您提供专业的指导..."
  ];

  static getInstance(): OptimizedMockStorage {
    if (!OptimizedMockStorage.instance) {
      OptimizedMockStorage.instance = new OptimizedMockStorage();
      OptimizedMockStorage.instance.initializeData();
    }
    return OptimizedMockStorage.instance;
  }

  private initializeData() {
    // 初始化测试用户
    this.users.set('admin', {
      id: 1,
      username: 'admin',
      email: 'admin@deepneed.com',
      full_name: 'Administrator',
      password: 'admin123',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    });
    
    this.users.set('demo', {
      id: 2,
      username: 'demo',
      email: 'demo@deepneed.com',
      full_name: 'Demo User',
      password: 'demo123',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    });
  }

  getUser(username: string): (User & { password: string }) | undefined {
    return this.users.get(username);
  }

  createUser(userData: RegisterForm): User {
    const newUser: User & { password: string } = {
      id: ++this.currentUserId,
      username: userData.username,
      email: userData.email,
      full_name: userData.full_name || userData.username,
      password: userData.password,
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    this.users.set(userData.username, newUser);
    
    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      full_name: newUser.full_name,
      is_active: newUser.is_active,
      created_at: newUser.created_at
    };
  }

  createSession(userId: number, sessionData: SessionCreateForm): Session {
    const sessionId = `session-${++this.currentSessionId}-${Date.now()}`;
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

  getMessages(sessionId: string): Message[] {
    return this.messages.get(sessionId) || [];
  }

  // 优化的消息添加方法
  async addMessage(sessionId: string, content: string): Promise<Message> {
    const messages = this.messages.get(sessionId) || [];
    
    // 添加用户消息
    const userMessage: Message = {
      id: ++this.currentMessageId,
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
        content: `你是 DeepNeed 的 AI 助手，专门帮助用户澄清和完善项目需求。

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

    // 生成缓存键
    const cacheKey = `${sessionId}-${content.substring(0, 50)}`;
    
    let aiResponse: string;
    
    // 检查缓存
    if (this.aiResponseCache.has(cacheKey)) {
      aiResponse = this.aiResponseCache.get(cacheKey)!;
      console.log('使用缓存的AI回复');
    } else {
      // 先返回快速回复，然后异步获取完整回复
      const quickResponse = this.getQuickResponse();
      
      // 立即添加快速回复
      const quickMessage: Message = {
        id: ++this.currentMessageId,
        session_id: sessionId,
        role: 'assistant',
        content: quickResponse,
        metadata: { isQuickResponse: true },
        created_at: new Date().toISOString()
      };
      
      messages.push(quickMessage);
      this.messages.set(sessionId, messages);
      
      // 异步获取完整回复
      this.getFullAIResponse(aiMessages, sessionId, cacheKey);
      
      return quickMessage;
    }
    
    // 添加 AI 回复
    const assistantMessage: Message = {
      id: ++this.currentMessageId,
      session_id: sessionId,
      role: 'assistant',
      content: aiResponse,
      metadata: {},
      created_at: new Date().toISOString()
    };
    
    messages.push(assistantMessage);
    this.messages.set(sessionId, messages);
    
    return assistantMessage;
  }

  // 获取快速回复
  private getQuickResponse(): string {
    const randomIndex = Math.floor(Math.random() * this.quickResponses.length);
    return this.quickResponses[randomIndex];
  }

  // 异步获取完整AI回复
  private async getFullAIResponse(aiMessages: any[], sessionId: string, cacheKey: string) {
    try {
      console.log('开始获取完整AI回复...');
      const aiResponse = await callDeepSeekAPI(aiMessages);
      
      // 缓存回复
      this.aiResponseCache.set(cacheKey, aiResponse);
      
      // 更新消息
      const messages = this.messages.get(sessionId) || [];
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage && lastMessage.metadata?.isQuickResponse) {
        // 更新快速回复为完整回复
        lastMessage.content = aiResponse;
        lastMessage.metadata.isQuickResponse = false;
        
        console.log('AI回复已更新为完整版本');
      }
    } catch (error) {
      console.error('获取完整AI回复失败:', error);
    }
  }
}

// 优化的延迟函数
const optimizedDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成模拟 JWT token
const generateMockToken = (username: string): string => {
  return `mock-jwt-token-${username}-${Date.now()}`;
};

// 优化的认证 API
export const optimizedAuthAPI = {
  async login(data: LoginForm): Promise<AuthTokens> {
    await optimizedDelay(300); // 减少延迟
    
    const storage = OptimizedMockStorage.getInstance();
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
      token_type: 'bearer'
    };
  },

  async register(data: RegisterForm): Promise<User> {
    await optimizedDelay(500); // 减少延迟
    
    const storage = OptimizedMockStorage.getInstance();
    
    if (storage.getUser(data.username)) {
      throw new Error('用户名已存在');
    }
    
    return storage.createUser(data);
  },

  async getCurrentUser(): Promise<User> {
    await optimizedDelay(100); // 减少延迟
    
    const user = localStorage.getItem('mock_user');
    if (!user) {
      throw new Error('用户未登录');
    }
    
    return JSON.parse(user);
  }
};

// 优化的会话 API
export const optimizedSessionAPI = {
  async createSession(data: SessionCreateForm): Promise<Session> {
    await optimizedDelay(200); // 减少延迟
    
    const storage = OptimizedMockStorage.getInstance();
    const user = await optimizedAuthAPI.getCurrentUser();
    
    return storage.createSession(user.id, data);
  },

  async getUserSessions(): Promise<Session[]> {
    await optimizedDelay(150); // 减少延迟
    
    const storage = OptimizedMockStorage.getInstance();
    const user = await optimizedAuthAPI.getCurrentUser();
    
    return storage.getUserSessions(user.id);
  },

  async getSession(sessionId: string): Promise<Session> {
    await optimizedDelay(100); // 减少延迟
    
    const storage = OptimizedMockStorage.getInstance();
    const session = storage.getSession(sessionId);
    
    if (!session) {
      throw new Error('会话不存在');
    }
    
    return session;
  },

  async getMessages(sessionId: string): Promise<Message[]> {
    await optimizedDelay(50); // 大幅减少延迟
    
    const storage = OptimizedMockStorage.getInstance();
    return storage.getMessages(sessionId);
  },

  async addMessage(sessionId: string, content: string): Promise<Message> {
    // 不添加额外延迟，因为内部已经有优化逻辑
    
    const storage = OptimizedMockStorage.getInstance();
    return storage.addMessage(sessionId, content);
  },

  async deleteSession(sessionId: string): Promise<void> {
    await optimizedDelay(100); // 减少延迟
    console.log(`Deleted session: ${sessionId}`);
  }
};

// 导出优化标志
export const USING_OPTIMIZED_API = false; 