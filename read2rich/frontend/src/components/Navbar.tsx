import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const toggleLanguage = () => {
    const langs = ['EN', 'KO', 'JA', 'MS'];
    const currentIndex = langs.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % langs.length;
    const nextLang = langs[nextIndex];
    setCurrentLang(nextLang);
    
    // Map display language to i18n language codes
    const langMap: Record<string, string> = {
      'EN': 'en',
      'KO': 'ko', 
      'JA': 'ja',
      'MS': 'ms'
    };
    i18n.changeLanguage(langMap[nextLang]);
  };

  return (
    <nav className="glass border-b border-white/10 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R2R</span>
            </div>
            <span className="text-white font-bold text-xl">Read2Rich</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
                                  <Link to="/" className="text-white/70 hover:text-white transition-colors">
                        {t('navigation.home')}
                      </Link>
                      <Link to="/opportunities" className="text-white/70 hover:text-white transition-colors">
                        {t('navigation.opportunities')}
                      </Link>
                      <Link to="/onboarding" className="text-white/70 hover:text-white transition-colors">
                        {t('navigation.get_recommendations')}
                      </Link>
                      <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                        {t('navigation.about')}
                      </Link>
                      <Link to="/contact" className="text-white/70 hover:text-white transition-colors">
                        {t('navigation.contact')}
                      </Link>
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-white/70 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">{currentLang}</span>
            </button>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
                                      <Link
                          to="/login"
                          className="text-white/70 hover:text-white transition-colors"
                        >
                          {t('navigation.sign_in')}
                        </Link>
                        <Link
                          to="/register"
                          className="btn-primary"
                        >
                          {t('navigation.get_started')}
                        </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800 rounded-lg mt-2">
              <Link
                to="/"
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('navigation.home')}
              </Link>
              <Link
                to="/opportunities"
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('navigation.opportunities')}
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t border-slate-700 pt-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg mx-3 mt-2 text-center transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;