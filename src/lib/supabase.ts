
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Check if the environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verify that environment variables are available
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Creating a typed Supabase client
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseKey || ''
);
