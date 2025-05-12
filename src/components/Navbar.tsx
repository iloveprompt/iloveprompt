import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, User, LayoutDashboard, X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import LanguageSwitcher from './LanguageSwitcher';
import { colors } from '@/styles/colors';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    t
  } = useLanguage();
  const {
    user,
    signOut,
    isAuthenticated,
    isAdmin
  } = useAuth();
  const {
    redirectAfterLogin
  } = useAuthRedirect();
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar rolagem para aplicar efeitos no menu
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const handleDashboardClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  // Check if we're in dashboard routes
  const isInDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/admin');

  // On landing page (homepage), we always show login/register buttons
  // For other non-dashboard pages, we check authentication status
  const isHomePage = location.pathname === '/';

  // Important: We want to show auth buttons on the homepage regardless of auth status
  // This ensures users always see the landing page buttons
  const showAuthButtons = isHomePage || !isInDashboard && !isAuthenticated;

  // We only show dashboard button for authenticated users who are not already in the dashboard
  const showDashboardButton = isAuthenticated && !isInDashboard;
  return <header className={`sticky-menu ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/38e9462c-ec41-45c6-b98e-95e9a854929c.png" alt="iloveprompt logo" className="h-14" />
            </Link>
          </div>
          
          {/* Desktop Navigation - Melhorado o contraste dos links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-pureWhite hover:text-aquaGreen font-medium transition-colors">{t('common.home')}</Link>
            <a href="/#pricing-section" className="text-pureWhite hover:text-aquaGreen font-medium transition-colors">{t('common.pricing')}</a>
            <a href="/#features-section" className="text-pureWhite hover:text-aquaGreen font-medium transition-colors">{t('common.features')}</a>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {showDashboardButton && <Button style={{
              backgroundColor: colors.blue[600]
            }} className="text-white hover:bg-opacity-90 flex items-center gap-2" onClick={handleDashboardClick}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>}
              
              {isAuthenticated && <Button variant="outline" className="border-red-500 text-red-700 hover:bg-red-50" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" /> {t('common.logout')}
                </Button>}
              
              {showAuthButtons && <>
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
                </>}
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-pureWhite focus:outline-none">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation - melhorado com animação e melhor UX e contraste */}
      <div className={`md:hidden bg-darkBg shadow-lg mobile-menu-container ${isMenuOpen ? 'open' : ''}`} aria-expanded={isMenuOpen}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-pureWhite hover:bg-electricBlue/30 rounded-md transition-colors font-medium">
            {t('common.home')}
          </Link>
          <a href="/#pricing-section" className="block px-3 py-2 text-pureWhite hover:bg-electricBlue/30 rounded-md transition-colors font-medium" onClick={e => {
          setIsMenuOpen(false);
          if (location.pathname === '/') {
            e.preventDefault();
            document.getElementById('pricing-section')?.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }}>
            {t('common.pricing')}
          </a>
          <a href="/#features-section" className="block px-3 py-2 text-pureWhite hover:bg-electricBlue/30 rounded-md transition-colors font-medium" onClick={e => {
          setIsMenuOpen(false);
          if (location.pathname === '/') {
            e.preventDefault();
            document.getElementById('features-section')?.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }}>
            {t('common.features')}
          </a>
          <div className="flex flex-col space-y-2 px-3 pt-4">
            {showDashboardButton && <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full text-white" style={{
              backgroundColor: colors.blue[600]
            }}>
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                </Button>
              </Link>}
            
            {showAuthButtons && <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-blue-500 text-blue-700" style={{
                borderColor: colors.blue[500],
                color: colors.blue[700]
              }}>
                    {t('common.login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full text-white" style={{
                backgroundColor: colors.blue[600]
              }}>
                    {t('common.startFree')}
                  </Button>
                </Link>
              </>}
            
            {isAuthenticated && <Button variant="outline" className="w-full border-red-500 text-red-700" onClick={() => {
            handleSignOut();
            setIsMenuOpen(false);
          }}>
                <LogOut className="h-4 w-4 mr-2" /> {t('common.logout')}
              </Button>}
          </div>
        </div>
      </div>
    </header>;
};
export default Navbar;