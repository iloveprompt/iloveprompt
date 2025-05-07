
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text text-transparent prompt-gradient">iloveprompt</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-brand-600 transition-colors">{t('common.home')}</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-brand-600 transition-colors">{t('common.pricing')}</Link>
            <Link to="/features" className="text-gray-700 hover:text-brand-600 transition-colors">{t('common.features')}</Link>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/login">
                <Button variant="outline" className="border-brand-500 text-brand-700 hover:bg-brand-50">{t('common.login')}</Button>
              </Link>
              <Link to="/prompt-generator">
                <Button className="bg-brand-600 hover:bg-brand-700 text-white">{t('common.startFree')}</Button>
              </Link>
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
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
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">{t('common.home')}</Link>
            <Link to="/pricing" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">{t('common.pricing')}</Link>
            <Link to="/features" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">{t('common.features')}</Link>
            <div className="flex flex-col space-y-2 px-3 pt-4">
              <Link to="/login">
                <Button variant="outline" className="w-full border-brand-500 text-brand-700">{t('common.login')}</Button>
              </Link>
              <Link to="/prompt-generator">
                <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white">{t('common.startFree')}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
