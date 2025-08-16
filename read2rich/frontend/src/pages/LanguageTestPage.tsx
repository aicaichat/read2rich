import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, CheckCircle } from 'lucide-react';

const LanguageTestPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' }
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const testPhrases = [
    'homepage.hero.title',
    'homepage.hero.subtitle',
    'navigation.home',
    'navigation.opportunities',
    'common.loading',
    'common.success',
    'report.title',
    'payment.title'
  ];

  return (
    <div className="pt-16 min-h-screen bg-dark-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="btn-ghost flex items-center space-x-2 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-3xl font-bold text-white">Language Test Page</h1>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Language Switcher
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  i18n.language === lang.code
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className="text-2xl mb-2">{lang.flag}</div>
                <div className="text-white font-medium">{lang.name}</div>
                <div className="text-white/60 text-sm">{lang.code.toUpperCase()}</div>
                {i18n.language === lang.code && (
                  <CheckCircle className="w-5 h-5 text-primary-500 mx-auto mt-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Translation Test</h2>
          <div className="space-y-4">
            {testPhrases.map((phrase) => (
              <div key={phrase} className="border-b border-white/10 pb-4">
                <div className="text-white/60 text-sm mb-1">Key: {phrase}</div>
                <div className="text-white font-medium">{t(phrase)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageTestPage;
