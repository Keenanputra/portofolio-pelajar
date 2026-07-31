import Reveal from "./Reveal";

const timeline = [
  {
    period: "2025 — Sekarang",
    role: "Anggota Divisi Media & Informasi",
    org: "OSIS SMA",
    description: "Mengelola konten media sosial sekolah dan dokumentasi kegiatan.",
  },
  {
    period: "2024",
    role: "Peserta",
    org: "Lomba Kompetensi Siswa — Desain Web",
    description: "Mewakili sekolah pada bidang pengembangan web tingkat kota.",
  },
  {
    period: "2023",
    role: "Ketua Tim",
    org: "Ekstrakurikuler Robotik",
    description: "Memimpin tim dalam persiapan kompetisi robotik lokal.",
  },
];

export default function Organizations() {
  return (
    <section id="organisasi" className="mx-auto max-w-3xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-accent">04.</span> Organisasi & Prestasi
        </h2>
      </Reveal>
      <ol className="mt-10 space-y-8 border-l border-white/10 pl-6">
        {timeline.map((item, i) => (
          <Reveal key={item.period} delay={i * 0.05}>
            <li className="relative">
              <span className="absolute -left-[30px] top-1 h-3 w-3 rounded-full bg-accent" />
              <p className="font-mono text-xs text-accent">{item.period}</p>
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
