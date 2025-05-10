
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from './use-toast';
import { useLanguage } from '@/i18n/LanguageContext';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  redirectAfterLogin: (userId: string | undefined) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  isAuthenticated: false,
  redirectAfterLogin: () => {},
  isAdmin: false,
});

interface AuthProviderProps {
  children: ReactNode;
  navigateFunction?: (path: string) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  navigateFunction 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Cache para verificação de admin para evitar verificações repetitivas
  const adminCheckCache = React.useRef<{[key: string]: boolean}>({});

  // Função para verificar se o usuário é administrador com cache
  const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      // Verificar cache primeiro
      if (adminCheckCache.current[userId] !== undefined) {
        console.log('Usando resultado em cache para verificação de admin:', userId);
        return adminCheckCache.current[userId];
      }

      // Evitar verificações simultâneas
      if (isCheckingAdmin) {
        console.log('Verificação de admin já em andamento, aguardando...');
        return isAdmin;
      }

      setIsCheckingAdmin(true);
      console.log('Checking if user is admin:', userId);
      
      // Primeiro tentamos verificar usando a função RPC que criamos
      const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
      
      let result = false;
      
      if (error) {
        console.error('Erro ao verificar função is_admin:', error.message);
        
        // Fallback: verificar diretamente via consulta às tabelas
        const { data: roleData, error: roleError } = await supabase
          .from('user_role_assignments')
          .select(`
            role_id,
            user_roles!inner(name)
          `)
          .eq('user_id', userId);
          
        if (roleError) {
          console.error('Erro ao verificar role:', roleError.message);
          
          // Fallback final: se as tabelas ainda não existirem, usar o método antigo
          result = userId === 'ander_dorneles@hotmail.com';
        } else {
          result = roleData && roleData.length > 0 && roleData.some(r => r.user_roles?.name === 'admin');
        }
      } else {
        result = data === true;
      }
      
      // Armazenar resultado no cache
      adminCheckCache.current[userId] = result;
      setIsCheckingAdmin(false);
      return result;
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      setIsCheckingAdmin(false);
      // Fallback para o método antigo caso ocorra qualquer erro
      return user?.email === 'ander_dorneles@hotmail.com';
    }
  };

  // Function to handle redirect after login - completely separate from auth state changes
  // Modified to use userId directly instead of relying on the current user state
  const redirectAfterLogin = async (userId: string | undefined) => {
    if (!navigateFunction) {
      console.log('Cannot redirect: missing navigation function', { 
        hasNavigate: !!navigateFunction
      });
      return;
    }
    
    // If userId is not provided, try to get it from the current user state
    const effectiveUserId = userId || user?.id;
    
    if (!effectiveUserId) {
      console.log('Cannot redirect: no user ID available');
      return;
    }
    
    try {
      console.log('Redirecting after login for user ID:', effectiveUserId);
      const isUserAdmin = await checkIfUserIsAdmin(effectiveUserId);
      console.log('User admin check result:', isUserAdmin);
      
      if (isUserAdmin) {
        console.log('User is admin, redirecting to /admin');
        navigateFunction('/admin');
      } else {
        console.log('User is not admin, redirecting to /dashboard');
        navigateFunction('/dashboard');
      }
    } catch (error) {
      console.error('Error in redirectAfterLogin:', error);
      // Default fallback - redirect to dashboard
      console.log('Fallback: redirecting to /dashboard due to error');
      navigateFunction('/dashboard');
    }
  };

  // Verifica se o usuário está na página inicial e deve ser redirecionado
  const checkAndRedirectFromHomepage = () => {
    // Se estamos na página inicial e o usuário está autenticado, redirecionar
    if (window.location.pathname === '/' && user && navigateFunction) {
      console.log('Usuário autenticado na página inicial, redirecionando...');
      redirectAfterLogin(user.id);
    }
  };

  useEffect(() => {
    // Get initial session and user
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
        }
        
        setSession(data?.session || null);
        setUser(data?.session?.user || null);
        
        // Check if user is admin
        if (data?.session?.user) {
          console.log('User found in initial session, checking admin status');
          const isUserAdmin = await checkIfUserIsAdmin(data.session.user.id);
          setIsAdmin(isUserAdmin);
          console.log('Initial admin status set to:', isUserAdmin);
          
          // Se o usuário estiver na homepage e estiver autenticado, redirecionar
          if (window.location.pathname === '/' && navigateFunction) {
            redirectAfterLogin(data.session.user.id);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        // Update state with new session info
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Check if user is admin
        if (currentSession?.user) {
          const isUserAdmin = await checkIfUserIsAdmin(currentSession.user.id);
          setIsAdmin(isUserAdmin);
          console.log('Admin status updated to:', isUserAdmin);
        } else {
          setIsAdmin(false);
        }
        
        // Handle SIGNED_IN event - show toast AND redirect from homepage
        if (event === 'SIGNED_IN') {
          console.log('SIGNED_IN event detected, showing toast and checking for redirect');
          toast({
            title: t('auth.signedIn'),
            description: t('auth.welcomeMessage'),
          });
          
          // Importante: verificar se precisamos redirecionar da página inicial
          // Isso ajudará no redirecionamento após login social
          if (currentSession?.user && window.location.pathname === '/') {
            console.log('User is on homepage after signin, redirecting...');
            
            // Use setTimeout para evitar problemas com o estado de auth
            setTimeout(() => {
              redirectAfterLogin(currentSession.user?.id);
            }, 100);
          }
        }
        
        // Handle SIGNED_OUT event
        if (event === 'SIGNED_OUT') {
          console.log('SIGNED_OUT event detected, showing toast');
          toast({
            title: t('auth.signedOut'),
            description: t('auth.comeBackSoon'),
          });
          
          // Limpar cache de verificação de admin
          adminCheckCache.current = {};
        }
      }
    );

    return () => {
      console.log('Cleaning up auth listener');
      authListener?.subscription?.unsubscribe();
    };
  }, [toast, t, navigateFunction]);

  const signOut = async () => {
    try {
      console.log('Signing out user');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      // Limpar cache de verificação de admin
      adminCheckCache.current = {};
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
    redirectAfterLogin,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
