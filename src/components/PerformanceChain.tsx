"use client";

import { ClientSnapshot } from "@/lib/types";
import { PerformanceChart } from "./PerformanceChart";

export function PerformanceChain({
  snapshot,
  projectStart,
}: {
  snapshot: ClientSnapshot;
  projectStart: string;
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-900 mb-1">Performance</h2>
      <p className="text-xs text-zinc-400 mb-5">
        The site starts from a declining base. The gap between actual and the expected trend line shows the project&apos;s impact.
      </p>

      <div className="space-y-6">
        <PerformanceChart
          title="Organic Visibility"
          subtitle="Leading indicator"
          data={snapshot.visibility}
          projectStart={projectStart}
          color="#8b5cf6"
        />

        <PerformanceChart
          title="Organic Sessions"
          subtitle="Mid-funnel"
          data={snapshot.sessions}
          projectStart={projectStart}
          color="#3b82f6"
        />

        <PerformanceChart
          title="Organic Revenue"
          subtitle="Lagging indicator"
          data={snapshot.revenue}
          projectStart={projectStart}
          color="#10b981"
          format={(v) => `$${(v / 1000).toFixed(0)}k`}
          small
        />
      </div>
    </section>
  );
}
