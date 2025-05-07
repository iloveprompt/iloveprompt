
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text text-transparent prompt-gradient">iloveprompt</span>
            </Link>
            <p className="mt-4 text-gray-600 max-w-xs">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">{t('footer.product')}</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-600 hover:text-brand-600">{t('common.features')}</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-brand-600">{t('common.pricing')}</Link></li>
              <li><Link to="/prompt-generator" className="text-gray-600 hover:text-brand-600">Prompt Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-brand-600">{t('footer.aboutUs')}</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-600">{t('footer.contact')}</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">{t('footer.blog')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-600 hover:text-brand-600">{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-brand-600">{t('footer.termsOfService')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {currentYear} iloveprompt. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
