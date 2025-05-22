import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Testado e funcionando 
// Chave API : AIzaSyBYEHqWbNFt0FHsPj2KnTapmMUudZ2BN9M
// JSON par Teste
//{
//  "prompt": "Seu prompt aqui, por exemplo: Qual a capital do Brasil?",
//  "model": "gemini-1.5-flash",
//  "apiKey": "SUA_CHAVE_API_DO_GEMINI_REAL"
//}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin, X-Requested-With, Accept, apikey, x-client-info"
};
const handleError = (error)=>{
  console.error("Erro:", error);
  let status = 500;
  let message = error.message || "Erro interno do servidor";
  if (error.message?.includes("API key")) {
    status = 401;
    message = "Chave de API inválida ou não fornecida";
  } else if (error.response?.status) {
    status = error.response.status;
    message = error.response.statusText || message;
  }
  return new Response(JSON.stringify({
    error: message
  }), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
};
Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Método não permitido"
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
  try {
    // Estas variáveis (prompt, model, apiKey) são extraídas diretamente do JSON da requisição
    // e, portanto, serão os valores fornecidos pelo usuário no frontend.
    const { prompt, model, apiKey } = await req.json();
    if (!prompt) {
      throw new Error("O prompt é obrigatório");
    }
    if (!apiKey) {
      throw new Error("API key é obrigatória");
    }
    // --- Início das Alterações para lidar com a seleção de modelo do frontend ---
    // Lista de modelos permitidos para sua aplicação
    const allowedModels = [
      // OK
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      "gemini-2.0-flash",
      "gemini-2.5-pro-preview-05-06",
      "gemini-2.0-flash-lite"
    ];
    // Valida e seleciona o modelo
    let selectedModel = "gemini-1.5-flash";
    if (model && typeof model === 'string' && allowedModels.includes(model)) {
      selectedModel = model;
    } else {
      console.warn(`Modelo "${model}" não é válido ou não está na lista de modelos permitidos. Usando o modelo padrão: ${selectedModel}`);
    }
    // --- Fim das Alterações ---
    console.log(`Chamando Gemini API com modelo: ${selectedModel}`);
    // Agora, use selectedModel na URL
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
    // Suas instruções de sistema completas foram adicionadas aqui.
    // Elas serão enviadas como um 'system_instruction' separado.
    const systemInstructions = `Você é um Gerente de Projeto de TI em uma Equipe de Desenvolvimento de Software. Você é um **Gerente de Projeto de TI** experiente e multifacetado, com uma visão estratégica e tática sobre o ciclo de vida do desenvolvimento de software. Sua principal habilidade é **analisar uma demanda ou problema de TI** e identificar os especialistas necessários para resolvê-lo, coordenando suas ações e consolidando os resultados. Você tambem é um Engenheiro de Software **engenheiro de software** experiente, com um olhar aguçado para detalhes e uma vasta experiência em depuração e garantia de qualidade de código. Use sua vasta experiencia como **engenheiro de software**, usando as informações fornecidadas pelo usuario, para melhorar a criação de um prompt bem detalhado, qualificado e perfeito, Você tambem é um Arquiteto de Software **arquiteto de software** experiente, responsável por definir a estrutura geral, os princípios e os padrões de design de um sistema. Sua visão abrange desde a escolha das tecnologias até a garantia de que a solução atenda aos requisitos não funcionais. Use sua vasta experiencia como **arquiteto de software**, usando as informações fornecidadas pelo usuario, para melhorar a criação de um prompt bem detalhado, qualificado e perfeito, Você tambem é um Engenheiro de segurança **engenheiro de segurança** com experiência em ambientes corporativos, especializado em encontrar e corrigir vulnerabilidades de segurança em código. Use sua vasta experiencia como **engenheiro de segurança**, usando as informações fornecidadas pelo usuario, para melhorar a criação de um prompt bem detalhado, qualificado e perfeito, Você tambem é um Designer de UX/UI **designer de ux/ui** com uma paixão por criar experiências digitais intuitivas, eficientes e visualmente atraentes. Sua expertise abrange desde a pesquisa com usuários até o design de interfaces e a prototipagem. Use sua vasta experiencia como **designer de ux/ui**, usando as informações fornecidadas pelo usuario, para melhorar a criação de um prompt bem detalhado, qualificado e perfeito, Você tambem é um  Engenheiro de Prompt **engenheiro de prompt** com profundo entendimento de modelos de linguagem (LLMs), suas capacidades e limitações. Sua expertise reside em formular as entradas (prompts) mais eficazes para extrair respostas precisas, relevantes e no formato desejado. Use sua vasta experiencia como **engenheiro de prompt**, usando as informações fornecidadas pelo usuario, para melhorar a criação de um prompt bem detalhado, qualificado e perfeito. Com base na esperiencia dessa equipe altamente qualificada, o resultado final deve ser um prompt completo, bem detalhado que tenha uma lista de itens nescessarios no prompt : Requisitos, Requisitos não funcionais, Funcionalidades (features), Desing UX/UI, Stack Tecnológica baseada em FullStack ou não, Recursos de Segurança, Extrutura de Código, Escabilitade, Performance, Padrão Arquitetural, Melhores Práticas, Escalabilidade, Integrações via API e Restrições (evitar na codificação).`;
    const requestBody = {
      // O campo 'system_instruction' agora contém todo o texto que você forneceu.
      system_instruction: {
        parts: [
          {
            text: systemInstructions
          }
        ]
      },
      // O prompt do usuário continua no array 'contents'.
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    };
    const response = await fetch(geminiApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Erro na API do Gemini: ${response.statusText}`);
    }
    const data = await response.json();
    const result = data.candidates[0]?.content?.parts[0]?.text;
    if (!result) {
      throw new Error("Resposta vazia do Gemini");
    }
    return new Response(JSON.stringify({
      result
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return handleError(error);
  }
});

