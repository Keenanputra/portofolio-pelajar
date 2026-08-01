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
