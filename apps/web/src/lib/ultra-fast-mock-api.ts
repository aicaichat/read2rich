// 超快速模拟 API - 专注于极速响应
import type { 
  User, 
  AuthTokens,
  LoginForm,
  RegisterForm,
  Session,
  Message,
  SessionCreateForm
} from '@/types';

// 导入原有的智能AI API调用器（已集成Claude API）
import { callAIAPI } from './mock-api';

// 超快存储类
class UltraFastMockStorage {
  private static instance: UltraFastMockStorage;
  private users: Map<string, User & { password: string }> = new Map();
  private sessions: Map<string, Session> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private currentUserId: number = 1;
  private currentSessionId: number = 1;
  private currentMessageId: number = 1;
  
  // AI回复缓存
  private aiResponseCache: Map<string, string> = new Map();
  
  // 更丰富的智能快速回复
  private smartQuickResponses = [
    {
      keywords: ['用户', '目标', '群体', '人群', '客户'],
      response: "🎯 **用户洞察是产品成功的基石**\n\n作为产品专家，我发现很多创业者容易犯的错误是'假设用户需要什么'，而不是'验证用户真正的痛点'。\n\n让我用**用户画像Canvas**来深度分析你的目标用户群体...\n\n*🧠 正在为您生成专业的产品分析...*"
    },
    {
      keywords: ['技术', '栈', '开发', '框架', '架构'],
      response: "⚡ **技术选型要服务商业目标**\n\n我见过太多技术驱动的失败案例。优秀的产品专家会从**商业价值**倒推技术决策。\n\n让我用**MVP优先原则**来帮你制定最优的技术路线图...\n\n*🧠 正在为您生成专业的技术策略...*"
    },
    {
      keywords: ['功能', '特性', '需求', '要求', '模块'],
      response: "🚀 **功能设计要遵循价值优先原则**\n\n成功的产品不是功能的堆砌，而是**价值的聚焦**。让我用**RICE优先级框架**帮你梳理核心功能...\n\n*🧠 正在为您生成专业的功能分析...*"
    },
    {
      keywords: ['预算', '成本', '费用', '价格', '投资'],
      response: "💰 **预算规划决定产品生死**\n\n在硅谷，我们有句话：'现金流是公司的血液'。让我用**精益成本模型**帮你设计最优的资金使用策略...\n\n*🧠 正在为您生成专业的财务规划...*"
    },
    {
      keywords: ['时间', '周期', '进度', '计划', '里程碑'],
      response: "⏰ **时机比完美更重要**\n\n产品专家都知道：**Time to Market**是核心竞争力。让我用**敏捷产品开发框架**帮你制定里程碑计划...\n\n*🧠 正在为您生成专业的时间规划...*"
    },
    {
      keywords: ['竞品', '对手', '市场', '差异', '竞争'],
      response: "🏆 **竞争策略决定产品胜负**\n\n优秀的产品专家从不害怕竞争，而是**利用竞争优势**。让我用**竞争分析画布**帮你找到差异化机会点...\n\n*🧠 正在为您生成专业的竞争分析...*"
    },
    {
      keywords: ['商业模式', '盈利', '收入', '变现'],
      response: "🎯 **商业模式是产品的灵魂**\n\n我见过无数好产品因为商业模式设计失败而死掉。让我用**商业模式画布**帮你构建可持续的盈利模式...\n\n*🧠 正在为您生成专业的商业策略...*"
    }
  ];

  // 通用快速回复
  private genericQuickResponses = [
    "🚀 **很有潜力的想法！**\n\n作为产品专家，我看到了这个项目的商业价值。让我用**产品战略框架**来深度分析...\n\n*🧠 正在为您生成专业的产品分析...*",
    "💎 **这个方向值得深入！**\n\n从我20年的产品经验来看，成功的关键在于找到**用户价值**与**商业价值**的最佳结合点...\n\n*🧠 正在为您生成专业的策略建议...*",
    "🎯 **我看到了差异化的机会！**\n\n优秀的产品都有一个共同点：在细分市场做到**第一**。让我用竞争分析框架来找到你的突破口...\n\n*🧠 正在为您生成专业的市场分析...*",
    "⚡ **这个想法很有启发性！**\n\n让我用**用户价值主张画布**来帮你分析，如何把这个想法转化为用户愿意付费的超级产品...\n\n*🧠 正在为您生成专业的价值分析...*",
    "🏆 **我感受到了创新的力量！**\n\n真正改变世界的产品都从解决**真实痛点**开始。让我深入挖掘用户需求，找到产品的核心价值...\n\n*🧠 正在为您生成专业的需求分析...*",
    "🧠 **很好的商业洞察！**\n\n成功的产品专家都懂得：**执行力比想法更重要**。让我帮你制定从0到1的实施路径...\n\n*🧠 正在为您生成专业的执行策略...*"
  ];

  static getInstance(): UltraFastMockStorage {
    if (!UltraFastMockStorage.instance) {
      UltraFastMockStorage.instance = new UltraFastMockStorage();
      UltraFastMockStorage.instance.initializeData();
    }
    return UltraFastMockStorage.instance;
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

  // 智能快速回复选择
  private getSmartQuickResponse(userContent: string): string {
    const lowerContent = userContent.toLowerCase();
    
    // 查找匹配的智能回复
    for (const smartResponse of this.smartQuickResponses) {
      for (const keyword of smartResponse.keywords) {
        if (lowerContent.includes(keyword)) {
          return smartResponse.response;
        }
      }
    }
    
    // 如果没有匹配，返回通用回复
    return this.genericQuickResponses[Math.floor(Math.random() * this.genericQuickResponses.length)];
  }

  // 超快速消息添加方法
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
    
    // 生成缓存键 - 更智能的缓存策略
    const cacheKey = `${sessionId}-${content.trim().substring(0, 100)}-${session?.initial_idea?.substring(0, 50) || 'default'}`;
    
    // 检查缓存
    if (this.aiResponseCache.has(cacheKey)) {
      const cachedResponse = this.aiResponseCache.get(cacheKey)!;
      console.log('🚀 使用缓存的AI回复 - 即时响应');
      
      const assistantMessage: Message = {
        id: ++this.currentMessageId,
        session_id: sessionId,
        role: 'assistant',
        content: cachedResponse,
        metadata: { cached: true },
        created_at: new Date().toISOString()
      };
      
      messages.push(assistantMessage);
      this.messages.set(sessionId, messages);
      
      return assistantMessage;
    }

    // 没有缓存时，立即返回智能快速回复
    const smartQuickResponse = this.getSmartQuickResponse(content);
    console.log('⚡ 使用智能快速回复 - 即时响应，200ms后增强');
    
    const quickMessage: Message = {
      id: ++this.currentMessageId,
      session_id: sessionId,
      role: 'assistant',
      content: smartQuickResponse,
      metadata: { isSmartQuickResponse: true, willEnhance: true },
      created_at: new Date().toISOString()
    };
    
    messages.push(quickMessage);
    this.messages.set(sessionId, messages);
    
    // 异步获取更详细的AI回复（超快速版本）
    this.getEnhancedAIResponse(session, messages, sessionId, cacheKey, quickMessage);
    
    return quickMessage;
  }

  // 异步获取增强AI回复
  private async getEnhancedAIResponse(
    session: Session | undefined,
    messages: Message[],
    sessionId: string,
    cacheKey: string,
    quickMessage: Message
  ) {
    try {
      // 缩短延迟，让用户更快看到完整回复
      setTimeout(async () => {
        try {
          console.log('🧠 开始获取专业AI回复...');
          
          const conversationHistory = messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }));

          // 构建 AI 对话上下文
          const aiMessages = [
            {
              role: 'system',
              content: `你是世界级的产品专家和创业导师，拥有20年的产品设计、商业策略和用户洞察经验。你曾帮助多个独角兽公司打造出改变世界的超级产品。

你的专业背景：
- 产品战略：深度理解PMF (Product-Market Fit)、用户价值主张、竞争策略
- 商业模式：精通各种商业模式设计、收入模型、增长引擎
- 用户洞察：善于挖掘用户真实需求、痛点分析、行为心理学
- 技术趋势：了解前沿技术如何赋能产品创新
- 市场洞察：具备敏锐的市场嗅觉和趋势判断

初始项目想法：${session?.initial_idea || '待明确'}

你的任务是通过深度提问，引导用户从以下维度思考如何打造超级产品：

1. **用户价值核心**：挖掘用户真实痛点，定义独特价值主张
2. **市场定位策略**：分析竞争格局，找到差异化机会
3. **商业模式创新**：设计可持续的盈利模式和增长引擎
4. **技术实现路径**：制定MVP到成熟产品的技术演进路线
5. **增长策略规划**：从冷启动到规模化的用户增长策略

提问风格要求：
- 每次提出2-3个递进式的深度问题
- 用具体的案例和框架来启发思考
- 挑战用户的假设，帮助发现盲点
- 提供实用的方法论和工具
- 语气专业而启发性，像资深导师一样

请根据用户的回答，逐步深入挖掘，帮助他们构建出具有竞争力的产品策略。`
            },
            ...conversationHistory
          ];

          const enhancedResponse = await callAIAPI(aiMessages);
          
          // 缓存回复
          this.aiResponseCache.set(cacheKey, enhancedResponse);
          
          // 安全地更新消息为增强版本
          const currentMessages = this.messages.get(sessionId) || [];
          const messageIndex = currentMessages.findIndex(msg => msg.id === quickMessage.id);
          
          if (messageIndex !== -1 && currentMessages[messageIndex]) {
            // 确保不会创建重复消息，只是替换内容
            const updatedMessage = {
              ...currentMessages[messageIndex],
              content: enhancedResponse,
              metadata: { 
                enhanced: true, 
                originalQuickResponse: quickMessage.content,
                enhancedAt: new Date().toISOString()
              }
            };
            
            currentMessages[messageIndex] = updatedMessage;
            this.messages.set(sessionId, currentMessages);
            
            console.log('✨ AI专业回复已更新完成');
            
            // 触发UI更新事件，确保界面同步
            window.dispatchEvent(new CustomEvent('ai-message-updated', { 
              detail: { 
                sessionId, 
                messageId: quickMessage.id, 
                content: enhancedResponse,
                timestamp: Date.now()
              }
            }));
          }
        } catch (innerError) {
          console.error('获取专业AI回复失败:', innerError);
          // 如果失败，快速回复依然可用
        }
      }, 200); // 超快速：缩短到0.2秒，更快看到完整回复
      
    } catch (error) {
      console.error('初始化专业AI回复失败:', error);
      // 如果失败，至少用户有智能快速回复
    }
  }
}

// 零延迟函数
const noDelay = () => Promise.resolve();

// 生成mock token
const generateMockToken = (username: string): string => {
  return `mock_token_${username}_${Date.now()}`;
};

// 超快认证 API
export const ultraFastAuthAPI = {
  async login(data: LoginForm): Promise<AuthTokens> {
    await noDelay();
    
    const storage = UltraFastMockStorage.getInstance();
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
    await noDelay();
    
    const storage = UltraFastMockStorage.getInstance();
    
    if (storage.getUser(data.username)) {
      throw new Error('用户名已存在');
    }
    
    return storage.createUser(data);
  },

  async getCurrentUser(): Promise<User> {
    await noDelay();
    
    const user = localStorage.getItem('mock_user');
    if (!user) {
      throw new Error('用户未登录');
    }
    
    return JSON.parse(user);
  }
};

// 超快会话 API
export const ultraFastSessionAPI = {
  async createSession(data: SessionCreateForm): Promise<Session> {
    await noDelay();
    
    const storage = UltraFastMockStorage.getInstance();
    const user = await ultraFastAuthAPI.getCurrentUser();
    
    return storage.createSession(user.id, data);
  },

  async getUserSessions(): Promise<Session[]> {
    await noDelay();
    
    const storage = UltraFastMockStorage.getInstance();
    const user = await ultraFastAuthAPI.getCurrentUser();
    
    return storage.getUserSessions(user.id);
  },

  async getSession(sessionId: string): Promise<Session> {
    await noDelay();
    
    const storage = UltraFastMockStorage.getInstance();
    const session = storage.getSession(sessionId);
    
    if (!session) {
      throw new Error('会话不存在');
    }
    
    return session;
  },

  async getMessages(sessionId: string): Promise<Message[]> {
    await noDelay();
    
    const storage = UltraFastMockStorage.getInstance();
    return storage.getMessages(sessionId);
  },

  async addMessage(sessionId: string, content: string): Promise<Message> {
    // 零延迟，即时响应
    const storage = UltraFastMockStorage.getInstance();
    return storage.addMessage(sessionId, content);
  },

  async deleteSession(sessionId: string): Promise<void> {
    await noDelay();
    console.log(`Deleted session: ${sessionId}`);
  }
};

// 导出超快标志
export const USING_ULTRA_FAST_API = false; 