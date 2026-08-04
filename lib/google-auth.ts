import { google } from "googleapis";
import { requireEnv } from "./env.ts";

export function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    requireEnv("GOOGLE_CLIENT_ID"),
    requireEnv("GOOGLE_CLIENT_SECRET")
  );
  client.setCredentials({ refresh_token: requireEnv("GOOGLE_REFRESH_TOKEN") });
  return client;
}
