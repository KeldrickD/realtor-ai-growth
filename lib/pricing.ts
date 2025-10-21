import { Comp } from '@/types/cma';

export function medianOf(values: number[]): number {
  const arr = values.slice().sort((a,b)=>a-b);
  const n = arr.length;
  if(n === 0) return 0;
  const mid = Math.floor(n/2);
  return n % 2 ? arr[mid] : (arr[mid-1] + arr[mid]) / 2;
}

export function quantile(values: number[], q: number): number {
  if(values.length === 0) return 0;
  const arr = values.slice().sort((a,b)=>a-b);
  const pos = (arr.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if(arr[base+1] !== undefined) return arr[base] + rest * (arr[base+1] - arr[base]);
  return arr[base];
}

export function iqrOf(values: number[]): number {
  if(values.length < 4) return 0;
  const q1 = quantile(values, 0.25);
  const q3 = quantile(values, 0.75);
  return q3 - q1;
}

export function baselineRange(comps: Comp[], subjectSqft?: number){
  const valid = comps.filter(c => c.sold_price && c.sqft && (c.sqft as number) > 300);
  const ppsf = valid.map(c => c.sold_price / (c.sqft as number));
  const median = medianOf(ppsf);
  const iqr = iqrOf(ppsf);
  const trimmed = valid.filter(c => {
    const v = c.sold_price / (c.sqft as number);
    return v > median - 1.5*iqr && v < median + 1.5*iqr;
  });
  const ppsfTrim = trimmed.map(c => c.sold_price / (c.sqft as number));
  const medTrim = medianOf(ppsfTrim);
  const priceList = trimmed.map(c=>c.sold_price).sort((a,b)=>a-b);
  const low = subjectSqft ? Math.round(medTrim * subjectSqft * 0.97) : Math.round(quantile(priceList, 0.35));
  const high = subjectSqft ? Math.round(medTrim * subjectSqft * 1.03) : Math.round(quantile(priceList, 0.65));
  return { low, high, method: 'trimmed-median-ppsf' } as const;
}

export function deriveStats(comps: Comp[]) {
  const withSqft = comps.filter(c=>c.sold_price && c.sqft);
  const ppsf = withSqft.map(c => c.sold_price / (c.sqft as number));
  const median_ppsf = ppsf.length ? Math.round(medianOf(ppsf)) : undefined;
  const domVals = comps.map(c=>c.dom).filter(Boolean) as number[];
  const avg_dom = domVals.length ? Math.round(domVals.reduce((a,b)=>a+b,0)/domVals.length) : undefined;
  const dates = comps.map(c=>Date.parse(c.sold_date)).filter(n=>!isNaN(n));
  const min = dates.length ? new Date(Math.min(...dates)).toISOString() : undefined;
  const max = dates.length ? new Date(Math.max(...dates)).toISOString() : undefined;
  return {
    n: comps.length,
    median_ppsf,
    avg_dom,
    date_range: min && max ? { min, max } : undefined
  };
}


