export function Gate({ allowed, children }: { allowed: boolean; children: React.ReactNode }){
  if(allowed) return <>{children}</>;
  return (
    <div className="rounded-2xl border p-6 text-center">
      <h3 className="text-xl font-semibold">Upgrade for unlimited AI CMAs</h3>
      <p className="mt-2 text-gray-600">You’ve used your 3 free reports.</p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <form action="/api/stripe/create" method="post">
          <input type="hidden" name="plan" value="monthly" />
          <button className="rounded-xl bg-black px-5 py-3 text-white">Upgrade – Monthly</button>
        </form>
        <form action="/api/stripe/create" method="post">
          <input type="hidden" name="plan" value="annual" />
          <button className="rounded-xl border px-5 py-3">Upgrade – Annual</button>
        </form>
      </div>
    </div>
  );
}


