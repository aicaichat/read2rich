import type { PremiumReport } from '../data/premiumReportTemplate.ts';
import { aiCareerPathFinderReport } from '../data/premiumReports/aiCareerPathFinder.ts';
import { aiDreamJournalAnalyzerReport } from '../data/premiumReports/aiDreamJournalAnalyzer.ts';
import { clothingMatcherReport } from '../data/premiumReports/clothingMatcher.ts';

// 报告生成器类
export class PremiumReportGenerator {
  private reports: Map<string, PremiumReport>;

  constructor() {
    this.reports = new Map();
    this.initializeReports();
  }

  private initializeReports() {
    // 加载已创建的详细报告
    this.reports.set('1', aiCareerPathFinderReport);
    this.reports.set('4', aiDreamJournalAnalyzerReport);
    this.reports.set('5', clothingMatcherReport);
    
    // 为其他项目生成基础报告结构
    this.generateBasicReports();
  }

  private generateBasicReports() {
    const projectTemplates = [
      {
        id: '2',
        title: 'AI心理倦怠检测器 (AI Mental Burnout Detector)',
        marketSize: '$320亿全球心理健康市场',
        revenueProjection: '第一年$200万，第三年$1200万',
        keyTech: '情感计算、行为分析、预测模型',
        mainRevenue: '企业SaaS订阅、个人健康监测、数据洞察服务'
      },
      {
        id: '3',
        title: 'AI每日反思与日记助手 (AI-Powered Daily Reflection App)',
        marketSize: '$45亿个人成长应用市场',
        revenueProjection: '第一年$120万，第三年$600万',
        keyTech: '自然语言处理、情感分析、个性化推荐',
        mainRevenue: '订阅服务、高级功能、冥想课程'
      },
      {
        id: '4',
        title: 'AI梦境日记分析器 (AI-Based Dream Journal Analyzer)',
        marketSize: '$28亿心理学应用市场',
        revenueProjection: '第一年$80万，第三年$400万',
        keyTech: '符号学分析、模式识别、心理学知识图谱',
        mainRevenue: '付费分析、专家咨询、研究数据销售'
      },
      {
        id: '5',
        title: 'AI服装搭配师 (AI-Based Clothing Matcher)',
        marketSize: '$680亿时尚电商市场',
        revenueProjection: '第一年$300万，第三年$1500万',
        keyTech: '计算机视觉、AR技术、推荐算法',
        mainRevenue: '电商佣金、品牌合作、VIP造型服务'
      },
      {
        id: '6',
        title: 'AI宠物健康追踪器 (AI Pet Health Tracker)',
        marketSize: '$230亿宠物健康市场',
        revenueProjection: '第一年$180万，第三年$900万',
        keyTech: '图像识别、行为分析、健康预测',
        mainRevenue: '订阅服务、兽医平台、保险合作'
      },
      {
        id: '7',
        title: 'AI人际关系兼容性分析 (AI Relationship Compatibility App)',
        marketSize: '$85亿约会应用市场',
        revenueProjection: '第一年$100万，第三年$500万',
        keyTech: '情感分析、沟通模式识别、匹配算法',
        mainRevenue: '高级会员、深度分析、关系咨询'
      },
      {
        id: '8',
        title: 'AI故事情节生成器 (AI-Based Story Plot Generator)',
        marketSize: '$180亿内容创作市场',
        revenueProjection: '第一年$150万，第三年$750万',
        keyTech: '大语言模型、创意生成、结构化输出',
        mainRevenue: '订阅服务、API调用、定制开发'
      },
      {
        id: '9',
        title: 'AI兴趣爱好发现器 (AI Hobby Finder)',
        marketSize: '$120亿休闲娱乐市场',
        revenueProjection: '第一年$90万，第三年$450万',
        keyTech: '推荐系统、知识图谱、个性化匹配',
        mainRevenue: '平台佣金、广告收入、会员服务'
      },
      {
        id: '10',
        title: 'AI小型企业法律顾问 (AI Legal Advisor for Small Businesses)',
        marketSize: '$430亿法律科技市场',
        revenueProjection: '第一年$250万，第三年$1200万',
        keyTech: '法律NLP、合同分析、风险评估',
        mainRevenue: '订阅服务、按次付费、法律咨询'
      }
    ];

    projectTemplates.forEach(template => {
      this.reports.set(template.id, this.generateBasicReport(template));
    });
  }

  private generateBasicReport(template: any): PremiumReport {
    return {
      projectId: template.id,
      title: template.title,
      executiveSummary: {
        projectOverview: `${template.title}是一个创新的AI驱动解决方案，旨在解决市场中的关键痛点。`,
        keyOpportunity: `利用人工智能技术，为用户提供个性化和智能化的服务体验。`,
        marketSize: template.marketSize,
        revenueProjection: template.revenueProjection,
        timeToMarket: '12-18周MVP上线，6-9个月完整产品',
        investmentRequired: '种子轮30-80万美元',
        expectedROI: '预计3年内实现250-400%投资回报率',
        keySuccessFactors: [
          '核心AI算法的准确性',
          '用户体验设计',
          '市场定位和营销',
          '技术团队能力',
          '数据质量和获取'
        ]
      },
      marketAnalysis: {
        marketSize: {
          tam: template.marketSize,
          sam: `约20-30%的可服务市场`,
          som: `初期目标5-10%的可获得市场份额`
        },
        marketTrends: [
          'AI技术接受度持续提升',
          '个性化服务需求增长',
          '移动优先的用户习惯',
          '订阅模式普及',
          '数据隐私意识增强'
        ],
        targetAudience: {
          primarySegment: '25-45岁的数字化原住民',
          secondarySegment: '18-25岁的年轻群体',
          userPersonas: [
            {
              name: '技术早期采用者',
              demographics: '30岁，高学历，高收入',
              painPoints: ['效率需求', '个性化体验', '时间管理'],
              motivations: ['技术便利', '生活优化', '个人成长'],
              behavior: '活跃使用各类应用，愿意尝试新技术'
            }
          ]
        },
        competitorAnalysis: [
          {
            name: '传统解决方案',
            strengths: ['市场认知度高', '用户基础大'],
            weaknesses: ['缺乏AI能力', '用户体验差'],
            marketShare: '60-70%',
            pricing: '传统定价模式',
            differentiation: '我们的AI技术和用户体验优势明显'
          }
        ],
        marketValidation: {
          surveyData: '初步市场调研显示75%的目标用户有相关需求',
          expertInterviews: '行业专家普遍看好AI在该领域的应用前景',
          pilotResults: '早期试点显示积极的用户反馈和使用粘性'
        }
      },
      technicalImplementation: {
        architecture: {
          overview: '采用现代微服务架构，支持云原生部署和横向扩展',
          components: [
            {
              name: 'AI推理引擎',
              description: '核心AI算法和模型服务',
              technology: template.keyTech,
              complexity: 'High'
            },
            {
              name: '用户界面',
              description: '响应式Web和移动应用',
              technology: 'React Native + TypeScript',
              complexity: 'Medium'
            },
            {
              name: '数据处理',
              description: '数据采集、处理和存储服务',
              technology: 'Python + PostgreSQL',
              complexity: 'Medium'
            }
          ],
          dataFlow: '用户输入 → 数据处理 → AI分析 → 结果返回 → 界面展示'
        },
        techStack: {
          frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
          backend: ['Node.js', 'Python', 'FastAPI', 'Redis'],
          database: ['PostgreSQL', 'MongoDB', 'Elasticsearch'],
          aiML: ['TensorFlow', 'PyTorch', 'Hugging Face', 'OpenAI API'],
          deployment: ['Docker', 'Kubernetes', 'AWS', 'Vercel']
        },
        coreAlgorithms: [
          {
            name: '核心AI算法',
            purpose: '实现主要功能的智能分析',
            implementation: '基于深度学习和机器学习的混合方法',
            alternatives: ['规则引擎', '统计模型', '预训练模型']
          }
        ],
        scalingStrategy: '云原生架构支持自动扩缩容，CDN加速全球访问',
        securityConsiderations: [
          '数据加密传输和存储',
          '用户身份认证和授权',
          'API安全和限流',
          '合规性审计',
          '定期安全扫描'
        ],
        developmentRoadmap: [
          {
            phase: 'MVP开发',
            duration: '12-16周',
            deliverables: ['核心功能', '基础UI', '用户注册'],
            resources: '3-5名工程师'
          },
          {
            phase: '产品完善',
            duration: '16-20周',
            deliverables: ['高级功能', '移动应用', '性能优化'],
            resources: '5-8名工程师'
          }
        ]
      },
      businessModel: {
        revenueStreams: [
          {
            type: '订阅收费',
            description: '月度/年度订阅服务',
            potential: template.mainRevenue.includes('订阅') ? '70%' : '40%',
            timeline: '产品上线即开始'
          },
          {
            type: '增值服务',
            description: '高级功能和专业服务',
            potential: '20%',
            timeline: '产品上线3个月后'
          },
          {
            type: '合作分成',
            description: '与第三方平台的收入分成',
            potential: '10%',
            timeline: '产品上线6个月后'
          }
        ],
        pricingStrategy: {
          model: '免费增值模式',
          tiers: [
            {
              name: '免费版',
              price: '$0/月',
              features: ['基础功能', '有限使用次数'],
              targetSegment: '试用用户'
            },
            {
              name: '专业版',
              price: '$19-39/月',
              features: ['完整功能', '无限使用', '优先支持'],
              targetSegment: '个人用户'
            },
            {
              name: '企业版',
              price: '定制价格',
              features: ['企业级功能', 'API接入', '专属服务'],
              targetSegment: '企业客户'
            }
          ],
          rationale: '免费版吸引用户，专业版产生主要收入，企业版提供高价值服务'
        },
        customerAcquisition: {
          channels: [
            {
              channel: '数字营销',
              cost: '$20-40 CAC',
              effectiveness: '高',
              timeline: '持续进行'
            },
            {
              channel: '内容营销',
              cost: '$10-25 CAC',
              effectiveness: '高',
              timeline: '长期投入'
            },
            {
              channel: '合作伙伴',
              cost: '$15-30 CAC',
              effectiveness: '中',
              timeline: '建立合作后'
            }
          ],
          cac: '$25平均获客成本',
          ltv: '$300-500用户生命周期价值',
          paybackPeriod: '10-15个月'
        },
        financialProjections: {
          year1: {
            revenue: template.revenueProjection.split('第一年')[1]?.split('，')[0] || '$100万',
            expenses: '约收入的80%',
            profit: '约收入的20%',
            users: '10,000-50,000用户'
          },
          year2: {
            revenue: '收入增长150-200%',
            expenses: '约收入的70%',
            profit: '约收入的30%',
            users: '50,000-150,000用户'
          },
          year3: {
            revenue: template.revenueProjection.split('第三年')[1] || '$500万',
            expenses: '约收入的60%',
            profit: '约收入的40%',
            users: '150,000-500,000用户'
          },
          assumptions: [
            '月增长率5-15%',
            '付费转化率10-20%',
            '年流失率20-30%',
            '客单价年增长10%'
          ]
        },
        fundingStrategy: {
          stages: [
            {
              stage: '种子轮',
              amount: '$300,000-800,000',
              timeline: 'MVP开发阶段',
              purpose: '产品开发和团队组建'
            },
            {
              stage: 'A轮',
              amount: '$2,000,000-5,000,000',
              timeline: '产品上线后12-18个月',
              purpose: '市场扩张和团队扩建'
            }
          ],
          totalRequired: '$2,300,000-5,800,000',
          useOfFunds: [
            '产品开发 40%',
            '市场营销 30%',
            '团队建设 25%',
            '运营资金 5%'
          ]
        }
      },
      codeTemplates: {
        mvpFramework: {
          name: 'MVP基础框架',
          description: '包含用户认证、核心功能、基础UI的完整框架',
          language: 'React + Node.js',
          code: '// 详细的代码模板和实现示例...',
          dependencies: ['react', 'express', 'typescript', 'tailwindcss'],
          setup: ['npm install', '配置环境变量', '初始化数据库']
        },
        coreFeatures: [
          {
            name: '核心功能模块',
            description: '实现主要业务逻辑的代码模板',
            language: 'TypeScript',
            code: '// 核心算法实现...',
            dependencies: ['相关AI库', '数据处理库'],
            setup: ['安装依赖', '配置API密钥']
          }
        ],
        apiDesign: {
          name: 'RESTful API设计',
          description: '完整的API接口设计和实现',
          language: 'OpenAPI 3.0',
          code: '// API规范文档...',
          dependencies: ['fastapi', 'pydantic'],
          setup: ['API文档生成', '接口测试']
        },
        databaseSchema: {
          name: '数据库设计',
          description: '核心数据表和关系设计',
          language: 'SQL',
          code: '// 数据库建表语句...',
          dependencies: ['postgresql'],
          setup: ['创建数据库', '运行迁移脚本']
        },
        deploymentScripts: {
          name: '部署脚本',
          description: 'Docker容器化和云部署配置',
          language: 'Docker',
          code: '// Docker和部署配置...',
          dependencies: ['docker', 'kubernetes'],
          setup: ['容器构建', '部署到云平台']
        }
      },
      quickStartKit: {
        setupGuide: `
# ${template.title} - 快速启动指南

## 环境要求
- Node.js 18+
- Python 3.9+
- PostgreSQL 13+
- Redis (可选)

## 快速开始
1. 克隆项目仓库
2. 安装依赖包
3. 配置环境变量
4. 初始化数据库
5. 启动开发服务器

## 部署指南
- 本地开发环境
- Docker容器部署
- 云平台部署

详细步骤请参考完整文档。
`,
        configFiles: [
          {
            filename: '.env.example',
            purpose: '环境变量模板',
            content: '# 数据库配置\nDATABASE_URL=...\n# API密钥\nAPI_KEY=...'
          }
        ],
        sampleData: '示例数据和测试用例',
        testingFramework: '使用Jest和pytest的测试框架',
        deploymentGuide: 'Docker和云平台部署指南',
        troubleshooting: '常见问题排查和解决方案'
      },
      riskAssessment: {
        technicalRisks: [
          {
            risk: 'AI模型性能不达预期',
            probability: 'Medium',
            impact: 'High',
            description: '核心AI功能可能无法满足用户期望'
          },
          {
            risk: '技术债务积累',
            probability: 'Medium',
            impact: 'Medium',
            description: '快速开发可能导致代码质量问题'
          }
        ],
        marketRisks: [
          {
            risk: '市场接受度不足',
            probability: 'Medium',
            impact: 'High',
            description: '用户可能不接受AI驱动的解决方案'
          },
          {
            risk: '竞争激烈',
            probability: 'High',
            impact: 'Medium',
            description: '大公司可能快速进入市场'
          }
        ],
        operationalRisks: [
          {
            risk: '团队能力不足',
            probability: 'Low',
            impact: 'High',
            description: '缺乏相关技术经验的团队成员'
          }
        ],
        mitigationStrategies: [
          {
            risk: 'AI模型性能',
            strategy: '建立完善的测试和优化流程，持续改进算法',
            timeline: '整个开发周期',
            resources: 'AI工程师 + 数据科学家'
          },
          {
            risk: '市场接受度',
            strategy: '深度用户调研，MVP快速验证，迭代改进',
            timeline: '产品上线前后6个月',
            resources: '产品团队 + 市场团队'
          }
        ]
      },
      appendices: {
        marketResearch: '详细市场调研数据和分析报告',
        technicalSpecs: '完整技术规格和架构文档',
        legalConsiderations: '法律合规和知识产权指南',
        additionalResources: [
          {
            type: '参考资料',
            title: '行业报告和研究论文',
            description: '相关领域的深度研究资料'
          },
          {
            type: '工具推荐',
            title: '开发和运营工具',
            description: '推荐的开发工具和服务'
          }
        ]
      }
    };
  }

  // 获取报告
  getReport(projectId: string): PremiumReport | null {
    return this.reports.get(projectId) || null;
  }

  // 生成PDF报告内容
  generatePDFContent(projectId: string): string {
    const report = this.getReport(projectId);
    if (!report) return '';

    return `
# ${report.title} - 完整商业计划书

## 执行摘要
${report.executiveSummary.projectOverview}

**关键机会**: ${report.executiveSummary.keyOpportunity}
**市场规模**: ${report.executiveSummary.marketSize}
**收入预测**: ${report.executiveSummary.revenueProjection}
**投资需求**: ${report.executiveSummary.investmentRequired}
**预期回报**: ${report.executiveSummary.expectedROI}

### 成功关键因素
${report.executiveSummary.keySuccessFactors.map(factor => `- ${factor}`).join('\n')}

## 市场分析

### 市场规模
- **总目标市场 (TAM)**: ${report.marketAnalysis.marketSize.tam}
- **可服务市场 (SAM)**: ${report.marketAnalysis.marketSize.sam}
- **可获得市场 (SOM)**: ${report.marketAnalysis.marketSize.som}

### 市场趋势
${report.marketAnalysis.marketTrends.map(trend => `- ${trend}`).join('\n')}

### 目标用户
**主要细分市场**: ${report.marketAnalysis.targetAudience.primarySegment}
**次要细分市场**: ${report.marketAnalysis.targetAudience.secondarySegment}

### 竞争分析
${report.marketAnalysis.competitorAnalysis.map(comp => `
**${comp.name}**
- 优势: ${comp.strengths.join(', ')}
- 劣势: ${comp.weaknesses.join(', ')}
- 市场份额: ${comp.marketShare}
- 差异化策略: ${comp.differentiation}
`).join('\n')}

## 技术实现

### 系统架构
${report.technicalImplementation.architecture.overview}

### 技术栈
- **前端**: ${report.technicalImplementation.techStack.frontend.join(', ')}
- **后端**: ${report.technicalImplementation.techStack.backend.join(', ')}
- **数据库**: ${report.technicalImplementation.techStack.database.join(', ')}
- **AI/ML**: ${report.technicalImplementation.techStack.aiML.join(', ')}
- **部署**: ${report.technicalImplementation.techStack.deployment.join(', ')}

### 核心算法
${report.technicalImplementation.coreAlgorithms.map(algo => `
**${algo.name}**
- 目的: ${algo.purpose}
- 实现: ${algo.implementation}
- 替代方案: ${algo.alternatives.join(', ')}
`).join('\n')}

### 开发路线图
${report.technicalImplementation.developmentRoadmap.map(phase => `
**${phase.phase}** (${phase.duration})
- 交付物: ${phase.deliverables.join(', ')}
- 资源需求: ${phase.resources}
`).join('\n')}

## 商业模式

### 收入来源
${report.businessModel.revenueStreams.map(stream => `
**${stream.type}**: ${stream.description}
- 收入占比: ${stream.potential}
- 时间线: ${stream.timeline}
`).join('\n')}

### 定价策略
**模式**: ${report.businessModel.pricingStrategy.model}
**逻辑**: ${report.businessModel.pricingStrategy.rationale}

${report.businessModel.pricingStrategy.tiers.map(tier => `
**${tier.name}** - ${tier.price}
- 功能: ${tier.features.join(', ')}
- 目标: ${tier.targetSegment}
`).join('\n')}

### 获客策略
- **平均获客成本**: ${report.businessModel.customerAcquisition.cac}
- **用户生命周期价值**: ${report.businessModel.customerAcquisition.ltv}
- **回本周期**: ${report.businessModel.customerAcquisition.paybackPeriod}

### 财务预测
**第一年**: 收入 ${report.businessModel.financialProjections.year1.revenue}, 用户 ${report.businessModel.financialProjections.year1.users}
**第二年**: ${report.businessModel.financialProjections.year2.revenue}
**第三年**: 收入 ${report.businessModel.financialProjections.year3.revenue}, 用户 ${report.businessModel.financialProjections.year3.users}

## 风险评估

### 技术风险
${report.riskAssessment.technicalRisks.map(risk => `
**${risk.risk}** (概率: ${risk.probability}, 影响: ${risk.impact})
${risk.description}
`).join('\n')}

### 市场风险
${report.riskAssessment.marketRisks.map(risk => `
**${risk.risk}** (概率: ${risk.probability}, 影响: ${risk.impact})
${risk.description}
`).join('\n')}

### 缓解策略
${report.riskAssessment.mitigationStrategies.map(strategy => `
**针对**: ${strategy.risk}
**策略**: ${strategy.strategy}
**时间线**: ${strategy.timeline}
**资源**: ${strategy.resources}
`).join('\n')}

## 快速启动指南

${report.quickStartKit.setupGuide}

## 代码模板

### MVP框架
语言: ${report.codeTemplates.mvpFramework.language}
依赖: ${report.codeTemplates.mvpFramework.dependencies.join(', ')}

### API设计
${report.codeTemplates.apiDesign.description}

### 数据库设计
${report.codeTemplates.databaseSchema.description}

## 总结

${report.title}具有巨大的市场潜力和技术可行性。通过精心的执行和持续的优化，该项目有望在${report.executiveSummary.timeToMarket}内实现市场突破，并在3年内达到${report.executiveSummary.expectedROI}的投资回报。

---

*本报告包含详细的技术实现方案、可执行代码模板、完整的商业计划和风险评估。购买包含PDF下载和快速启动工具包。*
`;
  }

  // 按指定HTML风格生成可打印报告（Tailwind + CDN，便于浏览器另存为PDF）
  generateHTMLReport(projectId: string): string {
    const report = this.getReport(projectId);
    if (!report) return '';

    const title = `${report.title}：战略机会深度分析`;
    const heroTitleMain = report.title.split('(')[0] || report.title;

    return `<!DOCTYPE html><html lang="zh-CN"><head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    body{font-family:Inter,ui-sans-serif,system-ui}
    .hero-gradient{background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 50%,#4a4a4a 100%)}
    .text-gradient{background:linear-gradient(135deg,#10b981,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  </style>
</head>
<body class="bg-gray-50">
  <header class="hero-gradient text-white py-12">
    <div class="max-w-6xl mx-auto px-6">
      <h1 class="font-serif text-4xl md:text-5xl font-bold mb-3">${heroTitleMain}</h1>
      <p class="text-gray-300">${report.executiveSummary.projectOverview}</p>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-6 py-10 space-y-10">
    <section>
      <h2 class="font-serif text-2xl font-semibold text-gray-900 mb-4">执行摘要</h2>
      <div class="grid md:grid-cols-2 gap-6 bg-white rounded-xl p-6 shadow">
        <div>
          <p class="text-gray-700 mb-3"><strong>关键机会：</strong>${report.executiveSummary.keyOpportunity}</p>
          <p class="text-gray-700 mb-3"><strong>市场规模：</strong>${report.executiveSummary.marketSize}</p>
          <p class="text-gray-700"><strong>收入预测：</strong>${report.executiveSummary.revenueProjection}</p>
        </div>
        <div>
          <p class="text-gray-700 mb-3"><strong>投资需求：</strong>${report.executiveSummary.investmentRequired}</p>
          <p class="text-gray-700 mb-3"><strong>预期回报：</strong>${report.executiveSummary.expectedROI}</p>
          <ul class="text-gray-700 list-disc ml-5">
            ${report.executiveSummary.keySuccessFactors.map(f=>`<li>${f}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-serif text-2xl font-semibold text-gray-900 mb-4">市场分析</h2>
      <div class="bg-white rounded-xl p-6 shadow space-y-4">
        <p class="text-gray-700"><strong>TAM/SAM/SOM：</strong>${report.marketAnalysis.marketSize.tam}；${report.marketAnalysis.marketSize.sam}；${report.marketAnalysis.marketSize.som}</p>
        <div>
          <h3 class="font-medium mb-2">市场趋势</h3>
          <ul class="list-disc ml-5 text-gray-700">
            ${report.marketAnalysis.marketTrends.map(t=>`<li>${t}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-serif text-2xl font-semibold text-gray-900 mb-4">技术实现</h2>
      <div class="bg-white rounded-xl p-6 shadow space-y-4">
        <p class="text-gray-700">${report.technicalImplementation.architecture.overview}</p>
        <p class="text-gray-700"><strong>技术栈：</strong>${report.technicalImplementation.techStack.frontend.join(', ')} · ${report.technicalImplementation.techStack.backend.join(', ')} · ${report.technicalImplementation.techStack.aiML.join(', ')}</p>
        <div>
          <h3 class="font-medium mb-2">核心算法</h3>
          <ul class="list-disc ml-5 text-gray-700">
            ${report.technicalImplementation.coreAlgorithms.map(a=>`<li>${a.name}：${a.purpose}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-serif text-2xl font-semibold text-gray-900 mb-4">商业模式</h2>
      <div class="bg-white rounded-xl p-6 shadow space-y-4">
        <div>
          <h3 class="font-medium mb-2">收入来源</h3>
          <ul class="list-disc ml-5 text-gray-700">
            ${report.businessModel.revenueStreams.map(s=>`<li>${s.type}：${s.description}（${s.timeline}）</li>`).join('')}
          </ul>
        </div>
        <p class="text-gray-700"><strong>定价：</strong>${report.businessModel.pricingStrategy.model}；${report.businessModel.pricingStrategy.rationale}</p>
      </div>
    </section>

    <section>
      <h2 class="font-serif text-2xl font-semibold text-gray-900 mb-4">风险评估</h2>
      <div class="bg-white rounded-xl p-6 shadow space-y-2">
        ${report.riskAssessment.technicalRisks.slice(0,2).map(r=>`<p class='text-gray-700'>• ${r.risk}（${r.probability}/${r.impact}）</p>`).join('')}
      </div>
    </section>
  </main>

  <footer class="text-center text-xs text-gray-500 py-8">由 DeepNeed 自动生成 · 浏览器可直接打印为 PDF</footer>
</body></html>`;
  }

  /**
   * 生成“深度版”HTML报告
   * - 包含更完整的商业、技术与市场章节
   * - 带目录、指标卡片、表格、时间线和附录
   * - 仍使用 Tailwind CDN 便于直接打印为 PDF
   */
  generateHTMLReportDeep(projectId: string): string {
    const report = this.getReport(projectId);
    if (!report) return '';

    const pageTitle = `${report.title}｜深度商业计划与技术白皮书`;
    const baseTitle = report.title.split('(')[0] || report.title;

    const pricingTableRows = report.businessModel.pricingStrategy.tiers
      .map(
        (t) => `
          <tr class="border-b border-gray-100">
            <td class="p-3 font-medium text-gray-800">${t.name}</td>
            <td class="p-3 text-gray-700">${t.price}</td>
            <td class="p-3 text-gray-700">${t.features.join('、')}</td>
            <td class="p-3 text-gray-700">${t.targetSegment}</td>
          </tr>`
      )
      .join('');

    const competitorsRows = report.marketAnalysis.competitorAnalysis
      .map(
        (c) => `
          <tr class="border-b border-gray-100">
            <td class="p-3 font-medium text-gray-800">${c.name}</td>
            <td class="p-3 text-gray-700">${c.strengths.join('、')}</td>
            <td class="p-3 text-gray-700">${c.weaknesses.join('、')}</td>
            <td class="p-3 text-gray-700">${c.marketShare}</td>
            <td class="p-3 text-gray-700">${c.pricing}</td>
            <td class="p-3 text-gray-700">${c.differentiation}</td>
          </tr>`
      )
      .join('');

    const channelsRows = report.businessModel.customerAcquisition.channels
      .map(
        (ch) => `
          <tr class="border-b border-gray-100">
            <td class="p-3 font-medium text-gray-800">${ch.channel}</td>
            <td class="p-3 text-gray-700">${ch.cost}</td>
            <td class="p-3 text-gray-700">${ch.effectiveness}</td>
            <td class="p-3 text-gray-700">${ch.timeline}</td>
          </tr>`
      )
      .join('');

    const coreAlgos = report.technicalImplementation.coreAlgorithms
      .map(
        (a) => `
        <div class="bg-white rounded-lg p-4 border border-gray-100">
          <div class="font-semibold text-gray-900">${a.name}</div>
          <div class="text-gray-700 mt-1">目的：${a.purpose}</div>
          <div class="text-gray-700 mt-1">实现：${a.implementation}</div>
          <div class="text-gray-700 mt-1">替代方案：${a.alternatives.join('、')}</div>
        </div>`
      )
      .join('');

    const milestones = report.technicalImplementation.developmentRoadmap
      .map(
        (m, idx) => `
        <div class="relative pl-6">
          <div class="absolute left-0 top-2 w-3 h-3 rounded-full ${idx === 0 ? 'bg-emerald-500' : 'bg-gray-300'}"></div>
          <div class="font-medium text-gray-900">${m.phase}（${m.duration}）</div>
          <div class="text-gray-700">交付物：${m.deliverables.join('、')}</div>
          <div class="text-gray-700">资源：${m.resources}</div>
        </div>`
      )
      .join('');

    const technicalRisks = report.riskAssessment.technicalRisks
      .map(
        (r) => `<li class="mb-1">${r.risk}（概率：${r.probability}；影响：${r.impact}）— ${r.description}</li>`
      )
      .join('');

    const marketRisks = report.riskAssessment.marketRisks
      .map(
        (r) => `<li class="mb-1">${r.risk}（概率：${r.probability}；影响：${r.impact}）— ${r.description}</li>`
      )
      .join('');

    const mitigation = report.riskAssessment.mitigationStrategies
      .map(
        (m) => `<li class="mb-1"><span class="font-medium">${m.risk}</span>：${m.strategy}（时间线：${m.timeline}；资源：${m.resources}）</li>`
      )
      .join('');

    // 使用与 clothing-matcher.html 接近的深色专业模板
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${baseTitle} 深度报告</title>
  <meta name="description" content="${baseTitle} — 市场、产品、技术、商业化与实施路线的全景深度报告（HTML版）。" />
  <style>
    :root { --bg:#0b0c10; --panel:#121317; --panel-2:#151821; --text:#e8eef6; --muted:#a8b3c7; --accent:#40c4aa; --accent-2:#79a6ff; --danger:#ff6b6b; --ok:#4cd964; --warn:#ffb020; --code:#0e1116; }
    html,body { margin:0; padding:0; background:var(--bg); color:var(--text); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, PingFang SC, Noto Sans CJK SC, "Microsoft YaHei", sans-serif; line-height:1.6; }
    a { color: var(--accent-2); text-decoration: none; }
    a:hover { text-decoration: underline; }
    header { background: linear-gradient(135deg, rgba(64,196,170,.12), rgba(121,166,255,.12)); border-bottom:1px solid #20222a; }
    .wrap { max-width: 1080px; margin: 0 auto; padding: 32px 20px; }
    .title { font-size: 32px; font-weight: 800; letter-spacing: .3px; }
    .subtitle { color: var(--muted); margin-top: 4px; }
    .badges { margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap; }
    .badge { font-size: 12px; padding: 6px 10px; border-radius: 999px; background: #1a1d25; border:1px solid #20232c; color: var(--muted); }
    .badge.accent { color:#022; background: var(--accent); border-color: var(--accent); }
    .grid { display:grid; grid-template-columns: 1fr; gap: 16px; }
    @media (min-width: 960px) { .grid { grid-template-columns: 260px 1fr; } }
    nav.toc { position: sticky; top: 16px; align-self: start; background: var(--panel); border:1px solid #1f2230; border-radius: 14px; padding: 14px; }
    nav.toc h3 { margin: 6px 0 8px; font-size: 13px; letter-spacing:.5px; text-transform: uppercase; color:var(--muted); }
    nav.toc ul { list-style: none; margin:0; padding:0; }
    nav.toc li { margin: 8px 0; }
    nav.toc a { color: #cfe3ff; }
    section { background: var(--panel); border:1px solid #1f2230; border-radius: 14px; padding: 20px; margin-bottom: 18px; }
    section h2 { margin: 0 0 10px; font-size: 22px; }
    section h3 { margin-top: 18px; font-size: 18px; color: #d8e6ff; }
    .meta { display:flex; gap:12px; flex-wrap:wrap; color:var(--muted); font-size: 14px; }
    table { width:100%; border-collapse: collapse; background: var(--panel-2); border-radius: 10px; overflow: hidden; }
    th,td { padding:10px 12px; border-bottom:1px solid #232838; }
    th { text-align:left; color:#d6e4ff; background:#171a22; position:sticky; top:0; }
    .kpi { display:grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
    @media (min-width: 720px) { .kpi { grid-template-columns: repeat(4,1fr);} }
    .kpi .card { background: var(--panel-2); border:1px solid #232838; border-radius: 12px; padding:14px; }
    .kpi .num { font-size: 22px; font-weight: 700; }
    .muted { color: var(--muted); }
    .ok { color: var(--ok); }
    .warn { color: var(--warn); }
    .danger { color: var(--danger); }
    pre, code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    pre { background: var(--code); color:#cfe3ff; border:1px solid #1c212b; border-radius: 10px; padding: 14px; overflow:auto; }
    .callout { background: #10131a; border-left: 3px solid var(--accent); padding: 12px 14px; border-radius: 8px; }
    footer { color: var(--muted); text-align:center; padding: 24px; }
    @media print { header, nav.toc { display:none; } body { background: #fff; color:#000; } section { border: none; } }
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <div class="title">${baseTitle} 深度报告</div>
      <div class="subtitle">自动化生成 · 市场×产品×技术×商业化的全景报告</div>
      <div class="badges">
        <span class="badge accent">投资：${report.executiveSummary.investmentRequired}</span>
        <span class="badge">预期回报：${report.executiveSummary.expectedROI}</span>
        <span class="badge">上市时间：${report.executiveSummary.timeToMarket}</span>
        <span class="badge">TAM：${report.marketAnalysis.marketSize.tam}</span>
      </div>
    </div>
  </header>

  <main class="wrap grid">
    <nav class="toc">
      <h3>目录</h3>
      <ul>
        <li><a href="#exec">1. 执行摘要</a></li>
        <li><a href="#market">2. 市场分析</a></li>
        <li><a href="#solution">3. 产品方案与价值主张</a></li>
        <li><a href="#personas">4. 用户画像与场景</a></li>
        <li><a href="#scope">5. 功能范围（MVP → V2）</a></li>
        <li><a href="#tech">6. 技术方案与系统架构</a></li>
        <li><a href="#ai">7. AI/算法细节</a></li>
        <li><a href="#data">8. 数据与合规</a></li>
        <li><a href="#biz">9. 商业模式与定价</a></li>
        <li><a href="#gtm">10. 增长与GTM</a></li>
        <li><a href="#finance">11. 财务与指标</a></li>
        <li><a href="#risk">12. 风险与对策</a></li>
        <li><a href="#plan">13. 里程碑与排期</a></li>
        <li><a href="#appendix">附：规范与参考</a></li>
      </ul>
    </nav>

    <div>
      <section id="exec">
        <h2>1) 执行摘要</h2>
        <p>${report.executiveSummary.projectOverview}</p>
        <div class="kpi" style="margin-top:8px">
          <div class="card"><div class="muted">TAM</div><div class="num">${report.marketAnalysis.marketSize.tam}</div><div class="muted">总目标市场</div></div>
          <div class="card"><div class="muted">SAM</div><div class="num">${report.marketAnalysis.marketSize.sam}</div><div class="muted">可服务市场</div></div>
          <div class="card"><div class="muted">SOM</div><div class="num">${report.marketAnalysis.marketSize.som}</div><div class="muted">三年可获份额</div></div>
          <div class="card"><div class="muted">上市时间</div><div class="num">${report.executiveSummary.timeToMarket}</div><div class="muted">MVP→首发</div></div>
        </div>
        <div class="callout" style="margin-top:12px"><strong>关键机会：</strong>${report.executiveSummary.keyOpportunity}</div>
      </section>

      <section id="market">
        <h2>2) 市场分析</h2>
        <h3>2.1 趋势</h3>
        <ul>${report.marketAnalysis.marketTrends.map((t)=>`<li>${t}</li>`).join('')}</ul>
        <h3>2.2 竞争格局</h3>
        <div class="overflow-x-auto">
          <table>
            <thead><tr><th>竞争者</th><th>优势</th><th>劣势</th><th>份额</th><th>定价</th><th>差异化</th></tr></thead>
            <tbody>${competitorsRows}</tbody>
          </table>
        </div>
        <h3>2.3 用户与验证</h3>
        <div class="muted">主要：${report.marketAnalysis.targetAudience.primarySegment}；次要：${report.marketAnalysis.targetAudience.secondarySegment}</div>
        <div class="muted" style="margin-top:6px">调研：${report.marketAnalysis.marketValidation.surveyData}；专家：${report.marketAnalysis.marketValidation.expertInterviews}；试点：${report.marketAnalysis.marketValidation.pilotResults}</div>
      </section>

      <section id="solution">
        <h2>3) 产品方案与价值主张</h2>
        <p>围绕目标用户痛点，提供端到端体验：采集 → 分析/生成 → 呈现 → 转化。</p>
        <ul>
          ${report.businessModel.revenueStreams.map((s)=>`<li><strong>${s.type}</strong>：${s.description}</li>`).join('')}
        </ul>
      </section>

      <section id="personas">
        <h2>4) 用户画像与场景</h2>
        <p class="muted">示例用户：${report.marketAnalysis.targetAudience.userPersonas?.[0]?.name || '核心用户'}，需求与动机在不同渠道不同表达，需要以数据驱动的内容与功能策略。</p>
      </section>

      <section id="scope">
        <h2>5) 功能范围（MVP → V2）</h2>
        <h3>MVP</h3>
        <ul>${report.technicalImplementation.developmentRoadmap[0]?.deliverables.map?.(d=>`<li>${d}</li>`).join('') || '<li>核心闭环、基础模型、首版UI</li>'}</ul>
        <h3>V1/V2</h3>
        <ul>${report.technicalImplementation.developmentRoadmap.slice(1).map(p=>p.deliverables).flat().map(d=>`<li>${d}</li>`).join('')}</ul>
      </section>

      <section id="tech">
        <h2>6) 技术方案与系统架构</h2>
        <h3>6.1 架构</h3>
        <pre><code>${report.technicalImplementation.architecture.overview}\n\n数据流：${report.technicalImplementation.architecture.dataFlow}</code></pre>
        <h3>6.2 技术栈</h3>
        <table>
          <thead><tr><th>层</th><th>技术选型</th></tr></thead>
          <tbody>
            <tr><td>前端</td><td>${report.technicalImplementation.techStack.frontend.join(', ')}</td></tr>
            <tr><td>后端</td><td>${report.technicalImplementation.techStack.backend.join(', ')}</td></tr>
            <tr><td>数据库</td><td>${report.technicalImplementation.techStack.database.join(', ')}</td></tr>
            <tr><td>AI/ML</td><td>${report.technicalImplementation.techStack.aiML.join(', ')}</td></tr>
            <tr><td>部署</td><td>${report.technicalImplementation.techStack.deployment.join(', ')}</td></tr>
          </tbody>
        </table>
      </section>

      <section id="ai">
        <h2>7) AI/算法细节</h2>
        <div class="grid" style="grid-template-columns:1fr; gap:12px">${coreAlgos}</div>
      </section>

      <section id="data">
        <h2>8) 数据与合规</h2>
        <ul>${report.technicalImplementation.securityConsiderations.map((s)=>`<li>${s}</li>`).join('')}</ul>
      </section>

      <section id="biz">
        <h2>9) 商业模式与定价</h2>
        <div class="muted">定价策略：${report.businessModel.pricingStrategy.model}；逻辑：${report.businessModel.pricingStrategy.rationale}</div>
        <div class="overflow-x-auto" style="margin-top:8px">
          <table>
            <thead><tr><th>套餐</th><th>价格</th><th>功能</th><th>目标用户</th></tr></thead>
            <tbody>${pricingTableRows}</tbody>
          </table>
        </div>
      </section>

      <section id="gtm">
        <h2>10) 增长与GTM</h2>
        <div class="muted">CAC：${report.businessModel.customerAcquisition.cac}；LTV：${report.businessModel.customerAcquisition.ltv}；回本：${report.businessModel.customerAcquisition.paybackPeriod}</div>
        <div class="overflow-x-auto" style="margin-top:8px">
          <table>
            <thead><tr><th>渠道</th><th>成本</th><th>效果</th><th>时间线</th></tr></thead>
            <tbody>${channelsRows}</tbody>
          </table>
        </div>
      </section>

      <section id="finance">
        <h2>11) 财务与指标</h2>
        <div class="kpi">
          <div class="card"><div class="muted">首年收入</div><div class="num">${report.businessModel.financialProjections.year1.revenue}</div><div class="muted">中性假设</div></div>
          <div class="card"><div class="muted">第二年</div><div class="num">${report.businessModel.financialProjections.year2.revenue}</div><div class="muted">增长</div></div>
          <div class="card"><div class="muted">第三年</div><div class="num">${report.businessModel.financialProjections.year3.revenue}</div><div class="muted">规模化</div></div>
          <div class="card"><div class="muted">用户规模</div><div class="num ok">${report.businessModel.financialProjections.year1.users}</div><div class="muted">第一年</div></div>
        </div>
      </section>

      <section id="risk">
        <h2>12) 风险与对策</h2>
        <table>
          <thead><tr><th>风险</th><th>影响</th><th>对策</th></tr></thead>
          <tbody>
            ${report.riskAssessment.technicalRisks.map(r=>`<tr><td>${r.risk}</td><td>${r.description}</td><td>${report.riskAssessment.mitigationStrategies[0]?.strategy || '建立监控与回滚机制'}</td></tr>`).join('')}
          </tbody>
        </table>
      </section>

      <section id="plan">
        <h2>13) 里程碑与排期</h2>
        <table>
          <thead><tr><th>阶段</th><th>时长</th><th>交付</th></tr></thead>
          <tbody>
            ${report.technicalImplementation.developmentRoadmap.map(p=>`<tr><td>${p.phase}</td><td>${p.duration}</td><td>${p.deliverables.join('、')}</td></tr>`).join('')}
          </tbody>
        </table>
      </section>

      <section id="appendix">
        <h2>附：规范与参考</h2>
        <p class="muted">市场研究：${report.appendices.marketResearch}</p>
        <p class="muted">技术规格：${report.appendices.technicalSpecs}</p>
        <p class="muted">法律与合规：${report.appendices.legalConsiderations}</p>
        <pre><code>${report.quickStartKit.setupGuide.replace(/</g,'&lt;')}</code></pre>
      </section>

      <footer>
        <p>© DeepNeed — 自动生成深度报告（HTML）。可直接浏览器打印或导出 PDF。</p>
      </footer>
    </div>
  </main>
</body>
</html>`;
  }

  // 生成快速启动工具包内容
  generateQuickStartKit(projectId: string): any {
    const report = this.getReport(projectId);
    if (!report) return null;

    return {
      projectName: report.title,
      setupGuide: report.quickStartKit.setupGuide,
      configFiles: report.quickStartKit.configFiles,
      codeTemplates: {
        mvpFramework: report.codeTemplates.mvpFramework.code,
        apiDesign: report.codeTemplates.apiDesign.code,
        databaseSchema: report.codeTemplates.databaseSchema.code,
        deploymentScripts: report.codeTemplates.deploymentScripts.code
      },
      sampleData: report.quickStartKit.sampleData,
      testingFramework: report.quickStartKit.testingFramework,
      troubleshooting: report.quickStartKit.troubleshooting
    };
  }

  // 获取所有可用报告列表
  getAvailableReports(): { id: string; title: string }[] {
    return Array.from(this.reports.entries()).map(([id, report]) => ({
      id,
      title: report.title
    }));
  }

  /**
   * 生成 WebPPT 格式的商业计划书（无需外部库，纯 HTML/CSS/JS）
   */
  generateWebPPT(projectId: string): string {
    const r = this.getReport(projectId);
    if (!r) return '';
    const baseTitle = r.title.split('(')[0] || r.title;
    const pricingRows = r.businessModel.pricingStrategy.tiers
      .map(t => `<tr><td>${t.name}</td><td>${t.price}</td><td>${t.features.join('、')}</td><td>${t.targetSegment}</td></tr>`)
      .join('');
    const channels = r.businessModel.customerAcquisition.channels
      .map(ch => `<li><strong>${ch.channel}</strong> · 成本:${ch.cost} · 效果:${ch.effectiveness} · 时间线:${ch.timeline}</li>`)
      .join('');
    const algCards = r.technicalImplementation.coreAlgorithms
      .map(a => `<div class=card><div class=card-title>${a.name}</div><div>目的：${a.purpose}</div><div>实现：${a.implementation}</div><div>替代：${a.alternatives.join('、')}</div></div>`)
      .join('');

    // 派生指标
    const cac = r.businessModel.customerAcquisition.cac || '';
    const ltv = r.businessModel.customerAcquisition.ltv || '';
    const payback = r.businessModel.customerAcquisition.paybackPeriod || '';
    const year1Revenue = r.businessModel.financialProjections.year1.revenue;
    const tam = r.marketAnalysis.marketSize.tam;
    const som = r.marketAnalysis.marketSize.som;

    return `<!DOCTYPE html><html lang="zh-CN"><head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${baseTitle} · 商业计划书（WebPPT）</title>
  <style>
    :root{--bg:#111315;--panel:#121317;--text:#e8eef6;--muted:#a8b3c7;--brand:#FF4F5E;--brand2:#ff8a94;--accent:#79a6ff;}
    html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,PingFang SC,Noto Sans CJK SC,"Microsoft YaHei",sans-serif}
    .deck{position:relative;overflow:hidden;height:100vh}
    .slide{position:absolute;inset:0;padding:48px 64px;display:flex;flex-direction:column;justify-content:center;gap:18px;background:linear-gradient(180deg,#111315,#0d1016);opacity:0;transform:translateX(20%);transition:all .4s ease;border-top:1px solid #1a1f2b}
    .slide.active{opacity:1;transform:translateX(0)}
    .title{font-size:48px;font-weight:800;letter-spacing:.3px}
    .subtitle{color:var(--muted);font-size:18px}
    .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
    .card{background:#11141a;border:1px solid #1e2330;border-radius:14px;padding:16px}
    .card-title{font-weight:700;margin-bottom:6px}
    .muted{color:var(--muted)}
    table{width:100%;border-collapse:collapse;background:#0f1218;border:1px solid #1e2330;border-radius:12px;overflow:hidden}th,td{padding:10px 12px;border-bottom:1px solid #1f2430}th{text-align:left;color:#cfe3ff;background:#151925}
    .nav{position:fixed;bottom:14px;right:18px;color:#9fb4ff;font-size:12px}
    .badge{display:inline-block;margin-right:8px;padding:6px 10px;border-radius:999px;background:#1b1e27;border:1px solid #23283a;color:#b7c4de}
    .logo{position:fixed;top:16px;right:20px;opacity:.9}
    .toolbar{position:fixed;top:16px;left:20px;display:flex;gap:10px}
    .btn{background:#1b1e27;color:#cfe3ff;border:1px solid #23283a;border-radius:10px;padding:6px 10px;font-size:12px}
    .kpi{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .kpi .card .num{font-size:32px;font-weight:800;background:linear-gradient(135deg,var(--brand),var(--brand2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    @media (max-width: 960px){.grid{grid-template-columns:1fr}.kpi{grid-template-columns:1fr}}
    @media print{.nav,.toolbar{display:none}.slide{page-break-after:always;position:relative;transform:none;opacity:1}}
  </style>
</head><body>
  <svg class="logo" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/></svg>
  <div class="toolbar"><button class="btn" onclick="window.print()">下载 PDF</button><button class="btn" onclick="document.body.classList.toggle('light')">切换主题</button></div>
  <script id="data-config" type="application/json">${JSON.stringify({ project: r.title, tam, som, year1Revenue, cac, ltv, payback })}</script>
  <div class="deck">
    <section class="slide active">
      <div class="title">${baseTitle} — 商业计划书</div>
      <div class="subtitle">${r.executiveSummary.keyOpportunity}</div>
      <div>
        <span class="badge">日期：${new Date().toISOString().slice(0,10)}</span>
        <span class="badge">TAM：${tam}</span>
        <span class="badge">首年收入：${year1Revenue}</span>
      </div>
    </section>

    <section class="slide">
      <div class="title">执行摘要</div>
      <div class="kpi">
        <div class="card"><div class="muted">TAM</div><div class="num" data-counter="${tam}">${tam}</div><div class="muted">可达市场</div></div>
        <div class="card"><div class="muted">SOM</div><div class="num" data-counter="${som}">${som}</div><div class="muted">三年份额</div></div>
        <div class="card"><div class="muted">首年收入</div><div class="num" data-counter="${year1Revenue}">${year1Revenue}</div><div class="muted">中性假设</div></div>
      </div>
      <div class="grid" style="margin-top:14px">
        <div class="card"><div class="card-title">3 大痛点</div><ul class="muted"><li>选择困难 / 个性化不足</li><li>试穿成本高 / 无法验证</li><li>闭环弱 / 复用率低</li></ul></div>
        <div class="card"><div class="card-title">3 大方案</div><ul class="muted"><li>衣橱数字化与风格画像</li><li>AR 快速试穿</li><li>缺口补齐与一键购齐</li></ul></div>
      </div>
    </section>

    <section class="slide">
      <div class="title">市场分析（TAM/SAM/SOM）</div>
      <table><thead><tr><th>层级</th><th>规模</th><th>说明</th></tr></thead>
      <tbody>
        <tr><td>TAM</td><td>${r.marketAnalysis.marketSize.tam}</td><td>总体可达市场</td></tr>
        <tr><td>SAM</td><td>${r.marketAnalysis.marketSize.sam}</td><td>可服务市场</td></tr>
        <tr><td>SOM</td><td>${r.marketAnalysis.marketSize.som}</td><td>3年可获份额</td></tr>
      </tbody></table>
      <div class="muted">趋势：${r.marketAnalysis.marketTrends.join('、')}</div>
    </section>

    <section class="slide">
      <div class="title">Why Now</div>
      <div class="grid"><div class="card"><div class="card-title">时机</div><ul class="muted">${r.marketAnalysis.marketTrends.map(t=>`<li>${t}</li>`).join('')}</ul></div><div class="card"><div class="card-title">机会</div><div class="muted">移动端 AR 成熟、生成式风格迁移与衣橱资产化趋势叠加，决策前置至个性化搭配</div></div></div>
    </section>

    <section class="slide">
      <div class="title">竞品雷达与定位</div>
      <div class="grid">
        <div class="card"><div class="card-title">四象限</div><div class="muted">内容社区 / 平台生态 / 解决方案 / 一体化闭环（示意）</div></div>
        <div class="card"><div class="card-title">差距与超越</div><ul class="muted"><li>个性化与可解释</li><li>AR 体验稳定性</li><li>电商闭环效率</li></ul></div>
      </div>
    </section>

    <section class="slide">
      <div class="title">产品价值与方案</div>
      <div class="muted">用户：${r.marketAnalysis.targetAudience.primarySegment}（次要：${r.marketAnalysis.targetAudience.secondarySegment}）</div>
      <div class="card"><div class="card-title">价值主张</div>围绕“记录/分析/呈现/转化”的端到端体验，强调可解释性与闭环</div>
    </section>

    <section class="slide">
      <div class="title">技术与架构</div>
      <div class="card"><div class="card-title">架构概述</div>${r.technicalImplementation.architecture.overview}</div>
      <div class="muted">数据流：${r.technicalImplementation.architecture.dataFlow}</div>
      <div class="grid">${algCards}</div>
    </section>

    <section class="slide">
      <div class="title">商业模式与定价</div>
      <table><thead><tr><th>套餐</th><th>价格</th><th>功能</th><th>目标用户</th></tr></thead><tbody>${pricingRows}</tbody></table>
      <div class="muted">收入来源：${r.businessModel.revenueStreams.map(s => s.type).join('、')}；定价逻辑：${r.businessModel.pricingStrategy.rationale}</div>
    </section>

    <section class="slide">
      <div class="title">GTM 与增长</div>
      <ul>${channels}</ul>
      <div class="muted">CAC：${r.businessModel.customerAcquisition.cac}；LTV：${r.businessModel.customerAcquisition.ltv}；回本：${r.businessModel.customerAcquisition.paybackPeriod}</div>
    </section>

    <section class="slide">
      <div class="title">Unit Economics</div>
      <table><thead><tr><th>指标</th><th>口径</th><th>区间/值</th></tr></thead><tbody>
        <tr><td>CAC</td><td>获客成本</td><td>${cac}</td></tr>
        <tr><td>LTV</td><td>生命周期价值</td><td>${ltv}</td></tr>
        <tr><td>回本周期</td><td>月</td><td>${payback}</td></tr>
      </tbody></table>
      <div class="muted">假设：转化率、流失率、佣金比例、AR 体验提升带来的 GMV 拉动等</div>
    </section>

    <section class="slide">
      <div class="title">财务指标（概览）</div>
      <div class="grid">
        <div class="card"><div class="card-title">Year1</div>收入 ${r.businessModel.financialProjections.year1.revenue}｜用户 ${r.businessModel.financialProjections.year1.users}</div>
        <div class="card"><div class="card-title">Year2</div>${r.businessModel.financialProjections.year2.revenue}</div>
        <div class="card"><div class="card-title">Year3</div>${r.businessModel.financialProjections.year3.revenue}</div>
        <div class="card"><div class="card-title">假设</div><div class="muted">${r.businessModel.financialProjections.assumptions.join('、')}</div></div>
      </div>
    </section>

    <section class="slide">
      <div class="title">路线图与风险</div>
      <div class="grid">
        <div class="card"><div class="card-title">路线图</div>${r.technicalImplementation.developmentRoadmap.map(p => `${p.phase}（${p.duration}）：${p.deliverables.join('、')}`).join('<br/>')}</div>
        <div class="card"><div class="card-title">主要风险</div><div class="muted">${r.riskAssessment.technicalRisks.map(x => x.risk).slice(0, 3).join('、')}</div></div>
      </div>
    </section>

    <section class="slide">
      <div class="title">融资与用途</div>
      <div class="grid">
        <div class="card"><div class="card-title">本轮规模</div><div class="num" data-counter="${r.businessModel.fundingStrategy.stages[0]?.amount || '$750k'}">${r.businessModel.fundingStrategy.stages[0]?.amount || '$750k'}</div></div>
        <div class="card"><div class="card-title">资金用途</div><div class="muted">${r.businessModel.fundingStrategy.useOfFunds.join('、')}</div></div>
      </div>
    </section>

    <section class="slide">
      <div class="title" style="color:var(--brand)">Exit & 回报</div>
      <div class="grid">
        <div class="card"><div class="card-title">潜在退出</div><ul class="muted"><li>被平台/品牌并购</li><li>API 生态整合</li><li>并表后规模化</li></ul></div>
        <div class="card"><div class="card-title">回报口径</div><div class="muted">目标 5×，基于三年收入与利润率区间的敏感性分析</div></div>
      </div>
    </section>

    <section class="slide">
      <div class="title" style="color:var(--brand)">Call‑to‑Action</div>
      <div class="subtitle">欢迎联系获取 Demo 与数据室访问</div>
      <div class="muted">Email: hello@deepneed.com · WeChat: deepneed</div>
    </section>
  </div>
  <div class="nav">←/→ 或 空格 切换页面</div>
  <script>
    (function(){
      const slides=[...document.querySelectorAll('.slide')];
      let i=0;
      const show=(n)=>{slides.forEach((s,idx)=>s.classList.toggle('active',idx===n));};
      const next=()=>{i=Math.min(slides.length-1,i+1);show(i)};
      const prev=()=>{i=Math.max(0,i-1);show(i)};
      addEventListener('keydown',e=>{if(['ArrowRight','PageDown',' '].includes(e.key)) next(); if(['ArrowLeft','PageUp'].includes(e.key)) prev();});
      addEventListener('click',next);
      show(0);

      // 动态计数器
      const ease=t=>1-Math.pow(1-t,2);
      document.querySelectorAll('[data-counter]').forEach(el=>{
        const targetStr=String(el.getAttribute('data-counter')||'');
        const m=targetStr.match(/([\d\.]+)/);
        const isMoney=targetStr.trim().startsWith('$');
        const end=m?parseFloat(m[1]):0; let cur=0; const dur=2000; const start=performance.now();
        const step=(now)=>{const p=Math.min(1,(now-start)/dur);cur=end*ease(p); el.textContent=(isMoney?'$':'')+ (end>=10?cur.toFixed(0):cur.toFixed(1)); if(p<1) requestAnimationFrame(step); else el.textContent=targetStr};
        requestAnimationFrame(step);
      });
    })();
  </script>
</body></html>`;
  }

  /**
   * 生成世界级专业 WebPPT（Reveal.js）- 顶级设计师标准
   * 特点：精致排版、专业字体系统、高级视觉层级、品牌一致性
   */
  generateWebPPTReveal(projectId: string): string {
    const r = this.getReport(projectId);
    if (!r) return '';
    const title = r.title.split('(')[0] || r.title;

    // 组装常用片段
    const kpi = `
      <div class="kpi">
        <div class="card"><div class="muted">TAM</div><div class="n">${r.marketAnalysis.marketSize.tam}</div><div class="muted">可达市场</div></div>
        <div class="card"><div class="muted">SOM</div><div class="n">${r.marketAnalysis.marketSize.som}</div><div class="muted">三年可获份额</div></div>
        <div class="card"><div class="muted">首年收入(估)</div><div class="n">${r.businessModel.financialProjections.year1.revenue}</div><div class="muted">中性</div></div>
        <div class="card"><div class="muted">上市时间</div><div class="n">${r.executiveSummary.timeToMarket}</div><div class="muted">MVP→首发</div></div>
      </div>`;

    const pains = (r.marketAnalysis.marketTrends[0] ? [
      '选择困难：衣柜丰富但不会搭，耗时低效',
      '场景复杂：天气/场合/心情变量多，决策成本高',
      '线上退货率高：买前不可视，买后不合适',
      '衣橱利用率低：20% 常穿，80% 闲置'
    ] : []).map(p=>`<li>${p}</li>`).join('');

    const trends = r.marketAnalysis.marketTrends.map(t=>`<span class="pill">${t}</span>`).join('');

    const stack = `
      <div class="stack">
        <div class="cell"><strong>视觉识别</strong><br><span class="muted">分割/属性/版型</span></div>
        <div class="cell"><strong>搭配引擎</strong><br><span class="muted">规则 × 学习 × 生成</span></div>
        <div class="cell"><strong>AR 试穿</strong><br><span class="muted">2D→3D→高拟真</span></div>
      </div>`;

    const pricingRows = r.businessModel.pricingStrategy.tiers
      .map(t=>`<tr><td>${t.name}</td><td>${t.price}</td><td>${t.features.join('、')}</td><td>${t.targetSegment}</td></tr>`).join('');

    const channels = r.businessModel.customerAcquisition.channels
      .map(c=>`<li class="pill">${c.channel} · ${c.cost} · ${c.effectiveness} · ${c.timeline}</li>`).join('');

    const assumptions = r.businessModel.financialProjections.assumptions
      .map(a=>`<li>${a}</li>`).join('');

    return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${r.title}｜商业计划书（WebPPT）</title>
  <meta name="description" content="面向投资人与加速器的${r.title} BP（≤20页）— WebPPT 版本" />
  <link rel="stylesheet" href="https://unpkg.com/reveal.js@5/dist/reset.css">
  <link rel="stylesheet" href="https://unpkg.com/reveal.js@5/dist/reveal.css">
  <link rel="stylesheet" href="https://unpkg.com/reveal.js@5/dist/theme/black.css" id="theme">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* 世界级设计系统 - 专业字体与配色 */
    :root {
      /* 品牌色彩 */
      --brand-primary: #10B981;
      --brand-secondary: #059669;
      --brand-accent: #8B5CF6;
      --brand-gradient: linear-gradient(135deg, #10B981 0%, #059669 25%, #8B5CF6 100%);
      
      /* 文字色彩 */
      --text-primary: #FFFFFF;
      --text-secondary: #E2E8F0;
      --text-muted: #94A3B8;
      --text-brand: #10B981;
      
      /* 背景层级 */
      --bg-primary: #0F172A;
      --bg-glass: rgba(255, 255, 255, 0.05);
      --bg-glass-hover: rgba(255, 255, 255, 0.08);
      
      /* 字体系统 */
      --font-sans: 'Inter', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
      
      /* 尺寸系统 */
      --text-sm: 0.875rem;
      --text-base: 1rem;
      --text-lg: 1.125rem;
      --text-xl: 1.25rem;
      --text-2xl: 1.5rem;
      --text-3xl: 1.875rem;
      --text-4xl: 2.25rem;
      --text-5xl: 3rem;
      --text-6xl: 3.75rem;
      
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-5: 1.25rem;
      --space-6: 1.5rem;
      --space-8: 2rem;
      --space-16: 4rem;
      
      --radius-lg: 12px;
      --radius-xl: 16px;
      --radius-2xl: 20px;
      --radius-full: 9999px;
      
      --shadow-md: 0 8px 16px rgba(0, 0, 0, 0.15);
      --shadow-lg: 0 16px 32px rgba(0, 0, 0, 0.2);
      --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.25);
    }

    .reveal {
      font-family: var(--font-sans);
      font-size: var(--text-lg);
      font-weight: 400;
      line-height: 1.6;
      color: var(--text-primary);
      background: 
        radial-gradient(ellipse 1200px 800px at 20% 10%, rgba(139, 92, 246, 0.15), transparent),
        radial-gradient(ellipse 1000px 600px at 80% 90%, rgba(16, 185, 129, 0.12), transparent),
        var(--bg-primary);
      letter-spacing: -0.01em;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    .reveal .slides section {
      /* 固定尺寸确保一致性 */
      width: 1200px !important;
      height: 675px !important;
      max-width: none !important;
      min-height: none !important;
      
      /* 完全居中 */
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%) !important;
      margin: 0 !important;
      
      text-align: left;
      padding: var(--space-16);
      background: var(--bg-glass);
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      box-sizing: border-box;
    }

    .reveal .slides section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--brand-gradient);
      opacity: 0.8;
    }

    .reveal h1 {
      font-size: var(--text-6xl);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.025em;
      color: var(--text-primary);
      background: var(--brand-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--space-8);
    }

    .reveal h2 {
      font-size: var(--text-4xl);
      font-weight: 800;
      line-height: 1.2;
      letter-spacing: -0.02em;
      color: var(--text-brand);
      margin-bottom: var(--space-6);
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .reveal h2::before {
      content: '';
      width: 4px;
      height: 32px;
      background: var(--brand-gradient);
      border-radius: 2px;
      flex-shrink: 0;
    }

    .reveal h3 {
      font-size: var(--text-2xl);
      font-weight: 700;
      line-height: 1.3;
      letter-spacing: -0.015em;
      color: var(--text-secondary);
      margin-bottom: var(--space-5);
    }

    .reveal p {
      font-size: var(--text-lg);
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
    }

    .reveal li {
      font-size: var(--text-base);
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: var(--space-3);
      padding-left: var(--space-2);
    }
    /* 高级组件系统 */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: 600;
      letter-spacing: 0.025em;
      margin-right: var(--space-3);
      background: var(--bg-glass);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      transition: all 250ms ease;
    }

    .brand { color: var(--text-brand); }
    .muted { color: var(--text-muted); }

    .kpi {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-5);
      margin: var(--space-8) 0;
    }

    .kpi .card {
      background: var(--bg-glass);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      backdrop-filter: blur(12px);
      box-shadow: var(--shadow-md);
      position: relative;
      overflow: hidden;
      transition: all 250ms ease;
    }

    .kpi .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--brand-gradient);
      opacity: 0.6;
    }

    .kpi .card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: rgba(255, 255, 255, 0.25);
    }

    .kpi .card .n {
      font-size: var(--text-3xl);
      font-weight: 900;
      color: var(--text-primary);
      margin: var(--space-2) 0;
      font-feature-settings: 'tnum' on, 'lnum' on;
    }

    .kpi .card .muted {
      font-size: var(--text-sm);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stack {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--space-4);
      margin: var(--space-8) 0;
    }

    .stack .cell {
      background: var(--bg-glass);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      text-align: center;
      backdrop-filter: blur(8px);
      transition: all 250ms ease;
    }

    .stack .cell:hover {
      background: var(--bg-glass-hover);
      transform: translateY(-2px);
    }

    .stack .cell strong {
      font-weight: 700;
      color: var(--text-primary);
      display: block;
      margin-bottom: var(--space-2);
    }

    .grid2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-8);
      margin: var(--space-8) 0;
    }

    .grid3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-6);
      margin: var(--space-8) 0;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(139, 92, 246, 0.15));
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #C4FFD8;
      font-size: var(--text-sm);
      font-weight: 500;
      margin: var(--space-1) var(--space-2);
      backdrop-filter: blur(4px);
      transition: all 150ms ease;
    }

    .pill:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .callout {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(139, 92, 246, 0.08));
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-left: 4px solid var(--brand-primary);
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      backdrop-filter: blur(8px);
      margin: var(--space-6) 0;
      position: relative;
    }

    .callout::before {
      content: '';
      position: absolute;
      top: var(--space-4);
      left: var(--space-4);
      width: 6px;
      height: 6px;
      background: var(--brand-primary);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--brand-primary);
    }

    .timeline {
      list-style: none;
      padding: 0;
      position: relative;
      margin-left: var(--space-6);
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: calc(-1 * var(--space-6));
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--brand-gradient);
      border-radius: 2px;
    }

    .timeline li {
      margin: var(--space-5) 0;
      padding: var(--space-4) var(--space-5);
      background: var(--bg-glass);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-lg);
      backdrop-filter: blur(6px);
      position: relative;
      transition: all 250ms ease;
    }

    .timeline li::before {
      content: '';
      position: absolute;
      left: calc(-1 * var(--space-6) - 6px);
      top: var(--space-5);
      width: 12px;
      height: 12px;
      background: var(--brand-primary);
      border: 3px solid var(--bg-primary);
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    }

    .timeline li:hover {
      background: var(--bg-glass-hover);
      transform: translateX(var(--space-2));
    }
    .toolbar {
      position: fixed;
      right: var(--space-4);
      top: var(--space-4);
      z-index: 1000;
      display: flex;
      gap: var(--space-2);
      background: var(--bg-glass);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-lg);
      padding: var(--space-2);
    }

    .toolbtn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 150ms ease;
    }

    .toolbtn:hover {
      background: var(--bg-glass-hover);
      border-color: rgba(255, 255, 255, 0.15);
      transform: scale(1.05);
    }

    .toolbtn svg {
      width: 18px;
      height: 18px;
      fill: var(--text-secondary);
    }

    .footer-bar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-muted);
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(12px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 999;
    }

    .footer-bar a {
      color: var(--text-brand);
      text-decoration: none;
      margin-left: var(--space-2);
      transition: color 150ms ease;
    }

    .footer-bar a:hover {
      color: var(--brand-secondary);
    }

    /* Reveal.js 控件样式覆盖 */
    .reveal .controls {
      bottom: 30px;
      right: 30px;
    }
    
    .reveal .controls button {
      color: var(--brand-primary) !important;
      opacity: 0.9;
      transition: all 250ms ease;
      width: 48px;
      height: 48px;
      border: 2px solid var(--brand-primary);
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.1);
      backdrop-filter: blur(8px);
    }

    .reveal .controls button:hover {
      opacity: 1;
      transform: scale(1.15);
      background: rgba(16, 185, 129, 0.2);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .reveal .progress {
      background: rgba(255, 255, 255, 0.15);
      height: 4px;
      border-radius: 2px;
    }

    .reveal .progress span {
      background: var(--brand-gradient);
      border-radius: 2px;
    }

    /* 修复 Reveal.js 页面可见性问题 - 保持居中样式 */
    .reveal .slides section {
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      /* 保持之前设置的居中样式 */
    }
    
    .reveal .slides section.present {
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      z-index: 10 !important;
    }
    
    .reveal .slides section.past,
    .reveal .slides section.future {
      opacity: 0 !important;
      visibility: hidden !important;
      display: none !important;
    }
    
    /* 确保所有内容元素可见 */
    .reveal .slides section.present h1,
    .reveal .slides section.present h2,
    .reveal .slides section.present h3,
    .reveal .slides section.present p,
    .reveal .slides section.present li,
    .reveal .slides section.present div,
    .reveal .slides section.present span,
    .reveal .slides section.present table,
    .reveal .slides section.present ul,
    .reveal .slides section.present ol {
      opacity: 1 !important;
      visibility: visible !important;
    }

    /* 页面指示器 */
    .slide-indicator {
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .slide-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: all 200ms ease;
    }

    .slide-dot.active {
      background: var(--brand-primary);
      transform: scale(1.5);
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
    }

    .slide-dot:hover {
      background: var(--brand-primary);
      transform: scale(1.2);
    }

    /* 导航提示 */
    .nav-hint {
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 500;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      opacity: 0;
      transition: opacity 300ms ease;
      pointer-events: none;
    }

    .nav-hint.show {
      opacity: 0.9;
    }

    /* 表格样式 */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: var(--space-6) 0;
      background: var(--bg-glass);
      border-radius: var(--radius-lg);
      overflow: hidden;
      backdrop-filter: blur(8px);
    }

    th, td {
      padding: var(--space-4) var(--space-5);
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    th {
      background: rgba(16, 185, 129, 0.1);
      font-weight: 700;
      font-size: var(--text-sm);
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    td {
      font-size: var(--text-base);
      color: var(--text-secondary);
    }

    tr:hover {
      background: var(--bg-glass-hover);
    }

    /* 响应式设计 */
    @media (max-width: 1024px) {
      .reveal {
        font-size: var(--text-base);
      }
      
      .reveal h1 {
        font-size: var(--text-5xl);
      }
      
      .reveal h2 {
        font-size: var(--text-3xl);
      }
      
      .grid2, .grid3 {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }
      
      .kpi {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .reveal {
        font-size: var(--text-sm);
      }
      
      .reveal .slides section {
        padding: var(--space-8);
        margin: var(--space-3);
      }
      
      .reveal h1 {
        font-size: var(--text-4xl);
      }
      
      .reveal h2 {
        font-size: var(--text-2xl);
      }
      
      .kpi {
        grid-template-columns: 1fr;
      }
    }

    @media print {
      .toolbar, .footer-bar {
        display: none !important;
      }
      
      .reveal {
        background: white !important;
        color: black !important;
      }
      
      .reveal .slides section {
        background: white !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: none !important;
      }
      
      .reveal h1, .reveal h2, .reveal h3 {
        color: black !important;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="toolbtn" id="btn-theme" title="切换主题 (浅/深)"><svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"/></svg></button>
    <button class="toolbtn" id="btn-full" title="全屏"><svg viewBox="0 0 24 24"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z"/></svg></button>
    <button class="toolbtn" id="btn-pdf" title="导出为PDF"><svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1v5h5"/><path d="M8 13h6M8 17h8M8 9h4"/></svg></button>
  </div>

  <div class="reveal"><div class="slides">

    <section>
      <h1>${title}</h1>
      <p class="muted">${r.title.split('(')[1]?.replace(')','') || ''} · ${r.executiveSummary.keyOpportunity}</p>
      <p><span class="badge">难度：Hard</span><span class="badge">上市：${r.executiveSummary.timeToMarket}</span><span class="badge">预期收入：${r.businessModel.financialProjections.year1.revenue}/年</span></p>
      ${kpi}
    </section>

    <section>
      <h2>用户痛点 / 需求</h2>
      <ul>${pains}</ul>
      <div class="callout"><strong>机会：</strong>${r.executiveSummary.keyOpportunity}</div>
    </section>

    <section>
      <h2>产品解决方案（概览）</h2>
      <div class="grid2">
        <div>
          <ul>
            <li><strong>衣橱数字化：</strong>拍照上传 → 自动打标</li>
            <li><strong>即时搭配：</strong>按天气/场合/心情/体型生成建议</li>
            <li><strong>AR 试穿：</strong>单品/套装预览，提升决策信心</li>
            <li><strong>缺口补齐：</strong>智能清单 + 一键购齐</li>
          </ul>
        </div>
        <div>${stack}<p class="muted" style="margin-top:.6rem">KPI：点击→保存→AR→购买 的转化率持续优化。</p></div>
      </div>
    </section>

    <section>
      <h2>端到端体验流程</h2>
      <ol>
        <li>上传衣物照片 → 自动打标</li>
        <li>选择场景与约束（通勤/约会/温度/步行量…）</li>
        <li>生成搭配 + 理由 + 替代项</li>
        <li>AR 试穿 + 一键购齐 → 行为回流</li>
      </ol>
    </section>

    <section>
      <h2>Why Now</h2>
      <p>${trends}</p>
      <div class="callout">移动端 AR 成熟、生成式风格迁移与衣橱资产化趋势叠加，决策前置至个性化搭配。</div>
    </section>

    <section>
      <h2>技术护城河</h2>
      <ul>
        <li>多模态 CV + LLM：识别/解释/风格文案</li>
        <li>数据飞轮：采集→训练→上线→监控→回流</li>
        <li>AR 体验：2D→3D→高拟真；端边协同</li>
      </ul>
    </section>

    <section>
      <h2>竞品与定位</h2>
      <div class="grid2">
        <div class="callout">四象限：内容社区 / 平台生态 / 解决方案 / 一体化闭环（SVG 占位）</div>
        <div>
          <h3>差距与超越</h3>
          <ul class="muted"><li>个性化与可解释</li><li>AR 体验稳定性</li><li>电商闭环效率</li></ul>
        </div>
      </div>
    </section>

    <section>
      <h2>商业模式</h2>
      <table><thead><tr><th>套餐</th><th>价格</th><th>功能</th><th>目标用户</th></tr></thead><tbody>${pricingRows}</tbody></table>
    </section>

    <section>
      <h2>Unit Economics</h2>
      <ul>
        <li>CAC：${r.businessModel.customerAcquisition.cac}</li>
        <li>LTV：${r.businessModel.customerAcquisition.ltv}</li>
        <li>回本周期：${r.businessModel.customerAcquisition.paybackPeriod}</li>
      </ul>
      <h3>Assumptions</h3>
      <ul>${assumptions}</ul>
    </section>

    <section>
      <h2>GTM / 增长</h2>
      <p>${channels}</p>
    </section>

    <section>
      <h2>财务预测（3年）</h2>
      <ul>
        <li>Year1：收入 ${r.businessModel.financialProjections.year1.revenue}；用户 ${r.businessModel.financialProjections.year1.users}</li>
        <li>Year2：${r.businessModel.financialProjections.year2.revenue}</li>
        <li>Year3：${r.businessModel.financialProjections.year3.revenue}</li>
      </ul>
    </section>

    <section>
      <h2>融资与用途</h2>
      <p>本轮：${r.businessModel.fundingStrategy.stages[0]?.amount || '$750k'}；Runway：12–18 个月</p>
      <p>用途：${r.businessModel.fundingStrategy.useOfFunds.join('、')}</p>
    </section>

    <section>
      <h2>团队</h2>
      <div class="grid3">
        <div class="callout">联合创始人 A｜前 XXX 首席算法</div>
        <div class="callout">联合创始人 B｜前 XXX 产品负责人</div>
        <div class="callout">联合创始人 C｜两次创业退出</div>
      </div>
    </section>

    <section>
      <h2>里程碑</h2>
      <ul class="timeline">
        <li>14‑Day MVP：衣橱录入/基础搭配/电商跳转</li>
        <li>12‑Week 内测：AR 快速版/风格包/创作者计划</li>
        <li>6‑Month 商业化：B2B SDK/API 与品牌合作</li>
      </ul>
    </section>

    <section>
      <h2>风险与对策</h2>
      <ul>
        <li>识别/试穿效果不足 → 难例回流/AB/回滚</li>
        <li>渠道波动 → 多渠道矩阵/创作者计划</li>
        <li>素材供给不足 → 联盟与商家自助上架</li>
      </ul>
    </section>

    <section>
      <h2 class="brand">Call‑to‑Action</h2>
      <p class="muted">欢迎联系获取 Demo 与数据室访问</p>
      <p>Email: hello@deepneed.com · WeChat: deepneed</p>
    </section>

  </div></div>

  <!-- 页面指示器 -->
  <div class="slide-indicator" id="slide-indicator"></div>
  
  <!-- 导航提示 -->
  <div class="nav-hint" id="nav-hint">
    <span style="color: var(--brand-primary);">←</span> 
    <span style="color: var(--brand-primary);">→</span> 
    翻页 | 
    <span style="color: var(--brand-primary);">滚轮</span> 滚动 | 
    <span style="color: var(--brand-primary);">F</span> 全屏
  </div>

  <div class="footer-bar">© ${new Date().getFullYear()} DeepNeed · WebPPT（Reveal.js）· <a href="#" onclick="window.print()">导出 PDF</a></div>

  <script src="https://unpkg.com/reveal.js@5/dist/reveal.js"></script>
  <script src="https://unpkg.com/reveal.js@5/plugin/notes/notes.js"></script>
  <script src="https://unpkg.com/reveal.js@5/plugin/markdown/markdown.js"></script>
  <script src="https://unpkg.com/reveal.js@5/plugin/highlight/highlight.js"></script>
  <script>
    // 初始化 Reveal.js 配置
    const deck = new Reveal({
      // 基础配置
      hash: true,
      controls: true,
      progress: true,
      center: true,
      touch: true,
      loop: false,
      
      // 过渡效果
      transition: 'none',
      transitionSpeed: 'fast',
      backgroundTransition: 'none',
      
      // 视口配置 - 固定尺寸确保一致性
      width: 1280,
      height: 720,
      margin: 0,
      minScale: 0.5,
      maxScale: 1.5,
      
      // 导航配置
      keyboard: true,
      
      // 触摸手势
      touch: true,
      
      // 显示控制
      hideInactiveCursor: false,
      hideCursorTime: 5000,
      
      // 关键：禁用视差效果，避免内容被隐藏
      parallaxBackgroundImage: '',
      parallaxBackgroundSize: '',
      
      // 确保内容可见
      display: 'block'
    });
    
    // 初始化
    const plugins = [];
    if (window.RevealMarkdown) plugins.push(RevealMarkdown);
    if (window.RevealHighlight) plugins.push(RevealHighlight);
    if (window.RevealNotes) plugins.push(RevealNotes);

    deck.initialize({ plugins }).then(() => {
      console.log('Reveal.js initialized successfully');
      const totalSlides = deck.getTotalSlides();
      console.log('Total slides:', totalSlides);
      
      // 创建页面指示器
      const indicator = document.getElementById('slide-indicator');
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => deck.slide(i);
        dot.title = \`第 \${i + 1} 页\`;
        indicator.appendChild(dot);
      }
      
      // 显示导航提示
      const navHint = document.getElementById('nav-hint');
      navHint.classList.add('show');
      
      // 5秒后隐藏导航提示
      setTimeout(() => {
        navHint.classList.remove('show');
      }, 5000);
      
      // 页面切换时重新显示提示（仅前3次）
      let hintCount = 0;
      deck.on('slidechanged', () => {
        if (hintCount < 3) {
          navHint.classList.add('show');
          setTimeout(() => navHint.classList.remove('show'), 2000);
          hintCount++;
        }
      });
    });
    
    // 工具栏按钮事件
    document.getElementById('btn-full').onclick = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    };
    
    document.getElementById('btn-pdf').onclick = () => window.print();
    
    document.getElementById('btn-theme').onclick = () => {
      const root = document.documentElement;
      if (root.classList.contains('theme-light')) {
        root.classList.remove('theme-light');
      } else {
        root.classList.add('theme-light');
      }
    };
    
    // 添加滑动手势支持
    let startX = null;
    let startY = null;
    
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
      if (startX === null || startY === null) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = startX - endX;
      const deltaY = startY - endY;
      
      // 水平滑动优先
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > 50) { // 最小滑动距离
          if (deltaX > 0) {
            deck.next(); // 向左滑动，下一页
          } else {
            deck.prev(); // 向右滑动，上一页
          }
        }
      }
      
      startX = null;
      startY = null;
    });
    
    // 鼠标滚轮支持
    // 简化，避免与内部监听冲突
    // document.addEventListener('wheel', ... ) 移除交由 Reveal 内部处理
    
    // 更新页面指示器状态和强制显示当前页
    deck.on('slidechanged', (event) => {
      console.log('Slide changed:', event.indexh + 1, '/', deck.getTotalSlides());
      
      // 更新指示器状态
      const dots = document.querySelectorAll('.slide-dot');
      dots.forEach((dot, index) => {
        if (index === event.indexh) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      // 强制显示当前页内容
      setTimeout(() => {
        const currentSlide = document.querySelector('.reveal .slides section.present');
        if (currentSlide) {
          currentSlide.style.opacity = '1';
          currentSlide.style.visibility = 'visible';
          currentSlide.style.display = 'block';
          currentSlide.style.zIndex = '10';
          
          // 确保所有子元素也可见
          const elements = currentSlide.querySelectorAll('*');
          elements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
          });
        }
      }, 50);
    });
  </script>
</body>
</html>`;
  }
}

// 导出单例实例
export const reportGenerator = new PremiumReportGenerator();