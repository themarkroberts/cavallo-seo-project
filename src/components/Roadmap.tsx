"use client";

import { ClientSnapshot } from "@/lib/types";

const statusConfig: Record<string, { bg: string; dot: string }> = {
  Complete: { bg: "bg-emerald-50", dot: "bg-emerald-500" },
  "In progress": { bg: "bg-blue-50", dot: "bg-blue-500" },
  "Not started": { bg: "bg-zinc-50", dot: "bg-zinc-300" },
};

export function Roadmap({ snapshot }: { snapshot: ClientSnapshot }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-900 mb-3">Roadmap</h2>
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {snapshot.roadmap.map((item, i) => {
          const cfg = statusConfig[item.status] ?? statusConfig["Not started"];
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 ${i !== snapshot.roadmap.length - 1 ? "border-b border-zinc-100" : ""}`}
            >
              <div className={`h-2 w-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
              <span className="text-xs text-zinc-700 flex-1">{item.phase}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${
                item.status === "Complete" ? "text-emerald-700" :
                item.status === "In progress" ? "text-blue-700" : "text-zinc-500"
              }`}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
