"use client";
import { MotionH1, MotionSpan } from "./MotionComponents";
import ParticleSystem from "./ParticleSystem";
import Typewriter from "./Typewriter";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <ParticleSystem />

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40 z-5" />

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-white/60 mb-4 animate-fade-in">
          Halo, saya
        </p>

        <MotionH1 
          className="text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground tracking-tight mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block animate-float">
            {["K", "e", "e", "n", "a", "n"].map((char, i) => (
              <MotionSpan
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.1, 
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              >
                {char}
              </MotionSpan>
            ))}
          </span>
        </MotionH1>

        <div className="liquid-glass-light rounded-full! px-4 sm:px-8 py-3 sm:py-4 mb-10 sm:mb-12 border border-white/10">
          <p className="text-lg sm:text-xl lg:text-2xl text-muted">
            <Typewriter words={["Web Developer", "UI/UX Designer", "Creative Coder", "Pelajar"]} />
          </p>
        </div>

        <div className="flex flex-row flex-wrap items-center justify-center gap-4">
          <a
            href="#sosmed"
            className="liquid-glass-card group rounded-full! px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 gpu-accelerated"
          >
            <span className="flex items-center justify-center gap-2">
              Lihat Sosial Media
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>

          <a
            href="#kontak"
            className="liquid-glass-card group rounded-full! px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 gpu-accelerated"
          >
            <span className="flex items-center justify-center gap-2">
              Hubungi Saya
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </a>
        </div>

        {/* Subtle scroll indicator - inline below buttons, no absolute overlap */}
        <div className="mt-12">
          <div className="liquid-glass-subtle rounded-full! p-3 border border-white/5 animate-pulse gpu-accelerated">
            <svg className="w-5 h-5 text-muted animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
