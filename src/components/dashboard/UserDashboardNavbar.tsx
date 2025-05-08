
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import UserProfileMenu from './UserProfileMenu';
import { useAuth } from '@/hooks/useAuth';

const UserDashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img src="/lovable-uploads/4c0e25c9-7a84-42ff-92f3-643522f86121.png" alt="iloveprompt logo" className="h-8 mr-2" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-brand-600 transition-colors font-medium">
              {t('common.dashboard')}
            </Link>
            <Link to="/prompt-generator" className="text-gray-700 hover:text-brand-600 transition-colors">
              Prompt Generator
            </Link>
            <Link to="/history" className="text-gray-700 hover:text-brand-600 transition-colors">
              {t('common.history')}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <UserProfileMenu showPlan={true} plan="Pro" />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('common.dashboard')}
            </Link>
            <Link 
              to="/prompt-generator" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Prompt Generator
            </Link>
            <Link 
              to="/history" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('common.history')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default UserDashboardNavbar;
