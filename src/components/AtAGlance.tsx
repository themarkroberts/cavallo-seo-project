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

  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card label="Current Phase" value={currentPhase?.phase.replace(/^Phase \d+:\s*/, "") ?? "—"} />
        <Card label="Progress">
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-zinc-500">{pct}%</span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">{completedCount} of {totalPhases} phases</p>
        </Card>
        <Card label="Next Milestone" value={nextMilestone?.phase.replace(/^Phase \d+:\s*/, "") ?? "—"} />
        <Card label="Lead → Lag Chain">
          <div className="mt-1.5 flex items-center gap-1.5">
            <Chip color="bg-violet-100 text-violet-700">Visibility</Chip>
            <Arrow />
            <Chip color="bg-blue-100 text-blue-700">Sessions</Chip>
            <Arrow />
            <Chip color="bg-emerald-100 text-emerald-700">Revenue</Chip>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Card({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      {value && <p className="mt-1 text-sm font-semibold text-zinc-800 leading-snug">{value}</p>}
      {children}
    </div>
  );
}

function Chip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${color}`}>
      {children}
    </span>
  );
}

function Arrow() {
  return <span className="text-zinc-300 text-[10px]">&rarr;</span>;
}
