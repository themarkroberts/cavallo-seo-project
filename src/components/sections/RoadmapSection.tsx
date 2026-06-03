"use client";

import { useState } from "react";
import type { ClientSnapshot } from "@/lib/types";

type Props = {
  snapshot: ClientSnapshot;
};

const statusColor = {
  Complete: {
    dot: "bg-[#059669]",
    badge: "bg-[#ECFDF5] text-[#059669]",
    line: "border-[#059669]",
  },
  "In progress": {
    dot: "bg-[#2563EB]",
    badge: "bg-[#EFF6FF] text-[#2563EB]",
    line: "border-[#2563EB]",
  },
  "Not started": {
    dot: "bg-gray-300",
    badge: "bg-gray-100 text-gray-500",
    line: "border-gray-300",
  },
} as const;

const taskStatusDot: Record<string, string> = {
  Complete: "bg-[#059669]",
  "In progress": "bg-[#2563EB]",
  "Not started": "bg-gray-300",
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function RoadmapSection({ snapshot }: Props) {
  const phases = snapshot.phases;

  // Default expand the "In progress" phase(s)
  const initialExpanded = new Set(
    phases.filter((p) => p.status === "In progress").map((p) => p.id)
  );
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(initialExpanded);

  const toggle = (id: string) => {
    setExpandedPhases((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Project Roadmap</h2>
        <p className="mt-1 text-sm text-gray-500">
          Six-month engagement, one phase per month. Click any phase to see its
          tasks and details.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {phases.map((phase, idx) => {
          const isLast = idx === phases.length - 1;
          const isExpanded = expandedPhases.has(phase.id);
          const colors = statusColor[phase.status] ?? statusColor["Not started"];

          const completedTasks = phase.tasks.filter(
            (t) => t.status === "Complete"
          ).length;
          const totalTasks = phase.tasks.length;

          return (
            <div key={phase.id} className="relative flex gap-6">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                {/* Dot */}
                <div
                  className={`z-10 mt-5 h-4 w-4 shrink-0 rounded-full border-2 border-white ring-2 ${colors.dot} ${
                    phase.status === "Complete"
                      ? "ring-emerald-600"
                      : phase.status === "In progress"
                        ? "ring-blue-600"
                        : "ring-gray-300"
                  }`}
                />
                {/* Connecting line */}
                {!isLast && (
                  <div className="w-px flex-1 bg-gray-200" />
                )}
              </div>

              {/* Card */}
              <div className="mb-6 flex-1 pb-2">
                <button
                  type="button"
                  onClick={() => toggle(phase.id)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-5 py-4 text-left shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Collapsed content */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-semibold text-gray-900">
                          {phase.title}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}
                        >
                          {phase.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>{phase.month}</span>
                        <span>
                          {completedTasks} of {totalTasks} tasks complete
                        </span>
                      </div>
                    </div>
                    <ChevronIcon open={isExpanded} />
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div
                      className="mt-4 border-t border-gray-100 pt-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Description blocks */}
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Why this phase
                          </p>
                          <p className="mt-1 text-sm text-gray-700">
                            {phase.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Expected outcome
                          </p>
                          <p className="mt-1 text-sm text-gray-700">
                            {phase.outcome}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Team&apos;s role
                          </p>
                          <p className="mt-1 text-sm text-gray-700">
                            {phase.teamRole}
                          </p>
                        </div>
                      </div>

                      {/* Tasks list */}
                      {phase.tasks.length > 0 && (
                        <div className="mt-5">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Tasks
                          </p>
                          <div className="overflow-hidden rounded-md border border-gray-100">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                                  <th className="py-2 pl-3 pr-2">Status</th>
                                  <th className="px-2 py-2">Task</th>
                                  <th className="px-2 py-2 text-right">Due</th>
                                </tr>
                              </thead>
                              <tbody>
                                {phase.tasks.map((task, tIdx) => (
                                  <tr
                                    key={tIdx}
                                    className="border-b border-gray-50 last:border-0"
                                  >
                                    <td className="py-2 pl-3 pr-2">
                                      <span
                                        className={`inline-block h-2.5 w-2.5 rounded-full ${taskStatusDot[task.status] ?? "bg-gray-300"}`}
                                        title={task.status}
                                      />
                                    </td>
                                    <td className="px-2 py-2">
                                      <span className="text-gray-800">
                                        {task.name}
                                      </span>
                                      {task.description && (
                                        <p className="mt-0.5 text-xs text-gray-400">
                                          {task.description}
                                        </p>
                                      )}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-right text-gray-500">
                                      {task.due ?? "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
