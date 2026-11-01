import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://fthqnbqqsgfkotsmsjgz.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0aHFuYnFxc2dma290c21zamd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMDIwMDYsImV4cCI6MjEwODg3ODAwNn0.X3z-fWrjyKymWwF_p5rGsNgibuOk7e7BUS7rGqdviJE';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase configuration missing: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'creatoros_sb_auth_v1',
  },
});

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};
