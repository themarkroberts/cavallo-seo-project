import { test } from "node:test";
import assert from "node:assert";
import { requireEnv } from "../lib/env.ts";

test("returns the value when set", () => {
  process.env.CAVALLO_TEST_VAR = "abc";
  assert.equal(requireEnv("CAVALLO_TEST_VAR"), "abc");
  delete process.env.CAVALLO_TEST_VAR;
});

test("throws naming the variable when unset", () => {
  delete process.env.CAVALLO_MISSING_VAR;
  assert.throws(() => requireEnv("CAVALLO_MISSING_VAR"), /CAVALLO_MISSING_VAR/);
});

test("throws when set to an empty string", () => {
  process.env.CAVALLO_EMPTY_VAR = "";
  assert.throws(() => requireEnv("CAVALLO_EMPTY_VAR"), /CAVALLO_EMPTY_VAR/);
  delete process.env.CAVALLO_EMPTY_VAR;
});

test("the message says how to fix it", () => {
  delete process.env.CAVALLO_MISSING_VAR;
  assert.throws(() => requireEnv("CAVALLO_MISSING_VAR"), /\.env\.local/);
});
