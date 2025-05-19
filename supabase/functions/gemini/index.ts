import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin, X-Requested-With, Accept, apikey, x-client-info",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Handle LLM registration
  if (req.method === "POST") {
    try {
      const { action, ...params } = await req.json();
      
      if (action === 'register') {
        const { api_key, name, model } = params;
        
        if (!api_key || !name || !model) {
          return new Response(JSON.stringify({ 
            error: "api_key, name e model são obrigatórios" 
          }), { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_ANON_KEY')!,
        );

        const { data, error } = await supabase
          .from('user_llm_apis')
          .insert({
            api_key,
            name,
            model,
            provider: 'gemini',
            created_at: new Date().toISOString()
          })
          .select();

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    } catch (e) {
      console.error("Registration Error:", e);
      return new Response(JSON.stringify({ 
        error: e.message || "Erro desconhecido" 
      }), { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
  
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { 
      status: 405, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
  
  try {
    console.log("Gemini Edge Function: Request received");
    const { prompt, model = "gemini-1.5-flash" } = await req.json();
    
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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", errorText);
        return new Response(JSON.stringify({ 
          error: `Erro na API Gemini: ${response.status} - ${errorText}` 
        }), { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }
      
      const data = await response.json();
      const result = data.candidates[0].content.parts[0].text;
      
      console.log("Gemini Edge Function: Response received successfully");
      console.log(`Response preview: ${result.substring(0, 100)}...`);
      
      return new Response(JSON.stringify({ result }), {
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
