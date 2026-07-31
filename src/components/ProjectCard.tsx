import Link from "next/link";
import type { ProjectSummary } from "@/lib/content";

export default function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block h-full rounded-xl border border-white/10 bg-surface p-6 transition hover:border-accent/60"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-foreground transition group-hover:text-accent">
          {project.title}
        </h3>
        <span className="shrink-0 font-mono text-xs text-muted">{project.date}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-accent">
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}
