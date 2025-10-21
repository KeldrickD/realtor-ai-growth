import UploadBox from '@/components/UploadBox';

export default function DashboardPage(){
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="mt-2 text-gray-600">Upload CSV to generate an AI CMA summary.</p>
      <div className="mt-6">
        <UploadBox />
      </div>
    </main>
  );
}


