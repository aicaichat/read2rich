import React from 'react';
import { useTranslation } from 'react-i18next';
import { Rocket, Lightbulb, Shield, Users, Globe2 } from 'lucide-react';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    { icon: <Lightbulb className="w-6 h-6" />, title: t('about.features.aiFirst.title'), desc: t('about.features.aiFirst.desc') },
    { icon: <Users className="w-6 h-6" />, title: t('about.features.creator.title'), desc: t('about.features.creator.desc') },
    { icon: <Shield className="w-6 h-6" />, title: t('about.features.trust.title'), desc: t('about.features.trust.desc') },
    { icon: <Globe2 className="w-6 h-6" />, title: t('about.features.global.title'), desc: t('about.features.global.desc') },
  ];

  const values = [
    { title: t('about.values.speed.title'), desc: t('about.values.speed.desc') },
    { title: t('about.values.impact.title'), desc: t('about.values.impact.desc') },
    { title: t('about.values.openness.title'), desc: t('about.values.openness.desc') },
  ];

  return (
    <div className="pt-16 min-h-screen bg-dark-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-500/20 text-primary-500 mb-4">
            <Rocket className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{t('about.title')}</h1>
          <p className="text-white/70 max-w-3xl mx-auto">{t('about.subtitle')}</p>
        </div>

        {/* Mission */}
        <div className="card mb-10">
          <h2 className="text-xl font-semibold text-white mb-2">{t('about.mission.title')}</h2>
          <p className="text-white/70 leading-relaxed">
            {t('about.mission.desc')}
          </p>
        </div>

        {/* Features */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-white mb-4">{t('about.features.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, idx) => (
              <div key={idx} className="card flex items-start space-x-3">
                <div className="text-primary-500 mt-1">{f.icon}</div>
                <div>
                  <div className="text-white font-medium">{f.title}</div>
                  <div className="text-white/70 text-sm">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-white mb-4">{t('about.values.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((v, idx) => (
              <div key={idx} className="card">
                <div className="text-white font-medium mb-1">{v.title}</div>
                <div className="text-white/70 text-sm">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">{t('about.company.title')}</h3>
          <div className="space-y-3 text-white/70">
            <p>
              <span className="text-white font-medium">{t('about.company.name')}</span> {t('about.company.nameValue')}
            </p>
            <p>
              <span className="text-white font-medium">{t('about.company.founded')}</span> {t('about.company.foundedValue')}
            </p>
            <p>
              <span className="text-white font-medium">{t('about.company.location')}</span> {t('about.company.locationValue')}
            </p>
            <p className="leading-relaxed">
              {t('about.company.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

