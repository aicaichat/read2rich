import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  TrendingUp, 
  Users, 
  Zap, 
  Filter, 
  Search, 
  ExternalLink, 
  Award,
  BarChart3,
  Lightbulb,
  Target,
  Rocket,
  DollarSign
} from 'lucide-react';
import { aiRankingManager, AIApp, AI_APP_CATEGORIES } from '@/lib/ai-apps-ranking';
import Button from '@/components/ui/Button';

export default function AIRankingPage() {
  const [apps, setApps] = useState<AIApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<AIApp[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'overall' | 'rating' | 'growth' | 'innovation'>('overall');
  const [stats, setStats] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [fundedApps, setFundedApps] = useState<AIApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortApps();
  }, [apps, selectedCategory, searchTerm, sortBy]);

  const loadData = async () => {
    try {
      const [allApps, statsData, analysisData, latestFunding] = await Promise.all([
        aiRankingManager.getAllApps(),
        aiRankingManager.getStats(),
        aiRankingManager.getSuccessFactorsAnalysis(),
        aiRankingManager.getLatestFundedApps(10)
      ]);
      
      setApps(allApps);
      setStats(statsData);
      setAnalysis(analysisData);
      setFundedApps(latestFunding);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortApps = () => {
    let filtered = apps;

    // 按分类筛选
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    // 按搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.metrics.rating - a.metrics.rating;
        case 'growth':
          return b.successFactors.growth - a.successFactors.growth;
        case 'innovation':
          return b.successFactors.innovation - a.successFactors.innovation;
        default:
          return b.successFactors.overall - a.successFactors.overall;
      }
    });

    setFilteredApps(filtered);
  };

  const getSortLabel = (type: string) => {
    switch (type) {
      case 'overall': return '综合评分';
      case 'rating': return '用户评分';
      case 'growth': return '增长潜力';
      case 'innovation': return '创新程度';
      default: return '综合评分';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI助手': return <Zap className="w-4 h-4" />;
      case '内容创作': return <Lightbulb className="w-4 h-4" />;
      case '图像生成': return <Target className="w-4 h-4" />;
      case '代码开发': return <BarChart3 className="w-4 h-4" />;
      default: return <Rocket className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-emerald-900/20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">全球AI应用</span>
              <span className="text-gradient block">排行榜</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              发现全球最优秀的AI应用，分析成功因素，为你的百万应用提供灵感
            </p>
            
            {/* 统计信息 */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-gray-400 text-sm">AI应用</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white">{stats.categories}</div>
                  <div className="text-gray-400 text-sm">分类</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white">{stats.avgRating}</div>
                  <div className="text-gray-400 text-sm">平均评分</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white">{stats.paidPercentage}%</div>
                  <div className="text-gray-400 text-sm">付费应用</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 筛选和搜索 */}
      <section className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索AI应用..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* 分类筛选 */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="全部">全部分类</option>
                  {AI_APP_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* 排序 */}
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="overall">综合评分</option>
                  <option value="rating">用户评分</option>
                  <option value="growth">增长潜力</option>
                  <option value="innovation">创新程度</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 成功案例展示区域 */}
      <section className="px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">🌟 成功案例</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              这些真实案例证明，普通人也能在AI时代创造奇迹
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cal AI 案例 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/30 p-6 hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Cal AI</h3>
                  <p className="text-sm text-emerald-400">健康管理</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">开发者</span>
                  <span className="text-white font-semibold">两位高中生</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">开发时间</span>
                  <span className="text-white font-semibold">8个月</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">下载量</span>
                  <span className="text-emerald-400 font-bold">500万+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">月收入</span>
                  <span className="text-emerald-400 font-bold">$100万+</span>
                </div>
              </div>

              <div className="bg-emerald-500/10 rounded-lg p-3 mb-4">
                <p className="text-sm text-emerald-300">
                  <strong>成功秘诀：</strong>抓住刚需痛点，极简体验，快速验证
                </p>
              </div>

              <Button
                variant="gradient"
                size="sm"
                className="w-full"
                onClick={() => {
                  const idea = "我想做一个类似Cal AI的AI应用，主要功能包括：拍照识别食物、自动计算卡路里、营养信息分析。目标用户是健身爱好者、减肥人群、健康意识用户。";
                  window.location.href = `/chat?initialIdea=${encodeURIComponent(idea)}`;
                }}
              >
                分析这个案例
              </Button>
            </motion.div>

            {/* Cursor AI 案例 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💻</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Cursor AI</h3>
                  <p className="text-sm text-purple-400">代码开发</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">首年收入</span>
                  <span className="text-purple-400 font-bold">$1亿+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">估值</span>
                  <span className="text-purple-400 font-bold">$90亿</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">用户数</span>
                  <span className="text-white font-semibold">36万+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">融资轮次</span>
                  <span className="text-white font-semibold">B轮</span>
                </div>
              </div>

              <div className="bg-purple-500/10 rounded-lg p-3 mb-4">
                <p className="text-sm text-purple-300">
                  <strong>成功秘诀：</strong>垂直深耕，产品驱动增长，社区力量
                </p>
              </div>

              <Button
                variant="gradient"
                size="sm"
                className="w-full"
                onClick={() => {
                  const idea = "我想做一个类似Cursor AI的AI应用，主要功能包括：AI代码生成、智能代码补全、代码解释和重构。目标用户是软件开发者、编程学习者、技术团队。";
                  window.location.href = `/chat?initialIdea=${encodeURIComponent(idea)}`;
                }}
              >
                分析这个案例
              </Button>
            </motion.div>

            {/* Remini AI 案例 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-2xl border border-pink-500/30 p-6 hover:border-pink-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📸</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Remini AI</h3>
                  <p className="text-sm text-pink-400">图像生成</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">两周收入</span>
                  <span className="text-pink-400 font-bold">$700万</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">下载量</span>
                  <span className="text-pink-400 font-bold">4000万+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">App Store</span>
                  <span className="text-white font-semibold">多国榜首</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">核心功能</span>
                  <span className="text-white font-semibold">AI写真</span>
                </div>
              </div>

              <div className="bg-pink-500/10 rounded-lg p-3 mb-4">
                <p className="text-sm text-pink-300">
                  <strong>成功秘诀：</strong>情感需求爆发力，社交传播，Freemium模式
                </p>
              </div>

              <Button
                variant="gradient"
                size="sm"
                className="w-full"
                onClick={() => {
                  const idea = "我想做一个类似Remini AI的AI应用，主要功能包括：AI写真生成、Baby AI预测、照片修复增强。目标用户是年轻用户、社交媒体用户、情感需求用户。";
                  window.location.href = `/chat?initialIdea=${encodeURIComponent(idea)}`;
                }}
              >
                分析这个案例
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 成功因素分析 */}
      {analysis && (
        <section className="px-6 mb-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">成功因素分析</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(analysis).map(([factor, data]: [string, any]) => (
                <div key={factor} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    {factor === 'innovation' && <Lightbulb className="w-5 h-5 text-yellow-400" />}
                    {factor === 'marketFit' && <Target className="w-5 h-5 text-green-400" />}
                    {factor === 'execution' && <Rocket className="w-5 h-5 text-blue-400" />}
                    {factor === 'growth' && <TrendingUp className="w-5 h-5 text-purple-400" />}
                    <h3 className="text-lg font-semibold text-white capitalize">
                      {factor === 'marketFit' ? '市场匹配' : 
                       factor === 'innovation' ? '创新程度' :
                       factor === 'execution' ? '执行能力' : '增长潜力'}
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{data.avg}/10</div>
                  <div className="text-gray-400 text-sm mb-4">平均评分</div>
                  <div className="space-y-2">
                    {data.top.map((app: AIApp, index: number) => (
                      <div key={app.id} className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">#{index + 1}</span>
                        <span className="text-white">{app.name}</span>
                        <span className="text-emerald-400">{app.successFactors[factor as keyof typeof app.successFactors]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 最新融资应用 */}
      {fundedApps.length > 0 && (
        <section className="px-6 mb-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-400" /> 最近融资
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fundedApps.map(app => (
                <div key={app.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={app.logo} alt={app.name} className="w-12 h-12 rounded-md object-cover" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                      {app.latestFunding && (
                        <div className="text-sm text-gray-400">
                          {app.latestFunding.round} · ${app.latestFunding.amount.toLocaleString()} · {new Date(app.latestFunding.date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2">{app.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI应用列表 */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              按{getSortLabel(sortBy)}排序
            </h2>
            <span className="text-gray-400">共 {filteredApps.length} 个应用</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
              >
                {/* 应用头部 */}
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={app.logo} 
                      alt={app.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {app.name}
                        </h3>
                        {index < 3 && (
                          <Award className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        {getCategoryIcon(app.category)}
                        <span>{app.category}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white">{app.metrics.rating}</span>
                          <span className="text-gray-400">({app.metrics.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-400">{app.metrics.users}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 描述 */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {app.description}
                  </p>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 成功因素评分 */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-400">{app.successFactors.overall}</div>
                      <div className="text-xs text-gray-400">综合评分</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{app.successFactors.growth}</div>
                      <div className="text-xs text-gray-400">增长潜力</div>
                    </div>
                  </div>

                  {/* 定价信息 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {app.pricing.free && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          免费
                        </span>
                      )}
                      {app.pricing.paid && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          付费
                        </span>
                      )}
                    </div>
                    {app.pricing.priceRange && (
                      <span className="text-sm text-gray-400">{app.pricing.priceRange}</span>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(app.website, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      访问网站
                    </Button>
                    <Button
                      variant="gradient"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        // 跳转到需求分析页面，预填充应用信息
                        const idea = `我想做一个类似${app.name}的AI应用，主要功能包括：${app.features.slice(0, 3).join('、')}。目标用户是${app.businessModel.targetUsers.join('、')}。`;
                        window.location.href = `/chat?initialIdea=${encodeURIComponent(idea)}`;
                      }}
                    >
                      分析需求
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">没有找到匹配的AI应用</div>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedCategory('全部');
                  setSearchTerm('');
                }}
              >
                清除筛选条件
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 