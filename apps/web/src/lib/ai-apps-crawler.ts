// AI应用自动抓取系统
import { AIApp } from './ai-apps-ranking';

// 数据源配置
export interface DataSource {
  id: string;
  name: string;
  url: string;
  type: 'api' | 'web' | 'rss' | 'manual';
  enabled: boolean;
  priority: number;
  lastFetch: Date | null;
  fetchInterval: number; // 分钟
  config: {
    apiKey?: string;
    headers?: Record<string, string>;
    selectors?: Record<string, string>;
    mapping?: Record<string, string>;
  };
}

// 抓取任务状态
export interface CrawlTask {
  id: string;
  sourceId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  result?: {
    appsFound: number;
    appsUpdated: number;
    appsAdded: number;
    errors: string[];
  };
  error?: string;
}

// 数据源列表 - 专注于最新、最流行的AI应用
const dataSources: DataSource[] = [
  {
    id: 'producthunt',
    name: 'Product Hunt',
    url: 'https://api.producthunt.com/v2/api/graphql',
    type: 'api',
    enabled: true,
    priority: 1,
    lastFetch: null,
    fetchInterval: 720, // 12小时 - 更频繁抓取
    config: {
      apiKey: process.env.PRODUCTHUNT_API_KEY,
      headers: {
        'Authorization': `Bearer ${process.env.PRODUCTHUNT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      mapping: {
        name: 'name',
        description: 'tagline',
        website: 'website',
        category: 'category',
        users: 'votes_count'
      }
    }
  },
  {
    id: 'futurepedia',
    name: 'Futurepedia',
    url: 'https://www.futurepedia.io/tools',
    type: 'web',
    enabled: true,
    priority: 2,
    lastFetch: null,
    fetchInterval: 360, // 6小时 - 非常频繁
    config: {
      selectors: {
        appCard: '.tool-card',
        name: '.tool-name',
        description: '.tool-description',
        website: '.tool-link',
        category: '.tool-category',
        pricing: '.tool-pricing',
        features: '.tool-features'
      }
    }
  },
  {
    id: 'thereisanaiforthat',
    name: 'There\'s An AI For That',
    url: 'https://theresanaiforthat.com/',
    type: 'web',
    enabled: true,
    priority: 3,
    lastFetch: null,
    fetchInterval: 480, // 8小时
    config: {
      selectors: {
        appCard: '.ai-tool',
        name: '.tool-title',
        description: '.tool-description',
        website: '.tool-url',
        category: '.tool-category',
        tags: '.tool-tags'
      }
    }
  },
  {
    id: 'aitoolhub',
    name: 'AI Tool Hub',
    url: 'https://aitoolhub.com/',
    type: 'web',
    enabled: true,
    priority: 4,
    lastFetch: null,
    fetchInterval: 600, // 10小时
    config: {
      selectors: {
        appCard: '.tool-item',
        name: '.tool-name',
        description: '.tool-desc',
        website: '.tool-link',
        category: '.tool-cat',
        pricing: '.tool-price'
      }
    }
  },
  {
    id: 'aitoolsdirectory',
    name: 'AI Tools Directory',
    url: 'https://aitoolsdirectory.com/',
    type: 'web',
    enabled: true,
    priority: 5,
    lastFetch: null,
    fetchInterval: 720, // 12小时
    config: {
      selectors: {
        appCard: '.tool-card',
        name: '.tool-title',
        description: '.tool-summary',
        website: '.tool-website',
        category: '.tool-category',
        tags: '.tool-tags'
      }
    }
  },
  {
    id: 'aitoolguide',
    name: 'AI Tool Guide',
    url: 'https://aitoolguide.com/',
    type: 'web',
    enabled: true,
    priority: 6,
    lastFetch: null,
    fetchInterval: 720, // 12小时
    config: {
      selectors: {
        appCard: '.tool-listing',
        name: '.tool-name',
        description: '.tool-description',
        website: '.tool-url',
        category: '.tool-type',
        features: '.tool-features'
      }
    }
  },
  {
    id: 'github-trending-ai',
    name: 'GitHub AI Projects',
    url: 'https://github.com/trending?q=AI&since=daily&spoken_language_code=zh',
    type: 'web',
    enabled: true,
    priority: 7,
    lastFetch: null,
    fetchInterval: 360, // 6小时
    config: {
      selectors: {
        repoCard: 'article.Box-row',
        name: 'h2.h3 a',
        description: 'p',
        stars: '.octicon-star + span',
        language: '[itemprop="programmingLanguage"]',
        forks: '.octicon-repo-forked + span'
      }
    }
  },
  {
    id: 'huggingface-spaces',
    name: 'Hugging Face Spaces',
    url: 'https://huggingface.co/spaces?sort=likes&direction=-1&search=AI',
    type: 'web',
    enabled: true,
    priority: 8,
    lastFetch: null,
    fetchInterval: 720, // 12小时
    config: {
      selectors: {
        appCard: '.space-card',
        name: '.space-title',
        description: '.space-description',
        website: '.space-link',
        likes: '.space-likes',
        downloads: '.space-downloads'
      }
    }
  },
  {
    id: 'replicate',
    name: 'Replicate',
    url: 'https://replicate.com/explore',
    type: 'web',
    enabled: true,
    priority: 9,
    lastFetch: null,
    fetchInterval: 720, // 12小时
    config: {
      selectors: {
        appCard: '.model-card',
        name: '.model-name',
        description: '.model-description',
        website: '.model-link',
        author: '.model-author',
        runs: '.model-runs'
      }
    }
  },
  {
    id: 'civitai',
    name: 'Civitai',
    url: 'https://civitai.com/models',
    type: 'web',
    enabled: true,
    priority: 10,
    lastFetch: null,
    fetchInterval: 1440, // 24小时
    config: {
      selectors: {
        appCard: '.model-card',
        name: '.model-name',
        description: '.model-description',
        website: '.model-link',
        downloads: '.model-downloads',
        rating: '.model-rating'
      }
    }
  },
  {
    id: 'openai-gpt-store',
    name: 'OpenAI GPT Store',
    url: 'https://chat.openai.com/gpts',
    type: 'web',
    enabled: true,
    priority: 11,
    lastFetch: null,
    fetchInterval: 720, // 12小时
    config: {
      selectors: {
        appCard: '.gpt-card',
        name: '.gpt-name',
        description: '.gpt-description',
        website: '.gpt-link',
        category: '.gpt-category',
        usage: '.gpt-usage'
      }
    }
  },
  {
    id: 'anthropic-claude-apps',
    name: 'Anthropic Claude Apps',
    url: 'https://console.anthropic.com/apps',
    type: 'web',
    enabled: true,
    priority: 12,
    lastFetch: null,
    fetchInterval: 1440, // 24小时
    config: {
      selectors: {
        appCard: '.app-card',
        name: '.app-name',
        description: '.app-description',
        website: '.app-link',
        category: '.app-category'
      }
    }
  },
  {
    id: 'crunchbase-news',
    name: 'Crunchbase News Funding',
    url: 'https://news.crunchbase.com/feed/',
    type: 'rss',
    enabled: true,
    priority: 13,
    lastFetch: null,
    fetchInterval: 240, // 4小时
    config: {
      mapping: {
        title: 'title',
        link: 'link',
        pubDate: 'pubDate',
        description: 'description'
      }
    }
  },
  {
    id: 'techcrunch-funding',
    name: 'TechCrunch AI Funding',
    url: 'https://techcrunch.com/tag/funding/feed/',
    type: 'rss',
    enabled: true,
    priority: 14,
    lastFetch: null,
    fetchInterval: 360, // 6小时
    config: {
      mapping: {
        title: 'title',
        link: 'link',
        pubDate: 'pubDate',
        description: 'description'
      }
    }
  },
  {
    id: 'venturebeat-funding',
    name: 'VentureBeat Funding',
    url: 'https://venturebeat.com/category/ai/feed/',
    type: 'rss',
    enabled: true,
    priority: 15,
    lastFetch: null,
    fetchInterval: 360, // 6小时
    config: {
      mapping: {
        title: 'title',
        link: 'link',
        pubDate: 'pubDate',
        description: 'description'
      }
    }
  },
  {
    id: 'crunchbase-api',
    name: 'Crunchbase GraphQL',
    url: 'https://api.crunchbase.com/api/graphql',
    type: 'api',
    enabled: false, // 需要付费Key，默认关闭
    priority: 16,
    lastFetch: null,
    fetchInterval: 1440, // 24小时
    config: {
      apiKey: process.env.CRUNCHBASE_API_KEY,
      headers: {
        'X-cb-user-key': process.env.CRUNCHBASE_API_KEY,
        'Content-Type': 'application/json'
      },
      mapping: {
        name: 'identifier.value',
        description: 'short_description',
        website: 'homepage_url',
        category: 'categories',
        amount: 'funding_total_usd'
      }
    }
  },
  {
    id: 'itjuzi-api',
    name: 'IT桔子 融资API',
    url: 'https://api.itjuzi.com/v1/funding',
    type: 'api',
    enabled: false, // 需要Token
    priority: 17,
    lastFetch: null,
    fetchInterval: 720, // 12小时
    config: {
      apiKey: process.env.ITJUZI_TOKEN,
      headers: {
        'Authorization': `Bearer ${process.env.ITJUZI_TOKEN}`
      },
      mapping: {
        name: 'com_name',
        description: 'com_intro',
        website: 'com_url',
        round: 'round',
        amount: 'money'
      }
    }
  },
  {
    id: '36kr-funding',
    name: '36Kr 融资快讯',
    url: 'https://www.36kr.com/feed',
    type: 'rss',
    enabled: true,
    priority: 18,
    lastFetch: null,
    fetchInterval: 360, // 6小时
    config: {
      mapping: {
        title: 'title',
        link: 'link',
        pubDate: 'pubDate',
        description: 'description'
      }
    }
  }
];

// AI应用抓取器类
class AIAppsCrawler {
  private sources: DataSource[] = dataSources;
  private tasks: CrawlTask[] = [];
  private isRunning = false;

  // 获取所有数据源
  async getDataSources(): Promise<DataSource[]> {
    return this.sources.filter(source => source.enabled);
  }

  // 获取抓取任务历史
  async getCrawlTasks(limit: number = 50): Promise<CrawlTask[]> {
    return this.tasks
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
  }

  // 手动触发抓取
  async triggerCrawl(sourceId?: string): Promise<CrawlTask> {
    const sources = sourceId 
      ? this.sources.filter(s => s.id === sourceId && s.enabled)
      : this.sources.filter(s => s.enabled);

    if (sources.length === 0) {
      throw new Error('No enabled data sources found');
    }

    const task: CrawlTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sourceId: sourceId || 'all',
      status: 'pending',
      startedAt: new Date()
    };

    this.tasks.push(task);
    
    // 异步执行抓取
    this.executeCrawl(task, sources).catch(error => {
      console.error('Crawl execution failed:', error);
    });

    return task;
  }

  // 执行抓取任务
  private async executeCrawl(task: CrawlTask, sources: DataSource[]): Promise<void> {
    task.status = 'running';
    
    const result = {
      appsFound: 0,
      appsUpdated: 0,
      appsAdded: 0,
      errors: [] as string[]
    };

    try {
      for (const source of sources) {
        try {
          console.log(`🔄 开始抓取数据源: ${source.name}`);
          
          const apps = await this.crawlSource(source);
          result.appsFound += apps.length;
          
          // 更新数据源最后抓取时间
          source.lastFetch = new Date();
          
          // 处理抓取到的应用数据
          const processed = await this.processCrawledApps(apps, source);
          result.appsAdded += processed.added;
          result.appsUpdated += processed.updated;
          
          console.log(`✅ ${source.name} 抓取完成: ${apps.length} 个应用`);
          
                 } catch (error) {
           const errorMsg = `抓取 ${source.name} 失败: ${error instanceof Error ? error.message : String(error)}`;
           console.error(errorMsg);
           result.errors.push(errorMsg);
         }
      }
      
      task.status = 'completed';
      task.completedAt = new Date();
      task.result = result;
      
      console.log(`🎉 抓取任务完成: 发现 ${result.appsFound} 个应用，新增 ${result.appsAdded} 个，更新 ${result.appsUpdated} 个`);
      
         } catch (error) {
       task.status = 'failed';
       task.completedAt = new Date();
       task.error = error instanceof Error ? error.message : String(error);
       result.errors.push(error instanceof Error ? error.message : String(error));
       task.result = result;
       
       console.error('❌ 抓取任务失败:', error);
     }
  }

  // 抓取单个数据源
  private async crawlSource(source: DataSource): Promise<Partial<AIApp>[]> {
    switch (source.type) {
      case 'api':
        return await this.crawlAPI(source);
      case 'web':
        return await this.crawlWeb(source);
      case 'rss':
        return await this.crawlRSS(source);
      default:
        throw new Error(`不支持的数据源类型: ${source.type}`);
    }
  }

  // 抓取API数据源
  private async crawlAPI(source: DataSource): Promise<Partial<AIApp>[]> {
    if (!source.config.apiKey) {
      throw new Error(`数据源 ${source.name} 缺少API密钥`);
    }

    try {
      const response = await fetch(source.url, {
        method: 'POST',
        headers: source.config.headers,
        body: JSON.stringify({
          query: `
            query {
              posts(first: 50, order: VOTES) {
                edges {
                  node {
                    name
                    tagline
                    website
                    votesCount
                    category {
                      name
                    }
                    topics {
                      edges {
                        node {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          `
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      const posts = data.data?.posts?.edges || [];

      return posts.map((post: any) => {
        const node = post.node;
        return {
          name: node.name,
          description: node.tagline,
          website: node.website,
          category: node.category?.name || 'AI助手',
          tags: node.topics?.edges?.map((t: any) => t.node.name) || [],
          metrics: {
            users: node.votesCount?.toString() || '0',
            rating: 0,
            reviews: 0
          }
        };
      });

         } catch (error) {
       throw new Error(`API抓取失败: ${error instanceof Error ? error.message : String(error)}`);
     }
  }

  // 抓取网页数据源
  private async crawlWeb(source: DataSource): Promise<Partial<AIApp>[]> {
    try {
      const response = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`网页请求失败: ${response.status}`);
      }

      const html = await response.text();
      
      // 这里需要实现HTML解析逻辑
      // 由于浏览器环境限制，这里返回模拟数据
      return this.parseWebContent(html, source);

    } catch (error) {
      throw new Error(`网页抓取失败: ${error.message}`);
    }
  }

  // 解析网页内容（模拟实现）
  private parseWebContent(html: string, source: DataSource): Partial<AIApp>[] {
    // 这里应该使用DOM解析器来提取数据
    // 由于在浏览器环境中，这里返回模拟数据
    const mockApps = [
      {
        name: `Mock App from ${source.name}`,
        description: '这是一个模拟的AI应用',
        website: 'https://example.com',
        category: 'AI助手',
        tags: ['AI', '模拟'],
        metrics: {
          users: '1000+',
          rating: 4.5,
          reviews: 100
        }
      }
    ];

    return mockApps;
  }

  // 抓取RSS数据源
  private async crawlRSS(source: DataSource): Promise<Partial<AIApp>[]> {
    try {
      const response = await fetch(source.url);
      
      if (!response.ok) {
        throw new Error(`RSS请求失败: ${response.status}`);
      }

      const xml = await response.text();
      
      // 这里需要实现RSS解析逻辑
      return this.parseRSSContent(xml, source);

    } catch (error) {
      throw new Error(`RSS抓取失败: ${error.message}`);
    }
  }

  // 解析RSS内容（模拟实现）
  private parseRSSContent(xml: string, source: DataSource): Partial<AIApp>[] {
    // 这里应该使用XML解析器来提取数据
    const mockApps = [
      {
        name: `RSS App from ${source.name}`,
        description: '这是一个来自RSS的AI应用',
        website: 'https://example.com',
        category: '内容创作',
        tags: ['RSS', 'AI'],
        metrics: {
          users: '500+',
          rating: 4.0,
          reviews: 50
        }
      }
    ];

    return mockApps;
  }

  // 处理抓取到的应用数据
  private async processCrawledApps(apps: Partial<AIApp>[], source: DataSource): Promise<{ added: number; updated: number }> {
    let added = 0;
    let updated = 0;

    for (const appData of apps) {
      try {
        // 检查应用是否已存在
        const existingApp = await this.findExistingApp(appData.name);
        
        if (existingApp) {
          // 更新现有应用
          await this.updateApp(existingApp.id, appData);
          updated++;
        } else {
          // 添加新应用
          await this.addNewApp(appData, source);
          added++;
        }
      } catch (error) {
        console.error(`处理应用 ${appData.name} 失败:`, error);
      }
    }

    return { added, updated };
  }

  // 查找现有应用
  private async findExistingApp(name: string): Promise<AIApp | null> {
    // 这里应该调用实际的数据存储
    // 暂时返回null表示应用不存在
    return null;
  }

  // 更新应用
  private async updateApp(id: number, appData: Partial<AIApp>): Promise<void> {
    // 这里应该调用实际的数据更新逻辑
    console.log(`更新应用 ${id}:`, appData);
  }

  // 添加新应用
  private async addNewApp(appData: Partial<AIApp>, source: DataSource): Promise<void> {
    // 这里应该调用实际的数据添加逻辑
    console.log(`添加新应用:`, appData);
  }

  // 获取抓取统计
  async getCrawlStats(): Promise<{
    totalSources: number;
    enabledSources: number;
    lastCrawl: Date | null;
    totalTasks: number;
    successRate: number;
  }> {
    const enabledSources = this.sources.filter(s => s.enabled);
    const lastCrawl = enabledSources.reduce((latest, source) => {
      return source.lastFetch && (!latest || source.lastFetch > latest) 
        ? source.lastFetch 
        : latest;
    }, null as Date | null);

    const completedTasks = this.tasks.filter(t => t.status === 'completed');
    const successRate = this.tasks.length > 0 
      ? (completedTasks.length / this.tasks.length) * 100 
      : 0;

    return {
      totalSources: this.sources.length,
      enabledSources: enabledSources.length,
      lastCrawl,
      totalTasks: this.tasks.length,
      successRate: Math.round(successRate)
    };
  }

  // 更新数据源配置
  async updateDataSource(sourceId: string, updates: Partial<DataSource>): Promise<void> {
    const sourceIndex = this.sources.findIndex(s => s.id === sourceId);
    if (sourceIndex === -1) {
      throw new Error(`数据源 ${sourceId} 不存在`);
    }

    this.sources[sourceIndex] = { ...this.sources[sourceIndex], ...updates };
  }

  // 添加新数据源
  async addDataSource(source: Omit<DataSource, 'id' | 'lastFetch'>): Promise<string> {
    const id = `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSource: DataSource = {
      ...source,
      id,
      lastFetch: null
    };

    this.sources.push(newSource);
    return id;
  }

  // 删除数据源
  async removeDataSource(sourceId: string): Promise<void> {
    const sourceIndex = this.sources.findIndex(s => s.id === sourceId);
    if (sourceIndex === -1) {
      throw new Error(`数据源 ${sourceId} 不存在`);
    }

    this.sources.splice(sourceIndex, 1);
  }
}

// 导出单例实例
export const aiAppsCrawler = new AIAppsCrawler(); 