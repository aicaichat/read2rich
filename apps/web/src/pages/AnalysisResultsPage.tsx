import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Brain, 
  BarChart3, 
  Lightbulb,
  Globe,
  Star,
  Clock,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface OpportunityInsight {
  title: string;
  confidence_score: number;
  trend_direction: 'rising' | 'stable' | 'declining';
  keywords: string[];
  sources: string[];
  opportunity_type: string;
  potential_impact: string;
  urgency: string;
  description: string;
  supporting_evidence: string[];
}

interface AnalysisReport {
  report_id: string;
  generated_at: string;
  data_sources: string[];
  total_items_analyzed: number;
  analysis_period: string;
  
  top_opportunities: OpportunityInsight[];
  trending_topics: Array<{
    topic: string;
    frequency: number;
    trend_score: number;
    category: string;
  }>;
  emerging_technologies: Array<{
    technology: string;
    mention_count: number;
    sources: string[];
    relevance_score: number;
  }>;
  market_signals: Array<{
    title: string;
    signal_strength: number;
    keywords: string[];
    source: string;
    url: string;
    relevance_score: number;
  }>;
  
  source_distribution: Record<string, number>;
  sentiment_analysis: {
    average_sentiment: number;
    positive_ratio: number;
    neutral_ratio: number;
    negative_ratio: number;
  };
  keyword_frequency: Record<string, number>;
  temporal_trends: Record<string, number[]>;
  
  data_quality_score: number;
  confidence_level: number;
  recommendation_summary: string;
}

export default function AnalysisResultsPage() {
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('opportunities');

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const fetchLatestAnalysis = async () => {
    try {
      // 模拟获取分析数据 - 实际应该从API获取
      const mockReport: AnalysisReport = {
        report_id: "analysis_1754567890",
        generated_at: new Date().toISOString(),
        data_sources: ["hacker_news", "dev.to", "product_hunt"],
        total_items_analyzed: 45,
        analysis_period: "最近抓取的 45 条数据",
        
        top_opportunities: [
          {
            title: "NewsHub - AI-Powered News Aggregation Platform",
            confidence_score: 0.856,
            trend_direction: "rising",
            keywords: ["ai", "platform", "news", "aggregation"],
            sources: ["dev.to"],
            opportunity_type: "technology",
            potential_impact: "high",
            urgency: "short_term",
            description: "这是一个技术创新机会，呈上升趋势。主要涉及ai, platform等领域。",
            supporting_evidence: ["AI-powered news platform gaining traction"]
          },
          {
            title: "2025's API Management Winners: Which Tools Make the List?",
            confidence_score: 0.782,
            trend_direction: "stable",
            keywords: ["api", "management", "tools"],
            sources: ["dev.to"],
            opportunity_type: "product",
            potential_impact: "medium",
            urgency: "immediate",
            description: "这是一个产品机会，保持稳定。主要涉及api, tools等领域。",
            supporting_evidence: ["API management tools comparison"]
          },
          {
            title: "Speak Your Logic: AI-Powered DSA Prep Aid",
            confidence_score: 0.745,
            trend_direction: "rising",
            keywords: ["ai", "education", "dsa"],
            sources: ["dev.to"],
            opportunity_type: "technology",
            potential_impact: "high",
            urgency: "short_term",
            description: "这是一个技术创新机会，呈上升趋势。主要涉及ai, education等领域。",
            supporting_evidence: ["AI education tools trending"]
          }
        ],
        
        trending_topics: [
          { topic: "ai", frequency: 12, trend_score: 0.8, category: "technology" },
          { topic: "platform", frequency: 8, trend_score: 0.6, category: "product" },
          { topic: "automation", frequency: 6, trend_score: 0.7, category: "technology" },
          { topic: "api", frequency: 5, trend_score: 0.5, category: "product" }
        ],
        
        emerging_technologies: [
          { technology: "ai", mention_count: 12, sources: ["dev.to", "hacker_news"], relevance_score: 0.9 },
          { technology: "machine learning", mention_count: 8, sources: ["hacker_news"], relevance_score: 0.8 },
          { technology: "blockchain", mention_count: 4, sources: ["dev.to"], relevance_score: 0.6 }
        ],
        
        market_signals: [
          {
            title: "AI Startup Funding Surge",
            signal_strength: 5,
            keywords: ["funding", "ai", "startup"],
            source: "hacker_news",
            url: "https://example.com",
            relevance_score: 0.9
          }
        ],
        
        source_distribution: {
          "hacker_news": 20,
          "dev.to": 15,
          "product_hunt": 10
        },
        
        sentiment_analysis: {
          average_sentiment: 0.15,
          positive_ratio: 0.65,
          neutral_ratio: 0.30,
          negative_ratio: 0.05
        },
        
        keyword_frequency: {
          "ai": 12,
          "platform": 8,
          "tool": 6,
          "startup": 5,
          "innovation": 4
        },
        
        temporal_trends: {
          "hourly_activity": [2, 3, 1, 4, 6, 8, 5, 3, 2, 1]
        },
        
        data_quality_score: 0.92,
        confidence_level: 0.88,
        recommendation_summary: "重点关注AI驱动的平台和工具，特别是新闻聚合和教育科技领域。建议立即投入资源到置信度超过80%的机会。"
      };
      
      setAnalysisReport(mockReport);
    } catch (error) {
      console.error('获取分析报告失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'rising':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-500 bg-red-100';
      case 'medium':
        return 'text-yellow-500 bg-yellow-100';
      default:
        return 'text-blue-500 bg-blue-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'text-red-500 bg-red-100';
      case 'short_term':
        return 'text-orange-500 bg-orange-100';
      default:
        return 'text-green-500 bg-green-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在分析数据...</p>
        </div>
      </div>
    );
  }

  if (!analysisReport) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">无法加载分析报告</p>
          <Button onClick={fetchLatestAnalysis} className="mt-4">
            重新加载
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="w-8 h-8 text-blue-600 mr-3" />
                AI机会发现分析报告
              </h1>
              <p className="text-gray-600 mt-2">
                基于 {analysisReport.total_items_analyzed} 条数据的智能分析
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                生成时间: {new Date(analysisReport.generated_at).toLocaleString()}
              </div>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  置信度: {(analysisReport.confidence_level * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {analysisReport.top_opportunities.length}
                </p>
                <p className="text-gray-600">识别机会</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {analysisReport.trending_topics.length}
                </p>
                <p className="text-gray-600">热门趋势</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {analysisReport.emerging_technologies.length}
                </p>
                <p className="text-gray-600">新兴技术</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {(analysisReport.data_quality_score * 100).toFixed(0)}%
                </p>
                <p className="text-gray-600">数据质量</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'opportunities', label: '机会洞察', icon: Target },
                { id: 'trends', label: '趋势分析', icon: TrendingUp },
                { id: 'technologies', label: '新兴技术', icon: Lightbulb },
                { id: 'analysis', label: '深度分析', icon: Brain }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'opportunities' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">顶级机会洞察</h2>
              
              {analysisReport.top_opportunities.map((opportunity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {opportunity.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{opportunity.description}</p>
                    </div>
                    <div className="flex items-center ml-4">
                      {getTrendIcon(opportunity.trend_direction)}
                      <span className="ml-2 text-2xl font-bold text-blue-600">
                        {(opportunity.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {opportunity.keywords.map((keyword, kIndex) => (
                      <span
                        key={kIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(opportunity.potential_impact)}`}>
                        {opportunity.potential_impact === 'high' ? '高影响' : 
                         opportunity.potential_impact === 'medium' ? '中影响' : '低影响'}
                      </span>
                      
                      <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(opportunity.urgency)}`}>
                        {opportunity.urgency === 'immediate' ? '立即' : 
                         opportunity.urgency === 'short_term' ? '短期' : '长期'}
                      </span>
                      
                      <span className="text-sm text-gray-500">
                        类型: {opportunity.opportunity_type}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Globe className="w-4 h-4 mr-1" />
                      {opportunity.sources.join(', ')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {selectedTab === 'trends' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">热门趋势分析</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisReport.trending_topics.map((trend, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {trend.topic}
                      </h3>
                      <span className="text-2xl font-bold text-orange-600">
                        {trend.frequency}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>趋势强度</span>
                        <span>{(trend.trend_score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${trend.trend_score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {trend.category}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'technologies' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">新兴技术雷达</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysisReport.emerging_technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow p-6 text-center"
                  >
                    <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tech.technology}
                    </h3>
                    
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {tech.mention_count}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      次提及
                    </p>
                    
                    <div className="text-sm text-gray-500">
                      相关性: {(tech.relevance_score * 100).toFixed(0)}%
                    </div>
                    
                    <div className="mt-4 flex flex-wrap justify-center gap-1">
                      {tech.sources.map((source, sIndex) => (
                        <span
                          key={sIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'analysis' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">深度分析</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 情感分析 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">情感分析</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>积极情感</span>
                        <span>{(analysisReport.sentiment_analysis.positive_ratio * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${analysisReport.sentiment_analysis.positive_ratio * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>中性情感</span>
                        <span>{(analysisReport.sentiment_analysis.neutral_ratio * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${analysisReport.sentiment_analysis.neutral_ratio * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>消极情感</span>
                        <span>{(analysisReport.sentiment_analysis.negative_ratio * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${analysisReport.sentiment_analysis.negative_ratio * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 数据源分布 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">数据源分布</h3>
                  
                  <div className="space-y-3">
                    {Object.entries(analysisReport.source_distribution).map(([source, count]) => {
                      const percentage = (count / analysisReport.total_items_analyzed) * 100;
                      return (
                        <div key={source}>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span className="capitalize">{source.replace('_', ' ')}</span>
                            <span>{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 推荐建议 */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  AI推荐建议
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {analysisReport.recommendation_summary}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}