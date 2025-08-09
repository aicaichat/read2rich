// 提示词生成服务
import { callDeepSeekAPI } from './mock-api';
import { recommendTemplates, extractVariableValues, fillTemplateVariables, type TemplateMatch } from './template-matcher';
import type { PromptTemplate } from './prompt-templates';
import { searchCrawledPrompts, type CrawledPrompt } from './github-prompt-crawler';
import type { Message, Session } from '@/types';
import { promptOptimizationEngine } from './prompt-optimization-engine';

export interface GeneratedPrompts {
  // 原有字段（保持兼容性）
  system_prompt: string;
  user_prompt: string;
  technical_requirements: string;
  project_summary: string;
  next_steps: string[];
  
  // 新增：四个专业维度的提示词
  professional_prompts: {
    prd: {
      title: string;
      prompt: string;
      description: string;
      usage_guide: string;
    };
    technical_implementation: {
      title: string;
      prompt: string;
      description: string;
      usage_guide: string;
    };
    visual_design: {
      title: string;
      prompt: string;
      description: string;
      usage_guide: string;
    };
    project_management: {
      title: string;
      prompt: string;
      description: string;
      usage_guide: string;
    };
  };
  
  // 新增：完整的生成文档内容
  generated_documents?: {
    prd_document: {
      title: string;
      content: string;
      sections: {
        product_overview: string;
        requirements_analysis: string;
        functional_specs: string;
        technical_requirements: string;
        implementation_plan: string;
      };
    };
    technical_document: {
      title: string;
      content: string;
      sections: {
        architecture_design: string;
        tech_stack: string;
        database_design: string;
        api_design: string;
        deployment_plan: string;
      };
    };
    design_document: {
      title: string;
      content: string;
      sections: {
        user_experience: string;
        visual_system: string;
        interface_specs: string;
        interaction_design: string;
        design_validation: string;
      };
    };
    project_plan: {
      title: string;
      content: string;
      sections: {
        project_planning: string;
        team_management: string;
        risk_management: string;
        progress_control: string;
        project_closure: string;
      };
    };
  };
  
  // 模板相关（保持不变）
  recommended_templates?: TemplateMatch[];
  selected_template?: {
    template: PromptTemplate;
    filled_system_prompt: string;
    filled_user_prompt: string;
    extracted_variables: Record<string, string>;
  };
}

// 分析对话内容，提取关键信息
const analyzeConversation = (messages: Message[], session: Session) => {
  const userMessages = messages.filter(m => m.role === 'user');
  const assistantMessages = messages.filter(m => m.role === 'assistant');
  
  // 提取关键信息
  const keyTopics = new Set<string>();
  const technicalTerms = new Set<string>();
  const requirements = new Set<string>();
  
  // 分析用户消息
  userMessages.forEach(msg => {
    const content = msg.content.toLowerCase();
    
    // 检测技术栈
    if (content.includes('react') || content.includes('vue') || content.includes('angular')) {
      technicalTerms.add('前端框架');
    }
    if (content.includes('node') || content.includes('python') || content.includes('java')) {
      technicalTerms.add('后端技术');
    }
    if (content.includes('数据库') || content.includes('mysql') || content.includes('mongodb')) {
      technicalTerms.add('数据库');
    }
    if (content.includes('api') || content.includes('接口')) {
      technicalTerms.add('API设计');
    }
    if (content.includes('用户') || content.includes('用户界面') || content.includes('ui')) {
      technicalTerms.add('用户界面');
    }
    if (content.includes('移动端') || content.includes('app') || content.includes('手机')) {
      technicalTerms.add('移动端');
    }
    if (content.includes('支付') || content.includes('微信') || content.includes('支付宝')) {
      technicalTerms.add('支付功能');
    }
    if (content.includes('实时') || content.includes('websocket') || content.includes('推送')) {
      technicalTerms.add('实时通信');
    }
  });
  
  return {
    initialIdea: session.initial_idea,
    userMessages: userMessages.map(m => m.content),
    assistantMessages: assistantMessages.map(m => m.content),
    technicalTerms: Array.from(technicalTerms),
    messageCount: messages.length
  };
};

// 生成专业提示词 (集成模板系统 + 优化引擎 + 爬取提示词库)
export const generateProfessionalPrompts = async (
  messages: Message[], 
  session: Session
): Promise<GeneratedPrompts> => {
  
  console.log('🔍 开始生成专业提示词 - 使用优化引擎和提示词库...');
  console.log('📝 输入参数检查:');
  console.log('- Messages数量:', messages.length);
  console.log('- Session信息:', session);
  
  try {
    // 刷新爬取提示词库集成
    promptOptimizationEngine.refreshCrawledPromptsIntegration();
    
    // 显示提示词库统计
    const stats = promptOptimizationEngine.getCrawledPromptStats();
    console.log('📊 提示词库统计:', stats);
    
    // 优先使用优化引擎生成高质量提示词
    console.log('🚀 调用优化引擎生成提示词...');
    const enhancedPrompts = await promptOptimizationEngine.generateEnhancedPrompts(messages, session);
    
    console.log('✅ 优化引擎生成成功');
    console.log('📋 生成结果检查:');
    console.log('- System prompt长度:', enhancedPrompts.system_prompt?.length || 0);
    console.log('- User prompt长度:', enhancedPrompts.user_prompt?.length || 0);
    console.log('- Technical requirements长度:', enhancedPrompts.technical_requirements?.length || 0);
    
    if (enhancedPrompts.professional_prompts) {
      console.log('🎯 专业提示词检查:');
      console.log('- PRD提示词长度:', enhancedPrompts.professional_prompts.prd.prompt?.length || 0);
      console.log('- 技术提示词长度:', enhancedPrompts.professional_prompts.technical_implementation.prompt?.length || 0);
      console.log('- 设计提示词长度:', enhancedPrompts.professional_prompts.visual_design.prompt?.length || 0);
      console.log('- 管理提示词长度:', enhancedPrompts.professional_prompts.project_management.prompt?.length || 0);
      
      // 显示前100个字符预览
      console.log('📝 PRD提示词预览:', enhancedPrompts.professional_prompts.prd.prompt?.substring(0, 100) + '...');
    } else {
      console.warn('⚠️ 未生成专业提示词！');
    }
    
    return enhancedPrompts;
  } catch (error) {
    console.error('❌ 优化引擎生成失败:', error);
    console.log('🔄 回退到标准流程...');
    
    // 回退到原有的生成逻辑
    return await generateStandardPrompts(messages, session);
  }
};

// 标准提示词生成流程（原有逻辑保持不变）
const generateStandardPrompts = async (
  messages: Message[], 
  session: Session
): Promise<GeneratedPrompts> => {
  
  console.log('🔍 使用标准流程生成提示词...');
  
  // 1. 推荐合适的模板
  const recommendedTemplates = recommendTemplates(messages, session);
  console.log('🎯 推荐的模板:', recommendedTemplates.map(t => `${t.template.name} (${t.score}分)`));
  
  let selectedTemplate = null;
  
  // 2. 选择最佳模板 (分数最高的)
  if (recommendedTemplates.length > 0 && recommendedTemplates[0].score >= 40) {
    const bestMatch = recommendedTemplates[0];
    console.log('✅ 选择模板:', bestMatch.template.name);
    
    // 3. 自动提取变量值
    const extractedVariables = extractVariableValues(messages, session, bestMatch.template);
    console.log('📋 提取的变量:', extractedVariables);
    
    // 4. 填充模板
    const { systemPrompt, userPrompt } = fillTemplateVariables(bestMatch.template, extractedVariables);
    
    selectedTemplate = {
      template: bestMatch.template,
      filled_system_prompt: systemPrompt,
      filled_user_prompt: userPrompt,
      extracted_variables: extractedVariables
    };
  }
  
  // 5. 基于模板生成或使用传统方式生成
  if (selectedTemplate) {
    console.log('🎨 使用模板生成提示词');
    
    // 使用 AI 优化模板内容
    const optimizationPrompt = `请基于以下专业模板和用户对话，优化和完善提示词内容：

## 选中的模板: ${selectedTemplate.template.name}
${selectedTemplate.template.description}

## 填充后的系统提示词:
${selectedTemplate.filled_system_prompt}

## 填充后的用户提示词:
${selectedTemplate.filled_user_prompt}

## 用户对话历史:
${messages.filter(m => m.role === 'user').map(m => m.content).join('\n')}

请生成以下优化内容：
1. **技术需求文档**: 结构化的详细技术需求
2. **项目总结**: 项目概述和关键信息
3. **下一步建议**: 具体的实施建议

请确保内容专业、具体、可执行。`;

    try {
      const response = await callDeepSeekAPI([
        {
          role: 'system',
          content: '你是一个专业的技术架构师，专门优化和完善技术需求文档。'
        },
        {
          role: 'user',
          content: optimizationPrompt
        }
      ]);

      const sections = parseAIResponse(response);
      
      // 生成四个专业维度的提示词
      const professionalPrompts = await generateProfessionalDimensionPrompts(messages, session, selectedTemplate);
      
      return {
        system_prompt: selectedTemplate.filled_system_prompt,
        user_prompt: selectedTemplate.filled_user_prompt,
        technical_requirements: sections.technical_requirements || generateDefaultTechRequirements(session, selectedTemplate.template),
        project_summary: sections.project_summary || generateDefaultProjectSummary(session, selectedTemplate.template),
        next_steps: sections.next_steps || generateDefaultNextSteps(selectedTemplate.template),
        professional_prompts: professionalPrompts,
        recommended_templates: recommendedTemplates,
        selected_template: selectedTemplate
      };
      
    } catch (error) {
      console.error('AI 优化失败，使用模板默认内容:', error);
      
      // 生成四个专业维度的提示词（备用方案）
      const professionalPrompts = await generateProfessionalDimensionPrompts(messages, session, selectedTemplate);
      
      return {
        system_prompt: selectedTemplate.filled_system_prompt,
        user_prompt: selectedTemplate.filled_user_prompt,
        technical_requirements: generateDefaultTechRequirements(session, selectedTemplate.template),
        project_summary: generateDefaultProjectSummary(session, selectedTemplate.template),
        next_steps: generateDefaultNextSteps(selectedTemplate.template),
        professional_prompts: professionalPrompts,
        recommended_templates: recommendedTemplates,
        selected_template: selectedTemplate
      };
    }
  } else {
    console.log('⚡ 使用传统方式生成提示词');
    
    // 回退到传统生成方式
    const analysis = analyzeConversation(messages, session);
    
    // 增强的AI提示，生成更专业的内容
    const prompt = `作为一名资深的技术架构师和产品专家，请基于以下详细信息生成专业的技术实现提示词：

## 项目背景
**初始需求**: ${analysis.initialIdea}
**项目标题**: ${session.title || '未指定'}

## 用户对话分析
${messages.filter(m => m.role === 'user').map((m, i) => `**用户需求 ${i+1}**: ${m.content}`).join('\n')}

## AI助手回复要点
${messages.filter(m => m.role === 'assistant').slice(-2).map((m, i) => `**关键建议 ${i+1}**: ${m.content.substring(0, 100)}...`).join('\n')}

## 技术领域识别
检测到的技术关键词：${analysis.technicalTerms.join(', ')}
消息轮次：${analysis.messageCount} 轮对话

---

请生成以下专业内容：

### 1. 系统提示词 (System Prompt)
生成一个完整的、可直接使用的系统提示词，要求：
- 包含角色定义（如"你是一位资深的XXX工程师"）
- 明确项目背景和技术要求
- 详细的输出结构要求
- 具体的技术实现指导
- 代码质量和最佳实践要求

### 2. 用户提示词 (User Prompt)  
生成用户可以直接复制使用的需求描述，要求：
- 结构化的需求描述
- 清晰的功能列表
- 技术约束和边界条件
- 期望的交付物

### 3. 技术需求文档
生成详细的技术需求文档，包含：
- 项目概述和目标
- 功能需求分解（至少5个模块）
- 技术架构设计
- 数据库设计要点
- API接口设计原则
- 性能和安全要求
- 测试策略
- 部署方案

### 4. 项目总结
生成项目总结报告，包含：
- 项目基本信息
- 技术复杂度评估
- 开发周期预估
- 团队配置建议
- 风险分析
- 成功指标

### 5. 下一步建议
提供具体的、可执行的下一步行动计划（至少8-10个步骤），每个步骤要包含：
- 具体行动描述
- 预期产出
- 时间预估
- 责任人角色

请确保所有内容都是：
✅ 专业且具体的
✅ 基于实际项目需求的
✅ 可直接执行的
✅ 包含最佳实践的
✅ 考虑了技术风险的

请用中文回复，使用清晰的Markdown格式。`;

    try {
      const response = await callDeepSeekAPI([
        {
          role: 'system',
          content: '你是一个专业的技术架构师和产品经理，擅长将用户需求转化为专业的技术实现方案。'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const sections = parseAIResponse(response);
      
      // 生成专业维度提示词
      const professionalPrompts = await generateProfessionalDimensionPrompts(messages, session);
      
      return {
        system_prompt: sections.system_prompt || '请基于用户需求进行技术实现',
        user_prompt: sections.user_prompt || analysis.initialIdea,
        technical_requirements: sections.technical_requirements || '技术需求待完善',
        project_summary: sections.project_summary || '项目概述',
        next_steps: sections.next_steps || ['继续完善需求细节'],
        professional_prompts: professionalPrompts,
        recommended_templates: recommendedTemplates
      };
      
    } catch (error) {
      console.error('生成提示词失败:', error);
      return generateFallbackPrompts(analysis, recommendedTemplates);
    }
  }
};

// 生成基于对话的技术需求
const generateDefaultTechRequirements = (session: Session, template: PromptTemplate): string => {
  const analysis = analyzeConversation([], session);
  
  return `# ${template.name} - 技术需求文档

## 项目概述
**项目名称**: ${session.title || '技术实现项目'}
**项目描述**: ${session.initial_idea}
**技术类别**: ${template.category}
**选用原因**: 基于项目需求分析，${template.name}最适合当前项目的技术实现

## 核心功能需求
- 基础功能：用户管理、权限控制、数据管理
- 业务功能：${session.initial_idea.includes('管理') ? '系统管理、流程控制' : '业务逻辑处理、数据分析'}
- 扩展功能：API接口、第三方集成、移动端支持

## 技术架构设计
**前端架构**:
- UI框架：${template.category.includes('web') ? 'React/Vue.js + TypeScript' : '根据平台选择'}
- 状态管理：Redux/Vuex 或 Context API
- 组件库：Ant Design 或自定义设计系统

**后端架构**:
- 服务端：${template.category.includes('web') ? 'Node.js/Python/Java' : '根据需求选择'}
- 数据库：MySQL/PostgreSQL + Redis缓存
- API设计：RESTful API + GraphQL（可选）

**部署架构**:
- 容器化：Docker + Kubernetes
- CI/CD：GitLab CI 或 GitHub Actions
- 监控：Prometheus + Grafana

## 技术选型理由
1. **${template.name}**: ${template.description}
2. **技术栈匹配**: 符合项目规模和复杂度要求
3. **开发效率**: 基于成熟的技术栈，开发效率高
4. **可维护性**: 代码结构清晰，便于团队协作

## 非功能性需求
- **性能要求**: 响应时间 < 200ms，支持并发用户 > 1000
- **安全要求**: HTTPS、JWT认证、数据加密、防XSS/CSRF
- **可扩展性**: 微服务架构，支持水平扩展
- **可用性**: 99.9%以上可用性，自动故障转移`;
};

// 生成基于对话的项目总结
const generateDefaultProjectSummary = (session: Session, template: PromptTemplate): string => {
  const complexity = session.initial_idea.length > 50 ? '中高' : '中等';
  const features = session.initial_idea.match(/[，。；,;]/g)?.length || 1;
  
  return `# 项目总结报告

## 基本信息
- **项目类型**: ${template.name}
- **技术领域**: ${template.category}
- **项目复杂度**: ${complexity}复杂度
- **预估功能模块数**: ${features + 2} 个主要模块

## 需求分析
**核心需求**: ${session.initial_idea}

**技术特点**:
- 适用模板：${template.name}
- 技术标签：${template.tags.slice(0, 3).join('、')}
- 开发周期：${features > 3 ? '3-6个月' : '1-3个月'}
- 团队规模：${features > 5 ? '5-8人' : '3-5人'}

## 推荐理由
✅ **高度匹配**: 项目需求与${template.name}模板高度吻合
✅ **技术成熟**: 推荐的技术栈经过市场验证，风险较低
✅ **扩展性强**: 架构设计支持后续功能扩展
✅ **开发效率**: 基于模板可以快速启动项目开发

## 风险评估
- **技术风险**: 🟢 低 - 使用成熟技术栈
- **时间风险**: 🟡 中 - 需要合理规划开发周期
- **成本风险**: 🟢 低 - 开源技术为主，成本可控
- **团队风险**: 🟡 中 - 需要具备相应技术能力的团队

## 成功指标
- 系统稳定性 > 99.5%
- 用户响应时间 < 2秒
- 代码覆盖率 > 80%
- 用户满意度 > 90%`;
};

// 生成基于模板的下一步建议
const generateDefaultNextSteps = (template: PromptTemplate): string[] => {
  const baseSteps = [
    '🔍 深度需求调研：与业务方深入沟通，明确详细功能需求和边界条件',
    '📐 技术架构设计：基于' + template.name + '设计整体技术架构和模块划分',
    '🛠️ 技术栈确认：根据团队技能和项目需求最终确定技术选型',
    '📅 项目计划制定：制定详细的开发计划、里程碑和时间节点',
    '👥 团队组建：确定项目团队成员和职责分工'
  ];
  
  // 根据模板类型添加特定步骤
  if (template.category.includes('web')) {
    baseSteps.push(
      '🎨 UI/UX设计：设计用户界面和交互流程',
      '⚡ MVP开发：优先开发核心功能的最小可行产品',
      '🔗 API设计：设计RESTful API接口和数据结构',
      '🧪 测试策略：制定单元测试、集成测试计划'
    );
  }
  
  if (template.category.includes('mobile')) {
    baseSteps.push(
      '📱 平台适配：确定iOS/Android适配策略',
      '🔔 推送通知：集成消息推送服务',
      '📊 性能优化：移动端性能调优和电量优化',
      '🏪 应用发布：准备应用商店上架流程'
    );
  }
  
  if (template.category.includes('data')) {
    baseSteps.push(
      '📊 数据建模：设计数据仓库和ETL流程',
      '⚡ 实时处理：搭建流式数据处理管道',
      '📈 可视化：开发数据仪表板和报表系统',
      '🔐 数据治理：建立数据质量和安全管控机制'
    );
  }
  
  if (template.category.includes('ai')) {
    baseSteps.push(
      '🤖 模型选型：选择和训练适合的AI模型',
      '💬 对话设计：设计对话流程和意图识别',
      '🧠 知识库：构建领域知识库和FAQ系统',
      '📊 效果评估：建立模型性能监控和优化机制'
    );
  }
  
  baseSteps.push(
    '🚀 部署上线：配置生产环境和CI/CD流水线',
    '📈 监控运维：建立系统监控、日志和告警机制',
    '🔄 持续优化：基于用户反馈持续迭代和改进'
  );
  
  return baseSteps;
};

// 生成高质量回退提示词
const generateFallbackPrompts = (analysis: any, recommendedTemplates: TemplateMatch[]): GeneratedPrompts => {
  const projectType = analysis.initialIdea.includes('管理') ? '管理系统' : 
                     analysis.initialIdea.includes('平台') ? '平台系统' : 
                     analysis.initialIdea.includes('应用') ? '应用系统' : '业务系统';
  
  const complexity = analysis.initialIdea.length > 50 ? '中高复杂度' : '中等复杂度';
  const features = analysis.technicalTerms.length;
  
  return {
    system_prompt: `你是一位拥有10年以上经验的资深技术架构师和全栈工程师，专精于${projectType}的设计与开发。

## 项目背景
${analysis.initialIdea}

## 技术要求
- 技术领域：${analysis.technicalTerms.length > 0 ? analysis.technicalTerms.join(', ') : '全栈开发'}
- 项目复杂度：${complexity}
- 预期功能模块：${features + 3}个主要模块

## 请提供完整的技术实现方案

### 1. 系统架构设计
- 整体架构模式（单体/微服务/分层架构）
- 前端架构设计（组件化、状态管理、路由设计）
- 后端架构设计（API层、业务层、数据层）
- 数据库架构（主库、缓存、分库分表策略）

### 2. 技术选型方案
- 前端技术栈选择及理由
- 后端技术栈选择及理由
- 数据库选择及理由
- 中间件和第三方服务选择

### 3. 功能模块设计
- 核心功能模块拆分
- 模块间依赖关系
- 接口设计规范
- 数据流转设计

### 4. 非功能性需求
- 性能要求：并发量、响应时间、吞吐量
- 安全要求：认证授权、数据加密、漏洞防护
- 可用性：高可用架构、故障转移、监控告警
- 可扩展性：水平扩展、垂直扩展能力

### 5. 开发和部署
- 开发规范和代码质量标准
- 测试策略：单元测试、集成测试、性能测试
- CI/CD流水线设计
- 容器化和云原生部署方案

请确保方案具备：
✅ 技术先进性和成熟度平衡
✅ 可扩展性和可维护性
✅ 成本效益最优化
✅ 团队技能匹配度
✅ 项目时间节点可控

请用中文回复，提供详细的技术实现代码示例。`,

    user_prompt: `项目需求：${analysis.initialIdea}

## 技术要求
- 项目类型：${projectType}
- 复杂度：${complexity}
- 技术领域：${analysis.technicalTerms.length > 0 ? analysis.technicalTerms.join(', ') : '待确定'}

## 功能要求
基于以上项目描述，请提供完整的技术实现方案，包括：
1. 详细的系统架构设计
2. 技术栈选择和理由说明
3. 数据库设计和API接口规划
4. 关键功能的代码实现示例
5. 部署和运维方案
6. 项目实施的时间节点规划

请确保方案的可行性和最佳实践compliance。`,

    technical_requirements: `# ${projectType} - 技术需求规格书

## 1. 项目概述
**项目名称**: ${analysis.initialIdea.slice(0, 20)}...系统
**项目描述**: ${analysis.initialIdea}
**技术类型**: ${projectType}
**复杂度级别**: ${complexity}

## 2. 功能性需求
### 2.1 核心功能模块
- **用户管理模块**: 用户注册、登录、权限控制、个人信息管理
- **业务核心模块**: ${analysis.initialIdea.includes('管理') ? '数据管理、流程控制、报表分析' : '业务逻辑处理、数据展示、交互操作'}
- **系统管理模块**: 系统配置、日志管理、监控告警
- **数据接口模块**: API接口、第三方集成、数据同步

### 2.2 技术功能要求
- **前端界面**: 响应式设计、用户体验优化、组件化开发
- **后端服务**: RESTful API、数据验证、业务逻辑处理
- **数据存储**: 数据持久化、事务处理、数据备份
- **安全机制**: 身份认证、权限控制、数据加密

## 3. 非功能性需求
### 3.1 性能要求
- **响应时间**: 页面加载 < 2秒，API响应 < 500ms
- **并发处理**: 支持同时在线用户 > 500人
- **数据处理**: 支持单表数据量 > 100万条
- **存储容量**: 支持数据存储 > 1TB

### 3.2 可靠性要求
- **系统可用性**: 99.5%以上运行时间
- **数据安全**: 定期备份、灾难恢复机制
- **故障恢复**: 自动故障检测和恢复
- **监控告警**: 实时系统状态监控

### 3.3 安全性要求
- **身份认证**: JWT token、多因子认证支持
- **访问控制**: RBAC权限模型、细粒度权限控制
- **数据保护**: HTTPS传输、敏感数据加密存储
- **安全审计**: 操作日志记录、安全事件追踪

## 4. 技术架构要求
### 4.1 技术栈要求
- **前端**: ${analysis.technicalTerms.includes('react') ? 'React + TypeScript' : 'Vue.js/React'} + 现代化UI框架
- **后端**: ${analysis.technicalTerms.includes('python') ? 'Python FastAPI' : 'Node.js/Java Spring'} + 微服务架构
- **数据库**: ${analysis.technicalTerms.includes('mysql') ? 'MySQL' : 'PostgreSQL/MySQL'} + Redis缓存
- **部署**: Docker容器化 + Kubernetes编排

### 4.2 架构模式
- **前端架构**: SPA单页应用 + 组件化开发
- **后端架构**: 分层架构 + 微服务拆分
- **数据架构**: 主从分离 + 读写分离
- **部署架构**: 云原生 + DevOps自动化

## 5. 开发和交付要求
### 5.1 开发规范
- 代码规范：ESLint + Prettier格式化
- 版本控制：Git工作流 + Code Review
- 文档要求：API文档 + 开发文档
- 测试覆盖率：单元测试 > 80%

### 5.2 交付标准
- 功能完整性：100%需求实现
- 性能达标：满足性能指标要求
- 安全合规：通过安全测试验证
- 文档齐全：用户手册 + 运维手册`,

    project_summary: `# ${projectType}项目总结报告

## 📊 项目基本信息
- **项目类型**: ${projectType}
- **技术领域**: ${analysis.technicalTerms.length > 0 ? analysis.technicalTerms.join('、') : '全栈开发'}
- **复杂度评估**: ${complexity}
- **预估模块数**: ${features + 3}个核心模块
- **对话轮次**: ${analysis.messageCount}轮需求分析

## 🎯 需求分析摘要
**核心需求**: ${analysis.initialIdea}

**技术特征**:
- 开发类型：${projectType}
- 技术栈：${analysis.technicalTerms.length > 0 ? analysis.technicalTerms.join('、') : '现代化技术栈'}
- 预估工期：${features > 5 ? '4-6个月' : '2-4个月'}
- 团队规模：${features > 3 ? '5-8人' : '3-5人'}

## ⭐ 项目优势
✅ **需求明确**: 经过${analysis.messageCount}轮对话，需求相对清晰
✅ **技术可行**: 基于成熟技术栈，实现风险较低
✅ **架构合理**: 采用分层架构，便于维护和扩展
✅ **标准化**: 遵循行业最佳实践和开发规范

## ⚠️ 风险评估
- **技术风险**: 🟢 低风险 - 采用成熟技术方案
- **进度风险**: 🟡 中等风险 - 需要合理控制开发节奏
- **人员风险**: 🟡 中等风险 - 需要技术能力匹配的团队
- **需求风险**: 🟢 低风险 - 需求相对明确稳定

## 📈 成功关键指标
| 指标类型 | 目标值 | 备注 |
|---------|--------|------|
| 系统稳定性 | > 99.5% | 7×24小时稳定运行 |
| 响应性能 | < 2秒 | 页面加载时间 |
| 用户满意度 | > 90% | 用户体验评分 |
| 代码质量 | > 80% | 测试覆盖率 |
| 按时交付 | 100% | 里程碑节点控制 |

## 🔮 发展前景
- **功能扩展**: 具备良好的扩展性，支持新功能模块接入
- **性能优化**: 架构支持水平扩展，可应对业务增长
- **技术演进**: 基于现代化技术栈，便于技术升级迭代
- **商业价值**: ${projectType}具有明确的业务价值和应用场景`,

    next_steps: [
      '🔍 需求细化分析：召开需求评审会议，与业务方确认详细功能边界和验收标准',
      '📐 系统架构设计：基于需求分析结果，设计整体技术架构和模块拆分方案',
      '👥 团队组建配置：确定项目团队成员、技能要求和职责分工安排',
      '🛠️ 技术选型决策：结合团队技能和项目特点，最终确定技术栈和开发工具',
      '📅 项目计划制定：制定详细的开发计划、里程碑节点和风险控制措施',
      '🎨 UI/UX原型设计：设计用户界面原型和交互流程，确保用户体验',
      '💾 数据库设计：设计数据模型、表结构关系和数据流转方案',
      '🔗 API接口设计：定义RESTful API规范、接口文档和数据格式',
      '⚡ MVP核心开发：优先开发核心功能模块，快速验证技术方案可行性',
      '🧪 测试环境搭建：搭建开发、测试、生产环境和CI/CD流水线',
      '📊 监控体系建设：建立系统监控、日志收集和性能分析机制',
      '🚀 部署上线准备：配置生产环境、数据迁移和用户培训计划',
      '🔄 运维优化迭代：基于用户反馈和运行数据持续优化改进'
    ],
    professional_prompts: generateDefaultProfessionalPrompts({ 
      title: analysis.initialIdea.slice(0, 20) + '系统', 
      initial_idea: analysis.initialIdea,
      id: 'fallback',
      status: 'active', 
      current_requirements: {},
      created_at: new Date().toISOString()
    } as Session),
    recommended_templates: recommendedTemplates
  };
};

// 解析 AI 回复，提取各个部分
const parseAIResponse = (response: string) => {
  const sections: any = {};
  
  // 尝试提取系统提示词
  const systemMatch = response.match(/系统提示词[：:]\s*([\s\S]*?)(?=\n\d+\.|用户提示词|技术需求|项目总结|下一步建议|$)/i);
  if (systemMatch) {
    sections.system_prompt = systemMatch[1].trim();
  }
  
  // 尝试提取用户提示词
  const userMatch = response.match(/用户提示词[：:]\s*([\s\S]*?)(?=\n\d+\.|技术需求|项目总结|下一步建议|$)/i);
  if (userMatch) {
    sections.user_prompt = userMatch[1].trim();
  }
  
  // 尝试提取技术需求
  const techMatch = response.match(/技术需求[：:]\s*([\s\S]*?)(?=\n\d+\.|项目总结|下一步建议|$)/i);
  if (techMatch) {
    sections.technical_requirements = techMatch[1].trim();
  }
  
  // 尝试提取项目总结
  const summaryMatch = response.match(/项目总结[：:]\s*([\s\S]*?)(?=\n\d+\.|下一步建议|$)/i);
  if (summaryMatch) {
    sections.project_summary = summaryMatch[1].trim();
  }
  
  // 尝试提取下一步建议
  const stepsMatch = response.match(/下一步建议[：:]\s*([\s\S]*?)$/i);
  if (stepsMatch) {
    const stepsText = stepsMatch[1].trim();
    sections.next_steps = stepsText.split('\n')
      .filter(line => line.trim() && (line.includes('•') || line.includes('-') || line.includes('1.') || line.includes('2.')))
      .map(line => line.replace(/^[•\-\d\.\s]+/, '').trim())
      .filter(step => step.length > 0);
  }
  
  return sections;
}; 

// 生成四个专业维度的提示词
export const generateProfessionalDimensionPrompts = async (
  messages: Message[],
  session: Session,
  selectedTemplate?: any
): Promise<GeneratedPrompts['professional_prompts']> => {
  
  const conversationContext = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  const projectContext = `
项目标题: ${session.title || '新项目'}
初始想法: ${session.initial_idea || ''}
对话历史:
${conversationContext}
`;

  console.log('🎯 开始生成四个专业维度的提示词...');

  try {
    // 使用AI一次性生成四个维度的提示词
    const response = await callDeepSeekAPI([
      {
        role: 'system',
        content: `你是世界级的产品专家，需要基于项目对话生成四个专业维度的AI提示词模板。

每个提示词都要：
1. 专业且实用，可以直接给AI使用
2. 包含具体的结构化要求
3. 提供清晰的使用指南

请严格按照以下JSON格式输出：
{
  "prd": {
    "title": "产品需求文档(PRD)生成提示词",
    "prompt": "详细的PRD生成提示词内容...",
    "description": "用于生成专业的产品需求文档",
    "usage_guide": "将此提示词输入给Claude/GPT等AI，可生成完整的PRD文档"
  },
  "technical_implementation": {
    "title": "技术架构实现提示词",
    "prompt": "详细的技术实现提示词内容...",
    "description": "用于生成技术架构和实现方案",
    "usage_guide": "适合技术团队使用，可生成代码架构和技术文档"
  },
  "visual_design": {
    "title": "UI/UX设计提示词",
    "prompt": "详细的视觉设计提示词内容...",
    "description": "用于生成界面设计和用户体验方案",
    "usage_guide": "可用于Figma、Sketch等设计工具的AI插件"
  },
  "project_management": {
    "title": "项目管理提示词",
    "prompt": "详细的项目管理提示词内容...",
    "description": "用于生成项目计划和管理方案",
    "usage_guide": "帮助项目经理制定时间线和资源分配"
  }
}`
      },
      {
        role: 'user',
        content: `请基于以下项目信息，生成四个专业维度的AI提示词：

${projectContext}

${selectedTemplate ? `
参考模板: ${selectedTemplate.template.name}
模板描述: ${selectedTemplate.template.description}
` : ''}

要求：
1. 每个提示词都要结合项目的具体需求
2. 内容要专业、详细、可执行
3. 确保生成的文档可以直接用于项目开发
4. 严格按照JSON格式输出，不要添加任何markdown标记`
      }
    ]);

    // 解析AI返回的JSON
    let parsedPrompts;
    try {
      // 尝试直接解析
      parsedPrompts = JSON.parse(response);
    } catch (parseError) {
      // 如果直接解析失败，尝试提取JSON部分
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedPrompts = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析AI返回的JSON格式');
      }
    }

    console.log('✅ 成功生成四个专业维度的提示词');
    return parsedPrompts;

  } catch (error) {
    console.error('❌ 生成专业提示词失败，使用默认模板:', error);
    
    // 返回默认的专业提示词模板
    return generateDefaultProfessionalPrompts(session, selectedTemplate);
  }
};

// 新增：BP（WebPPT）生成提示词（专业版）
export const generateBPWebPPTPrompt = (projectTitle: string) => {
  return `你是一位资深投资顾问与产品架构师，请为“${projectTitle}”生成一份可直接用于 WebPPT 的商业计划书（中文）。

强制输出 8 个章节，每个章节控制在 1 张幻灯：
1) 执行摘要：一句话定位、关键价值、核心KPI（TAM/SAM/SOM、上市时间、首年收入目标）
2) 问题与机会（JTBD）：3–5 条，配对“现状/痛点/机会”
3) 解决方案与价值主张：端到端体验（输入→过程→输出），3 个关键卖点
4) 市场与竞争：TAM/SAM/SOM 表、竞争对位表（竞品/优势/劣势/差异化）
5) 商业模式与定价：收入来源、分层定价表（套餐/价格/功能/目标）
6) 技术与数据：架构一句话、数据流一句话、核心算法卡片（名称/目的/实现/替代）
7) GTM 与指标：渠道清单（成本、效果、时间线）、CAC/LTV/回本周期与看板指标
8) 里程碑与风险：阶段/时长/交付、前三大风险与对策

要求：
- 严格使用 Markdown，分节输出，避免长段落，尽量用表格/条目
- 数据要给出区间或假设，不留空白
- 语气务实，避免夸张口号`;
};

// 生成默认的专业提示词（备用方案）
const generateDefaultProfessionalPrompts = (
  session: Session,
  selectedTemplate?: any
): GeneratedPrompts['professional_prompts'] => {
  
  const projectName = session.title || '新项目';
  const projectIdea = session.initial_idea || '项目需求';

  return {
    prd: {
      title: "产品需求文档(PRD)生成提示词",
      prompt: `# ${projectName} - 产品需求文档生成

## 项目背景
${projectIdea}

## 请生成包含以下内容的完整PRD：

### 1. 产品概述
- 产品定位和目标
- 核心价值主张
- 目标用户群体

### 2. 功能需求
- 核心功能模块详细说明
- 用户故事和用例
- 功能优先级排序

### 3. 非功能需求
- 性能要求
- 安全性要求
- 兼容性要求

### 4. 用户体验设计
- 关键用户流程
- 界面设计要求
- 交互设计规范

### 5. 技术约束
- 技术栈选择依据
- 系统架构建议
- 第三方集成需求

请确保内容具体、可执行，适合开发团队使用。`,
      description: "用于生成专业的产品需求文档，包含完整的功能需求、用户体验和技术约束",
      usage_guide: "将此提示词输入给Claude、GPT等AI模型，可生成完整的PRD文档，适合产品经理和开发团队使用"
    },
    
    technical_implementation: {
      title: "技术架构实现提示词",
      prompt: `# ${projectName} - 技术实现方案

## 项目需求
${projectIdea}

## 请设计完整的技术实现方案：

### 1. 系统架构设计
- 整体架构模式选择（微服务/单体/分层等）
- 核心模块划分和职责
- 数据流设计

### 2. 技术栈选择
- 前端框架和主要依赖
- 后端技术栈和框架
- 数据库选型和设计
- 缓存策略

### 3. API设计
- RESTful API 结构设计
- 核心接口定义
- 数据格式规范
- 错误处理机制

### 4. 数据库设计
- 核心数据表结构
- 关系设计
- 索引策略
- 数据迁移方案

### 5. 部署和运维
- 部署架构设计
- CI/CD 流程
- 监控和日志策略
- 安全措施

### 6. 开发规范
- 代码规范
- Git 工作流
- 测试策略
- 文档要求

请提供具体的代码示例和配置文件。`,
      description: "用于生成完整的技术架构和实现方案，包含系统设计、技术选型和开发规范",
      usage_guide: "适合技术负责人和开发团队使用，可生成详细的技术文档和代码示例"
    },

    visual_design: {
      title: "UI/UX设计提示词",
      prompt: `# ${projectName} - 视觉设计方案

## 项目背景
${projectIdea}

## 请设计完整的UI/UX方案：

### 1. 设计理念
- 设计风格定位（现代简约/商务专业/活泼友好等）
- 色彩主题选择和理由
- 品牌调性体现

### 2. 视觉系统
- 主色调和辅助色彩方案
- 字体系统选择
- 图标风格定义
- 间距和布局规范

### 3. 界面设计
- 关键页面wireframe设计
- 导航结构设计
- 组件库规划
- 响应式设计方案

### 4. 用户体验设计
- 用户旅程地图
- 关键交互流程设计
- 微交互和动效建议
- 无障碍设计考虑

### 5. 移动端适配
- 移动端界面布局
- 触控交互设计
- 手势操作定义
- 设备适配策略

### 6. 设计规范
- UI组件使用规范
- 设计文件组织结构
- 开发交付标准
- 迭代更新流程

请提供具体的设计参考和实现建议。`,
      description: "用于生成完整的UI/UX设计方案，包含视觉系统、界面设计和用户体验",
      usage_guide: "适合UI/UX设计师使用，可配合Figma、Sketch等设计工具的AI插件生成设计方案"
    },

    project_management: {
      title: "项目管理提示词",
      prompt: `# ${projectName} - 项目管理方案

## 项目概述
${projectIdea}

## 请制定完整的项目管理计划：

### 1. 项目范围管理
- 项目目标明确定义
- 工作分解结构(WBS)
- 项目边界和约束
- 变更管理流程

### 2. 时间管理
- 项目里程碑规划
- 详细任务分解和估时
- 关键路径分析
- 进度跟踪机制

### 3. 资源管理
- 团队角色和职责定义
- 人力资源配置计划
- 技能要求和培训需求
- 外部资源协调

### 4. 质量管理
- 质量标准定义
- 质量保证流程
- 测试和验收标准
- 持续改进机制

### 5. 风险管理
- 风险识别和评估
- 风险应对策略
- 风险监控机制
- 应急预案

### 6. 沟通管理
- 沟通计划和渠道
- 会议机制设计
- 报告和文档标准
- 利益相关者管理

### 7. 成本管理
- 预算规划和分配
- 成本控制机制
- 财务报告要求
- ROI评估标准

请提供具体的模板和工具推荐。`,
      description: "用于生成完整的项目管理计划，包含时间、资源、质量、风险等全方位管理",
      usage_guide: "适合项目经理使用，可配合Monday.com、Asana等项目管理工具制定详细的执行计划"
    }
  };
}; 