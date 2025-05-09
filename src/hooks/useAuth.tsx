
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
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);

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
          const isUserAdmin = data.session.user.email === 'ander_dorneles@hotmail.com';
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
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Check if user is admin
        if (currentSession?.user) {
          const isUserAdmin = currentSession.user.email === 'ander_dorneles@hotmail.com';
          setIsAdmin(isUserAdmin);
        }
        
        if (event === 'SIGNED_IN') {
          toast({
            title: t('auth.signedIn'),
            description: t('auth.welcomeMessage'),
          });
          
          // Redirect to appropriate dashboard
          redirectAfterLogin(currentSession?.user?.email);
        }
        
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
  }, [toast, t]);

  // Function to handle redirect after login
  const redirectAfterLogin = (userEmail: string | undefined) => {
    if (navigateFunction) {
      if (userEmail === 'ander_dorneles@hotmail.com') {
        navigateFunction('/admin');
      } else {
        navigateFunction('/dashboard');
      }
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
