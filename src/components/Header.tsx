export function Header({
  clientName,
  lastUpdated,
}: {
  clientName: string;
  lastUpdated: string;
}) {
  const dateStr = new Date(lastUpdated).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white text-sm font-bold">
            C
          </div>
          <div>
            <h1 className="text-base font-semibold text-zinc-900 leading-tight">
              {clientName}
            </h1>
            <p className="text-xs text-zinc-400">SEO Project Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Updated {dateStr}
        </div>
      </div>
    </header>
  );
}
