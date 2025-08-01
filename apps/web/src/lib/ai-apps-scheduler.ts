// AI应用定时抓取任务管理器
import { aiAppsCrawler, DataSource, CrawlTask } from './ai-apps-crawler';

// 定时任务配置
export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  sourceId?: string; // 如果为空，则抓取所有数据源
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  description: string;
}

// 默认定时任务配置 - 专注于最新、最流行的AI应用
const defaultScheduledTasks: ScheduledTask[] = [
  {
    id: 'futurepedia-frequent',
    name: 'Futurepedia 高频抓取',
    cronExpression: '0 */6 * * *', // 每6小时
    sourceId: 'futurepedia',
    enabled: true,
    description: '每6小时抓取Futurepedia，获取最新AI工具'
  },
  {
    id: 'producthunt-daily',
    name: 'Product Hunt 每日抓取',
    cronExpression: '0 9 * * *', // 每天上午9点
    sourceId: 'producthunt',
    enabled: true,
    description: '每日抓取Product Hunt上的热门AI应用'
  },
  {
    id: 'thereisanaiforthat',
    name: 'There\'s An AI For That 抓取',
    cronExpression: '0 */8 * * *', // 每8小时
    sourceId: 'thereisanaiforthat',
    enabled: true,
    description: '每8小时抓取There\'s An AI For That'
  },
  {
    id: 'github-ai-projects',
    name: 'GitHub AI项目抓取',
    cronExpression: '0 */6 * * *', // 每6小时
    sourceId: 'github-trending-ai',
    enabled: true,
    description: '每6小时抓取GitHub上的热门AI项目'
  },
  {
    id: 'huggingface-spaces',
    name: 'Hugging Face Spaces 抓取',
    cronExpression: '0 */12 * * *', // 每12小时
    sourceId: 'huggingface-spaces',
    enabled: true,
    description: '每12小时抓取Hugging Face Spaces上的AI应用'
  },
  {
    id: 'replicate-models',
    name: 'Replicate 模型抓取',
    cronExpression: '0 */12 * * *', // 每12小时
    sourceId: 'replicate',
    enabled: true,
    description: '每12小时抓取Replicate上的AI模型'
  },
  {
    id: 'gpt-store',
    name: 'OpenAI GPT Store 抓取',
    cronExpression: '0 */12 * * *', // 每12小时
    sourceId: 'openai-gpt-store',
    enabled: true,
    description: '每12小时抓取OpenAI GPT Store上的GPT应用'
  },
  {
    id: 'aitoolhub',
    name: 'AI Tool Hub 抓取',
    cronExpression: '0 */10 * * *', // 每10小时
    sourceId: 'aitoolhub',
    enabled: true,
    description: '每10小时抓取AI Tool Hub'
  },
  {
    id: 'aitoolsdirectory',
    name: 'AI Tools Directory 抓取',
    cronExpression: '0 */12 * * *', // 每12小时
    sourceId: 'aitoolsdirectory',
    enabled: true,
    description: '每12小时抓取AI Tools Directory'
  },
  {
    id: 'aitoolguide',
    name: 'AI Tool Guide 抓取',
    cronExpression: '0 */12 * * *', // 每12小时
    sourceId: 'aitoolguide',
    enabled: true,
    description: '每12小时抓取AI Tool Guide'
  },
  {
    id: 'civitai-models',
    name: 'Civitai 模型抓取',
    cronExpression: '0 2 * * *', // 每天凌晨2点
    sourceId: 'civitai',
    enabled: true,
    description: '每日抓取Civitai上的AI模型'
  },
  {
    id: 'anthropic-claude-apps',
    name: 'Anthropic Claude Apps 抓取',
    cronExpression: '0 3 * * *', // 每天凌晨3点
    sourceId: 'anthropic-claude-apps',
    enabled: true,
    description: '每日抓取Anthropic Claude Apps'
  },
  {
    id: 'weekly-full-sync',
    name: '每周全量同步',
    cronExpression: '0 4 * * 1', // 每周一凌晨4点
    enabled: true,
    description: '每周进行一次全量抓取，确保数据完整性'
  }
];

// 定时任务管理器
class AIAppsScheduler {
  private tasks: ScheduledTask[] = defaultScheduledTasks;
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  // 启动定时任务管理器
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⏰ 定时任务管理器已在运行');
      return;
    }

    // 检查是否在浏览器环境中
    if (typeof window !== 'undefined') {
      console.warn('⚠️ 浏览器环境：定时任务管理器已禁用，避免资源耗尽');
      console.warn('💡 建议：将定时抓取功能移至后端服务器');
      return;
    }

    console.log('🚀 启动AI应用定时抓取任务管理器...');
    this.isRunning = true;

    // 启动所有启用的定时任务
    for (const task of this.tasks.filter(t => t.enabled)) {
      await this.scheduleTask(task);
    }

    console.log(`✅ 定时任务管理器启动完成，共启动 ${this.tasks.filter(t => t.enabled).length} 个任务`);
  }

  // 停止定时任务管理器
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('⏰ 定时任务管理器未运行');
      return;
    }

    console.log('🛑 停止AI应用定时抓取任务管理器...');

    // 清除所有定时器
    for (const [taskId, interval] of this.intervals) {
      clearInterval(interval);
      console.log(`⏹️ 停止任务: ${taskId}`);
    }
    this.intervals.clear();

    this.isRunning = false;
    console.log('✅ 定时任务管理器已停止');
  }

  // 调度单个任务
  private async scheduleTask(task: ScheduledTask): Promise<void> {
    try {
      // 检查任务是否已启用
      if (!task.enabled) {
        console.log(`⏸️ 任务 ${task.name} 已禁用，跳过调度`);
        return;
      }

      // 计算下次运行时间
      const nextRun = this.getNextRunTime(task.cronExpression);
      task.nextRun = nextRun;

      // 计算延迟时间（毫秒）
      const delay = nextRun.getTime() - Date.now();
      
      // 防止延迟为负数或过小的情况
      if (delay <= 1000) { // 小于1秒的延迟
        console.log(`⚠️ 任务 ${task.name} 延迟过小 (${delay}ms)，设置为1分钟后执行`);
        const adjustedDelay = 60000; // 1分钟
        
        const timeout = setTimeout(async () => {
          await this.executeTask(task);
          // 重新调度下次执行
          await this.scheduleTask(task);
        }, adjustedDelay);

        this.intervals.set(task.id, timeout as any);
        console.log(`⏰ 任务 ${task.name} 已调整调度，1分钟后执行`);
      } else {
        // 设置定时器
        const timeout = setTimeout(async () => {
          await this.executeTask(task);
          // 重新调度下次执行
          await this.scheduleTask(task);
        }, delay);

        this.intervals.set(task.id, timeout as any);
        
        console.log(`⏰ 任务 ${task.name} 已调度，下次执行时间: ${nextRun.toLocaleString()}`);
      }
    } catch (error) {
      console.error(`❌ 调度任务 ${task.name} 失败:`, error);
    }
  }

  // 执行定时任务
  private async executeTask(task: ScheduledTask): Promise<void> {
    try {
      console.log(`🔄 开始执行定时任务: ${task.name}`);
      task.lastRun = new Date();

      // 触发抓取
      const crawlTask = await aiAppsCrawler.triggerCrawl(task.sourceId);
      
      console.log(`✅ 定时任务 ${task.name} 执行完成，抓取任务ID: ${crawlTask.id}`);
      
    } catch (error) {
      console.error(`❌ 执行定时任务 ${task.name} 失败:`, error);
    }
  }

  // 计算下次运行时间（简化版cron解析）
  private getNextRunTime(cronExpression: string): Date {
    const now = new Date();
    const parts = cronExpression.split(' ');
    
    if (parts.length !== 5) {
      throw new Error(`无效的cron表达式: ${cronExpression}`);
    }

    const [minute, hour, day, month, weekday] = parts;
    
    // 简化处理：只处理每天固定时间的情况
    if (minute !== '*' && hour !== '*' && day === '*' && month === '*' && weekday === '*') {
      const nextRun = new Date(now);
      nextRun.setMinutes(parseInt(minute), 0, 0);
      nextRun.setHours(parseInt(hour));
      
      // 如果时间已过，设置为明天
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
      
      return nextRun;
    }
    
    // 简化处理：每N小时的情况
    if (minute === '0' && hour.startsWith('*/') && day === '*' && month === '*' && weekday === '*') {
      const hours = parseInt(hour.substring(2));
      const nextRun = new Date(now);
      nextRun.setMinutes(0, 0, 0);
      nextRun.setHours(Math.ceil(nextRun.getHours() / hours) * hours);
      
      if (nextRun <= now) {
        nextRun.setHours(nextRun.getHours() + hours);
      }
      
      return nextRun;
    }
    
    // 简化处理：每周固定时间的情况
    if (minute !== '*' && hour !== '*' && day === '*' && month === '*' && weekday !== '*') {
      const targetWeekday = parseInt(weekday);
      const nextRun = new Date(now);
      nextRun.setMinutes(parseInt(minute), 0, 0);
      nextRun.setHours(parseInt(hour));
      
      const currentWeekday = nextRun.getDay();
      const daysToAdd = (targetWeekday - currentWeekday + 7) % 7;
      
      if (daysToAdd === 0 && nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 7);
      } else {
        nextRun.setDate(nextRun.getDate() + daysToAdd);
      }
      
      return nextRun;
    }
    
    // 默认返回1小时后
    const defaultNext = new Date(now);
    defaultNext.setHours(defaultNext.getHours() + 1);
    return defaultNext;
  }

  // 获取所有定时任务
  async getScheduledTasks(): Promise<ScheduledTask[]> {
    return this.tasks.map(task => ({
      ...task,
      nextRun: task.nextRun || this.getNextRunTime(task.cronExpression)
    }));
  }

  // 添加定时任务
  async addScheduledTask(task: Omit<ScheduledTask, 'id'>): Promise<string> {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTask: ScheduledTask = { ...task, id };
    
    this.tasks.push(newTask);
    
    if (newTask.enabled && this.isRunning) {
      await this.scheduleTask(newTask);
    }
    
    return id;
  }

  // 更新定时任务
  async updateScheduledTask(taskId: string, updates: Partial<ScheduledTask>): Promise<void> {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`定时任务 ${taskId} 不存在`);
    }

    // 停止现有任务
    const existingInterval = this.intervals.get(taskId);
    if (existingInterval) {
      clearInterval(existingInterval);
      this.intervals.delete(taskId);
    }

    // 更新任务
    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
    
    // 如果任务启用且调度器正在运行，重新调度
    if (this.tasks[taskIndex].enabled && this.isRunning) {
      await this.scheduleTask(this.tasks[taskIndex]);
    }
  }

  // 删除定时任务
  async removeScheduledTask(taskId: string): Promise<void> {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`定时任务 ${taskId} 不存在`);
    }

    // 停止任务
    const existingInterval = this.intervals.get(taskId);
    if (existingInterval) {
      clearInterval(existingInterval);
      this.intervals.delete(taskId);
    }

    // 删除任务
    this.tasks.splice(taskIndex, 1);
  }

  // 手动执行任务
  async executeTaskNow(taskId: string): Promise<CrawlTask> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`定时任务 ${taskId} 不存在`);
    }

    console.log(`🚀 手动执行定时任务: ${task.name}`);
    return await aiAppsCrawler.triggerCrawl(task.sourceId);
  }

  // 获取调度器状态
  async getSchedulerStatus(): Promise<{
    isRunning: boolean;
    totalTasks: number;
    enabledTasks: number;
    activeIntervals: number;
    nextScheduledRun?: Date;
  }> {
    const enabledTasks = this.tasks.filter(t => t.enabled);
    const nextScheduledRun = enabledTasks
      .map(t => t.nextRun)
      .filter(Boolean)
      .sort((a, b) => a!.getTime() - b!.getTime())[0];

    return {
      isRunning: this.isRunning,
      totalTasks: this.tasks.length,
      enabledTasks: enabledTasks.length,
      activeIntervals: this.intervals.size,
      nextScheduledRun
    };
  }

  // 获取任务执行历史
  async getTaskHistory(taskId: string, limit: number = 10): Promise<CrawlTask[]> {
    // 这里应该从数据库获取历史记录
    // 暂时返回空数组
    return [];
  }
}

// 导出单例实例
export const aiAppsScheduler = new AIAppsScheduler();

// 自动启动调度器（在应用启动时）
if (typeof window !== 'undefined') {
  // 只在浏览器环境中启动
  aiAppsScheduler.start().catch(error => {
    console.error('启动定时任务管理器失败:', error);
  });
} 