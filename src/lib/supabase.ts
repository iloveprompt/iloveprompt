import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// No Vite, as variáveis de ambiente são acessadas via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam variáveis de ambiente do Supabase. Verifique .env')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
