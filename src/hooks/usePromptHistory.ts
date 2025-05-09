
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserPrompts, deletePrompt } from '@/services/promptService';

export const usePromptHistory = () => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadPrompts = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const userPrompts = await getUserPrompts(user.id);
      setPrompts(userPrompts || []);
    } catch (err) {
      console.error('Erro ao carregar prompts:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const handleDeletePrompt = async (promptId: string) => {
    try {
      await deletePrompt(promptId);
      // Atualizar a lista após excluir
      setPrompts(prompts.filter(p => p.id !== promptId));
      return true;
    } catch (err) {
      console.error('Erro ao excluir prompt:', err);
      setError(err as Error);
      return false;
    }
  };

  return {
    prompts,
    isLoading,
    error,
    refreshPrompts: loadPrompts,
    deletePrompt: handleDeletePrompt,
  };
};
