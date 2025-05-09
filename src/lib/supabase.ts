
import { supabase as integrationSupabase } from '@/integrations/supabase/client';

// Supabase client configuration - usando o cliente da integração
export const supabase = integrationSupabase;

// Em caso de erro com a integração, temos um fallback
if (!supabase) {
  console.error('Erro ao inicializar o cliente Supabase da integração. Usando fallback.');
  
  // Crie um mock client para evitar erros
  const mockClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Supabase configuration missing') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ error: new Error('Supabase configuration missing') }),
      signInWithOAuth: () => Promise.resolve({ error: new Error('Supabase configuration missing') }),
      signOut: () => Promise.resolve({ error: new Error('Supabase configuration missing') })
    },
  } as any;
}
