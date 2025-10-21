type Props = { params: { id: string } };

export default function ReportPage({ params }: Props){
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h2 className="text-2xl font-semibold">Report #{params.id}</h2>
      <p className="mt-2 text-gray-600">Read-only CMA summary.</p>
    </main>
  );
}


