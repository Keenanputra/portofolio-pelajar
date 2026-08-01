"use client";
import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";

export default function About() {
  const [imageError, setImageError] = useState(false);
  return (
    <section id="tentang" className="mx-auto max-w-6xl px-4 py-24">
      <div className="grid gap-16 sm:grid-cols-2">
        <Reveal>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            <span className="font-mono text-muted">01.</span> Tentang Saya
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            Saya Keenan, seorang pelajar yang tertarik pada web development.
            Saya senang membangun hal-hal yang berguna dan belajar teknologi baru.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Di luar coding, saya aktif di organisasi sekolah dan mendokumentasikan
            perjalanan belajar saya.
          </p>
          
          {/* Interactive skill badges */}
          <div className="mt-8 flex flex-wrap gap-2">
            {["Next.js", "React", "Tailwind CSS", "TypeScript", "UI/UX"].map((skill) => (
              <span
                key={skill}
                className="liquid-glass-accent px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:scale-105 transition-all duration-300 cursor-default gpu-accelerated"
              >
                {skill}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative h-96 w-full max-w-sm mx-auto overflow-hidden rounded-3xl liquid-glass-medium border border-white/10">
            {/* Background blur patterns */}
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-transparent" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-foreground/20 blur-3xl" />
              <div className="absolute -bottom-10 -right-10 h-52 w-52 rounded-full bg-foreground/10 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/5 blur-2xl animate-float" />
            </div>
            
            {/* Profile content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center p-6">
              {/* Profile Photo Container - Optimized for portrait aspect ratio */}
              <div className="group relative mb-4">
                {/* Outer glass ring dengan hover glow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-foreground/20 to-foreground/5 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />
                
                {/* Photo frame - Portrait ratio 3:4 */}
                <div className="relative w-40 sm:w-44 lg:w-48 rounded-2xl border-2 border-white/15 liquid-glass-light p-1.5 backdrop-blur-sm transition-all duration-300 group-hover:border-white/40 group-hover:scale-105 profile-glow overflow-hidden">
                  <div className="relative h-52 sm:h-56 lg:h-60 w-full rounded-xl overflow-hidden">
                    {!imageError ? (
                      <Image
                        src="/profile.jpg"
                        alt="Potret Keenan, pelajar dan pengembang web yang suka membangun solusi digital"
                        width={192}
                        height={240}
                        sizes="(max-width: 640px) 160px, (max-width: 1024px) 176px, 192px"
                        className="h-full w-full object-cover object-top"
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
                </div>
              </div>
              
              {/* Subtle text */}
              <p className="font-mono text-xs text-muted/80">Developer & Student</p>
              <p className="mt-1 text-sm font-medium text-foreground/60">Keep Growing</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}