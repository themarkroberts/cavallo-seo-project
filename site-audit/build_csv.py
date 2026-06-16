#!/usr/bin/env python3
"""Assemble the final Cavallo page-audit master CSV.
Merges: DB spine (spine_singular.tsv, spine_terms.tsv, product_meta.tsv)
      + deterministic extraction (extracted_all.json: image_count, word_count, h1, sections, video)
      + AI classification/summaries (out_ai/batch_*.json)
      + Ahrefs organic overlay (ahrefs_overlay.json).
Re-runnable. Reports any missing AI batches."""
import csv, json, os, glob

BASE = os.path.dirname(os.path.abspath(__file__))
LIVE = "https://cavallo-inc.com"
LOCAL = "http://cavallo.local"

def unescape(v):
    v = v.replace(r"\t", "\t").replace(r"\n", " ").replace(r"\\", "\\").strip()
    return "" if v in (r"\N", "NULL") else v

def read_tsv(path):
    rows = []
    with open(path, encoding="utf-8", errors="replace") as f:
        header = [h.strip() for h in f.readline().rstrip("\n").split("\t")]
        for line in f:
            parts = line.rstrip("\n").split("\t")
            parts += [""] * (len(header) - len(parts))
            rows.append({header[i]: unescape(parts[i]) for i in range(len(header))})
    return rows

def path_of(permalink):
    p = permalink.replace(LOCAL, "").replace(LIVE, "")
    return ("/" + p.lstrip("/")) if not p.startswith("/") else p

def pkey(url):
    return url.split("cavallo-inc.com", 1)[-1].rstrip("/")

# --- deterministic extraction ---
det = json.load(open(os.path.join(BASE, "extracted_all.json")))

# --- AI summaries from out_ai/*.json ---
ai = {}
bad = []
for fp in sorted(glob.glob(os.path.join(BASE, "out_ai", "batch_*.json"))):
    try:
        arr = json.load(open(fp))
        for o in arr:
            ai[str(o["id"])] = o
    except Exception as e:
        bad.append((os.path.basename(fp), str(e)[:60]))
if bad:
    print("WARNING bad AI batch files:", bad)

# --- Ahrefs overlay ---
ah = json.load(open(os.path.join(BASE, "ahrefs_overlay.json"))) if os.path.exists(os.path.join(BASE, "ahrefs_overlay.json")) else {}
prod = {r["ID"]: r for r in read_tsv(os.path.join(BASE, "product_meta.tsv"))}

def section_for(t):
    return {"product": "Shop — Products", "product_cat": "Shop — Categories",
            "faq": "Support — FAQ", "newsletter": "Newsletters", "team": "About — Team",
            "video": "Videos", "category": "Blog — Categories", "post": "Blog — Posts",
            "page": "Pages — Core/Marketing"}.get(t, "Other")

COLS = ["id","type","status","indexable","cornerstone","site_section","title","url_live",
        "content_format","summary","key_components","primary_cta","image_count","word_count",
        "n_sections","has_video","seo_title","meta_description","focus_keyword","h1",
        "org_traffic_est","traffic_value_usd","top_keyword","serp_position","ranking_keywords",
        "links_in","links_out","price","sku","stock","reading_time_min","editor",
        "parent_id","url_local","last_modified","audit_action","notes"]

rows = []

def kc(o):
    v = o.get("key_components", "")
    return ", ".join(v) if isinstance(v, list) else v

# Singular pages
for r in read_tsv(os.path.join(BASE, "spine_singular.tsv")):
    pid = r["id"]; path = path_of(r["permalink"])
    d = det.get(pid, {}); a = ai.get(pid, {}); g = ah.get(pkey(LIVE + path), {})
    rows.append({
        "id": pid, "type": r["type"], "status": r["status"],
        "indexable": "No" if r["noindex"] == "1" else "Yes",
        "cornerstone": "Yes" if r["cornerstone"] == "1" else "",
        "site_section": section_for(r["type"]), "title": r["title"],
        "url_live": LIVE + path,
        "content_format": a.get("content_format", "") if a else ("(video — not summarized)" if r["type"]=="video" else ""),
        "summary": a.get("summary", ""), "key_components": kc(a),
        "primary_cta": a.get("primary_cta", ""),
        "image_count": d.get("image_count", ""), "word_count": d.get("word_count", ""),
        "n_sections": d.get("n_h2", ""), "has_video": "Yes" if d.get("video") else "",
        "seo_title": r["seo_title"], "meta_description": r["meta_desc"], "focus_keyword": r["focus_kw"],
        "h1": d.get("h1", ""),
        "org_traffic_est": g.get("traffic", ""), "traffic_value_usd": g.get("value_usd", ""),
        "top_keyword": g.get("top_keyword", ""), "serp_position": g.get("position", ""),
        "ranking_keywords": g.get("ranking_keywords", ""),
        "links_in": r["links_in"], "links_out": r["links_out"],
        "price": prod.get(pid, {}).get("price", ""), "sku": prod.get(pid, {}).get("sku", ""),
        "stock": prod.get(pid, {}).get("stock", ""), "reading_time_min": r["rt_min"],
        "editor": "Gutenberg" if r["gutenberg"] == "1" else "Classic",
        "parent_id": r["parent"] if r["parent"] not in ("0", "") else "",
        "url_local": LOCAL + path, "last_modified": r["modified"],
        "audit_action": "", "notes": "",
    })

# Taxonomy term archives (templated content_format/summary; grids)
for r in read_tsv(os.path.join(BASE, "spine_terms.tsv")):
    tid = "term_" + r["id"]; path = path_of(r["permalink"]); g = ah.get(pkey(LIVE + path), {})
    tax = r["taxonomy"]; cnt = r["post_count"]
    if tax == "product_cat":
        fmt = "Category / product grid"; summ = f"Shop category listing {cnt} products in “{r['name']}”."
        kcs = "Product grid, Filters, Add-to-cart"
    else:
        fmt = "Blog category archive"; summ = f"Blog archive listing {cnt} posts in “{r['name']}”."
        kcs = "Post list / grid"
    rows.append({
        "id": tid, "type": tax, "status": "publish",
        "indexable": "No" if r["noindex"] == "1" else "Yes", "cornerstone": "",
        "site_section": section_for(tax), "title": r["name"], "url_live": LIVE + path,
        "content_format": fmt, "summary": summ, "key_components": kcs, "primary_cta": "",
        "image_count": "", "word_count": "", "n_sections": "", "has_video": "",
        "seo_title": r["seo_title"], "meta_description": r["meta_desc"], "focus_keyword": "", "h1": "",
        "org_traffic_est": g.get("traffic", ""), "traffic_value_usd": g.get("value_usd", ""),
        "top_keyword": g.get("top_keyword", ""), "serp_position": g.get("position", ""),
        "ranking_keywords": g.get("ranking_keywords", ""),
        "links_in": "", "links_out": "", "price": "", "sku": "", "stock": "",
        "reading_time_min": "", "editor": "", "parent_id": "", "url_local": LOCAL + path,
        "last_modified": "", "audit_action": "", "notes": f"{cnt} items",
    })

# Grouped thin tag-archive rows
TAGS = [("post_tag", 999, 980, 3243, "/tag/<slug>/", "Blog tag archives — thin, auto-generated."),
        ("testimonial-tag", 105, 98, 570, "/testimonial-tag/<slug>/", "Testimonial tag archives — thin."),
        ("product_tag", 50, 42, 63, "/product-tag/<slug>/", "Product tag archives — thin.")]
for tax, total, ne, items, pat, note in TAGS:
    rows.append({c: "" for c in COLS} | {
        "id": f"group_{tax}", "type": f"{tax} (group)", "status": "publish", "indexable": "Yes",
        "site_section": "Taxonomy archives (thin)",
        "title": f"{tax} archives — {total} terms ({ne} non-empty)", "url_live": LIVE + pat,
        "content_format": "Tag archive (grouped)", "summary": note, "key_components": "Post/product list",
        "notes": f"{items} tagged items across {ne} non-empty terms",
    })

out = os.path.join(BASE, "cavallo_page_audit.csv")
with open(out, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=COLS); w.writeheader(); w.writerows(rows)

print(f"Wrote {len(rows)} rows -> {out}")
summarized = sum(1 for r in rows if r["summary"])
print(f"rows with summary: {summarized} | AI records loaded: {len(ai)} | ranked pages matched: {sum(1 for r in rows if r['org_traffic_est'] not in ('',))}")
