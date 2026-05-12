import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxwemvbzcwiaagenevjy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4d2VtdmJ6Y3dpYWFnZW5ldmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDUyMzksImV4cCI6MjA5NDA4MTIzOX0.inYExKqu95Gp2y6cfQkPd3Moco60U7Mzfm5tYinn99c'; // Paste your key here directly

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // This line below is the "Force Protocol" fix
    flowType: 'pkce' 
  }
});