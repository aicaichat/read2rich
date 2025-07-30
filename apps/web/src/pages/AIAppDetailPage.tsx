import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  TrendingUp, 
  Users, 
  Zap, 
  ExternalLink, 
  ArrowLeft,
  Award,
  BarChart3,
  Lightbulb,
  Target,
  Rocket,
  CheckCircle,
  AlertTriangle,
  Eye,
  Code,
  DollarSign,
  Globe,
  Clock
} from 'lucide-react';
import { aiRankingManager, AIApp } from '@/lib/ai-apps-ranking';
import Button from '@/components/ui/Button';

export default function AIAppDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<AIApp | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'technology' | 'business'>('overview');

  useEffect(() => {
    loadAppData();
  }, [id]);

  const loadAppData = async () => {
    if (!id) return;
    
    try {
      const appData = await aiRankingManager.getAppById(parseInt(id));
      setApp(appData);
    } catch (error) {
      console.error('加载应用数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI助手': return <Zap className="w-5 h-5" />;
      case '内容创作': return <Lightbulb className="w-5 h-5" />;
      case '图像生成': return <Target className="w-5 h-5" />;
      case '代码开发': return <BarChart3 className="w-5 h-5" />;
      default: return <Rocket className="w-5 h-5" />;
    }
  };

  const getSuccessFactorColor = (score: number) => {
    if (score >= 9) return 'text-emerald-400';
    if (score >= 8) return 'text-blue-400';
    if (score >= 7) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="bg-gray-800 rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="text-gray-400 text-lg mb-4">应用不存在</div>
            <Button onClick={() => navigate('/ai-ranking')}>
              返回排行榜
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* 返回按钮 */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/ai-ranking')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          返回排行榜
        </Button>
      </div>

      {/* 应用头部信息 */}
      <section className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-2xl border border-white/10 p-8"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 应用Logo和基本信息 */}
              <div className="flex-shrink-0">
                <img 
                  src={app.logo} 
                  alt={app.name}
                  className="w-32 h-32 rounded-2xl object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold text-white">{app.name}</h1>
                  <Award className="w-6 h-6 text-yellow-400" />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    {getCategoryIcon(app.category)}
                    <span>{app.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{app.metrics.rating}</span>
                    <span className="text-gray-400">({app.metrics.reviews} 评价)</span>
                  </div>
                </div>

                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {app.description}
                </p>

                {/* 关键指标 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{app.metrics.users}</div>
                    <div className="text-gray-400 text-sm">用户数</div>
                  </div>
                  {app.metrics.revenue && (
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">{app.metrics.revenue}</div>
                      <div className="text-gray-400 text-sm">年收入</div>
                    </div>
                  )}
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-400">{app.successFactors.overall}</div>
                    <div className="text-gray-400 text-sm">综合评分</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{app.successFactors.growth}</div>
                    <div className="text-gray-400 text-sm">增长潜力</div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-4">
                  <Button
                    variant="gradient"
                    onClick={() => window.open(app.website, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    访问网站
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const idea = `我想做一个类似${app.name}的AI应用，主要功能包括：${app.features.slice(0, 3).join('、')}。目标用户是${app.businessModel.targetUsers.join('、')}。`;
                      navigate(`/chat?initialIdea=${encodeURIComponent(idea)}`);
                    }}
                  >
                    分析需求
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 标签页导航 */}
      <section className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
            {[
              { id: 'overview', label: '概览', icon: Eye },
              { id: 'analysis', label: '成功分析', icon: BarChart3 },
              { id: 'technology', label: '技术栈', icon: Code },
              { id: 'business', label: '商业模式', icon: DollarSign }
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
        </div>
      </section>

      {/* 标签页内容 */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* 功能特性 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">核心功能</h3>
                <div className="space-y-3">
                  {app.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 定价信息 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">定价策略</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">定价模式</span>
                    <span className="text-white font-semibold">{app.pricing.pricingModel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">免费版本</span>
                    <span className={`font-semibold ${app.pricing.free ? 'text-green-400' : 'text-red-400'}`}>
                      {app.pricing.free ? '是' : '否'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">付费版本</span>
                    <span className={`font-semibold ${app.pricing.paid ? 'text-blue-400' : 'text-gray-400'}`}>
                      {app.pricing.paid ? '是' : '否'}
                    </span>
                  </div>
                  {app.pricing.priceRange && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">价格范围</span>
                      <span className="text-white font-semibold">{app.pricing.priceRange}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 标签 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">应用标签</h3>
                <div className="flex flex-wrap gap-2">
                  {app.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 目标用户 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">目标用户</h3>
                <div className="space-y-2">
                  {app.businessModel.targetUsers.map((user, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{user}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analysis' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* 成功因素评分 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-6">成功因素评分</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(app.successFactors).map(([factor, score]) => {
                    if (factor === 'overall') return null;
                    return (
                      <div key={factor} className="text-center">
                        <div className={`text-3xl font-bold mb-2 ${getSuccessFactorColor(score)}`}>
                          {score}/10
                        </div>
                        <div className="text-gray-400 text-sm">
                          {factor === 'innovation' ? '创新程度' :
                           factor === 'marketFit' ? '市场匹配' :
                           factor === 'execution' ? '执行能力' : '增长潜力'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SWOT分析 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    优势 (Strengths)
                  </h3>
                  <ul className="space-y-2">
                    {app.analysis.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    劣势 (Weaknesses)
                  </h3>
                  <ul className="space-y-2">
                    {app.analysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    机会 (Opportunities)
                  </h3>
                  <ul className="space-y-2">
                    {app.analysis.opportunities.map((opportunity, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    威胁 (Threats)
                  </h3>
                  <ul className="space-y-2">
                    {app.analysis.threats.map((threat, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">•</span>
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 关键洞察 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  关键洞察
                </h3>
                <div className="space-y-3">
                  {app.analysis.keyInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'technology' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* AI模型 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  AI模型
                </h3>
                <div className="space-y-2">
                  {app.technology.aiModels.map((model, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300">{model}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 技术栈 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  技术栈
                </h3>
                <div className="space-y-2">
                  {app.technology.techStack.map((tech, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* API集成 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-400" />
                  API集成
                </h3>
                <div className="space-y-2">
                  {app.technology.apiIntegrations.map((api, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">{api}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 创建时间 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  时间信息
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">创建时间</span>
                    <span className="text-white">{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">更新时间</span>
                    <span className="text-white">{new Date(app.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'business' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* 商业模式 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-6">商业模式分析</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">基本信息</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">商业模式类型</span>
                        <span className="text-white font-semibold">{app.businessModel.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">价值主张</span>
                        <span className="text-white font-semibold">{app.businessModel.valueProposition}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">变现方式</h4>
                    <div className="space-y-2">
                      {app.businessModel.monetization.map((method, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{method}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 目标用户分析 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">目标用户分析</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {app.businessModel.targetUsers.map((user, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 text-center">
                      <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <span className="text-white font-medium">{user}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 市场表现 */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">市场表现</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{app.metrics.users}</div>
                    <div className="text-gray-400 text-sm">用户规模</div>
                  </div>
                  {app.metrics.revenue && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">{app.metrics.revenue}</div>
                      <div className="text-gray-400 text-sm">年收入</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">{app.metrics.rating}</div>
                    <div className="text-gray-400 text-sm">用户评分</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{app.metrics.reviews}</div>
                    <div className="text-gray-400 text-sm">评价数量</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
} 