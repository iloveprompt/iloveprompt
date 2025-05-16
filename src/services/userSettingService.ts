import { supabase } from '@/integrations/supabase/client'; // Assuming client is correctly configured
import { Database } from '@/integrations/supabase/types'; // Assuming types are generated

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
export const getUserApiKeys = async (userId: string): Promise<UserLlmApi[]> => {
  if (!userId) {
    console.error('User ID is required to fetch API keys.');
    return [];
  }
  if (isFetchingUserApiKeys) {
    // Proteção definitiva: nunca faz concorrência
    return [];
  }
  isFetchingUserApiKeys = true;
  try {
    const { data, error } = await supabase
      .from('user_llm_apis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

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
  if (!apiKeyData.user_id || !apiKeyData.provider || !apiKeyData.api_key) {
    throw new Error('User ID, provider, and API key are required.');
  }

  const { data, error } = await supabase
    .from('user_llm_apis')
    .insert(apiKeyData)
    .select()
    .single(); // Return the newly created row

  if (error) {
    console.error('Error adding user API key:', error);
    throw error;
  }
  if (!data) {
     throw new Error('Failed to add API key, no data returned.');
  }

  return data;
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
