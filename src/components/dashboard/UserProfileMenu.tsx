import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, AlertCircle } from 'lucide-react';
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

interface UserProfileMenuProps {
  showPlan?: boolean;
  plan?: string;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ showPlan = true, plan = 'Free' }) => {
  const { user, signOut, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Estado para verificação de perfil incompleto
  const isProfileIncomplete = true;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase()
    : 'US';

  // Traduzir o plano
  const translatedPlan = plan === 'Free' 
    ? (language === 'pt' ? 'Básico' : 'Free') 
    : plan;

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center relative outline-none">
            {isProfileIncomplete && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 border border-white z-10"></span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('common.incompleteProfile')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-blue-600 text-white">{userInitials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {user?.email}
            {isAdmin && (
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block ml-2">
                Admin
              </div>
            )}
            {showPlan && <div className="text-xs text-gray-500 mt-1">{language === 'pt' ? 'Plano: ' : 'Plan: '}{translatedPlan}</div>}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isProfileIncomplete && (
            <DropdownMenuItem onClick={() => navigate('/dashboard/profile')} className="text-red-600">
              <AlertCircle className="mr-2 h-4 w-4" />
              {t('common.completeProfile')}
            </DropdownMenuItem>
          )}
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
