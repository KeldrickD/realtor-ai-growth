import Papa from 'papaparse';
import { NextRequest, NextResponse } from 'next/server';

const headerMap: Record<string,string> = {
  address: 'address',
  price: 'sold_price', soldprice: 'sold_price', sold_price: 'sold_price',
  list_price: 'list_price', listprice: 'list_price',
  sold_date: 'sold_date', date: 'sold_date', closed_date: 'sold_date',
  beds: 'beds', bedrooms: 'beds',
  baths: 'baths', bathrooms: 'baths',
  sqft: 'sqft', gla: 'sqft', living_area: 'sqft',
  dom: 'dom', days_on_market: 'dom',
  lot_sqft: 'lot_sqft', lot_size: 'lot_sqft',
  year_built: 'year_built',
  condition: 'condition'
};

function normalizeHeader(h: string){
  return h.toLowerCase().replace(/[^a-z_]/g,'').replace(/\s+/g,'');
}

export async function POST(req: NextRequest){
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if(!file) return NextResponse.json({error:'missing file'}, {status:400});
  const text = await file.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const fields = parsed.meta.fields || [];
  const cols = fields.map(f=>normalizeHeader(f));
  const map: Record<string,string> = {};
  cols.forEach((c,i)=>{
    const raw = fields[i]!;
    const target = (headerMap as any)[c] || (headerMap as any)[raw.toLowerCase()] || raw.toLowerCase();
    map[raw] = target;
  });
  const rows = (parsed.data as any[]).map(r=>{
    const o: any = {};
    for(const k in r){ o[map[k]||k] = r[k]; }
    if(o.sold_price) o.sold_price = Number(String(o.sold_price).replace(/[$,]/g,''));
    if(o.list_price) o.list_price = Number(String(o.list_price).replace(/[$,]/g,''));
    ['beds','baths','sqft','dom','lot_sqft','year_built'].forEach(k=>{ if(o[k]) o[k]=Number(o[k]); });
    if(o.sold_date) o.sold_date = new Date(o.sold_date).toISOString();
    return o;
  });
  return NextResponse.json({ rows, raw: text });
}


