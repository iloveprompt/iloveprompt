import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type LlmSystemMessage = Database['public']['Tables']['llm_system_messages']['Row'];
export type NewLlmSystemMessage = Database['public']['Tables']['llm_system_messages']['Insert'];
export type UpdateLlmSystemMessage = Database['public']['Tables']['llm_system_messages']['Update'];

/**
 * Fetches all LLM system messages.
 * Requires admin privileges defined in RLS policies.
 * @returns A promise that resolves to an array of LlmSystemMessage objects.
 */
export const getSystemMessages = async (): Promise<LlmSystemMessage[]> => {
  // Note: RLS policy should restrict this to admins.
  const { data, error } = await supabase
    .from('llm_system_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching system messages:', error);
    throw error; // Or handle appropriately based on admin context
  }

  return data || [];
};

/**
 * Fetches the currently active default LLM system message.
 * Accessible by all authenticated users.
 * @returns A promise that resolves to the default LlmSystemMessage object or null.
 */
export const getDefaultSystemMessage = async (): Promise<LlmSystemMessage | null> => {
  const { data, error } = await supabase
    .from('llm_system_messages')
    .select('*')
    .eq('is_default', true)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore 'Row not found'
    console.error('Error fetching default system message:', error);
    throw error;
  }

  return data;
};


/**
 * Adds a new LLM system message.
 * Requires admin privileges.
 * @param messageData - The data for the new system message. Must include created_by_admin_id.
 * @returns A promise that resolves to the newly created LlmSystemMessage object.
 */
export const addSystemMessage = async (messageData: NewLlmSystemMessage): Promise<LlmSystemMessage> => {
  if (!messageData.content || !messageData.created_by_admin_id) {
     throw new Error('Content and creator admin ID are required.');
  }
  // Ensure is_default is explicitly set if needed, defaults to false in DB
  const dataToInsert = { ...messageData, is_default: messageData.is_default ?? false };


  const { data, error } = await supabase
    .from('llm_system_messages')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error adding system message:', error);
    throw error;
  }
   if (!data) {
     throw new Error('Failed to add system message, no data returned.');
  }

  // If this new message is set as default, ensure others are not default
  if (data.is_default) {
    await unsetOtherDefaults(data.id);
  }

  return data;
};

/**
 * Updates an existing LLM system message.
 * Requires admin privileges.
 * @param messageId - The ID of the message to update.
 * @param updates - An object containing the fields to update.
 * @returns A promise that resolves to the updated LlmSystemMessage object.
 */
export const updateSystemMessage = async (messageId: string, updates: UpdateLlmSystemMessage): Promise<LlmSystemMessage> => {
  if (!messageId) {
     throw new Error('System Message ID is required for update.');
  }
  // Prevent changing the creator
  const { created_by_admin_id, ...validUpdates } = updates;

  const { data, error } = await supabase
    .from('llm_system_messages')
    .update(validUpdates)
    .eq('id', messageId)
    .select()
    .single();

  if (error) {
    console.error('Error updating system message:', error);
    throw error;
  }
   if (!data) {
     throw new Error('Failed to update system message, no data returned.');
  }

  // If this message was set as default, ensure others are not default
  if (data.is_default) {
    await unsetOtherDefaults(data.id);
  }

  return data;
};

/**
 * Deletes an LLM system message.
 * Requires admin privileges.
 * @param messageId - The ID of the message to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteSystemMessage = async (messageId: string): Promise<void> => {
  if (!messageId) {
     throw new Error('System Message ID is required for deletion.');
  }

  // Optional: Check if it's the default message and prevent deletion or handle accordingly
  const message = await supabase.from('llm_system_messages').select('is_default').eq('id', messageId).single();
  if (message.data?.is_default) {
      throw new Error('Cannot delete the default system message. Set another message as default first.');
  }


  const { error } = await supabase
    .from('llm_system_messages')
    .delete()
    .eq('id', messageId);

  if (error) {
    console.error('Error deleting system message:', error);
    throw error;
  }
};

/**
 * Sets a specific system message as the default, deactivating all others.
 * Requires admin privileges.
 * @param messageIdToSetDefault - The ID of the message to set as default.
 * @returns A promise that resolves when the operation is complete.
 */
export const setDefaultSystemMessage = async (messageIdToSetDefault: string): Promise<void> => {
  if (!messageIdToSetDefault) {
     throw new Error('System Message ID is required to set default.');
  }

  // Step 1: Unset default flag for all other messages
  await unsetOtherDefaults(messageIdToSetDefault);

  // Step 2: Set the specified message as default
  const { error: activateError } = await supabase
    .from('llm_system_messages')
    .update({ is_default: true })
    .eq('id', messageIdToSetDefault);

  if (activateError) {
    console.error('Error setting system message as default:', activateError);
    throw activateError;
  }
};

/**
 * Helper function to set is_default = false for all messages except the given ID.
 */
const unsetOtherDefaults = async (excludeMessageId: string): Promise<void> => {
  const { error } = await supabase
    .from('llm_system_messages')
    .update({ is_default: false })
    .neq('id', excludeMessageId)
    .eq('is_default', true); // Only update those that are currently true

  if (error) {
    console.error('Error unsetting other default system messages:', error);
    // Decide if this error should halt the main operation
    throw error;
  }
};
