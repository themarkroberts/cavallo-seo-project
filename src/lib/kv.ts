import { ClientSnapshot } from "./types";

function getKvClient() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { kv } = require("@vercel/kv");
    return kv;
  } catch {
    return null;
  }
}

export async function getSnapshotFromKV(clientSlug: string): Promise<ClientSnapshot | null> {
  const kv = getKvClient();
  if (!kv) return null;

  try {
    const data = await kv.get(`snapshot:${clientSlug}`);
    return data as ClientSnapshot | null;
  } catch {
    return null;
  }
}

export async function writeSnapshotToKV(clientSlug: string, snapshot: ClientSnapshot): Promise<void> {
  const kv = getKvClient();
  if (!kv) {
    console.warn("KV not available — snapshot not persisted");
    return;
  }

  try {
    await kv.set(`snapshot:${clientSlug}`, snapshot);
  } catch (e) {
    console.warn("KV write failed — snapshot not persisted:", e);
  }
}
