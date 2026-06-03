"use client";

import { useState } from "react";
import type { ClientSnapshot, KeywordDetail, PillarPage } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Tiny sparkline – plots position history as an inline SVG          */
/* ------------------------------------------------------------------ */

function PositionSparkline({ history }: { history: { month: string; position: number | null }[] }) {
  const positions = history
    .map((h) => h.position)
    .filter((p): p is number => p !== null);

  if (positions.length < 2) {
    return <span className="text-gray-400">—</span>;
  }

  const W = 80;
  const H = 24;
  const PAD = 2;
  const maxPos = 50; // treat position 50 as floor
  const minPos = 1;

  const points = positions
    .map((pos, i) => {
      const x = PAD + (i / (positions.length - 1)) * (W - PAD * 2);
      // Invert: position 1 = top (PAD), position 50 = bottom (H - PAD)
      const clamped = Math.min(Math.max(pos, minPos), maxPos);
      const y = PAD + ((clamped - minPos) / (maxPos - minPos)) * (H - PAD * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={W} height={H} className="inline-block align-middle">
      <polyline
        points={points}
        fill="none"
        stroke="#C41230"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Status badge                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: PillarPage["status"] }) {
  const styles: Record<PillarPage["status"], string> = {
    Published: "bg-green-100 text-green-800",
    "In progress": "bg-blue-100 text-blue-800",
    Planned: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Position change cell                                               */
/* ------------------------------------------------------------------ */

function PositionChange({ current, prev }: { current: number | null; prev: number | null }) {
  if (current === null) return <span className="text-gray-400">—</span>;
  if (prev === null) return <span className="text-blue-600 text-xs font-medium">new</span>;

  const diff = prev - current; // positive = improved (lower position number)

  if (diff === 0) return <span className="text-gray-400">0</span>;

  return (
    <span className={diff > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
      {diff > 0 ? `+${diff}` : diff}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Truncate URL helper                                                */
/* ------------------------------------------------------------------ */

function truncateUrl(url: string, max = 40): string {
  try {
    const u = new URL(url);
    const path = u.pathname + u.search;
    const short = u.host + path;
    return short.length > max ? short.slice(0, max) + "…" : short;
  } catch {
    return url.length > max ? url.slice(0, max) + "…" : url;
  }
}

/* ------------------------------------------------------------------ */
/*  Pillar card                                                        */
/* ------------------------------------------------------------------ */

function PillarCard({
  pillar,
  keywords,
}: {
  pillar: PillarPage;
  keywords: KeywordDetail[];
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Card header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{pillar.title}</h3>
          <StatusBadge status={pillar.status} />
          <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-[#C41230]">
            {pillar.intent}
          </span>
        </div>
        <svg
          className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-4">
          {/* URL */}
          {pillar.url && (
            <a
              href={pillar.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#C41230] underline underline-offset-2 hover:opacity-80 break-all"
            >
              {truncateUrl(pillar.url, 60)}
            </a>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">{pillar.description}</p>

          {/* Keywords table */}
          {keywords.length > 0 ? (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="pb-2 pr-4">Keyword</th>
                    <th className="pb-2 pr-4 text-right">Volume</th>
                    <th className="pb-2 pr-4 text-right">KD</th>
                    <th className="pb-2 pr-4 text-right">Position</th>
                    <th className="pb-2 pr-4 text-right">Change</th>
                    <th className="pb-2 pr-4">Ranking URL</th>
                    <th className="pb-2">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {keywords.map((kw) => (
                    <tr key={kw.id} className="hover:bg-gray-50/50">
                      <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">
                        {kw.keyword}
                      </td>
                      <td className="py-2 pr-4 text-right text-gray-600 tabular-nums">
                        {kw.volume.toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 text-right text-gray-600 tabular-nums">{kw.kd}</td>
                      <td className="py-2 pr-4 text-right tabular-nums">
                        {kw.position !== null ? (
                          <span className="font-medium text-gray-900">{kw.position}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums">
                        <PositionChange current={kw.position} prev={kw.prev} />
                      </td>
                      <td className="py-2 pr-4">
                        {kw.currentRankingUrl ? (
                          <a
                            href={kw.currentRankingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#C41230] underline underline-offset-2 hover:opacity-80"
                            title={kw.currentRankingUrl}
                          >
                            {truncateUrl(kw.currentRankingUrl, 35)}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Not ranking</span>
                        )}
                      </td>
                      <td className="py-2">
                        <PositionSparkline history={kw.history} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No keywords mapped to this pillar yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */

export function KeywordsSection({ snapshot }: { snapshot: ClientSnapshot }) {
  const { targetKeywords, pillarPages } = snapshot;

  // Summary stats
  const totalTracked = targetKeywords.length;
  const ranking = targetKeywords.filter((kw) => kw.position !== null);
  const rankingCount = ranking.length;
  const topTen = ranking.filter((kw) => kw.position !== null && kw.position <= 10).length;
  const avgPosition =
    rankingCount > 0
      ? Math.round(
          (ranking.reduce((sum, kw) => sum + (kw.position ?? 0), 0) / rankingCount) * 10
        ) / 10
      : 0;

  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Keywords &amp; Content Strategy</h2>
        <p className="mt-2 text-sm text-gray-600 max-w-3xl leading-relaxed">
          Our content is organised around three pillar pages. Each pillar targets a cluster of
          related keywords. As pillar pages publish and mature, we expect to see these keywords
          climb in search rankings.
        </p>
      </div>

      {/* Pillar cards */}
      <div className="space-y-6">
        {pillarPages.map((pillar) => {
          const pillarKeywords = targetKeywords.filter((kw) => kw.pillarId === pillar.id);
          return <PillarCard key={pillar.id} pillar={pillar} keywords={pillarKeywords} />;
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Keywords Tracked", value: totalTracked },
          { label: "Currently Ranking", value: rankingCount },
          { label: "Top 10 Positions", value: topTen },
          { label: "Avg. Position", value: avgPosition || "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-[#FEF2F2] px-5 py-4 text-center"
          >
            <p className="text-2xl font-bold text-[#C41230]">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default KeywordsSection;
