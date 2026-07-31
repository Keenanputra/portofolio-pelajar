import Reveal from "./Reveal";

const skillGroups = [
  {
    title: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
  },
  {
    title: "Backend & Lainnya",
    items: ["Python", "Node.js", "Git", "Linux"],
  },
  {
    title: "Tools",
    items: ["VS Code", "Figma", "Vercel"],
  },
];

export default function Skills() {
  return (
    <section id="skill" className="mx-auto max-w-5xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-accent">02.</span> Skill & Tech Stack
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.1}>
            <div className="h-full rounded-xl border border-white/10 bg-surface p-6">
              <h3 className="font-semibold text-foreground">{group.title}</h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
