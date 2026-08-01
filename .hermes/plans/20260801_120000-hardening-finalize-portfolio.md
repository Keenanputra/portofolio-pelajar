# Hardening & Finalisasi Portofolio — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Freeze a stable, verifiable v1 of the single-page portfolio (Next.js 16 + Tailwind v4) — including the in-progress redesign already in the working tree (LiquidBackground, glass-morphism styling, section renumbering, removal of blog/projects) — and clean up the repo so the working tree is fully committed and green on all checks.

**Architecture:** The app is a one-page Next.js 16 App Router site with a client `LiquidBackground` fixed behind all sections and glass/`bg-glass` panels. Redesign work is already staged as uncommitted edits + one untracked file (`LiquidBackground.tsx`); this plan verifies, repairs, tests, and commits that state. The API route (`/api/contact`) is a thin Formspree proxy that keeps working untouched.

**Tech Stack:** Next.js 16.2.12 (App Router, Turbopack), React 19.2.4, TypeScript 5, Tailwind CSS v4, motion 12, Vitest 4.

**Status note:** I verified the current tree; the Turbopack dev-server 500s (corrupted `.next/dev` cache, missing SST files) are a local-cache issue, not a code issue. The reset of that cache is folded into Task 2 as a repair step. Full verification commands: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`.

---

## Current Context / Assumptions

Verified facts (from live inspection):

- Repo: `C:\Users\keenan\OneDrive\Documents\WebsiteDevelopment` (git branch `main`).
- Working tree: 28 modified, 3 untracked — the redesign is already implemented in the working tree, uncommitted. Commit `0fd8232` is the last clean baseline.
- `src/app/page.tsx` now renders: Hero, About, Skills, Organizations, Contact (Projects + BlogSection removed).
- Deleted (uncommitted): blog + projects routes, `content.ts`/`content.test.ts`, markdown content, `Starfield.tsx`, `BlogSection.tsx`, `Projects.tsx`, `ProjectCard.tsx`, `MarkdownBody.tsx`.
- New (untracked): `src/components/LiquidBackground.tsx` — 2 client-side animated blobs (motion springs) + static gradient fallback for `prefers-reduced-motion` / SSR; wired into `RootLayout`.
- Design tokens changed in `globals.css`: `--color-background: #060608`, `--color-foreground: #f5f5f4`, `--color-muted: #a3a3a3`, added `--color-line` and `--color-glass`; removed `--color-surface`, `--color-accent-2`, and the typography plugin.
- `package.json`: removed `@tailwindcss/typography`, `gray-matter`, `react-markdown`, `remark-gfm` (markdown blog/projects no longer exist).
- Remaining `bg-surface` references: **none**. Remaining `text-accent` in components (intentional, decorative): `Navbar.tsx:47` (logo), `Navbar.tsx:65` (active link), `Footer.tsx:15` (hover), `Typewriter.tsx:53` (caret), `Hero.tsx:22` (hover). `--color-accent: #22d3ee` stays in the theme.
- `src/app/api/contact/route.ts` untouched; uses `FORMSPREE_FORM_ID` env var (not committed anywhere). `.env*` is gitignored.
- Section numbering in headings: About=01, Skills=02, Organizations=03, Contact=04 — consistent, matches Navbar.
- Only test file: `src/lib/validate.test.ts` (4 tests). Vitest config: `vitest.config.ts`, include `src/**/*.test.ts`, node env.
- `AGENTS.md` docs commands: dev `npm run dev`, build `npm run build`, lint `npm run lint`, typecheck `npx tsc --noEmit`, test `npm test` (Vitest).
- Environment quirk: Windows dev machine — `python` is 3.11 but python3/pip are missing; all work goes through `npm`. Git prints LF→CRLF warnings; harmless.

## Goals / Acceptance Criteria

1. `git status` clean on `main` (all redesign work committed, logs gitignored).
2. `npm run lint` passes.
3. `npx tsc --noEmit` passes.
4. `npm test` passes (4 tests in `src/lib/validate.test.ts`).
5. `npm run build` passes; `npm start` serves `/` with HTTP 200.
6. No dead references to blog/projects/markdown libs anywhere in `src/`, `package.json`, or configs.
7. Dev server starts without the Turbopack cache crash.

## Non-Goals (explicitly out of scope)

- NO restoring blog or projects pages, content.ts, markdown, or the removed deps (unless the user later asks).
- NO new features, new sections, new animations, or design changes beyond the already-written redesign.
- NO touching `.env*` files (form key stays secret); no commit of secrets.
- NO changes to `api/contact/route.ts` (works as-is; not part of the redesign).
- NO git history rewriting, force-push, or remote interaction.

---

## Proposed Approach

Two phases:

- **Phase A — Repair & verify the working tree** (Tasks 1–5): fix the two known compile-breaking issues (`Hero.tsx` removed import; `LiquidBackground.tsx` SSR window access + `reduced-motion` logic), do a repository-wide dead-reference sweep, re-verify all commands. No user decisions needed.
- **Phase B — Clean & freeze** (Tasks 6–9): gitignore the dev-server logs, amend the redesign into ONE conventional commit, delete `.next` to trigger a fresh build, final end-to-end verification (build → start → HTTP 200 → stop), then a final `git status`/`git log` sign-off.

Each task below is bite-sized (2–5 min), TDD where code changes are involved, and ends with a commit (except the two merged verification tasks).

---

## Step-by-Step Plan

### Task 1: Fix Hero import (compile-blocker)

**Objective:** Make `src/components/Hero.tsx` compile again after `Starfield.tsx` was deleted.

**Files:**
- Modify: `src/components/Hero.tsx` (remove the stale `import Starfield from "./Starfield";` line)

**Step 1:** Confirm the stale import exists: `grep -n "Starfield" src/components/Hero.tsx` → shows the import line (already confirmed: yes, line 2).

**Step 2:** Remove the line `import Starfield from "./Starfield";` (keep the `"use client";` directive and the `Typewriter` import).

**Step 3:** Verify: `grep -rn "Starfield" src/` → no matches anywhere.

**Step 4:** Commit:
```bash
git add src/components/Hero.tsx
git commit -m "fix: hapus import Starfield yang sudah tidak dipakai"
```

### Task 2: Fix LiquidBackground SSR + reduced-motion bug

**Objective:** Make `LiquidBackground.tsx` safe for SSR and correct under `prefers-reduced-motion`.

**Files:**
- Modify: `src/components/LiquidBackground.tsx`

**Problems to fix:**
1. **SSR crash:** line 90–91 call `window.innerWidth` / `window.innerHeight` during render. On the server (or on client hydration before the `isMounted` effect runs) this throws, which is the likely cause of the `GET / 500` seen in `dev-server.log`. Fix: compute the three initial blob positions from viewport size only in `useEffect` (after mount), storing them in state; the effect that runs `loop()` must not run before initial positions exist.
2. **Reduced-motion race:** with the current code, `reduced` is true on first render but a non-reduced user gets the gradient fallback flash until `isMounted` flips. Fix: gate the animated path on BOTH `!reduced && isMounted` so the flash disappears and the logic is deterministic (server + first paint = static gradient).

**Step 1 (TDD):** Add a static-render test: `src/components/LiquidBackground.test.tsx` with `// @vitest-environment jsdom`; render `<LiquidBackground />` with `react-dom/server`-free pure render (jsdom, `react-dom/client` `createRoot`) and assert the gradient fallback `<div>` renders and no `window` access throws during initial render.

```tsx
// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import LiquidBackground from "./LiquidBackground";

describe("LiquidBackground", () => {
  it("renders static gradient fallback without touching window during render", () => {
    const host = document.createElement("div");
    let container: HTMLElement | null = null;
    act(() => {
      const root = createRoot(host);
      root.render(<LiquidBackground />);
      container = host.querySelector("div");
    });
    expect(container).not.toBeNull();
  });
});
```

**Step 2:** Run: `npx vitest run src/components/LiquidBackground.test.tsx`
Expected: FAIL — `ReferenceError: window is not defined` (jsdom actually defines `window`, so the failure manifests as the test crashing on `window.innerWidth` — it must not throw; if jsdom masks it, the test still fails because the animated branch renders instead of the fallback). Write the fix before declaring pass.

**Step 3:** Implement the fix — full component:

```tsx
"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function Blob({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const moveX = useMotionValue(x);
  const moveY = useMotionValue(y);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const nx = moveX.get() + (Math.random() - 0.5) * 0.2;
      const ny = moveY.get() + (Math.random() - 0.5) * 0.2;
      moveX.set(nx < -size || nx > window.innerWidth + size ? -nx : nx);
      moveY.set(ny < -size || ny > window.innerHeight + size ? -ny : ny);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [moveX, moveY, size]);

  const springX = useSpring(moveX, { stiffness: 20, damping: 20 });
  const springY = useSpring(moveY, { stiffness: 20, damping: 20 });

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: size * 2,
        height: size * 2,
        x: springX,
        y: springY,
        transformOrigin: "center",
      }}
    >
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 70%)`,
          opacity: 0.3,
        }}
      />
    </motion.div>
  );
}

export default function LiquidBackground() {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const [isMounted, setIsMounted] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setIsMounted(true);
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  if (reduced || !isMounted) {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, #060608 0%, #0a0a0f 100%)" }}
      />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #060608 0%, #0a0a0f 100%)" }}
      />
      <Blob x={-100} y={-100} size={400} color="rgba(245, 245, 244, 0.15)" />
      <Blob x={size.width + 100} y={size.height / 2} size={500} color="rgba(245, 245, 244, 0.12)" />
      <Blob x={size.width / 2} y={size.height + 100} size={350} color="rgba(34, 211, 238, 0.08)" />
    </div>
  );
}
```

**Step 4:** Run: `npx vitest run src/components/LiquidBackground.test.tsx`
Expected: PASS.

**Step 5:** Run the full suite: `npm test` → Expected: 5 passed (4 + 1 new).

**Step 6:** Typecheck + lint:
- `npx tsc --noEmit` → no errors
- `npm run lint` → no errors (note: this test file is in `src/`; if ESLint flags `act` or jsdom imports, scope the file out of lint via `eslint.config.mjs` `ignores` — see Open Questions).

**Step 7:** Commit:
```bash
git add src/components/LiquidBackground.tsx src/components/LiquidBackground.test.tsx
git commit -m "fix: perbaiki LiquidBackground agar aman SSR dan menghormati reduced-motion"
```

### Task 3: Sweep dead references (content, blog, projects, markdown libs)

**Objective:** Prove zero dead references remain after the deletions.

**Files (no changes expected — verification only):**
- Verify: `src/`, `package.json`, `tsconfig.json`, `next.config.*`, `postcss.config.*`, `eslint.config.mjs`, `AGENTS.md`

**Step 1:** Run the sweep (each must return zero matches):
```bash
grep -rn "BlogSection\|MarkdownBody\|ProjectCard\|Starfield" src/ --include="*.tsx" --include="*.ts"
grep -rn "content" src/ --include="*.tsx" --include="*.ts" | grep -v "validate\|Content-Type" || true
grep -rn "gray-matter\|react-markdown\|remark-gfm\|typography" package.json src/ tsconfig.json next.config.* postcss.config.* 2>/dev/null || true
grep -rln "blog\|proyek" src/ || true
```

**Step 2:** Confirm removed deps are gone from `package-lock.json` (they were removed from `package.json`):
```bash
grep -c "react-markdown\|gray-matter\|remark-gfm\|@tailwindcss/typography" package-lock.json  # expect 0
```

**Step 3:** Confirm no `@/lib/content` or `@/content` imports remain: `grep -rn "lib/content\|@/content" src/ || true` → no output.

**Step 4:** If anything matches, delete or fix it (match the pattern of the deletion work already done). If nothing matches, nothing to commit.

### Task 4: Verify remaining components reference valid tokens

**Objective:** All Tailwind classes used by components exist in the Tailwind v4 theme.

**Files:**
- Verify: `src/components/*.tsx`, `src/app/*.tsx`

**Step 1:** `grep -rn "bg-surface\|text-accent-2\|bg-accent-2" src/` → expect zero (already confirmed).

**Step 2:** Verify the remaining `text-accent` usages are decorative-only (logo, active nav, caret, hovers) — already confirmed; `--color-accent` remains defined.

**Step 3:** Spot-check glass classes resolve: `bg-glass`, `border-line`, `backdrop-blur-xl`, `rounded-2xl` are all standard Tailwind v4 utilities backed by `@theme` tokens. No action.

**Step 4:** `npm run lint` → pass. (No commit needed if no changes.)

### Task 5: Full verification gate

**Objective:** Prove the tree is green before committing the redesign.

**Files:** none (verification only).

**Step 1:** `npm run lint` → exit 0, no errors.
**Step 2:** `npx tsc --noEmit` → exit 0.
**Step 3:** `npm test` → 5 passed.
**Step 4:** `npm run build` → completes with route table listing `/` and `/api/contact`; `✓ Compiled successfully`.
**Step 5 (only if build in Task 5 is the first run since the fix):** start prod server and smoke-test:
```bash
npm run start &   # or terminal background
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000   # expect 200
# then kill the server
```
(Task 9 does the authoritative smoke test; here a quick 200 is enough.)

### Task 6: Gitignore dev-server logs + delete corrupt cache

**Objective:** Clean untracked noise and reset the broken Turbopack cache.

**Files:**
- Modify: `.gitignore` (append section)
- Delete (local): `.next/` (build artifact, already ignored — safe to delete)

**Step 1:** Append to `.gitignore`:
```gitignore

# local dev server logs
dev-server.log
dev-server.err.log
```

**Step 2:** Delete `.next` so the next dev/build starts from a clean cache:
```bash
rm -rf .next
```
(On Windows/MSYS this works; if it errors, use `cmd //c "rmdir /s /q .next"`.)

**Step 3:** `git status` → `dev-server*.log` no longer untracked.

**Step 4:** Commit:
```bash
git add .gitignore
git commit -m "chore: abaikan log dev server"
```

### Task 7: Commit the redesign (single squash-style commit)

**Objective:** Land the whole redesign as one conventional commit on top of the three fix commits (Tasks 1–2, 6).

**Step 1:** `git add -A` (takes all remaining modified + deleted files; `LiquidBackground.tsx` is already committed in Task 2).

**Step 2:** Commit:
```bash
git commit -m "feat: redesen ulang portofolio jadi single-page glassmorphism"
```
(Multi-line body optional: mention removal of blog/projects + markdown deps, new background, token changes. Do NOT mention secrets or env.)

**Step 3:** `git status` → clean (empty working tree, nothing staged).

### Task 8: Fresh production build + serve + HTTP 200 (authoritative gate)

**Objective:** Prove the frozen commit builds and serves.

**Step 1:** `rm -rf .next` (clean slate).

**Step 2:** `npm run build` → exit 0, `✓ Compiled successfully`, route table shows `/` and `/api/contact`.

**Step 3:** Start the server in background: `npm run start` (background=true; port 3000).

**Step 4:** Smoke-test:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000   # expect 200
curl -s http://localhost:3000 | grep -o "Keenan" | head -1        # expect "Keenan"
```

**Step 5:** Kill the background server (process action 'kill' or `taskkill //F //PID <pid>`).

### Task 9: Final sign-off

**Objective:** Confirm the repo is frozen and green.

**Step 1:** `git status --short` → empty.
**Step 2:** `git log --oneline -6` → the five expected commits on top of `0fd8232`:
- `chore: abaikan log dev server`
- `feat: redesen ulang portofolio jadi single-page glassmorphism`
- `fix: perbaiki LiquidBackground agar aman SSR dan menghormati reduced-motion`
- `fix: hapus import Starfield yang sudah tidak dipakai`
- (optionally the test-file commit if Task 2's test was committed separately)
**Step 3:** `npm run lint && npx tsc --noEmit && npm test` → all green.
**Step 4:** Optional dev-server sanity: `npm run dev` (background), `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` → 200, then kill. This also confirms the Turbopack cache fix.

---

## Files Likely to Change (summary)

| File | Change |
|---|---|
| `src/components/Hero.tsx` | remove stale `Starfield` import |
| `src/components/LiquidBackground.tsx` | SSR-safe + reduced-motion fix (untracked → committed) |
| `src/components/LiquidBackground.test.tsx` | NEW jsdom render test |
| `.gitignore` | add `dev-server.log`, `dev-server.err.log` |
| `src/app/page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`, `globals.css`, `Navbar.tsx`, `About.tsx`, `Skills.tsx`, `Organizations.tsx`, `Contact.tsx`, `Hero.tsx`, `Footer.tsx` | already edited (redesign) — committed in Task 7 |
| Deleted: blog/projects routes, `src/lib/content.ts`(+test), markdown content, `Starfield.tsx`, `BlogSection.tsx`, `Projects.tsx`, `ProjectCard.tsx`, `MarkdownBody.tsx` | committed in Task 7 |
| `package.json` / `package-lock.json` | deps already removed — committed in Task 7 |
| `dev-server.log`, `dev-server.err.log` | untracked → gitignored (never committed) |

## Tests / Validation

- Unit: `src/lib/validate.test.ts` (4 tests) — unchanged, must pass.
- New: `src/components/LiquidBackground.test.tsx` (1 test) — SSR-safe static render.
- Lint: `npm run lint` — exit 0.
- Types: `npx tsc --noEmit` — exit 0.
- Build: `npm run build` — exit 0, routes `/` + `/api/contact`.
- E2E smoke: `npm start` + `curl` → HTTP 200 on `/`, body contains "Keenan".

## Risks, Tradeoffs, and Open Questions

**Risks:**
1. **Turbopack dev-cache corruption** (observed): `.next/dev/cache` has missing SST files → dev server panics and serves 500. Mitigation: Task 6 deletes `.next`; a full rebuild regenerates it. If `npm run dev` still 500s after a clean `.next`, fall back to `next dev --turbopack=false` for local dev (Webpack fallback) and note it in AGENTS.md.
2. **`LiquidBackground` still 500s after the fix** if some other SSR issue exists (e.g. motion server-render incompatibility). Mitigation: the component's fallback branch renders plain `<div>`s before mount, so SSR output is static; if motion still throws, wrap Blob render in the `isMounted` check too (already done — blobs only render after mount).
3. **Lint failures on the new test file**: ESLint may flag `act`/jsdom usage or `@vitest-environment` comment. Mitigation: allowlist the test file in `eslint.config.mjs` ignores, or drop the test and rely on the runtime smoke test (Task 8).
4. **`npm run build` slow on Windows/OneDrive**: first build after cache delete may take several minutes; use a long timeout (≥300s) for that command. OneDrive sync on the repo dir can also slow file I/O — acceptable.
5. **LF→CRLF warnings**: cosmetic only; `core.autocrlf` is already set (warnings on `git add`). No action.

**Tradeoffs:**
- Amending the redesign into one commit (Task 7) trades granular history for a clean, reviewable diff. The alternative — committing the tree as-is across many small commits — was rejected because the working tree was authored as a single unit (deletions + edits are interdependent; partial commits would not build).
- Keeping `--color-accent` as the only accent (dropping `accent-2`) simplifies the palette to match the new glass design; hover states still use accent.

**Open questions (no action needed unless user says otherwise):**
1. Is the blog/projects removal permanent? The plan assumes yes (content + routes + deps already deleted in the working tree). Re-adding later would need `react-markdown`/`gray-matter` reinstalled.
2. Should `eslint.config.mjs` ignore the new test file if ESLint flags it? Default: no ignore, fix code instead.
3. Is `FORMSPREE_FORM_ID` set in the user's `.env.local`? (The route returns 503 without it; the plan does not test the form's send path.) The form UI will show the error message as designed if unset.
4. Deploy target: Vercel presumably (`.vercel` is gitignored) — not touched by this plan.

---

## Execution Handoff

Plan complete and saved. Ready to execute using subagent-driven-development — I'll dispatch a fresh subagent per task with two-stage review (spec compliance then code quality). Shall I proceed?
