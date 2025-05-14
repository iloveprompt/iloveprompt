
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { UserLlmApi, getActiveApiKey, updateUserApiKey, ApiTestStatus, LlmProvider } from './userSettingService';
import { LlmSystemMessage, getDefaultSystemMessage } from './adminSettingService';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from "@/hooks/use-toast";

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
        // Initialize the Gemini model directly
        try {
          const genAI = new GoogleGenerativeAI(key);
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });
          const prompt = "Hello, this is a test prompt to verify the API connection.";
          // Generate a very short response to minimize usage
          const response = await model.generateContent(prompt);
          const text = await response.response.text();
          if (text) {
            result = { success: true, status: 'success' };
          } else {
            result = { success: false, error: 'No response from Gemini API', status: 'failure' };
          }
        } catch (error: any) {
          console.error('Gemini API test error:', error);
          result = { 
            success: false, 
            error: error.message || 'Failed to connect to Gemini API', 
            status: 'failure' 
          };
        }
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

// Modified API calls with better error handling
const callOpenAI = async (key: string, payload: any, endpoint = 'https://api.openai.com/v1/chat/completions') => {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenAI API error: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error: any) {
    console.error("OpenAI API call failed:", error);
    throw new Error(`Falha na comunicação com OpenAI: ${error.message}`);
  }
};

const callGroq = async (key: string, payload: any) => {
  try {
    return await callOpenAI(key, payload, 'https://api.groq.com/openai/v1/chat/completions');
  } catch (error: any) {
    console.error("Groq API call failed:", error);
    throw new Error(`Falha na comunicação com Groq: ${error.message}`);
  }
};

const callDeepSeek = async (key: string, payload: any) => {
  try {
    return await callOpenAI(key, payload, 'https://api.deepseek.com/openai/v1/chat/completions');
  } catch (error: any) {
    console.error("DeepSeek API call failed:", error);
    throw new Error(`Falha na comunicação com DeepSeek: ${error.message}`);
  }
};

// Updated Gemini API call with direct SDK usage and fallback to edge function
const callGemini = async (key: string, payload: any) => {
  try {
    // First try using the direct SDK approach
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: payload.model || "gemini-pro" });
      
      // Extract the prompt from the payload
      const promptContent = payload.messages?.find((msg: any) => msg.role === 'user')?.content || '';
      
      if (!promptContent) {
        throw new Error('No prompt content found in payload');
      }
      
      const result = await model.generateContent(promptContent);
      return result.response.text();
    } catch (directError: any) {
      console.warn("Direct Gemini API call failed, falling back to edge function:", directError);
      
      // Fallback to using the edge function
      const res = await fetch('https://lmovpaablzagtkedhbtb.functions.supabase.co/gemini', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({ 
          prompt: payload.messages?.[1]?.content || '', 
          model: payload.model || 'gemini-pro' 
        })
      });
      
      if (!res.ok) {
        throw new Error(await res.text());
      }
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data.result;
    }
  } catch (error: any) {
    console.error("All Gemini API approaches failed:", error);
    throw new Error(`Falha na comunicação com Gemini: ${error.message || 'Erro desconhecido'}`);
  }
};

/**
 * Enhances a given prompt using the user's active LLM API configuration.
 * @param prompt - The original prompt text.
 * @param userId - The ID of the user requesting the enhancement.
 * @returns A promise resolving to the enhanced prompt string or throws an error.
 */
export const enhancePrompt = async (prompt: string, userId: string): Promise<string> => {
  try {
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
    
    let result = '';
    try {
      switch (provider) {
        case 'openai':
          result = await callOpenAI(key, requestPayload);
          break;
        case 'gemini':
          result = await callGemini(key, requestPayload);
          break;
        case 'groq':
          result = await callGroq(key, requestPayload);
          break;
        case 'deepseek':
          result = await callDeepSeek(key, requestPayload);
          break;
        default:
          throw new Error(`Unsupported provider for enhancement: ${provider}`);
      }
      return result;
    } catch (error: any) {
      console.error(`Error while calling ${provider} API:`, error);
      toast({
        title: "Erro no serviço de IA",
        description: `${error.message || 'Erro desconhecido ao chamar serviço de IA'}`,
        variant: "destructive"
      });
      throw error;
    }
  } catch (error: any) {
    console.error("Enhance prompt error:", error);
    throw new Error(error.message || 'Erro ao processar prompt');
  }
};

/**
 * Generates a diagram (e.g., Mermaid syntax) based on prompt data using the user's active LLM.
 * @param promptData - The structured data from the wizard.
 * @param userId - The ID of the user.
 * @returns A promise resolving to the diagram syntax string or throws an error.
 */
export const generateDiagram = async (promptData: any, userId: string): Promise<string> => {
  try {
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
    
    let result = '';
    try {
      switch (provider) {
        case 'openai':
          result = await callOpenAI(key, requestPayload);
          break;
        case 'gemini':
          result = await callGemini(key, requestPayload);
          break;
        case 'groq':
          result = await callGroq(key, requestPayload);
          break;
        case 'deepseek':
          result = await callDeepSeek(key, requestPayload);
          break;
        default:
          throw new Error(`Unsupported provider for diagram generation: ${provider}`);
      }
      return result;
    } catch (error: any) {
      console.error(`Error while calling ${provider} API for diagram generation:`, error);
      toast({
        title: "Erro na geração do diagrama",
        description: `${error.message || 'Erro desconhecido ao gerar diagrama'}`,
        variant: "destructive"
      });
      throw error;
    }
  } catch (error: any) {
    console.error("Generate diagram error:", error);
    throw new Error(error.message || 'Erro ao gerar diagrama');
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
