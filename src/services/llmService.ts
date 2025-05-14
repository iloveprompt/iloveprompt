import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { UserLlmApi, getActiveApiKey, updateUserApiKey, ApiTestStatus, LlmProvider } from './userSettingService';
import { LlmSystemMessage, getDefaultSystemMessage } from './adminSettingService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Placeholder for actual API interaction libraries/SDKs
// import { OpenAI } from 'openai'; // Example
// import { GoogleGenerativeAI } from '@google/generative-ai'; // Example

interface TestConnectionResult {
  success: boolean;
  error?: string;
  status?: ApiTestStatus; // The status to update in the DB
}

/**
 * Tests the connection for a given API key configuration.
 * Updates the key's status in the database.
 * @param apiKey - The UserLlmApi object to test.
 * @returns A promise resolving to TestConnectionResult.
 */
export const testConnection = async (apiKey: UserLlmApi): Promise<TestConnectionResult> => {
  if (!apiKey || !apiKey.api_key || !apiKey.provider) {
    return { success: false, error: 'API key data is missing.', status: 'failure' };
  }

  let result: TestConnectionResult = { success: false, status: 'failure' };
  const provider = apiKey.provider;
  const key = apiKey.api_key;

  try {
    console.log(`Testing connection for provider: ${provider}`);
    switch (provider) {
      case 'openai':
        // TODO: Implement OpenAI connection test (e.g., list models)
        // Example: const openai = new OpenAI({ apiKey: key }); await openai.models.list();
        console.warn(`OpenAI test not implemented yet.`);
        result = { success: true, status: 'success' }; // Placeholder
        break;
      case 'gemini':
        // TODO: Implement Gemini connection test
        // Example: const genAI = new GoogleGenerativeAI(key); await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent("test");
         console.warn(`Gemini test not implemented yet.`);
        result = { success: true, status: 'success' }; // Placeholder
        break;
      case 'groq':
        // TODO: Implement Groq connection test (often OpenAI compatible API)
         console.warn(`Groq test not implemented yet.`);
        result = { success: true, status: 'success' }; // Placeholder
        break;
      case 'deepseek':
        // TODO: Implement DeepSeek connection test (often OpenAI compatible API)
         console.warn(`DeepSeek test not implemented yet.`);
        result = { success: true, status: 'success' }; // Placeholder
        break;
      default:
        result = { success: false, error: `Unsupported provider: ${provider}`, status: 'failure' };
    }
  } catch (error: any) {
    console.error(`Connection test failed for ${provider}:`, error);
    result = { success: false, error: error.message || 'Unknown error during connection test.', status: 'failure' };
  }

  // Update the status in the database
  try {
    await updateUserApiKey(apiKey.id, {
      test_status: result.status,
      last_tested_at: new Date().toISOString(),
    });
  } catch (updateError) {
    console.error(`Failed to update API key status for ${apiKey.id}:`, updateError);
    // Decide how to handle this - the test might have succeeded but the update failed.
    // Maybe return the original test result but log the update error.
  }


  return result;
};

const callOpenAI = async (key: string, payload: any, endpoint = 'https://api.openai.com/v1/chat/completions') => {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
};

const callGroq = async (key: string, payload: any) => callOpenAI(key, payload, 'https://api.groq.com/openai/v1/chat/completions');
const callDeepSeek = async (key: string, payload: any) => callOpenAI(key, payload, 'https://api.deepseek.com/openai/v1/chat/completions');
// Gemini: endpoint e payload podem variar, aqui é um exemplo simplificado
const callGemini = async (key: string, payload: any) => {
  // Ignora o parâmetro key, pois a autenticação é feita no backend edge
  try {
    const res = await fetch('https://lmovpaablzagtkedhbtb.functions.supabase.co/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: payload.messages?.[1]?.content || '', model: payload.model || 'gemini-pro' })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.result;
  } catch (error: any) {
    throw new Error(error?.message || 'Erro ao chamar Gemini via Edge Function');
  }
};

/**
 * Enhances a given prompt using the user's active LLM API configuration.
 * @param prompt - The original prompt text.
 * @param userId - The ID of the user requesting the enhancement.
 * @returns A promise resolving to the enhanced prompt string or throws an error.
 */
export const enhancePrompt = async (prompt: string, userId: string): Promise<string> => {
  const activeApiKey = await getActiveApiKey(userId);
  if (!activeApiKey) {
    throw new Error('No active API key found for the user.');
  }
  const systemMessage = await getDefaultSystemMessage();
  const systemContent = systemMessage?.content || 'You are a helpful assistant.';
  const provider = activeApiKey.provider;
  const key = activeApiKey.api_key;
  const requestPayload = {
    model: activeApiKey.models?.[0] || getDefaultModelForProvider(provider),
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: `Enhance the following prompt:\n\n${prompt}` }
    ],
  };
  switch (provider) {
    case 'openai':
      return await callOpenAI(key, requestPayload);
    case 'gemini':
      return await callGemini(key, requestPayload);
    case 'groq':
      return await callGroq(key, requestPayload);
    case 'deepseek':
      return await callDeepSeek(key, requestPayload);
    default:
      throw new Error(`Unsupported provider for enhancement: ${provider}`);
  }
};

/**
 * Generates a diagram (e.g., Mermaid syntax) based on prompt data using the user's active LLM.
 * @param promptData - The structured data from the wizard.
 * @param userId - The ID of the user.
 * @returns A promise resolving to the diagram syntax string or throws an error.
 */
export const generateDiagram = async (promptData: any, userId: string): Promise<string> => {
  const activeApiKey = await getActiveApiKey(userId);
  if (!activeApiKey) {
    throw new Error('No active API key found for the user.');
  }
  const systemMessage = await getDefaultSystemMessage();
  const systemContent = systemMessage?.content || 'You are a helpful assistant specialized in creating diagrams.';
  const provider = activeApiKey.provider;
  const key = activeApiKey.api_key;
  const diagramPrompt = `Based on the following project data, generate a Mermaid flowchart diagram:\n\n${JSON.stringify(promptData, null, 2)}\n\nOutput only the Mermaid syntax within a single code block.`;
  const requestPayload = {
    model: activeApiKey.models?.[0] || getDefaultModelForProvider(provider),
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: diagramPrompt }
    ],
  };
  switch (provider) {
    case 'openai':
      return await callOpenAI(key, requestPayload);
    case 'gemini':
      return await callGemini(key, requestPayload);
    case 'groq':
      return await callGroq(key, requestPayload);
    case 'deepseek':
      return await callDeepSeek(key, requestPayload);
    default:
      throw new Error(`Unsupported provider for diagram generation: ${provider}`);
  }
};

// Helper function to get a default model if none is specified
const getDefaultModelForProvider = (provider: LlmProvider): string => {
    switch (provider) {
        case 'openai': return 'gpt-3.5-turbo'; // Or latest suitable default
        case 'gemini': return 'gemini-pro';
        case 'groq': return 'llama3-8b-8192'; // Example, check Groq for current defaults
        case 'deepseek': return 'deepseek-chat'; // Example, check DeepSeek docs
        default: return 'default-model'; // Should not happen with enum
    }
};

// TODO: Implement actual API call logic using fetch or SDKs
// TODO: Implement helper function `extractMermaidSyntax` if needed
