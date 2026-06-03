"use client";

import { ClientSnapshot } from "@/lib/types";
import { PerformanceChart } from "@/components/PerformanceChart";

function currency(v: number): string {
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

const PROJECT_START = "2026-06-01";

const chainSteps = [
  { label: "Visibility", tag: "Leading indicator", color: "#C41230" },
  { label: "Sessions", tag: "Mid-funnel", color: "#3b82f6" },
  { label: "Revenue", tag: "Lagging indicator", color: "#10b981" },
] as const;

export function PerformanceSection({ snapshot }: { snapshot: ClientSnapshot }) {
  const { visibility, sessions, revenue, competitors } = snapshot;

  const maxTraffic = Math.max(...competitors.map((c) => c.traffic), 1);

  return (
    <section className="space-y-10">
      {/* --- Header --- */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Performance Tracking</h2>
        <p className="mt-1 text-sm text-zinc-500 max-w-3xl leading-relaxed">
          These three metrics form a lead-to-lag chain: organic visibility moves
          first (a leading indicator), then sessions follow, and revenue trails
          behind. The site started from a declining base &mdash; arresting that
          decline is the early goal. The gap between actual and the expected
          trend line shows the project&apos;s impact over time.
        </p>
      </div>

      {/* --- Lead-to-Lag Chain --- */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {chainSteps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 shadow-sm">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: step.color }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-800">
                  {step.label}
                </span>
                <span className="text-[10px] text-zinc-400">{step.tag}</span>
              </div>
            </div>
            {i < chainSteps.length - 1 && (
              <svg
                className="h-4 w-4 text-zinc-300 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* --- Charts --- */}
      <div className="grid gap-6 lg:grid-cols-3">
        <PerformanceChart
          title="Organic Visibility"
          subtitle="Leading indicator"
          data={visibility}
          projectStart={PROJECT_START}
          color="#C41230"
        />
        <PerformanceChart
          title="Organic Sessions"
          subtitle="Mid-funnel"
          data={sessions}
          projectStart={PROJECT_START}
          color="#3b82f6"
        />
        <PerformanceChart
          title="Organic Revenue"
          subtitle="Lagging indicator"
          data={revenue}
          projectStart={PROJECT_START}
          color="#10b981"
          format={currency}
          small
        />
      </div>

      {/* --- Competitor Comparison --- */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900">
          Competitor Landscape
        </h3>
        <p className="mt-1 text-sm text-zinc-500 max-w-3xl leading-relaxed">
          Estimated monthly organic traffic from Ahrefs. Scoot Boots &mdash; our
          closest DR-comparable competitor &mdash; currently leads in organic
          traffic through educational blog content. Our pillar strategy directly
          targets this gap.
        </p>

        <div className="mt-6 space-y-3">
          {competitors
            .slice()
            .sort((a, b) => b.traffic - a.traffic)
            .map((c) => {
              const isCavallo =
                c.label.toLowerCase().includes("cavallo") ||
                c.label.toLowerCase().includes("cavallohorseandride");
              const pct = (c.traffic / maxTraffic) * 100;

              return (
                <div key={c.label} className="flex items-center gap-3">
                  <span
                    className={`w-40 shrink-0 truncate text-xs font-medium ${
                      isCavallo ? "text-[#C41230]" : "text-zinc-600"
                    }`}
                  >
                    {c.label}
                  </span>
                  <div className="relative flex-1 h-5 rounded bg-zinc-100">
                    <div
                      className="absolute inset-y-0 left-0 rounded"
                      style={{
                        width: `${Math.max(pct, 1)}%`,
                        backgroundColor: isCavallo ? "#C41230" : "#d4d4d8",
                      }}
                    />
                  </div>
                  <span
                    className={`w-20 text-right text-xs tabular-nums ${
                      isCavallo
                        ? "font-semibold text-[#C41230]"
                        : "text-zinc-500"
                    }`}
                  >
                    {fmt(c.traffic)}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
