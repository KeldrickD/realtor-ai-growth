"use client";
import { useState } from 'react';
import ReportCard from '@/components/ReportCard';

export default function UploadBox(){
  const [file, setFile] = useState<File|null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|undefined>();
  const [summary, setSummary] = useState<any|undefined>();
  const [subject, setSubject] = useState('');
  const [subjectSqft, setSubjectSqft] = useState<number|undefined>();

  async function parse(){
    if(!file) return;
    setLoading(true); setError(undefined);
    try{
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/ingest', { method:'POST', body: fd });
      const json = await res.json();
      if(!res.ok) throw new Error(json.error || 'Failed to parse CSV');
      setRows(json.rows);
    }catch(e:any){ setError(e.message); }
    finally{ setLoading(false); }
  }

  async function summarize(){
    if(rows.length===0) return;
    setLoading(true); setError(undefined);
    try{
      const res = await fetch('/api/summarize', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ rows, subject_address: subject || undefined, subject_sqft: subjectSqft, raw_csv: null }) });
      const json = await res.json();
      if(!res.ok) throw new Error(json.error || 'Failed to summarize');
      setSummary(json.summary);
    }catch(e:any){ setError(e.message); }
    finally{ setLoading(false); }
  }

  return (
    <div className="border-2 border-dashed rounded-2xl p-8 text-center">
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <input className="w-full rounded border px-3 py-2" placeholder="Subject address (optional)" value={subject} onChange={e=>setSubject(e.target.value)} />
        <input className="w-full rounded border px-3 py-2" placeholder="Subject sqft (optional)" inputMode="numeric" onChange={e=>setSubjectSqft(e.target.value ? Number(e.target.value) : undefined)} />
      </div>
      <input type="file" accept=".csv" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <div className="mt-4 flex items-center justify-center gap-3">
        <button onClick={parse} disabled={!file || loading} className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-50">{loading? 'Parsing…' : 'Parse CSV'}</button>
        {rows.length>0 && <button onClick={summarize} disabled={loading} className="rounded-lg border px-4 py-2 disabled:opacity-50">Generate Summary</button>}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {rows.length>0 && <p className="mt-4 text-sm text-gray-600">Parsed {rows.length} rows.</p>}
      {summary && <div className="mt-6 text-left"><ReportCard summary={summary} /></div>}
    </div>
  );
}


