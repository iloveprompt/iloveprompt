import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import { colors } from '@/styles/colors';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    t
  } = useLanguage();
  const {
    user,
    signOut,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Check if user is admin (for demo purposes, can be replaced with actual role check)
  const isAdmin = user?.email?.includes('admin');
  return <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 bg-gray-50">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/lovable-uploads/38e9462c-ec41-45c6-b98e-95e9a854929c.png" alt="iloveprompt logo" className="h-8" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-brand-600 transition-colors">{t('common.home')}</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-brand-600 transition-colors">{t('common.pricing')}</Link>
            <Link to="/features" className="text-gray-700 hover:text-brand-600 transition-colors">{t('common.features')}</Link>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {isAuthenticated ? <div className="flex items-center space-x-4">
                  {isAdmin ? <Link to="/admin">
                      <Button style={{
                  backgroundColor: colors.blue[600]
                }} className="text-white hover:bg-opacity-90 flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Admin
                      </Button>
                    </Link> : <Link to="/dashboard">
                      <Button style={{
                  backgroundColor: colors.blue[600]
                }} className="text-white hover:bg-opacity-90 flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="w-full cursor-pointer">{t('common.profile')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="w-full cursor-pointer">{t('common.settings')}</Link>
                      </DropdownMenuItem>
                      {isAdmin && <DropdownMenuItem asChild>
                          <Link to="/admin" className="w-full cursor-pointer">Admin Dashboard</Link>
                        </DropdownMenuItem>}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('common.logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div> : <>
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
                }} className="text-white hover:bg-opacity-90">
                      {t('common.startFree')}
                    </Button>
                  </Link>
                </>}
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
      {isMenuOpen && <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">{t('common.home')}</Link>
            <Link to="/pricing" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">{t('common.pricing')}</Link>
            <Link to="/features" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">{t('common.features')}</Link>
            <div className="flex flex-col space-y-2 px-3 pt-4">
              {isAuthenticated ? <>
                  <div className="text-sm text-gray-500 pb-2">{user?.email}</div>
                  <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">{t('common.profile')}</Link>
                  <Link to="/settings" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">{t('common.settings')}</Link>
                  {isAdmin ? <Link to="/admin" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Admin Dashboard</Link> : <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Dashboard</Link>}
                  <Button onClick={handleSignOut} variant="outline" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('common.logout')}
                  </Button>
                </> : <>
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
                </>}
            </div>
          </div>
        </div>}
    </header>;
};
export default Navbar;