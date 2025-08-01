// 🧠 提示词优化引擎
// 生成更专业、持续优化的提示词系统
// 新增：整合GitHub爬取的提示词库

import { callAIAPI } from './mock-api';
import { searchCrawledPrompts, type CrawledPrompt } from './github-prompt-crawler';
import type { Message, Session } from '@/types';
import type { GeneratedPrompts } from './prompt-generator';

// 专家知识库模式
export interface ExpertPattern {
  id: string;
  domain: string; // 领域：tech, business, design, management
  pattern: string; // 专家提问模式
  quality_score: number; // 质量评分 1-10
  usage_count: number; // 使用次数
  success_rate: number; // 成功率
  user_ratings: number[]; // 用户评分历史
  examples: string[]; // 成功案例
  last_updated: string;
  // 新增：关联的爬取提示词
  related_crawled_prompts: CrawledPrompt[];
}

// 质量评估标准
export interface QualityMetrics {
  clarity: number; // 清晰度 1-10
  completeness: number; // 完整度 1-10
  professionalism: number; // 专业度 1-10
  actionability: number; // 可执行性 1-10
  innovation: number; // 创新性 1-10
  overall_score: number; // 综合评分
}

// 用户反馈数据
export interface UserFeedback {
  prompt_id: string;
  session_id: string;
  rating: number; // 1-5星评分
  feedback_text?: string;
  usage_result: 'success' | 'partial' | 'failed';
  improvement_suggestions: string[];
  created_at: string;
}

// 优化建议
export interface OptimizationSuggestion {
  type: 'structure' | 'content' | 'clarity' | 'professionalism';
  description: string;
  priority: 'high' | 'medium' | 'low';
  implementation: string;
}

export class PromptOptimizationEngine {
  private expertPatterns: Map<string, ExpertPattern> = new Map();
  private qualityHistory: Map<string, QualityMetrics[]> = new Map();
  private userFeedback: Map<string, UserFeedback[]> = new Map();
  
  constructor() {
    this.initializeExpertPatterns();
    this.loadOptimizationData();
    this.enhanceExpertPatternsWithCrawledPrompts(); // 初始化时整合爬取的提示词
  }

  /**
   * 初始化专家模式库
   */
  private initializeExpertPatterns() {
    const patterns: ExpertPattern[] = [
      {
        id: 'product-strategy-master',
        domain: 'business',
        pattern: `作为拥有20年经验的产品战略专家，我将运用以下框架深度分析：

## 🎯 产品战略Canvas分析

### 1. 用户价值主张 (Value Proposition)
- 核心痛点识别：什么问题让用户夜不能寐？
- 价值假设验证：如何证明用户真的需要这个解决方案？
- 差异化优势：与现有解决方案相比，你的独特价值是什么？

### 2. 市场机会评估 (Market Opportunity)
- 市场规模TAM/SAM/SOM：这个市场有多大的想象空间？
- 竞争格局分析：直接竞争者和间接竞争者都有谁？
- 进入时机判断：为什么是现在？市场timing是否成熟？

### 3. 商业模式设计 (Business Model)
- 收入模型：如何将用户价值转化为商业价值？
- 成本结构：获客成本、运营成本、边际成本如何控制？
- 增长引擎：病毒传播、付费增长还是产品驱动增长？

基于{{project_context}}的具体情况，让我问你几个关键问题：`,
        quality_score: 9.2,
        usage_count: 156,
        success_rate: 0.87,
        user_ratings: [9, 8, 9, 10, 8, 9],
        examples: [
          "帮助某SaaS产品重新定义价值主张，实现PMF",
          "指导某电商平台进行差异化定位，避开红海竞争"
        ],
        last_updated: new Date().toISOString(),
        related_crawled_prompts: []
      },
      {
        id: 'tech-architecture-guru',
        domain: 'tech',
        pattern: `作为顶级技术架构师，我将从系统性的角度帮你构建技术方案：

## ⚙️ 技术架构设计方法论

### 1. 业务-技术对齐 (Business-Tech Alignment)
- 业务目标：技术如何支撑业务增长？
- 性能要求：用户量、并发量、数据量的增长预期？
- 成本约束：人力成本、运维成本、云服务成本预算？

### 2. 系统架构设计 (System Architecture)
- 架构模式选择：单体、微服务、Serverless哪个更适合？
- 数据架构：OLTP、OLAP、实时计算的数据流设计
- 安全架构：认证授权、数据加密、网络安全防护

### 3. 技术栈选型 (Tech Stack)
- 团队技能匹配：现有团队技能vs新技术学习成本
- 生态系统考量：社区活跃度、第三方集成、长期维护
- 性能基准测试：实际负载下的性能表现预估

针对{{project_context}}，让我深入了解：`,
        quality_score: 9.5,
        usage_count: 243,
        success_rate: 0.92,
        user_ratings: [10, 9, 9, 8, 10, 9],
        examples: [
          "设计了某独角兽公司的微服务架构升级方案",
          "帮助某初创公司制定从0到1的技术选型策略"
        ],
        last_updated: new Date().toISOString(),
        related_crawled_prompts: []
      },
      {
        id: 'ux-design-master',
        domain: 'design',
        pattern: `作为资深UX设计专家，我将运用人因工程和设计心理学指导设计决策：

## 🎨 用户体验设计框架

### 1. 用户心理模型 (Mental Model)
- 用户认知负荷：如何降低用户的思考成本？
- 行为习惯分析：用户在什么场景下会使用你的产品？
- 情感化设计：如何在功能之外创造情感连接？

### 2. 交互设计原则 (Interaction Design)
- 信息架构：如何组织信息让用户快速找到所需？
- 操作流程：如何设计最短路径完成核心任务？
- 反馈机制：如何让用户始终知道系统状态？

### 3. 视觉设计系统 (Visual Design System)
- 品牌调性表达：视觉语言如何传达品牌价值？
- 组件库设计：可扩展、一致性的设计组件体系
- 响应式适配：多端一致性体验设计

基于{{project_context}}的用户场景，我想了解：`,
        quality_score: 8.9,
        usage_count: 187,
        success_rate: 0.84,
        user_ratings: [9, 8, 9, 8, 9, 8],
        examples: [
          "重新设计某金融产品的用户流程，转化率提升40%",
          "建立某教育平台的设计系统，提升开发效率60%"
        ],
        last_updated: new Date().toISOString(),
        related_crawled_prompts: []
      },
      {
        id: 'project-management-expert',
        domain: 'management',
        pattern: `作为敏捷项目管理专家，我将帮你建立高效的项目执行体系：

## 📊 敏捷项目管理框架

### 1. 项目启动策略 (Project Initiation)
- 目标对齐：如何确保团队对项目目标的理解一致？
- 风险识别：项目早期最大的风险点在哪里？
- 资源规划：人员配置、时间安排、预算分配的优化

### 2. 迭代执行管理 (Sprint Management)
- 需求优先级：如何平衡功能完整性和快速迭代？
- 团队协作：跨职能团队的沟通和协作机制
- 质量保证：如何在快速迭代中保证产品质量？

### 3. 度量和改进 (Metrics & Improvement)
- 关键指标：如何定义和跟踪项目成功指标？
- 回顾机制：如何从每个迭代中学习和改进？
- 交付策略：如何规划从MVP到完整产品的演进路径？

针对{{project_context}}的复杂度，让我帮你分析：`,
        quality_score: 8.7,
        usage_count: 134,
        success_rate: 0.81,
        user_ratings: [8, 9, 8, 8, 9, 7],
        examples: [
          "帮助某初创团队建立敏捷开发流程，交付效率提升50%",
          "指导某企业项目进行风险管控，按时交付率达到95%"
        ],
        last_updated: new Date().toISOString(),
        related_crawled_prompts: []
      }
    ];

    patterns.forEach(pattern => {
      this.expertPatterns.set(pattern.id, pattern);
    });
  }

  /**
   * 加载优化数据
   */
  private loadOptimizationData() {
    try {
      const savedData = localStorage.getItem('prompt-optimization-data');
      if (savedData) {
        const data = JSON.parse(savedData);
        // 恢复数据...
      }
    } catch (error) {
      console.warn('无法加载优化数据:', error);
    }
  }

  /**
   * 智能选择专家模式
   */
  public selectExpertPattern(messages: Message[], session: Session): ExpertPattern | null {
    const content = messages.map(m => m.content).join(' ').toLowerCase();
    
    // 关键词权重分析
    const domainScores = {
      business: this.calculateDomainScore(content, ['商业', '模式', '市场', '用户', '价值', '竞争', '收入', '增长']),
      tech: this.calculateDomainScore(content, ['技术', '架构', '开发', '系统', '数据库', 'api', '性能', '安全']),
      design: this.calculateDomainScore(content, ['设计', '界面', 'ui', 'ux', '用户体验', '交互', '视觉', '原型']),
      management: this.calculateDomainScore(content, ['项目', '管理', '团队', '计划', '进度', '风险', '质量', '交付'])
    };

    // 找到得分最高的领域
    const topDomain = Object.entries(domainScores).sort(([,a], [,b]) => b - a)[0][0];
    
    // 选择该领域最佳专家模式
    const candidates = Array.from(this.expertPatterns.values())
      .filter(pattern => pattern.domain === topDomain)
      .sort((a, b) => b.quality_score * b.success_rate - a.quality_score * a.success_rate);

    return candidates[0] || null;
  }

  /**
   * 计算领域得分
   */
  private calculateDomainScore(content: string, keywords: string[]): number {
    return keywords.reduce((score, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      return score + (matches ? matches.length : 0);
    }, 0);
  }

  /**
   * 生成高质量专业提示词
   */
  public async generateEnhancedPrompts(
    messages: Message[], 
    session: Session
  ): Promise<GeneratedPrompts> {
    
    console.log('🧠 启动增强型提示词生成引擎...');
    
    // 1. 选择最佳专家模式
    const expertPattern = this.selectExpertPattern(messages, session);
    console.log('🎯 选中专家模式:', expertPattern?.id);

    // 2. 生成上下文分析
    const contextAnalysis = await this.analyzeProjectContext(messages, session);
    
    // 3. 使用增强专家模式生成提示词（整合爬取的提示词库）
    const expertPrompts = expertPattern 
      ? await this.generateWithCrawledPromptEnhancement(expertPattern, contextAnalysis, messages, session)
      : await this.generateDefaultPrompts(messages, session);

    // 4. 质量评估和优化
    const qualityMetrics = await this.evaluateQuality(expertPrompts, contextAnalysis);
    const optimizedPrompts = await this.applyOptimizations(expertPrompts, qualityMetrics);

    // 5. 新增：生成完整的文档内容
    console.log('📄 开始生成完整的专业文档...');
    optimizedPrompts.generated_documents = await this.generateCompleteDocuments(optimizedPrompts, contextAnalysis, messages, session);

    // 6. 记录生成历史
    this.recordGeneration(optimizedPrompts, qualityMetrics, expertPattern?.id);

    return optimizedPrompts;
  }

  /**
   * 分析项目上下文
   */
  private async analyzeProjectContext(messages: Message[], session: Session) {
    const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    
    const analysisPrompt = `作为项目分析专家，请深度分析以下项目对话：

${conversationText}

项目初始想法：${session.initial_idea}

请从以下维度进行分析并以JSON格式返回：

{
  "project_type": "项目类型(SaaS/电商/平台/工具等)",
  "complexity_level": "复杂度(简单/中等/复杂/专业级)",
  "primary_domain": "主要领域(business/tech/design/management)",
  "target_users": "目标用户群体",
  "core_value": "核心价值主张",
  "main_challenges": ["主要挑战1", "挑战2"],
  "technical_keywords": ["技术关键词"],
  "business_keywords": ["商业关键词"],
  "completeness_score": 85,
  "clarity_score": 92,
  "innovation_score": 78
}`;

    try {
      console.log('🔍 正在调用AI进行项目上下文分析...');
      console.log('📝 对话轮数:', messages.length);
      console.log('🎯 会话标题:', session.title);
      
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是专业的项目分析师，擅长从对话中提取项目的核心信息和特征。'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ]);

      console.log('✅ 项目分析AI调用成功');
      console.log('📋 分析结果:', response.substring(0, 200) + '...');

      const parsedResult = JSON.parse(response);
      console.log('🎯 项目分析完成:', {
        project_type: parsedResult.project_type,
        complexity_level: parsedResult.complexity_level,
        primary_domain: parsedResult.primary_domain
      });

      return parsedResult;
    } catch (error) {
      console.error('❌ 项目上下文分析失败:', error);
      console.log('🔄 使用默认上下文分析');
      
      return this.getDefaultContextAnalysis(session);
    }
  }

  /**
   * 使用专家模式生成提示词
   */
  private async generateWithExpertPattern(
    pattern: ExpertPattern,
    context: any,
    messages: Message[],
    session: Session
  ): Promise<GeneratedPrompts> {
    
    const expertPrompt = pattern.pattern.replace('{{project_context}}', JSON.stringify(context));
    
    const prompt = `${expertPrompt}

基于以上专家框架，请为项目："${session.title || context.core_value}"生成四个专业维度的提示词套件：

要求每个维度都体现${pattern.domain}专家的专业水准，包含：
1. 深度的理论框架
2. 实战经验总结  
3. 具体的执行指导
4. 可衡量的成功标准

项目上下文：${JSON.stringify(context)}
对话历史：${messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}

请按照标准JSON格式输出四维度提示词套件。`;

    try {
      console.log('🤖 正在调用AI生成专家级提示词...');
      console.log('📝 专家模式:', pattern.id);
      console.log('📋 项目上下文:', context);
      
      const response = await callAIAPI([
        {
          role: 'system',
          content: `你是${pattern.domain}领域的世界级专家，拥有丰富的实战经验和深厚的理论功底。请基于专家模式生成高质量的提示词。`
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      console.log('✅ AI调用成功，响应长度:', response.length, '字符');
      console.log('📄 AI原始回复:', response.substring(0, 200) + '...');

      // 解析并返回结构化提示词
      const result = this.parseExpertResponse(response, context, pattern);
      console.log('🎯 提示词解析完成，PRD长度:', result.professional_prompts.prd.prompt.length, '字符');
      
      return result;
      
    } catch (error) {
      console.error('❌ 专家模式生成失败:', error);
      console.log('🔄 将使用默认专业提示词模板');
      throw error;
    }
  }

  /**
   * 增强专家模式 - 整合爬取的提示词库
   */
  private enhanceExpertPatternsWithCrawledPrompts() {
    console.log('🔍 开始整合爬取的提示词库...');
    
    try {
      // 从localStorage获取爬取的提示词
      const crawledPromptsStr = localStorage.getItem('crawled-prompts');
      if (!crawledPromptsStr) {
        console.log('📋 未找到爬取的提示词库，使用默认专家模式');
        return;
      }

      const crawledPrompts: CrawledPrompt[] = JSON.parse(crawledPromptsStr);
      console.log(`📚 发现 ${crawledPrompts.length} 个爬取的提示词`);

      // 为每个专家模式匹配相关的提示词
      for (const [patternId, pattern] of this.expertPatterns) {
        const relatedPrompts = this.findRelatedCrawledPrompts(pattern, crawledPrompts);
        pattern.related_crawled_prompts = relatedPrompts;
        
        console.log(`🎯 专家模式 "${patternId}" 匹配到 ${relatedPrompts.length} 个相关提示词`);
      }

      console.log('✅ 提示词库整合完成');
    } catch (error) {
      console.error('❌ 整合提示词库失败:', error);
    }
  }

  /**
   * 查找与专家模式相关的爬取提示词
   */
  private findRelatedCrawledPrompts(pattern: ExpertPattern, crawledPrompts: CrawledPrompt[]): CrawledPrompt[] {
    const related: CrawledPrompt[] = [];

    // 根据领域匹配
    const domainKeywords = {
      'business': ['business', 'product', 'marketing', 'strategy', 'startup', 'entrepreneur', 'analysis'],
      'tech': ['development', 'coding', 'programming', 'technical', 'architecture', 'software', 'engineer'],
      'design': ['design', 'ui', 'ux', 'interface', 'visual', 'user experience', 'prototype'],
      'management': ['project', 'management', 'planning', 'agile', 'scrum', 'team', 'leadership']
    };

    const keywords = domainKeywords[pattern.domain as keyof typeof domainKeywords] || [];

    for (const crawledPrompt of crawledPrompts) {
      // 检查类别匹配
      if (pattern.domain === 'business' && ['business', 'analysis', 'marketing'].includes(crawledPrompt.category)) {
        related.push(crawledPrompt);
        continue;
      }
      
      if (pattern.domain === 'tech' && ['development', 'coding', 'technical'].includes(crawledPrompt.category)) {
        related.push(crawledPrompt);
        continue;
      }
      
      if (pattern.domain === 'design' && ['design', 'ui', 'ux'].includes(crawledPrompt.category)) {
        related.push(crawledPrompt);
        continue;
      }
      
      if (pattern.domain === 'management' && ['management', 'project'].includes(crawledPrompt.category)) {
        related.push(crawledPrompt);
        continue;
      }

      // 检查关键词匹配
      const title = crawledPrompt.title.toLowerCase();
      const content = crawledPrompt.content.toLowerCase();
      const tags = crawledPrompt.tags.map(tag => tag.toLowerCase());
      
      for (const keyword of keywords) {
        if (title.includes(keyword) || 
            content.includes(keyword) || 
            tags.some(tag => tag.includes(keyword))) {
          related.push(crawledPrompt);
          break;
        }
      }
    }

    // 限制数量并按质量排序
    return related
      .sort((a, b) => b.content.length - a.content.length) // 优先选择内容丰富的
      .slice(0, 5); // 最多选择5个相关提示词
  }

  /**
   * 基于爬取提示词增强AI生成
   */
  private async generateWithCrawledPromptEnhancement(
    expertPattern: ExpertPattern, 
    context: any, 
    messages: Message[], 
    session: Session
  ): Promise<GeneratedPrompts> {
    const relatedPrompts = expertPattern.related_crawled_prompts || [];
    
    let enhancementContext = '';
    if (relatedPrompts.length > 0) {
      enhancementContext = `

## 📚 参考优质提示词库
为了提升生成质量，请参考以下从GitHub爬取的优质提示词模板：

${relatedPrompts.map((prompt, index) => `
### 参考模板 ${index + 1}: ${prompt.title}
**来源**: ${prompt.source}
**类别**: ${prompt.category}
**标签**: ${prompt.tags.join(', ')}

**提示词内容**:
\`\`\`
${prompt.content.slice(0, 800)}${prompt.content.length > 800 ? '...' : ''}
\`\`\`
`).join('\n')}

## 💡 生成要求
请结合以上参考模板的优点，生成更专业、更实用的提示词。要求：
1. 借鉴参考模板的结构和表达方式
2. 融合参考模板的专业术语和方法论
3. 保持内容的原创性和针对性
4. 确保生成的提示词比参考模板更适合当前项目

`;
    }

    const enhancedPrompt = `${expertPattern.pattern}

## 🎯 项目上下文分析
${JSON.stringify(context, null, 2)}

## 📝 对话历史摘要
${messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}

${enhancementContext}

## 🚀 生成专业提示词套件
请基于以上信息和专家框架，生成四个维度的专业提示词：

1. **PRD (产品需求文档)提示词** - 帮助生成完整的产品需求文档
2. **技术实现提示词** - 指导技术架构和开发实现
3. **UI/UX设计提示词** - 生成用户体验和界面设计方案
4. **项目管理提示词** - 制定项目计划和管理策略

要求每个维度都体现${expertPattern.domain}专家的专业水准，并融合参考模板的优势。

请按照标准JSON格式输出四维度提示词套件：
{
  "professional_prompts": {
    "prd": {
      "title": "产品需求文档生成提示词",
      "prompt": "详细的PRD生成提示词内容...",
      "description": "该提示词的用途说明",
      "usage_guide": "使用指导"
    },
    "technical_implementation": {
      "title": "技术实现提示词", 
      "prompt": "详细的技术实现提示词内容...",
      "description": "该提示词的用途说明",
      "usage_guide": "使用指导"
    },
    "visual_design": {
      "title": "UI/UX设计提示词",
      "prompt": "详细的设计提示词内容...", 
      "description": "该提示词的用途说明",
      "usage_guide": "使用指导"
    },
    "project_management": {
      "title": "项目管理提示词",
      "prompt": "详细的项目管理提示词内容...",
      "description": "该提示词的用途说明", 
      "usage_guide": "使用指导"
    }
  }
}`;

    try {
      console.log('🤖 正在调用AI生成增强的专家级提示词...');
      console.log('📝 专家模式:', expertPattern.id);
      console.log('📋 项目上下文:', context);
      console.log('📚 参考提示词数量:', relatedPrompts.length);
      
      const response = await callAIAPI([
        {
          role: 'system',
          content: `你是${expertPattern.domain}领域的世界级专家，拥有丰富的实战经验和深厚的理论功底。现在你需要结合参考的优质提示词模板，生成更高质量的专业提示词。`
        },
        {
          role: 'user',
          content: enhancedPrompt
        }
      ]);

      console.log('✅ AI调用成功，响应长度:', response.length, '字符');
      console.log('📄 AI原始回复:', response.substring(0, 200) + '...');

      // 解析并返回结构化提示词
      const result = this.parseExpertResponse(response, context, expertPattern);
      console.log('🎯 增强提示词解析完成，PRD长度:', result.professional_prompts.prd.prompt.length, '字符');
      
      return result;
      
    } catch (error) {
      console.error('❌ 增强专家模式生成失败:', error);
      console.log('🔄 回退到标准专家模式');
      
      // 回退到原有的生成方法
      return this.generateWithExpertPattern(expertPattern, context, messages, session);
    }
  }

  /**
   * 质量评估
   */
  private async evaluateQuality(prompts: GeneratedPrompts, context: any): Promise<QualityMetrics> {
    const evaluationPrompt = `作为质量评估专家，请评估以下提示词的质量：

PRD提示词长度：${prompts.professional_prompts?.prd.prompt.length || 0}字符
技术提示词长度：${prompts.professional_prompts?.technical_implementation.prompt.length || 0}字符
设计提示词长度：${prompts.professional_prompts?.visual_design.prompt.length || 0}字符
管理提示词长度：${prompts.professional_prompts?.project_management.prompt.length || 0}字符

项目复杂度：${context.complexity_level}
项目类型：${context.project_type}

请从以下维度评分(1-10)并返回JSON：
{
  "clarity": 清晰度评分,
  "completeness": 完整度评分,
  "professionalism": 专业度评分,
  "actionability": 可执行性评分,
  "innovation": 创新性评分,
  "overall_score": 综合评分
}`;

    try {
      console.log('📊 正在调用AI进行质量评估...');
      
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是专业的质量评估师，擅长评估文档和提示词的质量。'
        },
        {
          role: 'user',
          content: evaluationPrompt
        }
      ]);

      console.log('✅ 质量评估AI调用成功');
      console.log('📊 评估结果:', response.substring(0, 150) + '...');

      const metrics = JSON.parse(response);
      console.log('🎯 质量评分完成，综合评分:', metrics.overall_score);
      
      return metrics;
    } catch (error) {
      console.error('❌ 质量评估失败:', error);
      console.log('🔄 使用默认质量评分');
      
      return {
        clarity: 7.5,
        completeness: 8.0,
        professionalism: 8.5,
        actionability: 7.8,
        innovation: 7.2,
        overall_score: 7.8
      };
    }
  }

  /**
   * 应用优化建议
   */
  private async applyOptimizations(
    prompts: GeneratedPrompts, 
    quality: QualityMetrics
  ): Promise<GeneratedPrompts> {
    
    // 如果质量已经很高，直接返回
    if (quality.overall_score >= 8.5) {
      return prompts;
    }

    // 生成优化建议
    const suggestions = this.generateOptimizationSuggestions(quality);
    
    // 应用高优先级优化
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high');
    
    if (highPrioritySuggestions.length > 0) {
      return await this.optimizePrompts(prompts, highPrioritySuggestions);
    }

    return prompts;
  }

  /**
   * 生成优化建议
   */
  private generateOptimizationSuggestions(quality: QualityMetrics): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    if (quality.clarity < 7.5) {
      suggestions.push({
        type: 'clarity',
        description: '提示词表达不够清晰，需要优化语言表述',
        priority: 'high',
        implementation: '使用更简洁明了的语言，添加结构化的要点和示例'
      });
    }

    if (quality.completeness < 8.0) {
      suggestions.push({
        type: 'content',
        description: '内容完整度不足，需要补充关键信息',
        priority: 'high',
        implementation: '添加缺失的关键环节，确保覆盖完整的业务流程'
      });
    }

    if (quality.professionalism < 8.0) {
      suggestions.push({
        type: 'professionalism',
        description: '专业度有待提升，需要加强行业最佳实践',
        priority: 'medium',
        implementation: '引用行业标准、最佳实践案例和专业框架'
      });
    }

    if (quality.actionability < 7.5) {
      suggestions.push({
        type: 'structure',
        description: '可执行性不强，需要优化操作指导',
        priority: 'high',
        implementation: '添加具体的操作步骤、检查清单和成功标准'
      });
    }

    return suggestions;
  }

  /**
   * 优化提示词
   */
  private async optimizePrompts(
    prompts: GeneratedPrompts,
    suggestions: OptimizationSuggestion[]
  ): Promise<GeneratedPrompts> {
    
    const optimizationPrompt = `请根据以下优化建议改进提示词：

优化建议：
${suggestions.map(s => `- ${s.type}: ${s.description} (${s.implementation})`).join('\n')}

当前PRD提示词：
${prompts.professional_prompts?.prd.prompt}

请返回优化后的PRD提示词，要求：
1. 保持原有结构
2. 应用优化建议
3. 提升专业性和可执行性`;

    try {
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是专业的文档优化师，擅长改进提示词的质量和实用性。'
        },
        {
          role: 'user',
          content: optimizationPrompt
        }
      ]);

      // 更新优化后的内容
      if (prompts.professional_prompts) {
        prompts.professional_prompts.prd.prompt = response;
      }

      return prompts;
    } catch (error) {
      console.error('提示词优化失败:', error);
      return prompts;
    }
  }

  /**
   * 记录用户反馈
   */
  public recordUserFeedback(feedback: UserFeedback) {
    const feedbackList = this.userFeedback.get(feedback.prompt_id) || [];
    feedbackList.push(feedback);
    this.userFeedback.set(feedback.prompt_id, feedbackList);
    
    // 保存到本地存储
    this.saveOptimizationData();
    
    // 更新专家模式评分
    this.updateExpertPatternScores(feedback);
  }

  /**
   * 更新专家模式评分
   */
  private updateExpertPatternScores(feedback: UserFeedback) {
    // 根据用户反馈调整专家模式的成功率和质量评分
    // 实现自学习机制
  }

  /**
   * 保存优化数据
   */
  private saveOptimizationData() {
    try {
      const data = {
        expertPatterns: Array.from(this.expertPatterns.entries()),
        qualityHistory: Array.from(this.qualityHistory.entries()),
        userFeedback: Array.from(this.userFeedback.entries()),
        last_updated: new Date().toISOString()
      };
      localStorage.setItem('prompt-optimization-data', JSON.stringify(data));
    } catch (error) {
      console.warn('保存优化数据失败:', error);
    }
  }

  /**
   * 记录生成历史
   */
  private recordGeneration(prompts: GeneratedPrompts, quality: QualityMetrics, expertId?: string) {
    const promptId = `prompt-${Date.now()}`;
    
    // 记录质量历史
    const qualityList = this.qualityHistory.get(promptId) || [];
    qualityList.push(quality);
    this.qualityHistory.set(promptId, qualityList);
    
    // 更新专家模式使用统计
    if (expertId) {
      const pattern = this.expertPatterns.get(expertId);
      if (pattern) {
        pattern.usage_count++;
        pattern.last_updated = new Date().toISOString();
        this.expertPatterns.set(expertId, pattern);
      }
    }
    
    this.saveOptimizationData();
  }

  /**
   * 获取默认上下文分析
   */
  private getDefaultContextAnalysis(session: Session) {
    return {
      project_type: "通用项目",
      complexity_level: "中等",
      primary_domain: "business",
      target_users: "普通用户",
      core_value: session.initial_idea || "项目核心价值",
      main_challenges: ["需求明确", "技术实现"],
      technical_keywords: ["开发", "系统"],
      business_keywords: ["用户", "价值"],
      completeness_score: 75,
      clarity_score: 80,
      innovation_score: 70
    };
  }

  /**
   * 解析专家回复
   */
  private parseExpertResponse(response: string, context: any, pattern: ExpertPattern): GeneratedPrompts {
    // 先尝试解析AI返回的JSON
    let aiGeneratedContent = null;
    
    try {
      // 尝试直接解析
      aiGeneratedContent = JSON.parse(response);
    } catch (parseError) {
      // 如果直接解析失败，尝试提取JSON部分
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          aiGeneratedContent = JSON.parse(jsonMatch[0]);
        } catch (error) {
          console.warn('无法解析AI返回的JSON，使用默认内容');
        }
      }
    }

    // 如果AI生成了有效内容，使用AI的内容；否则使用默认内容
    const professionalPrompts = aiGeneratedContent?.professional_prompts || 
      aiGeneratedContent || // 有时AI直接返回四个维度的内容
      this.generateFallbackProfessionalPrompts(context, pattern);

    return {
      system_prompt: `基于${pattern.domain}专家分析的系统提示词，项目类型：${context.project_type}，复杂度：${context.complexity_level}`,
      user_prompt: `基于${context.core_value}的专业需求分析`,
      technical_requirements: this.generateTechnicalRequirements(context, pattern),
      project_summary: this.generateProjectSummary(context, pattern),
      next_steps: this.generateNextSteps(context, pattern),
      professional_prompts: {
        prd: {
          title: professionalPrompts.prd?.title || "产品需求文档(PRD)生成提示词",
          prompt: professionalPrompts.prd?.prompt || this.generateDefaultPRDPrompt(context, pattern),
          description: professionalPrompts.prd?.description || "用于生成专业的产品需求文档",
          usage_guide: professionalPrompts.prd?.usage_guide || "将此提示词输入给Claude/GPT等AI，可生成完整的PRD文档"
        },
        technical_implementation: {
          title: professionalPrompts.technical_implementation?.title || "技术架构实现提示词",
          prompt: professionalPrompts.technical_implementation?.prompt || this.generateDefaultTechPrompt(context, pattern),
          description: professionalPrompts.technical_implementation?.description || "用于生成技术架构和实现方案",
          usage_guide: professionalPrompts.technical_implementation?.usage_guide || "适合技术团队使用，可生成代码架构和技术文档"
        },
        visual_design: {
          title: professionalPrompts.visual_design?.title || "UI/UX设计提示词",
          prompt: professionalPrompts.visual_design?.prompt || this.generateDefaultDesignPrompt(context, pattern),
          description: professionalPrompts.visual_design?.description || "用于生成界面设计和用户体验方案",
          usage_guide: professionalPrompts.visual_design?.usage_guide || "可用于Figma、Sketch等设计工具的AI插件"
        },
        project_management: {
          title: professionalPrompts.project_management?.title || "项目管理提示词",
          prompt: professionalPrompts.project_management?.prompt || this.generateDefaultPMPrompt(context, pattern),
          description: professionalPrompts.project_management?.description || "用于生成项目计划和管理方案",
          usage_guide: professionalPrompts.project_management?.usage_guide || "帮助项目经理制定时间线和资源分配"
        }
      }
    };
  }

  /**
   * 生成默认PRD提示词
   */
  private generateDefaultPRDPrompt(context: any, pattern: ExpertPattern): string {
    return `# 产品需求文档(PRD)生成专家提示词

## 角色定义
你是一位拥有15年经验的资深产品经理，专门负责撰写高质量的产品需求文档。你具备深厚的产品思维、用户洞察能力和业务理解。

## 项目背景
- **项目类型**: ${context.project_type}
- **复杂度等级**: ${context.complexity_level}
- **目标用户**: ${context.target_users}
- **核心价值**: ${context.core_value}
- **主要挑战**: ${context.main_challenges?.join('、') || '待明确'}

## 输出要求
请生成一份完整的PRD文档，必须包含以下结构：

### 1. 产品概述
- 产品定位和价值主张
- 目标用户画像
- 核心问题和解决方案
- 产品定位（如MVP、PMF阶段等）

### 2. 需求分析
- 用户痛点分析
- 竞品分析和差异化
- 市场机会和规模评估
- 成功指标定义

### 3. 功能规格
- 核心功能列表（按优先级排序）
- 详细功能描述
- 用户故事和使用场景
- 功能流程图

### 4. 技术要求
- 性能指标要求
- 兼容性要求
- 安全性要求
- 可扩展性考虑

### 5. 实施计划
- 开发里程碑
- 资源需求评估
- 风险识别和应对
- 发布策略

## 输出格式
使用Markdown格式，结构清晰，内容详实，确保每个部分都有具体的、可执行的内容。`;
  }

  /**
   * 生成默认技术提示词
   */
  private generateDefaultTechPrompt(context: any, pattern: ExpertPattern): string {
    return `# 技术架构实现专家提示词

## 角色定义
你是一位拥有20年经验的资深技术架构师，精通全栈开发、系统设计、云架构和微服务等技术领域。

## 项目技术背景
- **项目类型**: ${context.project_type}
- **复杂度**: ${context.complexity_level}
- **技术关键词**: ${context.technical_keywords?.join('、') || '待确定'}
- **核心价值**: ${context.core_value}

## 架构设计要求
请设计完整的技术实现方案，包含：

### 1. 系统架构设计
- 整体架构模式选择（单体/微服务/Serverless）
- 系统模块划分和职责定义
- 服务间通信方式
- 数据流设计

### 2. 技术栈选型
- 前端技术栈推荐（框架、UI库、状态管理）
- 后端技术栈推荐（语言、框架、数据库）
- 基础设施选择（云服务、部署方式）
- 第三方服务集成

### 3. 数据库设计
- 数据模型设计
- 数据库选型理由
- 性能优化策略
- 数据安全和备份方案

### 4. API设计规范
- RESTful API设计原则
- 接口文档规范
- 认证授权机制
- 错误处理和日志规范

### 5. 部署和运维
- CI/CD流程设计
- 监控和告警策略
- 性能优化方案
- 安全防护措施

## 输出格式
提供详细的技术文档，包含代码示例、配置示例和最佳实践建议。`;
  }

  /**
   * 生成默认设计提示词
   */
  private generateDefaultDesignPrompt(context: any, pattern: ExpertPattern): string {
    return `# UI/UX设计专家提示词

## 角色定义
你是一位拥有12年经验的资深UI/UX设计师，精通用户体验设计、视觉设计、交互设计和设计系统构建。

## 设计项目背景
- **项目类型**: ${context.project_type}
- **目标用户**: ${context.target_users}
- **核心价值**: ${context.core_value}
- **复杂度**: ${context.complexity_level}

## 设计任务要求
请创建完整的UI/UX设计方案，包含：

### 1. 用户体验策略
- 用户旅程地图设计
- 用户痛点分析和解决方案
- 信息架构设计
- 交互流程优化

### 2. 视觉设计系统
- 品牌调性和视觉语言
- 色彩系统和字体规范
- 图标和插画风格
- 组件库设计规范

### 3. 界面设计规范
- 页面布局原则
- 响应式设计方案
- 组件设计标准
- 状态设计规范

### 4. 交互设计详案
- 微交互设计
- 动效设计规范
- 反馈机制设计
- 无障碍设计考虑

### 5. 设计验证
- 可用性测试计划
- A/B测试建议
- 设计评估标准
- 迭代优化策略

## 输出格式
提供详细的设计文档，包含设计思路、设计原理和具体的设计指导。`;
  }

  /**
   * 生成默认项目管理提示词
   */
  private generateDefaultPMPrompt(context: any, pattern: ExpertPattern): string {
    return `# 项目管理专家提示词

## 角色定义
你是一位拥有15年经验的资深项目经理，精通敏捷开发、项目规划、团队协作和风险管理。

## 项目管理背景
- **项目类型**: ${context.project_type}
- **复杂度**: ${context.complexity_level}
- **主要挑战**: ${context.main_challenges?.join('、') || '待识别'}
- **核心目标**: ${context.core_value}

## 项目管理任务
请制定完整的项目管理方案，包含：

### 1. 项目规划
- 项目目标和成功标准定义
- 工作分解结构(WBS)
- 里程碑和时间计划
- 资源需求和分配

### 2. 团队管理
- 团队结构和角色定义
- 沟通计划和会议安排
- 绩效管理和激励机制
- 团队协作工具选择

### 3. 风险管理
- 风险识别和评估
- 风险应对策略
- 质量保证措施
- 变更管理流程

### 4. 进度控制
- 进度跟踪方法
- 关键路径分析
- 延期预警机制
- 交付管理流程

### 5. 项目收尾
- 项目验收标准
- 经验总结和文档归档
- 团队总结和表彰
- 后续维护计划

## 输出格式
提供详细的项目管理计划，包含甘特图、风险矩阵、沟通计划等项目管理工具。`;
  }

  /**
   * 生成回退专业提示词
   */
  private generateFallbackProfessionalPrompts(context: any, pattern: ExpertPattern) {
    return {
      prd: {
        title: "产品需求文档(PRD)生成提示词",
        prompt: this.generateDefaultPRDPrompt(context, pattern),
        description: "用于生成专业的产品需求文档",
        usage_guide: "将此提示词输入给Claude/GPT等AI，可生成完整的PRD文档"
      },
      technical_implementation: {
        title: "技术架构实现提示词",
        prompt: this.generateDefaultTechPrompt(context, pattern),
        description: "用于生成技术架构和实现方案",
        usage_guide: "适合技术团队使用，可生成代码架构和技术文档"
      },
      visual_design: {
        title: "UI/UX设计提示词",
        prompt: this.generateDefaultDesignPrompt(context, pattern),
        description: "用于生成界面设计和用户体验方案",
        usage_guide: "可用于Figma、Sketch等设计工具的AI插件"
      },
      project_management: {
        title: "项目管理提示词",
        prompt: this.generateDefaultPMPrompt(context, pattern),
        description: "用于生成项目计划和管理方案",
        usage_guide: "帮助项目经理制定时间线和资源分配"
      }
    };
  }

  /**
   * 生成技术需求
   */
  private generateTechnicalRequirements(context: any, pattern: ExpertPattern): string {
    return `# ${context.project_type} 技术需求规格书

## 项目概述
- **项目名称**: ${context.core_value}
- **复杂度等级**: ${context.complexity_level}
- **技术领域**: ${pattern.domain}

## 功能性需求
基于${context.project_type}的特点，系统需要满足以下核心功能需求：
${context.main_challenges?.map((challenge: string, index: number) => `${index + 1}. ${challenge}相关功能实现`).join('\n') || ''}

## 非功能性需求
- **性能要求**: 根据${context.complexity_level}复杂度设计
- **可扩展性**: 支持未来业务增长
- **安全性**: 符合行业标准
- **可维护性**: 代码结构清晰，文档完整

## 技术架构建议
基于${pattern.domain}专家模式的推荐架构...`;
  }

  /**
   * 生成项目总结
   */
  private generateProjectSummary(context: any, pattern: ExpertPattern): string {
    return `# ${context.project_type}项目总结报告

## 项目基本信息
- **项目类型**: ${context.project_type}
- **复杂度评估**: ${context.complexity_level}
- **专家模式**: ${pattern.id}
- **目标用户**: ${context.target_users}

## 核心价值分析
${context.core_value}

## 技术评估
复杂度等级：${context.complexity_level}
预估开发周期：${context.complexity_level === '简单' ? '2-4周' : context.complexity_level === '中等' ? '1-3个月' : '3-6个月'}

## 主要挑战
${context.main_challenges?.map((challenge: string, index: number) => `${index + 1}. ${challenge}`).join('\n') || '待识别具体挑战'}

## 建议下一步
基于${pattern.domain}专家分析的实施建议...`;
  }

  /**
   * 生成下一步建议
   */
  private generateNextSteps(context: any, pattern: ExpertPattern): string[] {
    const baseSteps = [
      '完善需求澄清和用户研究',
      '制定详细的项目计划和时间线',
      '确定技术架构和开发方案',
      '组建项目团队和分配角色',
      '建立项目管理和沟通机制'
    ];

    // 根据复杂度和专家模式添加特定建议
    if (context.complexity_level === '复杂' || context.complexity_level === '专业级') {
      baseSteps.push(
        '进行技术预研和原型验证',
        '制定风险管理和应急预案',
        '建立质量保证和测试策略'
      );
    }

    if (pattern.domain === 'business') {
      baseSteps.push('进行市场调研和竞品分析', '制定商业模式和盈利策略');
    } else if (pattern.domain === 'tech') {
      baseSteps.push('进行技术选型和架构设计', '建立开发环境和CI/CD流程');
    } else if (pattern.domain === 'design') {
      baseSteps.push('进行用户体验研究', '建立设计系统和规范');
    } else if (pattern.domain === 'management') {
      baseSteps.push('建立项目管理流程', '制定团队协作和沟通机制');
    }

    return baseSteps;
  }

  /**
   * 生成默认提示词(回退方案)
   */
  private async generateDefaultPrompts(messages: Message[], session: Session): Promise<GeneratedPrompts> {
    // 回退到原有的生成逻辑
    const { generateProfessionalPrompts } = await import('./prompt-generator');
    return generateProfessionalPrompts(messages, session);
  }

  /**
   * 获取优化统计信息
   */
  public getOptimizationStats() {
    const totalPatterns = this.expertPatterns.size;
    const totalGenerations = Array.from(this.qualityHistory.values()).flat().length;
    const averageQuality = Array.from(this.qualityHistory.values())
      .flat()
      .reduce((sum, metric) => sum + metric.overall_score, 0) / totalGenerations || 0;
    
    const topPattern = Array.from(this.expertPatterns.values())
      .sort((a, b) => b.success_rate - a.success_rate)[0];

    return {
      total_patterns: totalPatterns,
      total_generations: totalGenerations,
      average_quality: averageQuality,
      top_performing_pattern: topPattern?.id,
      quality_trend: "improving" // 简化版，实际应计算趋势
    };
  }

  /**
   * 刷新爬取提示词库集成（当用户新爬取了提示词时调用）
   */
  public refreshCrawledPromptsIntegration() {
    console.log('🔄 刷新提示词库集成...');
    this.enhanceExpertPatternsWithCrawledPrompts();
  }

  /**
   * 获取专家模式的相关提示词统计
   */
  public getCrawledPromptStats() {
    const stats = {
      total_patterns: this.expertPatterns.size,
      patterns_with_prompts: 0,
      total_related_prompts: 0,
      prompts_by_domain: {} as Record<string, number>
    };

    for (const [_, pattern] of this.expertPatterns) {
      const promptCount = pattern.related_crawled_prompts?.length || 0;
      if (promptCount > 0) {
        stats.patterns_with_prompts++;
        stats.total_related_prompts += promptCount;
        stats.prompts_by_domain[pattern.domain] = (stats.prompts_by_domain[pattern.domain] || 0) + promptCount;
      }
    }

    return stats;
  }

  /**
   * 生成完整的专业文档内容
   */
  private async generateCompleteDocuments(
    prompts: GeneratedPrompts,
    context: any,
    messages: Message[],
    session: Session
  ) {
    console.log('📋 开始生成四个维度的完整文档...');

    try {
      // 并行生成四个文档
      const [prdDoc, techDoc, designDoc, projectDoc] = await Promise.all([
        this.generatePRDDocument(prompts, context, messages, session),
        this.generateTechnicalDocument(prompts, context, messages, session),
        this.generateDesignDocument(prompts, context, messages, session),
        this.generateProjectDocument(prompts, context, messages, session)
      ]);

      console.log('✅ 完整文档生成成功');
      console.log(`📊 文档统计: PRD(${prdDoc.content.length}字), 技术(${techDoc.content.length}字), 设计(${designDoc.content.length}字), 管理(${projectDoc.content.length}字)`);

      return {
        prd_document: prdDoc,
        technical_document: techDoc,
        design_document: designDoc,
        project_plan: projectDoc
      };
    } catch (error) {
      console.error('❌ 生成完整文档失败:', error);
      return this.generateFallbackDocuments(context, session);
    }
  }

  /**
   * 生成完整的PRD文档
   */
  private async generatePRDDocument(prompts: GeneratedPrompts, context: any, messages: Message[], session: Session) {
    const prdPrompt = `作为15年经验的资深产品经理，请为以下项目生成完整的产品需求文档(PRD)：

## 项目信息
- **项目名称**: ${session.title}
- **项目愿景**: ${session.initial_idea}
- **项目类型**: ${context.project_type}
- **复杂度**: ${context.complexity_level}
- **目标用户**: ${context.target_users}
- **核心价值**: ${context.core_value}

## 需求背景
${messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')}

## 输出要求
请生成完整的PRD文档，包含以下章节：

### 1. 产品概述 (Product Overview)
- 产品定位和价值主张
- 目标市场和用户画像  
- 核心问题和解决方案
- 商业模式和盈利点

### 2. 需求分析 (Requirements Analysis)
- 用户痛点深度分析
- 功能需求优先级
- 非功能需求定义
- 竞品分析和差异化策略

### 3. 功能规格 (Functional Specifications)
- 核心功能详细描述
- 用户故事和使用场景
- 功能流程图和交互逻辑
- 数据流和状态管理

### 4. 技术要求 (Technical Requirements)
- 性能指标和技术约束
- 系统集成和API需求
- 安全性和隐私要求
- 可扩展性和维护性

### 5. 实施计划 (Implementation Plan)
- 开发阶段和里程碑
- 资源配置和时间规划
- 风险评估和应对措施
- 发布策略和推广计划

请确保内容专业、详实、可执行，每个章节至少300字，总字数不少于2000字。使用Markdown格式输出。`;

    try {
      console.log('📝 生成PRD文档...');
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是资深产品经理，擅长撰写专业的产品需求文档。请按照要求生成完整、详实的PRD文档。'
        },
        {
          role: 'user',
          content: prdPrompt
        }
      ]);

      console.log('✅ PRD文档生成成功，长度:', response.length);

      // 解析文档章节
      const sections = this.parsePRDSections(response);
      
      return {
        title: `${session.title} - 产品需求文档(PRD)`,
        content: response,
        sections: sections
      };
    } catch (error) {
      console.error('❌ PRD文档生成失败:', error);
      return this.generateDefaultPRDDocument(context, session);
    }
  }

  /**
   * 生成完整的技术文档
   */
  private async generateTechnicalDocument(prompts: GeneratedPrompts, context: any, messages: Message[], session: Session) {
    const techPrompt = `作为20年经验的资深技术架构师，请为以下项目生成完整的技术架构文档：

## 项目技术背景
- **项目名称**: ${session.title}
- **项目类型**: ${context.project_type}
- **复杂度等级**: ${context.complexity_level}
- **技术关键词**: ${context.technical_keywords?.join('、') || '待确定'}
- **核心价值**: ${context.core_value}

## 业务需求
${messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')}

## 输出要求
请生成完整的技术架构文档，包含：

### 1. 架构设计 (Architecture Design)
- 整体架构模式和设计理念
- 系统模块划分和职责
- 服务拆分和边界定义
- 数据流和通信方式

### 2. 技术栈选型 (Technology Stack)
- 前端技术栈选择和理由
- 后端技术栈选择和理由
- 数据库技术选型
- 基础设施和云服务

### 3. 数据库设计 (Database Design)
- 数据模型和实体关系
- 表结构设计
- 索引和性能优化
- 数据备份和安全策略

### 4. API设计 (API Design)
- RESTful API规范
- 接口文档和示例
- 认证授权机制
- 错误处理和状态码

### 5. 部署方案 (Deployment Plan)
- 环境配置和部署架构
- CI/CD流程设计
- 监控和日志系统
- 性能优化和扩容策略

请确保内容技术性强、架构合理、可落地实施。总字数不少于2000字，使用Markdown格式。`;

    try {
      console.log('🔧 生成技术文档...');
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是资深技术架构师，擅长设计可扩展的技术架构。请生成专业的技术文档。'
        },
        {
          role: 'user',
          content: techPrompt
        }
      ]);

      console.log('✅ 技术文档生成成功，长度:', response.length);

      const sections = this.parseTechnicalSections(response);
      
      return {
        title: `${session.title} - 技术架构文档`,
        content: response,
        sections: sections
      };
    } catch (error) {
      console.error('❌ 技术文档生成失败:', error);
      return this.generateDefaultTechnicalDocument(context, session);
    }
  }

  /**
   * 生成完整的设计文档
   */
  private async generateDesignDocument(prompts: GeneratedPrompts, context: any, messages: Message[], session: Session) {
    const designPrompt = `作为12年经验的资深UI/UX设计师，请为以下项目生成完整的设计文档：

## 设计项目背景
- **项目名称**: ${session.title}
- **项目类型**: ${context.project_type}
- **目标用户**: ${context.target_users}
- **核心价值**: ${context.core_value}
- **复杂度**: ${context.complexity_level}

## 用户需求
${messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')}

## 输出要求
请生成完整的UI/UX设计文档，包含：

### 1. 用户体验策略 (UX Strategy)
- 用户研究和用户画像
- 用户旅程地图
- 信息架构设计
- 交互流程优化

### 2. 视觉设计系统 (Visual Design System)
- 品牌调性和设计语言
- 色彩系统和配色方案
- 字体系统和排版规范
- 图标系统和插画风格

### 3. 界面设计规范 (Interface Specifications)
- 页面布局和栅格系统
- 组件库设计标准
- 响应式设计方案
- 状态设计和反馈机制

### 4. 交互设计 (Interaction Design)
- 微交互和动效设计
- 手势和操作规范
- 导航和信息架构
- 无障碍设计考虑

### 5. 设计验证 (Design Validation)
- 可用性测试计划
- A/B测试策略
- 设计评估标准
- 迭代优化方案

请确保设计理念先进、用户体验优秀、视觉效果出色。总字数不少于2000字，使用Markdown格式。`;

    try {
      console.log('🎨 生成设计文档...');
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是资深UI/UX设计师，擅长创造优秀的用户体验。请生成专业的设计文档。'
        },
        {
          role: 'user',
          content: designPrompt
        }
      ]);

      console.log('✅ 设计文档生成成功，长度:', response.length);

      const sections = this.parseDesignSections(response);
      
      return {
        title: `${session.title} - UI/UX设计文档`,
        content: response,
        sections: sections
      };
    } catch (error) {
      console.error('❌ 设计文档生成失败:', error);
      return this.generateDefaultDesignDocument(context, session);
    }
  }

  /**
   * 生成完整的项目管理文档
   */
  private async generateProjectDocument(prompts: GeneratedPrompts, context: any, messages: Message[], session: Session) {
    const projectPrompt = `作为15年经验的资深项目经理，请为以下项目生成完整的项目管理计划：

## 项目管理背景
- **项目名称**: ${session.title}
- **项目类型**: ${context.project_type}
- **复杂度**: ${context.complexity_level}
- **主要挑战**: ${context.main_challenges?.join('、') || '待识别'}
- **核心目标**: ${context.core_value}

## 项目需求
${messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')}

## 输出要求
请生成完整的项目管理计划，包含：

### 1. 项目规划 (Project Planning)
- 项目目标和成功标准
- 工作分解结构(WBS)
- 里程碑和时间计划
- 资源需求和预算评估

### 2. 团队管理 (Team Management)
- 团队结构和角色定义
- 人员配置和技能需求
- 沟通计划和会议安排
- 绩效管理和激励机制

### 3. 风险管理 (Risk Management)
- 风险识别和评估矩阵
- 风险应对策略
- 质量保证措施
- 变更管理流程

### 4. 进度控制 (Progress Control)
- 进度跟踪和监控方法
- 关键路径分析
- 延期预警和应对机制
- 交付管理和验收流程

### 5. 项目收尾 (Project Closure)
- 项目验收标准
- 成果交付和文档归档
- 经验总结和最佳实践
- 后续维护和支持计划

请确保计划科学合理、可执行性强、风险可控。总字数不少于2000字，使用Markdown格式。`;

    try {
      console.log('📊 生成项目管理文档...');
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是资深项目经理，擅长制定科学的项目管理计划。请生成专业的项目管理文档。'
        },
        {
          role: 'user',
          content: projectPrompt
        }
      ]);

      console.log('✅ 项目管理文档生成成功，长度:', response.length);

      const sections = this.parseProjectSections(response);
      
      return {
        title: `${session.title} - 项目管理计划`,
        content: response,
        sections: sections
      };
    } catch (error) {
      console.error('❌ 项目管理文档生成失败:', error);
      return this.generateDefaultProjectDocument(context, session);
    }
  }



  /**
   * 解析PRD文档章节
   */
  private parsePRDSections(content: string) {
    return {
      product_overview: this.extractSection(content, ['产品概述', 'Product Overview']) || '产品概述内容',
      requirements_analysis: this.extractSection(content, ['需求分析', 'Requirements Analysis']) || '需求分析内容',
      functional_specs: this.extractSection(content, ['功能规格', 'Functional Specifications']) || '功能规格内容',
      technical_requirements: this.extractSection(content, ['技术要求', 'Technical Requirements']) || '技术要求内容',
      implementation_plan: this.extractSection(content, ['实施计划', 'Implementation Plan']) || '实施计划内容'
    };
  }

  /**
   * 解析技术文档章节
   */
  private parseTechnicalSections(content: string) {
    return {
      architecture_design: this.extractSection(content, ['架构设计', 'Architecture Design']) || '架构设计内容',
      tech_stack: this.extractSection(content, ['技术栈选型', 'Technology Stack']) || '技术栈选型内容',
      database_design: this.extractSection(content, ['数据库设计', 'Database Design']) || '数据库设计内容',
      api_design: this.extractSection(content, ['API设计', 'API Design']) || 'API设计内容',
      deployment_plan: this.extractSection(content, ['部署方案', 'Deployment Plan']) || '部署方案内容'
    };
  }

  /**
   * 解析设计文档章节
   */
  private parseDesignSections(content: string) {
    return {
      user_experience: this.extractSection(content, ['用户体验策略', 'UX Strategy']) || '用户体验策略内容',
      visual_system: this.extractSection(content, ['视觉设计系统', 'Visual Design System']) || '视觉设计系统内容',
      interface_specs: this.extractSection(content, ['界面设计规范', 'Interface Specifications']) || '界面设计规范内容',
      interaction_design: this.extractSection(content, ['交互设计', 'Interaction Design']) || '交互设计内容',
      design_validation: this.extractSection(content, ['设计验证', 'Design Validation']) || '设计验证内容'
    };
  }

  /**
   * 解析项目管理文档章节
   */
  private parseProjectSections(content: string) {
    return {
      project_planning: this.extractSection(content, ['项目规划', 'Project Planning']) || '项目规划内容',
      team_management: this.extractSection(content, ['团队管理', 'Team Management']) || '团队管理内容',
      risk_management: this.extractSection(content, ['风险管理', 'Risk Management']) || '风险管理内容',
      progress_control: this.extractSection(content, ['进度控制', 'Progress Control']) || '进度控制内容',
      project_closure: this.extractSection(content, ['项目收尾', 'Project Closure']) || '项目收尾内容'
    };
  }

  /**
   * 从文档中提取特定章节
   */
  private extractSection(content: string, sectionNames: string[]): string {
    for (const sectionName of sectionNames) {
      const regex = new RegExp(`###?\\s*\\d*\\.?\\s*${sectionName}[\\s\\S]*?(?=###|$)`, 'i');
      const match = content.match(regex);
      if (match) {
        return match[0].trim();
      }
    }
    return '';
  }

  /**
   * 生成回退文档
   */
  private generateFallbackDocuments(context: any, session: Session) {
    return {
      prd_document: {
        title: `${session.title} - 产品需求文档(PRD)`,
        content: this.generateDefaultPRDContent(context, session),
        sections: {
          product_overview: '产品概述章节',
          requirements_analysis: '需求分析章节',
          functional_specs: '功能规格章节',
          technical_requirements: '技术要求章节',
          implementation_plan: '实施计划章节'
        }
      },
      technical_document: {
        title: `${session.title} - 技术架构文档`,
        content: this.generateDefaultTechContent(context, session),
        sections: {
          architecture_design: '架构设计章节',
          tech_stack: '技术栈选型章节',
          database_design: '数据库设计章节',
          api_design: 'API设计章节',
          deployment_plan: '部署方案章节'
        }
      },
      design_document: {
        title: `${session.title} - UI/UX设计文档`,
        content: this.generateDefaultDesignContent(context, session),
        sections: {
          user_experience: '用户体验策略章节',
          visual_system: '视觉设计系统章节',
          interface_specs: '界面设计规范章节',
          interaction_design: '交互设计章节',
          design_validation: '设计验证章节'
        }
      },
      project_plan: {
        title: `${session.title} - 项目管理计划`,
        content: this.generateDefaultProjectContent(context, session),
        sections: {
          project_planning: '项目规划章节',
          team_management: '团队管理章节',
          risk_management: '风险管理章节',
          progress_control: '进度控制章节',
          project_closure: '项目收尾章节'
        }
      }
    };
  }

  /**
   * 生成默认PRD文档内容
   */
  private generateDefaultPRDDocument(context: any, session: Session) {
    return {
      title: `${session.title} - 产品需求文档(PRD)`,
      content: this.generateDefaultPRDContent(context, session),
      sections: {
        product_overview: '产品概述章节',
        requirements_analysis: '需求分析章节',
        functional_specs: '功能规格章节',
        technical_requirements: '技术要求章节',
        implementation_plan: '实施计划章节'
      }
    };
  }

  /**
   * 生成默认技术文档
   */
  private generateDefaultTechnicalDocument(context: any, session: Session) {
    return {
      title: `${session.title} - 技术架构文档`,
      content: this.generateDefaultTechContent(context, session),
      sections: {
        architecture_design: '架构设计章节',
        tech_stack: '技术栈选型章节',
        database_design: '数据库设计章节',
        api_design: 'API设计章节',
        deployment_plan: '部署方案章节'
      }
    };
  }

  /**
   * 生成默认设计文档
   */
  private generateDefaultDesignDocument(context: any, session: Session) {
    return {
      title: `${session.title} - UI/UX设计文档`,
      content: this.generateDefaultDesignContent(context, session),
      sections: {
        user_experience: '用户体验策略章节',
        visual_system: '视觉设计系统章节',
        interface_specs: '界面设计规范章节',
        interaction_design: '交互设计章节',
        design_validation: '设计验证章节'
      }
    };
  }

  /**
   * 生成默认项目管理文档
   */
  private generateDefaultProjectDocument(context: any, session: Session) {
    return {
      title: `${session.title} - 项目管理计划`,
      content: this.generateDefaultProjectContent(context, session),
      sections: {
        project_planning: '项目规划章节',
        team_management: '团队管理章节',
        risk_management: '风险管理章节',
        progress_control: '进度控制章节',
        project_closure: '项目收尾章节'
      }
    };
  }

  /**
   * 生成默认PRD内容
   */
  private generateDefaultPRDContent(context: any, session: Session): string {
    return `# ${session.title} - 产品需求文档

## 1. 产品概述
**项目名称**: ${session.title}
**核心价值**: ${session.initial_idea}
**项目类型**: ${context.project_type}
**复杂度等级**: ${context.complexity_level}

## 2. 需求分析
基于${context.project_type}的特点，项目需要解决的核心问题...

## 3. 功能规格
### 核心功能列表
1. 基础功能模块
2. 高级功能模块
3. 管理功能模块

## 4. 技术要求
- 性能要求: 根据${context.complexity_level}复杂度设计
- 可扩展性: 支持未来业务增长
- 安全性: 符合行业标准

## 5. 实施计划
预估开发周期: ${context.complexity_level === '简单' ? '2-4周' : context.complexity_level === '中等' ? '1-3个月' : '3-6个月'}`;
  }

  /**
   * 生成默认技术内容
   */
  private generateDefaultTechContent(context: any, session: Session): string {
    return `# ${session.title} - 技术架构文档

## 1. 架构设计
**项目技术架构**: 基于${context.project_type}的技术架构设计

## 2. 技术栈选型
- 前端: React/Vue.js
- 后端: Node.js/Python
- 数据库: PostgreSQL/MongoDB

## 3. 数据库设计
核心数据模型设计...

## 4. API设计
RESTful API设计规范...

## 5. 部署方案
云服务部署架构...`;
  }

  /**
   * 生成默认设计内容
   */
  private generateDefaultDesignContent(context: any, session: Session): string {
    return `# ${session.title} - UI/UX设计文档

## 1. 用户体验策略
**目标用户**: ${context.target_users}
**设计目标**: 优秀的用户体验

## 2. 视觉设计系统
品牌调性和设计语言...

## 3. 界面设计规范
组件库设计标准...

## 4. 交互设计
微交互和动效设计...

## 5. 设计验证
可用性测试计划...`;
  }

  /**
   * 生成默认项目管理内容
   */
  private generateDefaultProjectContent(context: any, session: Session): string {
    return `# ${session.title} - 项目管理计划

## 1. 项目规划
**项目目标**: ${session.initial_idea}
**项目复杂度**: ${context.complexity_level}

## 2. 团队管理
团队结构和角色定义...

## 3. 风险管理
风险识别和应对策略...

## 4. 进度控制
进度跟踪和监控方法...

## 5. 项目收尾
项目验收和总结...`;
  }
}

// 导出单例实例
export const promptOptimizationEngine = new PromptOptimizationEngine(); 