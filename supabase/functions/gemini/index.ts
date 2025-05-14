
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin, X-Requested-With, Accept, apikey, x-client-info",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { 
      status: 405, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
  
  try {
    console.log("Gemini Edge Function: Request received");
    const { prompt, model = "gemini-1.5-flash", systemContent } = await req.json();
    
    if (!prompt) {
      console.log("Gemini Edge Function: Missing prompt parameter");
      return new Response(JSON.stringify({ error: "Prompt é obrigatório" }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
    
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!apiKey) {
      console.log("Gemini Edge Function: Missing API Key");
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY não configurada" }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
    
    console.log(`Gemini Edge Function: Sending prompt to ${model} model`);
    console.log(`Prompt preview: ${prompt.substring(0, 100)}...`);
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ model: model });
      
      // Construir o prompt completo com o conteúdo do sistema se fornecido
      const fullPrompt = systemContent 
        ? `${systemContent}\n\n${prompt}` 
        : prompt;
      
      const result = await geminiModel.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Gemini Edge Function: Response received successfully");
      console.log(`Response preview: ${text.substring(0, 100)}...`);
      
      return new Response(JSON.stringify({ result: text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (generationError) {
      console.error("Gemini API Error:", generationError);
      return new Response(JSON.stringify({ 
        error: `Erro na API Gemini: ${generationError.message || "Erro desconhecido"}`,
        details: generationError
      }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
  } catch (e) {
    console.error("Gemini Edge Function General Error:", e);
    return new Response(JSON.stringify({ 
      error: e.message || "Erro desconhecido",
      stack: e.stack
    }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
  }
});
