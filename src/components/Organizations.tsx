import Reveal from "./Reveal";

const timeline = [
  {
    period: "2025 — Sekarang",
    role: "Anggota Divisi Sekretaris II",
    org: "OSIS SMK",
    description: "Mencatat segala hasil diskusi pada rapat OSIS.",
  },
  {
    period: "2025",
    role: "Ketua Ekstrakurikuler",
    org: "Ekstrakurikuler Tataboga",
    description: "Memimpin tim dalam persiapan kompetisi memasak di lingkungan sekitar.",
  },
];

export default function Organizations() {
  return (
    <section id="organisasi" className="mx-auto max-w-4xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-muted">03.</span> Organisasi
        </h2>
      </Reveal>

      <ol className="mt-10 space-y-8">
        {timeline.map((item, i) => (
          <Reveal key={item.period} delay={i * 0.1}>
            <li className="relative pl-10 sm:pl-0 group">
              {/* LIQUID GLASS ORB MARKER */}
              <div className="absolute -left-[27px] top-1.5 h-5 w-5 rounded-full liquid-glass-medium border border-white/20 backdrop-blur-sm shadow-lg shadow-black/20 group-hover:border-white/40 group-hover:scale-125 transition-all duration-300 gpu-accelerated">
                <div className="absolute inset-1 rounded-full bg-white/30 animate-pulse" />
              </div>
              
              <div className="sm:flex sm:items-center sm:gap-6">
                <p className="font-mono text-xs text-muted sm:w-24">{item.period}</p>
                <div className="liquid-glass-card group-hover:border-white/30 p-5 sm:p-4 sm:flex-1">
                  <h3 className="font-semibold text-foreground transition-colors duration-300 group-hover:text-white">{item.role}</h3>
                  <p className="text-sm text-muted group-hover:text-neutral-300 transition-colors duration-300">{item.org}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
