
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import UserProfileMenu from './UserProfileMenu';
import LanguageSwitcher from '../LanguageSwitcher';

const AdminDashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center">
              <img 
                src="/lovable-uploads/38e9462c-ec41-45c6-b98e-95e9a854929c.png" 
                alt="iloveprompt logo" 
                className="h-10" 
              />
              <span className="font-semibold text-xl hidden sm:inline ml-2">Admin</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/admin" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              {t('admin.overview')}
            </Link>
            <Link to="/admin/users" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              {t('admin.users')}
            </Link>
            <Link to="/admin/prompts" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              {t('admin.prompts')}
            </Link>
            <Link to="/admin/settings" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              {t('admin.settings')}
            </Link>
            <Link to="/admin/logs" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
              {t('admin.logs')}
            </Link>
            <LanguageSwitcher />
          </nav>
          
          <div className="flex items-center">
            <UserProfileMenu showPlan={false} />
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden ml-2 text-white" 
              onClick={toggleMenu}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-800 px-4 py-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            <Link 
              to="/admin" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('admin.overview')}
            </Link>
            <Link 
              to="/admin/users" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('admin.users')}
            </Link>
            <Link 
              to="/admin/prompts" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('admin.prompts')}
            </Link>
            <Link 
              to="/admin/settings" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('admin.settings')}
            </Link>
            <Link 
              to="/admin/logs" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('admin.logs')}
            </Link>
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default AdminDashboardNavbar;
