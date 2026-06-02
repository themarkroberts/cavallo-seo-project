"use client";

import { ClientSnapshot } from "@/lib/types";

export function KeywordTable({ snapshot }: { snapshot: ClientSnapshot }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-zinc-900 mb-4">Target Keywords</h2>
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Keyword</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Position</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Change</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.targetKeywords.map((kw) => {
              const change = kw.prev != null && kw.position != null ? kw.prev - kw.position : null;
              return (
                <tr key={kw.keyword} className="border-b border-zinc-50 last:border-0">
                  <td className="px-4 py-3 text-zinc-700">{kw.keyword}</td>
                  <td className="px-4 py-3 text-right text-zinc-700 font-medium">
                    {kw.position ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {change != null ? (
                      <span className={change > 0 ? "text-emerald-600" : change < 0 ? "text-red-500" : "text-zinc-400"}>
                        {change > 0 ? `↑${change}` : change < 0 ? `↓${Math.abs(change)}` : "—"}
                      </span>
                    ) : (
                      <span className="text-zinc-300">new</span>
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
