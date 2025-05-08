
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Users, BarChart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import UserProfileMenu from './UserProfileMenu';

const AdminDashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white border-b border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center">
              <img src="/lovable-uploads/4c0e25c9-7a84-42ff-92f3-643522f86121.png" alt="iloveprompt logo" className="h-8 mr-2" />
              <span className="text-lg font-bold text-white">Admin</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/admin" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Dashboard
            </Link>
            <Link to="/admin/users" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link to="/admin/settings" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <UserProfileMenu showPlan={false} />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link 
              to="/admin" 
              className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              to="/admin/users" 
              className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link 
              to="/admin/settings" 
              className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminDashboardNavbar;
