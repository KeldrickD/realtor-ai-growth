// deno-lint-ignore-file no-explicit-any
// Supabase Edge Function: Stripe subscription sync
// Deploy: supabase functions deploy stripe-sync

import Stripe from "https://esm.sh/stripe@16.10.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const SUPABASE_URL = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE") || "";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20" as any,
});

function supabaseAdmin(){
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
}

async function handleCheckoutCompleted(event: any){
  const s = event.data.object as Stripe.Checkout.Session;
  const userId = s.client_reference_id;
  if(!userId) return;
  const sb = supabaseAdmin();
  await sb.from('profiles').update({ plan: 'pro_monthly' }).eq('id', userId);
}

async function handleSubscriptionUpdated(event: any){
  const sub = event.data.object as Stripe.Subscription;
  const customerId = sub.customer as string;
  const status = sub.status; // active, canceled, past_due, etc.
  const plan = status === 'active' ? 'pro_monthly' : 'free';
  // Lookup user by stored stripe_customer_id if used; optional for MVP
}

Deno.serve(async (req) => {
  if(req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  if(!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE){
    return new Response(JSON.stringify({ received: true, note: 'Missing env; skipping verify/update (dev mode)' }), { headers: { 'Content-Type': 'application/json' } });
  }
  const signature = req.headers.get('stripe-signature') || '';
  const body = await req.text();
  let event: Stripe.Event;
  try{
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  }catch(err: any){
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  switch(event.type){
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event);
      break;
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await handleSubscriptionUpdated(event);
      break;
    default:
      break;
  }
  return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } });
});


