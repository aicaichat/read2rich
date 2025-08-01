// AI应用排行榜数据管理
// 融资事件接口
export interface FundingEvent {
  id: string;
  date: string; // ISO 日期
  round: string;
  amount: number; // 美元
  currency: string;
  investors: string[];
  source: string;
  link: string;
}

export interface AIApp {
  id: number;
  name: string;
  description: string;
  category: string;
  tags: string[];
  website: string;
  logo: string;
  screenshots: string[];
  features: string[];
  pricing: {
    free: boolean;
    paid: boolean;
    pricingModel: string;
    priceRange?: string;
  };
  metrics: {
    users: string;
    revenue?: string;
    rating: number;
    reviews: number;
    downloads?: string;
  };
  technology: {
    aiModels: string[];
    techStack: string[];
    apiIntegrations: string[];
  };
  businessModel: {
    type: string;
    targetUsers: string[];
    valueProposition: string;
    monetization: string[];
  };
  successFactors: {
    innovation: number;
    marketFit: number;
    execution: number;
    growth: number;
    overall: number;
  };
  analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    keyInsights: string[];
  };
  createdAt: string;
  updatedAt: string;
  // 新增可选融资字段
  fundingHistory?: FundingEvent[];
  latestFunding?: FundingEvent;
}

// AI应用分类
export const AI_APP_CATEGORIES = [
  'AI助手',
  '内容创作',
  '图像生成',
  '代码开发',
  '数据分析',
  '教育学习',
  '健康医疗',
  '金融科技',
  '电商零售',
  '娱乐游戏',
  '生产力工具',
  '社交网络'
];

// 模拟AI应用排行榜数据
const aiAppsData: AIApp[] = [
  {
    id: 1,
    name: "ChatGPT",
    description: "OpenAI开发的对话式AI助手，能够进行自然语言对话、回答问题、协助写作等任务。",
    category: "AI助手",
    tags: ["对话AI", "自然语言处理", "写作助手", "问答系统"],
    website: "https://chat.openai.com",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
    ],
    features: [
      "自然语言对话",
      "多语言支持",
      "代码生成",
      "创意写作",
      "问题解答",
      "文档总结"
    ],
    pricing: {
      free: true,
      paid: true,
      pricingModel: "Freemium",
      priceRange: "$20/月"
    },
    metrics: {
      users: "1亿+",
      revenue: "$10亿+",
      rating: 4.8,
      reviews: 500000,
      downloads: "1亿+"
    },
    // 最近融资信息（示例）
    latestFunding: {
      id: 'fund_chatgpt_202401',
      date: '2024-01-18T00:00:00Z',
      round: '战略投资',
      amount: 1000000000,
      currency: 'USD',
      investors: ['Microsoft', '其他机构'],
      source: 'crunchbase-news',
      link: 'https://news.crunchbase.com/'
    },
    fundingHistory: [
      {
        id: 'fund_chatgpt_202401',
        date: '2024-01-18T00:00:00Z',
        round: '战略投资',
        amount: 1000000000,
        currency: 'USD',
        investors: ['Microsoft', '其他机构'],
        source: 'crunchbase-news',
        link: 'https://news.crunchbase.com/'
      }
    ],
    technology: {
      aiModels: ["GPT-4", "GPT-3.5"],
      techStack: ["React", "Python", "OpenAI API"],
      apiIntegrations: ["OpenAI", "Microsoft", "Azure"]
    },
    businessModel: {
      type: "SaaS",
      targetUsers: ["个人用户", "企业用户", "开发者"],
      valueProposition: "最强大的对话式AI助手",
      monetization: ["订阅制", "API服务", "企业版"]
    },
    successFactors: {
      innovation: 9.5,
      marketFit: 9.8,
      execution: 9.2,
      growth: 9.7,
      overall: 9.6
    },
    analysis: {
      strengths: [
        "技术领先，模型性能优秀",
        "用户体验简单直观",
        "生态系统完善",
        "品牌知名度极高"
      ],
      weaknesses: [
        "内容准确性有待提升",
        "隐私保护问题",
        "成本较高"
      ],
      opportunities: [
        "企业市场扩展",
        "垂直领域深耕",
        "API生态建设"
      ],
      threats: [
        "竞争对手增多",
        "监管政策变化",
        "技术更新迭代"
      ],
      keyInsights: [
        "对话式AI已成为主流交互方式",
        "用户体验比技术性能更重要",
        "生态系统建设是长期竞争力"
      ]
    },
    createdAt: "2022-11-30T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  {
    id: 2,
    name: "Midjourney",
    description: "基于AI的图像生成工具，能够根据文本描述创建高质量的艺术作品和图像。",
    category: "图像生成",
    tags: ["AI绘画", "图像生成", "艺术创作", "设计工具"],
    website: "https://midjourney.com",
    logo: "https://images.unsplash.com/photo-1686191128892-3b1c0b5b0b5b?w=100&h=100&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1686191128892-3b1c0b5b0b5b?w=400&h=300&fit=crop"
    ],
    features: [
      "文本到图像生成",
      "高质量艺术风格",
      "多种艺术风格",
      "批量生成",
      "社区分享"
    ],
    pricing: {
      free: false,
      paid: true,
      pricingModel: "订阅制",
      priceRange: "$10-30/月"
    },
    metrics: {
      users: "1000万+",
      revenue: "$1亿+",
      rating: 4.7,
      reviews: 50000
    },
    // Midjourney 融资
    latestFunding: {
      id: 'fund_midjourney_202401',
      date: '2024-01-15T00:00:00Z',
      round: 'Seed',
      amount: 25000000,
      currency: 'USD',
      investors: ['Benchmark', 'a16z'],
      source: 'techcrunch-funding',
      link: 'https://techcrunch.com/'
    },
    fundingHistory: [
      {
        id: 'fund_midjourney_202401',
        date: '2024-01-15T00:00:00Z',
        round: 'Seed',
        amount: 25000000,
        currency: 'USD',
        investors: ['Benchmark', 'a16z'],
        source: 'techcrunch-funding',
        link: 'https://techcrunch.com/'
      }
    ],
    technology: {
      aiModels: ["Diffusion Models", "CLIP"],
      techStack: ["Discord Bot", "Python", "PyTorch"],
      apiIntegrations: ["Discord"]
    },
    businessModel: {
      type: "SaaS",
      targetUsers: ["设计师", "艺术家", "内容创作者", "营销人员"],
      valueProposition: "最强大的AI图像生成工具",
      monetization: ["订阅制", "企业授权"]
    },
    successFactors: {
      innovation: 9.3,
      marketFit: 9.5,
      execution: 8.8,
      growth: 9.4,
      overall: 9.3
    },
    analysis: {
      strengths: [
        "图像质量极高",
        "艺术风格丰富",
        "社区活跃",
        "技术领先"
      ],
      weaknesses: [
        "仅支持Discord",
        "学习曲线陡峭",
        "价格较高"
      ],
      opportunities: [
        "独立应用开发",
        "企业市场扩展",
        "API开放"
      ],
      threats: [
        "竞争对手增多",
        "版权问题",
        "技术门槛降低"
      ],
      keyInsights: [
        "AI图像生成市场需求巨大",
        "社区建设是重要竞争力",
        "用户体验需要简化"
      ]
    },
    createdAt: "2022-07-12T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  {
    id: 3,
    name: "Notion AI",
    description: "集成在Notion中的AI助手，帮助用户写作、总结、翻译和组织内容。",
    category: "生产力工具",
    tags: ["AI写作", "知识管理", "协作工具", "生产力"],
    website: "https://notion.so",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
    ],
    features: [
      "AI写作助手",
      "内容总结",
      "翻译功能",
      "头脑风暴",
      "代码生成",
      "表格分析"
    ],
    pricing: {
      free: true,
      paid: true,
      pricingModel: "Freemium",
      priceRange: "$10/月"
    },
    metrics: {
      users: "3000万+",
      revenue: "$5亿+",
      rating: 4.6,
      reviews: 100000
    },
    technology: {
      aiModels: ["GPT-4", "Claude"],
      techStack: ["React", "TypeScript", "Node.js"],
      apiIntegrations: ["OpenAI", "Anthropic"]
    },
    businessModel: {
      type: "SaaS",
      targetUsers: ["知识工作者", "团队", "学生", "创作者"],
      valueProposition: "AI驱动的知识管理平台",
      monetization: ["订阅制", "企业版", "教育版"]
    },
    successFactors: {
      innovation: 8.5,
      marketFit: 9.2,
      execution: 9.0,
      growth: 8.8,
      overall: 8.9
    },
    analysis: {
      strengths: [
        "产品体验优秀",
        "AI集成自然",
        "生态系统完善",
        "团队协作强大"
      ],
      weaknesses: [
        "AI功能相对简单",
        "价格较高",
        "学习成本高"
      ],
      opportunities: [
        "AI功能增强",
        "垂直领域扩展",
        "企业市场深耕"
      ],
      threats: [
        "竞争对手增多",
        "用户粘性挑战",
        "技术依赖风险"
      ],
      keyInsights: [
        "AI需要与现有工作流深度集成",
        "用户体验比AI能力更重要",
        "生态系统是护城河"
      ]
    },
    createdAt: "2023-02-22T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  {
    id: 4,
    name: "GitHub Copilot",
    description: "AI编程助手，能够根据注释和代码上下文自动生成代码建议。",
    category: "代码开发",
    tags: ["AI编程", "代码生成", "开发工具", "IDE插件"],
    website: "https://github.com/features/copilot",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
    ],
    features: [
      "代码自动补全",
      "注释生成代码",
      "多语言支持",
      "IDE集成",
      "代码解释",
      "测试生成"
    ],
    pricing: {
      free: false,
      paid: true,
      pricingModel: "订阅制",
      priceRange: "$10/月"
    },
    metrics: {
      users: "100万+",
      revenue: "$2亿+",
      rating: 4.5,
      reviews: 25000
    },
    technology: {
      aiModels: ["Codex", "GPT-4"],
      techStack: ["TypeScript", "Python", "OpenAI API"],
      apiIntegrations: ["OpenAI", "GitHub", "VS Code"]
    },
    businessModel: {
      type: "SaaS",
      targetUsers: ["开发者", "编程学习者", "企业开发团队"],
      valueProposition: "最智能的AI编程助手",
      monetization: ["订阅制", "企业版", "教育版"]
    },
    successFactors: {
      innovation: 9.0,
      marketFit: 9.3,
      execution: 8.7,
      growth: 9.1,
      overall: 9.0
    },
    analysis: {
      strengths: [
        "技术领先",
        "集成体验好",
        "代码质量高",
        "学习能力强"
      ],
      weaknesses: [
        "价格较高",
        "依赖网络",
        "代码安全性问题"
      ],
      opportunities: [
        "更多IDE支持",
        "企业市场扩展",
        "垂直领域优化"
      ],
      threats: [
        "竞争对手增多",
        "版权问题",
        "安全风险"
      ],
      keyInsights: [
        "AI编程工具市场需求巨大",
        "集成体验是关键",
        "代码质量比速度更重要"
      ]
    },
    createdAt: "2021-10-27T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  {
    id: 5,
    name: "Jasper",
    description: "AI内容创作平台，帮助用户生成营销文案、博客文章、社交媒体内容等。",
    category: "内容创作",
    tags: ["AI写作", "内容营销", "文案生成", "营销工具"],
    website: "https://jasper.ai",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
    ],
    features: [
      "营销文案生成",
      "博客文章创作",
      "社交媒体内容",
      "广告文案",
      "产品描述",
      "邮件营销"
    ],
    pricing: {
      free: false,
      paid: true,
      pricingModel: "订阅制",
      priceRange: "$39-125/月"
    },
    metrics: {
      users: "100万+",
      revenue: "$1.5亿+",
      rating: 4.4,
      reviews: 15000
    },
    technology: {
      aiModels: ["GPT-4", "Claude", "自定义模型"],
      techStack: ["React", "Node.js", "OpenAI API"],
      apiIntegrations: ["OpenAI", "Anthropic", "Google"]
    },
    businessModel: {
      type: "SaaS",
      targetUsers: ["营销人员", "内容创作者", "企业", "创业者"],
      valueProposition: "最专业的AI内容创作平台",
      monetization: ["订阅制", "企业版", "API服务"]
    },
    successFactors: {
      innovation: 8.2,
      marketFit: 9.0,
      execution: 8.5,
      growth: 8.8,
      overall: 8.6
    },
    analysis: {
      strengths: [
        "专业性强",
        "模板丰富",
        "品牌知名度高",
        "客户服务好"
      ],
      weaknesses: [
        "价格较高",
        "功能相对单一",
        "依赖第三方模型"
      ],
      opportunities: [
        "功能扩展",
        "垂直领域深耕",
        "企业市场扩展"
      ],
      threats: [
        "竞争对手增多",
        "技术门槛降低",
        "用户粘性挑战"
      ],
      keyInsights: [
        "垂直化AI工具有市场空间",
        "专业性和易用性并重",
        "品牌建设很重要"
      ]
    },
    createdAt: "2021-02-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  // 新增：我们的三个成功案例
  {
    id: 101,
    name: "Cal AI",
    description: "两位美国高中生开发的AI拍照识别卡路里应用，通过拍照即可自动识别食物热量，8个月实现500万下载量和100万美元月收入。",
    category: "健康医疗",
    tags: ["健康管理", "图像识别", "AI拍照", "卡路里计算", "高中生创业"],
    website: "https://cal.ai",
    logo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop"
    ],
    features: [
      "拍照识别食物",
      "自动计算卡路里",
      "营养信息分析",
      "健康目标追踪",
      "社交分享功能",
      "个性化建议"
    ],
    pricing: {
      free: true,
      paid: true,
      pricingModel: "Freemium",
      priceRange: "$9.99/月"
    },
    metrics: {
      users: "500万+",
      revenue: "$100万/月",
      rating: 4.7,
      reviews: 150000,
      downloads: "500万+"
    },
    technology: {
      aiModels: ["GPT-4 Vision", "Custom Vision Model"],
      techStack: ["React Native", "Python", "TensorFlow"],
      apiIntegrations: ["OpenAI", "Apple Health", "Google Fit"]
    },
    businessModel: {
      type: "移动应用",
      targetUsers: ["健身爱好者", "减肥人群", "健康意识用户"],
      valueProposition: "最简单的卡路里追踪方式",
      monetization: ["Freemium", "订阅制", "高级功能"]
    },
    successFactors: {
      innovation: 8.5,
      marketFit: 9.2,
      execution: 9.0,
      growth: 9.5,
      overall: 9.1
    },
    analysis: {
      strengths: [
        "极简用户体验",
        "刚需痛点解决",
        "小团队高效执行",
        "快速市场验证"
      ],
      weaknesses: [
        "功能相对单一",
        "竞争激烈",
        "用户粘性挑战"
      ],
      opportunities: [
        "功能扩展",
        "企业市场",
        "数据变现"
      ],
      threats: [
        "大厂竞争",
        "技术门槛降低",
        "用户流失"
      ],
      keyInsights: [
        "高中生也能创造奇迹",
        "简单功能解决复杂问题",
        "快速验证比完美更重要"
      ]
    },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  {
    id: 102,
    name: "Cursor AI",
    description: "专为程序员开发的AI辅助编程工具，首年收入突破1亿美元，估值90亿美元，拥有36万开发者用户。",
    category: "代码开发",
    tags: ["AI编程", "代码助手", "开发者工具", "PLG模式", "社区驱动"],
    website: "https://cursor.sh",
    logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop"
    ],
    features: [
      "AI代码生成",
      "智能代码补全",
      "代码解释和重构",
      "多语言支持",
      "Git集成",
      "团队协作"
    ],
    pricing: {
      free: true,
      paid: true,
      pricingModel: "Freemium",
      priceRange: "$20/月"
    },
    metrics: {
      users: "36万+",
      revenue: "$1亿+",
      rating: 4.8,
      reviews: 25000,
      downloads: "36万+"
    },
    latestFunding: {
      id: 'fund_cursor_2024',
      date: '2024-01-15T00:00:00Z',
      round: 'B轮',
      amount: 500000000,
      currency: 'USD',
      investors: ['Sequoia Capital', 'Andreessen Horowitz'],
      source: 'techcrunch',
      link: 'https://techcrunch.com/'
    },
    technology: {
      aiModels: ["GPT-4", "Claude", "Custom Code Model"],
      techStack: ["TypeScript", "Rust", "WebAssembly"],
      apiIntegrations: ["OpenAI", "Anthropic", "GitHub"]
    },
    businessModel: {
      type: "开发者工具",
      targetUsers: ["软件开发者", "编程学习者", "技术团队"],
      valueProposition: "最智能的AI编程助手",
      monetization: ["Freemium", "订阅制", "企业版"]
    },
    successFactors: {
      innovation: 9.3,
      marketFit: 9.5,
      execution: 9.2,
      growth: 9.8,
      overall: 9.5
    },
    analysis: {
      strengths: [
        "垂直深耕程序员群体",
        "产品驱动增长",
        "社区口碑传播",
        "技术领先优势"
      ],
      weaknesses: [
        "用户群体相对小众",
        "依赖AI模型",
        "竞争激烈"
      ],
      opportunities: [
        "企业市场扩展",
        "功能深度开发",
        "生态建设"
      ],
      threats: [
        "GitHub Copilot竞争",
        "AI模型成本",
        "技术更新迭代"
      ],
      keyInsights: [
        "垂直市场蕴藏巨大价值",
        "PLG模式在开发者工具中有效",
        "社区驱动增长是关键"
      ]
    },
    createdAt: "2022-06-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  {
    id: 103,
    name: "Remini AI",
    description: "AI写真和Baby AI功能应用，两周时间实现全球收入700万美元，4000万下载量，多国App Store榜首。",
    category: "图像生成",
    tags: ["AI写真", "照片修复", "Baby AI", "情感需求", "社交传播"],
    website: "https://remini.ai",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop"
    ],
    features: [
      "AI写真生成",
      "Baby AI预测",
      "照片修复增强",
      "老照片修复",
      "社交分享",
      "多种滤镜效果"
    ],
    pricing: {
      free: true,
      paid: true,
      pricingModel: "Freemium",
      priceRange: "$9.99/月"
    },
    metrics: {
      users: "4000万+",
      revenue: "$700万/2周",
      rating: 4.6,
      reviews: 500000,
      downloads: "4000万+"
    },
    technology: {
      aiModels: ["Stable Diffusion", "Custom GAN", "Face Recognition"],
      techStack: ["React Native", "Python", "PyTorch"],
      apiIntegrations: ["AWS", "Google Cloud", "Apple App Store"]
    },
    businessModel: {
      type: "移动应用",
      targetUsers: ["年轻用户", "社交媒体用户", "情感需求用户"],
      valueProposition: "满足情感与娱乐需求",
      monetization: ["Freemium", "应用内购", "高级功能"]
    },
    successFactors: {
      innovation: 8.8,
      marketFit: 9.4,
      execution: 9.1,
      growth: 9.9,
      overall: 9.3
    },
    analysis: {
      strengths: [
        "情感需求爆发力强",
        "社交传播效果好",
        "视觉冲击力强",
        "变现模式成熟"
      ],
      weaknesses: [
        "功能相对单一",
        "用户粘性不高",
        "技术门槛较低"
      ],
      opportunities: [
        "功能扩展",
        "企业市场",
        "数据变现"
      ],
      threats: [
        "竞争激烈",
        "用户兴趣转移",
        "监管风险"
      ],
      keyInsights: [
        "情感需求是强大驱动力",
        "社交传播带来指数增长",
        "Freemium+高频消费模式有效"
      ]
    },
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  }
];

// AI应用排行榜管理类
class AIRankingManager {
  private apps: AIApp[] = aiAppsData;

  // 获取所有应用
  async getAllApps(): Promise<AIApp[]> {
    return this.apps.sort((a, b) => b.successFactors.overall - a.successFactors.overall);
  }

  // 按分类获取应用
  async getAppsByCategory(category: string): Promise<AIApp[]> {
    return this.apps
      .filter(app => app.category === category)
      .sort((a, b) => b.successFactors.overall - a.successFactors.overall);
  }

  // 按标签搜索应用
  async searchAppsByTags(tags: string[]): Promise<AIApp[]> {
    return this.apps
      .filter(app => tags.some(tag => app.tags.includes(tag)))
      .sort((a, b) => b.successFactors.overall - a.successFactors.overall);
  }

  // 获取应用详情
  async getAppById(id: number): Promise<AIApp | null> {
    return this.apps.find(app => app.id === id) || null;
  }

  // 获取热门应用
  async getPopularApps(limit: number = 10): Promise<AIApp[]> {
    return this.apps
      .sort((a, b) => b.metrics.rating - a.metrics.rating)
      .slice(0, limit);
  }

  // 获取增长最快的应用
  async getFastestGrowingApps(limit: number = 10): Promise<AIApp[]> {
    return this.apps
      .sort((a, b) => b.successFactors.growth - a.successFactors.growth)
      .slice(0, limit);
  }

  // 获取创新性最高的应用
  async getMostInnovativeApps(limit: number = 10): Promise<AIApp[]> {
    return this.apps
      .sort((a, b) => b.successFactors.innovation - a.successFactors.innovation)
      .slice(0, limit);
  }

  // 获取最近获得融资的应用
  async getLatestFundedApps(limit: number = 10): Promise<AIApp[]> {
    return this.apps
      .filter(app => app.latestFunding)
      .sort((a, b) => {
        const d1 = new Date(b.latestFunding!.date).getTime();
        const d2 = new Date(a.latestFunding!.date).getTime();
        return d1 - d2;
      })
      .slice(0, limit);
  }

  // 获取分类列表
  async getCategories(): Promise<string[]> {
    return AI_APP_CATEGORIES;
  }

  // 获取应用统计信息
  async getStats() {
    const total = this.apps.length;
    const categories = new Set(this.apps.map(app => app.category)).size;
    const avgRating = this.apps.reduce((sum, app) => sum + app.metrics.rating, 0) / total;
    const paidApps = this.apps.filter(app => app.pricing.paid).length;
    const freeApps = this.apps.filter(app => app.pricing.free).length;

    return {
      total,
      categories,
      avgRating: Math.round(avgRating * 10) / 10,
      paidApps,
      freeApps,
      paidPercentage: Math.round((paidApps / total) * 100)
    };
  }

  // 获取成功因素分析
  async getSuccessFactorsAnalysis() {
    const factors = ['innovation', 'marketFit', 'execution', 'growth'] as const;
    const analysis: Record<string, { avg: number; top: AIApp[] }> = {};

    factors.forEach(factor => {
      const sorted = [...this.apps].sort((a, b) => b.successFactors[factor] - a.successFactors[factor]);
      const avg = this.apps.reduce((sum, app) => sum + app.successFactors[factor], 0) / this.apps.length;
      
      analysis[factor] = {
        avg: Math.round(avg * 10) / 10,
        top: sorted.slice(0, 3)
      };
    });

    return analysis;
  }
}

// 导出单例实例
export const aiRankingManager = new AIRankingManager(); 