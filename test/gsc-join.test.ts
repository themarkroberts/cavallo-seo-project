import { test } from "node:test";
import assert from "node:assert";
import { normaliseUrl, buildGscIndex, joinGsc, gscContradictions } from "../lib/gsc-join.ts";
import type { PageRow } from "../lib/types.ts";

function row(over: Partial<PageRow> = {}): PageRow {
  return {
    url: "https://cavallo-inc.com/a/",
    pillar: "None",
    role: "PRUNE",
    destinationUrl: "",
    evidence: "AUTO. tr=0",
    source: "Auto",
    needsReview: false,
    ...over,
  };
}

test("normalises protocol, www, trailing slash and case", () => {
  const expected = "cavallo-inc.com/a";
  assert.equal(normaliseUrl("https://cavallo-inc.com/a/"), expected);
  assert.equal(normaliseUrl("http://cavallo-inc.com/a"), expected);
  assert.equal(normaliseUrl("https://www.cavallo-inc.com/a/"), expected);
  assert.equal(normaliseUrl("https://WWW.Cavallo-Inc.com/A/"), expected);
});

test("normalises the bare root consistently", () => {
  assert.equal(normaliseUrl("https://cavallo-inc.com/"), normaliseUrl("https://www.cavallo-inc.com"));
});

test("sums clicks when two GSC rows normalise to the same key", () => {
  // Real case: the site reports / and www./ as separate rows.
  const index = buildGscIndex([
    { url: "https://cavallo-inc.com/", clicks: 15750, impressions: 500000 },
    { url: "https://www.cavallo-inc.com/", clicks: 613, impressions: 20000 },
  ]);
  const root = index.get(normaliseUrl("https://cavallo-inc.com/"));
  assert.equal(root?.clicks, 16363);
  assert.equal(root?.impressions, 520000);
});

test("joins measured data onto pages, defaulting missing to zero", () => {
  const pages = [row({ url: "https://cavallo-inc.com/a/" }), row({ url: "https://cavallo-inc.com/b/" })];
  const index = buildGscIndex([{ url: "https://cavallo-inc.com/a", clicks: 12, impressions: 300 }]);
  const joined = joinGsc(pages, index);
  assert.equal(joined[0].clicks, 12);
  assert.equal(joined[0].impressions, 300);
  assert.equal(joined[1].clicks, 0);
  assert.equal(joined[1].impressions, 0);
});

test("contradiction = a PRUNE or NOINDEX page at or above the threshold", () => {
  const pages = [
    row({ url: "https://cavallo-inc.com/keep/", role: "PRUNE" }),
    row({ url: "https://cavallo-inc.com/low/", role: "PRUNE" }),
    row({ url: "https://cavallo-inc.com/hidden/", role: "NOINDEX" }),
    row({ url: "https://cavallo-inc.com/spoke/", role: "KEEP-SPOKE" }),
  ];
  const index = buildGscIndex([
    { url: "https://cavallo-inc.com/keep/", clicks: 245, impressions: 9000 },
    { url: "https://cavallo-inc.com/low/", clicks: 3, impressions: 90 },
    { url: "https://cavallo-inc.com/hidden/", clicks: 38, impressions: 800 },
    { url: "https://cavallo-inc.com/spoke/", clicks: 900, impressions: 20000 },
  ]);
  const found = gscContradictions(pages, index, 10);
  assert.equal(found.length, 2, "only PRUNE/NOINDEX at >=10 clicks");
  assert.deepEqual(found.map((f) => f.clicks), [245, 38], "sorted by clicks descending");
});

test("a keep-role page is never a contradiction however much traffic it has", () => {
  const pages = [row({ url: "https://cavallo-inc.com/x/", role: "OPTIMIZE" })];
  const index = buildGscIndex([{ url: "https://cavallo-inc.com/x/", clicks: 5000, impressions: 1 }]);
  assert.equal(gscContradictions(pages, index, 10).length, 0);
});

test("threshold is inclusive", () => {
  const pages = [row({ url: "https://cavallo-inc.com/x/", role: "PRUNE" })];
  const index = buildGscIndex([{ url: "https://cavallo-inc.com/x/", clicks: 10, impressions: 1 }]);
  assert.equal(gscContradictions(pages, index, 10).length, 1);
});

test("rows already flagged for review are not reported again", () => {
  const pages = [row({ url: "https://cavallo-inc.com/x/", role: "PRUNE", needsReview: true })];
  const index = buildGscIndex([{ url: "https://cavallo-inc.com/x/", clicks: 245, impressions: 1 }]);
  assert.equal(gscContradictions(pages, index, 10).length, 0);
});
