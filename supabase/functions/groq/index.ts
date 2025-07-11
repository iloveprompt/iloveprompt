import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    console.log("Groq Edge Function: Request received");
    const body = await req.json();
    const { prompt, model = "llama3-8b-8192", systemContent, apiKey } = body;
    
    if (!prompt) {
      console.log("Groq Edge Function: Missing prompt parameter");
      return new Response(JSON.stringify({ error: "Prompt é obrigatório" }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
    
    if (!apiKey) {
      console.log("Groq Edge Function: Missing API Key in body");
      return new Response(JSON.stringify({ error: "apiKey não enviada no body" }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
    
    console.log(`Groq Edge Function: Sending prompt to ${model} model`);
    console.log(`Prompt preview: ${prompt.substring(0, 100)}...`);
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemContent || 'Você é um assistente especializado em Desenvolvimento de Software.' },
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API Error:", errorText);
        return new Response(JSON.stringify({ 
          error: `Erro na API Groq: ${response.status} - ${errorText}` 
        }), { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }
      
      const data = await response.json();
      const result = data.choices[0].message.content;
      
      console.log("Groq Edge Function: Response received successfully");
      console.log(`Response preview: ${result.substring(0, 100)}...`);
      
      return new Response(JSON.stringify({ result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (generationError) {
      console.error("Groq API Error:", generationError);
      return new Response(JSON.stringify({ 
        error: `Erro na API Groq: ${generationError.message || "Erro desconhecido"}`,
        details: generationError
      }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
  } catch (e) {
    console.error("Groq Edge Function General Error:", e);
    return new Response(JSON.stringify({ 
      error: e.message || "Erro desconhecido",
      stack: e.stack
    }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
