# Design prompt — the mega menu

Paste into Claude Design. Focused scope: just the three mega-menu panels (Shop, Learn, About) and
their interaction states, desktop and mobile. Use the existing Cavallo design tokens — this is
content and structure, not new visual identity. Full background/reasoning lives in
`docs/superpowers/specs/2026-08-13-shop-nav-restructure-design.md` if anything here seems
unmotivated.

**Top-level nav, five items:** Shop · How to Measure · Learn · About · Contact Us. How to Measure
and Contact Us are plain links, no menu. The other three open panels as specified below.

---

## Shop panel

**Three visibly separate zones — not one flat list fading into a smaller row. This is the whole
point of this panel; get the separation right or the panel fails at its job.**

- **Zone 1 — "Shop by Horse Type"** (largest visual weight, real photo tiles, not icons): **Horse,
  Donkey, Mini, Draft, Acute Laminitis.** Five tiles. This is the primary funnel — the reason this
  redesign exists — and needs to read as the dominant thing in the panel.
- **Zone 2 — "Hoof Boot Accessories"** (its own small callout, visually between Zone 1 and Zone 3,
  not merged into either): one tile/link. Pads, straps, studs live under it — don't flatten those
  into the panel itself.
- **Zone 3 — "More from Cavallo"** (smallest, clearly secondary): **Other Products** and **Canine
  and Clothing** — actually just one destination ("Other Products"), whose own page contains
  Hoof Care Products, Fly Masks and Halters, Books, Canine, Clothing, Other Cool Stuff. Don't
  flatten those sub-items into this panel either — that's the exact mistake the current live nav
  makes today, three levels deep of stuff nobody needs to see from the header.

**Explicitly exclude: Saddle Pads and Pro-Flex Splint Boots.** Both product lines are being
discontinued — they should not appear anywhere in this panel, not even in Zone 3.

**Destinations** (for wiring up the prototype, not new pages — five of six already exist):

| Tile | Links to | Status |
|---|---|---|
| Horse | `/product-category/hoof-boot/` | existing (the hub) |
| Donkey | `/product-category/hoof-boot/leb-long-ear-hoof-boots-for-donkeys/` | existing, re-copied |
| Mini | `/product-category/hoof-boot/mini-hoof-boots/` | existing, re-copied |
| Draft | `/product-category/hoof-boot/bfb-hoof-boots/` | existing, re-copied |
| Acute Laminitis | `/hoof-boots-for-laminitis/` | **the only new page**, built separately |
| Accessories | `/product-category/hoof-boot-accessories/` | existing, unchanged |
| Other Products | `/product-category/other-products/` | existing, unchanged |

## Learn panel

Three columns:

- **Hoof Health & Conditions** — Laminitis & Hoof Issue Guide, Navicular, Using Cavallos for Hoof
  Rehab, then a "See all conditions →" link to the Pillar 2 hub (`/horse-hoof-care/`, already live)
- **Barefoot Horse Care** — Why Barefoot?, then "See all →" to the Pillar 3 hub
  (`/barefoot-horse-care/`, already live)
- **Buying & Sizing Guides** — Hoof Boots FAQ, How to Measure, Ask an Expert

Clicking "Learn" itself (not just hovering) → `/things-to-know/`, the existing education hub,
repurposed as the panel's landing page.

## About panel

Three sections:

- **Our Story** — About, Meet the Team, Cavallo Gives, Associate Sellers Program, Affiliate
  Program, Donations, **and three separately-billed research/credibility pages, not merged**: The
  Research Behind Cavallo Boots, Hoof Boot Technology, and the Consteed Smart Hoof Sneaker
  partnership page (already built elsewhere — link to it, don't redesign it here)
- **Reviews** (plain label, not "Social Proof") — Real Stories, Horse Industry Experts, Celebrities,
  Submit a Review
- **News & Updates** — Newsletters, Cavallo in the Media, Video Library, Notable Blogs

---

## Interaction states to build and prototype

Not static screens — wire these as an actual click/hover-through prototype.

**Desktop:**
1. Nav closed
2. Shop open (three zones visible, per above)
3. Learn open (three columns)
4. About open (three sections)
5. Transitions between all four states, including closing one panel when another opens

**Mobile** (drawer + one-level accordion — the theme already caps mobile at one level deep in code,
so this isn't a new constraint, just needs the right content in it):
1. Drawer closed (hamburger)
2. Drawer open — five top-level items, flat
3. Shop expanded — flat list version of the three zones (no photo tiles needed on mobile, a simple
   grouped list with the same three-zone separation preserved via spacing/labels, not tiles)
4. Learn expanded, About expanded — same accordion pattern

**Open question for you to resolve visually, not textually:** hover-to-open vs. click-to-open on
desktop. Today's live nav is pure CSS `:hover` with no JS. A real three-zone Shop panel is dense
enough that click-to-open (with a clear close affordance) may serve better than hover, especially
for trackpad/touch-laptop users. Worth prototyping both if time allows, so there's something
concrete to react to.
