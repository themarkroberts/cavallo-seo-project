"use client";

import { ClientSnapshot } from "@/lib/types";

export function NextSteps({ snapshot }: { snapshot: ClientSnapshot }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-zinc-900 mb-4">What&apos;s Next</h2>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <ul className="space-y-2.5">
          {snapshot.nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400 flex-shrink-0" />
              {step}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
