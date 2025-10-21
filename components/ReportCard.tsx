type Props = { summary: any };

export default function ReportCard({ summary }: Props){
  const s = summary;
  return (
    <div className="rounded-2xl border p-6">
      <h3 className="text-xl font-semibold">Suggested List</h3>
      <p className="mt-1 text-lg">${s.suggested_price_range.low.toLocaleString()} – ${s.suggested_price_range.high.toLocaleString()}</p>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        <div>
          <h4 className="font-medium">Rationale</h4>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            {s.rationale?.map((b: string, i: number)=>(<li key={i}>{b}</li>))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Risks</h4>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            {s.risks?.map((b: string, i: number)=>(<li key={i}>{b}</li>))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Talking Points</h4>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            {s.talking_points?.map((b: string, i: number)=>(<li key={i}>{b}</li>))}
          </ul>
        </div>
      </div>
      <form method="post" action="/api/pdf" className="mt-6">
        <input type="hidden" name="payload" value={JSON.stringify({ subject: s.subject_address, summary: s })} />
      </form>
    </div>
  );
}


