
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, AUTH_EVENTS } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  const [authReady, setAuthReady] = useState(false);
  
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

  if (loading || !authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Verificar se o usuário está autenticado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Verificar se as rotas administrativas estão sendo acessadas por um administrador
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
