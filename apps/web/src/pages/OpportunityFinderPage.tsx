import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Zap, 
  Users, 
  DollarSign, 
  Clock, 
  Star,
  ChevronRight,
  ExternalLink,
  Download,
  CreditCard,
  Filter,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Quote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { reportGenerator } from '@/lib/premiumReportGenerator';
import { reportsAPI } from '@/lib/api';
import { getReportUrlFromOSS, openUrlAsInlineHtml } from '@/lib/oss-links';
import { openWindow, openWindowAsync, isMobileDevice } from '@/utils/mobile-window';
import Button from '@/components/ui/Button';
import PaymentModal from '@/components/PaymentModal';
import NotificationToast from '@/components/NotificationToast';
import ReportPreview from '@/components/ReportPreview';
import { opportunityFinderAPI, type UserProfile, type Opportunity } from '@/lib/opportunity-finder-api';
import { useT } from '@/i18n';
import { APP_CONFIG } from '@/config';

// Import types from API client
// interface Opportunity and UserProfile are now imported

export default function OpportunityFinderPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const t = useT();
  const [step, setStep] = useState<'profile' | 'opportunities' | 'detail'>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    skills: [],
    budget: 5000,
    timeCommitment: 'part-time',
    experience: 'intermediate'
  });
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  
  // 支付相关状态
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [purchasedReports, setPurchasedReports] = useState<Set<string>>(new Set());
  const [reportData, setReportData] = useState<any>(null);
  
  // 通知状态
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Data is now handled by the API client

  const skillOptions = [
    'Python', 'JavaScript', 'React', 'Node.js', 'AI/ML', 'Data Science',
    'UI/UX Design', 'Product Management', 'Marketing', 'Sales', 'Business Development'
  ];

  const handleProfileSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Call the AI Opportunity Finder API
      const generatedOpportunities = await opportunityFinderAPI.generateOpportunities(userProfile);
      setOpportunities(generatedOpportunities);
      setStep('opportunities');
    } catch (error) {
      console.error('Failed to generate opportunities:', error);
      // The API client already handles fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => 
    filterDifficulty === 'all' || opp.difficulty.toLowerCase() === filterDifficulty
  );

  // 处理支付成功
  const handlePaymentSuccess = (reportData: any) => {
    if (selectedOpportunity) {
      setPurchasedReports(prev => new Set([...prev, selectedOpportunity.id]));
      setReportData(reportData);
      
      // 显示成功通知
      setNotification({
        isOpen: true,
        type: 'success',
        title: '🎉 购买成功！',
        message: '已为你准备交付内容：HTML报告、工具包、Demo等'
      });
      
      // 统一：跳转交付页（HTML报告为主），携带评分/难度
      const orderId = reportData?.reportId || `order_${selectedOpportunity.id}_${Date.now()}`;
      navigate(`/delivery?opportunityId=${encodeURIComponent(selectedOpportunity.id)}&opportunityTitle=${encodeURIComponent(selectedOpportunity.title)}&order_id=${encodeURIComponent(orderId)}&score=${encodeURIComponent(selectedOpportunity.totalScore.toFixed(1))}&difficulty=${encodeURIComponent(selectedOpportunity.difficulty)}`);
    }
  };

  // 检查是否已购买报告
  const isPurchased = (opportunityId: string) => {
    return purchasedReports.has(opportunityId);
  };

  const ScoreRadar = ({ opportunity }: { opportunity: Opportunity }) => (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-300 mb-3">评分雷达</h4>
      <div className="space-y-2">
        {[
          { label: '痛点强度', value: opportunity.painScore, color: 'text-red-400' },
          { label: '市场规模', value: opportunity.tamScore, color: 'text-blue-400' },
          { label: '竞争空白', value: opportunity.gapScore, color: 'text-green-400' },
          { label: 'AI适配度', value: opportunity.aiFitScore, color: 'text-purple-400' },
          { label: '个人可行性', value: opportunity.soloFitScore, color: 'text-yellow-400' },
          { label: '风险程度', value: 10 - opportunity.riskScore, color: 'text-orange-400' }
        ].map((score, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className={`text-xs ${score.color}`}>{score.label}</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r from-gray-600 to-${score.color.split('-')[1]}-400`}
                  style={{ width: `${(score.value / 10) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-6">{score.value.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-dark-400 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              用AI洞察，让好生意不再碰运气 <span className="ml-2">🔍</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              60秒生成你的Top机会清单，用
              <span className="text-primary-400 font-semibold"> 29.9元 </span>
              拿到“能看、能讲、能落地”的方案与BP。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-300 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">{t('opf.backgroundTitle','告诉我们关于您的背景')}</h2>
            
            <div className="space-y-6">
              {/* 技能选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">{t('opf.skills.label','您的技能 (选择所有适用的)')}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        setUserProfile(prev => ({
                          ...prev,
                          skills: prev.skills.includes(skill)
                            ? prev.skills.filter(s => s !== skill)
                            : [...prev.skills, skill]
                        }));
                      }}
                      className={`p-3 rounded-lg border transition-colors ${
                        userProfile.skills.includes(skill)
                          ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* 预算 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">{t('opf.budget.label','启动预算 (USD)')}</label>
                <select
                  value={userProfile.budget}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, budget: Number(e.target.value) }))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  <option value={1000}>$1,000 - 初学者</option>
                  <option value={5000}>$5,000 - 中等投入</option>
                  <option value={10000}>$10,000 - 认真创业</option>
                  <option value={25000}>$25,000+ - 全力投入</option>
                </select>
              </div>

              {/* 时间投入 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">{t('opf.time.label','时间投入')}</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'part-time', label: '兼职 (10-20h/周)' },
                    { value: 'full-time', label: '全职 (40+h/周)' },
                    { value: 'weekend', label: '周末 (5-10h/周)' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setUserProfile(prev => ({ ...prev, timeCommitment: option.value }))}
                      className={`p-3 rounded-lg border transition-colors ${
                        userProfile.timeCommitment === option.value
                          ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 经验水平 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">{t('opf.experience.label','创业经验')}</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'beginner', label: '新手' },
                    { value: 'intermediate', label: '有一些经验' },
                    { value: 'expert', label: '经验丰富' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setUserProfile(prev => ({ ...prev, experience: option.value }))}
                      className={`p-3 rounded-lg border transition-colors ${
                        userProfile.experience === option.value
                          ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleProfileSubmit}
                disabled={userProfile.skills.length === 0}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t('opf.discover','发现我的AI机会')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (step === 'opportunities') {
    return (
      <div className="min-h-screen bg-dark-400 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-300">AI正在分析全球数据，为您筛选最佳机会...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{t('opf.recommendedTitle','为您推荐的AI创业机会')}</h1>
                  <p className="text-gray-300">
                    {t('opf.recommendedSubtitle','基于您的技能和偏好，从全球20k+痛点数据中筛选出的Top5机会')}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="all">{t('opf.filter.all','所有难度')}</option>
                    <option value="easy">{t('opf.filter.easy','简单')}</option>
                    <option value="medium">{t('opf.filter.medium','中等')}</option>
                    <option value="hard">{t('opf.filter.hard','困难')}</option>
                  </select>
                  {/* 免费体验标识 */}
                  <div className="hidden md:flex items-center text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
                    AI服装搭配师 本周免费体验高级功能
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredOpportunities.map((opportunity, index) => (
                  <motion.div
                    key={opportunity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-dark-300 rounded-2xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedOpportunity(opportunity);
                      setStep('detail');
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl font-bold text-primary-400">
                            #{index + 1}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            opportunity.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                            opportunity.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {opportunity.difficulty}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {opportunity.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {opportunity.description}
                        </p>
                      </div>
                      
                      <div className="ml-4 text-center">
                        <div className="text-2xl font-bold text-primary-400">
                          {opportunity.totalScore.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-400">{t('opf.totalScore','总分')}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {opportunity.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-400">
                          {opportunity.estimatedRevenue}
                        </div>
                        <div className="text-xs text-gray-400">{t('opf.expectedRevenue','预期收入')}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-400">
                          {opportunity.timeToMarket}
                        </div>
                        <div className="text-xs text-gray-400">{t('opf.timeToMarket','上市时间')}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-400">
                          {opportunity.aiFitScore.toFixed(1)}/10
                        </div>
                        <div className="text-xs text-gray-400">{t('opf.aiFit','AI适配度')}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">{t('opf.dataSources','数据来源')}: {opportunity.sources.join(', ')}</div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (step === 'detail' && selectedOpportunity) {
    return (
      <div className="min-h-screen bg-dark-400 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <button
            onClick={() => setStep('opportunities')}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
            {t('opf.returnToList','返回机会列表')}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 主要内容 */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-300 rounded-2xl p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {selectedOpportunity.title}
                    </h1>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-primary-400">
                        总分: {selectedOpportunity.totalScore.toFixed(1)}/10
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedOpportunity.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        selectedOpportunity.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedOpportunity.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {selectedOpportunity.description}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                      <h3 className="font-medium text-white">预期收入</h3>
                    </div>
                    <p className="text-green-400 font-bold text-xl">
                      {selectedOpportunity.estimatedRevenue}
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-blue-400 mr-2" />
                      <h3 className="font-medium text-white">上市时间</h3>
                    </div>
                    <p className="text-blue-400 font-bold text-xl">
                      {selectedOpportunity.timeToMarket}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedOpportunity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-500/20 text-primary-400 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* 报告预览 */}
              <ReportPreview
                opportunityId={selectedOpportunity.id}
                opportunityTitle={selectedOpportunity.title}
              />
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              <ScoreRadar opportunity={selectedOpportunity} />
              
              {/* 升级选项 - 三层商业模型 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl p-6 border border-primary-500/30"
              >
                <div className="grid grid-cols-1 gap-4">
                  {/* 第一级：报告+BP 29.9 */}
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-semibold">第一级 · 报告 + BP</div>
                    <div className="text-2xl font-bold text-emerald-400">¥{APP_CONFIG.COMMERCE.PRICES.PREMIUM_REPORT}</div>
                    </div>
                    <div className="text-gray-300 text-sm mb-3">1小时读懂这门生意：深度HTML报告 + 路演版BP（WebPPT）</div>
                    {isPurchased(selectedOpportunity.id) ? (
                      <div className="text-emerald-400 text-sm">已解锁</div>
                    ) : (
                      <Button 
                        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500"
                        onClick={() => setIsPaymentModalOpen(true)}
                      >
                        <CreditCard className="w-4 h-4 mr-2" /> 29.9元解锁 报告+BP（立即获取）
                      </Button>
                    )}
                  </div>

                  {/* 第二级：课程与培训 */}
                  <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-semibold">第二级 · 课程与培训</div>
                    <div className="text-xl font-bold text-blue-400">¥{APP_CONFIG.COMMERCE.COURSE.BASIC}</div>
                    </div>
                    <div className="text-gray-300 text-sm mb-3">把报告变成可落地的执行表：体系课 + 训练营 + 作业评审</div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => openWindow('/course/1', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" /> 报名训练营（¥{APP_CONFIG.COMMERCE.COURSE.BASIC}）
                    </Button>
                  </div>

                  {/* 第三级：源码与定制化 */}
                  <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-semibold">第三级 · 源码与定制化</div>
                      <div className="text-xl font-bold text-purple-400">¥2999 起</div>
                    </div>
                    <div className="text-gray-300 text-sm mb-3">完整源码授权 + 私有化部署 + 集成改造，里程碑交付</div>
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => openWindow('mailto:vip@deepneed.com.cn','_blank')}
                    >
                      获取定制方案（1–2周出MVP）
                    </Button>
                  </div>
                </div>

                {isPurchased(selectedOpportunity.id) ? (
                  <div className="space-y-3">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                      <div className="text-green-400 font-medium mb-2">{t('opf.purchased','✅ 已购买')}</div>
                      <p className="text-sm text-green-300">已解锁完整交付：HTML报告、工具包与Demo</p>
                    </div>
                    <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={async () => {
                          // 查看HTML完整报告（新标签）
                          if (!selectedOpportunity) return;
                          
                          const success = await openWindowAsync(async () => {
                            // 优先 OSS 直链
                            try {
                              const url = await getReportUrlFromOSS(selectedOpportunity.title);
                              if (url) {
                                // 移动端优先 inline 打开，避免直接下载
                                if (isMobileDevice()) {
                                  const ok = await openUrlAsInlineHtml(url);
                                  if (ok) return null; // 已通过 inline 方式打开，不需要新窗口
                                }
                                return url;
                              }
                            } catch {}
                            
                            // 后端生成，失败回退前端渲染
                            let html = '';
                            try {
                              html = await reportsAPI.generateHTML(selectedOpportunity.id, selectedOpportunity.title);
                            } catch (e) {
                              html = reportGenerator.generateHTMLReportDeep(selectedOpportunity.id);
                            }
                            
                            if (!html) return null;
                            
                            // 创建 Blob URL
                            const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            
                            // 延后释放URL
                            setTimeout(() => URL.revokeObjectURL(url), 10000);
                            
                            return url;
                          });
                          
                          if (!success) {
                            console.warn('Failed to open HTML report');
                          }
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" /> 查看HTML完整报告
                      </Button>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        const url = `/delivery?opportunityId=${selectedOpportunity.id}&opportunityTitle=${encodeURIComponent(selectedOpportunity.title)}&order_id=order_${selectedOpportunity.id}_${Date.now()}&score=${selectedOpportunity.totalScore.toFixed(1)}&difficulty=${selectedOpportunity.difficulty}`;
                        
                        // 使用移动端友好的窗口打开
                        openWindow(url);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" /> 打开交付页
                    </Button>
                  </div>
                ) : null}
                
                {/* 去掉退款与支付提示 */}
              </motion.div>

              {/* 数据来源 */}
              <div className="bg-dark-300 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">数据来源</h4>
                <div className="space-y-2">
                  {selectedOpportunity.sources.map((source, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-400">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-2" />
                      {source}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  最后更新: 2小时前 • 置信度: 87%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 支付模态框 */}
        {selectedOpportunity && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            opportunityId={selectedOpportunity.id}
            opportunityTitle={selectedOpportunity.title}
            price={APP_CONFIG.COMMERCE.PRICES.PREMIUM_REPORT}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
        
        {/* 通知Toast */}
        <NotificationToast
          isOpen={notification.isOpen}
          onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
          type={notification.type}
          title={notification.title}
          message={notification.message}
        />
        
        {/* 权益对比表 */}
        <div className="max-w-6xl mx-auto px-6 mt-10">
          <div className="bg-dark-300 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 text-emerald-400 mr-2" /> 三层权益对比
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="text-left py-2">权益</th>
                    <th className="text-center py-2">第一级（¥29.9）</th>
                    <th className="text-center py-2">第二级（¥299）</th>
                    <th className="text-center py-2">第三级（¥2999起）</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {[
                    ['HTML深度报告','✔️','✔️','✔️'],
                    ['路演版BP（WebPPT）','✔️','✔️','✔️'],
                    ['10分钟上手课','✔️','✔️','✔️'],
                    ['体系课/训练营','—','✔️','✔️'],
                    ['作业评审/复盘','—','✔️','✔️'],
                    ['源码授权','—','—','✔️'],
                    ['私有化部署/集成','—','—','✔️'],
                    ['里程碑交付与验收','—','—','✔️']
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 ? 'bg-gray-800/30' : ''}>
                      <td className="py-2 pr-3">{row[0]}</td>
                      <td className="text-center">{row[1]}</td>
                      <td className="text-center">{row[2]}</td>
                      <td className="text-center">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{
            q:'为什么先买报告+BP？',a:'降低决策成本。先判断值不值得做、怎么做、先做哪一步，再投入时间与预算。'
          },{
            q:'没有技术也能落地吗？',a:'可以。训练营提供路线与模板，第三级可交付可运行版本与私有化部署。'
          },{
            q:'多久能看到结果？',a:'一般2周出第一版Demo，4–8周出V1，具体依范围与协作效率。'
          }].map((item,idx)=> (
            <div key={idx} className="bg-dark-300 rounded-2xl p-6 border border-gray-700">
              <h4 className="text-white font-semibold mb-2 flex items-center"><HelpCircle className="w-5 h-5 text-blue-400 mr-2" /> {item.q}</h4>
              <p className="text-gray-300 text-sm">{item.a}</p>
            </div>
          ))}
        </div>

        {/* 用户见证 */}
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <div className="bg-dark-300 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Quote className="w-6 h-6 text-yellow-400 mr-2" /> 用户见证
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
              {[ 
                '用了29.9的报告+BP，团队当天就开了评审会，决定做MVP。',
                '训练营2周就跑出了可以演示的版本，比我们自己摸索快太多。',
                '定制版帮我们接入企业微信与内部数据，合规问题也一起解决了。'
              ].map((t,i)=> (
                <div key={i} className="bg-gray-800/40 rounded-xl p-4 border border-gray-700">“{t}”</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}