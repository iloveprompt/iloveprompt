
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
  redirectAfterLogin: (userEmail: string | undefined) => void;
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
  const { toast } = useToast();
  const { t } = useLanguage();

  // Função para verificar se o usuário é administrador
  const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      // Primeiro tentamos verificar usando a função RPC que criamos
      const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
      
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
          return userId === 'ander_dorneles@hotmail.com';
        }
        
        return roleData && roleData.length > 0 && roleData.some(r => r.user_roles?.name === 'admin');
      }
      
      return data === true;
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      // Fallback para o método antigo caso ocorra qualquer erro
      return user?.email === 'ander_dorneles@hotmail.com';
    }
  };

  useEffect(() => {
    // Get initial session and user
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
        }
        
        setSession(data?.session || null);
        setUser(data?.session?.user || null);
        
        // Check if user is admin
        if (data?.session?.user) {
          const isUserAdmin = await checkIfUserIsAdmin(data.session.user.id);
          setIsAdmin(isUserAdmin);
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
        } else {
          setIsAdmin(false);
        }
        
        // Handle SIGNED_IN event
        if (event === 'SIGNED_IN') {
          toast({
            title: t('auth.signedIn'),
            description: t('auth.welcomeMessage'),
          });
          
          // Redirect to appropriate dashboard using setTimeout to avoid React state update conflicts
          if (currentSession?.user && navigateFunction) {
            setTimeout(() => {
              redirectAfterLogin(currentSession.user.email);
            }, 0);
          }
        }
        
        // Handle SIGNED_OUT event
        if (event === 'SIGNED_OUT') {
          toast({
            title: t('auth.signedOut'),
            description: t('auth.comeBackSoon'),
          });
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [toast, t, navigateFunction]);

  // Function to handle redirect after login
  const redirectAfterLogin = async (userEmail: string | undefined) => {
    if (!navigateFunction || !user) return;
    
    try {
      console.log('Redirecting after login for user:', userEmail);
      const isUserAdmin = await checkIfUserIsAdmin(user.id);
      
      if (isUserAdmin) {
        console.log('User is admin, redirecting to /admin');
        navigateFunction('/admin');
      } else {
        console.log('User is not admin, redirecting to /dashboard');
        navigateFunction('/dashboard');
      }
    } catch (error) {
      console.error('Error in redirectAfterLogin:', error);
      navigateFunction('/dashboard');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
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
