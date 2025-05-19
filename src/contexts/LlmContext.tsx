import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { UserLlmApi } from '@/services/userSettingService';

interface LlmContextType {
  llms: UserLlmApi[];
  loading: boolean;
  loadLlms: () => Promise<void>;
}

const LlmContext = createContext<LlmContextType | undefined>(undefined);

export function LlmProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [llms, setLlms] = useState<UserLlmApi[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLlms = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_llm_apis')
        .select('*')
        .eq('user_id', user.id)
        .order('is_active', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar LLMs:', error);
        return;
      }

      setLlms(data || []);
    } catch (err) {
      console.error('Erro ao carregar LLMs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar LLMs quando o usuário mudar
  useEffect(() => {
    if (user?.id) {
      loadLlms();
    }
  }, [user?.id]);

  return (
    <LlmContext.Provider value={{ llms, loading, loadLlms }}>
      {children}
    </LlmContext.Provider>
  );
}

export function useLlm() {
  const context = useContext(LlmContext);
  if (context === undefined) {
    throw new Error('useLlm must be used within a LlmProvider');
  }
  return context;
} 