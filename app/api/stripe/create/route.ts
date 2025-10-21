// @ts-nocheck
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' as any });

export async function POST(req: NextRequest){
  const user = await getUser(req as any);
  if(!user) return NextResponse.json({error:'unauthorized'},{status:401});

  const accept = req.headers.get('accept') || '';
  const contentType = req.headers.get('content-type') || '';
  const wantsJson = accept.includes('application/json') || contentType.includes('application/json');

  if(!process.env.STRIPE_SECRET_KEY){
    const fallback = `${process.env.APP_URL || 'http://localhost:3000'}/dashboard?canceled=1`;
    return wantsJson ? NextResponse.json({ url: fallback }) : NextResponse.redirect(fallback, 303);
  }

  let plan: string | undefined = undefined;
  if(contentType.includes('application/json')){
    try { const body = await req.json(); plan = body?.plan; } catch {}
  } else if(contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')){
    try { const fd = await req.formData(); plan = (fd.get('plan') as string) || undefined; } catch {}
  }
  const priceMonthly = process.env.STRIPE_PRICE_MONTHLY || process.env.PRICE_MONTHLY_ID || 'price_monthly_xyz';
  const priceAnnual  = process.env.STRIPE_PRICE_ANNUAL  || process.env.PRICE_ANNUAL_ID  || 'price_annual_xyz';
  const priceId = (plan === 'annual') ? priceAnnual : priceMonthly;
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    success_url: `${process.env.APP_URL}/dashboard?success=1`,
    cancel_url: `${process.env.APP_URL}/dashboard?canceled=1`,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    customer_email: (user as any).email || undefined,
  });

  if(wantsJson) return NextResponse.json({ url: session.url });
  return NextResponse.redirect(session.url as string, 303);
}


