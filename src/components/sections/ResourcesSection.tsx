"use client";

import { ClientSnapshot } from "@/lib/types";

const CATEGORY_STYLES: Record<string, { accent: string; bg: string; iconColor: string }> = {
  Strategy: { accent: "border-l-[#C41230]", bg: "bg-[#FEF2F2]", iconColor: "text-[#C41230]" },
  Research: { accent: "border-l-blue-500", bg: "bg-blue-50", iconColor: "text-blue-600" },
  Audit: { accent: "border-l-amber-500", bg: "bg-amber-50", iconColor: "text-amber-600" },
  Planning: { accent: "border-l-green-500", bg: "bg-green-50", iconColor: "text-green-600" },
};

const DEFAULT_STYLE = { accent: "border-l-zinc-400", bg: "bg-zinc-50", iconColor: "text-zinc-500" };

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 10.172 2H6Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 10.172 2H6Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 11.5L11.5 4.5M11.5 4.5H6M11.5 4.5V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ResourcesSection({ snapshot }: { snapshot: ClientSnapshot }) {
  const { documents } = snapshot;

  // Group documents by category
  const grouped = documents.reduce<Record<string, typeof documents>>((acc, doc) => {
    const cat = doc.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  // Sort categories: known categories first in defined order, then alphabetical
  const knownOrder = ["Strategy", "Research", "Audit", "Planning"];
  const categories = Object.keys(grouped).sort((a, b) => {
    const ai = knownOrder.indexOf(a);
    const bi = knownOrder.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Project Resources</h2>
        <p className="mt-1 text-sm text-zinc-500">
          All project deliverables and reference documents. These are updated as each phase
          progresses.
        </p>
      </div>

      {/* Document grid by category */}
      <div className="space-y-6">
        {categories.map((category) => {
          const style = CATEGORY_STYLES[category] || DEFAULT_STYLE;
          const docs = grouped[category];

          return (
            <div key={category}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {docs.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3 rounded-lg border border-zinc-200 ${style.accent} border-l-4 bg-white px-4 py-3 transition-colors hover:border-[#C41230] hover:shadow-sm`}
                  >
                    <span className={`shrink-0 ${style.iconColor}`}>
                      <DocumentIcon />
                    </span>
                    <span className="flex-1 text-sm font-medium text-zinc-800 truncate">
                      {doc.label}
                    </span>
                    <span className="shrink-0 text-zinc-300 group-hover:text-[#C41230] transition-colors">
                      <ArrowIcon />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-400">
            No documents available yet.
          </div>
        )}
      </div>

      {/* Key Contacts */}
      <div className="rounded-lg bg-white border border-zinc-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Project Team</h3>
        <ul className="space-y-2 text-sm text-zinc-700">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C41230]" />
            <span>
              <span className="font-medium">Mark Roberts</span> — SEO Strategy &amp; Implementation
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C41230]" />
            <span>
              <span className="font-medium">Cavallo Team</span> — Content, Review &amp; Approvals
            </span>
          </li>
        </ul>
        <p className="mt-4 text-xs text-zinc-400">
          Weekly check-in: Thursdays 10:00 PT
        </p>
      </div>
    </div>
  );
}
