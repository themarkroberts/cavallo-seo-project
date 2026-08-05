/** The one client this repo serves. Replaces the former multi-client registry. */
export const config = {
  name: "Cavallo Inc.",
  projectStart: "2026-06-01",
  ga4PropertyId: "319655127",
  /** Search Console property. Domain-level, verified as siteOwner 2026-08-04. */
  gscSiteUrl: "sc-domain:cavallo-inc.com",
  ahrefs: { target: "cavallo-inc.com", mode: "subdomains" },
  competitors: [
    { target: "scootboots.com", mode: "subdomains", label: "Scoot Boots" },
    { target: "renegadehoofboots.com", mode: "subdomains", label: "Renegade Hoof Boots" },
    { target: "easycareinc.com", mode: "subdomains", label: "EasyCare" },
    { target: "softrideboots.com", mode: "subdomains", label: "Softride Boots" },
  ],
  /** Project Tasks. The ONLY Notion object this repo touches, and read-only. */
  notionTasksDataSourceId: "ff3ec7b0-97d8-42a0-b323-5eb8badc3a1e",
  /**
   * The WordPress repo where the pillar build actually happens. Execution truth: if a doc here
   * and this branch disagree about what is built, the branch wins. `wp-seo` in the repo root is a
   * gitignored symlink to `worktree` for convenience; code should use these paths, not the symlink.
   */
  workRepo: {
    repo: "themarkroberts/cavallo",
    branch: "seo",
    /**
     * ⚠️ NEVER WRITE HERE, AND NEVER RUN GIT COMMANDS HERE. This checkout floats between branches
     * (observed on `dev` then `main` within one session), so committing risks landing SEO work on
     * `dev` or `main`. Recorded for reference only. The LocalWP site root above it is 39 GB and is
     * NOT a git repo at all.
     */
    codeRoot: "/Users/markreaction/Local Sites/cavallo/app/public/wp-content",
    /**
     * ✅ THE ONLY PLACE TO WRITE. Persistent worktree pinned to `seo`; it cannot alter any other
     * branch. Also reachable as the gitignored `wp-seo` symlink in this repo's root.
     */
    worktree: "/Users/markreaction/Local Sites/cavallo/.worktrees/seo",
    /** Push with this remote. `Cavallo` is SSH and broken; its tracking refs are stale since 07-09. */
    pushRemote: "origin",
    /** Pushing `seo` triggers deploy-seo.yml -> cavallo.seo.markroberts.io. No staging. Ask first. */
    deploysOnPush: "https://cavallo.seo.markroberts.io",
  },
};

export type Config = typeof config;
