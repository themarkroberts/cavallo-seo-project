import { blockedMerges, needsReview, roleCounts } from "./queries.ts";
import { buildGscIndex, joinGsc } from "./gsc-join.ts";
import { STATUS_LABEL, statusCounts } from "./phases.ts";
import type { Deliverable, Phase, ProjectState } from "./types.ts";
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

function deliverableCard(d: Deliverable): string {
  return `
    <article class="deliv" data-status="${esc(d.status)}">
      <header class="deliv__head">
        <h3><span class="deliv__id">${esc(d.id)}</span> ${esc(d.title)}</h3>
        <span class="badge badge--${esc(d.status)}">${esc(STATUS_LABEL[d.status])}</span>
      </header>
      <p class="deliv__promised"><span class="lbl">Promised</span> ${esc(d.promised)}</p>
      <p class="deliv__evidence"><span class="lbl">Status</span> ${esc(d.evidence)}</p>
      ${
        d.blockedBy
          ? `<p class="deliv__blocked"><span class="lbl">Blocked by</span> ${esc(d.blockedBy)}</p>`
          : ""
      }
      ${
        d.defects.length > 0
          ? `<div class="deliv__defects"><span class="lbl">Must fix before it ships</span>
             <ul>${d.defects.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`
          : ""
      }
      <p class="deliv__owner">Owner: <strong>${esc(d.owner)}</strong></p>
    </article>`;
}

function phaseSection(phase: Phase, hidden: boolean): string {
  const counts = statusCounts(phase.deliverables);
  const summary = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(
      ([status, n]) =>
        `<li><span class="badge badge--${esc(status)}">${esc(
          STATUS_LABEL[status as Deliverable["status"]]
        )}</span> ${n}</li>`
    )
    .join("");

  return `
<section id="phase-${phase.number}"${hidden ? " hidden" : ""}>
  <div class="phase__head">
    <h2>Phase ${phase.number} — ${esc(phase.title)}</h2>
    <p class="phase__meta">${esc(phase.month)}${
      phase.active ? ` <span class="badge badge--active">Active now</span>` : ""
    }</p>
  </div>
  <p class="phase__outcome"><span class="lbl">Promised outcome</span> ${esc(phase.outcome)}</p>
  ${phase.note ? `<p class="phase__note">${esc(phase.note)}</p>` : ""}
  <ul class="summary">${summary}</ul>
  <h3 class="sec">Deliverables</h3>
  ${phase.deliverables.map(deliverableCard).join("")}
  ${
    phase.teamRole.length > 0
      ? `<h3 class="sec">What the Cavallo team owes this phase</h3>
         <ul class="teamrole">${phase.teamRole.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`
      : ""
  }
</section>`;
}

function metricsBlock(state: ProjectState): string {
  if (!state.metrics) {
    return `<p class="warn">The numbers have <strong>never been refreshed</strong>.
      Run <code>npm run refresh</code> to fetch them.</p>`;
  }
  const latest = state.metrics.visibility.at(-1);
  return `
    <p class="metric">Organic traffic: <strong>${latest ? latest.value.toLocaleString() : "—"}</strong>
      <span class="qualifier">(${latest ? esc(latest.month) : "no data"} — Ahrefs ESTIMATE,
      not measured clicks)</span></p>
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
    ${measured ? "" : `<p class="warn">Measured traffic not fetched yet — run <code>npm run refresh</code>.</p>`}
    <input id="filter" placeholder="Filter ${pages.length} pages by URL, pillar, role, or evidence…">
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
  const phases = state.phases.phases;

  // First active phase is the tab shown on open.
  const defaultPhase = phases.find((p) => p.active)?.number ?? phases[0]?.number;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cavallo SEO — project state</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.6 system-ui, sans-serif; margin: 0 auto; max-width: 1100px; padding: 2rem; }
  h1 { margin-bottom: .25rem; }
  nav { display: flex; flex-wrap: wrap; gap: .1rem; border-bottom: 1px solid #8884; margin-bottom: 1.5rem; }
  nav button { font: inherit; padding: .6rem 1rem; border: 0; background: transparent; cursor: pointer; border-bottom: 3px solid transparent; }
  nav button[aria-selected="true"] { border-bottom-color: currentColor; font-weight: 600; }
  nav .spacer { flex: 1; }
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

  /* phases */
  .phase__head { display: flex; align-items: baseline; gap: .75rem; flex-wrap: wrap; }
  .phase__head h2 { margin: 0 0 .25rem; }
  .phase__meta { margin: 0; color: #8a8a8a; }
  .phase__outcome { padding: .75rem 1rem; background: #8881; border-radius: 6px; }
  .phase__note { padding: .75rem 1rem; border-left: 4px solid #c93; background: #c9930f18; }
  .lbl { display: inline-block; font-size: .7rem; letter-spacing: .06em; text-transform: uppercase;
         color: #8a8a8a; font-weight: 600; margin-right: .4rem; }
  .summary { display: flex; flex-wrap: wrap; gap: .5rem 1rem; padding: 0; list-style: none;
             margin: 1rem 0; font-size: .85rem; }
  h3.sec { border-bottom: 1px solid #8884; padding-bottom: .3rem; margin-top: 2rem; }
  .deliv { border: 1px solid #8884; border-left-width: 4px; border-radius: 6px;
           padding: 1rem 1.1rem; margin: .9rem 0; }
  .deliv[data-status="done"] { border-left-color: #3a8; }
  .deliv[data-status="built"] { border-left-color: #48c; }
  .deliv[data-status="in-progress"] { border-left-color: #c93; }
  .deliv[data-status="blocked"] { border-left-color: #c54; }
  .deliv[data-status="not-started"] { border-left-color: #8886; }
  .deliv__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
  .deliv__head h3 { margin: 0 0 .5rem; font-size: 1.05rem; }
  .deliv__id { font-family: ui-monospace, monospace; color: #8a8a8a; margin-right: .3rem; }
  .deliv p { margin: .45rem 0; }
  .deliv__promised { color: #8a8a8a; }
  .deliv__blocked { padding: .6rem .8rem; background: #cc554418; border-radius: 4px; }
  .deliv__defects { padding: .6rem .8rem; background: #c9930f18; border-radius: 4px; margin: .45rem 0; }
  .deliv__defects ul { margin: .4rem 0 0; padding-left: 1.2rem; }
  .deliv__owner { font-size: .85rem; color: #8a8a8a; }
  .badge { display: inline-block; font-size: .72rem; font-weight: 600; letter-spacing: .03em;
           padding: .2rem .55rem; border-radius: 99px; white-space: nowrap; border: 1px solid; }
  .badge--done { color: #3a8; border-color: #3a88; background: #33aa8818; }
  .badge--built { color: #48c; border-color: #48c8; background: #4488cc18; }
  .badge--in-progress { color: #c93; border-color: #c938; background: #cc993318; }
  .badge--blocked { color: #c54; border-color: #c548; background: #cc554418; }
  .badge--not-started { color: #8a8a8a; border-color: #8886; }
  .badge--active { color: #3a8; border-color: #3a88; background: #33aa8818; }
  .teamrole { padding-left: 1.2rem; }
</style></head>
<body>
<h1>Cavallo SEO — project state</h1>
<p class="muted">Six-month engagement, June–November 2026. Deliverables as promised in
  <code>${esc(state.phases.source)}</code> &middot; updated ${esc(state.phases.updated)}</p>
<nav role="tablist">
  ${phases
    .map(
      (p) =>
        `<button role="tab" aria-controls="phase-${p.number}" aria-selected="${
          p.number === defaultPhase
        }">Phase ${p.number}</button>`
    )
    .join("\n  ")}
  <span class="spacer"></span>
  <button role="tab" aria-controls="pages" aria-selected="false">Pages</button>
  <button role="tab" aria-controls="why" aria-selected="false">Decisions</button>
  <button role="tab" aria-controls="strategy" aria-selected="false">Strategy</button>
  <button role="tab" aria-controls="notes" aria-selected="false">Notes</button>
</nav>

${phases.map((p) => phaseSection(p, p.number !== defaultPhase)).join("\n")}

<section id="pages" hidden>
  ${metricsBlock(state)}
  ${
    measured
      ? `<p class="metric">Measured clicks: <strong>${measuredClicks.toLocaleString()}</strong>
          <span class="qualifier">(Google Search Console, ${esc(state.gsc!.startDate)} to
          ${esc(state.gsc!.endDate)} — real clicks, not an estimate)</span></p>`
      : ""
  }
  <h3>All ${state.pages.length} pages by role</h3>
  <ul class="counts">${Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([role, n]) => `<li><span class="role">${esc(role)}</span> ${n}</li>`)
    .join("")}</ul>
  <p>${review.length} row${review.length === 1 ? "" : "s"} needs review.</p>
  ${blockedBlock(state)}
  ${pagesTable(pages, measured)}
</section>

<section id="why" hidden>
  ${
    state.learn.length === 0
      ? `<p class="warn">No explanatory documents written yet. They belong in <code>learn/</code>.</p>`
      : state.learn.map((d) => `<article>${md(d.body)}</article>`).join("\n<hr>\n")
  }
  <h2>Decisions</h2>
  ${md(state.decisions)}
</section>

<section id="strategy" hidden>
  ${
    state.reference.length === 0
      ? `<p class="warn">No strategy reference imported yet. It belongs in <code>reference/</code>.</p>`
      : `<p class="muted">${state.reference.length} document${
          state.reference.length === 1 ? "" : "s"
        } imported from Notion and the work repo. Notion is an archive; these files are authoritative.</p>
        <ul>${state.reference
          .map((d) => `<li><a href="#ref-${esc(d.slug)}">${esc(d.title)}</a></li>`)
          .join("")}</ul>
        ${state.reference
          .map((d) => `<article id="ref-${esc(d.slug)}">${md(d.body)}</article>`)
          .join("\n<hr>\n")}`
  }
</section>

<section id="notes" hidden>
  <p class="muted">Working notes. The phase tabs are the deliverable record; these are the
    running analysis behind them.</p>
  ${md(state.whereWeAre)}
  <hr>
  ${md(state.nextActions)}
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
