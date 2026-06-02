"use client";

import { ClientSnapshot } from "@/lib/types";

const statusDot: Record<string, string> = {
  Complete: "bg-emerald-500",
  Done: "bg-emerald-500",
  "In progress": "bg-blue-500",
  "In Progress": "bg-blue-500",
  Assigned: "bg-amber-500",
  Review: "bg-purple-500",
  "Not started": "bg-zinc-300",
  Draft: "bg-zinc-300",
  Blocked: "bg-red-500",
  "On Hold": "bg-orange-400",
};

export function ThisMonthTasks({ snapshot }: { snapshot: ClientSnapshot }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-900 mb-3">This Month&apos;s Tasks</h2>
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {snapshot.tasks.map((task, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3 ${i !== snapshot.tasks.length - 1 ? "border-b border-zinc-100" : ""}`}
          >
            <div className={`h-2 w-2 rounded-full flex-shrink-0 ${statusDot[task.status] ?? "bg-zinc-300"}`} />
            <span className="text-xs text-zinc-700 flex-1 min-w-0 truncate">{task.name}</span>
            <span className="text-[10px] text-zinc-400 flex-shrink-0">{task.status}</span>
            {task.due && (
              <span className="text-[10px] text-zinc-300 flex-shrink-0 tabular-nums">
                {new Date(task.due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
