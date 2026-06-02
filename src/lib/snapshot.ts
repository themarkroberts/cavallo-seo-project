import { ClientSnapshot } from "./types";
import { seedSnapshot } from "../../data/cavallo-history";

export async function getSnapshot(clientSlug: string): Promise<ClientSnapshot | null> {
  // In production, this reads from Vercel KV.
  // For now, return seed data for development.
  if (clientSlug === "cavallo") {
    return seedSnapshot as ClientSnapshot;
  }
  return null;
}
