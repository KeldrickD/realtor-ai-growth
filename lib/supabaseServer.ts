import { createClient } from '@supabase/supabase-js';

export function serverClient(){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url || !key) return null as any;
  return createClient(url, key);
}


