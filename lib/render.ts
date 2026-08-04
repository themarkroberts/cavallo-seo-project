import { blockedMerges, needsReview, roleCounts } from "./queries.ts";
import { buildGscIndex, joinGsc } from "./gsc-join.ts";
import type { ProjectState } from "./types.ts";
import type { PageWithGsc } from "./gsc-join.ts";

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Deliberately minimal markdown: headings, bold, code, lists, paragraphs. */
function md(src: string): string {
  const lines = src.split("\n");
  const out: string[] = [];
  let inList = false;

  const inline = (t: string) =>
    esc(t)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

  for (const line of lines) {
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);

    if (li || ol) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline((li ?? ol)![1])}</li>`);
      continue;
    }
    if (inList) {
      out.push("</ul>");
      inList = false;
    }

    if (h) out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);
    else if (line.trim() === "") out.push("");
    else out.push(`<p>${inline(line)}</p>`);
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

function metricsBlock(state: ProjectState): string {
  if (!state.metrics) {
    return `<p class="warn">The numbers have <strong>never been refreshed</strong>.
      Run <code>npm run refresh</code> to fetch them.</p>`;
  }
  const latest = state.metrics.visibility.at(-1);
  return `
    <p class="metric">Organic traffic: <strong>${latest ? latest.value.toLocaleString() : "—"}</strong>
      <span class="qualifier">(${latest ? esc(latest.month) : "no data"} — Ahrefs estimate,
      not measured clicks; Search Console is blocked for this domain)</span></p>
    <p class="muted">Last refreshed ${esc(state.metrics.fetchedAt)}</p>`;
}

function blockedBlock(state: ProjectState): string {
  const blocked = blockedMerges(state.pages);
  if (blocked.length === 0) return "";
  const total = blocked.reduce((n, b) => n + b.count, 0);
  return `
    <h3>Blocked: ${total} merges cannot run yet</h3>
    <p>They point at pages that do not exist. The <strong>301 safety rule</strong>: redirecting a
      page before its destination has live content throws the ranking signal away instead of
      passing it on.</p>
    <ul>${blocked
      .map((b) => `<li><strong>${esc(b.destination)}</strong> — ${b.count} waiting</li>`)
      .join("")}</ul>`;
}

function pagesTable(pages: PageWithGsc[], measured: boolean): string {
  const rows = pages
    .map(
      (p) => `<tr data-review="${p.needsReview}">
        <td><a href="${esc(p.url)}">${esc(p.url)}</a></td>
        <td>${esc(p.pillar)}</td>
        <td><span class="role">${esc(p.role)}</span></td>
        <td class="num">${p.clicks || ""}</td>
        <td class="num">${p.impressions || ""}</td>
        <td>${esc(p.destinationUrl)}</td>
        <td>${esc(p.evidence)}</td>
        <td>${p.needsReview ? "REVIEW" : ""}</td>
      </tr>`
    )
    .join("");

  const clicksHeader = measured
    ? `<th class="num sortable" data-col="3" title="Measured clicks from Google Search Console, last 12 months">Clicks<br><span class="qualifier">measured</span></th>
       <th class="num sortable" data-col="4" title="Measured impressions from Google Search Console">Impr.<br><span class="qualifier">measured</span></th>`
    : `<th class="num">Clicks</th><th class="num">Impr.</th>`;

  return `
    ${measured ? "" : `<p class="warn">Measured traffic not fetched yet \u2014 run <code>npm run refresh</code>.</p>`}
    <input id="filter" placeholder="Filter ${pages.length} pages by URL, pillar, role, or evidence\u2026">
    <label><input type="checkbox" id="only-review"> Only rows needing review</label>
    <table id="pages">
      <thead><tr><th>URL</th><th>Pillar</th><th>Role</th>${clicksHeader}<th>Destination</th><th>Evidence</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

export function renderDashboard(state: ProjectState): string {
  const counts = roleCounts(state.pages);
  const review = needsReview(state.pages);
  const gscIndex = buildGscIndex(state.gsc?.pages ?? []);
  const pages = joinGsc(state.pages, gscIndex);
  const measured = state.gsc !== null;
  const measuredClicks = pages.reduce((n, p) => n + p.clicks, 0);

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>Cavallo SEO — project state</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.6 system-ui, sans-serif; margin: 0 auto; max-width: 1100px; padding: 2rem; }
  nav button { font: inherit; padding: .6rem 1.2rem; border: 0; background: transparent; cursor: pointer; border-bottom: 3px solid transparent; }
  nav button[aria-selected="true"] { border-bottom-color: currentColor; font-weight: 600; }
  section[hidden] { display: none; }
  table { border-collapse: collapse; width: 100%; font-size: .82rem; }
  th, td { text-align: left; padding: .35rem .5rem; border-bottom: 1px solid #8883; vertical-align: top; }
  td a { word-break: break-all; }
  .role { font-family: ui-monospace, monospace; font-size: .78rem; }
  .warn { padding: .75rem 1rem; border-left: 4px solid #c93; background: #c9930f18; }
  .qualifier, .muted { color: #8a8a8a; font-weight: 400; font-size: .85rem; }
  .metric { font-size: 1.1rem; }
  .counts { display: flex; flex-wrap: wrap; gap: .5rem 1.25rem; padding: 0; list-style: none; }
  #filter { width: 100%; font: inherit; padding: .5rem; margin: 1rem 0 .5rem; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  th.sortable { cursor: pointer; text-decoration: underline dotted; }
</style></head>
<body>
<h1>Cavallo SEO — project state</h1>
<nav role="tablist">
  <button role="tab" aria-controls="where-we-are" aria-selected="true">Where we are</button>
  <button role="tab" aria-controls="whats-next" aria-selected="false">What's next</button>
  <button role="tab" aria-controls="why" aria-selected="false">Why</button>
</nav>

<section id="where-we-are">
  ${md(state.whereWeAre)}
  ${metricsBlock(state)}
  ${
    measured
      ? `<p class="metric">Measured clicks: <strong>${measuredClicks.toLocaleString()}</strong>
          <span class="qualifier">(Google Search Console, ${esc(state.gsc!.startDate)} to
          ${esc(state.gsc!.endDate)} \u2014 real clicks, not an estimate)</span></p>`
      : ""
  }
  <h3>All ${state.pages.length} pages by role</h3>
  <ul class="counts">${Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([role, n]) => `<li><span class="role">${esc(role)}</span> ${n}</li>`)
    .join("")}</ul>
  <p>${review.length} row${review.length === 1 ? "" : "s"} needs review.</p>
</section>

<section id="whats-next" hidden>
  ${md(state.nextActions)}
  ${blockedBlock(state)}
</section>

<section id="why" hidden>
  ${
    state.learn.length === 0
      ? `<p class="warn">No explanatory documents written yet. They belong in <code>learn/</code>.</p>`
      : state.learn.map((d) => `<article>${md(d.body)}</article>`).join("\n<hr>\n")
  }
  <h2>Decisions</h2>
  ${md(state.decisions)}
  <h2>Every page and why</h2>
  ${pagesTable(pages, measured)}
</section>

<script>
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      const active = t === tab;
      t.setAttribute("aria-selected", String(active));
      panel.hidden = !active;
    });
  }));

  const filter = document.getElementById("filter");
  const onlyReview = document.getElementById("only-review");
  const rows = [...document.querySelectorAll("#pages tbody tr")];
  function apply() {
    const q = filter.value.toLowerCase();
    const only = onlyReview.checked;
    for (const row of rows) {
      const matchesText = row.textContent.toLowerCase().includes(q);
      const matchesReview = !only || row.dataset.review === "true";
      row.hidden = !(matchesText && matchesReview);
    }
  }
  filter.addEventListener("input", apply);
  onlyReview.addEventListener("change", apply);

  // Sort by a numeric column, descending. Re-appends rows in place.
  const tbody = document.querySelector("#pages tbody");
  document.querySelectorAll("th.sortable").forEach((th) => th.addEventListener("click", () => {
    const col = Number(th.dataset.col);
    const num = (tr) => Number(tr.children[col].textContent.trim() || 0);
    [...rows].sort((a, b) => num(b) - num(a)).forEach((tr) => tbody.appendChild(tr));
  }));
</script>
</body></html>`;
}
