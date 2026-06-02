"use client";

import { ClientSnapshot } from "@/lib/types";

const statusStyles: Record<string, string> = {
  Complete: "bg-emerald-100 text-emerald-700",
  "In progress": "bg-blue-100 text-blue-700",
  "Not started": "bg-zinc-100 text-zinc-500",
};

export function Roadmap({ snapshot }: { snapshot: ClientSnapshot }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-zinc-900 mb-4">Roadmap</h2>
      <div className="space-y-2">
        {snapshot.roadmap.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-3.5 shadow-sm"
          >
            <span className="text-sm text-zinc-700">{item.phase}</span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[item.status] ?? statusStyles["Not started"]}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
