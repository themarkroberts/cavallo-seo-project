#!/usr/bin/env python3
"""Build the self-contained interactive site map.

Reads cavallo_page_audit.csv and emits a single dependency-free
cavallo_sitemap.html that opens straight from disk (file://) — the CSV is
parsed here at build time and injected as inline JSON, so nothing is fetched
at runtime. Re-run after the CSV changes.

    python3 build_sitemap.py
"""
import csv, json, os, datetime

BASE = os.path.dirname(os.path.abspath(__file__))
CSV = os.path.join(BASE, "cavallo_page_audit.csv")
OUT = os.path.join(BASE, "cavallo_sitemap.html")

with open(CSV, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = list(reader)

# Drop empty fields per row to keep the embedded payload lean. The JS reads
# every field defensively (missing key == empty string).
compact = [{k: v for k, v in r.items() if v is not None and v.strip() != ""} for r in rows]

data_json = json.dumps(compact, ensure_ascii=False, separators=(",", ":"))
# Make the payload safe to sit inside a <script> tag. Escaping these three
# characters can never break out of the element; JSON.parse restores them.
data_json = data_json.replace("&", "\\u0026").replace("<", "\\u003c").replace(">", "\\u003e")

build_date = datetime.date.today().isoformat()

TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cavallo — Interactive Site Map &amp; SEO Audit</title>
<style>
:root{
  --bg:#f4f6f9; --panel:#ffffff; --ink:#1f2933; --muted:#64748b; --line:#e2e8f0;
  --accent:#0f5d8c; --accent-ink:#0b4a70; --hover:#eef4f9; --sel:#dcebff; --sel2:#e8f1fb;
  --o:#7c3aed; --t:#d97706; --m:#2563eb; --n:#64748b; --vid:#0891b2; --ok:#16a34a;
  --tr1:#d1fae5; --tr2:#86efac; --tr3:#34d399; --tr4:#15803d;
}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;font:13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  color:var(--ink);background:var(--bg);display:flex;flex-direction:column;overflow:hidden}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
button{font:inherit;cursor:pointer}

/* ---------- top bar ---------- */
header{background:var(--panel);border-bottom:1px solid var(--line);padding:10px 14px 12px;flex:0 0 auto;
  box-shadow:0 1px 3px rgba(15,30,50,.05);z-index:30}
.brand{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.brand h1{font-size:16px;margin:0;font-weight:700;letter-spacing:-.2px}
.brand .sub{color:var(--muted);font-size:12px}
.brand .spacer{flex:1}
.brand .note{color:var(--muted);font-size:11px}

.stats{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}
.stat{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:#fff;
  border-radius:999px;padding:3px 10px;font-size:12px;color:var(--ink);user-select:none}
.stat[data-filter]{cursor:pointer}
.stat[data-filter]:hover{border-color:#cbd5e1;background:#f8fafc}
.stat b{font-weight:700}
.stat .swatch{width:9px;height:9px;border-radius:50%}
.stat.on{background:var(--accent);border-color:var(--accent);color:#fff}
.stat.on .swatch{outline:1px solid rgba(255,255,255,.6)}

.controls{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px}
.search{flex:1 1 260px;min-width:200px;position:relative}
.search input{width:100%;padding:7px 30px 7px 32px;border:1px solid var(--line);border-radius:8px;font-size:13px;background:#fff}
.search input:focus{outline:2px solid #bfdbfe;border-color:#93c5fd}
.search .ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:13px}
.search .clr{position:absolute;right:6px;top:50%;transform:translateY(-50%);border:0;background:none;color:var(--muted);
  font-size:16px;line-height:1;padding:2px 6px;display:none}
.search.has .clr{display:block}

.dd{position:relative}
.dd>button,.seg,.tg,.btn{border:1px solid var(--line);background:#fff;border-radius:8px;padding:7px 11px;font-size:12.5px;color:var(--ink);white-space:nowrap}
.dd>button:hover,.btn:hover{border-color:#cbd5e1;background:#f8fafc}
.dd>button .cnt{display:none;margin-left:6px;background:var(--accent);color:#fff;border-radius:999px;padding:0 6px;font-size:11px}
.dd.active>button .cnt{display:inline}
.dd>button .car{color:var(--muted);margin-left:6px;font-size:10px}
.pop{position:absolute;top:calc(100% + 5px);left:0;background:#fff;border:1px solid var(--line);border-radius:10px;
  box-shadow:0 10px 30px rgba(15,30,50,.16);padding:8px;min-width:230px;max-height:320px;overflow:auto;z-index:50;display:none}
.dd.open .pop{display:block}
.pop .pop-act{display:flex;gap:8px;justify-content:space-between;padding:2px 4px 8px;border-bottom:1px solid var(--line);margin-bottom:6px}
.pop .pop-act a{font-size:11.5px;cursor:pointer}
.pop label{display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:6px;cursor:pointer;font-size:12.5px}
.pop label:hover{background:var(--hover)}
.pop label input{accent-color:var(--accent)}
.pop label .ct{margin-left:auto;color:var(--muted);font-size:11px}

.seg{display:inline-flex;padding:0;overflow:hidden}
.seg button{border:0;background:none;padding:7px 11px;font-size:12.5px;color:var(--muted);border-right:1px solid var(--line)}
.seg button:last-child{border-right:0}
.seg button.on{background:var(--accent);color:#fff}
.seg .lbl{padding:7px 10px;color:var(--muted);font-size:11.5px;border-right:1px solid var(--line);background:#f8fafc}

.tg{color:var(--muted);display:inline-flex;align-items:center;gap:6px}
.tg .swatch{width:9px;height:9px;border-radius:50%}
.tg.on{background:var(--accent);border-color:var(--accent);color:#fff}
.tg.on .swatch{outline:1px solid rgba(255,255,255,.7)}

.sort{display:inline-flex;align-items:center;gap:6px;color:var(--muted);font-size:12px}
.sort select{border:1px solid var(--line);border-radius:8px;padding:6px 8px;font-size:12.5px;background:#fff;color:var(--ink)}

/* ---------- layout ---------- */
main{flex:1 1 auto;display:flex;min-height:0}
#sidebar{flex:0 0 auto;width:460px;min-width:300px;max-width:70vw;background:var(--panel);border-right:1px solid var(--line);
  overflow:auto;resize:horizontal}
.tree-bar{position:sticky;top:0;background:var(--panel);border-bottom:1px solid var(--line);padding:7px 12px;
  display:flex;align-items:center;gap:12px;z-index:10}
.tree-bar .res{font-size:12px;color:var(--muted)}
.tree-bar .res b{color:var(--ink)}
.tree-bar .lnk{font-size:11.5px;color:var(--accent);cursor:pointer}
.tree-bar .spacer{flex:1}

.empty{padding:28px 16px;color:var(--muted);text-align:center;font-size:13px}

.section{border-bottom:1px solid var(--line)}
.section.hide{display:none}
.sec-head{display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;user-select:none;position:sticky;top:36px;
  background:#f8fafc;z-index:5}
.sec-head:hover{background:#f1f5f9}
.sec-head .car{color:var(--muted);font-size:11px;width:12px;transition:transform .12s}
.section.open .sec-head .car{transform:rotate(90deg)}
.sec-head .nm{font-weight:600;font-size:12.5px}
.sec-head .ct{color:var(--muted);font-size:11.5px}
.sec-head .mini{display:flex;gap:4px;margin-left:auto;align-items:center}
.sec-head .mini .mp{font-size:10.5px;color:#fff;border-radius:999px;padding:0 6px;line-height:16px;height:16px;font-weight:600}
.sec-body{display:none}
.section.open .sec-body{display:block}

.row{display:flex;align-items:center;gap:8px;padding:6px 12px 6px 14px;border-left:4px solid transparent;cursor:pointer;
  border-bottom:1px solid #f1f5f9}
.row:hover{background:var(--hover)}
.row.sel{background:var(--sel2);box-shadow:inset 0 0 0 1px #bfdbfe}
.row.hide{display:none}
.row .ti{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row .ti .tt{font-size:12.5px}
.row .ti .uu{display:block;font-size:10.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dots{display:flex;gap:3px;flex:0 0 auto}
.dot{width:14px;height:14px;border-radius:4px;color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;
  justify-content:center;letter-spacing:-.5px}
.dot.O{background:var(--o)} .dot.T{background:var(--t)} .dot.M{background:var(--m)} .dot.N{background:var(--n)} .dot.V{background:var(--vid)}
.pill{flex:0 0 auto;font-size:10.5px;font-weight:700;border-radius:999px;padding:1px 7px;color:#064e3b;min-width:26px;text-align:center}

/* ---------- detail ---------- */
#detail{flex:1 1 auto;overflow:auto;padding:0}
.welcome{max-width:760px;margin:0 auto;padding:34px 28px;color:var(--ink)}
.welcome h2{margin:0 0 6px;font-size:20px}
.welcome p{color:var(--muted);max-width:62ch}
.welcome .legend{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-top:18px}
.welcome .lg{border:1px solid var(--line);border-radius:10px;padding:12px;background:#fff}
.welcome .lg h4{margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)}
.welcome .lg .li{display:flex;align-items:center;gap:8px;margin:6px 0;font-size:12.5px}

.detail{padding:18px 22px 60px;max-width:980px}
.detail .crumb{font-size:11.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}
.detail h2{margin:4px 0 8px;font-size:19px;line-height:1.25}
.detail .badges{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 4px}
.badge{font-size:11px;border-radius:6px;padding:2px 8px;background:#eef2f7;color:#334155;border:1px solid #e2e8f0;font-weight:600}
.badge.fmt{background:#eef6fc;color:#0b4a70;border-color:#cfe6f6}
.badge.flag{color:#fff;border:0}
.badge.flag.O{background:var(--o)} .badge.flag.T{background:var(--t)} .badge.flag.M{background:var(--m)}
.badge.flag.N{background:var(--n)} .badge.flag.V{background:var(--vid)} .badge.ok{background:var(--ok);color:#fff;border:0}
.detail .url{margin:8px 0 16px;font-size:12.5px;word-break:break-all}
.detail .url .open{font-weight:600}

.card{border:1px solid var(--line);background:#fff;border-radius:12px;padding:14px 16px;margin:0 0 14px}
.card h3{margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:var(--muted)}
.lead{font-size:14px;line-height:1.55;margin:0}
.muted-note{color:var(--muted);font-style:italic;margin:0}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{font-size:12px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:999px;padding:3px 10px;color:#334155}
.cta{display:inline-block;background:var(--accent);color:#fff;border-radius:8px;padding:5px 12px;font-weight:600;font-size:12.5px}

.kv{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px 18px}
.kv .k{font-size:10.5px;text-transform:uppercase;letter-spacing:.4px;color:var(--muted)}
.kv .v{font-size:13.5px;font-weight:600;margin-top:1px;word-break:break-word}
.kv .v.norm{font-weight:400}
.kv .v small{font-weight:400;color:var(--muted)}
.metric{font-variant-numeric:tabular-nums}

.cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:1100px){.cols{grid-template-columns:1fr}}
.tline{display:flex;align-items:center;gap:8px;margin:2px 0}
.tline .lab{width:130px;color:var(--muted);font-size:12px}
.tline .bar{flex:1;height:8px;border-radius:999px;background:#eef2f7;overflow:hidden}
.tline .bar i{display:block;height:100%;border-radius:999px}
.tline .num{width:64px;text-align:right;font-weight:600;font-variant-numeric:tabular-nums}
kbd{background:#eef2f7;border:1px solid #dbe3ec;border-bottom-width:2px;border-radius:4px;padding:0 5px;font-size:11px}
.scrollnote{color:var(--muted);font-size:11px;margin-top:4px}
</style>
</head>
<body>
<header>
  <div class="brand">
    <h1>Cavallo Site Map</h1>
    <span class="sub">Interactive page-level SEO audit</span>
    <span class="spacer"></span>
    <span class="note">__TOTAL__ pages · built __BUILD_DATE__ · organic figures are Ahrefs estimates (GSC blocked)</span>
  </div>
  <div class="stats" id="stats"></div>
  <div class="controls">
    <div class="search" id="searchWrap">
      <span class="ico">&#128269;</span>
      <input id="search" type="search" placeholder="Search title, URL, summary, keyword, SKU…" autocomplete="off" spellcheck="false">
      <button class="clr" id="searchClr" title="Clear">&times;</button>
    </div>
    <div class="dd" id="ddSection"><button>Section<span class="cnt">0</span><span class="car">&#9662;</span></button><div class="pop"></div></div>
    <div class="dd" id="ddFormat"><button>Content format<span class="cnt">0</span><span class="car">&#9662;</span></button><div class="pop"></div></div>
    <div class="seg" id="segIndex">
      <span class="lbl">Indexable</span>
      <button data-v="all" class="on">All</button>
      <button data-v="Yes">Yes</button>
      <button data-v="No">No</button>
    </div>
    <button class="tg" data-toggle="traffic"><span class="swatch" style="background:var(--tr3)"></span>Has traffic</button>
    <button class="tg" data-toggle="orphan"><span class="swatch" style="background:var(--o)"></span>Orphan</button>
    <button class="tg" data-toggle="thin"><span class="swatch" style="background:var(--t)"></span>Thin</button>
    <button class="tg" data-toggle="nometa"><span class="swatch" style="background:var(--m)"></span>No meta</button>
    <span class="sort">Sort <select id="sort">
      <option value="traffic">Traffic ↓</option>
      <option value="title">Title A–Z</option>
      <option value="words">Word count ↓</option>
      <option value="linksin">Links in ↓</option>
      <option value="modified">Last modified ↓</option>
    </select></span>
    <button class="btn" id="clearAll">Clear all</button>
  </div>
</header>
<main>
  <div id="sidebar">
    <div class="tree-bar">
      <span class="res" id="resCount"></span>
      <span class="spacer"></span>
      <span class="lnk" id="expandAll">Expand all</span>
      <span class="lnk" id="collapseAll">Collapse all</span>
    </div>
    <div id="tree"></div>
  </div>
  <div id="detail"></div>
</main>

<script type="application/json" id="page-data">__PAGE_DATA__</script>
<script>
"use strict";
var DATA = JSON.parse(document.getElementById("page-data").textContent);

/* ---------- helpers ---------- */
function g(r,k){ return (r && r[k] != null) ? r[k] : ""; }
function num(r,k){ var v=g(r,k); if(v==="") return NaN; var n=parseFloat(v); return isNaN(n)?NaN:n; }
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];}); }
function fmtInt(n){ return n.toLocaleString("en-US"); }
function fmtMoney(n){ return "$"+Math.round(n).toLocaleString("en-US"); }

var SINGULAR = {post:1,page:1,product:1,video:1,newsletter:1,faq:1,team:1};

function flagsOf(r){
  var t=g(r,"type");
  var li=g(r,"links_in").trim();
  var wc=num(r,"word_count");
  var md=g(r,"meta_description").trim();
  return {
    noindex: g(r,"indexable")==="No",
    // orphan = no inbound internal links. For singular page types the DB stores
    // "no links" as blank or 0; taxonomy/group rows aren't measured, so skip them.
    orphan: !!SINGULAR[t] && (li==="" || li==="0"),
    thin: !isNaN(wc) && wc<300,
    nometa: md==="",
    video: t==="video"
  };
}
function trafficBucket(n){
  if(isNaN(n)||n<=0) return 0;
  if(n<10) return 1; if(n<50) return 2; if(n<200) return 3; return 4;
}
var TR_COLORS=["","var(--tr1)","var(--tr2)","var(--tr3)","var(--tr4)"];
var TR_TXT=["","#065f46","#065f46","#064e3b","#fff"];

/* ---------- enrich + index ---------- */
DATA.forEach(function(r,i){
  r.__i=i;
  r.__f=flagsOf(r);
  r.__tr=num(r,"org_traffic_est");
  r.__trb=trafficBucket(r.__tr);
  var hay=[g(r,"title"),g(r,"url_live"),g(r,"summary"),g(r,"top_keyword"),g(r,"focus_keyword"),
           g(r,"meta_description"),g(r,"seo_title"),g(r,"key_components"),g(r,"content_format"),
           g(r,"sku"),g(r,"site_section"),g(r,"type"),g(r,"id"),g(r,"h1")].join("  ").toLowerCase();
  r.__hay=hay;
});

var SECTION_ORDER=["Pages — Core/Marketing","Blog — Posts","Blog — Categories","Shop — Products",
  "Shop — Categories","Support — FAQ","Newsletters","Videos","About — Team","Taxonomy archives (thin)"];
function secRank(s){ var i=SECTION_ORDER.indexOf(s); return i<0?99:i; }

/* unique values */
function uniq(key){
  var m={}; DATA.forEach(function(r){ var v=g(r,key); if(v!=="") m[v]=(m[v]||0)+1; });
  return Object.keys(m).map(function(k){return {v:k,n:m[k]};});
}

/* ---------- state ---------- */
var ST={ q:"", sections:{}, formats:{}, indexable:"all",
         traffic:false, orphan:false, thin:false, nometa:false, sort:"traffic", selected:null };

/* ---------- build dropdowns ---------- */
function buildDropdown(id, key, ordered){
  var dd=document.getElementById(id), pop=dd.querySelector(".pop");
  var items=uniq(key);
  if(ordered) items.sort(function(a,b){var r=secRank(a.v)-secRank(b.v);return r||a.v.localeCompare(b.v);});
  else items.sort(function(a,b){return b.n-a.n || a.v.localeCompare(b.v);});
  var store = (key==="site_section")?ST.sections:ST.formats;
  var html='<div class="pop-act"><a data-all="1">Select all</a><a data-all="0">Clear</a></div>';
  items.forEach(function(it){
    html+='<label><input type="checkbox" value="'+esc(it.v)+'"><span>'+esc(it.v)+'</span><span class="ct">'+it.n+'</span></label>';
  });
  pop.innerHTML=html;
  pop.querySelectorAll('input[type=checkbox]').forEach(function(cb){
    cb.addEventListener("change",function(){ if(cb.checked) store[cb.value]=1; else delete store[cb.value]; syncDD(dd,store); apply(); });
  });
  pop.querySelectorAll('a[data-all]').forEach(function(a){
    a.addEventListener("click",function(){
      var on=a.getAttribute("data-all")==="1";
      pop.querySelectorAll('input').forEach(function(cb){ cb.checked=on; if(on) store[cb.value]=1; else delete store[cb.value]; });
      syncDD(dd,store); apply();
    });
  });
  dd.querySelector("button").addEventListener("click",function(e){
    e.stopPropagation(); var open=dd.classList.contains("open");
    closePops(); if(!open) dd.classList.add("open");
  });
  pop.addEventListener("click",function(e){ e.stopPropagation(); });
}
function syncDD(dd,store){
  var n=Object.keys(store).length;
  dd.classList.toggle("active",n>0);
  dd.querySelector(".cnt").textContent=n;
}
function closePops(){ document.querySelectorAll(".dd.open").forEach(function(d){d.classList.remove("open");}); }
document.addEventListener("click",closePops);

buildDropdown("ddSection","site_section",true);
buildDropdown("ddFormat","content_format",false);

/* ---------- render tree (build once) ---------- */
var rowEls={}, sectionEls={};
(function buildTree(){
  var tree=document.getElementById("tree");
  var bySec={};
  DATA.forEach(function(r){ var s=g(r,"site_section")||"(none)"; (bySec[s]=bySec[s]||[]).push(r); });
  var secNames=Object.keys(bySec).sort(function(a,b){var r=secRank(a)-secRank(b);return r||a.localeCompare(b);});
  var frag=document.createDocumentFragment();
  secNames.forEach(function(s){
    var sec=document.createElement("div"); sec.className="section";
    var head=document.createElement("div"); head.className="sec-head";
    head.innerHTML='<span class="car">&#9656;</span><span class="nm">'+esc(s)+'</span>'+
                   '<span class="ct"></span><span class="mini"></span>';
    var body=document.createElement("div"); body.className="sec-body";
    head.addEventListener("click",function(){ sec.classList.toggle("open"); });
    bySec[s].forEach(function(r){
      var row=document.createElement("div"); row.className="row"; row.dataset.i=r.__i;
      var f=r.__f, dots="";
      if(f.orphan) dots+='<span class="dot O" title="Orphan — no inbound internal links">O</span>';
      if(f.thin) dots+='<span class="dot T" title="Thin — under 300 words">T</span>';
      if(f.nometa) dots+='<span class="dot M" title="No meta description">M</span>';
      if(f.noindex) dots+='<span class="dot N" title="Noindex — excluded from search">N</span>';
      if(f.video) dots+='<span class="dot V" title="Video — not summarized by design">V</span>';
      var pill="";
      if(r.__trb>0) pill='<span class="pill" style="background:'+TR_COLORS[r.__trb]+';color:'+TR_TXT[r.__trb]+'">'+fmtInt(r.__tr)+'</span>';
      row.style.borderLeftColor = r.__trb>0 ? TR_COLORS[r.__trb] : "transparent";
      var path=g(r,"url_live").replace(/^https?:\/\/[^/]+/,"")||"/";
      row.innerHTML='<span class="ti"><span class="tt">'+esc(g(r,"title")||"(untitled)")+'</span>'+
                    '<span class="uu">'+esc(path)+'</span></span>'+
                    '<span class="dots">'+dots+'</span>'+pill;
      row.addEventListener("click",function(){ select(r.__i); });
      body.appendChild(row);
      rowEls[r.__i]=row;
    });
    sec.appendChild(head); sec.appendChild(body); frag.appendChild(sec);
    sectionEls[s]={el:sec,head:head,body:body,rows:bySec[s]};
  });
  tree.appendChild(frag);
})();

/* ---------- sorting ---------- */
function sortVal(r){
  switch(ST.sort){
    case "title": return g(r,"title").toLowerCase();
    case "words": return -(num(r,"word_count")||0);
    case "linksin": return -(num(r,"links_in")||0);
    case "modified": return g(r,"last_modified");
    default: return -((r.__tr)||0);
  }
}
function applySort(){
  Object.keys(sectionEls).forEach(function(s){
    var se=sectionEls[s];
    var sorted=se.rows.slice().sort(function(a,b){
      var va=sortVal(a), vb=sortVal(b);
      if(ST.sort==="title"||ST.sort==="modified"){ if(ST.sort==="modified"){return vb<va?-1:vb>va?1:0;} return va<vb?-1:va>vb?1:0; }
      return va-vb;
    });
    sorted.forEach(function(r){ se.body.appendChild(rowEls[r.__i]); });
  });
}

/* ---------- filtering ---------- */
function matches(r){
  var f=r.__f;
  if(ST.q){
    var terms=ST.q.split(/\s+/);
    for(var i=0;i<terms.length;i++){ if(terms[i] && r.__hay.indexOf(terms[i])<0) return false; }
  }
  if(Object.keys(ST.sections).length && !ST.sections[g(r,"site_section")]) return false;
  if(Object.keys(ST.formats).length && !ST.formats[g(r,"content_format")]) return false;
  if(ST.indexable!=="all" && g(r,"indexable")!==ST.indexable) return false;
  if(ST.traffic && !(r.__tr>0)) return false;
  if(ST.orphan && !f.orphan) return false;
  if(ST.thin && !f.thin) return false;
  if(ST.nometa && !f.nometa) return false;
  return true;
}
var FILTERS_ON=function(){ return ST.q||Object.keys(ST.sections).length||Object.keys(ST.formats).length||
  ST.indexable!=="all"||ST.traffic||ST.orphan||ST.thin||ST.nometa; };

function apply(){
  var total=0, filtering=!!FILTERS_ON();
  Object.keys(sectionEls).forEach(function(s){
    var se=sectionEls[s], vis=0;
    se.rows.forEach(function(r){
      var ok=matches(r);
      rowEls[r.__i].classList.toggle("hide",!ok);
      if(ok) vis++;
    });
    total+=vis;
    se.el.classList.toggle("hide",vis===0);
    se.head.querySelector(".ct").textContent = filtering ? (vis+" / "+se.rows.length) : ("("+se.rows.length+")");
    se.head.querySelector(".mini").innerHTML = miniBadges(se.rows);
    if(filtering) se.el.classList.toggle("open",vis>0);
  });
  var tree=document.getElementById("tree");
  var emp=document.getElementById("emptyMsg");
  if(total===0){ if(!emp){ emp=document.createElement("div"); emp.id="emptyMsg"; emp.className="empty";
      emp.textContent="No pages match the current search & filters."; tree.appendChild(emp);} }
  else if(emp){ emp.remove(); }
  document.getElementById("resCount").innerHTML="<b>"+fmtInt(total)+"</b> of "+fmtInt(DATA.length)+" pages";
  updateChips();
}
function miniBadges(rows){
  var o=0,t=0,m=0,n=0,tr=0;
  rows.forEach(function(r){ if(r.__f.orphan)o++; if(r.__f.thin)t++; if(r.__f.nometa)m++; if(r.__f.noindex)n++; if(r.__tr>0)tr+=r.__tr; });
  var h="";
  if(tr>0) h+='<span class="mp" style="background:var(--tr4)" title="Total est. organic traffic">▲'+fmtInt(tr)+'</span>';
  if(o) h+='<span class="mp" style="background:var(--o)" title="Orphan">'+o+'</span>';
  if(t) h+='<span class="mp" style="background:var(--t)" title="Thin">'+t+'</span>';
  if(m) h+='<span class="mp" style="background:var(--m)" title="No meta">'+m+'</span>';
  return h;
}

/* ---------- stat chips ---------- */
var CHIP_DEFS=[
  {id:"total",label:"pages",calc:function(){return DATA.length;}},
  {id:"traffic",label:"with traffic",sw:"var(--tr3)",calc:function(){return DATA.filter(function(r){return r.__tr>0;}).length;}},
  {id:"orphan",label:"orphan",sw:"var(--o)",calc:function(){return DATA.filter(function(r){return r.__f.orphan;}).length;}},
  {id:"thin",label:"thin",sw:"var(--t)",calc:function(){return DATA.filter(function(r){return r.__f.thin;}).length;}},
  {id:"nometa",label:"no meta",sw:"var(--m)",calc:function(){return DATA.filter(function(r){return r.__f.nometa;}).length;}},
  {id:"noindex",label:"noindex",sw:"var(--n)",calc:function(){return DATA.filter(function(r){return r.__f.noindex;}).length;}},
  {id:"video",label:"video",sw:"var(--vid)",calc:function(){return DATA.filter(function(r){return r.__f.video;}).length;}}
];
(function buildChips(){
  var box=document.getElementById("stats"), h="";
  CHIP_DEFS.forEach(function(c){
    var sw=c.sw?'<span class="swatch" style="background:'+c.sw+'"></span>':"";
    var attr;
    if(c.id==="total") attr='data-clear="1"';
    else if(c.id==="video") attr='data-section="Videos"';
    else attr='data-filter="'+c.id+'"';
    h+='<span class="stat" id="chip-'+c.id+'" '+attr+'>'+sw+'<b>'+fmtInt(c.calc())+'</b> '+c.label+'</span>';
  });
  box.innerHTML=h;
  box.querySelectorAll("[data-filter]").forEach(function(el){
    el.addEventListener("click",function(){ var k=el.getAttribute("data-filter"); ST[k]=!ST[k]; reflectToggles(); apply(); });
  });
  box.querySelector('[data-clear]').addEventListener("click",clearAll);
  var vc=box.querySelector('[data-section]');
  if(vc) vc.addEventListener("click",function(){
    var s=vc.getAttribute("data-section"); var on=ST.sections[s];
    ST.sections={}; if(!on) ST.sections[s]=1;
    var dd=document.getElementById("ddSection");
    dd.querySelectorAll("input").forEach(function(cb){ cb.checked=!!ST.sections[cb.value]; });
    syncDD(dd,ST.sections); apply();
  });
})();
function updateChips(){
  ["traffic","orphan","thin","nometa","noindex"].forEach(function(k){
    var el=document.getElementById("chip-"+k); if(el) el.classList.toggle("on",!!ST[k]);
  });
  var vc=document.getElementById("chip-video");
  if(vc) vc.classList.toggle("on", !!ST.sections["Videos"]);
}

/* ---------- toggles / controls ---------- */
function reflectToggles(){
  document.querySelectorAll(".tg[data-toggle]").forEach(function(b){ b.classList.toggle("on",!!ST[b.getAttribute("data-toggle")]); });
}
document.querySelectorAll(".tg[data-toggle]").forEach(function(b){
  b.addEventListener("click",function(){ var k=b.getAttribute("data-toggle"); ST[k]=!ST[k]; reflectToggles(); apply(); });
});
document.querySelectorAll("#segIndex button[data-v]").forEach(function(b){
  b.addEventListener("click",function(){
    ST.indexable=b.getAttribute("data-v");
    document.querySelectorAll("#segIndex button").forEach(function(x){x.classList.toggle("on",x===b);});
    apply();
  });
});
var searchEl=document.getElementById("search"), searchWrap=document.getElementById("searchWrap");
searchEl.addEventListener("input",function(){
  ST.q=searchEl.value.trim().toLowerCase(); searchWrap.classList.toggle("has",searchEl.value!==""); apply();
});
document.getElementById("searchClr").addEventListener("click",function(){
  searchEl.value=""; ST.q=""; searchWrap.classList.remove("has"); apply(); searchEl.focus();
});
document.getElementById("sort").addEventListener("change",function(e){ ST.sort=e.target.value; applySort(); });
document.getElementById("expandAll").addEventListener("click",function(){
  Object.keys(sectionEls).forEach(function(s){ if(!sectionEls[s].el.classList.contains("hide")) sectionEls[s].el.classList.add("open"); });
});
document.getElementById("collapseAll").addEventListener("click",function(){
  Object.keys(sectionEls).forEach(function(s){ sectionEls[s].el.classList.remove("open"); });
});
function clearAll(){
  ST.q=""; ST.sections={}; ST.formats={}; ST.indexable="all"; ST.traffic=ST.orphan=ST.thin=ST.nometa=false;
  searchEl.value=""; searchWrap.classList.remove("has");
  ["ddSection","ddFormat"].forEach(function(id){ var dd=document.getElementById(id);
    dd.querySelectorAll("input").forEach(function(cb){cb.checked=false;}); syncDD(dd, id==="ddSection"?ST.sections:ST.formats); });
  document.querySelectorAll("#segIndex button").forEach(function(x){x.classList.toggle("on",x.getAttribute("data-v")==="all");});
  reflectToggles();
  Object.keys(sectionEls).forEach(function(s){ sectionEls[s].el.classList.remove("open"); });
  apply();
}
document.getElementById("clearAll").addEventListener("click",clearAll);
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"){ closePops(); }
  if(e.key==="/" && document.activeElement!==searchEl){ e.preventDefault(); searchEl.focus(); }
});

/* ---------- detail panel ---------- */
function kv(label,value,opts){
  if(value===""||value==null) return "";
  opts=opts||{};
  return '<div><div class="k">'+esc(label)+'</div><div class="v '+(opts.norm?'norm':'')+(opts.metric?' metric':'')+'">'+
         (opts.raw?value:esc(value))+(opts.suffix?' <small>'+esc(opts.suffix)+'</small>':'')+'</div></div>';
}
function select(i){
  ST.selected=i;
  Object.keys(rowEls).forEach(function(k){ rowEls[k].classList.toggle("sel",+k===i); });
  var r=DATA[i]; renderDetail(r);
  var row=rowEls[i]; if(row && row.scrollIntoView) row.scrollIntoView({block:"nearest"});
}
function renderDetail(r){
  var f=r.__f, t=g(r,"type");
  var badges='<span class="badge fmt">'+esc(g(r,"content_format")||t)+'</span>';
  badges+='<span class="badge">'+esc(t)+'</span>';
  if(g(r,"cornerstone")==="Yes") badges+='<span class="badge" style="background:#fef3c7;color:#92400e;border-color:#fde68a">★ Cornerstone</span>';
  if(f.noindex) badges+='<span class="badge flag N">Noindex</span>'; else badges+='<span class="badge ok">Indexable</span>';
  if(f.orphan) badges+='<span class="badge flag O">Orphan</span>';
  if(f.thin) badges+='<span class="badge flag T">Thin</span>';
  if(f.nometa) badges+='<span class="badge flag M">No meta desc</span>';
  if(f.video) badges+='<span class="badge flag V">Video</span>';

  var url=g(r,"url_live");
  var head='<div class="crumb">'+esc(g(r,"site_section"))+'</div>'+
           '<h2>'+esc(g(r,"title")||"(untitled)")+'</h2>'+
           '<div class="badges">'+badges+'</div>'+
           '<div class="url">'+(url?'<a class="open" href="'+esc(url)+'" target="_blank" rel="noopener">'+esc(url)+' &#8599;</a>':'')+'</div>';

  // summary card
  var sumCard;
  if(g(r,"summary")) sumCard='<div class="card"><h3>Summary</h3><p class="lead">'+esc(g(r,"summary"))+'</p></div>';
  else if(f.video) sumCard='<div class="card"><h3>Summary</h3><p class="muted-note">Video page — not summarized (by design).</p></div>';
  else sumCard="";

  // content card
  var comp=g(r,"key_components");
  var chips = comp ? '<div class="chips">'+comp.split(/,\s*/).map(function(c){return '<span class="chip">'+esc(c)+'</span>';}).join("")+'</div>' : "";
  var cta = g(r,"primary_cta") ? '<div style="margin-top:10px"><div class="k" style="font-size:10.5px;text-transform:uppercase;letter-spacing:.4px;color:var(--muted)">Primary CTA</div><span class="cta" style="margin-top:4px">'+esc(g(r,"primary_cta"))+'</span></div>' : "";
  var contentCard=(chips||cta)?'<div class="card"><h3>Content &amp; components</h3>'+chips+cta+'</div>':"";

  // SEO card
  var seo='<div class="kv">'+
    kv("SEO title", g(r,"seo_title"), {norm:true})+
    kv("Meta description", g(r,"meta_description"), {norm:true})+
    kv("Focus keyword", g(r,"focus_keyword"))+
    kv("H1", g(r,"h1"), {norm:true})+
    kv("Indexable", g(r,"indexable"))+
    '</div>';
  var seoCard='<div class="card"><h3>SEO metadata</h3>'+seo+'</div>';

  // Organic card
  var hasOrg = g(r,"org_traffic_est")!=="" || g(r,"top_keyword")!=="";
  var orgCard="";
  if(hasOrg){
    var org='<div class="kv">'+
      kv("Est. organic traffic", g(r,"org_traffic_est")!==""?fmtInt(num(r,"org_traffic_est")):"", {metric:true,suffix:"/mo"})+
      kv("Traffic value", g(r,"traffic_value_usd")!==""?fmtMoney(num(r,"traffic_value_usd")):"", {metric:true,suffix:"/mo"})+
      kv("Top keyword", g(r,"top_keyword"))+
      kv("SERP position", g(r,"serp_position")!==""?("#"+g(r,"serp_position")):"", {metric:true})+
      kv("Ranking keywords", g(r,"ranking_keywords"), {metric:true})+
      '</div><p class="scrollnote">Ahrefs current-snapshot estimate — GSC is permission-blocked for this property.</p>';
    orgCard='<div class="card"><h3>Organic search</h3>'+org+'</div>';
  } else {
    orgCard='<div class="card"><h3>Organic search</h3><p class="muted-note">No Ahrefs organic data — page does not currently rank in the snapshot.</p></div>';
  }

  // metrics + links (two columns)
  var linksIn = g(r,"links_in"), linksOut=g(r,"links_out");
  var metrics='<div class="card"><h3>Content metrics</h3><div class="kv">'+
    kv("Word count", g(r,"word_count")!==""?fmtInt(num(r,"word_count")):"", {metric:true})+
    kv("Images (in-content)", g(r,"image_count")!==""?fmtInt(num(r,"image_count")):"", {metric:true})+
    kv("Sections (H2)", g(r,"n_sections"), {metric:true})+
    kv("Reading time", g(r,"reading_time_min")!==""?(g(r,"reading_time_min")+" min"):"", {metric:true})+
    kv("Has video", g(r,"has_video"))+
    '</div></div>';
  var linksCard='<div class="card"><h3>Internal links</h3><div class="kv">'+
    kv("Links in", linksIn!==""?fmtInt(num(r,"links_in")):(SINGULAR[t]?"0":"—"), {metric:true})+
    kv("Links out", linksOut!==""?fmtInt(num(r,"links_out")):"—", {metric:true})+
    '</div>'+(f.orphan?'<p class="scrollnote" style="color:var(--o)">No inbound internal links — orphaned.</p>':'')+'</div>';

  // commerce
  var commerceCard="";
  if(g(r,"price")||g(r,"sku")||g(r,"stock")){
    commerceCard='<div class="card"><h3>Commerce</h3><div class="kv">'+
      kv("Price", g(r,"price")!==""?("$"+g(r,"price")):"", {metric:true})+
      kv("SKU", g(r,"sku"))+
      kv("Stock", g(r,"stock"))+
      '</div></div>';
  }

  // meta/admin
  var parentTitle="";
  if(g(r,"parent_id")){ var p=DATA.find(function(x){return g(x,"id")===g(r,"parent_id");}); parentTitle=p?g(p,"title"):g(r,"parent_id"); }
  var metaCard='<div class="card"><h3>Record</h3><div class="kv">'+
    kv("ID", g(r,"id"))+
    kv("Editor", g(r,"editor"))+
    kv("Last modified", g(r,"last_modified"))+
    kv("Parent", parentTitle)+
    kv("Audit action", g(r,"audit_action"), {norm:true})+
    kv("Notes", g(r,"notes"), {norm:true})+
    kv("Local URL", g(r,"url_local"), {norm:true})+
    '</div></div>';

  var html='<div class="detail">'+head+sumCard+contentCard+
    '<div class="cols"><div>'+seoCard+linksCard+commerceCard+'</div>'+
    '<div>'+orgCard+metrics+metaCard+'</div></div></div>';
  document.getElementById("detail").innerHTML=html;
  document.getElementById("detail").scrollTop=0;
}

/* ---------- welcome screen ---------- */
function welcome(){
  var c=function(id){ return DATA.filter(function(r){
    if(id==="traffic")return r.__tr>0; if(id==="video")return r.__f.video; return r.__f[id]; }).length; };
  document.getElementById("detail").innerHTML=
   '<div class="welcome"><h2>Cavallo interactive site map</h2>'+
   '<p>'+fmtInt(DATA.length)+' published pages across '+Object.keys(sectionEls).length+' sections. '+
   'Browse the collapsible tree on the left, or use the search &amp; filters up top. '+
   'Click any page for its full SEO detail. Press <kbd>/</kbd> to jump to search.</p>'+
   '<div class="legend">'+
   '<div class="lg"><h4>Issue flags (dots &amp; chips)</h4>'+
     '<div class="li"><span class="dot O">O</span> Orphan — no inbound internal links ('+fmtInt(c("orphan"))+')</div>'+
     '<div class="li"><span class="dot T">T</span> Thin — under 300 words ('+fmtInt(c("thin"))+')</div>'+
     '<div class="li"><span class="dot M">M</span> No meta description ('+fmtInt(c("nometa"))+')</div>'+
     '<div class="li"><span class="dot N">N</span> Noindex — excluded from search ('+fmtInt(c("noindex"))+')</div>'+
     '<div class="li"><span class="dot V">V</span> Video — not summarized by design ('+fmtInt(c("video"))+')</div>'+
   '</div>'+
   '<div class="lg"><h4>Organic traffic (left bar &amp; pill)</h4>'+
     '<div class="li"><span class="pill" style="background:var(--tr1);color:#065f46">1–9</span> low</div>'+
     '<div class="li"><span class="pill" style="background:var(--tr2);color:#065f46">10–49</span> moderate</div>'+
     '<div class="li"><span class="pill" style="background:var(--tr3);color:#064e3b">50–199</span> strong</div>'+
     '<div class="li"><span class="pill" style="background:var(--tr4);color:#fff">200+</span> top — est. visits/mo</div>'+
     '<div class="li" style="color:var(--muted)">'+fmtInt(c("traffic"))+' pages currently rank (Ahrefs estimate).</div>'+
   '</div></div></div>';
}

/* ---------- init ---------- */
applySort();
apply();
welcome();
</script>
</body>
</html>
"""

html = (TEMPLATE
        .replace("__PAGE_DATA__", data_json)
        .replace("__BUILD_DATE__", build_date)
        .replace("__TOTAL__", str(len(rows))))

with open(OUT, "w", encoding="utf-8") as f:
    f.write(html)

print("Wrote {} ({:,} bytes) from {} rows".format(OUT, len(html.encode("utf-8")), len(rows)))
