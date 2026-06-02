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
    <section className="mb-10">
      <h2 className="text-lg font-bold text-zinc-900 mb-1">Performance</h2>
      <p className="text-xs text-zinc-500 mb-6">
        The site begins from a multi-year declining base. Arresting the decline is the early goal — the shaded gap between actual and the expected trend shows the project&apos;s effect.
      </p>

      <div className="space-y-8">
        <PerformanceChart
          title="Organic Visibility (Ahrefs)"
          subtitle="Leading indicator — moves first"
          data={snapshot.visibility}
          projectStart={projectStart}
          color="#8b5cf6"
        />

        <PerformanceChart
          title="Organic Sessions (GA4)"
          subtitle="Mid-funnel — follows visibility with ~2 month lag"
          data={snapshot.sessions}
          projectStart={projectStart}
          color="#3b82f6"
        />

        <PerformanceChart
          title="Organic Revenue (GA4)"
          subtitle="Lagging indicator — shown for context, not as a primary measure"
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
