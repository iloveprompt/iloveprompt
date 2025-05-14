// @deno-types="npm:@types/express"
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405, headers: corsHeaders });
  }
  try {
    const { prompt, model } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt é obrigatório" }), { status: 400, headers: corsHeaders });
    }
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY não configurada" }), { status: 500, headers: corsHeaders });
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model: model || "gemini-pro" });
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return new Response(JSON.stringify({ result: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Erro desconhecido" }), { status: 500, headers: corsHeaders });
  }
}); 