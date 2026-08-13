# Cavallo nav redesign — mockup handoff

**For:** whoever/whatever mocks this up (Figma, Claude-in-Figma, etc.)
**Source of full reasoning:** `docs/superpowers/specs/2026-08-13-shop-nav-restructure-design.md` — this
handoff is the actionable summary; that doc has the GA4 data, the classification evidence, and the
"why" behind every call below. Check it if a decision here seems unmotivated.

**Design system:** use the existing Cavallo token library already in the Figma file — colors, type,
spacing, component styles. Nothing here asks for new brand styling. This is a structure and content
brief, not a visual-design brief.

---

## What's being mocked up, in priority order

**Priority 1 — the actual Phase 3 deliverable, due this month, gated on Carole's sign-off:**

1. Desktop "Shop" mega-menu, closed and open states
2. Mobile "Shop" drawer, closed and open states
3. `/shop-cavallo/` rebuilt as the shop landing page
4. Homepage: updated "Shop by Style" carousel section + hero
5. Hoof-boot hub page: updated "By Horse Type" section

**Priority 2 — Mark's scope expansion, not on a deadline, not gated on Carole:**

6. Full desktop top nav, closed state (5 items)
7. Desktop "Learn" mega-menu, open state
8. Desktop "About" mega-menu, open state
9. Mobile drawer, full top-level list + one level expanded (any branch)

If time is short, stop after Priority 1 — it's the thing that's actually due.

---

## Screen-by-screen content

### 1–2. Shop mega-menu (desktop) / Shop drawer (mobile)

**Trigger:** hovering "Shop" (desktop) opens the mega-menu. Mobile: tapping "Shop" expands one
accordion level — no mega-menu treatment needed on mobile, it's still a simple list.

**Content, primary row (large tiles, one per animal/condition — these need real photography, not
icons, per Mark's original complaint that plain text labels don't mean anything to first-time
buyers):**

| Tile | Links to |
|---|---|
| Horse | `/product-category/horse-boots/` (new) |
| Donkey | `/product-category/donkey-boots/` (new) |
| Mini | `/product-category/mini-boots/` (new) |
| Draft | `/product-category/draft-boots/` (new) |
| Acute Laminitis | `/hoof-boots-for-laminitis/` (in flight separately, `next-actions.md` item 2 — don't design this landing page here, just the tile linking to it) |
| Accessories | `/product-category/hoof-boot-accessories/` (existing) |

**Content, secondary row (smaller, less visual weight — real product lines, just not the main
funnel):** Other Products · Canine · Clothing · Pro-Flex Splint Boots.

**Do not include:** Saddle Pads, anywhere. That line is being discontinued.

**Open design question for the mockup to resolve:** exact tile treatment (photo crop, hover state,
whether Acute Laminitis gets a visually distinct treatment as a "condition" vs. the four "animal"
tiles, given it's conceptually a different kind of category).

### 3. `/shop-cavallo/` rebuilt

This is the page "Shop" links to when *clicked*, not just hovered — currently thin/orphaned, needs a
real design. Content: the same 6 destinations as the mega-menu's primary row, as a full-page tile
grid (bigger version of the mega-menu content, basically — think a landing page, not a dropdown).
Secondary product lines (Other Products, Canine, Clothing, Pro-Flex) can appear lower on the page,
smaller.

### 4. Homepage carousel + hero

Existing block: a "Shop by Style" carousel currently showing 8 old boot-model tiles. Re-content it to
5 tiles: Horse, Donkey, Mini, Draft, Accessories (same photography direction as the Shop mega-menu).
**Acute Laminitis does not fit this carousel** (it's a taxonomy-only component; Laminitis is a
standalone page, not a category) — mock up a separate small callout for it near the hero instead,
distinct from the carousel.

Hero CTA stays "Shop Hoof Boots" → hub. Featured-Products CTA stays "Shop All" → the rebuilt
`/shop-cavallo/`.

### 5. Hoof-boot hub — "By Horse Type" section

Existing section on `/product-category/hoof-boot/`, currently a placeholder pointing at old boot-model
links. Re-content its rows to point at the 4 new animal categories + Acute Laminitis (5 rows/tiles,
no Accessories here — this section is specifically the animal/condition breakdown, Accessories is
cross-sold elsewhere on the same page already).

### 6. Full top nav, closed state

Five items, flat, no visual hierarchy needed between them except that Shop should probably read as
the "primary" action given it's 80% of all nav-linked traffic — worth trying a version where it's
visually weighted slightly heavier (button-style vs. plain text link) alongside a version where all
five are equal weight, and comparing.

**Shop · How to Measure · Learn · About · Contact Us**

### 7. Learn mega-menu (desktop, open state)

Three columns:

**Column 1 — Hoof Health & Conditions**
- Laminitis & Hoof Issue Guide
- Navicular
- Using Cavallos for Hoof Rehab
- *(a "see all conditions" link to the Pillar 2 hub itself, rather than listing every spoke)*

**Column 2 — Barefoot Horse Care**
- Why Barefoot?
- *(a "see all" link to the Pillar 3 hub)*

**Column 3 — Buying & Sizing Guides**
- Hoof Boots FAQ
- How to Measure
- Ask an Expert

Clicking "Learn" itself (not hovering) → `/things-to-know/`, repurposed as the Learn landing page.

### 8. About mega-menu (desktop, open state)

Three sections:

**Our Story** — About, Meet the Team, Cavallo Gives, Associate Sellers Program, Affiliate Program,
Donations and Sponsorships, Research Behind Cavallo Boots, Hoof Boot Technology
*(flag for whoever writes real copy later: these last two are near-duplicate "why Cavallo" content —
worth merging into one page before or during this build, not two)*

**Reviews** — Real Stories, Horse Industry Experts, Celebrities, Submit Your Review
*(label it "Reviews," plainly — not "Social Proof" or similar marketing language)*

**News & Updates** — Newsletters, Cavallo in the Media, Video Library, Notable Blogs

### 9. Mobile drawer, full structure

Mobile is already capped at one level of children in code — this mockup is mostly a content check,
not a new interaction pattern. Show: the 5 top-level items, and one branch (Shop is the most
important to check) with its accordion expanded to the new flat set of children.

---

## Things this mockup does NOT need to solve

- Individual condition-spoke pages (thrush, DSLD, white line, etc.) or their content — those link from
  the Pillar 2 hub itself, not from the nav.
- The Acute Laminitis landing page's own design — that's `next-actions.md` item 2's build, in flight
  separately.
- Category page templates beyond the hub's existing pattern — Horse/Donkey/Mini/Draft reuse the same
  archive template the hub already has (product grid + buyer's guide copy blocks), just retitled.
- Any saddle-pad content, anywhere.

## Known open decisions for whoever builds the real interaction (not just the visual mock)

- Hover-to-open vs. click-to-open for the mega-menus (today's nav is pure CSS `:hover`; a real
  mega-menu on desktop should probably reconsider this for accessibility/touch-laptop reasons).
- Whether How to Measure's nav target is `/how-to-measure/` or its larger untracked twin
  `/things-to-know/how-to-measure/` — pending `next-actions.md` item 1's review, not a design call.
