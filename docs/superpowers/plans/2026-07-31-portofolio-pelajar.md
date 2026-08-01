# Portofolio Pelajar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun website portofolio pribadi modern (dark theme + aksen cyan/violet) untuk pelajar bernama Keenan, dengan section hero/about/skills/projects/organizations/blog/contact, konten dari file Markdown, dan form kontak yang berfungsi — di-deploy gratis ke Vercel.

**Architecture:** SPA semu (single-page sections dengan smooth scroll) + halaman detail blog dan proyek. Konten dibaca saat build dari `src/content/*.md` oleh `src/lib/content.ts`. Form kontak dikirim via API route ke Formspree. Interaksi visual (starfield, typing effect, scroll reveal) dibuat dengan canvas murni dan Framer Motion (`motion`), komponen client terisolasi.

**Tech Stack:** Next.js 15 (App Router) + React + TypeScript, Tailwind CSS v4, `motion` (Framer Motion), `react-markdown` + `remark-gfm`, `gray-matter`, Vitest, ESLint, `@tailwindcss/typography`.

## Global Constraints

- **Node.js >= 20**, npm sebagai package manager.
- **TypeScript strict** (tsconfig default dari `create-next-app` — jangan longgarkan).
- **Bahasa konten: Bahasa Indonesia.** Semua teks antarmuka dan konten Markdown dalam Bahasa Indonesia (`<html lang="id">`).
- **Tema:** dark, warna token di `globals.css` (`--color-background: #0a0a0f`, `--color-surface: #12121a`, `--color-foreground: #e5e7eb`, `--color-muted: #9ca3af`, `--color-accent: #22d3ee`, `--color-accent-2: #a78bfa`). Jangan hardcode warna hex selain token ini.
- **Import alias:** `@/*` → `src/*` (default scaffold).
- **Semua section punya `id` yang dipakai navbar:** `hero`, `tentang`, `skill`, `proyek`, `organisasi`, `blog`, `kontak`.
- **Aksesibilitas:** setiap gambar butuh `alt`, navigasi keyboard, dan `prefers-reduced-motion` mematikan animasi (Starfield/Typewriter/Reveal).
- **Commit message:** conventional commits (`chore:`, `feat:`, `test:`, `fix:`, `docs:`).
- **Jangan commit** file `.env*` (sudah di .gitignore; pakai `.env.example`).
- **Perintah:** dev `npm run dev`, build `npm run build`, lint `npm run lint`, test `npm test` (vitest), typecheck `npx tsc --noEmit`.

---

### Task 1: Scaffold Next.js + Tooling

**Files:**
- Delete: `public/index.html`
- Create: scaffold hasil `create-next-app` (konfigurasi, `src/`, `package.json`)
- Modify: `package.json` (tambah script test)
- Create: `vitest.config.ts`, `src/lib/validate.test.ts` (sanity test)

**Interfaces:**
- Produces: project Next.js yang bisa `npm run dev`, `npm run build`, `npm test` — fondasi semua task berikut.

- [ ] **Step 1: Hapus file placeholder lama**

```bash
Remove-Item -LiteralPath "public\index.html"
```

- [ ] **Step 2: Scaffold Next.js dengan create-next-app**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

Catatan: perintah berjalan di root repo. Jika diminta konfirmasi untuk menimpa file, jawab "y" untuk semua.

- [ ] **Step 3: Install dependencies runtime**

```bash
npm install motion react-markdown remark-gfm gray-matter @tailwindcss/typography
```

- [ ] **Step 4: Install dev dependencies (testing)**

```bash
npm install -D vitest vite-tsconfig-paths
```

- [ ] **Step 5: Tambah script test ke package.json**

Pada `package.json`, dalam objek `"scripts"`, tambahkan:

```json
"test": "vitest run"
```

- [ ] **Step 6: Buat vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 7: Tulis sanity test**

`src/lib/validate.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("sanity", () => {
  it("environment vitest berjalan", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 8: Verifikasi tooling**

Run: `npm test`
Expected: PASS (1 test)

Run: `npx tsc --noEmit`
Expected: exit 0 tanpa error (scaffold default bersih)

Run: `npm run lint`
Expected: exit 0

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold nextjs project dan tooling"
```

---

### Task 2: Validasi Form Kontak (`lib/validate.ts`)

**Files:**
- Create: `src/lib/validate.ts`
- Test: `src/lib/validate.test.ts` (ganti isi sanity test)

**Interfaces:**
- Produces: `validateContact(input: Partial<ContactInput>)` mengembalikan `{ ok: true; data: ContactInput } | { ok: false; errors: ContactErrors }`, dengan `ContactInput = { name: string; email: string; message: string }` dan `ContactErrors = Partial<Record<keyof ContactInput, string>>`. Dipakai Task 11 (route & form).

- [ ] **Step 1: Tulis failing test**

`src/lib/validate.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateContact } from "./validate";

describe("validateContact", () => {
  it("menerima input yang valid", () => {
    const result = validateContact({ name: "Keenan", email: "keenan13oc@gmail.com", message: "Halo, saya tertarik dengan portofolio ini." });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        name: "Keenan",
        email: "keenan13oc@gmail.com",
        message: "Halo, saya tertarik dengan portofolio ini.",
      });
    }
  });

  it("menolak nama kosong", () => {
    const result = validateContact({ name: "", email: "a@b.co", message: "Halo halo halo" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeDefined();
  });

  it("menolak email tidak valid", () => {
    const result = validateContact({ name: "Keenan", email: "bukan-email", message: "Halo halo halo" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBeDefined();
  });

  it("menolak pesan terlalu pendek", () => {
    const result = validateContact({ name: "Keenan", email: "a@b.co", message: "singkat" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test untuk verifikasi gagal**

Run: `npm test`
Expected: FAIL — `Cannot find module './validate'`

- [ ] **Step 3: Implementasi minimal**

`src/lib/validate.ts`:

```ts
export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactResult =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors };

export function validateContact(input: Partial<ContactInput>): ContactResult {
  const errors: ContactErrors = {};
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const message = (input.message ?? "").trim();

  if (name.length < 2) errors.name = "Nama minimal 2 karakter.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Format email tidak valid.";
  if (message.length < 10) errors.message = "Pesan minimal 10 karakter.";

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data: { name, email, message } };
}
```

- [ ] **Step 4: Run test untuk verifikasi lolos**

Run: `npm test`
Expected: PASS (4 test)

- [ ] **Step 5: Commit**

```bash
git add src/lib/validate.ts src/lib/validate.test.ts
git commit -m "test: validasi form kontak"
```

---

### Task 3: Loader Konten Markdown (`lib/content.ts`) + Seed Content

**Files:**
- Create: `src/lib/content.ts`
- Test: `src/lib/content.test.ts`
- Create: `src/content/blog/hello-nextjs.md`, `src/content/blog/react-basics.md`
- Create: `src/content/projects/website-portofolio.md`, `src/content/projects/neofetch-clone.md`

**Interfaces:**
- Produces:
  - `PostSummary = { slug: string; title: string; date: string; description: string; tags: string[] }`
  - `Post = PostSummary & { content: string }`
  - `ProjectSummary = { slug: string; title: string; date: string; description: string; tags: string[]; image?: string; url?: string }`
  - `Project = ProjectSummary & { content: string }`
  - `getAllPosts(): PostSummary[]` (urut tanggal terbaru)
  - `getPost(slug: string): Post | null`
  - `getRecentPosts(count: number): PostSummary[]`
  - `getAllProjects(): ProjectSummary[]` (urut tanggal terbaru)
  - `getProject(slug: string): Project | null`

  Dipakai Task 9 (projects), Task 10 (blog), dan homepage.

- [ ] **Step 1: Buat seed content**

`src/content/blog/hello-nextjs.md`:

```markdown
---
title: "Mulai Belajar Next.js"
date: "2026-07-20"
description: "Catatan pertama saya tentang Next.js, App Router, dan Server Components."
tags: ["Next.js", "React", "Belajar"]
---

## Kenapa Next.js?

Next.js adalah framework React untuk aplikasi web modern. Dengan **App Router**, kita bisa
membedakan komponen Server dan Client dengan mudah.

## Yang saya pelajari

- Routing berbasis folder
- Server Components untuk data fetching saat build
- `generateStaticParams` untuk halaman statis
```

`src/content/blog/react-basics.md`:

```markdown
---
title: "Dasar React untuk Pemula"
date: "2026-07-01"
description: "Memahami state, props, dan komponen di React."
tags: ["React", "JavaScript", "Belajar"]
---

## Komponen

Komponen adalah fungsi yang mengembalikan UI. Props adalah cara kita meneruskan data
antar komponen.

## State

`useState` menyimpan data yang berubah dan membuat UI bereaksi.
```

`src/content/projects/website-portofolio.md`:

```markdown
---
title: "Website Portofolio"
date: "2026-07-31"
description: "Website portofolio pribadi dengan Next.js, Tailwind, dan konten Markdown."
tags: ["Next.js", "TypeScript", "Tailwind CSS"]
url: "https://keenan.vercel.app"
---

## Gambaran

Website ini dibangun untuk menampilkan proyek, skill, dan catatan belajar.

## Fitur

- Dark theme dengan aksen cyan/violet
- Blog & proyek dikelola via file Markdown
- Form kontak terhubung ke Formspree
```

`src/content/projects/neofetch-clone.md`:

```markdown
---
title: "Neofetch Clone"
date: "2026-06-15"
description: "Tools CLI sederhana yang menampilkan informasi sistem, ditulis dalam Python."
tags: ["Python", "CLI"]
---

## Gambaran

CLI kecil yang menampilkan OS, kernel, dan resource sistem saat terminal dibuka.
```

- [ ] **Step 2: Tulis failing test**

`src/lib/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  getAllPosts,
  getPost,
  getRecentPosts,
  getAllProjects,
  getProject,
} from "./content";

describe("content", () => {
  it("getAllPosts mengembalikan post terurut tanggal terbaru", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it("getPost mengembalikan konten dan null untuk slug yang tidak ada", () => {
    const first = getAllPosts()[0];
    const post = getPost(first.slug);
    expect(post?.title).toBe(first.title);
    expect(post?.content.length).toBeGreaterThan(0);
    expect(getPost("tidak-ada")).toBeNull();
  });

  it("getRecentPosts mengembalikan jumlah sesuai", () => {
    expect(getRecentPosts(1).length).toBe(1);
    expect(getRecentPosts(99).length).toBe(getAllPosts().length);
  });

  it("getAllProjects dan getProject bekerja", () => {
    const projects = getAllProjects();
    expect(projects.length).toBeGreaterThan(0);
    const p = getProject(projects[0].slug);
    expect(p?.title).toBe(projects[0].title);
    expect(getProject("tidak-ada")).toBeNull();
  });
});
```

- [ ] **Step 3: Run test untuk verifikasi gagal**

Run: `npm test`
Expected: FAIL — `Cannot find module './content'`

- [ ] **Step 4: Implementasi**

`src/lib/content.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");
const PROJECT_DIR = path.join(process.cwd(), "src", "content", "projects");

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
};

export type Post = PostSummary & { content: string };

export type ProjectSummary = PostSummary & { image?: string; url?: string };

export type Project = ProjectSummary & { content: string };

function listFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

function parsePostFile(file: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    tags: (data.tags as string[]) ?? [],
    content,
  };
}

function parseProjectFile(file: string): Project {
  const raw = fs.readFileSync(path.join(PROJECT_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    tags: (data.tags as string[]) ?? [],
    image: data.image as string | undefined,
    url: data.url as string | undefined,
    content,
  };
}

export function getAllPosts(): PostSummary[] {
  return listFiles(BLOG_DIR)
    .map((f) => {
      const post = parsePostFile(f);
      const { content: _content, ...summary } = post;
      return summary;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOG_DIR, file))) return null;
  return parsePostFile(file);
}

export function getRecentPosts(count: number): PostSummary[] {
  return getAllPosts().slice(0, count);
}

export function getAllProjects(): ProjectSummary[] {
  return listFiles(PROJECT_DIR)
    .map((f) => {
      const project = parseProjectFile(f);
      const { content: _content, ...summary } = project;
      return summary;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getProject(slug: string): Project | null {
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(PROJECT_DIR, file))) return null;
  return parseProjectFile(file);
}
```

- [ ] **Step 5: Run test untuk verifikasi lolos**

Run: `npm test`
Expected: PASS (4 test content + 4 test validate)

- [ ] **Step 6: Commit**

```bash
git add src/lib/content.ts src/lib/content.test.ts src/content
git commit -m "feat: loader konten markdown"
```

---

### Task 4: Root Layout, Design Tokens, Markdown Renderer

**Files:**
- Modify: `src/app/globals.css` (timpa), `src/app/layout.tsx` (timpa), `src/app/page.tsx` (timpa sementara jadi placeholder)
- Create: `src/components/MarkdownBody.tsx`

**Interfaces:**
- Produces: layout `<html lang="id">` (Navbar/Footer ditambahkan di Task 6), token warna Tailwind, dan `MarkdownBody` dipakai Task 9/10 detail pages.

- [ ] **Step 1: Tulis globals.css**

`src/app/globals.css` (ganti seluruh isi):

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-background: #0a0a0f;
  --color-surface: #12121a;
  --color-foreground: #e5e7eb;
  --color-muted: #9ca3af;
  --color-accent: #22d3ee;
  --color-accent-2: #a78bfa;
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

html {
  scroll-behavior: smooth;
}

::selection {
  background: #22d3ee;
  color: #0a0a0f;
}
```

- [ ] **Step 2: Tulis layout.tsx**

`src/app/layout.tsx` (ganti seluruh isi):

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Keenan — Portofolio",
  description: "Portofolio pribadi: proyek, skill, dan catatan belajar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Timpa page.tsx jadi placeholder**

`src/app/page.tsx`:

```tsx
export default function Home() {
  return <p className="px-4 py-32 text-center text-muted">Scaffolding...</p>;
}
```

- [ ] **Step 4: Buat MarkdownBody.tsx**

`src/components/MarkdownBody.tsx`:

```tsx
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted prose-a:text-accent prose-li:text-muted prose-strong:text-foreground">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}
```

- [ ] **Step 5: Verifikasi build & typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0, tanpa error (page placeholder sederhana, tanpa Navbar/Footer)

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/app/page.tsx src/components/MarkdownBody.tsx
git commit -m "feat: layout root dan design token"
```

---

### Task 5: Komponen Interaktif (Starfield, Typewriter, Reveal)

**Files:**
- Create: `src/components/Starfield.tsx`, `src/components/Typewriter.tsx`, `src/components/Reveal.tsx`

**Interfaces:**
- Produces:
  - `Starfield` — `<Starfield />`, canvas fixed-absolute di dalam parent ber-`relative`.
  - `Typewriter({ words, typeSpeed?, deleteSpeed?, pause? })` — `words: string[]`, semua opsional default `typeSpeed=90`, `deleteSpeed=50`, `pause=1800`.
  - `Reveal({ children, delay? })` — wrapper client, `delay?: number` default 0.

- [ ] **Step 1: Buat Starfield**

`src/components/Starfield.tsx`:

```tsx
"use client";
import { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let stars: { x: number; y: number; r: number; vx: number; vy: number }[] = [];
    let raf = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((canvas.clientWidth * canvas.clientHeight) / 6000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        r: Math.random() * 1.2 + 0.2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = canvas.clientWidth;
        if (s.x > canvas.clientWidth) s.x = 0;
        if (s.y < 0) s.y = canvas.clientHeight;
        if (s.y > canvas.clientHeight) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(226, 232, 240, 0.8)";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
```

- [ ] **Step 2: Buat Typewriter**

`src/components/Typewriter.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";

export default function Typewriter({
  words,
  typeSpeed = 90,
  deleteSpeed = 50,
  pause = 1800,
}: {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(words[0]);
      return;
    }
    const word = words[index % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }, deleting ? deleteSpeed : typeSpeed);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause]);

  return (
    <span>
      {text}
      <span className="animate-pulse text-accent">|</span>
    </span>
  );
}
```

- [ ] **Step 3: Buat Reveal**

`src/components/Reveal.tsx`:

```tsx
"use client";
import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

export default function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Verifikasi**

Run: `npx tsc --noEmit`
Expected: exit 0 (layout di Task 4 sudah tanpa Navbar/Footer)

- [ ] **Step 5: Commit**

```bash
git add src/components/Starfield.tsx src/components/Typewriter.tsx src/components/Reveal.tsx
git commit -m "feat: komponen interaktif starfield, typewriter, reveal"
```

---

### Task 6: Navbar + Footer

**Files:**
- Create: `src/components/Navbar.tsx`, `src/components/Footer.tsx`
- Modify: `src/app/layout.tsx` (tambahkan impor & render Navbar/Footer)

**Interfaces:**
- Consumes: `id` section (`tentang`, `skill`, `proyek`, `organisasi`, `blog`, `kontak`).
- Produces: `<Navbar />`, `<Footer />` — dirender di `src/app/layout.tsx` (Task 4). Setelah task ini, `npx tsc --noEmit` dan build harus bersih.

- [ ] **Step 1: Buat Navbar**

`src/components/Navbar.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";

const links = [
  { href: "#tentang", label: "Tentang" },
  { href: "#skill", label: "Skill" },
  { href: "#proyek", label: "Proyek" },
  { href: "#organisasi", label: "Organisasi" },
  { href: "#blog", label: "Blog" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const link of links) {
      const el = document.getElementById(link.href.slice(1));
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-white/10 bg-background/80 backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <a href="#hero" className="font-mono text-sm font-semibold text-accent">
          Keenan.dev
        </a>
        <button
          type="button"
          className="text-foreground sm:hidden"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>
        <ul className={`gap-6 text-sm sm:flex ${open ? "absolute inset-x-0 top-full flex flex-col gap-4 border-b border-white/10 bg-background px-6 py-4" : "hidden"}`}>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className={`transition hover:text-accent ${active === link.href ? "text-accent" : "text-muted"}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Buat Footer**

`src/components/Footer.tsx`:

```tsx
const socials = [
  { label: "GitHub", href: "https://github.com/keenan13oc" },
  { label: "LinkedIn", href: "https://linkedin.com/in/keenan13oc" },
  { label: "Instagram", href: "https://instagram.com/keenan13oc" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="font-mono text-xs text-muted">© {new Date().getFullYear()} Keenan</p>
        <ul className="flex gap-6 text-sm">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="text-muted transition hover:text-accent">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Pasang Navbar & Footer di layout**

Ubah `src/app/layout.tsx`: tambahkan impor `Navbar` dan `Footer` (impor dari `@/components/Navbar` dan `@/components/Footer`), lalu render di dalam `<body>` — `Navbar` di atas `<main>{children}</main>` dan `Footer` di bawahnya.

- [ ] **Step 4: Verifikasi typecheck & build**

Run: `npx tsc --noEmit`
Expected: exit 0, tanpa error

Run: `npm run build`
Expected: build sukses (halaman placeholder)

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "feat: navbar dan footer"
```

---

### Task 7: Section Hero + Tentang

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/About.tsx`

**Interfaces:**
- Consumes: `Starfield`, `Typewriter` (Task 5), `Reveal` (Task 5).
- Produces: `<Hero />`, `<About />` — diimpor `src/app/page.tsx` (Task 12, tapi bisa langsung diimpor di task ini).

- [ ] **Step 1: Buat Hero**

`src/components/Hero.tsx`:

```tsx
"use client";
import Starfield from "./Starfield";
import Typewriter from "./Typewriter";

export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Starfield />
      <div className="relative z-10 px-4 text-center">
        <p className="font-mono text-sm text-accent">Halo, saya</p>
        <h1 className="mt-2 text-5xl font-bold text-foreground sm:text-7xl">Keenan</h1>
        <p className="mt-4 text-xl text-muted sm:text-2xl">
          <Typewriter words={["Web Developer", "Desainer", "Pelajar"]} />
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#proyek"
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent/80"
          >
            Lihat Proyek
          </a>
          <a
            href="#kontak"
            className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-foreground transition hover:border-accent hover:text-accent"
          >
            Hubungi Saya
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Buat About**

`src/components/About.tsx`:

```tsx
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="tentang" className="mx-auto max-w-3xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-accent">01.</span> Tentang Saya
        </h2>
        <p className="mt-6 leading-relaxed text-muted">
          Saya Keenan, seorang pelajar yang tertarik pada web development. Saya senang
          membangun hal-hal yang berguna, belajar teknologi baru, dan menulis catatan
          belajar untuk berbagi apa yang saya pelajari.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Di luar coding, saya aktif di organisasi sekolah dan suka mendokumentasikan
          perjalanan belajar saya di blog.
        </p>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 3: Impor Hero & About ke halaman utama**

`src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";
import About from "@/components/About";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
    </>
  );
}
```

- [ ] **Step 4: Verifikasi**

Run: `npx tsc --noEmit` — exit 0
Run: `npm run dev` lalu buka `http://localhost:3000` — hero dengan starfield & typing effect terlihat, scroll ke bawah muncul section tentang.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/About.tsx src/app/page.tsx
git commit -m "feat: section hero dan tentang"
```

---

### Task 8: Section Skill + Organisasi

**Files:**
- Create: `src/components/Skills.tsx`, `src/components/Organizations.tsx`

**Interfaces:**
- Consumes: `Reveal` (Task 5).
- Produces: `<Skills />`, `<Organizations />`.

- [ ] **Step 1: Buat Skills**

`src/components/Skills.tsx`:

```tsx
import Reveal from "./Reveal";

const skillGroups = [
  {
    title: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
  },
  {
    title: "Backend & Lainnya",
    items: ["Python", "Node.js", "Git", "Linux"],
  },
  {
    title: "Tools",
    items: ["VS Code", "Figma", "Vercel"],
  },
];

export default function Skills() {
  return (
    <section id="skill" className="mx-auto max-w-5xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-accent">02.</span> Skill & Tech Stack
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.1}>
            <div className="h-full rounded-xl border border-white/10 bg-surface p-6">
              <h3 className="font-semibold text-foreground">{group.title}</h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Buat Organizations**

`src/components/Organizations.tsx`:

```tsx
import Reveal from "./Reveal";

const timeline = [
  {
    period: "2025 — Sekarang",
    role: "Anggota Divisi Media & Informasi",
    org: "OSIS SMA",
    description: "Mengelola konten media sosial sekolah dan dokumentasi kegiatan.",
  },
  {
    period: "2024",
    role: "Peserta",
    org: "Lomba Kompetensi Siswa — Desain Web",
    description: "Mewakili sekolah pada bidang pengembangan web tingkat kota.",
  },
  {
    period: "2023",
    role: "Ketua Tim",
    org: "Ekstrakurikuler Robotik",
    description: "Memimpin tim dalam persiapan kompetisi robotik lokal.",
  },
];

export default function Organizations() {
  return (
    <section id="organisasi" className="mx-auto max-w-3xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-accent">03.</span> Organisasi & Prestasi
        </h2>
      </Reveal>
      <ol className="mt-10 space-y-8 border-l border-white/10 pl-6">
        {timeline.map((item, i) => (
          <Reveal key={item.period} delay={i * 0.05}>
            <li className="relative">
              <span className="absolute -left-[30px] top-1 h-3 w-3 rounded-full bg-accent" />
              <p className="font-mono text-xs text-accent">{item.period}</p>
              <h3 className="mt-1 font-semibold text-foreground">{item.role}</h3>
              <p className="text-sm text-muted">{item.org}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 3: Impor ke halaman utama**

`src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Organizations from "@/components/Organizations";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Organizations />
    </>
  );
}
```

- [ ] **Step 4: Verifikasi**

Run: `npx tsc --noEmit` — exit 0
Run: `npm run build` — sukses

- [ ] **Step 5: Commit**

```bash
git add src/components/Skills.tsx src/components/Organizations.tsx src/app/page.tsx
git commit -m "feat: section skill dan organisasi"
```

---

### Task 9: Daftar & Detail Proyek

**Files:**
- Create: `src/components/ProjectCard.tsx`, `src/components/Projects.tsx`, `src/app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getAllProjects`, `getProject`, `ProjectSummary` (Task 3), `Reveal` (Task 5), `MarkdownBody` (Task 4).
- Produces: `<ProjectCard project={ProjectSummary} />`, `<Projects />`, rute `/projects/[slug]` (static params).

- [ ] **Step 1: Buat ProjectCard**

`src/components/ProjectCard.tsx`:

```tsx
import Link from "next/link";
import type { ProjectSummary } from "@/lib/content";

export default function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block h-full rounded-xl border border-white/10 bg-surface p-6 transition hover:border-accent/60"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-foreground transition group-hover:text-accent">
          {project.title}
        </h3>
        <span className="shrink-0 font-mono text-xs text-muted">{project.date}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-accent">
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}
```

- [ ] **Step 2: Buat Projects**

`src/components/Projects.tsx`:

```tsx
import { getAllProjects } from "@/lib/content";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

export default function Projects() {
  const projects = getAllProjects();

  return (
    <section id="proyek" className="mx-auto max-w-5xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-accent">04.</span> Proyek
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.05}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Buat halaman detail proyek**

`src/app/projects/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/content";
import MarkdownBody from "@/components/MarkdownBody";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project?.title ?? "Proyek", description: project?.description };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-32">
      <p className="font-mono text-xs text-accent">{project.date}</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{project.title}</h1>
      <p className="mt-4 text-lg text-muted">{project.description}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-accent">
            {tag}
          </li>
        ))}
      </ul>
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent/80"
        >
          Kunjungi Proyek
        </a>
      )}
      <div className="mt-12 border-t border-white/10 pt-10">
        <MarkdownBody content={project.content} />
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Impor Projects ke halaman utama**

`src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Organizations from "@/components/Organizations";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Organizations />
    </>
  );
}
```

- [ ] **Step 5: Verifikasi**

Run: `npx tsc --noEmit` — exit 0
Run: `npm run build` — sukses, halaman `/projects/website-portofolio` dan `/projects/neofetch-clone` ter-generate

- [ ] **Step 6: Commit**

```bash
git add src/components/ProjectCard.tsx src/components/Projects.tsx src/app/projects src/app/page.tsx
git commit -m "feat: daftar dan detail proyek"
```

---

### Task 10: Blog — Section, Daftar, Detail

**Files:**
- Create: `src/components/BlogSection.tsx`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getRecentPosts`, `getAllPosts`, `getPost`, `PostSummary` (Task 3), `Reveal` (Task 5), `MarkdownBody` (Task 4).
- Produces: `<BlogSection />`, rute `/blog` dan `/blog/[slug]`.

- [ ] **Step 1: Buat BlogSection (preview di homepage)**

`src/components/BlogSection.tsx`:

```tsx
import Link from "next/link";
import { getRecentPosts } from "@/lib/content";
import Reveal from "./Reveal";

export default function BlogSection() {
  const posts = getRecentPosts(3);

  return (
    <section id="blog" className="mx-auto max-w-3xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-accent">05.</span> Catatan Belajar
        </h2>
      </Reveal>
      <ul className="mt-10 space-y-8">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.05}>
            <li>
              <Link href={`/blog/${post.slug}`} className="group block">
                <h3 className="font-semibold text-foreground transition group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-muted">{post.date}</p>
                <p className="mt-2 text-sm text-muted">{post.description}</p>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
      <Reveal delay={0.15}>
        <Link href="/blog" className="mt-8 inline-block font-mono text-sm text-accent transition hover:text-accent-2">
          Semua catatan →
        </Link>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Buat daftar blog**

`src/app/blog/page.tsx`:

```tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-4 py-32">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Catatan Belajar</h1>
      <p className="mt-2 text-muted">Dokumentasi proses belajar saya.</p>
      <ul className="mt-12 space-y-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <h2 className="text-xl font-semibold text-foreground transition group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-1 font-mono text-xs text-muted">{post.date}</p>
              <p className="mt-2 text-muted">{post.description}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-accent">
                    {tag}
                  </li>
                ))}
              </ul>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 3: Buat halaman detail artikel**

`src/app/blog/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/content";
import MarkdownBody from "@/components/MarkdownBody";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post?.title ?? "Artikel", description: post?.description };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-32">
      <p className="font-mono text-xs text-accent">{post.date}</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{post.title}</h1>
      <p className="mt-4 text-lg text-muted">{post.description}</p>
      <div className="mt-12 border-t border-white/10 pt-10">
        <MarkdownBody content={post.content} />
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Impor BlogSection ke halaman utama**

`src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Organizations from "@/components/Organizations";
import BlogSection from "@/components/BlogSection";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Organizations />
      <BlogSection />
    </>
  );
}
```

- [ ] **Step 5: Verifikasi**

Run: `npx tsc --noEmit` — exit 0
Run: `npm run build` — sukses, `/blog`, `/blog/hello-nextjs`, `/blog/react-basics` ter-generate

- [ ] **Step 6: Commit**

```bash
git add src/components/BlogSection.tsx src/app/blog src/app/page.tsx
git commit -m "feat: blog dan detail artikel"
```

---

### Task 11: Form Kontak + API Route

**Files:**
- Create: `src/components/Contact.tsx`, `src/app/api/contact/route.ts`, `.env.example`
- Modify: `src/app/page.tsx` (impor Contact)

**Interfaces:**
- Consumes: `validateContact`, `ContactErrors` (Task 2).
- Produces: `<Contact />`, `POST /api/contact`. Route membaca `process.env.FORMSPREE_FORM_ID`; form tetap menampilkan pesan error "konfigurasi belum di-set" bila env kosong.

- [ ] **Step 1: Buat API route**

`src/app/api/contact/route.ts`:

```ts
import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validate";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validateContact(body ?? {});

  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  if (!process.env.FORMSPREE_FORM_ID) {
    return NextResponse.json(
      { ok: false, errors: { message: "Form kontak belum dikonfigurasi. Tambahkan FORMSPREE_FORM_ID." } },
      { status: 503 }
    );
  }

  const form = new URLSearchParams({
    name: result.data.name,
    email: result.data.email,
    message: result.data.message,
  });

  const res = await fetch(`https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, errors: { message: "Gagal mengirim pesan. Silakan coba lagi." } },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Buat Contact component**

`src/components/Contact.tsx`:

```tsx
"use client";
import { useState, type FormEvent } from "react";
import type { ContactErrors } from "@/lib/validate";
import Reveal from "./Reveal";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      errors?: ContactErrors & { message?: string };
    };

    if (!res.ok) {
      setErrors(data.errors ?? { message: "Gagal mengirim pesan. Coba lagi." });
      setStatus("error");
      return;
    }

    setStatus("sent");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <section id="kontak" className="mx-auto max-w-xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-accent">06.</span> Hubungi Saya
        </h2>
        <p className="mt-3 text-muted">
          Punya pertanyaan, ide kolaborasi, atau sekadar menyapa? Kirim pesan lewat form ini.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
          <div>
            <label htmlFor="nama" className="mb-1 block text-sm text-foreground">
              Nama
            </label>
            <input
              id="nama"
              name="nama"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-foreground outline-none transition focus:border-accent"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-foreground outline-none transition focus:border-accent"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="pesan" className="mb-1 block text-sm text-foreground">
              Pesan
            </label>
            <textarea
              id="pesan"
              name="pesan"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-y rounded-lg border border-white/10 bg-surface px-4 py-3 text-foreground outline-none transition focus:border-accent"
            />
            {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
          </div>

          {status === "sent" && (
            <p className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
              Pesan berhasil dikirim. Terima kasih!
            </p>
          )}
          {status === "error" && errors.message && (
            <p className="rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-400">
              {errors.message}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-lg bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "sending" ? "Mengirim..." : "Kirim Pesan"}
          </button>
        </form>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 3: Buat .env.example**

`.env.example`:

```
FORMSPREE_FORM_ID=xxxxxxxxxxxx
```

- [ ] **Step 4: Impor Contact ke halaman utama**

`src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Organizations from "@/components/Organizations";
import BlogSection from "@/components/BlogSection";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Organizations />
      <BlogSection />
      <Contact />
    </>
  );
}
```

- [ ] **Step 5: Verifikasi**

Run: `npx tsc --noEmit` — exit 0
Run: `npm run build` — sukses
Uji manual: `npm run dev`, isi form dengan nama kosong → pesan error "Nama minimal 2 karakter."; isi valid → tanpa FORMSPREE_FORM_ID muncul pesan "belum dikonfigurasi".

- [ ] **Step 6: Commit**

```bash
git add src/components/Contact.tsx src/app/api/contact/route.ts .env.example src/app/page.tsx
git commit -m "feat: form kontak dan api route"
```

---

### Task 12: Halaman 404, Error, dan Penyempurnaan

**Files:**
- Create: `src/app/not-found.tsx`, `src/app/error.tsx`
- Modify: `src/app/globals.css` (tidak perlu — verifikasi scroll-margin untuk sticky navbar)

**Interfaces:**
- Consumes: token desain.
- Produces: fallback UI global untuk rute hilang dan error runtime.

- [ ] **Step 1: Buat not-found**

`src/app/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-muted">Halaman yang kamu cari mungkin sudah dipindah atau dihapus.</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent/80"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Buat error boundary**

`src/app/error.tsx`:

```tsx
"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-accent">Error</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground">Terjadi kesalahan</h1>
      <p className="mt-3 text-muted">Sesuatu tidak berjalan sesuai rencana.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent/80"
      >
        Coba Lagi
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Tambah scroll-margin agar sticky navbar tidak menutupi judul section**

Tambahkan ke `src/app/globals.css` di bawah aturan `html`:

```css
section[id] {
  scroll-margin-top: 4rem;
}
```

- [ ] **Step 4: Verifikasi**

Run: `npx tsc --noEmit` — exit 0
Run: `npm run build` — sukses
Run: `npm run dev`, buka `/halaman-tidak-ada` → halaman 404 custom terlihat.

- [ ] **Step 5: Commit**

```bash
git add src/app/not-found.tsx src/app/error.tsx src/app/globals.css
git commit -m "feat: halaman 404 dan error boundary"
```

---

### Task 13: QA Akhir, Dokumentasi, dan Perbaikan AGENTS.md

**Files:**
- Modify: `AGENTS.md` (tambahkan perintah dev/test/lint/typecheck)

- [ ] **Step 1: Jalankan seluruh gerbang kualitas**

Run: `npm test`
Expected: PASS (8 test)

Run: `npm run lint`
Expected: exit 0 (perbaiki warning yang muncul)

Run: `npx tsc --noEmit`
Expected: exit 0

Run: `npm run build`
Expected: sukses, semua rute statis ter-generate

- [ ] **Step 2: Audit aksesibilitas & responsif manual**

Buka `npm run dev`:
- Klik tiap link navbar → smooth scroll ke section benar, judul tidak tertutup navbar
- Persempit layar → menu hamburger bekerja
- Aktifkan `prefers-reduced-motion: reduce` (devtools > rendering) → starfield berhenti, typing effect menampilkan kata pertama, elemen tampil tanpa animasi
- Verifikasi kontras teks (muted di atas background) terbaca

- [ ] **Step 3: Update AGENTS.md**

Tambahkan bagian di `AGENTS.md` (setelah "Once real code exists"):

```markdown
## Commands

- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
- Test: `npm test` (Vitest)
```

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md
git commit -m "docs: dokumentasi perintah dev di AGENTS.md"
```

- [ ] **Step 5: Panduan penyelesaian**

Beri tahu user:
1. Buat akun di https://formspree.io → buat form → salin ID form ke `.env.local` sebagai `FORMSPREE_FORM_ID=...`
2. Push repo ke GitHub, import ke Vercel → deploy otomatis
3. Ganti nama "Keenan" dan data contoh di `src/content/` dengan data asli
