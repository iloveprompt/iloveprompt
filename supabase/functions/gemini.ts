
// @deno-types="npm:@types/express"
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // This allows any origin - ideally should be restricted to your domains
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin, X-Requested-With, Accept",
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
    const { prompt, model } = await req.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt é obrigatório" }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
    
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY não configurada" }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    // Usando modelo gemini-1.5-flash em vez de gemini-pro que está causando o erro 404
    const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log("Enviando prompt para Gemini:", prompt.substring(0, 100) + "...");
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Resposta recebida do Gemini API");
    
    return new Response(JSON.stringify({ result: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Gemini Edge Function Error:", e);
    return new Response(JSON.stringify({ error: e.message || "Erro desconhecido" }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
