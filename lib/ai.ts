import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const SYSTEM_PROMPT = `You are CMAPro, a concise real estate analyst. Given comparable sales (CSV parsed to JSON) and an optional baseline price range, produce:
- suggested_price_range {low, high, method}
- 3–6 bullet rationale using concrete stats (PPSF, DOM, recency, condition)
- 2–4 risk bullets (overpricing/seasonality/outlier comps)
- 3–5 client-facing talking_points (plain English)
- short note if data is weak
Avoid hedging language. Use USD rounded to the nearest $1,000. Prefer recency (< 180 days) and nearby comps.`;

export async function callModel(payload: any){
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: JSON.stringify(payload) }
    ],
    response_format: { type: 'json_object' }
  });
  const text = res.choices[0]?.message?.content || '{}';
  return JSON.parse(text);
}


