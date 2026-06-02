"use client";

import { ClientSnapshot } from "@/lib/types";

export function AtAGlance({ snapshot }: { snapshot: ClientSnapshot }) {
  const currentPhase = snapshot.roadmap.find((r) => r.status === "In progress");
  const completedCount = snapshot.roadmap.filter((r) => r.status === "Complete").length;
  const totalPhases = snapshot.roadmap.length;
  const pct = Math.round((completedCount / totalPhases) * 100);

  const nextMilestone = snapshot.roadmap.find(
    (r) => r.status === "Not started" || r.status === "In progress"
  );

  const updatedDate = new Date(snapshot.lastUpdated).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Current Phase" value={currentPhase?.phase ?? "—"} />
        <Card label="Progress" value={`${pct}%`} subtext={`${completedCount} of ${totalPhases} phases complete`} />
        <Card label="Next Milestone" value={nextMilestone?.phase ?? "—"} />
        <Card label="Last Updated" value={updatedDate} />
      </div>
      <p className="mt-4 text-sm text-zinc-500">
        Rankings lead sessions lead revenue — improvements flow through in that order, typically with a 2–3 month lag at each stage.
      </p>
    </section>
  );
}

function Card({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-900 leading-snug">{value}</p>
      {subtext && <p className="mt-0.5 text-xs text-zinc-400">{subtext}</p>}
    </div>
  );
}
