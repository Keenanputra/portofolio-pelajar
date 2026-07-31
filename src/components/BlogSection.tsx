import Link from "next/link";
import { getRecentPosts } from "@/lib/content";
import Reveal from "./Reveal";

export default function BlogSection() {
  const posts = getRecentPosts(3);

  return (
    <section id="blog" className="mx-auto max-w-3xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-accent">05.</span> Catatan Belajar
        </h2>
      </Reveal>
      <ul className="mt-10 space-y-8">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.05}>
            <li>
              <Link href={`/blog/${post.slug}`} className="group block">
                <h3 className="font-semibold text-foreground transition group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-muted">{post.date}</p>
                <p className="mt-2 text-sm text-muted">{post.description}</p>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
      <Reveal delay={0.15}>
        <Link href="/blog" className="mt-8 inline-block font-mono text-sm text-accent transition hover:text-accent-2">
          Semua catatan →
        </Link>
      </Reveal>
    </section>
  );
}
