import { test } from "node:test";
import assert from "node:assert";
import { requireEnv } from "../lib/env.ts";

const GOOGLE_VARS = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_OAUTH_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_OAUTH_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "GOOGLE_ADS_REFRESH_TOKEN",
];

function clearGoogle() {
  for (const v of GOOGLE_VARS) delete process.env[v];
}

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

// The shared MRC secrets file names these differently. See lib/env.ts ALIASES.

test("falls back to GOOGLE_OAUTH_CLIENT_ID", () => {
  clearGoogle();
  process.env.GOOGLE_OAUTH_CLIENT_ID = "mrc-id";
  assert.equal(requireEnv("GOOGLE_CLIENT_ID"), "mrc-id");
  clearGoogle();
});

test("falls back to GOOGLE_OAUTH_CLIENT_SECRET", () => {
  clearGoogle();
  process.env.GOOGLE_OAUTH_CLIENT_SECRET = "mrc-secret";
  assert.equal(requireEnv("GOOGLE_CLIENT_SECRET"), "mrc-secret");
  clearGoogle();
});

test("falls back to GOOGLE_ADS_REFRESH_TOKEN, which despite its name carries analytics scope", () => {
  clearGoogle();
  process.env.GOOGLE_ADS_REFRESH_TOKEN = "mrc-refresh";
  assert.equal(requireEnv("GOOGLE_REFRESH_TOKEN"), "mrc-refresh");
  clearGoogle();
});

test("the canonical name wins over its alias", () => {
  clearGoogle();
  process.env.GOOGLE_CLIENT_ID = "canonical";
  process.env.GOOGLE_OAUTH_CLIENT_ID = "alias";
  assert.equal(requireEnv("GOOGLE_CLIENT_ID"), "canonical");
  clearGoogle();
});

test("an empty canonical value falls through to a populated alias", () => {
  // Exactly the real situation: MRC's GOOGLE_REFRESH_TOKEN is declared but blank.
  clearGoogle();
  process.env.GOOGLE_REFRESH_TOKEN = "";
  process.env.GOOGLE_ADS_REFRESH_TOKEN = "populated";
  assert.equal(requireEnv("GOOGLE_REFRESH_TOKEN"), "populated");
  clearGoogle();
});

test("the error lists the aliases it also looked for", () => {
  clearGoogle();
  assert.throws(() => requireEnv("GOOGLE_REFRESH_TOKEN"), /GOOGLE_ADS_REFRESH_TOKEN/);
});
