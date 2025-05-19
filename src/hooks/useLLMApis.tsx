import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';
import { useLanguage } from '@/i18n/LanguageContext';

interface LLMApi {
  id: string;
  provider: 'openai' | 'gemini' | 'groq' | 'deepseek';
  api_key: string;
  models?: string[];
  is_active: boolean;
  test_status: 'untested' | 'success' | 'failure';
  last_tested_at?: string;
}

const CACHE_KEY = 'user_llm_apis_cache';
const CACHE_TIMESTAMP_KEY = 'user_llm_apis_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useLLMApis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [apis, setApis] = useState<LLMApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar APIs do cache
  const loadFromCache = () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const cachedUserId = localStorage.getItem('cached_user_id');
      
      if (cachedData && timestamp && cachedUserId === user?.id) {
        const parsedTimestamp = parseInt(timestamp);
        if (Date.now() - parsedTimestamp < CACHE_DURATION) {
          const parsedData = JSON.parse(cachedData);
          console.log('Loading from cache:', parsedData); // Debug log
          setApis(parsedData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error loading cache:', error);
      return false;
    }
  };

  // Função para salvar no cache
  const saveToCache = (data: LLMApi[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      localStorage.setItem('cached_user_id', user?.id || '');
      console.log('Saved to cache:', data); // Debug log
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  };

  // Função para limpar o cache
  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      localStorage.removeItem('cached_user_id');
      console.log('Cache cleared'); // Debug log
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Função para carregar APIs do servidor
  const fetchApis = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching APIs for user:', user?.id); // Debug log

      const { data, error } = await supabase
        .from('user_llm_apis')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error); // Debug log
        throw error;
      }

      console.log('Fetched APIs:', data); // Debug log

      setApis(data || []);
      saveToCache(data || []);
      
      return data;
    } catch (error) {
      console.error('Error fetching APIs:', error);
      setError(t('errors.fetchApis'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar nova API
  const addApi = async (newApi: Omit<LLMApi, 'id' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('user_llm_apis')
        .insert([
          {
            ...newApi,
            user_id: user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setApis(prev => [data, ...prev]);
      saveToCache([data, ...apis]);
      
      toast({
        title: t('success.apiAdded'),
        description: t('success.apiAddedDesc'),
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar API:', error);
      toast({
        title: t('errors.addApi'),
        description: t('errors.tryAgain'),
        variant: 'destructive',
      });
      return null;
    }
  };

  // Função para atualizar API
  const updateApi = async (id: string, updates: Partial<LLMApi>) => {
    try {
      const { data, error } = await supabase
        .from('user_llm_apis')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setApis(prev => prev.map(api => api.id === id ? { ...api, ...data } : api));
      saveToCache(apis.map(api => api.id === id ? { ...api, ...data } : api));
      
      toast({
        title: t('success.apiUpdated'),
        description: t('success.apiUpdatedDesc'),
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar API:', error);
      toast({
        title: t('errors.updateApi'),
        description: t('errors.tryAgain'),
        variant: 'destructive',
      });
      return null;
    }
  };

  // Função para deletar API
  const deleteApi = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_llm_apis')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setApis(prev => prev.filter(api => api.id !== id));
      saveToCache(apis.filter(api => api.id !== id));
      
      toast({
        title: t('success.apiDeleted'),
        description: t('success.apiDeletedDesc'),
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar API:', error);
      toast({
        title: t('errors.deleteApi'),
        description: t('errors.tryAgain'),
        variant: 'destructive',
      });
      return false;
    }
  };

  // Efeito para carregar APIs inicialmente
  useEffect(() => {
    if (user?.id) {
      console.log('User ID changed:', user.id); // Debug log
      const hasCachedData = loadFromCache();
      if (!hasCachedData) {
        console.log('No cached data, fetching from server...'); // Debug log
        fetchApis();
      } else {
        // Atualizar em background após usar cache
        fetchApis().then(() => {
          console.log('Data updated in background');
        });
      }
    } else {
      console.log('No user ID available, clearing data'); // Debug log
      setApis([]);
      clearCache();
    }
  }, [user?.id]);

  return {
    apis,
    loading,
    error,
    addApi,
    updateApi,
    deleteApi,
    refreshApis: () => {
      clearCache();
      return fetchApis();
    },
  };
}; 