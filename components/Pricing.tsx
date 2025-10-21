"use client";
import { useMemo, useState } from 'react';

export default function Pricing(){
  const priceMonthly = Number(process.env.NEXT_PUBLIC_PRICE_MONTHLY || '19');
  const priceAnnual = Number(process.env.NEXT_PUBLIC_PRICE_ANNUAL || '190');
  const [plan, setPlan] = useState<'monthly'|'annual'>('monthly');

  const { displayPrice, savingsDollars, savingsPercent } = useMemo(()=>{
    const monthly = priceMonthly;
    const annual = priceAnnual;
    const yearlyIfMonthly = monthly * 12;
    const savings = Math.max(0, yearlyIfMonthly - annual);
    const percent = yearlyIfMonthly > 0 ? Math.round((savings / yearlyIfMonthly) * 100) : 0;
    return {
      displayPrice: plan === 'monthly' ? monthly : annual,
      savingsDollars: plan === 'annual' ? savings : 0,
      savingsPercent: plan === 'annual' ? percent : 0
    };
  }, [plan, priceMonthly, priceAnnual]);

  return (
    <section className="mt-12">
      <div className="mx-auto max-w-3xl rounded-2xl border p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Simple pricing</h3>
            <p className="mt-1 text-gray-600">Unlimited AI CMAs. Cancel anytime.</p>
          </div>
          <div className="inline-flex rounded-xl border p-1">
            <button onClick={()=>setPlan('monthly')} className={`px-3 py-1 text-sm rounded-lg ${plan==='monthly'?'bg-black text-white':'text-gray-700'}`}>Monthly</button>
            <button onClick={()=>setPlan('annual')} className={`px-3 py-1 text-sm rounded-lg ${plan==='annual'?'bg-black text-white':'text-gray-700'}`}>Annual</button>
          </div>
        </div>
        <div className="mt-6 flex items-end gap-3">
          <div className="text-5xl font-bold tracking-tight">${displayPrice}</div>
          <div className="text-gray-600">{plan==='monthly' ? '/mo' : '/yr'}</div>
          {savingsDollars>0 && (
            <div className="ml-auto rounded-lg bg-green-50 px-3 py-1 text-sm text-green-700">Save {savingsPercent}% (${savingsDollars})</div>
          )}
        </div>
        <form action="/api/stripe/create" method="post" className="mt-6">
          <input type="hidden" name="plan" value={plan} />
          <button className="w-full rounded-xl bg-black px-5 py-3 text-white">Get Started</button>
        </form>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-5">
          <div className="font-medium">AI pricing range</div>
          <p className="mt-1 text-sm text-gray-600">Trimmed PPSF anchor + LLM rationale, risks, and talking points.</p>
        </div>
        <div className="rounded-xl border p-5">
          <div className="font-medium">Unlimited CMAs</div>
          <p className="mt-1 text-sm text-gray-600">Generate as many reports as you want. Keep your history.</p>
        </div>
        <div className="rounded-xl border p-5">
          <div className="font-medium">1‑click PDF</div>
          <p className="mt-1 text-sm text-gray-600">Download a clean summary for clients and listing presentations.</p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl rounded-2xl border p-6">
        <h4 className="text-lg font-semibold">What agents are saying</h4>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <blockquote className="rounded-xl border p-4 text-sm text-gray-700">“This saves me 20 minutes per CMA and helps me push back on overpricing.” — J. Nguyen</blockquote>
          <blockquote className="rounded-xl border p-4 text-sm text-gray-700">“The talking points are gold for sellers. It feels like a second opinion.” — A. Patel</blockquote>
        </div>
      </div>
    </section>
  );
}


