"use client";

import { ClientSnapshot } from "@/lib/types";

export function CompetitorCompare({ snapshot }: { snapshot: ClientSnapshot }) {
  const { label, ourTraffic, theirTraffic } = snapshot.competitor;
  const max = Math.max(ourTraffic, theirTraffic);

  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-zinc-900 mb-4">Competitor Comparison</h2>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs text-zinc-400 mb-4 uppercase tracking-wide">Organic Visibility</p>
        <div className="space-y-3">
          <Bar label="Cavallo" value={ourTraffic} max={max} color="bg-violet-500" />
          <Bar label={label} value={theirTraffic} max={max} color="bg-zinc-300" />
        </div>
      </div>
    </section>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-zinc-700 font-medium">{label}</span>
        <span className="text-zinc-500">{value.toLocaleString()}</span>
      </div>
      <div className="h-3 rounded-full bg-zinc-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
