// 智能模板匹配器
import { PROMPT_TEMPLATES, searchTemplates, type PromptTemplate } from './prompt-templates';
import type { Message, Session } from '@/types';

export interface TemplateMatch {
  template: PromptTemplate;
  score: number;
  matchedKeywords: string[];
  recommendationReason: string;
}

export interface ExtractedInfo {
  projectType: string;
  techKeywords: string[];
  domainKeywords: string[];
  features: string[];
  requirements: string[];
}

// 技术关键词映射
const TECH_KEYWORDS = {
  web: ['网站', '网页', 'web', 'html', 'css', 'javascript', 'react', 'vue', 'angular', '前端', '后端'],
  mobile: ['手机', '移动', 'app', '应用', 'ios', 'android', 'react native', 'flutter', '移动端'],
  data: ['数据', '分析', '报表', '统计', '大数据', 'sql', '数据库', '数据仓库', '商业智能', 'bi'],
  ai: ['ai', '人工智能', '机器学习', '聊天机器人', '智能', '自然语言', 'nlp', '深度学习'],
  blockchain: ['区块链', '智能合约', 'defi', 'nft', 'web3', '去中心化', 'dapp', '代币'],
  iot: ['物联网', 'iot', '传感器', '设备', '监控', '智能硬件', '边缘计算'],
  game: ['游戏', 'game', '娱乐', 'unity', '引擎'],
  ecommerce: ['电商', '商城', '购物', '订单', '支付', '商品'],
  education: ['教育', '学习', '培训', '课程', '考试', '知识'],
  finance: ['金融', '银行', '支付', '财务', '会计', '投资']
};

// 功能关键词
const FEATURE_KEYWORDS = [
  '用户管理', '登录注册', '权限控制', '数据可视化', '实时通信', '消息推送',
  '文件上传', '搜索功能', '支付集成', '第三方登录', 'api接口', '数据导出',
  '报表生成', '工作流', '审批流程', '多语言', '响应式设计', '移动适配'
];

// 项目类型识别
const PROJECT_TYPES = [
  { keywords: ['管理系统', '后台', '管理平台', 'cms'], type: '管理系统' },
  { keywords: ['电商', '商城', '购物', '零售'], type: '电商平台' },
  { keywords: ['社交', '社区', '论坛', '聊天'], type: '社交应用' },
  { keywords: ['教育', '学习', '培训', '在线课程'], type: '教育平台' },
  { keywords: ['金融', '支付', '银行', '理财'], type: '金融系统' },
  { keywords: ['游戏', '娱乐', '竞技'], type: '游戏应用' },
  { keywords: ['医疗', '健康', '医院', '诊断'], type: '医疗系统' },
  { keywords: ['物流', '配送', '仓储', '供应链'], type: '物流系统' }
];

// 从对话中提取关键信息
export const extractInfoFromConversation = (messages: Message[], session: Session): ExtractedInfo => {
  const allText = [
    session.initial_idea,
    ...messages.filter(m => m.role === 'user').map(m => m.content)
  ].join(' ').toLowerCase();

  // 识别项目类型
  let projectType = '通用系统';
  for (const pt of PROJECT_TYPES) {
    if (pt.keywords.some(keyword => allText.includes(keyword))) {
      projectType = pt.type;
      break;
    }
  }

  // 提取技术关键词
  const techKeywords: string[] = [];
  Object.entries(TECH_KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        techKeywords.push(keyword);
      }
    });
  });

  // 提取领域关键词
  const domainKeywords: string[] = [];
  Object.keys(TECH_KEYWORDS).forEach(domain => {
    if (TECH_KEYWORDS[domain as keyof typeof TECH_KEYWORDS].some(keyword => allText.includes(keyword))) {
      domainKeywords.push(domain);
    }
  });

  // 提取功能需求
  const features = FEATURE_KEYWORDS.filter(feature => 
    allText.includes(feature.toLowerCase())
  );

  // 提取需求关键词
  const requirements = allText.match(/需要|要求|必须|支持|包含|实现/g) || [];

  return {
    projectType,
    techKeywords: [...new Set(techKeywords)],
    domainKeywords: [...new Set(domainKeywords)],
    features,
    requirements: [...new Set(requirements)]
  };
};

// 计算模板匹配分数
export const calculateTemplateScore = (template: PromptTemplate, extractedInfo: ExtractedInfo): number => {
  let score = 0;
  const matchedKeywords: string[] = [];

  // 技术关键词匹配 (40分)
  extractedInfo.techKeywords.forEach(keyword => {
    if (template.tags.some(tag => tag.includes(keyword)) || 
        template.description.toLowerCase().includes(keyword)) {
      score += 8;
      matchedKeywords.push(keyword);
    }
  });

  // 领域匹配 (30分)
  extractedInfo.domainKeywords.forEach(domain => {
    if (template.category.includes(domain) || template.tags.includes(domain)) {
      score += 15;
      matchedKeywords.push(domain);
    }
  });

  // 项目类型匹配 (20分)
  if (template.examples?.some(example => 
    example.toLowerCase().includes(extractedInfo.projectType.toLowerCase()))) {
    score += 20;
    matchedKeywords.push(extractedInfo.projectType);
  }

  // 功能匹配 (10分)
  extractedInfo.features.forEach(feature => {
    if (template.systemTemplate.toLowerCase().includes(feature.toLowerCase()) ||
        template.description.toLowerCase().includes(feature.toLowerCase())) {
      score += 2;
      matchedKeywords.push(feature);
    }
  });

  return Math.min(score, 100); // 最高100分
};

// 推荐最佳模板
export const recommendTemplates = (messages: Message[], session: Session): TemplateMatch[] => {
  const extractedInfo = extractInfoFromConversation(messages, session);
  
  const templateMatches: TemplateMatch[] = PROMPT_TEMPLATES.map(template => {
    const score = calculateTemplateScore(template, extractedInfo);
    const matchedKeywords: string[] = [];
    
    // 收集匹配的关键词
    extractedInfo.techKeywords.forEach(keyword => {
      if (template.tags.includes(keyword) || template.description.toLowerCase().includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    });
    
    extractedInfo.domainKeywords.forEach(domain => {
      if (template.category.includes(domain) || template.tags.includes(domain)) {
        matchedKeywords.push(domain);
      }
    });

    // 生成推荐理由
    let recommendationReason = '';
    if (score >= 80) {
      recommendationReason = '高度匹配：项目需求与模板高度吻合，建议优先使用';
    } else if (score >= 60) {
      recommendationReason = '较好匹配：模板覆盖了大部分需求，可作为主要参考';
    } else if (score >= 40) {
      recommendationReason = '部分匹配：模板可以提供一定参考，需要适当调整';
    } else {
      recommendationReason = '低匹配度：模板与需求差异较大，建议寻找更合适的模板';
    }

    return {
      template,
      score,
      matchedKeywords: [...new Set(matchedKeywords)],
      recommendationReason
    };
  });

  // 按分数降序排列，返回前5个
  return templateMatches
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};

// 填充模板变量
export const fillTemplateVariables = (
  template: PromptTemplate, 
  values: Record<string, string>
): { systemPrompt: string; userPrompt: string } => {
  let systemPrompt = template.systemTemplate;
  let userPrompt = template.userTemplate;

  // 替换变量
  template.variables.forEach(variable => {
    const value = values[variable] || `[请填写${variable}]`;
    const regex = new RegExp(`\\{${variable}\\}`, 'g');
    systemPrompt = systemPrompt.replace(regex, value);
    userPrompt = userPrompt.replace(regex, value);
  });

  return { systemPrompt, userPrompt };
};

// 从对话中自动提取变量值
export const extractVariableValues = (
  messages: Message[], 
  session: Session, 
  template: PromptTemplate
): Record<string, string> => {
  const extractedInfo = extractInfoFromConversation(messages, session);
  const values: Record<string, string> = {};

  const allText = [
    session.initial_idea,
    ...messages.filter(m => m.role === 'user').map(m => m.content)
  ].join(' ');

  // 根据变量名称智能填充
  template.variables.forEach(variable => {
    switch (variable) {
      case 'PROJECT_DESCRIPTION':
      case 'PROJECT_OVERVIEW':
        values[variable] = session.initial_idea;
        break;
      case 'TECH_STACK':
      case 'FRONTEND_TECH':
      case 'BACKEND_TECH':
        values[variable] = extractedInfo.techKeywords.join(', ') || '待确定';
        break;
      case 'CORE_FEATURES':
      case 'MAIN_FEATURES':
      case 'KEY_FEATURES':
        values[variable] = extractedInfo.features.join(', ') || '待详细说明';
        break;
      case 'PROJECT_TYPE':
        values[variable] = extractedInfo.projectType;
        break;
      default:
        // 尝试从文本中提取相关信息
        values[variable] = '请根据具体需求填写';
    }
  });

  return values;
}; 