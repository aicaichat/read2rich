import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Target, BarChart3, Sparkles, Users, Globe } from 'lucide-react';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: t('homepage.features.ai'),
      description: t('homepage.features.ai_desc')
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('homepage.features.insights'),
      description: t('homepage.features.insights_desc')
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: t('homepage.features.realtime'),
      description: t('homepage.features.realtime_desc')
    }
  ];

  const stats = [
    { number: '10K+', label: t('homepage.stats.opportunities') },
    { number: '5K+', label: t('homepage.stats.users') },
    { number: '95%', label: t('homepage.stats.success') },
    { number: '50+', label: t('homepage.stats.countries') }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center mb-8 shadow-2xl animate-float">
              <span className="text-white font-bold text-4xl">R2R</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t('homepage.hero.title')}
            </h1>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              {t('homepage.hero.subtitle')}
            </p>
          </div>
          
          <div className="space-y-4 mb-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/onboarding"
                className="inline-flex items-center space-x-2 btn-primary py-4 px-8 text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span>{t('homepage.hero.cta_primary')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/opportunities"
                className="inline-flex items-center space-x-2 btn-secondary py-4 px-8 text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span>{t('homepage.hero.cta_secondary')}</span>
                <TrendingUp className="w-5 h-5" />
              </Link>
            </div>
            <div className="text-slate-400">
              <p>{t('homepage.hero.description')}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('homepage.features.title')}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {t('homepage.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:border-primary-500/50 transition-all duration-300">
                <div className="text-primary-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600/20 to-blue-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('homepage.cta2.title')}
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            {t('homepage.cta2.subtitle')}
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 btn-primary font-bold py-3 px-8 transition-colors"
            >
              <span>{t('homepage.cta2.getStarted')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/opportunities"
              className="inline-flex items-center space-x-2 btn-secondary font-bold py-3 px-8 transition-colors"
            >
              <span>{t('homepage.cta2.explore')}</span>
              <TrendingUp className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;