
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Settings, User, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AdminProfileMenu = () => {
  const { user, signOut } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center relative outline-none">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-blue-600 text-white">{userInitials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {user?.email}
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block ml-2">
              Admin
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
            <User className="mr-2 h-4 w-4" />
            {t('dashboard.profile')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            {t('dashboard.settings')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            {t('common.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AdminProfileMenu;
