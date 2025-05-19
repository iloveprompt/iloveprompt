import { createClient } from '@supabase/supabase-js'
import { Database } from '@/integrations/supabase/types'

// No Vite, as variáveis de ambiente são acessadas via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam variáveis de ambiente do Supabase. Verifique .env')
}

// Configuração inicial do cliente com opções para persistência
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'sb-auth-token'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Função robusta de logout
export const robustSignOut = async () => {
  try {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.replace('/');
  } catch (error) {
    localStorage.clear();
    window.location.replace('/');
  }
};
