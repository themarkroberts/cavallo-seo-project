import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { readPages } from "./pages.ts";
import type { GscSnapshot, LearnDoc, Metrics, ProjectState, TaskSnapshot } from "./types.ts";

function readRequired(path: string): string {
  if (!existsSync(path)) {
    throw new Error(`Missing required state file: ${path}`);
  }
  return readFileSync(path, "utf8");
}

function readOptionalJson<T>(path: string): T | null {
  return existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as T) : null;
}

export function readLearnDocs(dir: string): LearnDoc[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const body = readFileSync(join(dir, file), "utf8");
      const slug = basename(file, ".md");
      const heading = body.match(/^#\s+(.+)$/m);
      return { slug, title: heading ? heading[1].trim() : slug, body };
    });
}

export function readState(root: string = "."): ProjectState {
  const s = (f: string) => join(root, "state", f);
  return {
    whereWeAre: readRequired(s("where-we-are.md")),
    decisions: readRequired(s("decisions.md")),
    nextActions: readRequired(s("next-actions.md")),
    pages: readPages(s("pages.csv")),
    metrics: readOptionalJson<Metrics>(s("metrics.json")),
    tasks: readOptionalJson<TaskSnapshot>(s("tasks.json")),
    gsc: readOptionalJson<GscSnapshot>(s("gsc.json")),
    learn: readLearnDocs(join(root, "learn")),
    reference: readLearnDocs(join(root, "reference")),
  };
}
