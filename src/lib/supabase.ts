
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validating credentials before creating client
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Anon Key is missing! Please configure your environment variables.');
}

// Only create the client if we have the required values
let supabase: ReturnType<typeof createClient>;

try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    // Create a mock client that throws clear errors when used
    // This prevents the app from crashing immediately on load
    // but will show errors when auth functions are actually used
    supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Supabase configuration missing') }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ error: new Error('Supabase configuration missing') }),
        signInWithOAuth: () => Promise.resolve({ error: new Error('Supabase configuration missing') }),
        signOut: () => Promise.resolve({ error: new Error('Supabase configuration missing') })
      },
    } as any;
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create the same mock client if initialization fails
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Supabase initialization failed') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ error: new Error('Supabase initialization failed') }),
      signInWithOAuth: () => Promise.resolve({ error: new Error('Supabase initialization failed') }),
      signOut: () => Promise.resolve({ error: new Error('Supabase initialization failed') })
    },
  } as any;
}

export { supabase };
