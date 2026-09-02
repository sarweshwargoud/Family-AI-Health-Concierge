import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const createClient = () => {
  return createSupabaseClient(
    supabaseUrl || '',
    supabaseKey || ''
  );
};

export const supabase = createClient();
