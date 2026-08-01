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
    <section id="organisasi" className="mx-auto max-w-3xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-muted">03.</span> Organisasi
        </h2>
      </Reveal>
      <ol className="mt-10 space-y-8 border-l border-line pl-6">
        {timeline.map((item, i) => (
          <Reveal key={item.period} delay={i * 0.05}>
            <li className="relative">
              <span className="absolute -left-[30px] top-1 h-3 w-3 rounded-full bg-accent" />
              <p className="font-mono text-xs text-muted">{item.period}</p>
              <h3 className="mt-1 font-semibold text-foreground">{item.role}</h3>
              <p className="text-sm text-muted">{item.org}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
