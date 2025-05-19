import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, AUTH_EVENTS } from './useAuth';
import { supabase } from '@/lib/supabase';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { user, session, isAdmin, isAuthenticated, checkIfUserIsAdmin } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [lastRedirectedUserId, setLastRedirectedUserId] = useState<string | null>(null);

  // Enhanced function to handle redirection after login
  const redirectAfterLogin = async (userId?: string) => {
    if (!isAuthenticated || !user?.id) return;

    try {
      // Redireciona diretamente baseado no isAdmin do contexto
      navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
    } catch (error) {
      // Em caso de erro, vai para o dashboard
      navigate('/dashboard', { replace: true });
    }
  };

  // Listen for admin status checked event
  useEffect(() => {
    const handleAdminStatusChecked = (event: CustomEvent<{ isAdmin: boolean, userId?: string }>) => {
      const { userId } = event.detail;
      if (userId && isAuthenticated && session) {
        // Only redirect if this was triggered by an explicit login
        if (lastRedirectedUserId !== userId) {
          console.log('Admin status checked event received, triggering redirect for user:', userId);
          redirectAfterLogin(userId);
        }
      }
    };

    window.addEventListener(
      AUTH_EVENTS.ADMIN_STATUS_CHECKED, 
      handleAdminStatusChecked as EventListener
    );

    return () => {
      window.removeEventListener(
        AUTH_EVENTS.ADMIN_STATUS_CHECKED, 
        handleAdminStatusChecked as EventListener
      );
    };
  }, [isAuthenticated, session, lastRedirectedUserId]);

  return { redirectAfterLogin };
}
