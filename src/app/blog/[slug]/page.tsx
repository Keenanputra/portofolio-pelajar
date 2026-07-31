import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/content";
import MarkdownBody from "@/components/MarkdownBody";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post?.title ?? "Artikel", description: post?.description };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-32">
      <p className="font-mono text-xs text-accent">{post.date}</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{post.title}</h1>
      <p className="mt-4 text-lg text-muted">{post.description}</p>
      <div className="mt-12 border-t border-white/10 pt-10">
        <MarkdownBody content={post.content} />
      </div>
    </article>
  );
}
