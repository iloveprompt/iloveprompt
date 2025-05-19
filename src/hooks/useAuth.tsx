import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, robustSignOut } from '@/lib/supabase';
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
let adminCheckCache: {[key: string]: boolean} = {};

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

  // Reset cache on mount and sign in
  useEffect(() => {
    // Clear cache on component mount
    adminCheckCacheRef.current = {};
  }, []);
  
  // Função aprimorada para verificar se o usuário é administrador
  const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      // Reset cache for active login
      const isLoginCheck = user?.id !== userId;
      if (isLoginCheck) {
        adminCheckCacheRef.current = {};
      }
      
      // Verificar cache primeiro
      if (adminCheckCacheRef.current[userId] !== undefined) {
        return adminCheckCacheRef.current[userId];
      }

      // Evitar verificações simultâneas
      if (isCheckingAdmin) {
        // Wait a bit and try again
        await new Promise(r => setTimeout(r, 200));
        if (adminCheckCacheRef.current[userId] !== undefined) {
          return adminCheckCacheRef.current[userId];
        }
      }

      setIsCheckingAdmin(true);
      
      // Tentativa 1: Usar a função RPC que criamos
      const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin', { user_id: userId });
      
      let result = false;
      
      if (rpcError) {
        // Tentativa 2: Verificar diretamente via user_role_assignments com join
        const { data: roleData, error: roleError } = await supabase
          .from('user_role_assignments')
          .select(`
            role_id,
            user_roles!inner(name)
          `)
          .eq('user_id', userId);
          
        if (roleError) {
          // Tentativa 3: Verificar user_role_assignments sem join
          const { data: basicRoleData, error: basicRoleError } = await supabase
            .from('user_role_assignments')
            .select('role_id')
            .eq('user_id', userId);
            
          if (basicRoleError) {
            // Tentativa 4: Check specific emails as fallback
            result = user?.email === 'ander_dorneles@hotmail.com';
          } else {
            // If we got role IDs, try to get their names
            if (basicRoleData && basicRoleData.length > 0) {
              const roleIds = basicRoleData.map(r => r.role_id);
              
              const { data: rolesData, error: rolesError } = await supabase
                .from('user_roles')
                .select('name')
                .in('id', roleIds);
                
              if (rolesError) {
                result = user?.email === 'ander_dorneles@hotmail.com';
              } else {
                result = rolesData && rolesData.some((r: { name: string }) => r.name === 'admin');
              }
            } else {
              result = user?.email === 'ander_dorneles@hotmail.com';
            }
          }
        } else {
          result = roleData && roleData.length > 0 && roleData.some(r => r.user_roles?.name === 'admin');
        }
      } else {
        result = rpcData === true;
      }
      
      // Special case for known admin
      if (user?.email === 'ander_dorneles@hotmail.com' && !result) {
        result = true;
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
    let isSubscribed = true;
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;
    
    const initializeAuth = async () => {
      try {
        // Obter sessão inicial
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!isSubscribed) return;

        // Validação rigorosa da sessão
        if (sessionData?.session?.access_token) {
          const { data: { user: validUser }, error: validationError } = await supabase.auth.getUser(sessionData.session.access_token);
          
          if (validationError) {
            setUser(null);
            setSession(null);
          } else {
            setUser(validUser);
            setSession(sessionData.session);
          }
        } else {
          setUser(null);
          setSession(null);
        }
        
        // Configurar o listener de autenticação apenas uma vez
        authSubscription = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (!isSubscribed) return;
          
          // Ignorar eventos INITIAL_SESSION para evitar loops
          if (event === 'INITIAL_SESSION') {
            return;
          }
          
          // Atualizar estado apenas para eventos significativos
          if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) {
            setSession(currentSession);
            setUser(currentSession?.user || null);
            
            if (currentSession?.user) {
              const isUserAdmin = await checkIfUserIsAdmin(currentSession.user.id);
              if (isSubscribed) {
                setIsAdmin(isUserAdmin);
              }
            } else {
              setIsAdmin(false);
              adminCheckCacheRef.current = {};
            }
            
            // Mostrar toast apenas para login/logout
            if (event === 'SIGNED_IN') {
              toast({
                title: t('auth.signedIn'),
                description: t('auth.welcomeMessage'),
              });
            } else if (event === 'SIGNED_OUT') {
              toast({
                title: t('auth.signedOut'),
                description: t('auth.comeBackSoon'),
              });
            }
          }
        });
        
        // Configurar estado inicial apenas se a sessão for válida
        if (sessionData.session?.user) {
          setSession(sessionData.session);
          setUser(sessionData.session.user);
          const isUserAdmin = await checkIfUserIsAdmin(sessionData.session.user.id);
          if (isSubscribed) {
            setIsAdmin(isUserAdmin);
          }
        }
      } catch (error) {
        // Em caso de erro na inicialização, limpar o estado por segurança
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        adminCheckCacheRef.current = {};
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isSubscribed = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      // Limpa todos os estados em uma única operação
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      adminCheckCacheRef.current = {};

      // Logout do Supabase e limpa storage
      await supabase.auth.signOut();
      localStorage.clear();
      
      // Redireciona para a raiz (comportamento padrão do Supabase)
      window.location.replace('/');
    } catch (error) {
      // Em caso de erro, força a limpeza e redirecionamento
      localStorage.clear();
      window.location.replace('/');
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
