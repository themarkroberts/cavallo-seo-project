import { test } from "node:test";
import assert from "node:assert";
import { parsePages, serializePages } from "../lib/pages.ts";

const CSV = [
  "url,pillar,role,destination_url,evidence,source,needs_review",
  'https://x.com/a/,Pillar 1 — Hoof Boots,KEEP-SPOKE,,"AUTO. faq, wc=1100",Auto,No',
  'https://x.com/b/,Pillar 2 — Hoof Health,MERGE+301,(NEW) Pillar 2 — Hoof Abscess spoke,"SEED.",Seed,Yes',
].join("\n");

test("parses rows into PageRow objects", () => {
  const rows = parsePages(CSV);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].url, "https://x.com/a/");
  assert.equal(rows[0].role, "KEEP-SPOKE");
  assert.equal(rows[0].evidence, "AUTO. faq, wc=1100");
});

test("maps needs_review to a boolean", () => {
  const rows = parsePages(CSV);
  assert.equal(rows[0].needsReview, false);
  assert.equal(rows[1].needsReview, true);
});

test("preserves a (NEW) destination verbatim", () => {
  const rows = parsePages(CSV);
  assert.equal(rows[1].destinationUrl, "(NEW) Pillar 2 — Hoof Abscess spoke");
});

test("rejects an unknown role rather than guessing", () => {
  const bad =
    "url,pillar,role,destination_url,evidence,source,needs_review\nhttps://x.com/,None,DELETE,,e,Auto,No";
  assert.throws(() => parsePages(bad), /Unknown role "DELETE"/);
});

test("rejects a header that does not match the expected schema", () => {
  assert.throws(() => parsePages("url,role\nhttps://x.com/,PRUNE"), /Unexpected header/);
});

test("round-trips without loss", () => {
  assert.deepEqual(parsePages(serializePages(parsePages(CSV))), parsePages(CSV));
});
