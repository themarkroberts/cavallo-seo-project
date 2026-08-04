/**
 * Credential gate. Throws rather than returning a falsy value, because the
 * retired app's habit of silently continuing without credentials is exactly
 * how it came to display June data labelled as current.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}.\n` +
        `Add it to .env.local in the repo root, then re-run.\n` +
        `Required: NOTION_TOKEN, AHREFS_API_TOKEN, GOOGLE_CLIENT_ID, ` +
        `GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN`
    );
  }
  return value;
}
