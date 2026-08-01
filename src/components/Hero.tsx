"use client";
import Typewriter from "./Typewriter";

export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="relative z-10 px-4 text-center">
        <p className="font-mono text-sm text-muted">Halo, saya</p>
        <h1 className="mt-2 text-5xl font-bold text-foreground sm:text-7xl">Keenan</h1>
        <p className="mt-4 text-xl text-muted sm:text-2xl">
          <Typewriter words={["Web Developer", "Desainer", "Mahasiswa"]} />
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#skill"
            className="rounded-lg bg-foreground px-6 py-3 font-semibold text-background transition hover:bg-foreground/90"
          >
            Lihat Skill
          </a>
          <a
            href="#kontak"
            className="rounded-lg border border-white/10 bg-glass px-6 py-3 font-semibold text-foreground transition hover:border-accent hover:text-accent backdrop-blur"
          >
            Hubungi Saya
          </a>
        </div>
      </div>
    </section>
  );
}
