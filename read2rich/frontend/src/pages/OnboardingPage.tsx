import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Target, 
  DollarSign, 
  Clock, 
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  // 基本信息
  experience: string; // 'beginner' | 'intermediate' | 'advanced'
  industry: string[];
  
  // 投资偏好
  investmentRange: string; // 'low' | 'medium' | 'high'
  riskTolerance: string; // 'conservative' | 'moderate' | 'aggressive'
  timeCommitment: string; // 'part-time' | 'full-time' | 'flexible'
  
  // 目标和兴趣
  goals: string[];
  preferredMarkets: string[];
  skills: string[];
  
  // 资源情况
  hasTeam: boolean;
  hasTechnicalSkills: boolean;
  hasMarketingExperience: boolean;
}

const OnboardingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    experience: '',
    industry: [],
    investmentRange: '',
    riskTolerance: '',
    timeCommitment: '',
    goals: [],
    preferredMarkets: [],
    skills: [],
    hasTeam: false,
    hasTechnicalSkills: false,
    hasMarketingExperience: false
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // 保存用户画像并跳转到报告生成页面
      localStorage.setItem('userProfile', JSON.stringify(profile));
      navigate('/business-report');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleArrayItem = (key: keyof UserProfile, item: string) => {
    const currentArray = profile[key] as string[];
    if (currentArray.includes(item)) {
      updateProfile(key, currentArray.filter(i => i !== item));
    } else {
      updateProfile(key, [...currentArray, item]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {t('onboarding.experience.title')}
              </h2>
              <p className="text-white/70">
                {t('onboarding.experience.subtitle')}
              </p>
            </div>

            <div className="space-y-4">
              {[
                { value: 'beginner', label: t('onboarding.experience.beginner'), desc: t('onboarding.experience.beginner_desc') },
                { value: 'intermediate', label: t('onboarding.experience.intermediate'), desc: t('onboarding.experience.intermediate_desc') },
                { value: 'advanced', label: t('onboarding.experience.advanced'), desc: t('onboarding.experience.advanced_desc') }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateProfile('experience', option.value)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    profile.experience === option.value
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-white/20 hover:border-primary-500/50'
                  }`}
                >
                  <div className="text-white font-medium">{option.label}</div>
                  <div className="text-white/60 text-sm">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {t('onboarding.investment.title')}
              </h2>
              <p className="text-white/70">
                {t('onboarding.investment.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-3">{t('onboarding.investment.range_label')}</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: 'low', label: t('onboarding.investment.low'), desc: t('onboarding.investment.low_desc') },
                    { value: 'medium', label: t('onboarding.investment.medium'), desc: t('onboarding.investment.medium_desc') },
                    { value: 'high', label: t('onboarding.investment.high'), desc: t('onboarding.investment.high_desc') }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateProfile('investmentRange', option.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        profile.investmentRange === option.value
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-white/20 hover:border-primary-500/50'
                      }`}
                    >
                      <div className="text-white font-medium">{option.label}</div>
                      <div className="text-white/60 text-sm">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-3">{t('onboarding.investment.risk_label')}</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'conservative', label: t('onboarding.investment.conservative') },
                    { value: 'moderate', label: t('onboarding.investment.moderate') },
                    { value: 'aggressive', label: t('onboarding.investment.aggressive') }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateProfile('riskTolerance', option.value)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        profile.riskTolerance === option.value
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-white/20 hover:border-primary-500/50'
                      }`}
                    >
                      <div className="text-white font-medium text-sm">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Clock className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {t('onboarding.time.title')}
              </h2>
              <p className="text-white/70">
                {t('onboarding.time.subtitle')}
              </p>
            </div>

            <div className="space-y-4">
              {[
                { value: 'part-time', label: t('onboarding.time.part_time'), desc: t('onboarding.time.part_time_desc') },
                { value: 'full-time', label: t('onboarding.time.full_time'), desc: t('onboarding.time.full_time_desc') },
                { value: 'flexible', label: t('onboarding.time.flexible'), desc: t('onboarding.time.flexible_desc') }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateProfile('timeCommitment', option.value)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    profile.timeCommitment === option.value
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-white/20 hover:border-primary-500/50'
                  }`}
                >
                  <div className="text-white font-medium">{option.label}</div>
                  <div className="text-white/60 text-sm">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {t('onboarding.goals.title')}
              </h2>
              <p className="text-white/70">
                {t('onboarding.goals.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-3">{t('onboarding.goals.goals_label')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    t('onboarding.goals.financial_freedom'),
                    t('onboarding.goals.passive_income'),
                    t('onboarding.goals.quick_roi'),
                    t('onboarding.goals.long_term_growth'),
                    t('onboarding.goals.social_impact'),
                    t('onboarding.goals.innovation')
                  ].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => toggleArrayItem('goals', goal)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        profile.goals.includes(goal)
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-white/20 hover:border-primary-500/50'
                      }`}
                    >
                      <div className="text-white text-sm">{goal}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-3">{t('onboarding.goals.markets_label')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    t('onboarding.goals.technology'),
                    t('onboarding.goals.healthcare'),
                    t('onboarding.goals.finance'),
                    t('onboarding.goals.education'),
                    t('onboarding.goals.real_estate'),
                    t('onboarding.goals.food_beverage'),
                    t('onboarding.goals.entertainment')
                  ].map((market) => (
                    <button
                      key={market}
                      onClick={() => toggleArrayItem('preferredMarkets', market)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        profile.preferredMarkets.includes(market)
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-white/20 hover:border-primary-500/50'
                      }`}
                    >
                      <div className="text-white text-sm">{market}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <TrendingUp className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {t('onboarding.skills.title')}
              </h2>
              <p className="text-white/70">
                {t('onboarding.skills.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-3">{t('onboarding.skills.skills_label')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    t('onboarding.skills.programming'),
                    t('onboarding.skills.marketing'),
                    t('onboarding.skills.sales'),
                    t('onboarding.skills.design'),
                    t('onboarding.skills.operations'),
                    t('onboarding.skills.leadership'),
                    t('onboarding.skills.analytics')
                  ].map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleArrayItem('skills', skill)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        profile.skills.includes(skill)
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-white/20 hover:border-primary-500/50'
                      }`}
                    >
                      <div className="text-white text-sm">{skill}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-3">{t('onboarding.skills.resources_label')}</label>
                <div className="space-y-3">
                  {[
                    { key: 'hasTeam', label: t('onboarding.skills.has_team') },
                    { key: 'hasTechnicalSkills', label: t('onboarding.skills.has_technical') },
                    { key: 'hasMarketingExperience', label: t('onboarding.skills.has_marketing') }
                  ].map((resource) => (
                    <button
                      key={resource.key}
                      onClick={() => updateProfile(resource.key as keyof UserProfile, !profile[resource.key as keyof UserProfile])}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        profile[resource.key as keyof UserProfile]
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-white/20 hover:border-primary-500/50'
                      }`}
                    >
                      <div className="flex items-center">
                        {profile[resource.key as keyof UserProfile] && (
                          <CheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                        )}
                        <div className="text-white">{resource.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return profile.experience !== '';
      case 2:
        return profile.investmentRange !== '' && profile.riskTolerance !== '';
      case 3:
        return profile.timeCommitment !== '';
      case 4:
        return profile.goals.length > 0 && profile.preferredMarkets.length > 0;
      case 5:
        return profile.skills.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-dark-300">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">{t('onboarding.step', { current: currentStep, total: totalSteps })}</span>
            <span className="text-white/70 text-sm">{t('onboarding.progress', { percent: Math.round((currentStep / totalSteps) * 100) })}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="card mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="btn-ghost flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{currentStep === totalSteps ? t('onboarding.get_recommendations') : t('common.next')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
