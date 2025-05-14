
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, AUTH_EVENTS } from './useAuth';
import { supabase } from '@/lib/supabase';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { user, session, isAdmin, isAuthenticated, checkIfUserIsAdmin } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [lastRedirectedUserId, setLastRedirectedUserId] = useState<string | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);

  // Enhanced function to handle redirection after login
  const redirectAfterLogin = async (userId?: string) => {
    if (isRedirecting) {
      console.log('Already redirecting, ignoring request');
      return;
    }

    // Base security checks
    if (!isAuthenticated || !user?.id) {
      console.log('Cannot redirect - user not authenticated or missing ID');
      return;
    }

    // Use provided userId or fall back to current user ID
    const effectiveUserId = userId || user.id;
    
    // Prevent duplicate redirects for the same user
    if (lastRedirectedUserId === effectiveUserId) {
      console.log('Already redirected for this user, ignoring request');
      return;
    }
    
    console.log('Starting redirection process for user:', effectiveUserId);
    setIsRedirecting(true);
    setLastRedirectedUserId(effectiveUserId);
    
    // Limpar qualquer timeout pendente
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
    }
    
    try {
      // Direct check with database to determine admin status
      console.log('Performing direct admin check for user:', effectiveUserId);
      
      // Definir um timeout para garantir que o redirecionamento aconteça
      redirectTimeoutRef.current = window.setTimeout(() => {
        console.log('Redirect timeout triggered, performing redirect with current isAdmin state:', isAdmin);
        if (isAdmin) {
          console.log('User is admin (from timeout), redirecting to /admin');
          navigate('/admin');
        } else {
          console.log('User is not admin (from timeout), redirecting to /dashboard');
          navigate('/dashboard');
        }
        setIsRedirecting(false);
      }, 2000);
      
      // First attempt: Use our function
      let userIsAdmin = await checkIfUserIsAdmin(effectiveUserId);
      
      // Cancelar o timeout se conseguimos determinar o status
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
      
      // Explicit redirection based on determined admin status
      if (userIsAdmin) {
        console.log('User is admin, redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('User is not admin, redirecting to /dashboard');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during redirection:', error);
      // Fallback redireciton to dashboard in case of errors
      navigate('/dashboard');
    } finally {
      // Reset redirection flag after short delay
      setTimeout(() => {
        setIsRedirecting(false);
      }, 500);
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
