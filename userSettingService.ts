import { supabase } from '../lib/supabase';

type LlmProvider = 'openai' | 'gemini' | 'groq' | 'deepseek';

export const addUserApiKey = async (data: {
  provider: string;
  model: string;
  key: string;
  user_id: string;
}) => {
  try {
    // Verificar se o usuário está autenticado
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('Usuário não autenticado');
    }

    // Validar o provider
    const provider = data.provider.toLowerCase() as LlmProvider;
    if (!['openai', 'gemini', 'groq', 'deepseek'].includes(provider)) {
      throw new Error('Provider inválido');
    }

    const formattedData = {
      provider: provider,
      api_key: data.key,
      user_id: data.user_id,
      models: [data.model],
      is_active: true,
      test_status: 'untested',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_tested_at: null
    };

    // Usar o token de autenticação da sessão
    const { data: result, error } = await supabase
      .from('user_llm_apis')
      .insert(formattedData)
      .select()
      .single();  // Adicionando single() para retornar apenas um registro

    if (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
    
    return result;
  } catch (error) {
    console.error('Error adding user API key:', error);
    throw error;
  }
}; 