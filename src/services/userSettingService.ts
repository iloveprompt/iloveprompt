import { supabase } from '@/lib/supabase';
import { Database } from '@/integrations/supabase/types';
import { z } from 'zod';

export type UserLlmApi = Database['public']['Tables']['user_llm_apis']['Row'];
export type NewUserLlmApi = Database['public']['Tables']['user_llm_apis']['Insert'];
export type UpdateUserLlmApi = Database['public']['Tables']['user_llm_apis']['Update'];
export type LlmProvider = Database['public']['Enums']['llm_provider'];
export type ApiTestStatus = Database['public']['Enums']['api_test_status'];

let isFetchingUserApiKeys = false;

/**
 * Fetches all LLM API keys for a given user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of UserLlmApi objects.
 */
// Gera hash para validação do cache
const generateCacheHash = (data: UserLlmApi[]) => {
  return data.reduce((acc, curr) => acc + curr.updated_at, '');
};

// Schema para validação do cache local
type SanitizedLlmApi = {
  id: string;
  user_id: string;
  provider: LlmProvider;
  api_key: string;
  is_active: boolean;
  test_status: ApiTestStatus;
  models: string[];
  last_tested_at: string | null;
  created_at: string;
  updated_at: string;
};

const llmApiSchema = z.array(
  z.object({
    id: z.string().min(1),
    user_id: z.string().uuid(),
    provider: z.enum(['openai', 'gemini', 'groq', 'deepseek', 'grok']),
    api_key: z.string().min(1),
    is_active: z.boolean(),
    test_status: z.enum(['untested', 'success', 'failure']),
    models: z.array(z.string()).default([]),
    last_tested_at: z.string().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
  }).transform((api): SanitizedLlmApi => ({
    id: api.id,
    user_id: api.user_id,
    provider: api.provider as LlmProvider,
    api_key: '••••••' + api.api_key.slice(-4),
    is_active: api.is_active,
    test_status: api.test_status as ApiTestStatus,
    models: api.models || [],
    last_tested_at: api.last_tested_at,
    created_at: api.created_at,
    updated_at: api.updated_at
  }))
);

export const getUserApiKeys = async (userId: string): Promise<UserLlmApi[]> => {
  if (!userId) return [];
  
  const cacheKey = `llm_apis_${userId}`;
  
  // Verificar cache local com validação de schema
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      const result = llmApiSchema.safeParse(parsed.data);
      
      if (result.success && parsed.hash === generateCacheHash(result.data)) {
        return result.data.map(api => ({
          ...api,
          api_key: '', // Não armazenar a chave real no cache
          models: api.models || []
        }));
      }
    }
  } catch (e) {
    console.warn('Cache inválido, renovando...');
  }

  if (isFetchingUserApiKeys) return [];
  isFetchingUserApiKeys = true;
  
  try {
    const { data, error } = await supabase
      .from('user_llm_apis')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (error) {
      if (
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('ERR_INSUFFICIENT_RESOURCES')
      ) {
        console.error('Erro de rede ao buscar user_llm_apis:', error);
        return [];
      }
      console.error('Error fetching user API keys:', error);
      return [];
    }
    return data || [];
  } catch (err: any) {
    if (
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('ERR_INSUFFICIENT_RESOURCES')
    ) {
      console.error('Erro de rede ao buscar user_llm_apis:', err);
      return [];
    }
    console.error('Erro inesperado ao buscar user_llm_apis:', err);
    return [];
  } finally {
    isFetchingUserApiKeys = false;
  }
};

/**
 * Adds a new LLM API key for a user.
 * @param apiKeyData - The data for the new API key.
 * @returns A promise that resolves to the newly created UserLlmApi object.
 */
export const addUserApiKey = async (apiKeyData: NewUserLlmApi): Promise<UserLlmApi> => {
  console.log('1. Iniciando addUserApiKey com dados:', {
    ...apiKeyData,
    api_key: '***' + apiKeyData.api_key.slice(-4),
    user_id: apiKeyData.user_id,
    provider: apiKeyData.provider,
    models: apiKeyData.models
  });

  if (!apiKeyData.user_id || !apiKeyData.provider || !apiKeyData.api_key) {
    console.error('2. Dados inválidos:', { 
      hasUserId: !!apiKeyData.user_id, 
      hasProvider: !!apiKeyData.provider, 
      hasApiKey: !!apiKeyData.api_key,
      userId: apiKeyData.user_id,
      provider: apiKeyData.provider
    });
    throw new Error('User ID, provider, and API key are required.');
  }

  // Debug da sessão
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('3. Debug - Estado da sessão:', {
    hasSession: !!session,
    hasAccessToken: !!session?.access_token,
    userId: session?.user?.id,
    expiresAt: session?.expires_at,
    sessionError: sessionError?.message
  });

  if (!session || !session.access_token) {
    console.error('4. Erro de autenticação:', {
      hasSession: !!session,
      hasAccessToken: !!session?.access_token,
      sessionError: sessionError?.message
    });
    throw new Error('Sessão inválida ou expirada. Por favor, faça login novamente.');
  }

  try {
    console.log('5. Tentando inserir na tabela user_llm_apis:', {
      table: 'user_llm_apis',
      data: {
        ...apiKeyData,
        api_key: '***' + apiKeyData.api_key.slice(-4)
      }
    });

    // Primeiro verifica se já existe uma chave ativa para este usuário
    const { data: existingKeys, error: existingKeysError } = await supabase
      .from('user_llm_apis')
      .select('*')
      .eq('user_id', apiKeyData.user_id)
      .eq('is_active', true);

    if (existingKeysError) {
      console.error('6. Erro ao verificar chaves existentes:', existingKeysError);
      throw existingKeysError;
    }

    // Se não existir nenhuma chave ativa, esta será ativa por padrão
    const shouldBeActive = !existingKeys || existingKeys.length === 0;

    // Insere a nova chave
    const { data, error } = await supabase
      .from('user_llm_apis')
      .insert({
        ...apiKeyData,
        is_active: shouldBeActive,
        test_status: 'untested',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.error('7. Erro ao inserir:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    if (!data) {
      console.error('8. Nenhum dado retornado após inserção');
      throw new Error('Falha ao adicionar chave API, nenhum dado retornado.');
    }

    console.log('9. Inserção bem-sucedida:', {
      id: data.id,
      user_id: data.user_id,
      provider: data.provider,
      created_at: data.created_at,
      is_active: data.is_active
    });

    return data;
  } catch (err: any) {
    console.error('10. Erro não tratado em addUserApiKey:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      cause: err.cause
    });
    throw err;
  }
};

/**
 * Updates an existing LLM API key.
 * @param apiKeyId - The ID of the API key to update.
 * @param updates - An object containing the fields to update.
 * @returns A promise that resolves to the updated UserLlmApi object.
 */
export const updateUserApiKey = async (apiKeyId: string, updates: UpdateUserLlmApi): Promise<UserLlmApi> => {
   if (!apiKeyId) {
    throw new Error('API Key ID is required for update.');
  }
  // Ensure user_id is not accidentally updated
  const { user_id, ...validUpdates } = updates;

  const { data, error } = await supabase
    .from('user_llm_apis')
    .update(validUpdates)
    .eq('id', apiKeyId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating user API key:', error);
    throw error;
  }
   if (!data) {
     throw new Error('Failed to update API key, no data returned.');
  }

  return data;
};

/**
 * Deletes an LLM API key.
 * @param apiKeyId - The ID of the API key to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteUserApiKey = async (apiKeyId: string): Promise<void> => {
   if (!apiKeyId) {
    throw new Error('API Key ID is required for deletion.');
  }

  const { error } = await supabase
    .from('user_llm_apis')
    .delete()
    .eq('id', apiKeyId);

  if (error) {
    console.error('Error deleting user API key:', error);
    throw error;
  }
};

/**
 * Sets a specific API key as active for the user, deactivating all others.
 * @param userId - The ID of the user.
 * @param apiKeyIdToActivate - The ID of the API key to activate.
 * @returns A promise that resolves when the operation is complete.
 */
export const setActiveApiKey = async (userId: string, apiKeyIdToActivate: string): Promise<void> => {
  if (!userId || !apiKeyIdToActivate) {
    throw new Error('User ID and API Key ID are required to set active API.');
  }

  // Use Supabase transaction or RPC function for atomicity if possible
  // For simplicity here, we do it in two steps, which might have race conditions
  // in high-concurrency scenarios. A database function would be safer.

  // Step 1: Deactivate all other keys for the user
  const { error: deactivateError } = await supabase
    .from('user_llm_apis')
    .update({ is_active: false })
    .eq('user_id', userId)
    .neq('id', apiKeyIdToActivate); // Don't deactivate the one we are about to activate

  if (deactivateError) {
    console.error('Error deactivating other API keys:', deactivateError);
    throw deactivateError;
  }

  // Step 2: Activate the specified key
  const { error: activateError } = await supabase
    .from('user_llm_apis')
    .update({ is_active: true })
    .eq('user_id', userId)
    .eq('id', apiKeyIdToActivate);

  if (activateError) {
    console.error('Error activating the specified API key:', activateError);
    // Potentially rollback or handle the inconsistent state
    throw activateError;
  }
};

/**
 * Fetches the currently active API key for a user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to the active UserLlmApi object or null if none is active.
 */
export const getActiveApiKey = async (userId: string): Promise<UserLlmApi | null> => {
  if (!userId) {
    console.error('User ID is required to fetch the active API key.');
    return null;
  }

  const { data, error } = await supabase
    .from('user_llm_apis')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .limit(1) // Should only be one active, but limit just in case
    .single(); // Expecting zero or one result

  if (error && error.code !== 'PGRST116') { // PGRST116: Row not found, which is okay here
    console.error('Error fetching active API key:', error);
    throw error;
  }

  return data;
};
