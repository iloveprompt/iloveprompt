
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
    
    try {
      // Direct check with database to determine admin status
      console.log('Performing direct admin check for user:', effectiveUserId);
      
      // First attempt: Use our function
      let userIsAdmin = await checkIfUserIsAdmin(effectiveUserId);
      
      // Second attempt: Direct database query if needed
      if (!userIsAdmin) {
        console.log('First admin check negative, trying direct database query');
        const { data, error } = await supabase
          .from('user_role_assignments')
          .select('role_id, user_roles!inner(name)')
          .eq('user_id', effectiveUserId);
          
        if (error) {
          console.error('Error during direct admin check:', error);
        } else if (data && data.length > 0) {
          userIsAdmin = data.some(r => r.user_roles?.name === 'admin');
          console.log('Direct database query results:', data, 'isAdmin:', userIsAdmin);
        }
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
