
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
    console.log('Admin check cache cleared on mount');
  }, []);
  
  // Função aprimorada para verificar se o usuário é administrador
  const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      // Reset cache for active login
      const isLoginCheck = user?.id !== userId;
      if (isLoginCheck) {
        console.log('New login detected, clearing admin cache');
        adminCheckCacheRef.current = {};
      }
      
      // Verificar cache primeiro
      if (adminCheckCacheRef.current[userId] !== undefined) {
        console.log('Usando resultado em cache para verificação de admin:', userId, adminCheckCacheRef.current[userId]);
        return adminCheckCacheRef.current[userId];
      }

      // Evitar verificações simultâneas
      if (isCheckingAdmin) {
        console.log('Verificação de admin já em andamento, aguardando...');
        // Wait a bit and try again
        await new Promise(r => setTimeout(r, 200));
        if (adminCheckCacheRef.current[userId] !== undefined) {
          return adminCheckCacheRef.current[userId];
        }
      }

      setIsCheckingAdmin(true);
      console.log('Performing admin check for user:', userId);
      
      // Tentativa 1: Usar a função RPC que criamos
      console.log('Attempt 1: Using is_admin RPC function');
      const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin', { user_id: userId });
      
      let result = false;
      
      if (rpcError) {
        console.error('RPC error in is_admin function:', rpcError.message);
        
        // Tentativa 2: Verificar diretamente via user_role_assignments com join
        console.log('Attempt 2: Querying user_role_assignments with join');
        const { data: roleData, error: roleError } = await supabase
          .from('user_role_assignments')
          .select(`
            role_id,
            user_roles!inner(name)
          `)
          .eq('user_id', userId);
          
        if (roleError) {
          console.error('Role query error:', roleError.message);
          
          // Tentativa 3: Verificar user_role_assignments sem join
          console.log('Attempt 3: Querying user_role_assignments without join');
          const { data: basicRoleData, error: basicRoleError } = await supabase
            .from('user_role_assignments')
            .select('role_id')
            .eq('user_id', userId);
            
          if (basicRoleError) {
            console.error('Basic role query error:', basicRoleError.message);
            
            // Tentativa 4: Check specific emails as fallback
            console.log('Attempt 4: Email fallback check');
            result = user?.email === 'ander_dorneles@hotmail.com';
            console.log('Email fallback result:', result, 'for email:', user?.email);
          } else {
            // If we got role IDs, try to get their names
            if (basicRoleData && basicRoleData.length > 0) {
              const roleIds = basicRoleData.map(r => r.role_id);
              console.log('Found role IDs:', roleIds);
              
              const { data: rolesData, error: rolesError } = await supabase
                .from('user_roles')
                .select('name')
                .in('id', roleIds);
                
              if (rolesError) {
                console.error('Roles query error:', rolesError.message);
                // Fallback to email check
                result = user?.email === 'ander_dorneles@hotmail.com';
              } else {
                result = rolesData && rolesData.some(r => r.name === 'admin');
                console.log('Roles data:', rolesData, 'is admin:', result);
              }
            } else {
              console.log('No role assignments found for user');
              result = user?.email === 'ander_dorneles@hotmail.com';
            }
          }
        } else {
          result = roleData && roleData.length > 0 && roleData.some(r => r.user_roles?.name === 'admin');
          console.log('Role assignment query result:', roleData, 'is admin:', result);
        }
      } else {
        result = rpcData === true;
        console.log('RPC is_admin result:', result);
      }
      
      // Special case for known admin
      if (user?.email === 'ander_dorneles@hotmail.com' && !result) {
        console.log('Override: User is known admin by email');
        result = true;
      }
      
      // Armazenar resultado no cache
      adminCheckCacheRef.current[userId] = result;
      setIsCheckingAdmin(false);
      
      // Dispatch event when admin status is checked
      console.log('Dispatching ADMIN_STATUS_CHECKED event with result:', result);
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.ADMIN_STATUS_CHECKED, {
        detail: { isAdmin: result, userId }
      }));
      
      return result;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsCheckingAdmin(false);
      
      // Fallback para o método antigo caso ocorra qualquer erro
      const isAdminResult = user?.email === 'ander_dorneles@hotmail.com';
      console.log('Exception fallback: User email check for admin:', isAdminResult);
      
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
          
          // Clear admin cache on initialization
          adminCheckCacheRef.current = {};
          
          // Check if user is admin
          setTimeout(async () => {
            const isUserAdmin = await checkIfUserIsAdmin(data.session.user.id);
            setIsAdmin(isUserAdmin);
            console.log('Initial admin status set to:', isUserAdmin);
          }, 300);
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
        
        // Clear admin cache on auth state change
        if (event === 'SIGNED_IN') {
          adminCheckCacheRef.current = {};
        }
        
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
          }, 300);
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
