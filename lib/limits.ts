import { serverClient } from '@/lib/supabaseServer';

export async function requirePaidOrWithinFreeLimit(userId: string){
  const supabase = serverClient();
  if(!supabase) return true; // allow when not configured locally
  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', userId).single();
  if(profile?.plan?.startsWith('pro')) return true;
  const { count } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('user_id', userId);
  return (count ?? 0) < 3;
}


