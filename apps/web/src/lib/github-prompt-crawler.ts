// GitHub 提示词爬取器
import type { PromptTemplate } from './prompt-templates';

export interface GitHubPromptSource {
  repo: string;
  path: string;
  description: string;
  type: 'awesome-list' | 'prompt-collection' | 'prompt-engineering';
}

export interface CrawledPrompt {
  title: string;
  content: string;
  category: string;
  source: string;
  description?: string;
  tags: string[];
  variables?: string[];
  examples?: string[];
}

// 著名的GitHub提示词仓库
export const GITHUB_PROMPT_SOURCES: GitHubPromptSource[] = [
  {
    repo: 'f/awesome-chatgpt-prompts',
    path: 'prompts.csv',
    description: '最受欢迎的ChatGPT提示词集合',
    type: 'awesome-list'
  },
  {
    repo: 'PlexPt/awesome-chatgpt-prompts-zh',
    path: 'prompts-zh.json',
    description: '中文ChatGPT提示词集合',
    type: 'awesome-list'
  },
  {
    repo: 'microsoft/promptbase',
    path: 'prompts',
    description: '微软官方提示词工程库',
    type: 'prompt-engineering'
  },
  {
    repo: 'prompt-engineering/prompt-engineering',
    path: 'examples',
    description: '提示词工程最佳实践',
    type: 'prompt-engineering'
  },
  {
    repo: 'dair-ai/Prompt-Engineering-Guide',
    path: 'guides',
    description: '提示词工程指南',
    type: 'prompt-engineering'
  },
  {
    repo: 'rockbenben/ChatGPT-Shortcut',
    path: 'public/prompts.json',
    description: 'ChatGPT快捷指令集合',
    type: 'prompt-collection'
  }
];

// GitHub API相关配置
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

// 爬取单个仓库的提示词
export const crawlPromptsFromRepo = async (source: GitHubPromptSource): Promise<CrawledPrompt[]> => {
  try {
    console.log(`🔍 开始爬取: ${source.repo}`);
    
    const crawledPrompts: CrawledPrompt[] = [];
    
    switch (source.type) {
      case 'awesome-list':
        if (source.repo === 'f/awesome-chatgpt-prompts') {
          crawledPrompts.push(...await crawlAwesomeChatGPTPrompts(source));
        } else if (source.repo === 'PlexPt/awesome-chatgpt-prompts-zh') {
          crawledPrompts.push(...await crawlChinesePrompts(source));
        }
        break;
      
      case 'prompt-collection':
        if (source.repo === 'rockbenben/ChatGPT-Shortcut') {
          crawledPrompts.push(...await crawlChatGPTShortcuts(source));
        }
        break;
      
      case 'prompt-engineering':
        crawledPrompts.push(...await crawlPromptEngineeringRepo(source));
        break;
    }
    
    console.log(`✅ ${source.repo} 爬取完成，获得 ${crawledPrompts.length} 个提示词`);
    return crawledPrompts;
    
  } catch (error) {
    console.error(`❌ 爬取 ${source.repo} 失败:`, error);
    return [];
  }
};

// 爬取 awesome-chatgpt-prompts (CSV格式)
const crawlAwesomeChatGPTPrompts = async (source: GitHubPromptSource): Promise<CrawledPrompt[]> => {
  const url = `${GITHUB_RAW_BASE}/${source.repo}/main/${source.path}`;
  
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    
    const lines = csvText.split('\n').slice(1); // 跳过表头
    const prompts: CrawledPrompt[] = [];
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      // 解析CSV行 (简单解析，处理引号内的逗号)
      const matches = line.match(/^"([^"]+)","(.+)"$/);
      if (matches) {
        const [, title, content] = matches;
        
        prompts.push({
          title: title.trim(),
          content: content.trim(),
          category: categorizePrompt(title, content),
          source: source.repo,
          description: `来自 ${source.description}`,
          tags: extractTags(title, content),
          variables: extractVariables(content)
        });
      }
    }
    
    return prompts;
  } catch (error) {
    console.error('解析CSV失败:', error);
    return [];
  }
};

// 爬取中文提示词 (JSON格式)
const crawlChinesePrompts = async (source: GitHubPromptSource): Promise<CrawledPrompt[]> => {
  const url = `${GITHUB_RAW_BASE}/${source.repo}/main/${source.path}`;
  
  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    
    const prompts: CrawledPrompt[] = [];
    
    if (Array.isArray(jsonData)) {
      for (const item of jsonData) {
        prompts.push({
          title: item.act || item.title || '未命名',
          content: item.prompt || item.content || '',
          category: categorizePrompt(item.act || item.title, item.prompt || item.content),
          source: source.repo,
          description: `来自 ${source.description}`,
          tags: extractTags(item.act || item.title, item.prompt || item.content),
          variables: extractVariables(item.prompt || item.content)
        });
      }
    }
    
    return prompts;
  } catch (error) {
    console.error('解析JSON失败:', error);
    return [];
  }
};

// 爬取ChatGPT快捷指令
const crawlChatGPTShortcuts = async (source: GitHubPromptSource): Promise<CrawledPrompt[]> => {
  const url = `${GITHUB_RAW_BASE}/${source.repo}/main/${source.path}`;
  
  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    
    const prompts: CrawledPrompt[] = [];
    
    for (const item of jsonData) {
      if (item.prompt) {
        prompts.push({
          title: item.title || '未命名',
          content: item.prompt,
          category: item.remark || categorizePrompt(item.title, item.prompt),
          source: source.repo,
          description: item.description || `来自 ${source.description}`,
          tags: [...(item.tags || []), ...extractTags(item.title, item.prompt)],
          variables: extractVariables(item.prompt)
        });
      }
    }
    
    return prompts;
  } catch (error) {
    console.error('解析快捷指令失败:', error);
    return [];
  }
};

// 爬取提示词工程仓库 (通过API获取文件列表)
const crawlPromptEngineeringRepo = async (source: GitHubPromptSource): Promise<CrawledPrompt[]> => {
  const apiUrl = `${GITHUB_API_BASE}/repos/${source.repo}/contents/${source.path}`;
  
  try {
    const response = await fetch(apiUrl);
    const files = await response.json();
    
    const prompts: CrawledPrompt[] = [];
    
    if (Array.isArray(files)) {
      for (const file of files.slice(0, 10)) { // 限制前10个文件
        if (file.type === 'file' && (file.name.endsWith('.md') || file.name.endsWith('.txt'))) {
          try {
            const contentResponse = await fetch(file.download_url);
            const content = await contentResponse.text();
            
            prompts.push({
              title: file.name.replace(/\.(md|txt)$/, ''),
              content: content.slice(0, 2000), // 限制长度
              category: 'prompt-engineering',
              source: source.repo,
              description: `来自 ${source.description}`,
              tags: ['prompt-engineering', 'best-practices'],
              variables: extractVariables(content)
            });
          } catch (error) {
            console.warn(`跳过文件 ${file.name}:`, error);
          }
        }
      }
    }
    
    return prompts;
  } catch (error) {
    console.error('爬取工程仓库失败:', error);
    return [];
  }
};

// 智能分类提示词（扩展覆盖常见专业域）
const categorizePrompt = (title: string, content: string): string => {
  const text = `${title} ${content}`.toLowerCase();

  // Metaphysics
  if ([
    'bazi','八字','紫微','占星','astrology','tarot','塔罗','风水','fengshui','奇门','qimen','六爻','梅花','合盘','synastry'
  ].some(k => text.includes(k))) return 'metaphysics';

  // Product / PRD
  if (['prd','产品需求','需求文档','mvp','产品','roadmap','用户故事'].some(k => text.includes(k))) return 'product';

  // Engineering / Development
  if ([
    'code','程序','开发','programming','工程','architecture','架构','api','后端','前端','微服务'
  ].some(k => text.includes(k))) return 'engineering';

  // Growth / Marketing
  if (['growth','营销','增长','获客','留存','定价','pricing','unit economics'].some(k => text.includes(k))) return 'growth';

  // Capital / Fundraising
  if (['bp','pitch','融资','投资','募资','term sheet','估值'].some(k => text.includes(k))) return 'capital';

  // AI / Data / Blockchain / IoT / Mobile / Web
  if (['ai','chatbot','nlp','llm'].some(k => text.includes(k))) return 'ai-development';
  if (['data','数据','分析','analytics','etl','warehouse','lake'].some(k => text.includes(k))) return 'data-science';
  if (['blockchain','智能合约','solidity','web3','nft','defi'].some(k => text.includes(k))) return 'blockchain';
  if (['iot','设备','传感器','mqtt','物联网'].some(k => text.includes(k))) return 'iot';
  if (['mobile','ios','android','react native','flutter'].some(k => text.includes(k))) return 'mobile-development';
  if (['web','frontend','前端','vite','react','vue','next.js'].some(k => text.includes(k))) return 'web-development';

  // Writing / Analysis / Design / Business / Education
  if (['write','写作','文章','writing'].some(k => text.includes(k))) return 'writing';
  if (['analyze','分析','data','数据','research','研究'].some(k => text.includes(k))) return 'analysis';
  if (['design','设计','ui','创意','ux'].some(k => text.includes(k))) return 'design';
  if (['business','商业','marketing','营销','strategy','战略'].some(k => text.includes(k))) return 'business';
  if (['education','教育','学习','teach','课程'].some(k => text.includes(k))) return 'education';

  return 'general';
};

// 提取标签
const extractTags = (title: string, content: string): string[] => {
  const text = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];
  
  const tagMappings = {
    'code': ['coding', 'programming', 'development'],
    'write': ['writing', 'content', 'creative'],
    'analyze': ['analysis', 'data', 'research'],
    'design': ['design', 'ui', 'creative'],
    'business': ['business', 'marketing', 'strategy'],
    'education': ['education', 'learning', 'teaching']
  };
  
  Object.entries(tagMappings).forEach(([key, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.push(key);
    }
  });
  
  return [...new Set(tags)];
};

// 提取变量 (查找 {} 或 [] 包围的内容)
const extractVariables = (content: string): string[] => {
  const variables: string[] = [];
  
  // 匹配 {变量名} 格式
  const braceMatches = content.match(/\{([^}]+)\}/g);
  if (braceMatches) {
    variables.push(...braceMatches.map(match => match.slice(1, -1)));
  }
  
  // 匹配 [变量名] 格式
  const bracketMatches = content.match(/\[([^\]]+)\]/g);
  if (bracketMatches) {
    variables.push(...bracketMatches.map(match => match.slice(1, -1)));
  }
  
  return [...new Set(variables)];
};

// 爬取所有仓库的提示词
export const crawlAllPrompts = async (): Promise<CrawledPrompt[]> => {
  console.log('🚀 开始爬取GitHub提示词库...');
  
  const allPrompts: CrawledPrompt[] = [];
  
  for (const source of GITHUB_PROMPT_SOURCES) {
    try {
      const prompts = await crawlPromptsFromRepo(source);
      allPrompts.push(...prompts);
      
      // 添加延迟避免API限制
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`爬取 ${source.repo} 失败:`, error);
    }
  }
  
  console.log(`🎉 爬取完成！共获得 ${allPrompts.length} 个提示词`);
  
  // 去重和清理
  const uniquePrompts = deduplicatePrompts(allPrompts);
  console.log(`📊 去重后剩余 ${uniquePrompts.length} 个提示词`);
  
  return uniquePrompts;
};

// 去重提示词
const deduplicatePrompts = (prompts: CrawledPrompt[]): CrawledPrompt[] => {
  const seen = new Set<string>();
  const unique: CrawledPrompt[] = [];
  
  for (const prompt of prompts) {
    const key = `${prompt.title}-${prompt.content.slice(0, 100)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(prompt);
    }
  }
  
  return unique;
};

// 将爬取的提示词转换为模板格式
export const convertCrawledToTemplate = (crawled: CrawledPrompt): PromptTemplate => {
  return {
    id: `crawled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: crawled.title,
    category: crawled.category,
    description: crawled.description || '从GitHub爬取的提示词',
    systemTemplate: crawled.content,
    userTemplate: `请基于以下需求：{USER_REQUEST}\n\n${crawled.content}`,
    variables: crawled.variables || ['USER_REQUEST'],
    examples: crawled.examples,
    tags: [...crawled.tags, 'github', 'crawled']
  };
};

// 搜索和过滤爬取的提示词
export const searchCrawledPrompts = (
  prompts: CrawledPrompt[], 
  query: string, 
  category?: string
): CrawledPrompt[] => {
  let filtered = prompts;
  
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.content.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  return filtered;
};

// 获取爬取统计信息
export const getCrawlStats = (prompts: CrawledPrompt[]) => {
  const stats = {
    total: prompts.length,
    byCategory: {} as Record<string, number>,
    bySource: {} as Record<string, number>,
    totalVariables: 0
  };
  
  prompts.forEach(prompt => {
    // 按分类统计
    stats.byCategory[prompt.category] = (stats.byCategory[prompt.category] || 0) + 1;
    
    // 按来源统计
    stats.bySource[prompt.source] = (stats.bySource[prompt.source] || 0) + 1;
    
    // 变量统计
    stats.totalVariables += prompt.variables?.length || 0;
  });
  
  return stats;
}; 