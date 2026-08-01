# Desain Portofolio Pelajar — Next.js

- **Tanggal:** 2026-07-31
- **Status:** Disetujui untuk perencanaan implementasi
- **Tujuan:** Website portofolio pribadi modern untuk seorang pelajar, sekaligus sebagai media belajar web development.

## Ringkasan

Situs portofolio satu halaman (single-page dengan navigasi smooth scroll) plus halaman blog terpisah. Tema dark dengan aksen warna cerah, konten statis dari file Markdown, dan form kontak fungsional. Dibangun dengan Next.js App Router, TypeScript, dan Tailwind CSS; di-deploy gratis ke Vercel.

## Tujuan & Non-Tujuan

**Tujuan:**
- Menampilkan identitas, skill & tech stack, proyek, pengalaman organisasi/prestasi, dan blog/catatan belajar
- Tampilan modern dengan tema dark + aksen warna
- Menambahkan konten (proyek/artikel) semudah menambahkan file `.md` — tanpa menyentuh komponen
- Deploy gratis, domain `[nama].vercel.app`
- Kode sederhana dan idiomatik agar cocok untuk level dasar HTML/CSS/JS yang sedang naik kelas

**Non-tujuan (YAGNI — tidak masuk versi awal):**
- Filter proyek per tag
- Kartu proyek 3D tilt
- Theme toggle (sudah dark sejak awal)
- CMS, autentikasi, atau database
- Multi-bahasa (konten Bahasa Indonesia)

## Tech Stack

| Bagian | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js (App Router) + React + TypeScript | Standar industri, dipilih pelajar untuk belajar |
| Styling | Tailwind CSS | Utility classes, cepat, populer |
| Animasi | Framer Motion | Scroll reveal & transisi halus |
| Konten | File Markdown + `gray-matter` + `remark` (`remark-gfm`) | Statis, tanpa CMS |
| Partikel | Canvas starfield custom (~100 baris, tanpa library) | Ringan & edukatif |
| Form kontak | API route `/api/contact` + Formspree (layanan email gratis, tanpa verifikasi domain) | Tanpa backend sendiri |
| Testing | Vitest (unit test util) + ESLint + `tsc --noEmit` | Minimal sesuai skala proyek |
| Hosting | Vercel (free tier), auto-deploy dari GitHub | Gratis, mudah |

## Struktur Folder

```
public/                  # aset statis (favicon, foto profil, gambar proyek)
src/
├── app/
│   ├── layout.tsx       # root layout (nav, footer, font, starfield global)
│   ├── page.tsx         # halaman utama (single-page sections)
│   ├── globals.css      # Tailwind, token desain
│   ├── not-found.tsx    # halaman 404
│   ├── error.tsx        # error boundary client
│   ├── blog/
│   │   ├── page.tsx     # daftar blog
│   │   └── [slug]/page.tsx  # detail artikel
│   ├── projects/
│   │   └── [slug]/page.tsx  # detail proyek
│   └── api/
│       └── contact/route.ts   # handler form kontak
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── Organizations.tsx
│   ├── BlogSection.tsx (preview di homepage)
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── Starfield.tsx    # canvas partikel
│   ├── Typewriter.tsx   # efek mengetik
│   ├── ProjectCard.tsx
│   └── Reveal.tsx       # wrapper scroll reveal (Framer Motion)
├── content/
│   ├── blog/*.md
│   └── projects/*.md
└── lib/
    ├── content.ts       # baca & parse Markdown (frontmatter → data)
    └── validate.ts      # validasi form kontak (client & server)
```

## Struktur Halaman

Halaman utama (satu halaman, navigasi smooth scroll) + halaman blog terpisah:

1. **Hero** — nama, judul/bidang studi dengan typing effect, CTA, latar starfield
2. **Tentang** — paragraf singkat profil, foto opsional
3. **Skill & Tech Stack** — grid kategori skill
4. **Proyek** — grid kartu proyek; klik membuka halaman detail `/[slug]`
5. **Organisasi & Prestasi** — timeline kegiatan, jabatan, penghargaan
6. **Blog / Catatan Belajar** — preview postingan terbaru di homepage, daftar penuh di `/blog`
7. **Kontak** — form (nama, email, pesan) + link sosial (GitHub, LinkedIn, Instagram)
8. **Footer** — hak cipta, link cepat

Konten diisi via file: `content/projects/nama.md` dan `content/blog/judul.md`. Frontmatter berisi `title`, `date`, `description`, `tags`, `image` (proyek), dst. Menambahkan proyek/artikel = menambahkan file, tanpa mengubah komponen.

## Fitur Interaktif & Desain

- **Tema:** dark mode, aksen warna cerah (default cyan/violet, mudah diganti via token). Aksen dipakai konsisten pada link, highlight, dan tombol
- **Starfield:** canvas partikel di hero, bintang bergerak pelan
- **Typing effect:** kata kunci berulang di hero (mis. "Web Developer", "Desainer", "Pelajar") via hook React custom
- **Scroll reveal:** fade + slide saat elemen masuk viewport (Framer Motion `whileInView`), dibungkus komponen `Reveal`
- **Navbar:** sticky, transparan → blur saat scroll, link smooth scroll, highlight section aktif
- **Form kontak:** validasi (format email, pesan minimal), state loading, pesan sukses/error
- **Responsif:** mobile-first, menu hamburger di layar kecil
- **Aksesibilitas:** kontras cukup, `alt` pada gambar, navigasi keyboard, `prefers-reduced-motion` mematikan animasi

## Data Flow

- **Konten:** `content/blog/*.md` dan `content/projects/*.md` dibaca saat build → `gray-matter` mem-parsing frontmatter → data terstruktur (judul, tanggal, tag, deskripsi) → dirender. Blog: daftar di `/blog`, detail di `/blog/[slug]` dengan static generation
- **Form kontak:** POST ke `/api/contact` → validasi server → diteruskan ke Formspree (kirim email ke alamat pengguna) → respons status ke UI

## Error Handling

- Rute tidak ditemukan → `not-found()` + halaman 404 custom
- Error saat render → `error.tsx` dengan tombol "coba lagi"
- Form kontak: validasi client + server, pesan error spesifik per field, state loading pada tombol

## Testing

- Vitest: unit test util (`lib/content.ts` parsing frontmatter, `lib/validate.ts` validasi form)
- ESLint dan `tsc --noEmit` sebagai gerbang kualitas
- Tanpa integration/E2E test berat — portofolio statis

## Deployment

- Repo GitHub terhubung ke Vercel → auto-deploy setiap push ke `main`
- Domain `[nama].vercel.app` (bisa ditambahkan domain custom nanti)
