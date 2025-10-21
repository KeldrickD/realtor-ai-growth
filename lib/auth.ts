import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function getUser(req?: Request){
  // Minimal placeholder: in dev, return a fake user if no Supabase cookie found
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url || !key){
    return { id: 'dev-user', email: 'dev@example.com' } as any;
  }
  try{
    const supabase = createClient(url, key, { global: { headers: { Authorization: req ? (req.headers as any).get('Authorization') || '' : '' } } });
    const { data: { user } } = await (supabase as any).auth.getUser();
    return user || null;
  }catch{
    return { id: 'dev-user', email: 'dev@example.com' } as any;
  }
}


