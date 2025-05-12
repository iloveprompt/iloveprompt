
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import UserProfileMenu from './UserProfileMenu';
import LanguageSwitcher from '../LanguageSwitcher';

const UserDashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img src="/lovable-uploads/38e9462c-ec41-45c6-b98e-95e9a854929c.png" alt="iloveprompt logo" className="h-10" />
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('dashboard.home')}
            </Link>
            <Link to="/dashboard/prompt-generator" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('dashboard.createPrompt')}
            </Link>
            <Link to="/dashboard/history" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('dashboard.promptHistory')}
            </Link>
            <Link to="/dashboard/profile" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('dashboard.profile')}
            </Link>
            <Link to="/dashboard/settings" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              {t('dashboard.settings')}
            </Link>
            <div className="z-40">
              <LanguageSwitcher />
            </div>
          </nav>
          
          <div className="flex items-center">
            <UserProfileMenu showPlan={true} plan="Free" />
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={toggleMenu}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white px-4 py-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              {t('dashboard.home')}
            </Link>
            <Link to="/dashboard/prompt-generator" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              {t('dashboard.createPrompt')}
            </Link>
            <Link to="/dashboard/history" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              {t('dashboard.promptHistory')}
            </Link>
            <Link to="/dashboard/profile" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              {t('dashboard.profile')}
            </Link>
            <Link to="/dashboard/settings" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              {t('dashboard.settings')}
            </Link>
            <div className="px-3 py-2 z-40">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default UserDashboardNavbar;
