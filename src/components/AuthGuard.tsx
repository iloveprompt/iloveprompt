
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    // Você pode adicionar um componente de loading aqui
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
