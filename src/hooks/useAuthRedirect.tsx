
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, AUTH_EVENTS } from './useAuth';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { user, session, isAdmin, isAuthenticated } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [lastRedirectedUserId, setLastRedirectedUserId] = useState<string | null>(null);

  // Function to handle redirection after login
  const redirectAfterLogin = (userId?: string) => {
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
    
    console.log('Redirecting after successful authentication for user:', effectiveUserId);
    setIsRedirecting(true);
    setLastRedirectedUserId(effectiveUserId);
    
    try {
      // Explicit redirection based on admin status
      if (isAdmin) {
        console.log('Redirecting to admin dashboard (user is admin)');
        navigate('/admin');
      } else {
        console.log('Redirecting to user dashboard (user is not admin)');
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
          console.log('Admin status checked, triggering redirect for user:', userId);
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
