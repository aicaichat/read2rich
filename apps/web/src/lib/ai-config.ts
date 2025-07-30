// AI API 配置管理
export interface AIProviderConfig {
  name: string;
  displayName: string;
  enabled: boolean;
  priority: number;
  description: string;
  apiKey?: string; // 添加API密钥字段
  apiKeyConfigured?: boolean; // 添加API密钥配置状态
}

export interface AIConfig {
  providers: Record<string, AIProviderConfig>;
  defaultProvider: string;
  retryAttempts: number;
  timeout: number;
}

// 默认AI配置 - 优化速度版本
export const DEFAULT_AI_CONFIG: AIConfig = {
  providers: {
    claude: {
      name: 'claude',
      displayName: 'Claude 3 Haiku',
      enabled: true,
      priority: 1, // 最高优先级
      description: '最新的Claude 3模型，响应速度快，理解能力强',
      apiKey: '',
      apiKeyConfigured: false
    },
    deepseek: {
      name: 'deepseek',
      displayName: 'DeepSeek Chat',
      enabled: true,
      priority: 2, // 备用选择
      description: '专业的编程和技术问答AI',
      apiKey: '',
      apiKeyConfigured: false
    }
  },
  defaultProvider: 'claude',
  retryAttempts: 1, // 减少重试次数，加快失败转移
  timeout: 15000 // 减少超时时间到15秒
};

// 获取当前AI配置
export const getAIConfig = (): AIConfig => {
  const stored = localStorage.getItem('ai-config');
  if (stored) {
    try {
      return { ...DEFAULT_AI_CONFIG, ...JSON.parse(stored) };
    } catch (error) {
      console.warn('AI配置解析失败，使用默认配置:', error);
    }
  }
  return DEFAULT_AI_CONFIG;
};

// 保存AI配置
export const saveAIConfig = (config: Partial<AIConfig>): void => {
  try {
    const current = getAIConfig();
    const updated = { ...current, ...config };
    localStorage.setItem('ai-config', JSON.stringify(updated));
    console.log('✅ AI配置已保存:', updated);
  } catch (error) {
    console.error('❌ AI配置保存失败:', error);
  }
};

// 获取启用的API提供商列表（按优先级排序）
export const getEnabledProviders = (): string[] => {
  const config = getAIConfig();
  return Object.values(config.providers)
    .filter(provider => provider.enabled)
    .sort((a, b) => a.priority - b.priority)
    .map(provider => provider.name);
};

// 切换API提供商启用状态
export const toggleProvider = (providerName: string, enabled: boolean): void => {
  const config = getAIConfig();
  if (config.providers[providerName]) {
    config.providers[providerName].enabled = enabled;
    saveAIConfig(config);
  }
};

// 设置API提供商优先级
export const setProviderPriority = (providerName: string, priority: number): void => {
  const config = getAIConfig();
  if (config.providers[providerName]) {
    config.providers[providerName].priority = priority;
    saveAIConfig(config);
  }
};

// 重置为默认配置
export const resetAIConfig = (): void => {
  localStorage.removeItem('ai-config');
  console.log('🔄 AI配置已重置为默认值');
};

// 设置API提供商API密钥
export const setProviderAPIKey = (providerName: string, apiKey: string): void => {
  const config = getAIConfig();
  if (config.providers[providerName]) {
    config.providers[providerName].apiKey = apiKey;
    config.providers[providerName].apiKeyConfigured = !!apiKey;
    saveAIConfig(config);
  }
};

// 获取API提供商的API密钥
export const getProviderAPIKey = (providerName: string): string => {
  const config = getAIConfig();
  return config.providers[providerName]?.apiKey || '';
};

// 检查API提供商是否已配置API密钥
export const isProviderAPIKeyConfigured = (providerName: string): boolean => {
  const config = getAIConfig();
  return config.providers[providerName]?.apiKeyConfigured || false;
}; 