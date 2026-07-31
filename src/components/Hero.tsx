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
          <Typewriter words={["Web Developer", "Desainer", "Mahasiswa"]} />
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
