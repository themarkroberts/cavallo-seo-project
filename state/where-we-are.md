# Where we are

**Step 3 of 5** — Mark reviews the judgment calls in the Content Disposition Map.
**96 rows** now need review: the original 47 the classifier was unsure about, 48 where real
Google Search Console data contradicts the assigned role, and `/things-to-know/how-to-measure/`,
which the June audit missed entirely despite it carrying more impressions than any other URL on the
site.

## Two progress models, and they disagree

This project is measured two different ways. Both are legitimate; they count different things, and
conflating them is why the position has been unclear.

**1. The engagement** — what Cavallo is owed, on a calendar. Six phases, June–November 2026.
**The deliverable-by-deliverable record now lives in `state/phases.json`** and renders as the phase
tabs on the dashboard. That file is authoritative; do not restate phase status here, because a second
copy is how the two records drifted apart in the first place.

**Corrected 2026-08-05.** This section previously claimed *"Pillars 2 and 3 have no commits at all."*
That was wrong. All three pillar pages are built and render on cavallo.seo.markroberts.io; the `seo`
branch carries a full pillar block library (pillar-header, spoke-links, hub-table, card-grid,
guardrail, hoof-anatomy, display-quote, content-section, faq) plus ten new ACF field groups. What is
true is that **none of it is on production** — Pillar 2 and Pillar 3 both 404 on cavallo-inc.com.
Mark's call, 2026-08-05: they do not publish while they still carry coming-soon links.

**2. The content pipeline** — the five steps below. This is what work has actually been happening,
and it is a prerequisite for Phases 5 and 6, not a substitute for Phases 3 and 4.

**Where they diverge:** the calendar says Phase 3. The pipeline says Step 3. Those are unrelated
threes.

## The five steps

1. ✅ **Lock 4 architecture decisions** — done 2026-06-16. See `decisions.md`.
2. ✅ **Build the Content Disposition Map** — done 2026-06-16. 1,154 rows, one role per URL,
   which is what guarantees no cannibalization. Now `state/pages.csv`.
3. ▶️ **Review the 96 flagged rows** — not started. The other 1,059 are mechanical.
4. ⬜ **Global quick wins** — noindex the tag/auto archives via one Yoast taxonomy setting
   (covers 235 rows); prune obvious dead weight. **NOT blocked** — see below.
5. ⬜ **Build pillars in waves** — Pillar 1 → 2 → 3. Publish each pillar before running its 301s.

## The numbers are now real

Google Search Console **works** for this site and always did. Several places in this project
claimed it was permission-blocked. The three live ones — `README.md`, `lib/render.ts` and
`lib/types.ts` — were corrected 2026-08-04. Superseded plans under `docs/superpowers/` still carry
the old wording and are deliberately left alone as dated historical records;
`docs/superpowers/specs/2026-08-04-gsc-rescoring-design.md` documents the correction.

Measured, last 12 months: **52,078 clicks** across **4,629 pages**. The Ahrefs estimate the
strategy was built on claimed only ~72 pages had any organic traffic — an undercount of roughly
14x.

Traffic figures now come in two clearly separated flavours, and must never be merged:

- **Measured** — Search Console clicks and impressions, in `state/gsc.json`. Real counts.
- **Estimated** — Ahrefs figures, in `state/metrics.json`. Educated guesses.

## What Step 4 actually risks (it is safe)

An earlier analysis in this project claimed Step 4 would destroy real traffic. That was
overstated. All 787 PRUNE + NOINDEX rows together hold about **4% of site clicks**:

| Role | Rows | With clicks | ≥10 clicks | Total clicks |
|---|---|---|---|---|
| PRUNE | 552 | 219 | 43 | 1,904 |
| NOINDEX | 235 | 65 | 4 | 222 |

Mass-noindexing the 235 archives risks ~222 clicks/year, with only 4 pages above 10 clicks.
That is a reasonable trade. **Step 4 is not blocked.**

What is real is a thin tail of wrong calls at the high-click end — `/natural-remedies-for-your-horse/`
earns 245 clicks/year and is marked PRUNE. Those are the 48 newly flagged rows.

## What's blocked

**27 of the 99 merges cannot run yet.** They point at 5 pages that do not exist:

- (NEW) Pillar 2 — Hoof Health & Conditions page — 12 merges waiting
- (NEW) Pillar 3 — Barefoot Trimming spoke — 4
- (NEW) Pillar 2 — White Line Disease spoke — 4
- (NEW) Pillar 2 — Hoof Abscess spoke — 4
- (NEW) Pillar 3 — Wild Horse Hooves spoke — 3

The 301 safety rule: redirecting a page before its destination has live content throws away the
ranking signal instead of passing it on.

## Still true from the original audit

723 pages have zero internal inbound links. 632 have no meta description.

## Not done yet

- The three `learn/` documents. The dashboard's "Why" tab shows a warning because they do not
  exist. This was the original request — to explain the strategy, not just display it.
- Keyword-gap research (terms the site does *not* rank for).
- Nothing has been verified against what the client was actually promised. See
  `docs/HANDOFF-2026-08-04.md`.
