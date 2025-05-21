import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { UserLlmApi, getActiveApiKey, updateUserApiKey, ApiTestStatus, LlmProvider } from './userSettingService';
import { LlmSystemMessage, getDefaultSystemMessage } from './adminSettingService';
import { toast } from "@/components/ui/use-toast";

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
  const { provider, api_key: key } = apiKey;

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
          // Test via edge function, enviando apiKey e model
          const resultData = await callEdgeFunction('gemini', {
            prompt: "This is a test message to verify the API connection.",
            apiKey: key,
            model: 'gemini-1.5-pro'
          });
          result = { success: true, status: 'success' };
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
        
      case 'grok':
        try {
          const res = await fetch('https://api.grok.x/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'grok-1',
              messages: [{ role: 'user', content: 'This is a test.' }],
              max_tokens: 5
            }),
          });
          
          if (res.ok) {
            result = { success: true, status: 'success' };
          } else {
            const errorData = await res.json();
            result = { success: false, error: `Grok API Error: ${errorData.error?.message || res.statusText}`, status: 'failure' };
          }
        } catch (error: any) {
          result = { success: false, error: `Grok connection error: ${error.message}`, status: 'failure' };
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

// Função para chamar as edge functions
const callEdgeFunction = async (functionName: string, payload: any) => {
  try {
    console.log(`[DEBUG] Chamando edge function '${functionName}' com payload:`, payload);
    
    const response = await supabase.functions.invoke(functionName, {
      body: {
        ...payload,
        apiKey: payload.apiKey // Enviar a chave no body, não no header
      }
    });
    
    console.log(`[DEBUG] Resposta da edge function '${functionName}':`, response);
    
    if (response.error) {
      console.error(`[ERRO] Edge function '${functionName}':`, response.error);
      toast({
        description: `[ERRO] Edge function '${functionName}': ${response.error.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
      throw new Error(response.error.message || `Erro ao chamar ${functionName}`);
    }
    
    if (!response.data) {
      toast({
        description: `[ERRO] Edge function '${functionName}': Resposta vazia da função.`,
        variant: "destructive"
      });
      throw new Error('Resposta vazia da edge function');
    }
    
    return response.data.result || response.data;
  } catch (error: any) {
    console.error(`[ERRO] Falha ao chamar edge function '${functionName}':`, error);
    let errorMessage = 'Erro ao comunicar com o serviço de IA.';
    if (error.message?.includes('non-2xx status code') || error.message?.includes('401')) {
      errorMessage = 'Erro de autenticação. Verifique se sua chave de API está configurada corretamente.';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Tempo limite excedido. O serviço de IA não respondeu a tempo.';
    } else if (error.message?.includes('API key')) {
      errorMessage = 'Chave de API inválida ou não configurada para este serviço.';
    }
    toast({
      description: errorMessage,
      variant: "destructive"
    });
    throw new Error(errorMessage);
  }
};

/**
 * Enhances a given prompt using the user's active LLM API configuration.
 */
export const enhancePrompt = async (prompt: string, userId: string): Promise<string> => {
  try {
    const activeApiKey = await getActiveApiKey(userId);
    if (!activeApiKey) {
      const errorMsg = 'Nenhuma chave de API ativa encontrada. Configure uma chave de API nas configurações.';
      toast({
        description: errorMsg,
        variant: "destructive"
      });
      throw new Error(errorMsg);
    }

    // Validar a chave de API
    if (!activeApiKey.api_key || activeApiKey.api_key.trim() === '') {
      const errorMsg = 'Chave de API inválida. Por favor, reconfigure sua chave de API.';
      toast({
        description: errorMsg,
        variant: "destructive"
      });
      throw new Error(errorMsg);
    }

    // Usar a API correta do usuário
    const provider = activeApiKey.provider;
    const apiKey = activeApiKey.api_key;
    const model = activeApiKey.models?.[0] || getDefaultModelForProvider(provider);

    // Preparar o payload
    const payload = {
      prompt,
      provider,
      apiKey,
      model
    };

    // Chamar a edge function correspondente
    return await callEdgeFunction(provider, payload);
  } catch (error: any) {
    console.error('Error enhancing prompt:', error);
    throw error;
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
    const diagramPrompt = `Com base nos seguintes dados do projeto, gere um diagrama de fluxo utilizando sintaxe Mermaid:\n\n${JSON.stringify(promptData, null, 2)}\n\nForneça apenas a sintaxe Mermaid em um único bloco de código.`;
    
    // Usando edge functions para todas as LLMs
    try {
      switch (provider) {
        case 'openai':
          return await callEdgeFunction('openai', {
            prompt: diagramPrompt,
            model: activeApiKey.models?.[0] || getDefaultModelForProvider(provider),
            systemContent
          });
        
        case 'gemini':
          return await callEdgeFunction('gemini', {
            prompt: diagramPrompt,
            model: 'gemini-1.5-flash',
            systemContent
          });
        
        case 'groq':
          return await callEdgeFunction('groq', {
            prompt: diagramPrompt,
            model: activeApiKey.models?.[0] || getDefaultModelForProvider(provider),
            systemContent
          });
        
        case 'deepseek':
          return await callEdgeFunction('deepseek', {
            prompt: diagramPrompt,
            model: activeApiKey.models?.[0] || getDefaultModelForProvider(provider),
            systemContent
          });
        
        case 'grok':
          return await callEdgeFunction('grok', {
            prompt: diagramPrompt,
            model: 'grok-1',
            systemContent
          });
        
        default:
          throw new Error(`Provedor não suportado para geração de diagrama: ${provider}`);
      }
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
        case 'openai': return 'gpt-3.5-turbo';
        case 'gemini': return 'gemini-1.5-flash';
        case 'groq': return 'llama3-8b-8192';
        case 'deepseek': return 'deepseek-chat';
        case 'grok': return 'grok-1';
        default: return 'default-model';
    }
};
