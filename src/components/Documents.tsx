"use client";

import { ClientSnapshot } from "@/lib/types";

export function Documents({ snapshot }: { snapshot: ClientSnapshot }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-900 mb-3">Documents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {snapshot.documents.map((doc, i) => (
          <a
            key={i}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm hover:border-violet-300 hover:shadow-md transition-all"
          >
            <svg className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span className="text-xs text-zinc-700">{doc.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
