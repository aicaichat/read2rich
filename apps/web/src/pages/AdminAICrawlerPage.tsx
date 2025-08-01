import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Zap,
  Globe,
  Database,
  Calendar
} from 'lucide-react';
import { 
  aiAppsCrawler, 
  browserSafeCrawler,
  DataSource, 
  CrawlTask 
} from '@/lib/ai-apps-crawler';
import { 
  aiAppsScheduler, 
  ScheduledTask 
} from '@/lib/ai-apps-scheduler';
import Button from '@/components/ui/Button';

export default function AdminAICrawlerPage() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [crawlTasks, setCrawlTasks] = useState<CrawlTask[]>([]);
  const [schedulerStatus, setSchedulerStatus] = useState<any>(null);
  const [crawlStats, setCrawlStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'tasks' | 'history'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sources, tasks, history, status, stats] = await Promise.all([
        aiAppsCrawler.getDataSources(),
        aiAppsScheduler.getScheduledTasks(),
        aiAppsCrawler.getCrawlTasks(20),
        aiAppsScheduler.getSchedulerStatus(),
        aiAppsCrawler.getCrawlStats()
      ]);

      setDataSources(sources);
      setScheduledTasks(tasks);
      setCrawlTasks(history);
      setSchedulerStatus(status);
      setCrawlStats(stats);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartScheduler = async () => {
    try {
      await aiAppsScheduler.start();
      await loadData();
    } catch (error) {
      console.error('启动调度器失败:', error);
    }
  };

  const handleStopScheduler = async () => {
    try {
      await aiAppsScheduler.stop();
      await loadData();
    } catch (error) {
      console.error('停止调度器失败:', error);
    }
  };

  const handleTriggerCrawl = async (sourceId?: string) => {
    try {
      // 使用安全的抓取器，避免资源耗尽
      const result = await browserSafeCrawler.safeCrawl(sourceId);
      
      if (result.success) {
        console.log('安全抓取任务完成:', result.message);
        // 显示成功消息
        alert(`抓取完成！${result.message}`);
      } else {
        console.error('安全抓取任务失败:', result.message);
        alert(`抓取失败：${result.message}`);
      }
      
      await loadData();
    } catch (error) {
      console.error('启动抓取任务失败:', error);
      alert(`抓取失败：${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleExecuteTask = async (taskId: string) => {
    try {
      // 使用安全的抓取器，避免资源耗尽
      const result = await browserSafeCrawler.safeCrawl();
      
      if (result.success) {
        console.log('定时任务执行完成:', result.message);
        alert(`定时任务执行完成！${result.message}`);
      } else {
        console.error('定时任务执行失败:', result.message);
        alert(`定时任务执行失败：${result.message}`);
      }
      
      await loadData();
    } catch (error) {
      console.error('执行定时任务失败:', error);
      alert(`定时任务执行失败：${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'running': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'running': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* 页面标题 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI应用抓取管理</h1>
            <p className="text-gray-400">管理自动抓取任务和数据源配置</p>
          </div>
          <div className="flex gap-4">
            {schedulerStatus?.isRunning ? (
              <Button
                variant="secondary"
                onClick={handleStopScheduler}
                className="flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                停止调度器
              </Button>
            ) : (
              <Button
                variant="gradient"
                onClick={handleStartScheduler}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                启动调度器
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => handleTriggerCrawl()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              立即抓取
            </Button>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10 mb-8">
          {[
            { id: 'overview', label: '概览', icon: BarChart3 },
            { id: 'sources', label: '数据源', icon: Database },
            { id: 'tasks', label: '定时任务', icon: Calendar },
            { id: 'history', label: '执行历史', icon: Clock }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">数据源</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {crawlStats?.enabledSources || 0}/{crawlStats?.totalSources || 0}
                </div>
                <div className="text-gray-400 text-sm">启用/总数</div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">定时任务</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {schedulerStatus?.enabledTasks || 0}/{schedulerStatus?.totalTasks || 0}
                </div>
                <div className="text-gray-400 text-sm">启用/总数</div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">成功率</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {crawlStats?.successRate || 0}%
                </div>
                <div className="text-gray-400 text-sm">抓取成功率</div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">最后抓取</h3>
                </div>
                <div className="text-lg font-bold text-white mb-2">
                  {crawlStats?.lastCrawl 
                    ? new Date(crawlStats.lastCrawl).toLocaleDateString()
                    : '从未'
                  }
                </div>
                <div className="text-gray-400 text-sm">最近一次抓取</div>
              </div>
            </div>

            {/* 调度器状态 */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">调度器状态</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${schedulerStatus?.isRunning ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-white font-medium">
                      {schedulerStatus?.isRunning ? '运行中' : '已停止'}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    活跃定时器: {schedulerStatus?.activeIntervals || 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">下次执行</div>
                  <div className="text-white font-medium">
                    {schedulerStatus?.nextScheduledRun 
                      ? new Date(schedulerStatus.nextScheduledRun).toLocaleString()
                      : '无'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* 最近执行历史 */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">最近执行历史</h3>
              <div className="space-y-3">
                {crawlTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <div className="text-white font-medium">
                          {task.sourceId === 'all' ? '全量抓取' : task.sourceId}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {new Date(task.startedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${getStatusColor(task.status)}`}>
                        {task.status === 'completed' ? '完成' :
                         task.status === 'running' ? '运行中' :
                         task.status === 'failed' ? '失败' : '等待中'}
                      </div>
                      {task.result && (
                        <div className="text-gray-400 text-sm">
                          +{task.result.appsAdded} 更新{task.result.appsUpdated}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sources' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">数据源管理</h2>
              <Button variant="gradient" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                添加数据源
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dataSources.map((source) => (
                <div key={source.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {source.type === 'api' && <Zap className="w-5 h-5 text-blue-400" />}
                      {source.type === 'web' && <Globe className="w-5 h-5 text-green-400" />}
                      {source.type === 'rss' && <Database className="w-5 h-5 text-purple-400" />}
                      <div>
                        <h3 className="text-lg font-semibold text-white">{source.name}</h3>
                        <div className="text-gray-400 text-sm">{source.type.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleTriggerCrawl(source.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="text-gray-300 text-sm">
                      <span className="text-gray-400">URL:</span> {source.url}
                    </div>
                    <div className="text-gray-300 text-sm">
                      <span className="text-gray-400">优先级:</span> {source.priority}
                    </div>
                    <div className="text-gray-300 text-sm">
                      <span className="text-gray-400">抓取间隔:</span> {source.fetchInterval} 分钟
                    </div>
                    <div className="text-gray-300 text-sm">
                      <span className="text-gray-400">最后抓取:</span> {
                        source.lastFetch 
                          ? new Date(source.lastFetch).toLocaleString()
                          : '从未'
                      }
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${source.enabled ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-sm text-gray-400">
                      {source.enabled ? '已启用' : '已禁用'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'tasks' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">定时任务管理</h2>
              <Button variant="gradient" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                添加任务
              </Button>
            </div>

            <div className="space-y-4">
              {scheduledTasks.map((task) => (
                <div key={task.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{task.name}</h3>
                      <p className="text-gray-400 text-sm">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleExecuteTask(task.id)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Cron表达式</div>
                      <div className="text-white font-mono text-sm">{task.cronExpression}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">数据源</div>
                      <div className="text-white text-sm">
                        {task.sourceId || '全部数据源'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">下次执行</div>
                      <div className="text-white text-sm">
                        {task.nextRun ? new Date(task.nextRun).toLocaleString() : '未知'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${task.enabled ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className="text-sm text-gray-400">
                        {task.enabled ? '已启用' : '已禁用'}
                      </span>
                    </div>
                    {task.lastRun && (
                      <div className="text-sm text-gray-400">
                        上次执行: {new Date(task.lastRun).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">执行历史</h2>
              <Button variant="secondary" onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
            </div>

            <div className="space-y-3">
              {crawlTasks.map((task) => (
                <div key={task.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <div className="text-white font-medium">
                          {task.sourceId === 'all' ? '全量抓取' : task.sourceId}
                        </div>
                        <div className="text-gray-400 text-sm">
                          任务ID: {task.id}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${getStatusColor(task.status)}`}>
                        {task.status === 'completed' ? '完成' :
                         task.status === 'running' ? '运行中' :
                         task.status === 'failed' ? '失败' : '等待中'}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {new Date(task.startedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {task.result && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{task.result.appsFound}</div>
                        <div className="text-gray-400 text-sm">发现应用</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{task.result.appsAdded}</div>
                        <div className="text-gray-400 text-sm">新增应用</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{task.result.appsUpdated}</div>
                        <div className="text-gray-400 text-sm">更新应用</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{task.result.errors.length}</div>
                        <div className="text-gray-400 text-sm">错误数量</div>
                      </div>
                    </div>
                  )}

                  {task.error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="text-red-400 text-sm">{task.error}</div>
                    </div>
                  )}

                  {task.result?.errors && task.result.errors.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="text-yellow-400 text-sm font-medium mb-2">错误详情:</div>
                      <ul className="text-yellow-300 text-sm space-y-1">
                        {task.result.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 