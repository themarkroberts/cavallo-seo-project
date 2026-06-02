"use client";

import { ClientSnapshot } from "@/lib/types";

export function CompetitorCompare({ snapshot }: { snapshot: ClientSnapshot }) {
  const sorted = [...snapshot.competitors].sort((a, b) => b.traffic - a.traffic);
  const max = sorted[0]?.traffic ?? 1;

  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-900 mb-3">Competitor Comparison</h2>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <p className="text-[10px] text-zinc-400 mb-3 uppercase tracking-wider font-semibold">
          Organic Visibility (est. monthly traffic)
        </p>
        <div className="space-y-2.5">
          {sorted.map((c) => {
            const isCavallo = c.label === "Cavallo Inc.";
            return (
              <Bar
                key={c.label}
                label={c.label}
                value={c.traffic}
                max={max}
                color={isCavallo ? "bg-violet-500" : "bg-zinc-300"}
                bold={isCavallo}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Bar({
  label,
  value,
  max,
  color,
  bold,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  bold?: boolean;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className={`text-zinc-700 ${bold ? "font-semibold" : "font-medium"}`}>{label}</span>
        <span className="text-zinc-500 tabular-nums">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
