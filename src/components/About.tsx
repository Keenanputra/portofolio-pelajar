import Reveal from "./Reveal";

export default function About() {
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
        </Reveal>

        <Reveal delay={0.1}>
          {/* FLOATING GLASS SPHERE */}
          <div className="relative h-80 w-full max-w-sm mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-foreground/10 to-transparent blur-3xl" />
            <div className="relative h-full w-full rounded-full border border-line bg-glass/50 backdrop-blur-xl flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-foreground/10 blur-2xl animate-float" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
