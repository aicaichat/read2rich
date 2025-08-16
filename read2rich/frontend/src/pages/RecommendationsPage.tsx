import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Star, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Zap,
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface BusinessModel {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  pros: string[];
  cons: string[];
  investmentRange: string;
  timeToMarket: string;
  difficultyLevel: number;
  matchScore: number;
  examples: string[];
  requiredSkills: string[];
  potentialRevenue: string;
  icon: React.ReactNode;
  color: string;
}

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

const RecommendationsPage: React.FC = () => {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<BusinessModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  useEffect(() => {
    // 加载用户画像
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      generateRecommendations(profile);
    }
  }, []);

  const generateRecommendations = (profile: UserProfile) => {
    // 基于用户画像生成三种商业模式推荐
    const allModels: BusinessModel[] = [
      {
        id: 'saas',
        title: 'SaaS Business Model',
        subtitle: 'Software as a Service',
        description: 'Build and sell subscription-based software solutions to solve specific business problems.',
        pros: [
          'Recurring revenue model',
          'Scalable with low marginal costs',
          'High customer lifetime value',
          'Global market reach'
        ],
        cons: [
          'High initial development costs',
          'Long customer acquisition cycle',
          'Requires ongoing support',
          'Competitive market'
        ],
        investmentRange: '$10K - $100K',
        timeToMarket: '6-12 months',
        difficultyLevel: 4,
        matchScore: calculateSaaSMatch(profile),
        examples: ['Slack', 'Zoom', 'Notion', 'Stripe'],
        requiredSkills: ['Programming', 'Product Management', 'Marketing'],
        potentialRevenue: '$10K - $1M+ MRR',
        icon: <Zap className="w-8 h-8" />,
        color: 'text-blue-500'
      },
      {
        id: 'marketplace',
        title: 'Marketplace Model',
        subtitle: 'Platform Business',
        description: 'Create a platform that connects buyers and sellers, taking a commission on each transaction.',
        pros: [
          'Network effects drive growth',
          'Commission-based revenue',
          'Low inventory requirements',
          'Scalable business model'
        ],
        cons: [
          'Chicken-and-egg problem',
          'High customer acquisition costs',
          'Platform management complexity',
          'Trust and safety concerns'
        ],
        investmentRange: '$25K - $200K',
        timeToMarket: '8-18 months',
        difficultyLevel: 5,
        matchScore: calculateMarketplaceMatch(profile),
        examples: ['Airbnb', 'Uber', 'Etsy', 'Fiverr'],
        requiredSkills: ['Business Development', 'Operations', 'Marketing'],
        potentialRevenue: '3-15% commission per transaction',
        icon: <Users className="w-8 h-8" />,
        color: 'text-green-500'
      },
      {
        id: 'ecommerce',
        title: 'E-commerce Business',
        subtitle: 'Direct to Consumer',
        description: 'Sell physical or digital products directly to consumers through online channels.',
        pros: [
          'Direct customer relationships',
          'Higher profit margins',
          'Brand control',
          'Multiple revenue streams'
        ],
        cons: [
          'Inventory management',
          'Shipping and logistics',
          'Customer service demands',
          'Marketing costs'
        ],
        investmentRange: '$5K - $50K',
        timeToMarket: '2-6 months',
        difficultyLevel: 3,
        matchScore: calculateEcommerceMatch(profile),
        examples: ['Warby Parker', 'Casper', 'Dollar Shave Club', 'Allbirds'],
        requiredSkills: ['Marketing', 'Operations', 'Customer Service'],
        potentialRevenue: '20-50% profit margin',
        icon: <TrendingUp className="w-8 h-8" />,
        color: 'text-purple-500'
      }
    ];

    // 按匹配度排序
    const sortedModels = allModels.sort((a, b) => b.matchScore - a.matchScore);
    setRecommendations(sortedModels);
  };

  // 计算 SaaS 模式匹配度
  const calculateSaaSMatch = (profile: UserProfile): number => {
    let score = 0;
    
    // 技术技能加分
    if (profile.hasTechnicalSkills || profile.skills.includes('Programming')) score += 30;
    
    // 经验等级
    if (profile.experience === 'advanced') score += 20;
    else if (profile.experience === 'intermediate') score += 10;
    
    // 投资能力
    if (profile.investmentRange === 'medium' || profile.investmentRange === 'high') score += 15;
    
    // 时间投入
    if (profile.timeCommitment === 'full-time') score += 15;
    
    // 目标匹配
    if (profile.goals.includes('Long-term Growth')) score += 10;
    if (profile.goals.includes('Passive Income')) score += 10;
    
    return Math.min(score, 100);
  };

  // 计算市场平台模式匹配度
  const calculateMarketplaceMatch = (profile: UserProfile): number => {
    let score = 0;
    
    // 商业开发和运营技能
    if (profile.skills.includes('Operations') || profile.skills.includes('Leadership')) score += 25;
    
    // 营销经验
    if (profile.hasMarketingExperience || profile.skills.includes('Marketing')) score += 20;
    
    // 团队资源
    if (profile.hasTeam) score += 20;
    
    // 投资能力
    if (profile.investmentRange === 'high') score += 20;
    else if (profile.investmentRange === 'medium') score += 10;
    
    // 风险承受能力
    if (profile.riskTolerance === 'aggressive') score += 15;
    
    return Math.min(score, 100);
  };

  // 计算电商模式匹配度
  const calculateEcommerceMatch = (profile: UserProfile): number => {
    let score = 0;
    
    // 营销技能
    if (profile.hasMarketingExperience || profile.skills.includes('Marketing')) score += 25;
    
    // 适合初学者
    if (profile.experience === 'beginner') score += 20;
    
    // 较低投资要求
    if (profile.investmentRange === 'low' || profile.investmentRange === 'medium') score += 20;
    
    // 快速启动
    if (profile.goals.includes('Quick ROI')) score += 15;
    
    // 灵活时间
    if (profile.timeCommitment === 'part-time' || profile.timeCommitment === 'flexible') score += 10;
    
    // 运营技能
    if (profile.skills.includes('Operations')) score += 10;
    
    return Math.min(score, 100);
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  if (!userProfile) {
    return (
      <div className="pt-16 min-h-screen bg-dark-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Loading your recommendations...</div>
          <Link to="/onboarding" className="btn-primary">
            Complete Profile Setup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-dark-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Personalized Business Recommendations
          </h1>
          <p className="text-xl text-white/70 mb-6">
            Based on your profile, here are the top 3 business models that match your goals and capabilities
          </p>
          
          {/* Profile Summary */}
          <div className="glass rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-primary-500/20 text-primary-500 rounded-full text-sm">
                {userProfile.experience} level
              </span>
              <span className="px-3 py-1 bg-primary-500/20 text-primary-500 rounded-full text-sm">
                {userProfile.investmentRange} investment
              </span>
              <span className="px-3 py-1 bg-primary-500/20 text-primary-500 rounded-full text-sm">
                {userProfile.timeCommitment}
              </span>
              <span className="px-3 py-1 bg-primary-500/20 text-primary-500 rounded-full text-sm">
                {userProfile.skills.length} skills
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {recommendations.map((model, index) => (
            <div key={model.id} className="relative">
              {/* Rank Badge */}
              <div className="absolute -top-3 -left-3 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                }`}>
                  {index + 1}
                </div>
              </div>

              <div className={`card hover:border-primary-500/50 transition-all duration-300 h-full ${
                selectedModel === model.id ? 'border-primary-500 ring-2 ring-primary-500/20' : ''
              }`}>
                <div className="flex items-center mb-4">
                  <div className={model.color}>
                    {model.icon}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-bold text-white">{model.title}</h3>
                    <p className="text-white/60 text-sm">{model.subtitle}</p>
                  </div>
                </div>

                {/* Match Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm">Match Score</span>
                    <span className={`font-bold ${getMatchColor(model.matchScore)}`}>
                      {model.matchScore}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        model.matchScore >= 80 ? 'bg-green-500' :
                        model.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${model.matchScore}%` }}
                    ></div>
                  </div>
                  <p className={`text-sm mt-1 ${getMatchColor(model.matchScore)}`}>
                    {getMatchLabel(model.matchScore)}
                  </p>
                </div>

                <p className="text-white/70 mb-4 text-sm">{model.description}</p>

                {/* Key Metrics */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 text-white/50 mr-2" />
                    <span className="text-white/70">Investment: {model.investmentRange}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-white/50 mr-2" />
                    <span className="text-white/70">Time to Market: {model.timeToMarket}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-white/50 mr-2" />
                    <span className="text-white/70">Revenue: {model.potentialRevenue}</span>
                  </div>
                </div>

                {/* Difficulty Level */}
                <div className="flex items-center mb-4">
                  <span className="text-white/70 text-sm mr-2">Difficulty:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full mr-1 ${
                          i < model.difficultyLevel ? 'bg-primary-500' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                  className="w-full btn-primary py-2 flex items-center justify-center"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View */}
        {selectedModel && (
          <div className="card mb-8">
            {(() => {
              const model = recommendations.find(m => m.id === selectedModel);
              if (!model) return null;

              return (
                <div>
                  <div className="flex items-center mb-6">
                    <div className={model.color}>
                      {model.icon}
                    </div>
                    <div className="ml-3">
                      <h2 className="text-2xl font-bold text-white">{model.title}</h2>
                      <p className="text-white/60">{model.subtitle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pros & Cons */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Pros & Cons</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-green-400 font-medium mb-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Advantages
                          </h4>
                          <ul className="space-y-1">
                            {model.pros.map((pro, index) => (
                              <li key={index} className="text-white/70 text-sm flex items-start">
                                <div className="w-1 h-1 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-red-400 font-medium mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Challenges
                          </h4>
                          <ul className="space-y-1">
                            {model.cons.map((con, index) => (
                              <li key={index} className="text-white/70 text-sm flex items-start">
                                <div className="w-1 h-1 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Requirements & Examples */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Requirements & Examples</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-primary-500 font-medium mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {model.requiredSkills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-primary-500/20 text-primary-500 rounded text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-primary-500 font-medium mb-2">Success Examples</h4>
                          <div className="flex flex-wrap gap-2">
                            {model.examples.map((example, index) => (
                              <span key={index} className="px-2 py-1 bg-white/10 text-white/70 rounded text-sm">
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        to="/opportunities" 
                        className="btn-primary flex-1 text-center"
                      >
                        Find Related Opportunities
                      </Link>
                      <button className="btn-secondary flex-1">
                        Get Detailed Roadmap
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Next Steps */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/opportunities" className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <TrendingUp className="w-8 h-8 text-primary-500 mb-2" />
              <h3 className="text-white font-medium mb-1">Explore Opportunities</h3>
              <p className="text-white/60 text-sm">Browse specific business opportunities that match your chosen model</p>
            </Link>
            <div className="p-4 bg-white/5 rounded-lg">
              <Users className="w-8 h-8 text-primary-500 mb-2" />
              <h3 className="text-white font-medium mb-1">Connect with Mentors</h3>
              <p className="text-white/60 text-sm">Get guidance from experienced entrepreneurs in your chosen field</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <Info className="w-8 h-8 text-primary-500 mb-2" />
              <h3 className="text-white font-medium mb-1">Access Resources</h3>
              <p className="text-white/60 text-sm">Get templates, guides, and tools to help you get started</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
