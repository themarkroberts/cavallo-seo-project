"use client";

import { ClientSnapshot } from "@/lib/types";

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

function currency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
}

export function OverviewSection({ snapshot }: { snapshot: ClientSnapshot }) {
  const { projectContext, phases, nextSteps } = snapshot;
  const { summary, goals, approach, timeline, baseline } = projectContext;

  const currentPhase = phases.find((p) => p.status === "In progress");
  const completedCount = phases.filter((p) => p.status === "Complete").length;
  const totalPhases = phases.length;
  const pct = totalPhases > 0 ? Math.round((completedCount / totalPhases) * 100) : 0;

  const nextMilestone = phases.find(
    (p) => p.status === "In progress" || p.status === "Not started"
  );

  const baselineMetrics = [
    { label: "Domain Rating", value: String(baseline.dr) },
    { label: "Organic Keywords (top 100)", value: fmt(baseline.orgKeywords) },
    { label: "Monthly Organic Traffic", value: fmt(baseline.orgTraffic) },
    { label: "Referring Domains", value: fmt(baseline.refDomains) },
    { label: "Backlinks", value: fmt(baseline.backlinks) },
    { label: "Monthly Revenue", value: currency(baseline.monthlyRevenue) },
    { label: "Monthly Sessions", value: fmt(baseline.monthlySessions) },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Project Summary */}
      <div className="rounded-lg bg-white border border-zinc-200 shadow-sm border-l-4 border-l-[#C41230]">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] mb-3">Project Summary</h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">{summary}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
            <svg
              className="w-4 h-4 text-[#C41230]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <span className="font-medium">Timeline:</span> {timeline}
          </div>
        </div>
      </div>

      {/* 2. Project Goals */}
      <div className="rounded-lg bg-white border border-zinc-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] mb-4">
            What We&rsquo;re Working Toward
          </h2>
          <ol className="space-y-3">
            {goals.map((goal, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-zinc-700">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FEF2F2] text-[#C41230] text-sm font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="pt-0.5">{goal}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* 3. Strategic Approach */}
      <div className="rounded-lg bg-white border border-zinc-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] mb-3">The Approach</h2>
          <p className="text-[15px] leading-relaxed text-zinc-700 whitespace-pre-line">
            {approach}
          </p>
        </div>
      </div>

      {/* 4. Baseline Metrics */}
      <div className="rounded-lg bg-white border border-zinc-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] mb-1">
            Where We Started (June 2026 Baseline)
          </h2>
          <p className="text-sm text-zinc-500 mb-5">
            Pre-project benchmarks captured before any optimization work began.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {baselineMetrics.map((m) => (
              <div
                key={m.label}
                className="rounded-lg bg-zinc-50 border border-zinc-100 px-4 py-3"
              >
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
                  {m.label}
                </p>
                <p className="text-xl font-bold text-[#1C1C1C]">{m.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
            These are fixed benchmarks captured before the project began. The Phase 6 report
            measures lift against these numbers.
          </p>
        </div>
      </div>

      {/* 5. Current Status Strip */}
      <div className="rounded-lg bg-[#FEF2F2] border border-red-100 shadow-sm">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            {/* Current Phase */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
                Current Phase
              </p>
              <p className="text-base font-semibold text-[#1C1C1C] truncate">
                {currentPhase?.title ?? "—"}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
                Overall Progress
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 rounded-full bg-white overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#C41230] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-[#1C1C1C] whitespace-nowrap">
                  {pct}%
                </span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">
                {completedCount} of {totalPhases} phases complete
              </p>
            </div>

            {/* Next Milestone */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
                Next Milestone
              </p>
              <p className="text-base font-semibold text-[#1C1C1C] truncate">
                {nextMilestone?.title ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. What's Next */}
      <div className="rounded-lg bg-white border border-zinc-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#1C1C1C] mb-4">Immediate Next Steps</h2>
          <ul className="space-y-2.5">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-zinc-700">
                <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C41230]" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
