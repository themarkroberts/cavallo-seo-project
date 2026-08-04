import { test } from "node:test";
import assert from "node:assert";
import { parseCsv, serializeCsv } from "../lib/csv.ts";

test("parses a simple row", () => {
  assert.deepEqual(parseCsv("a,b,c"), [["a", "b", "c"]]);
});

test("parses quoted field containing commas", () => {
  const input = 'url,"AUTO. faq, wc=1100, tr=0",Auto';
  assert.deepEqual(parseCsv(input), [["url", "AUTO. faq, wc=1100, tr=0", "Auto"]]);
});

test("parses escaped double quotes inside a quoted field", () => {
  assert.deepEqual(parseCsv('a,"he said ""hi""",c'), [["a", 'he said "hi"', "c"]]);
});

test("parses multiple rows and ignores a trailing newline", () => {
  assert.deepEqual(parseCsv("a,b\nc,d\n"), [["a", "b"], ["c", "d"]]);
});

test("preserves empty trailing field", () => {
  assert.deepEqual(parseCsv("a,b,"), [["a", "b", ""]]);
});

test("serialize quotes only fields that need it", () => {
  assert.equal(serializeCsv([["a", "b,c", 'd"e']]), 'a,"b,c","d""e"');
});

test("round-trips the real evidence format", () => {
  const rows = [[
    "https://cavallo-inc.com/faq/x/",
    "Pillar 1 — Hoof Boots",
    "KEEP-SPOKE",
    "",
    "AUTO. faq, wc=1100, tr=0, li=11. FAQ (boots (commercial)) — keep as spoke.",
    "Auto",
    "No",
  ]];
  assert.deepEqual(parseCsv(serializeCsv(rows)), rows);
});
