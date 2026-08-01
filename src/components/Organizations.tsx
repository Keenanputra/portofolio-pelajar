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
            <li className="relative pl-8 sm:pl-0">
              {/* GLASS ORB MARKER */}
              <div className="absolute -left-[24px] top-1 h-4 w-4 rounded-full border border-line bg-glass backdrop-blur-sm" />
              <div className="sm:flex sm:items-center sm:gap-6">
                <p className="font-mono text-xs text-muted sm:w-24">{item.period}</p>
                <div>
                  <h3 className="font-semibold text-foreground">{item.role}</h3>
                  <p className="text-sm text-muted">{item.org}</p>
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
