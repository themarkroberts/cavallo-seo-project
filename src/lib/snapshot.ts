import { ClientSnapshot } from "./types";
import { getSnapshotFromKV } from "./kv";
import { seedSnapshot } from "../../data/cavallo-history";

export async function getSnapshot(clientSlug: string): Promise<ClientSnapshot | null> {
  const kvSnapshot = await getSnapshotFromKV(clientSlug);
  if (kvSnapshot) return kvSnapshot;

  if (clientSlug === "cavallo") {
    return seedSnapshot as ClientSnapshot;
  }

  return null;
}
