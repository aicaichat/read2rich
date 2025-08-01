import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Database, TrendingUp, CheckCircle, 
  RefreshCw, BookOpen, Star, Target, BarChart3
} from 'lucide-react';
import Button from '../components/ui/Button';
import { promptOptimizationEngine } from '../lib/prompt-optimization-engine';
import { getCrawlStats, type CrawledPrompt } from '../lib/github-prompt-crawler';

const TestPromptIntegrationPage: React.FC = () => {
  const [crawledPrompts, setCrawledPrompts] = useState<CrawledPrompt[]>([]);
  const [integrationStats, setIntegrationStats] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // 加载数据
  useEffect(() => {
    loadCrawledPrompts();
    loadIntegrationStats();
  }, []);

  const loadCrawledPrompts = () => {
    try {
      const stored = localStorage.getItem('crawled-prompts');
      if (stored) {
        const prompts = JSON.parse(stored);
        setCrawledPrompts(prompts);
      }
    } catch (error) {
      console.error('加载爬取提示词失败:', error);
    }
  };

  const loadIntegrationStats = () => {
    try {
      const stats = promptOptimizationEngine.getCrawledPromptStats();
      setIntegrationStats(stats);
    } catch (error) {
      console.error('加载集成统计失败:', error);
    }
  };

  const refreshIntegration = async () => {
    setIsRefreshing(true);
    try {
      console.log('🔄 刷新提示词库集成...');
      promptOptimizationEngine.refreshCrawledPromptsIntegration();
      
      // 重新加载统计
      setTimeout(() => {
        loadIntegrationStats();
        setTestResult('✅ 提示词库集成刷新成功！');
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('刷新失败:', error);
      setTestResult('❌ 提示词库集成刷新失败');
      setIsRefreshing(false);
    }
  };

  const crawlStats = crawledPrompts.length > 0 ? getCrawlStats(crawledPrompts) : null;

  return (
    <div className="min-h-screen pt-20 pb-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 提示词库集成测试
          </h1>
          <p className="text-xl text-gray-300">
            测试GitHub爬取提示词库与AI生成系统的集成效果
          </p>
        </motion.div>

        {/* 统计卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* 爬取统计 */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Database className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">
                {crawledPrompts.length}
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">爬取提示词</h3>
            <p className="text-gray-400 text-sm">
              来自GitHub的优质提示词
            </p>
          </motion.div>

          {/* 集成统计 */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="w-8 h-8 text-emerald-400" />
              <span className="text-2xl font-bold text-white">
                {integrationStats?.patterns_with_prompts || 0}
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">增强专家</h3>
            <p className="text-gray-400 text-sm">
              已集成提示词的专家模式
            </p>
          </motion.div>

          {/* 关联提示词 */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">
                {integrationStats?.total_related_prompts || 0}
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">关联提示词</h3>
            <p className="text-gray-400 text-sm">
              总计匹配的相关提示词
            </p>
          </motion.div>

          {/* 领域覆盖 */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold text-white">
                {Object.keys(integrationStats?.prompts_by_domain || {}).length}
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">覆盖领域</h3>
            <p className="text-gray-400 text-sm">
              已覆盖的专业领域
            </p>
          </motion.div>
        </div>

        {/* 操作区域 */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">🔧 集成控制</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button 
              onClick={refreshIntegration}
              disabled={isRefreshing}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? '刷新中...' : '刷新集成'}
            </Button>
            
            <Button 
              onClick={loadIntegrationStats}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              重新统计
            </Button>
          </div>

          {testResult && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-200">{testResult}</p>
            </div>
          )}
        </motion.div>

        {/* 详细统计 */}
        {integrationStats && (
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">📊 集成详情</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* 专家模式状态 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">专家模式状态</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">总专家模式:</span>
                    <span className="text-white font-semibold">{integrationStats.total_patterns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">已增强专家:</span>
                    <span className="text-emerald-400 font-semibold">{integrationStats.patterns_with_prompts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">增强率:</span>
                    <span className="text-purple-400 font-semibold">
                      {integrationStats.total_patterns > 0 
                        ? Math.round((integrationStats.patterns_with_prompts / integrationStats.total_patterns) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 领域分布 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">领域分布</h3>
                <div className="space-y-3">
                  {Object.entries(integrationStats.prompts_by_domain).map(([domain, count]) => (
                    <div key={domain} className="flex justify-between">
                      <span className="text-gray-300 capitalize">{domain}:</span>
                      <span className="text-blue-400 font-semibold">{count as number} 个</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 爬取统计 */}
        {crawlStats && (
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">📚 爬取库统计</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">总计</h4>
                <p className="text-2xl font-bold text-emerald-400">{crawlStats.total}</p>
                <p className="text-gray-400 text-sm">个提示词</p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-3">来源</h4>
                <p className="text-2xl font-bold text-blue-400">{Object.keys(crawlStats.bySource).length}</p>
                <p className="text-gray-400 text-sm">个GitHub仓库</p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-3">分类</h4>
                <p className="text-2xl font-bold text-purple-400">{Object.keys(crawlStats.byCategory).length}</p>
                <p className="text-gray-400 text-sm">个类别</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">类别分布</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(crawlStats.category_distribution).map(([category, count]) => (
                  <div key={category} className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white font-semibold capitalize">{category}</p>
                    <p className="text-gray-400">{count as number} 个</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 使用说明 */}
        <motion.div
          className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-yellow-200 font-semibold mb-3 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            📋 使用说明
          </h3>
          <ul className="text-yellow-100 text-sm space-y-2">
            <li>• 系统会自动将爬取的GitHub提示词库集成到专家模式中</li>
            <li>• 生成提示词时，AI会参考相关的优质提示词模板</li>
            <li>• 每个专家模式最多关联5个最相关的提示词</li>
            <li>• 当爬取新的提示词后，点击"刷新集成"来更新关联</li>
            <li>• 集成统计会显示当前的集成状态和覆盖情况</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default TestPromptIntegrationPage; 