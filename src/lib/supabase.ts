
import { createClient } from '@supabase/supabase-js';

// Criando o cliente do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validando as credenciais
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Anon Key is missing!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
