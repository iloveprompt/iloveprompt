import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, AUTH_EVENTS } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  const [authReady, setAuthReady] = useState(false);
  const [verifiedAdmin, setVerifiedAdmin] = useState<boolean | null>(null);
  
  // Listen for auth ready event
  useEffect(() => {
    const handleAuthReady = () => {
      setAuthReady(true);
    };
    
    window.addEventListener(AUTH_EVENTS.AUTH_READY, handleAuthReady);
    
    // If we already have a user or loading is false, we can consider auth ready
    if (!loading) {
      setAuthReady(true);
    }
    
    return () => {
      window.removeEventListener(AUTH_EVENTS.AUTH_READY, handleAuthReady);
    };
  }, [loading]);

  // Extra verification for admin routes
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (isAdminRoute && user && !verifiedAdmin && authReady) {
      // Double-check admin status directly from database for admin routes
      const verifyAdminStatus = async () => {
        try {
          console.log('AuthGuard: Verifying admin status for user:', user.id);
          const { data, error } = await supabase
            .from('user_role_assignments')
            .select('role_id, user_roles!inner(name)')
            .eq('user_id', user.id);
            
          if (error) {
            console.error('Error verifying admin status:', error);
            setVerifiedAdmin(false);
          } else {
            const adminStatus = data && data.length > 0 && data.some(r => r.user_roles?.name === 'admin');
            console.log('AuthGuard: Database admin verification result:', adminStatus, data);
            setVerifiedAdmin(adminStatus);
          }
        } catch (err) {
          console.error('Exception during admin verification:', err);
          setVerifiedAdmin(false);
        }
      };
      
      verifyAdminStatus();
    } else if (!isAdminRoute) {
      // Reset verification for non-admin routes
      setVerifiedAdmin(null);
    }
  }, [location.pathname, user, authReady, verifiedAdmin]);

  // Show loading state
  if (loading || !authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Verify if the user is authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // For admin routes, check both states
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) {
    // If we've verified admin status directly from DB, use that result
    if (verifiedAdmin === false) {
      console.log('AuthGuard: Access denied - user is not an admin (verified from DB)');
      return <Navigate to="/dashboard" />;
    }
    
    // Otherwise fall back to the isAdmin state from useAuth
    if (!isAdmin && verifiedAdmin !== true) {
      console.log('AuthGuard: Access denied - user is not an admin (from auth state)');
      return <Navigate to="/dashboard" />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;
