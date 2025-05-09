
import { supabase } from '@/lib/supabase';

interface PromptData {
  user_id: string;
  title: string;
  content: string;
  wizard_data: any;
  created_at: Date;
  updated_at: Date;
}

export const savePromptToDatabase = async (promptData: PromptData) => {
  const { data, error } = await supabase
    .from('prompts')
    .insert([
      {
        user_id: promptData.user_id,
        title: promptData.title,
        content: promptData.content,
        wizard_data: promptData.wizard_data,
        created_at: promptData.created_at.toISOString(),
        updated_at: promptData.updated_at.toISOString(),
      }
    ]);

  if (error) {
    console.error('Erro ao salvar prompt:', error);
    throw error;
  }

  return data;
};

export const getUserPrompts = async (userId: string) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar prompts:', error);
    throw error;
  }

  return data;
};

export const getPromptById = async (promptId: string) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', promptId)
    .single();

  if (error) {
    console.error('Erro ao buscar prompt:', error);
    throw error;
  }

  return data;
};

export const deletePrompt = async (promptId: string) => {
  const { data, error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', promptId);

  if (error) {
    console.error('Erro ao excluir prompt:', error);
    throw error;
  }

  return data;
};
