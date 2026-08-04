# Where we are

**Step 3 of 5** — Mark reviews the 47 judgment calls in the Content Disposition Map.

## The five steps

1. ✅ **Lock 4 architecture decisions** — done 2026-06-16. See `decisions.md`.
2. ✅ **Build the Content Disposition Map** — done 2026-06-16. 1,154 rows, one role per URL,
   which is what guarantees no cannibalization. Now `state/pages.csv`.
3. ▶️ **Review the 47 uncertain calls** — in progress. The other 1,107 rows are mechanical.
4. ⬜ **Global quick wins** — noindex the tag/auto archives via one Yoast taxonomy setting
   (covers 235 rows); prune obvious dead weight.
5. ⬜ **Build pillars in waves** — Pillar 1 → 2 → 3. Publish each pillar before running its 301s.

## What's blocked

**27 of the 99 merges cannot run yet.** They point at 5 pages that do not exist:

- (NEW) Pillar 2 — Hoof Health & Conditions page — 12 merges waiting
- (NEW) Pillar 3 — Barefoot Trimming spoke — 4
- (NEW) Pillar 2 — White Line Disease spoke — 4
- (NEW) Pillar 2 — Hoof Abscess spoke — 4
- (NEW) Pillar 3 — Wild Horse Hooves spoke — 3

This is the 301 safety rule: redirecting a page before its destination has live content throws
away the ranking signal instead of passing it on.

## Known limits on the numbers

Google Search Console is permission-blocked for cavallo-inc.com, so every traffic figure here is
an **Ahrefs estimate**, not measured clicks. Only ~72 of 1,154 pages register any organic traffic
at all. 723 pages have zero internal inbound links; 632 have no meta description.
