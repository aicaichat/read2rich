import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, DollarSign, Clock } from 'lucide-react';
import ReportPreview from '../components/ReportPreview';
import PaymentModal from '../components/PaymentModal';
import { APP_CONFIG } from '../config';

interface UserProfile {
  experience: string;
  industry: string[];
  investmentRange: string;
  riskTolerance: string;
  timeCommitment: string;
  goals: string[];
  preferredMarkets: string[];
  skills: string[];
  hasTeam: boolean;
  hasTechnicalSkills: boolean;
  hasMarketingExperience: boolean;
}

const BusinessReportPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('5'); // 使用数字ID对应clothingMatcherReport

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      
      // 根据用户画像选择推荐的商机
      if (profile.preferredMarkets.includes('Technology') && profile.skills.includes('Programming')) {
        setSelectedOpportunityId('5'); // AI服装搭配师
      } else if (profile.goals.includes('Passive Income')) {
        setSelectedOpportunityId('1'); // AI职业路径规划师
      } else {
        setSelectedOpportunityId('4'); // AI梦境日记分析器
      }
    } else {
      navigate('/onboarding');
    }
  }, [navigate]);

  const handlePaymentSuccess = (reportData: any) => {
    console.log('支付成功，报告数据:', reportData);
    // 可以跳转到报告下载页面或显示成功消息
    navigate('/dashboard');
  };

  const getOpportunityTitle = (id: string) => {
    const titles: Record<string, string> = {
      '5': 'AI服装搭配师 (AI-Based Clothing Matcher)',
      '1': 'AI职业路径规划师 (AI Career Path Finder)', 
      '4': 'AI梦境日记分析器 (AI Dream Journal Analyzer)'
    };
    return titles[id] || 'AI服装搭配师 (AI-Based Clothing Matcher)';
  };

  const getOpportunityInfo = (id: string) => {
    const info: Record<string, any> = {
      '5': {
        description: '解决"今天穿什么"这一永恒问题。用户通过拍照上传衣物，应用自动识别类别、颜色、材质等属性。根据天气、场合、心情生成穿搭方案，提供AR虚拟试穿功能，分析衣橱使用情况。',
        marketSize: '680亿时尚电商市场',
        timeToMarket: '14-20周',
        investmentRequired: '$150k-750k/年',
        expectedRevenue: '$2-15M ARR',
        tags: ['AI', 'Fashion', 'Computer Vision', 'AR', 'E-commerce'],
        difficulty: 'Hard',
        scores: {
          marketPotential: 9.1,
          competitiveness: 7.3,
          aiReadiness: 8.8,
          personalFit: 8.7,
          riskLevel: 6.3,
          overallScore: 8.6
        }
      },
      '1': {
        description: '针对特定行业或兴趣群体的专业市场平台，连接供需双方，提供交易、支付、物流等全套服务。',
        marketSize: '350亿垂直电商市场',
        timeToMarket: '12-18周',
        investmentRequired: '$50k-200k/年',
        expectedRevenue: '$500K-5M ARR',
        tags: ['Marketplace', 'E-commerce', 'Platform', 'SaaS'],
        difficulty: 'Medium',
        scores: {
          marketPotential: 8.5,
          competitiveness: 6.8,
          aiReadiness: 7.2,
          personalFit: 8.9,
          riskLevel: 5.5,
          overallScore: 8.2
        }
      },
      '4': {
        description: '直接面向消费者的品牌电商，通过自有渠道销售独特产品，建立品牌忠诚度和客户关系。',
        marketSize: '450亿D2C市场',
        timeToMarket: '8-16周',
        investmentRequired: '$25k-150k/年',
        expectedRevenue: '$100K-2M ARR',
        tags: ['D2C', 'E-commerce', 'Brand', 'Direct Sales'],
        difficulty: 'Medium',
        scores: {
          marketPotential: 8.0,
          competitiveness: 7.5,
          aiReadiness: 6.5,
          personalFit: 7.8,
          riskLevel: 6.8,
          overallScore: 7.6
        }
      }
    };
    return info[id] || info['5'];
  };

  if (!userProfile) {
    return (
      <div className="pt-16 min-h-screen bg-dark-300 flex items-center justify-center">
        <div className="text-white text-xl">生成个性化报告中...</div>
      </div>
    );
  }

  const opportunity = getOpportunityInfo(selectedOpportunityId);
  const opportunityTitle = getOpportunityTitle(selectedOpportunityId);

  return (
    <div className="pt-16 min-h-screen bg-dark-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/onboarding')}
            className="btn-ghost flex items-center space-x-2 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('report.back_to_list')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 机会标题和基本信息 */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {opportunityTitle}
                  </h1>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-white">
                      {t('report.overall_score', { score: opportunity.scores.overallScore })}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      opportunity.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                      opportunity.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {opportunity.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-white/80 text-lg leading-relaxed mb-6">
                {opportunity.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-6 h-6 text-primary-500" />
                  <div>
                    <div className="text-white/60 text-sm">{t('report.expected_revenue')}</div>
                    <div className="text-white font-medium">{opportunity.expectedRevenue}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-primary-500" />
                  <div>
                    <div className="text-white/60 text-sm">{t('report.time_to_market')}</div>
                    <div className="text-white font-medium">{opportunity.timeToMarket}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {opportunity.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-500/20 text-primary-400 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 使用 DeepNeed 的 ReportPreview 组件 */}
            <ReportPreview 
              opportunityId={selectedOpportunityId}
              opportunityTitle={opportunityTitle}
            />
          </div>

          {/* 侧边栏 - 评分和付费选项 */}
          <div className="space-y-6">
            {/* 评分雷达 */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">{t('report.scoring.title')}</h3>
              <div className="space-y-3">
                {Object.entries(opportunity.scores).map(([key, score]) => {
                  if (key === 'overallScore') return null;
                  const labels: Record<string, string> = {
                    marketPotential: t('report.scoring.market_potential'),
                    competitiveness: t('report.scoring.competitiveness'),
                    aiReadiness: t('report.scoring.ai_readiness'),
                    personalFit: t('report.scoring.personal_fit'),
                    riskLevel: t('report.scoring.risk_level')
                  };
                  return (
                    <div key={key} className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/70 text-sm">{labels[key] || key}</span>
                        <span className="text-white text-sm font-medium">{score}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 付费方案 */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">{t('report.pricing.title')}</h3>
              
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500 mb-2">
                    ¥{APP_CONFIG.COMMERCE.PRICES.PREMIUM_REPORT}
                  </div>
                  <p className="text-white/80 text-sm mb-4">
                    深度HTML报告 + 路演版BP（WebPPT）
                  </p>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full btn-primary py-3"
                  >
                    ¥{APP_CONFIG.COMMERCE.PRICES.PREMIUM_REPORT}解锁 报告+BP（立即获取）
                  </button>
                </div>
              </div>

              <div className="text-center text-white/60 text-sm">
                <p>• 50+页详细商业计划书</p>
                <p>• 完整技术实现方案</p>
                <p>• 可运行MVP代码模板</p>
                <p>• 3年财务预测模型</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 使用 DeepNeed 的 PaymentModal 组件 */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        opportunityId={selectedOpportunityId}
        opportunityTitle={opportunityTitle}
        price={APP_CONFIG.COMMERCE.PRICES.PREMIUM_REPORT}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default BusinessReportPage;