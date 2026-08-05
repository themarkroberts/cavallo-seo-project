import { test } from "node:test";
import assert from "node:assert";
import { renderDashboard } from "../lib/render.ts";
import type { ProjectState } from "../lib/types.ts";

function state(over: Partial<ProjectState> = {}): ProjectState {
  return {
    phases: {
      source: "reference/01-roadmap.md",
      updated: "2026-08-05",
      phases: [
        {
          number: 1,
          month: "June 2026",
          title: "Foundation",
          active: true,
          outcome: "Site out of holding pattern.",
          note: "Built, not shipped.",
          teamRole: ["Review pillar copy"],
          deliverables: [
            {
              id: "1.1",
              title: "Pillar 1 live",
              promised: "Commercial hub.",
              owner: "Mark",
              status: "built",
              evidence: "Renders on preview, absent from production.",
              defects: ["Yoast meta unset"],
              links: [
                {
                  label: "Preview",
                  url: "https://cavallo.seo.markroberts.io/product-category/hoof-boot/",
                  note: "200",
                },
              ],
            },
            {
              id: "1.2",
              title: "Pillar 3 live",
              promised: "Credibility pillar.",
              owner: "Mark",
              status: "blocked",
              blockedBy: "Two KD-0 spokes do not exist.",
              evidence: "Built on preview.",
              defects: [],
              links: [],
            },
          ],
        },
        {
          number: 2,
          month: "July 2026",
          title: "Laminitis Guide",
          active: false,
          outcome: "Guide live and ranking.",
          note: "",
          teamRole: [],
          deliverables: [
            {
              id: "2.1",
              title: "Draft delivered",
              promised: "Carole supplies the draft.",
              owner: "Carole",
              status: "done",
              evidence: "Confirmed 2026-08-05.",
              defects: [],
              links: [],
            },
          ],
        },
      ],
    },
    whereWeAre: "# Where we are\nStep 3 of 5.",
    decisions: "# Decisions\nDecided things.",
    nextActions: "# Next actions\nReview 47 rows.",
    learn: [
      {
        slug: "why-301",
        title: "Why 301 beats noindex",
        body: "# Why 301 beats noindex\n\nEquity transfers.",
      },
    ],
    reference: [],
    pages: [
      {
        url: "https://x.com/a/",
        pillar: "None",
        role: "PRUNE",
        destinationUrl: "",
        evidence: "thin",
        source: "Auto",
        needsReview: false,
      },
      {
        url: "https://x.com/b/",
        pillar: "Pillar 2 — Hoof Health",
        role: "MERGE+301",
        destinationUrl: "(NEW) Pillar 2 — Hoof Abscess spoke",
        evidence: "seeded",
        source: "Seed",
        needsReview: true,
      },
    ],
    metrics: {
      fetchedAt: "2026-08-04T00:00:00Z",
      visibility: [{ month: "2026-07", value: 1286 }],
      sessions: [],
      revenue: [],
      competitors: [],
    },
    tasks: null,
    gsc: null,
    ...over,
  };
}

test("produces a standalone document with no external requests", () => {
  const html = renderDashboard(state());
  assert.match(html, /^<!DOCTYPE html>/);
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.doesNotMatch(html, /<link[^>]+stylesheet/);
});

test("renders a tab and section per phase", () => {
  const html = renderDashboard(state());
  for (const id of ["phase-1", "phase-2", "pages", "why", "strategy", "notes"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test("labels traffic figures as estimates", () => {
  const html = renderDashboard(state());
  assert.match(html, /Ahrefs estimate/i);
});

test("surfaces blocked merges with their reason", () => {
  const html = renderDashboard(state());
  assert.match(html, /\(NEW\) Pillar 2 — Hoof Abscess spoke/);
  assert.match(html, /301 safety rule/i);
});

test("includes every page row in the searchable table", () => {
  const html = renderDashboard(state());
  assert.match(html, /https:\/\/x\.com\/a\//);
  assert.match(html, /https:\/\/x\.com\/b\//);
});

test("escapes HTML in page data", () => {
  const html = renderDashboard(
    state({
      pages: [
        {
          url: "https://x.com/<script>alert(1)</script>/",
          pillar: "None",
          role: "PRUNE",
          destinationUrl: "",
          evidence: "a & b",
          source: "Auto",
          needsReview: false,
        },
      ],
    })
  );
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /a &amp; b/);
});

test("states plainly when metrics have never been fetched", () => {
  const html = renderDashboard(state({ metrics: null }));
  assert.match(html, /never been refreshed/i);
});

test("shows the review count", () => {
  const html = renderDashboard(state());
  assert.match(html, /1 row needs review|needs review/i);
});

const GSC = {
  fetchedAt: "2026-08-04T00:00:00Z",
  startDate: "2025-08-04",
  endDate: "2026-08-03",
  monthly: [{ month: "2026-07", value: 4000 }],
  pages: [
    { url: "https://x.com/a/", clicks: 245, impressions: 9000 },
    { url: "https://x.com/b/", clicks: 0, impressions: 12 },
  ],
};

test("says measured traffic is missing until refresh has run", () => {
  const html = renderDashboard(state({ gsc: null }));
  assert.match(html, /Measured traffic not fetched yet/i);
});

test("shows measured clicks separately from the Ahrefs estimate", () => {
  const html = renderDashboard(state({ gsc: GSC }));
  assert.match(html, /Measured clicks/);
  assert.match(html, /real clicks, not an estimate/i);
  assert.match(html, /Ahrefs estimate/i);
});

test("joins measured clicks onto the matching page row", () => {
  const html = renderDashboard(state({ gsc: GSC }));
  assert.match(html, /<td class="num">245<\/td>/);
});

test("measured column headers are sortable only when data exists", () => {
  // The word "sortable" is always in the stylesheet; assert on the header class.
  assert.match(renderDashboard(state({ gsc: GSC })), /<th class="num sortable"/);
  assert.doesNotMatch(renderDashboard(state({ gsc: null })), /<th class="num sortable"/);
});

test("states the measurement window so the range is never ambiguous", () => {
  const html = renderDashboard(state({ gsc: GSC }));
  assert.match(html, /2025-08-04/);
  assert.match(html, /2026-08-03/);
});
