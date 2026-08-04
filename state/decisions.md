# Decisions

Every decision, why it was made, and when. Newest last.

## 2026-06-16 — Founder content merges into the Laminitis spoke

There is no single "Founder" page to absorb — it is a scatter of thin posts, all with roughly
zero traffic and zero links. MERGE+301 all of them into
`/your-cavallo-laminitis-healing-plan/` and repurpose the "foundered mare" customer stories as
social-proof blocks inside the combined guide.

Left out deliberately: the two founder videos (already noindexed) and
`/newsletter/may-2-journal-founders-insights/`, which is a false positive — "founder" there means
the company founder, not the disease.

## 2026-06-16 — DSLD is excluded

Degenerative Suspensory Ligament Desmitis is a connective-tissue disease, not hoof-seated.
Including it would dilute the pillar's topical authority. No page.

## 2026-06-16 — Navicular consolidates to one educational spoke

Canonical is `/is-navicular-disease-always-the-beginning-of-the-end/` (1,936 words, 129 visits,
already ranks for "when to euthanize a horse with navicular"). Add a "best boots for navicular"
section so it carries commercial intent, then merge both commercial pages and six thin posts into
it.

Kept separate: `/faq/cavallo-hoof-boots-for-therapy-and-rehabilitation/` only *mentions*
navicular. It is a therapy/rehab page and becomes its own Pillar 1 spoke.

## 2026-06-16 — Diet becomes one educational spoke under Pillar 2

The literal hoof-nutrition angle has almost no search demand (`hoof nutrition` 30/mo,
`minerals for horse hooves` 0). So the spoke targets `horse diet` (800, KD21) and
`equine nutrition` (400, KD21) and stays educational — diet leads to healthy hoof.

Canonical is `/equine-nutrition/`. Four thin founder-voice posts merge into it.

The easy commercial supplement terms (`horse hoof supplement` KD0, `biotin for horses` KD1) are
deliberately skipped: Cavallo sells boots, not supplements, and chasing them would dilute the
pillar's focus.

## 2026-08-04 — Notion narrows to task management only

The Cavallo team does not use the Notion workspace, so pushing keywords, visibility, sessions,
revenue, and competitor data there was wasted effort. That write-back is removed. Notion keeps
one job — the task database — because it is genuinely good at task management and files are not.

Project state moves to version-controlled files in this repo, rendered to `dashboard.html`.

## 2026-08-04 — 48 pages flagged from Search Console data

Search Console turned out to be readable after all (it was assumed blocked). Measured clicks
contradict the role on 48 pages marked PRUNE or NOINDEX, all at >=10 clicks over
2025-08-04..2026-08-03. They are flagged for review; no role was changed.

Largest disagreements:

- 238 clicks — `/natural-remedies-for-your-horse/` marked PRUNE
- 186 clicks — `/equine-ting-points/` marked PRUNE
- 102 clicks — `/we-are-all-flesh/` marked PRUNE
- 78 clicks — `/ouch-lose-the-bruise/` marked PRUNE
- 77 clicks — `/trek-pro-launch/` marked PRUNE
- 45 clicks — `/digital-pulse/` marked PRUNE
- 42 clicks — `/barefoot-booted-dressage-movement-reaches-olympic-level/` marked PRUNE
- 40 clicks — `/cavallo-hoof-boots-for-healing/` marked PRUNE
- 38 clicks — `/category/miniature-horses-vse/` marked NOINDEX
- 38 clicks — `/do-cavallo-hoof-boots-stay-on/` marked PRUNE

The wider picture: the classifier was directionally right. All 787 PRUNE+NOINDEX rows together
hold about 4% of site clicks. This is a thin tail of wrong calls, not a systemic failure.
