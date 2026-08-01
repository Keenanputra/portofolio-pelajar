import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="tentang" className="mx-auto max-w-3xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-muted">01.</span> Tentang Saya
        </h2>
        <p className="mt-6 leading-relaxed text-muted">
          Saya Keenan, seorang pelajar yang tertarik pada web development. Saya senang
          membangun hal-hal yang berguna dan belajar teknologi baru.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Di luar coding, saya aktif di organisasi sekolah.
        </p>
      </Reveal>
    </section>
  );
}
