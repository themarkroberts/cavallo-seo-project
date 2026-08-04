/**
 * Credential gate. Throws rather than returning a falsy value, because the
 * retired app's habit of silently continuing without credentials is exactly
 * how it came to display June data labelled as current.
 *
 * Google credentials are shared with the sibling mrc-marketing project, which
 * names them differently. Rather than duplicating secrets across two repos,
 * the scripts load `../mrc-marketing/.env` and these aliases bridge the names.
 */
const ALIASES: Record<string, string[]> = {
  GOOGLE_CLIENT_ID: ["GOOGLE_OAUTH_CLIENT_ID"],
  GOOGLE_CLIENT_SECRET: ["GOOGLE_OAUTH_CLIENT_SECRET"],
  // Named for Ads, but the consent covered adwords + analytics.readonly +
  // tagmanager.readonly + webmasters.readonly, so it reads GA4 and Search
  // Console too. mrc-marketing's own GOOGLE_REFRESH_TOKEN is blank.
  GOOGLE_REFRESH_TOKEN: ["GOOGLE_ADS_REFRESH_TOKEN"],
};

export function requireEnv(name: string): string {
  const candidates = [name, ...(ALIASES[name] ?? [])];

  for (const candidate of candidates) {
    const value = process.env[candidate];
    if (value) return value;
  }

  const alsoTried =
    candidates.length > 1
      ? `\nAlso looked for: ${candidates.slice(1).join(", ")}`
      : "";

  throw new Error(
    `Missing required environment variable ${name}.${alsoTried}\n` +
      `Add it to .env.local in the repo root, or to the shared ` +
      `../mrc-marketing/.env, then re-run.`
  );
}
