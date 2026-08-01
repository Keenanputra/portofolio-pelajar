"use client";
import ParticleSystem from "./ParticleSystem";
import LiquidText from "./LiquidText";
import Typewriter from "./Typewriter";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <ParticleSystem />

      <div className="relative z-10 px-4 text-center">
        <p className="font-mono text-sm text-muted">Halo, saya</p>

        {/* LIQUID TEXT */}
        <div className="mt-4">
          <LiquidText text="Keenan" className="text-6xl sm:text-8xl" />
        </div>

        <p className="mt-6 text-xl text-muted sm:text-2xl">
          <Typewriter words={["Web Developer", "Desainer", "Mahasiswa"]} />
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="#skill"
            className="rounded-xl bg-foreground px-6 py-3 font-semibold text-background transition hover:bg-foreground/90"
          >
            Lihat Skill
          </a>
          <a
            href="#kontak"
            className="rounded-xl border border-line bg-glass px-6 py-3 font-semibold text-foreground transition hover:border-foreground hover:text-foreground backdrop-blur"
          >
            Hubungi Saya
          </a>
        </div>
      </div>
    </section>
  );
}
