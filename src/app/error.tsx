"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-muted">Error</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground">Terjadi kesalahan</h1>
      <p className="mt-3 text-muted">Sesuatu tidak berjalan sesuai rencana.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-2xl bg-foreground px-6 py-3 font-semibold text-background transition hover:bg-foreground/90"
      >
        Coba Lagi
      </button>
    </div>
  );
}
