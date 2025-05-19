// Importa as dependências necessárias do React e do React Router
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, AUTH_EVENTS } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Define as propriedades esperadas pelo componente AuthGuard
interface AuthGuardProps {
  children: React.ReactNode;
}

// Componente responsável por proteger rotas que exigem autenticação
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // Obtém informações do usuário e estado de carregamento do contexto de autenticação
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  // Estado para saber se a autenticação já está pronta
  const [authReady, setAuthReady] = useState(false);
  // Estado para verificar se o usuário é admin (verificação extra)
  const [verifiedAdmin, setVerifiedAdmin] = useState<boolean | null>(null);
  
  // Efeito para escutar quando a autenticação estiver pronta
  useEffect(() => {
    const handleAuthReady = () => {
      setAuthReady(true);
    };
    
    window.addEventListener(AUTH_EVENTS.AUTH_READY, handleAuthReady);
    
    // Se já temos usuário ou não está carregando, consideramos pronto
    if (!loading) {
      setAuthReady(true);
    }
    
    return () => {
      window.removeEventListener(AUTH_EVENTS.AUTH_READY, handleAuthReady);
    };
  }, [loading]);

  // Efeito para verificação extra de admin em rotas administrativas
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (isAdminRoute && user && !verifiedAdmin && authReady) {
      // Verifica diretamente no banco se o usuário é admin
      const verifyAdminStatus = async () => {
        try {
          console.log('AuthGuard: Verificando status de admin para o usuário:', user.id);
          const { data, error } = await supabase
            .from('user_role_assignments')
            .select('role_id, user_roles!inner(name)')
            .eq('user_id', user.id);
            
          if (error) {
            console.error('Erro ao verificar status de admin:', error);
            setVerifiedAdmin(false);
          } else {
            // Verifica se algum dos papéis do usuário é 'admin'
            const adminStatus = data && data.length > 0 && data.some(r => r.user_roles?.name === 'admin');
            console.log('AuthGuard: Resultado da verificação de admin no banco:', adminStatus, data);
            setVerifiedAdmin(adminStatus);
          }
        } catch (err) {
          console.error('Exceção durante verificação de admin:', err);
          setVerifiedAdmin(false);
        }
      };
      
      verifyAdminStatus();
    } else if (!isAdminRoute) {
      // Reseta a verificação para rotas que não são admin
      setVerifiedAdmin(null);
    }
  }, [location.pathname, user, authReady, verifiedAdmin]);

  // Exibe um loading enquanto está carregando ou aguardando autenticação
  if (loading || !authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se o usuário não está autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Para rotas admin, verifica se o usuário é admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) {
    // Se já verificou no banco e não é admin, redireciona
    if (verifiedAdmin === false) {
      console.log('AuthGuard: Acesso negado - usuário não é admin (verificado no banco)');
      return <Navigate to="/dashboard" />;
    }
    
    // Se não é admin pelo estado do contexto, também redireciona
    if (!isAdmin && verifiedAdmin !== true) {
      console.log('AuthGuard: Acesso negado - usuário não é admin (do contexto de auth)');
      return <Navigate to="/dashboard" />;
    }
  }

  // Se passou por todas as verificações, renderiza os filhos (conteúdo protegido)
  return <>{children}</>;
};

// Exporta o componente para ser usado nas rotas protegidas
export default AuthGuard;
