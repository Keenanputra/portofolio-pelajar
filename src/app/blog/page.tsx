import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-4 py-32">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Catatan Belajar</h1>
      <p className="mt-2 text-muted">Dokumentasi proses belajar saya.</p>
      <ul className="mt-12 space-y-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <h2 className="text-xl font-semibold text-foreground transition group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-1 font-mono text-xs text-muted">{post.date}</p>
              <p className="mt-2 text-muted">{post.description}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-accent">
                    {tag}
                  </li>
                ))}
              </ul>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
