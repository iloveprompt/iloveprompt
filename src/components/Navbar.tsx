
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import { colors } from '@/styles/colors';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Check if we're in dashboard routes
  const isInDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/admin');
  
  // On landing page (homepage), we always show login/register buttons
  // For other non-dashboard pages, we check authentication status
  const isHomePage = location.pathname === '/';
  
  // Important: We want to show auth buttons on the homepage regardless of auth status
  // This ensures users always see the landing page buttons
  const showAuthButtons = isHomePage || (!isInDashboard);
  
  // We only show dashboard button for authenticated users who are not already in the dashboard
  const showDashboardButton = isAuthenticated && !isInDashboard && !isHomePage;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/38e9462c-ec41-45c6-b98e-95e9a854929c.png" alt="iloveprompt logo" className="h-10" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-brand-600 transition-colors">{t('common.home')}</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-brand-600 transition-colors">{t('common.pricing')}</Link>
            <Link to="/features" className="text-gray-700 hover:text-brand-600 transition-colors">{t('common.features')}</Link>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {showDashboardButton && (
                <Link to="/dashboard">
                  <Button 
                    style={{
                      backgroundColor: colors.blue[600]
                    }} 
                    className="text-white hover:bg-opacity-90 flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              
              {showAuthButtons && (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50" style={{
                      borderColor: colors.blue[500],
                      color: colors.blue[700]
                    }}>
                      {t('common.login')}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button style={{
                      backgroundColor: colors.blue[600]
                    }} className="text-white hover:bg-blue-700">
                      {t('common.startFree')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">{t('common.home')}</Link>
            <Link to="/pricing" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">{t('common.pricing')}</Link>
            <Link to="/features" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">{t('common.features')}</Link>
            <div className="flex flex-col space-y-2 px-3 pt-4">
              {showDashboardButton && (
                <Link to="/dashboard">
                  <Button className="w-full text-white" style={{
                    backgroundColor: colors.blue[600]
                  }}>
                    Dashboard
                  </Button>
                </Link>
              )}
              
              {showAuthButtons && (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="w-full border-blue-500 text-blue-700" style={{
                      borderColor: colors.blue[500],
                      color: colors.blue[700]
                    }}>
                      {t('common.login')}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full text-white" style={{
                      backgroundColor: colors.blue[600]
                    }}>
                      {t('common.startFree')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
