# Foto Profil Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real photo profile integration to the About section with placeholder fallback and optimized loading.

**Architecture:** Wire the existing profile photo frame in `About.tsx` to render the user's photo via Next.js `Image` when `public/profile.jpg` exists, with an `onError` fallback to the existing SVG avatar so the page stays intact until the user drops in their photo. Add hover glow + reduced-motion CSS to `globals.css`.

**Tech Stack:** Next.js `next/image`, CSS animations, responsive design

## Global Constraints

- Must maintain existing glass effect theme consistency (B&W palette, `bg-glass`, `border-line`)
- Photo must be responsive: 128px (mobile), 160px (tablet), 192px (desktop)
- Requires proper accessibility: descriptive alt text, decorative SVG `aria-hidden`
- Must include loading optimization (`sizes` attribute) and fallback handling (`onError` → avatar)
- All animations must respect `prefers-reduced-motion`
- Component file must remain `src/components/About.tsx`; do not restructure other sections

---

### Task 1: Profile Photo Integration in About Section

**Files:**
- Modify: `src/components/About.tsx:34-50`
- Modify: `src/app/globals.css:69-87` (after `.animate-float` block)

**Interfaces:**
- Consumes: Existing About section layout (grid 2 col, glass card, background blur patterns)
- Produces: `About.tsx` renders photo via Next.js `Image` when loadable, else the existing SVG avatar; `profile-glow` CSS classes in `globals.css`

- [ ] **Step 1: Write the failing check — verify photo frame currently renders placeholder**

Current `src/components/About.tsx:40-49` renders a static SVG avatar inside the photo frame. Note this as the current behavior; the task's goal is that the frame prefers a photo when available.

- [ ] **Step 2: Add a client-side image error state**

In `src/components/About.tsx`:

```tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";
```

Inside the `About` component, add:

```tsx
const [imageError, setImageError] = useState(false);
```

- [ ] **Step 3: Replace the placeholder div with the conditional Image**

Replace the block at `src/components/About.tsx:40-49` (the `<div className="h-full w-full rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">` containing the nested SVG) with:

```tsx
<div className="h-full w-full rounded-full overflow-hidden">
  {!imageError ? (
    <Image
      src="/profile.jpg"
      alt="Potret Keenan, pelajar dan pengembang web yang suka membangun solusi digital"
      width={192}
      height={192}
      sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
      className="h-full w-full object-cover"
      onError={() => setImageError(true)}
    />
  ) : (
    <div className="h-full w-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
      <svg
        className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-foreground/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  )}
</div>
```

Note: `onError` is a valid `Image` prop in Next.js 16; it fires when the image fails to load (e.g. `public/profile.jpg` is absent), so the avatar fallback keeps the card intact.

- [ ] **Step 4: Add responsive size classes to the photo frame**

Update the photo frame div at `src/components/About.tsx:40` (the `relative h-40 w-40 sm:h-48 sm:w-48 ... group-hover:scale-105` div) so sizes match the Global Constraints:

```tsx
<div className="relative h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full border-2 border-line bg-glass/30 p-1 backdrop-blur-sm transition-all duration-300 group-hover:border-foreground/30 group-hover:scale-105 profile-glow">
```

- [ ] **Step 5: Add profile-glow CSS with reduced-motion respect**

Append to `src/app/globals.css` after the `.animate-float` block:

```css
/* PROFILE PHOTO EFFECTS */
@media (prefers-reduced-motion: no-preference) {
  .profile-glow {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
    transition: box-shadow 0.3s ease;
  }

  .profile-glow:hover {
    box-shadow: 0 0 50px rgba(255, 255, 255, 0.18);
  }
}

@media (prefers-reduced-motion: reduce) {
  .profile-glow {
    box-shadow: none;
  }
}
```

- [ ] **Step 6: Verify the change**

Run: `npm run build`

Expected: build succeeds. With `public/profile.jpg` absent, the page loads and shows the avatar fallback (the `Image` 404s and `onError` switches to the avatar). Confirm by checking the build passes TypeScript.

- [ ] **Step 7: Commit**

```bash
git add src/components/About.tsx src/app/globals.css
git commit -m "feat: integrasi foto profil via next/image dengan fallback avatar"
```

### Task 2: Photo Guide and README Documentation

**Files:**
- Create: `docs/profile-photo-guide.md`
- Modify: `README.md` (create if it does not exist)

**Interfaces:**
- Consumes: Completed profile photo integration from Task 1 (`/profile.jpg` path, fallback avatar)
- Produces: User-facing instructions for adding/updating the profile photo

- [ ] **Step 1: Create `docs/profile-photo-guide.md`**

```markdown
# Panduan Foto Profil

## Cara Memasang Foto

1. **Siapkan foto:**
   - Format: JPG, PNG, atau WebP
   - Rasio persegi (1:1)
   - Ukuran minimal 400x400px
   - Ukuran file di bawah 500KB

2. **Optimalkan untuk web** (opsional): gunakan TinyPNG/ImageOptim, target <200KB

3. **Simpan file** sebagai `public/profile.jpg`, lalu commit.

## Detail Teknis

- Komponen: `src/components/About.tsx`
- Ukuran responsif: 128px (mobile), 160px (tablet), 192px (desktop)
- Fallback: avatar SVG tampil otomatis jika foto gagal dimuat
- Optimasi: komponen `next/image` dengan atribut `sizes`
- Aksesibilitas: alt text deskriptif sudah disertakan

## Troubleshooting

**Foto tidak tampil:**
1. Cek jalur file: `public/profile.jpg`
2. Hapus cache: hapus folder `.next` lalu jalankan `npm run dev`
3. Buka DevTools browser, cek status 404 pada `/profile.jpg`

**Kualitas foto kurang tajam:**
- Gunakan sumber minimal 400x400px
- Hindari kompresi berlebihan
```

- [ ] **Step 2: Update `README.md`**

If `README.md` does not exist, create it with the repository name and a section:

```markdown
# Portofolio Pelajar

Portofolio pribadi dibangun dengan Next.js, React, TypeScript, dan Tailwind CSS.

## Foto Profil

Untuk mengganti foto profil, simpan foto persegi Anda sebagai `public/profile.jpg` (minimal 400x400px). Panduan lengkap: `docs/profile-photo-guide.md`.

## Menjalankan Proyek

- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
- Test: `npm test`
```

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add docs/profile-photo-guide.md README.md
git commit -m "docs: tambah panduan foto profil dan README"
```
