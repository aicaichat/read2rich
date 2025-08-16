import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-dark-200 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R2R</span>
              </div>
              <span className="text-white font-bold text-xl">Read2Rich</span>
            </div>
            <p className="text-white/60 text-sm">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.product', { defaultValue: 'Product' })}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/opportunities" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('navigation.opportunities')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('navigation.dashboard')}
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('footer.analytics', { defaultValue: 'Analytics' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('footer.api', { defaultValue: 'API' })}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.company', { defaultValue: 'Company' })}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('footer.about_us', { defaultValue: 'About Us' })}
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('footer.careers', { defaultValue: 'Careers' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('footer.blog', { defaultValue: 'Blog' })}
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('footer.contact_us')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('footer.help_center')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('footer.documentation', { defaultValue: 'Documentation' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('footer.privacy_policy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  {t('footer.terms_of_service')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2024 Read2Rich. All rights reserved.
            </p>
            <p className="text-white/60 text-sm mt-2 md:mt-0">
              Made with ❤️ for entrepreneurs worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;