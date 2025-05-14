
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { UserLlmApi, getActiveApiKey, updateUserApiKey, ApiTestStatus, LlmProvider } from './userSettingService';
import { LlmSystemMessage, getDefaultSystemMessage } from './adminSettingService';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from "@/hooks/use-toast";

interface TestConnectionResult {
  success: boolean;
  error?: string;
  status?: ApiTestStatus;
}

/**
 * Tests the connection for a given API key configuration.
 * Updates the key's status in the database.
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
        try {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content: 'This is a test.' }],
              max_tokens: 5
            }),
          });
          
          if (res.ok) {
            result = { success: true, status: 'success' };
          } else {
            const errorData = await res.json();
            result = { success: false, error: `OpenAI API Error: ${errorData.error?.message || res.statusText}`, status: 'failure' };
          }
        } catch (error: any) {
          result = { success: false, error: `OpenAI connection error: ${error.message}`, status: 'failure' };
        }
        break;
        
      case 'gemini':
        try {
          // Test via edge function instead of direct SDK for consistency
          const res = await fetch('https://lmovpaablzagtkedhbtb.functions.supabase.co/gemini', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Origin': window.location.origin
            },
            body: JSON.stringify({ 
              prompt: "This is a test message to verify the API connection.",
              model: "gemini-1.5-flash"
            })
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.error) {
              result = { success: false, error: `Gemini API Error: ${data.error}`, status: 'failure' };
            } else {
              result = { success: true, status: 'success' };
            }
          } else {
            result = { success: false, error: `Gemini API Error: ${res.statusText}`, status: 'failure' };
          }
        } catch (error: any) {
          result = { success: false, error: `Gemini connection error: ${error.message}`, status: 'failure' };
        }
        break;
        
      case 'groq':
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama3-8b-8192',
              messages: [{ role: 'user', content: 'This is a test.' }],
              max_tokens: 5
            }),
          });
          
          if (res.ok) {
            result = { success: true, status: 'success' };
          } else {
            const errorData = await res.json();
            result = { success: false, error: `Groq API Error: ${errorData.error?.message || res.statusText}`, status: 'failure' };
          }
        } catch (error: any) {
          result = { success: false, error: `Groq connection error: ${error.message}`, status: 'failure' };
        }
        break;
        
      case 'deepseek':
        try {
          const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: [{ role: 'user', content: 'This is a test.' }],
              max_tokens: 5
            }),
          });
          
          if (res.ok) {
            result = { success: true, status: 'success' };
          } else {
            const errorData = await res.json();
            result = { success: false, error: `DeepSeek API Error: ${errorData.error?.message || res.statusText}`, status: 'failure' };
          }
        } catch (error: any) {
          result = { success: false, error: `DeepSeek connection error: ${error.message}`, status: 'failure' };
        }
        break;
        
      default:
        result = { success: false, error: `Provedor não suportado: ${provider}`, status: 'failure' };
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
  }

  return result;
};

// API call implementations
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
    return await callOpenAI(key, payload, 'https://api.deepseek.com/v1/chat/completions');
  } catch (error: any) {
    console.error("DeepSeek API call failed:", error);
    throw new Error(`Falha na comunicação com DeepSeek: ${error.message}`);
  }
};

// Updated Gemini API call with better error handling
const callGemini = async (key: string, payload: any) => {
  try {
    // Use edge function for Gemini calls
    console.log("Chamando Gemini via edge function...");
    
    const res = await fetch('https://lmovpaablzagtkedhbtb.functions.supabase.co/gemini', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({ 
        prompt: payload.messages?.find((msg: any) => msg.role === 'user')?.content || '',
        model: 'gemini-1.5-flash'
      })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Erro na resposta da edge function:", errorText);
      throw new Error(`Erro na comunicação com Gemini: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    if (data.error) {
      console.error("Erro retornado pela edge function:", data.error);
      throw new Error(data.error);
    }
    
    console.log("Resposta recebida via edge function");
    return data.result;
  } catch (error: any) {
    console.error("Gemini API via edge function failed:", error);
    toast({
      title: "Erro ao chamar Gemini API",
      description: `${error.message || 'Erro desconhecido'}. Tente novamente mais tarde.`,
      variant: "destructive"
    });
    throw new Error(`Falha na comunicação com Gemini: ${error.message || 'Erro desconhecido'}`);
  }
};

/**
 * Enhances a given prompt using the user's active LLM API configuration.
 */
export const enhancePrompt = async (prompt: string, userId: string): Promise<string> => {
  try {
    const activeApiKey = await getActiveApiKey(userId);
    if (!activeApiKey) {
      throw new Error('Nenhuma chave de API ativa encontrada para o usuário.');
    }
    
    console.log(`Usando provedor: ${activeApiKey.provider}`);
    
    const systemMessage = await getDefaultSystemMessage();
    let systemContent = systemMessage?.content || 'Você é um assistente especializado em Desenvolvimento de Software.';
    
    // Adjust system message to include specialized assistant phrasing
    if (!systemContent.includes('especializado em Desenvolvimento de Software')) {
      systemContent = 'Você é um assistente especializado em Desenvolvimento de Software. ' + systemContent;
    }
    
    const provider = activeApiKey.provider;
    const key = activeApiKey.api_key;
    
    // Construindo o prompt para diferentes provedores
    let result = '';
    try {
      switch (provider) {
        case 'openai':
          const openaiPayload = {
            model: activeApiKey.models?.[0] || getDefaultModelForProvider(provider),
            messages: [
              { role: 'system', content: systemContent },
              { role: 'user', content: prompt }
            ],
          };
          result = await callOpenAI(key, openaiPayload);
          break;
        case 'gemini':
          const geminiPayload = {
            model: 'gemini-1.5-flash',
            messages: [
              { role: 'system', content: systemContent },
              { role: 'user', content: prompt }
            ],
          };
          result = await callGemini(key, geminiPayload);
          break;
        case 'groq':
          const groqPayload = {
            model: activeApiKey.models?.[0] || getDefaultModelForProvider(provider),
            messages: [
              { role: 'system', content: systemContent },
              { role: 'user', content: prompt }
            ],
          };
          result = await callGroq(key, groqPayload);
          break;
        case 'deepseek':
          const deepseekPayload = {
            model: activeApiKey.models?.[0] || getDefaultModelForProvider(provider),
            messages: [
              { role: 'system', content: systemContent },
              { role: 'user', content: prompt }
            ],
          };
          result = await callDeepSeek(key, deepseekPayload);
          break;
        default:
          throw new Error(`Provedor não suportado: ${provider}`);
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
 * Generates a diagram based on prompt data using the user's active LLM.
 */
export const generateDiagram = async (promptData: any, userId: string): Promise<string> => {
  try {
    const activeApiKey = await getActiveApiKey(userId);
    if (!activeApiKey) {
      throw new Error('Nenhuma chave de API ativa encontrada para o usuário.');
    }
    const systemMessage = await getDefaultSystemMessage();
    const systemContent = systemMessage?.content || 'Você é um assistente especializado em criar diagramas.';
    const provider = activeApiKey.provider;
    const key = activeApiKey.api_key;
    const diagramPrompt = `Com base nos seguintes dados do projeto, gere um diagrama de fluxo utilizando sintaxe Mermaid:\n\n${JSON.stringify(promptData, null, 2)}\n\nForneça apenas a sintaxe Mermaid em um único bloco de código.`;
    
    let result = '';
    try {
      switch (provider) {
        case 'openai':
          const openaiPayload = {
            model: activeApiKey.models?.[0] || getDefaultModelForProvider(provider),
            messages: [
              { role: 'system', content: systemContent },
              { role: 'user', content: diagramPrompt }
            ],
          };
          result = await callOpenAI(key, openaiPayload);
          break;
        case 'gemini':
          const geminiPayload = {
            model: 'gemini-1.5-flash',
            messages: [
              { role: 'system', content: systemContent },
              { role: 'user', content: diagramPrompt }
            ],
          };
          result = await callGemini(key, geminiPayload);
          break;
        case 'groq':
          const groqPayload = {
            model: activeApiKey.models?.[0] || getDefaultModelForProvider(provider),
            messages: [
              { role: 'system', content: systemContent },
              { role: 'user', content: diagramPrompt }
            ],
          };
          result = await callGroq(key, groqPayload);
          break;
        case 'deepseek':
          const deepseekPayload = {
            model: activeApiKey.models?.[0] || getDefaultModelForProvider(provider),
            messages: [
              { role: 'system', content: systemContent },
              { role: 'user', content: diagramPrompt }
            ],
          };
          result = await callDeepSeek(key, deepseekPayload);
          break;
        default:
          throw new Error(`Provedor não suportado para geração de diagrama: ${provider}`);
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
        case 'openai': return 'gpt-4o-mini';
        case 'gemini': return 'gemini-1.5-flash';
        case 'groq': return 'llama3-8b-8192';
        case 'deepseek': return 'deepseek-chat';
        default: return 'default-model';
    }
};
