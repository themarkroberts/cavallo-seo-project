#!/usr/bin/env python3
"""
build_disposition_map.py — Content Disposition Map (Step 2, the keystone).

Reads cavallo_page_audit.csv and produces content_disposition_map.csv:
one row per URL -> Pillar . Role . Destination URL . Evidence . Source . Needs Review.

Two layers:
  1. SEED  — 30 audit-verified rows locked from architecture decisions #1-#4
            (PILLAR-BUILD-PLAN.md). Source=Seed, never auto-overridden.
  2. AUTO  — the long tail, classified from traffic / inbound links / word count
            / topic. Uncertain calls get Needs Review=True for Mark's Step 3 pass.

Role taxonomy (one role per URL = no cannibalization):
  KEEP-CANONICAL | OPTIMIZE | KEEP-SPOKE | MERGE+301 | REWRITE | NOINDEX | PRUNE

Re-runnable. Pure function of the audit CSV + the seed table below.
"""
import csv, sys, re
from collections import Counter

SRC = "cavallo_page_audit.csv"
OUT = "content_disposition_map.csv"
BASE = "https://cavallo-inc.com"

# ---- pillar labels (kept short for Notion selects) ----
P1 = "Pillar 1 — Hoof Boots"
P2 = "Pillar 2 — Hoof Health"
P3 = "Pillar 3 — Barefoot"
NONE = "None"

# ---- canonical destinations (existing URLs + NEW-page placeholders) ----
D_BOOT      = f"{BASE}/product-category/hoof-boot/"
D_LAMINITIS = f"{BASE}/your-cavallo-laminitis-healing-plan/"
D_NAVICULAR = f"{BASE}/is-navicular-disease-always-the-beginning-of-the-end/"
D_DIET      = f"{BASE}/equine-nutrition/"
D_BAREFOOT  = f"{BASE}/category/the-barefoot-horse/"
D_P2_NEW    = "(NEW) Pillar 2 — Hoof Health & Conditions page"
D_THRUSH    = "(NEW) Pillar 2 — Thrush spoke"
D_WLD       = "(NEW) Pillar 2 — White Line Disease spoke"
D_ABSCESS   = "(NEW) Pillar 2 — Hoof Abscess spoke"
D_WILD      = "(NEW) Pillar 3 — Wild Horse Hooves spoke"
D_TRIM      = "(NEW) Pillar 3 — Barefoot Trimming spoke"
D_PRUNE     = "301 -> nearest relevant page (review)"


def slug(u: str) -> str:
    u = (u or "").split("cavallo-inc.com")[-1]
    if not u.startswith("/"):
        u = "/" + u
    if not u.endswith("/"):
        u += "/"
    return u


def num(x) -> float:
    try:
        return float(x)
    except (TypeError, ValueError):
        return 0.0


# =====================================================================
# LAYER 1 — SEED rows (locked from decisions #1-#4). slug -> dict
# =====================================================================
SEED = {}

def seed(s, pillar, role, dest, ev):
    SEED[slug(s)] = dict(pillar=pillar, role=role, dest=dest, ev=ev)

# Pillar anchors (canonicals referenced by the decisions / build spec)
seed("/product-category/hoof-boot/", P1, "KEEP-CANONICAL", "",
     "Pillar 1 canonical (commercial hub). #1 asset ~1,286 visits/mo. Add buyer's-guide copy; stays transactional.")
seed("/category/the-barefoot-horse/", P3, "KEEP-CANONICAL", "",
     "Pillar 3 canonical. Convert thin archive -> real pillar. Cluster: barefoot horse.")

# Decision #1 — Founder scatter -> MERGE+301 into Laminitis spoke
seed("/your-cavallo-laminitis-healing-plan/", P2, "KEEP-CANONICAL", "",
     "Laminitis spoke canonical (head term 5,500). 3,299w, 11 visits. Absorbs founder scatter as combined 'Laminitis & Founder' guide w/ social-proof blocks. (Decision #1)")
for s, w in [("/laminitis-navicular-and-founder/", "278w; shared w/ navicular (Decision #3) — assigned to Laminitis per Decision #1"),
             ("/hoof-boots-save-foundered-mare/", "761w foundered-mare story -> social-proof block"),
             ("/update-hoof-boots-save-foundered-mare/", "246w update -> social proof"),
             ("/update-hoof-boots-save-foundered-mare-2/", "525w update -> social proof"),
             ("/update-hoof-boots-save-foundered-mare-3/", "258w update -> social proof"),
             ("/two-year-anniversary-in-founder-valley/", "2,014w narrative -> social proof; diet-as-trigger re-home target also = Laminitis (Decision #1 & #4)")]:
    seed(s, P2, "MERGE+301", D_LAMINITIS, f"Founder scatter, ~0 traffic/links. {w}. (Decision #1)")
seed("/newsletter/may-2-journal-founders-insights/", NONE, "KEEP-SPOKE", "",
     "FALSE POSITIVE — 'founder' = company founder, not the disease. Not part of laminitis cluster; leave as-is. (Decision #1)")

# Decision #3 — Navicular -> consolidate to ONE educational spoke
seed("/is-navicular-disease-always-the-beginning-of-the-end/", P2, "KEEP-CANONICAL", "",
     "Navicular spoke canonical. 1,936w, 129 visits; ranks 'when to euthanize a horse with navicular'. Add 'best boots for navicular' section + product CTA. (Decision #3)")
for s, w in [("/cavallo-boots-for-navicular/", "983w, 1 visit — commercial navicular page"),
             ("/faq/cavallo-hoof-boots-for-navicular/", "1,549w, 3 links — commercial navicular FAQ"),
             ("/give-navicular-the-boot/", "307w thin"),
             ("/kicking-naviculars-butt/", "593w thin"),
             ("/navicular-seek-truth/", "671w thin"),
             ("/from-navicular-to-prancing/", "128w thin"),
             ("/wrestling-navicular-trust-your-gut/", "127w thin")]:
    seed(s, P2, "MERGE+301", D_NAVICULAR, f"{w}. (Decision #3)")
seed("/faq/cavallo-hoof-boots-for-therapy-and-rehabilitation/", P1, "KEEP-SPOKE", "",
     "1,808w, 7 links. Therapy/rehab page; only mentions navicular -> KEEP SEPARATE as its own Pillar 1 spoke. (Decision #3)")

# Decision #4 — Diet/nutrition -> ONE educational spoke under Pillar 2
seed("/equine-nutrition/", P2, "KEEP-CANONICAL", "",
     "Diet->hoof spoke canonical (411w, best slug). Targets 'horse diet' 800 KD21 + 'equine nutrition' 400 KD21. Educational; soft-link to boots, no hard CTA. (Decision #4)")
for s, w in [("/balancing-minerals-to-build-the-best-hoof/", "979w"),
             ("/hay-facts/", "631w"),
             ("/a-balanced-diet-creates-a-healthy-hoof/", "380w"),
             ("/are-you-feeding-your-horse-like-a-cow/", "408w, 9 visits")]:
    seed(s, P2, "MERGE+301", D_DIET, f"Thin diet post, ~0 equity, founder-voice. {w}. (Decision #4)")
# Re-home (diet-adjacent -> belongs elsewhere)
seed("/all-things-barefoot-4/", P3, "KEEP-SPOKE", "",
     "435w. Re-homed from diet -> Pillar 3 Barefoot. (Decision #4)")
seed("/spring-is-here/", P2, "MERGE+301", D_LAMINITIS,
     "224w. Re-homed from diet; diet-as-trigger / social proof -> Laminitis spoke. (Decision #4)")
seed("/dr-robert-bowker-talks-holistic-care/", P3, "KEEP-SPOKE", "",
     "283w. Re-homed from diet -> Pillar 3 holistic supporting content. (Decision #4)")
seed("/herbs-for-horses/", P3, "KEEP-SPOKE", "",
     "289w. Re-homed from diet -> Pillar 3 holistic supporting content. (Decision #4)")
# Prune (off-topic)
seed("/fall-pasture-maintenance-chores-add-list/", NONE, "PRUNE", D_PRUNE,
     "391w. Land/field maintenance, not equine diet -> off-topic. 301 to nearest relevant page. (Decision #4)")
seed("/cavallo-now-offers-natural-solutions-natural-stride-joint-supplements/", NONE, "PRUNE", D_PRUNE,
     "526w. Old joint-supplement promo -> off-topic. 301 to nearest relevant page. (Decision #4)")


# =====================================================================
# LAYER 2 — AUTO topic classifier
# =====================================================================
# Sub-topic keyword sets -> (pillar, destination, tag). Order = priority.
SUBTOPICS = [
    # Pillar 2 conditions (own their head terms) — checked before generic boots
    (["laminitis", "founder", "laminitic"],                 P2, D_LAMINITIS, "laminitis/founder"),
    (["navicular"],                                          P2, D_NAVICULAR, "navicular"),
    (["white line", "seedy toe"],                            P2, D_WLD,       "white line disease"),
    (["thrush"],                                             P2, D_THRUSH,    "thrush"),
    (["abscess"],                                            P2, D_ABSCESS,   "hoof abscess"),
    (["equine nutrition", "horse diet", "hay", "minerals", "biotin",
      "supplement", "nutrition", "feeding"],                 P2, D_DIET,      "diet/nutrition"),
    (["hoof anatomy", "healthy hoof", "hoof care", "hoof health", "hoof problem",
      "hoof growth", "hoof moisture", "wet hoof", "dry hoof", "heel bulb",
      "contracted heel", "thin sole", "sole bruis", "quarter crack", "hoof crack",
      "hoof wall", "frog ", "coffin bone", "hoof condition", "cracked hoof"], P2, D_P2_NEW, "hoof health/anatomy"),
    # Pillar 3 barefoot
    (["wild horse", "mustang", "self-trim", "self trim"],    P3, D_WILD,      "wild horse hooves"),
    (["barefoot trim", "hoof trim", "horse hoof trimming", "trimming", "natural trim"],
                                                             P3, D_TRIM,      "barefoot trimming"),
    (["barefoot", "transition", "pull the shoes", "out of shoes", "metal shoe",
      "going barefoot", "shoeless", "holistic"],             P3, D_BAREFOOT,  "barefoot care"),
    # Pillar 1 commercial boots (generic — lowest priority so conditions win overlaps)
    (["hoof boot", "horse boot", "boots for horses", "hoof shoe", "horse shoe",
      "horseshoe", "pony boot", "donkey boot", "draft boot", "trek boot",
      "simple boot", "sport boot", "elb", "cavallo boot", "how to measure",
      "important points", " boot ", "booted", "booting"],    P1, D_BOOT,      "boots (commercial)"),
]

def detect_topic(blob):
    for kws, pillar, dest, tag in SUBTOPICS:
        for kw in kws:
            if kw in blob:
                return pillar, dest, tag
    return NONE, "", "off-topic"


# Core/utility pages: never assign a pillar (they'd pollute the playbook views) even
# though they mention "boots". They are site furniture, kept as-is.
CORE_SLUGS = {"/", "/about/", "/reviews/", "/shop-cavallo/", "/faq/", "/blog/", "/news/",
              "/cart/", "/checkout/", "/my-account/", "/contact/", "/contact-us/"}
CORE_SUBSTR = ("warrant", "guarantee", "privacy", "return", "shipping", "terms",
               "about-us", "contact", "reviews", "/account", "wholesale", "dealer", "affiliate")

def is_core_page(s):
    return s in CORE_SLUGS or any(k in s for k in CORE_SUBSTR)


def classify(r):
    """Return (pillar, role, dest, evidence, needs_review) for a non-seed row."""
    t = r["type"]
    idx = r["indexable"]
    tr = num(r["org_traffic_est"])
    li = num(r["links_in"])
    wc = num(r["word_count"])
    blob = " ".join([r.get("title", ""), r.get("focus_keyword", ""), r.get("top_keyword", ""),
                     r.get("ranking_keywords", ""), r.get("h1", ""), r.get("summary", ""),
                     slug(r["url_live"]).replace("-", " ")]).lower()
    pillar, dest, tag = detect_topic(blob)
    if t == "page" and is_core_page(slug(r["url_live"])):
        pillar, dest, tag = NONE, "", "core/utility page"
    metrics = f"{t}, wc={int(wc)}, tr={int(tr)}, li={int(li)}"
    equity_high = tr >= 10 or li >= 3
    equity_some = tr >= 1 or li >= 1

    # --- non-post types: largely mechanical ---
    if t == "video":
        return NONE, "NOINDEX", "", f"AUTO. Video{' (already noindex)' if idx=='No' else ''}; not a search target.", False
    if t in ("post_tag (group)", "testimonial-tag (group)", "product_tag (group)") or r["site_section"] == "Taxonomy archives (thin)":
        return NONE, "NOINDEX", "", "AUTO. Thin tag/taxonomy archive -> noindex (Yoast taxonomy setting, Step 4).", False
    if t == "category":
        # blog category archives: noindex unless it maps to a pillar topic (might become a hub)
        return (pillar if pillar != NONE else NONE), "NOINDEX", "", f"AUTO. Blog category archive -> noindex (thin auto-archive). Topic: {tag}.", False
    if t == "product":
        return P1, "KEEP-SPOKE", "", f"AUTO. {metrics}. Product page (ACF) — commercial asset; cross-link from Pillar 1.", False
    if t == "product_cat":
        return P1, "KEEP-SPOKE", "", f"AUTO. {metrics}. Product subcategory — Pillar 1 'types & use cases' target.", False
    if t == "team":
        if idx == "No":
            return NONE, "NOINDEX", "", "AUTO. Team/about page, already noindex.", False
        return NONE, "KEEP-SPOKE", "", f"AUTO. {metrics}. Team/about page — keep.", False
    if t == "faq":
        # FAQs are kept spokes regardless; assign a pillar by topic. Mechanical (not a judgment call).
        return (pillar if pillar != NONE else NONE), "KEEP-SPOKE", "", f"AUTO. {metrics}. FAQ ({tag}) — keep as spoke; link to {pillar if pillar!=NONE else 'relevant pillar'}.", False
    if t == "newsletter":
        if equity_high:
            return pillar, "KEEP-SPOKE", "", f"AUTO. {metrics}. Newsletter w/ organic equity — keep; confirm pillar.", True
        return NONE, "NOINDEX", "", f"AUTO. {metrics}. Newsletter archive -> noindex (low-value, keep live for users).", False
    if t == "page":
        if equity_high:
            role = "OPTIMIZE" if pillar != NONE else "KEEP-SPOKE"
            return pillar if pillar != NONE else NONE, role, "", f"AUTO. {metrics}. Core/marketing page w/ equity ({tag}) — keep; confirm pillar.", True
        if pillar != NONE:
            return pillar, "KEEP-SPOKE", "", f"AUTO. {metrics}. Core/marketing page on-topic ({tag}) — keep & link to pillar.", False
        return NONE, "KEEP-SPOKE", "", f"AUTO. {metrics}. Core/utility page — keep as-is.", False

    # --- posts: the main long tail ---
    # MERGE+301 is reserved for content worth folding in (real equity OR substantive on-topic copy).
    # Thin, zero-equity on-topic posts just PRUNE (301 redirect) to their pillar — nothing to merge.
    if t == "post":
        if equity_high:
            if pillar != NONE:
                return pillar, "OPTIMIZE", "", f"AUTO. {metrics}. Organic equity + on-topic ({tag}) -> optimize & link to pillar.", True
            return NONE, "KEEP-SPOKE", "", f"AUTO. {metrics}. Has equity but off-topic — KEEP (don't prune); review.", True
        if pillar != NONE:
            if equity_some or wc >= 700:
                why = "some equity to consolidate" if equity_some else f"substantive on-topic copy ({int(wc)}w)"
                return pillar, "MERGE+301", dest, f"AUTO. {metrics}. On-topic ({tag}), {why} -> merge into {dest}.", False
            return pillar, "PRUNE", dest, f"AUTO. {metrics}. On-topic ({tag}) but thin & zero-equity -> prune (301 to {tag} pillar).", False
        # off-topic, no real equity
        if wc >= 800:
            return NONE, "REWRITE", "", f"AUTO. {metrics}. Substantial ({int(wc)}w) but off-topic -> review (repurpose or prune).", True
        return NONE, "PRUNE", D_PRUNE, f"AUTO. {metrics}. No traffic, no links, off-topic, thin -> prune.", False

    # fallback
    return NONE, "KEEP-SPOKE", "", f"AUTO. {metrics}. Unclassified type '{t}' — review.", True


def main():
    rows = list(csv.DictReader(open(SRC)))
    out = []
    seed_hit = 0
    for r in rows:
        u = r["url_live"].strip()
        if not u:
            u = BASE + slug(r.get("title", "")) if r.get("title") else ""
        s = slug(u)
        if s in SEED:
            d = SEED[s]
            out.append([u, d["pillar"], d["role"], d["dest"], d["ev"], "Seed", "No"])
            seed_hit += 1
        else:
            pillar, role, dest, ev, rev = classify(r)
            out.append([u, pillar, role, dest, ev, "Auto", "Yes" if rev else "No"])

    with open(OUT, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["url", "pillar", "role", "destination_url", "evidence", "source", "needs_review"])
        w.writerows(out)

    # ---- report ----
    print(f"rows written: {len(out)}  (seed matched: {seed_hit}/{len(SEED)})")
    miss = [s for s in SEED if s not in {slug(r['url_live']) for r in rows}]
    if miss:
        print("!! SEED slugs not found in audit:", miss)
    print("\n--- Role ---")
    for k, v in Counter(o[2] for o in out).most_common():
        print(f"{v:5}  {k}")
    print("\n--- Pillar ---")
    for k, v in Counter(o[1] for o in out).most_common():
        print(f"{v:5}  {k}")
    print("\n--- Source ---")
    for k, v in Counter(o[5] for o in out).most_common():
        print(f"{v:5}  {k}")
    print(f"\nNeeds Review = Yes: {sum(1 for o in out if o[6]=='Yes')}")


if __name__ == "__main__":
    main()
