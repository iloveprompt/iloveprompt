
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from './use-toast';
import { useLanguage } from '@/i18n/LanguageContext';

// Create a custom event for authentication state changes
export const AUTH_EVENTS = {
  ADMIN_STATUS_CHECKED: 'admin-status-checked',
  AUTH_READY: 'auth-ready'
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  checkIfUserIsAdmin: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  checkIfUserIsAdmin: async () => false,
});

// Cache para verificação de admin para evitar verificações repetitivas
const adminCheckCache: {[key: string]: boolean} = {};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Melhoria: Usar uma referência estável para o cache
  const adminCheckCacheRef = React.useRef(adminCheckCache);

  // Função para verificar se o usuário é administrador com cache
  const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      // Verificar cache primeiro
      if (adminCheckCacheRef.current[userId] !== undefined) {
        console.log('Usando resultado em cache para verificação de admin:', userId);
        return adminCheckCacheRef.current[userId];
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
          result = user?.email === 'ander_dorneles@hotmail.com';
        } else {
          result = roleData && roleData.length > 0 && roleData.some(r => r.user_roles?.name === 'admin');
        }
      } else {
        result = data === true;
      }
      
      // Armazenar resultado no cache
      adminCheckCacheRef.current[userId] = result;
      setIsCheckingAdmin(false);
      
      // Dispatch event when admin status is checked
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.ADMIN_STATUS_CHECKED, {
        detail: { isAdmin: result, userId }
      }));
      
      return result;
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      setIsCheckingAdmin(false);
      // Fallback para o método antigo caso ocorra qualquer erro
      const isAdminResult = user?.email === 'ander_dorneles@hotmail.com';
      
      // Still dispatch the event even in case of error
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.ADMIN_STATUS_CHECKED, {
        detail: { isAdmin: isAdminResult, userId: user?.id }
      }));
      
      return isAdminResult;
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
          setSession(null);
          setUser(null);
          setLoading(false);
          window.dispatchEvent(new CustomEvent(AUTH_EVENTS.AUTH_READY, {
            detail: { authenticated: false }
          }));
          return;
        }
        
        // Verifique explicitamente se temos uma sessão válida
        if (data?.session && data.session.user) {
          console.log('Valid session found during initialization');
          setSession(data.session);
          setUser(data.session.user);
          
          // Check if user is admin
          const isUserAdmin = await checkIfUserIsAdmin(data.session.user.id);
          setIsAdmin(isUserAdmin);
          console.log('Initial admin status set to:', isUserAdmin);
        } else {
          // Não temos uma sessão válida
          console.log('No valid session found during initialization');
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        }
        
        // Signal authentication is ready
        window.dispatchEvent(new CustomEvent(AUTH_EVENTS.AUTH_READY, {
          detail: { 
            authenticated: !!(data?.session && data.session.user),
            user: data?.session?.user || null
          }
        }));
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        window.dispatchEvent(new CustomEvent(AUTH_EVENTS.AUTH_READY, {
          detail: { authenticated: false }
        }));
      } finally {
        setLoading(false);
      }
    };

    // Set up the auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        // Update state with new session info
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Check if user is admin only if we have a valid user
        // Use setTimeout to avoid Supabase auth deadlocks
        if (currentSession?.user) {
          setTimeout(async () => {
            const isUserAdmin = await checkIfUserIsAdmin(currentSession.user.id);
            setIsAdmin(isUserAdmin);
            console.log('Admin status updated to:', isUserAdmin);
          }, 0);
        } else {
          setIsAdmin(false);
        }
        
        // Handle SIGNED_IN event - show toast
        if (event === 'SIGNED_IN') {
          console.log('SIGNED_IN event detected, showing toast');
          toast({
            title: t('auth.signedIn'),
            description: t('auth.welcomeMessage'),
          });
        }
        
        // Handle SIGNED_OUT event
        if (event === 'SIGNED_OUT') {
          console.log('SIGNED_OUT event detected, showing toast');
          toast({
            title: t('auth.signedOut'),
            description: t('auth.comeBackSoon'),
          });
          
          // Limpar cache de verificação de admin
          adminCheckCacheRef.current = {};
        }
      }
    );

    // Then check for existing session
    getInitialSession();

    return () => {
      console.log('Cleaning up auth listener');
      authListener?.subscription?.unsubscribe();
    };
  }, [toast, t]);

  const signOut = async () => {
    try {
      console.log('Signing out user');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      // Limpar cache de verificação de admin
      adminCheckCacheRef.current = {};
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!(user && session), // Garante que verificamos tanto usuário quanto sessão
    isAdmin,
    checkIfUserIsAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
