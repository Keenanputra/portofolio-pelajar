import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-muted">Halaman yang kamu cari mungkin sudah dipindah atau dihapus.</p>
      <Link
        href="/"
        className="mt-8 rounded-2xl bg-foreground px-6 py-3 font-semibold text-background transition hover:bg-foreground/90"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
