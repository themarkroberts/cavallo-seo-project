# Design prompt — nav, homepage, hoof-boot hub

Paste into Claude Design against the `seo` worktree. Everything below is grounded in the **actual
live staging build** (`cavallo.seo.markroberts.io`) as of 2026-08-13, not an abstraction — real
copy, real hrefs, real current gaps. Use the existing Cavallo design tokens; this is a content and
structure brief, not a fresh visual identity.

---

## 1. Navigation

**Current state (verified live):** "Shop" dropdown mixes three different kinds of things at the same
tier: the animal-facing categories, unrelated secondary product lines (Saddle Pads, Other Products,
Clothing, Canine, Pro-Flex), and one bare content link ("Best Boot Warranty") with no real category
home. Top-level items: Shop · How to Measure · Get Boot Smart! · Reviews · Behind the Brand ·
What's New? · Contact Us.

**Change to:** Shop · How to Measure · Learn · About · Contact Us.

**Shop dropdown — give it three visibly separate zones, not one flat list fading into a smaller
row.** This is a deliberate fix, not a size gradient:

- **Zone 1 — "Shop by Horse Type"** (largest visual weight, photo tiles): Horse, Donkey, Mini, Draft,
  Acute Laminitis. Five destinations, each a distinct animal or condition — this is the core funnel
  and should read as its own clearly headed group.
- **Zone 2 — "Hoof Boot Accessories"** (its own small callout, not folded into Zone 1 or Zone 3): pads,
  straps, studs. Still hoof-boot-related, just not animal-specific — deserves a visible seam on
  either side of it.
- **Zone 3 — "More from Cavallo"** (smallest, clearly secondary): Other Products, Canine, Clothing.
  Genuinely different product lines, not part of the animal decision at all. **No Saddle Pads, no
  Pro-Flex Splint Boots anywhere in the new nav — both lines are being discontinued** (Mark,
  2026-08-14; Saddle Pads confirmed 2026-08-13).

Move "Best Boot Warranty" out of this menu entirely — footer, or a link inside category pages.

**Learn dropdown** (replaces "Get Boot Smart!" — reuses the real, already-built content, doesn't
invent anything): three columns.
- *Hoof Health & Conditions* → `/horse-hoof-care/` (live), plus Laminitis & Hoof Issue Guide, Navicular,
  Using Cavallos for Hoof Rehab as sub-links
- *Barefoot Horse Care* → `/barefoot-horse-care/` (live), plus Why Barefoot? as a sub-link
- *Buying & Sizing Guides* → Hoof Boots FAQ, How to Measure, Ask an Expert

**About dropdown** (replaces "Behind the Brand" + folds in Reviews + What's New — three branches
carrying 6.2% of nav-linked traffic combined, into one organized menu):
- *Our Story* — About, Meet the Team, Cavallo Gives, Associate Sellers Program, Affiliate Program,
  Donations, **and all three separately-billed research/credibility pages**: The Research Behind
  Cavallo Boots (`/why-are-cavallo-hoof-boots-the-best/`), Hoof Boot Technology
  (`/our-hoof-boot-technology/`), and the Consteed Smart Hoof Sneaker page
  (`/meet-the-consteed-smart-hoof-sneaker/`) — three distinct stories, not merged.
- *Reviews* (plain label) — Real Stories, Horse Industry Experts, Celebrities, Submit a Review
- *News & Updates* — Newsletters, Cavallo in the Media, Video Library, Notable Blogs

**How to Measure and Contact Us** stay exactly as-is, standalone.

---

## 2. Homepage

**Current state (verified live, staging):** just a hero (full-bleed photo, H1 "The World's Most
Trusted Hoof Boots," CTA "Shop Hoof Boots") and one brand block ("Why Choose Cavallo Hoof Boots?").
Nothing else exists yet on this build — this is closer to a blank canvas than a page needing rework.

**Build, in order:**

1. **Hero** — keep the photo treatment, but change the CTA from "Shop Hoof Boots" (→ the hub) to
   something that leads with the animal choice — e.g. "Find Your Boot" → the rebuilt `/shop-cavallo/`
   category picker, OR embed the category tiles directly under the hero so the animal choice is the
   first thing below the fold. Try both, compare.
2. **Shop by Horse Type** — a tile row: Horse, Donkey, Mini, Draft, Accessories (Acute Laminitis can't
   sit in a taxonomy-only carousel component — give it a separate small callout instead, it's a
   condition/patented-differentiator story that earns distinct treatment anyway).
3. **Guides & Resources** (new — nothing like this exists on the homepage today) — cards linking to
   Hoof Health & Conditions (`/horse-hoof-care/`) and Barefoot Horse Care (`/barefoot-horse-care/`).
4. **Consteed callout** (new) — the smart-hoof-sneaker partnership deserves real homepage visibility:
   award-winning tech collaboration, not a boot Cavallo sells. Link to
   `/meet-the-consteed-smart-hoof-sneaker/` (already built, high-fidelity, real Cavallo tokens — reuse
   its assets/photography, don't re-design that page).
5. Existing "Why Choose Cavallo" brand block — keep, position after the above.

---

## 3. Hoof-boot hub (`/product-category/hoof-boot/`)

**This page is fully built already** — intro, 8-model shop-by-category filter, "What Are Hoof Boots
Used For," buying guide, "Boot Types & Models" comparison table (Trek/Simple/Sport/ELB/BFB/CLB/LEB/
Bling — already labeled by best-for animal, e.g. BFB = "Cavallo exclusive, draft horses"), "By Horse
Type," Accessories, "Boots for Laminitis," Sizing (with the WKU study link), and FAQ. Work *with*
this structure — don't redesign it.

**Specific fixes needed:**

- **"By Horse Type" section** — currently 4 links, each missing its path prefix and pointing at
  arbitrary destinations ("Horses" → `/trek-hoof-boots/`, a single model, not a real horse
  destination). Fix to: Donkey → `/product-category/hoof-boot/leb-long-ear-hoof-boots-for-donkeys/`,
  Mini → `/product-category/hoof-boot/mini-hoof-boots/`, Draft →
  `/product-category/hoof-boot/bfb-hoof-boots/`, plus add a 5th tile for Acute Laminitis →
  `/hoof-boots-for-laminitis/`. Drop "Horses" from this section — the hub itself already is the horse
  experience; a self-referential tile adds nothing.
- **"Boots for Laminitis" section** — currently links to `/faq/cavallo-hoof-boots-for-laminitis/`.
  Repoint to `/hoof-boots-for-laminitis/` once that page ships (`next-actions.md` item 2). Don't
  build a second laminitis destination.
- **Consteed callout** (new) — add a block here too, same reasoning as the homepage: this is where
  buyers are already evaluating hoof-boot technology, a natural place for the biomechanics-monitoring
  partnership to earn a mention. Link to the existing built page.

---

## Not in this prompt

- The About page's internal layout — flagged above as a nav destination, not designed here.
- Any changes to the Consteed page itself — already built, reuse as-is.
- Acute Laminitis's own page content — `next-actions.md` item 2's build, separate track.
