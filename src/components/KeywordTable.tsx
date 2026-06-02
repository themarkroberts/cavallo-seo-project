"use client";

import { ClientSnapshot } from "@/lib/types";

export function KeywordTable({ snapshot }: { snapshot: ClientSnapshot }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-900 mb-3">Target Keywords</h2>
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Keyword</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Pos</th>
              <th className="text-right px-3 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider w-12">+/-</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.targetKeywords.map((kw) => {
              const change = kw.prev != null && kw.position != null ? kw.prev - kw.position : null;
              return (
                <tr key={kw.keyword} className="border-b border-zinc-50 last:border-0">
                  <td className="px-3 py-2 text-zinc-700">{kw.keyword}</td>
                  <td className="px-3 py-2 text-right text-zinc-700 font-medium tabular-nums">
                    {kw.position ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {change != null ? (
                      <span className={`inline-flex items-center justify-center rounded px-1 py-0.5 text-[10px] font-semibold ${
                        change > 0 ? "bg-emerald-50 text-emerald-600" : change < 0 ? "bg-red-50 text-red-500" : "text-zinc-400"
                      }`}>
                        {change > 0 ? `+${change}` : change < 0 ? `${change}` : "—"}
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-300 font-medium">new</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
