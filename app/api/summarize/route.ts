import { NextRequest, NextResponse } from 'next/server';
import { baselineRange, deriveStats } from '@/lib/pricing';
import { callModel } from '@/lib/ai';
import { Comp } from '@/types/cma';
import { getUser } from '@/lib/auth';
import { serverClient } from '@/lib/supabaseServer';
import { requirePaidOrWithinFreeLimit } from '@/lib/limits';

export async function POST(req: NextRequest){
  const body = await req.json();
  const { subject_address, rows, subject_sqft, raw_csv } = body as { subject_address?: string; rows: Comp[]; subject_sqft?: number; raw_csv?: string };
  if(!rows || !Array.isArray(rows)) return NextResponse.json({ error: 'rows required' }, { status: 400 });

  const user = await getUser(req as any);
  if(!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const ok = await requirePaidOrWithinFreeLimit(user.id);
  if(!ok) return NextResponse.json({ error: 'upgrade_required' }, { status: 402 });

  const anchor = baselineRange(rows, subject_sqft);
  const stats = deriveStats(rows);
  const payload = { subject_address, anchor, stats, comps: rows };
  const summary = await callModel(payload);

  const supabase = serverClient();
  if(supabase){
    await supabase
      .from('reports')
      .insert({ user_id: user.id, subject_address, raw_csv: raw_csv || null, model_name: summary.model_version || 'gpt-4o-mini', result_json: summary });
  }

  return NextResponse.json({ summary });
}


