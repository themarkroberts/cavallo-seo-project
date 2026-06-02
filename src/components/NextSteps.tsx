"use client";

import { ClientSnapshot } from "@/lib/types";

export function NextSteps({ snapshot }: { snapshot: ClientSnapshot }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-900 mb-3">What&apos;s Next</h2>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <ul className="space-y-2">
          {snapshot.nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-zinc-700 leading-relaxed">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-violet-400 flex-shrink-0" />
              {step}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
