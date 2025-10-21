import Pricing from '@/components/Pricing';

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Price it right in 60 seconds.</h1>
      <p className="mt-4 text-lg text-gray-600">Upload your comps and get an AI‑ready price range, risks, and client talking points — without wrestling spreadsheets.</p>
      <div className="mt-8">
        <a href="/dashboard" className="rounded-xl border px-6 py-3">Try free →</a>
      </div>
      <Pricing />
    </main>
  );
}


