
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Settings, User } from 'lucide-react';
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

interface UserProfileMenuProps {
  showPlan?: boolean;
  plan?: string;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ showPlan = true, plan = 'Free' }) => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase()
    : 'US';

  return (
    <div className="flex items-center gap-3">
      {showPlan && (
        <div className="hidden md:block">
          <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
            {plan}
          </span>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 outline-none">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-blue-600 text-white">{userInitials}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm hidden md:block">{user?.email}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {user?.email}
            {showPlan && <div className="text-xs text-gray-500 mt-1">Plan: {plan}</div>}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
            <User className="mr-2 h-4 w-4" />
            {t('dashboard.profile')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
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

export default UserProfileMenu;
