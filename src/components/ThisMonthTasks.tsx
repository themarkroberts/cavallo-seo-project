"use client";

import { ClientSnapshot } from "@/lib/types";

const statusDot: Record<string, string> = {
  Complete: "bg-emerald-500",
  "In progress": "bg-blue-500",
  "Not started": "bg-zinc-300",
};

export function ThisMonthTasks({ snapshot }: { snapshot: ClientSnapshot }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-zinc-900 mb-4">This Month&apos;s Tasks</h2>
      <div className="space-y-2">
        {snapshot.tasks.map((task, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-3.5 shadow-sm"
          >
            <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${statusDot[task.status] ?? statusDot["Not started"]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-700 truncate">{task.name}</p>
            </div>
            <span className="text-xs text-zinc-400 flex-shrink-0">
              {task.status}
            </span>
            {task.due && (
              <span className="text-xs text-zinc-300 flex-shrink-0">
                {new Date(task.due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
