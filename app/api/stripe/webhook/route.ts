// @ts-nocheck
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabaseServer';

export async function POST(req: NextRequest){
  if(!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET){
    return NextResponse.json({ received: true });
  }
  const sig = req.headers.get('stripe-signature')!;
  const buf = Buffer.from(await req.arrayBuffer());
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' as any });
  let event: Stripe.Event;
  try{ event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch(err:any){ return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 }); }

  console.log('stripe.webhook', event.type);

  if(event.type === 'checkout.session.completed'){
    const s = event.data.object as Stripe.Checkout.Session;
    const supabase = serverClient();
    if(supabase && s.client_reference_id){
      await supabase.from('profiles').update({ plan: 'pro_monthly' }).eq('id', s.client_reference_id);
    }
  }
  if(event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.canceled'){
    const sub = event.data.object as Stripe.Subscription;
    // If you store stripe_customer_id on profiles, map back to user and set free
    // For MVP, this path is a no-op unless you add customer mapping
  }
  return NextResponse.json({ received: true });
}


