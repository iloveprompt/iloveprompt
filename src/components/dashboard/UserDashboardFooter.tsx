
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

const UserDashboardFooter = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <img 
              src="/lovable-uploads/38e9462c-ec41-45c6-b98e-95e9a854929c.png" 
              alt="iloveprompt logo" 
              className="h-8 mr-3" 
            />
            <p className="text-sm text-gray-600">
              &copy; {currentYear} iloveprompt. {t('footer.copyright')}
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              {t('footer.termsOfService')}
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
            <Link to="/help" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              {t('footer.help')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserDashboardFooter;
