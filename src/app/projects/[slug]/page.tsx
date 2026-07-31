import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/content";
import MarkdownBody from "@/components/MarkdownBody";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project?.title ?? "Proyek", description: project?.description };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-32">
      <p className="font-mono text-xs text-accent">{project.date}</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{project.title}</h1>
      <p className="mt-4 text-lg text-muted">{project.description}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-accent">
            {tag}
          </li>
        ))}
      </ul>
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent/80"
        >
          Kunjungi Proyek
        </a>
      )}
      <div className="mt-12 border-t border-white/10 pt-10">
        <MarkdownBody content={project.content} />
      </div>
    </article>
  );
}
