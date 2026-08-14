# Cavallo nav redesign — mockup handoff

**For:** whoever/whatever mocks this up (Figma, Claude-in-Figma, etc.)
**Source of full reasoning:** `docs/superpowers/specs/2026-08-13-shop-nav-restructure-design.md` — this
handoff is the actionable summary; that doc has the GA4 data, the classification evidence, and the
"why" behind every call below. Check it if a decision here seems unmotivated.

**Design system:** use the existing Cavallo token library already in the Figma file — colors, type,
spacing, component styles. Nothing here asks for new brand styling. This is a structure and content
brief, not a visual-design brief.

---

## Four things to build, per Mark (2026-08-13)

1. **Homepage — redesigned to funnel people to the new categories, not the old hoof-boot category.**
2. **Homepage — call out the new pillars** (Pillar 2 Hoof Health & Conditions, Pillar 3 Barefoot Horse
   Care), which have zero homepage presence today.
3. **The new navigation itself** (5-item top nav + mega-menu content).
4. **The mega menu, mocked up AND prototyped — interactive, on both desktop and mobile** — not just
   static frames. Wire up real click/hover states so it can be clicked through, not just looked at.

Everything below is organized under these four, with the underlying screens each one requires.

---

## 1. Homepage — funnel to the new categories, not the hoof-boot category

**What's wrong today:** the hero's only CTA is "Shop Hoof Boots," pointing straight at
`/product-category/hoof-boot/` — the old, single, undifferentiated shop entry. The category carousel
further down the page ("Shop by Style") is currently the *only* place animal/style choice appears, and
it's several scrolls below the fold, showing the 8 old boot-model tiles (Trek/Simple/Sport/etc.), not
animal types.

**What needs to change:** the animal/condition choice — Horse, Donkey, Mini, Draft, Acute Laminitis,
Accessories — needs to be the *primary* path out of the homepage, not a secondary carousel. Two
layout directions worth mocking up and comparing, since this is a real visual/UX call, not something
to settle in a doc:

- **Direction A — hero CTA repoints, carousel moves up.** Keep the hero as a single H1 + CTA button,
  but change the button's label and destination from "Shop Hoof Boots" → hub, to something like "Find
  Your Boot" → the rebuilt `/shop-cavallo/` (which is now the category-picker page, see section 3
  below). Move the re-contented category carousel (Horse/Donkey/Mini/Draft/Accessories tiles) up to
  be the *second* section on the page, immediately after the hero — first thing visible after one
  scroll, not five.
- **Direction B — hero *is* the category picker.** Merge hero and carousel into one section: H1 +
  trust badges at top, the 5-6 category tiles directly embedded below it, no separate mid-page
  carousel needed. More aggressive, but removes a scroll between "I arrived" and "here's how to find
  my boot."

Mock up both, see which reads better with the real Cavallo photography and layout, rather than
picking one now.

**What stays:** Featured-Products' "Shop All" CTA continues to point at `/shop-cavallo/` (now more
useful, since that page is being rebuilt as the real category picker rather than a thin orphaned page)
— testimonials/brand/newsletter content below the fold is untouched.

## 2. Homepage — call out the pillars

**What's missing today:** Pillar 2 (`/horse-hoof-care/`) and Pillar 3 (`/barefoot-horse-care/`) have
*zero* homepage presence. The existing "Featured Guides" block links to sizing/technology/reviews
content, but nothing points at either pillar hub. This mockup assumes both are live on production
(Mark's call — design for the post-publish state, not today's).

**What to add:** a new homepage section — call it something plain like "Learn About Hoof Care" or
"Guides & Resources" (not jargon) — sitting after the category section from item 1, before the
brand/testimonial content. Tile or card layout, one entry per:

- **Hoof Health & Conditions** (Pillar 2 hub) — the authority/condition pillar (laminitis, navicular,
  etc.)
- **Barefoot Horse Care** (Pillar 3 hub) — the wild-horse/trimming pillar
- Optionally a third card for the buying guide / How to Measure, if a trio reads better visually than
  a pair — designer's call.

Pillar 1 doesn't need its own card here — it's already the shop hub, already getting primary
placement via item 1's funnel. This section is specifically to give 2 and 3 a homepage entry point
they currently don't have anywhere on the site.

## 3. The new navigation

**Top nav, closed state — five items:** Shop · How to Measure · Learn · About · Contact Us.

Worth trying two visual treatments and comparing: all five equal weight, vs. Shop visually weighted
heavier (button-style vs. plain link) given it alone carries roughly 80% of everything the current
nav links to.

**`/shop-cavallo/` rebuilt** — this is the page "Shop" links to when *clicked* (not hovered), and it's
the category picker referenced in item 1. Full-page tile grid: Horse, Donkey, Mini, Draft, Acute
Laminitis, Accessories as large tiles (need real photography, not icons or plain labels — that's the
whole point, per Mark's original complaint that people don't know what "Trek" or "ELB" means).
Secondary product lines (Other Products, Canine, Clothing) appear lower on the
page, smaller. **No Saddle Pads and no Pro-Flex Splint Boots anywhere — both lines are being
discontinued.**

**Hoof-boot hub's "By Horse Type" section** — existing placeholder section on
`/product-category/hoof-boot/` currently points at old boot-model subcategory links. Re-content its
rows to the 4 animal categories + Acute Laminitis (5 tiles; Accessories isn't part of this specific
section, it's cross-sold elsewhere on the same hub page already).

## 4. The mega menu — mocked up AND prototyped, desktop and mobile

This needs to be a working click-through prototype (Figma prototyping — linked frames with real
interactions), not a set of disconnected static screens. Build every state below and wire the
transitions between them.

### Desktop — hover-triggered (or click; see open question below)

| State | Shows |
|---|---|
| Nav closed | The 5-item bar, nothing open |
| Shop open | Primary row: Horse, Donkey, Mini, Draft, Acute Laminitis, Accessories (large photo tiles). Secondary row, smaller: Other Products, Canine, Clothing. No Saddle Pads, no Pro-Flex Splint Boots — both discontinued. |
| Learn open | 3 columns — **Hoof Health & Conditions** (Laminitis Guide, Navicular, Hoof Rehab, "see all conditions" link to the Pillar 2 hub); **Barefoot Horse Care** (Why Barefoot?, "see all" link to the Pillar 3 hub); **Buying & Sizing Guides** (FAQ, How to Measure, Ask an Expert) |
| About open | 3 sections — **Our Story** (About, Team, Cavallo Gives, Associate Sellers, Affiliate Program, Donations, Research Behind Cavallo Boots, Hoof Boot Technology); **Reviews** (plain label, not "social proof" — Real Stories, Experts, Celebrities, Submit a Review); **News & Updates** (Newsletters, Media, Video Library, Blog) |

Prototype the transitions between all four states (closed → each open state, and back), so it can
actually be clicked through, hovered through, and demoed — not just viewed as flat frames.

### Mobile — accordion, one level deep (already enforced in code today)

| State | Shows |
|---|---|
| Drawer closed | Hamburger icon only |
| Drawer open | 5 top-level items, flat list, nothing expanded |
| One branch expanded (mock Shop, since it's the one that most needs checking) | Same one-level children as desktop's Shop mega-menu content, in an accordion list — no tile/photo treatment needed here, mobile stays a simple list per the existing code constraint |

Prototype drawer open/close and at least one accordion expand/collapse, same reasoning as desktop —
needs to be clickable, not just illustrated.

---

## Things this mockup does NOT need to solve

- Individual condition-spoke pages (thrush, DSLD, white line, etc.) or their content — those link from
  the Pillar 2 hub itself, not from the nav or homepage.
- The Acute Laminitis landing page's own design — that's `next-actions.md` item 2's build, in flight
  separately. Just needs a tile/link pointing at it.
- Category page templates beyond the hub's existing pattern — Horse/Donkey/Mini/Draft reuse the same
  archive template the hub already has (product grid + buyer's guide copy blocks), just retitled.
- Any saddle-pad content, anywhere.

## Known open decisions for whoever builds the real interaction (not just the prototype)

- Hover-to-open vs. click-to-open for the desktop mega-menus (today's nav is pure CSS `:hover`; a real
  mega-menu should probably reconsider this for accessibility/touch-laptop reasons — try both in the
  prototype if easy, it'll make this decision more concrete for Mark to react to).
- Whether How to Measure's nav target is `/how-to-measure/` or its larger untracked twin
  `/things-to-know/how-to-measure/` — pending `next-actions.md` item 1's review, not a design call.
- Which homepage layout direction (A or B, item 1) actually reads better — resolve visually, not here.
