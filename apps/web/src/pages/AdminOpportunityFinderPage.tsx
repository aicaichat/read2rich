import { useState, useEffect, useRef } from 'react';
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
  Bell,
  Activity,
  Database,
  Globe,
  Zap,
  TrendingUp,
  Users,
  AlertCircle,
  MessageSquare,
  Wifi,
  WifiOff,
  Server
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { opportunityFinderMonitor } from '@/lib/opportunity-finder-monitor';

interface CrawlerStatus {
  isRunning: boolean;
  uptime: string;
  errorRate: number;
  successfulCrawls: number;
  totalCrawls: number;
  lastActivity: string;
  kafkaConnected: boolean;
  qdrantConnected: boolean;
  embeddingServiceStatus: 'running' | 'stopped' | 'error';
}

interface DataSourceStatus {
  name: string;
  type: 'reddit' | 'hackernews' | 'newsletter' | 'g2' | 'linkedin';
  status: 'success' | 'error' | 'warning';
  lastSuccess: string;
  errorMessage?: string;
  httpStatus?: number;
  responseTime?: number;
}

interface SystemMetrics {
  messagesProduced: number;
  messagesProcessed: number;
  vectorsStored: number;
  opportunitiesFound: number;
  queueHealth: 'healthy' | 'warning' | 'error';
  processingRate: number;
}

interface NotificationSettings {
  enableAlerts: boolean;
  emailNotifications: boolean;
  slackWebhook: string;
  errorThreshold: number;
  successRateThreshold: number;
}

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARNING';
  service: string;
  message: string;
}

export default function AdminOpportunityFinderPage() {
  const [crawlerStatus, setCrawlerStatus] = useState<CrawlerStatus | null>(null);
  const [dataSources, setDataSources] = useState<DataSourceStatus[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    enableAlerts: true,
    emailNotifications: false,
    slackWebhook: '',
    errorThreshold: 70,
    successRateThreshold: 30
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'logs' | 'settings'>('overview');
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 获取爬虫状态
  const fetchCrawlerStatus = async (): Promise<CrawlerStatus> => {
    return await opportunityFinderMonitor.getCrawlerStatus();
  };

  // 获取数据源状态
  const fetchDataSourcesStatus = async (): Promise<DataSourceStatus[]> => {
    return await opportunityFinderMonitor.getDataSourcesStatus();
  };

  // 获取系统指标
  const fetchSystemMetrics = async (): Promise<SystemMetrics> => {
    return await opportunityFinderMonitor.getSystemMetrics();
  };

  // 获取日志
  const fetchLogs = async (): Promise<LogEntry[]> => {
    return await opportunityFinderMonitor.getLogs(20);
  };

  // 加载所有数据
  const loadData = async () => {
    try {
      const [status, sources, systemMetrics, logEntries] = await Promise.all([
        fetchCrawlerStatus(),
        fetchDataSourcesStatus(),
        fetchSystemMetrics(),
        fetchLogs()
      ]);

      setCrawlerStatus(status);
      setDataSources(sources);
      setMetrics(systemMetrics);
      setLogs(logEntries);

      // 检查是否需要发送通知
      checkAndSendNotifications(status, sources);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 检查并发送通知
  const checkAndSendNotifications = (status: CrawlerStatus, sources: DataSourceStatus[]) => {
    if (!notifications.enableAlerts) return;

    const errorSources = sources.filter(s => s.status === 'error').length;
    const errorRate = (errorSources / sources.length) * 100;

    // 错误率过高通知
    if (errorRate >= notifications.errorThreshold) {
      sendNotification('high-error-rate', `错误率过高: ${errorRate.toFixed(1)}%`);
    }

    // 服务停止通知
    if (!status.isRunning) {
      sendNotification('service-down', '爬虫服务已停止');
    }

    // Kafka连接中断通知
    if (!status.kafkaConnected) {
      sendNotification('kafka-down', 'Kafka连接中断');
    }
  };

  // 发送通知
  const sendNotification = (type: string, message: string) => {
    // 显示浏览器通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('AI Opportunity Finder 告警', {
        body: message,
        icon: '/favicon.ico'
      });
    }

    // 如果配置了Slack webhook，发送到Slack
    if (notifications.slackWebhook) {
      fetch(notifications.slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 AI Opportunity Finder 告警: ${message}`,
          username: 'OpportunityBot'
        })
      }).catch(error => console.error('Slack notification failed:', error));
    }
  };

  // 手动触发爬虫
  const handleTriggerCrawl = async (sourceId?: string) => {
    if (isTriggering) return; // 防止重复点击
    
    setIsTriggering(true);
    try {
      const result = await opportunityFinderMonitor.triggerCrawl(sourceId);
      
      if (result.success) {
        // 使用更友好的提示
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('抓取任务已启动', {
            body: result.message,
            icon: '/favicon.ico'
          });
        } else {
          alert(`✅ ${result.message}`);
        }
      } else {
        alert(`❌ ${result.message}`);
      }
      
      // 刷新数据
      await loadData();
    } catch (error) {
      alert(`❌ 触发抓取失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsTriggering(false);
    }
  };

  // 测试通知
  const handleTestNotification = async () => {
    if (notifications.slackWebhook) {
      const success = await opportunityFinderMonitor.sendTestNotification(
        notifications.slackWebhook,
        '这是一条来自 AI Opportunity Finder 的测试通知'
      );
      
      if (success) {
        alert('✅ 测试通知发送成功');
      } else {
        alert('❌ 测试通知发送失败，请检查 Webhook URL');
      }
    } else {
      alert('⚠️ 请先配置 Slack Webhook URL');
    }
  };

  // 请求通知权限
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  // 触发数据分析
  const handleAnalyzeData = async () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:8081/api/v1/monitor/analyze-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('数据分析已启动', {
            body: result.message,
            icon: '/favicon.ico'
          });
        } else {
          alert(`✅ ${result.message}`);
        }
      } else {
        alert(`❌ 分析失败: ${result.message}`);
      }
    } catch (error) {
      console.error('Analyze data error:', error);
      alert(`❌ 触发分析失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 查看分析结果
  const handleViewResults = () => {
    // 在新窗口中打开分析结果页面
    window.open('/analysis-results', '_blank');
  };

  useEffect(() => {
    loadData();
    requestNotificationPermission();

    if (realTimeUpdates) {
      intervalRef.current = setInterval(loadData, 30000); // 每30秒更新
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [realTimeUpdates]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': case 'running': case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': case 'stopped': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success': case 'running': case 'healthy': return 'bg-green-400';
      case 'warning': return 'bg-yellow-400';
      case 'error': case 'stopped': return 'bg-red-400';
      default: return 'bg-gray-400';
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 页面标题和控制按钮 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              AI Opportunity Finder 监控中心
            </h1>
            <p className="text-gray-400">实时监控爬虫服务、数据流和系统健康状态</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant={realTimeUpdates ? "gradient" : "secondary"}
              onClick={() => setRealTimeUpdates(!realTimeUpdates)}
              className="flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              {realTimeUpdates ? '实时更新' : '手动刷新'}
            </Button>
            <Button
              variant="gradient"
              onClick={() => handleTriggerCrawl()}
              disabled={isTriggering}
              className="flex items-center gap-2"
            >
              {isTriggering ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isTriggering ? '正在启动...' : '触发抓取'}
            </Button>
            
            <Button
              onClick={handleAnalyzeData}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <BarChart3 className="w-4 h-4" />
              )}
              {isAnalyzing ? '分析中...' : '数据分析'}
            </Button>
            
            <Button
              onClick={handleViewResults}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <TrendingUp className="w-4 h-4" />
              查看结果
            </Button>
            
            <Button
              variant="secondary"
              onClick={loadData}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              刷新数据
            </Button>
          </div>
        </div>

        {/* 系统状态警告 */}
        {crawlerStatus && !crawlerStatus.isRunning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div>
                <div className="text-red-400 font-medium">系统警告</div>
                <div className="text-red-300 text-sm">爬虫服务当前未运行，请检查服务状态</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 标签页导航 */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10 mb-8">
          {[
            { id: 'overview', label: '系统概览', icon: BarChart3 },
            { id: 'sources', label: '数据源状态', icon: Database },
            { id: 'logs', label: '实时日志', icon: MessageSquare },
            { id: 'settings', label: '通知设置', icon: Bell }
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

        {/* 概览标签页 */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* 核心指标卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">服务状态</h3>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusBg(crawlerStatus?.isRunning ? 'running' : 'stopped')}`}></div>
                  <span className={`text-lg font-bold ${getStatusColor(crawlerStatus?.isRunning ? 'running' : 'stopped')}`}>
                    {crawlerStatus?.isRunning ? '运行中' : '已停止'}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">运行时长: {crawlerStatus?.uptime}</div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">成功率</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {crawlerStatus ? Math.round((crawlerStatus.successfulCrawls / crawlerStatus.totalCrawls) * 100) : 0}%
                </div>
                <div className="text-gray-400 text-sm">
                  {crawlerStatus?.successfulCrawls}/{crawlerStatus?.totalCrawls} 次抓取
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">错误率</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {crawlerStatus?.errorRate || 0}%
                </div>
                <div className="text-gray-400 text-sm">最近24小时</div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">发现机会</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {metrics?.opportunitiesFound || 0}
                </div>
                <div className="text-gray-400 text-sm">本周新增</div>
              </div>
            </div>

            {/* 系统连接状态 */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">系统连接状态</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  {crawlerStatus?.kafkaConnected ? (
                    <Wifi className="w-8 h-8 text-green-400" />
                  ) : (
                    <WifiOff className="w-8 h-8 text-red-400" />
                  )}
                  <div>
                    <div className="text-white font-medium">Kafka 消息队列</div>
                    <div className={`text-sm ${getStatusColor(crawlerStatus?.kafkaConnected ? 'success' : 'error')}`}>
                      {crawlerStatus?.kafkaConnected ? '已连接' : '连接中断'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {crawlerStatus?.qdrantConnected ? (
                    <Database className="w-8 h-8 text-green-400" />
                  ) : (
                    <Database className="w-8 h-8 text-red-400" />
                  )}
                  <div>
                    <div className="text-white font-medium">Qdrant 向量库</div>
                    <div className={`text-sm ${getStatusColor(crawlerStatus?.qdrantConnected ? 'success' : 'error')}`}>
                      {crawlerStatus?.qdrantConnected ? '已连接' : '连接失败'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Activity className={`w-8 h-8 ${getStatusColor(crawlerStatus?.embeddingServiceStatus || 'stopped')}`} />
                  <div>
                    <div className="text-white font-medium">Embedding 服务</div>
                    <div className={`text-sm ${getStatusColor(crawlerStatus?.embeddingServiceStatus || 'stopped')}`}>
                      {crawlerStatus?.embeddingServiceStatus === 'running' ? '运行中' : 
                       crawlerStatus?.embeddingServiceStatus === 'stopped' ? '已停止' : '错误'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 数据流指标 */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">数据流指标</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {metrics?.messagesProduced || 0}
                  </div>
                  <div className="text-gray-400 text-sm">消息生产</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {metrics?.messagesProcessed || 0}
                  </div>
                  <div className="text-gray-400 text-sm">消息处理</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {metrics?.vectorsStored || 0}
                  </div>
                  <div className="text-gray-400 text-sm">向量存储</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {metrics?.processingRate || 0}/min
                  </div>
                  <div className="text-gray-400 text-sm">处理速率</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 数据源状态标签页 */}
        {activeTab === 'sources' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dataSources.map((source) => (
                <div key={source.name} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {source.type === 'reddit' && <Users className="w-5 h-5 text-orange-400" />}
                      {source.type === 'hackernews' && <Globe className="w-5 h-5 text-orange-600" />}
                      {source.type === 'newsletter' && <MessageSquare className="w-5 h-5 text-blue-400" />}
                      {source.type === 'g2' && <BarChart3 className="w-5 h-5 text-green-400" />}
                      {source.type === 'linkedin' && <Users className="w-5 h-5 text-blue-600" />}
                      <div>
                        <h3 className="text-lg font-semibold text-white">{source.name}</h3>
                        <div className="text-gray-400 text-sm capitalize">{source.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleTriggerCrawl(source.name)}
                        disabled={isTriggering}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${isTriggering ? 'animate-spin' : ''}`} />
                        {isTriggering ? '抓取中' : '抓取'}
                      </Button>
                      <div className={`w-3 h-3 rounded-full ${getStatusBg(source.status)}`}></div>
                      <span className={`text-sm font-medium ${getStatusColor(source.status)}`}>
                        {source.status === 'success' ? '正常' : 
                         source.status === 'warning' ? '警告' : '错误'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">HTTP状态:</span>
                      <span className={source.httpStatus === 200 ? 'text-green-400' : 'text-red-400'}>
                        {source.httpStatus}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">响应时间:</span>
                      <span className="text-white">{source.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">最后成功:</span>
                      <span className="text-white">
                        {new Date(source.lastSuccess).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {source.errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="text-red-400 text-sm">{source.errorMessage}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 实时日志标签页 */}
        {activeTab === 'logs' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">实时系统日志</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">实时更新</span>
                </div>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      log.level === 'ERROR' ? 'bg-red-400' :
                      log.level === 'WARNING' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400 text-xs">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-gray-500 text-xs">{log.service}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          log.level === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                          log.level === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {log.level}
                        </span>
                      </div>
                      <div className="text-white text-sm">{log.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 通知设置标签页 */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">通知与告警设置</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">启用系统告警</div>
                    <div className="text-gray-400 text-sm">当系统出现异常时发送通知</div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, enableAlerts: !prev.enableAlerts }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.enableAlerts ? 'bg-emerald-500' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.enableAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">邮件通知</div>
                    <div className="text-gray-400 text-sm">通过邮件接收重要通知</div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.emailNotifications ? 'bg-emerald-500' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Slack Webhook URL</label>
                  <input
                    type="url"
                    value={notifications.slackWebhook}
                    onChange={(e) => setNotifications(prev => ({ ...prev, slackWebhook: e.target.value }))}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-gray-400 text-sm">配置后将向指定Slack频道发送告警消息</div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleTestNotification}
                      disabled={!notifications.slackWebhook}
                    >
                      测试通知
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    错误率阈值: {notifications.errorThreshold}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={notifications.errorThreshold}
                    onChange={(e) => setNotifications(prev => ({ ...prev, errorThreshold: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="text-gray-400 text-sm mt-1">超过此错误率时发送告警</div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    成功率阈值: {notifications.successRateThreshold}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={notifications.successRateThreshold}
                    onChange={(e) => setNotifications(prev => ({ ...prev, successRateThreshold: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="text-gray-400 text-sm mt-1">低于此成功率时发送告警</div>
                </div>

                <Button
                  variant="gradient"
                  onClick={() => {
                    // 保存设置
                    localStorage.setItem('opportunityFinder_notifications', JSON.stringify(notifications));
                    alert('设置已保存');
                  }}
                  className="w-full"
                >
                  保存设置
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}