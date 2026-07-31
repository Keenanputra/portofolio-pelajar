import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");
const PROJECT_DIR = path.join(process.cwd(), "src", "content", "projects");

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
};

export type Post = PostSummary & { content: string };

export type ProjectSummary = PostSummary & { image?: string; url?: string };

export type Project = ProjectSummary & { content: string };

function listFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

function parsePostFile(file: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    tags: (data.tags as string[]) ?? [],
    content,
  };
}

function parseProjectFile(file: string): Project {
  const raw = fs.readFileSync(path.join(PROJECT_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    tags: (data.tags as string[]) ?? [],
    image: data.image as string | undefined,
    url: data.url as string | undefined,
    content,
  };
}

export function getAllPosts(): PostSummary[] {
  return listFiles(BLOG_DIR)
    .map((f) => {
      const post = parsePostFile(f);
      const { content: _content, ...summary } = post;
      return summary;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOG_DIR, file))) return null;
  return parsePostFile(file);
}

export function getRecentPosts(count: number): PostSummary[] {
  return getAllPosts().slice(0, count);
}

export function getAllProjects(): ProjectSummary[] {
  return listFiles(PROJECT_DIR)
    .map((f) => {
      const project = parseProjectFile(f);
      const { content: _content, ...summary } = project;
      return summary;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getProject(slug: string): Project | null {
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(PROJECT_DIR, file))) return null;
  return parseProjectFile(file);
}
