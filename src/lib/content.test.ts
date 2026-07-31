import { describe, expect, it } from "vitest";
import {
  getAllPosts,
  getPost,
  getRecentPosts,
  getAllProjects,
  getProject,
} from "./content";

describe("content", () => {
  it("getAllPosts mengembalikan post terurut tanggal terbaru", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it("getPost mengembalikan konten dan null untuk slug yang tidak ada", () => {
    const first = getAllPosts()[0];
    const post = getPost(first.slug);
    expect(post?.title).toBe(first.title);
    expect(post?.content.length).toBeGreaterThan(0);
    expect(getPost("tidak-ada")).toBeNull();
  });

  it("getRecentPosts mengembalikan jumlah sesuai", () => {
    expect(getRecentPosts(1).length).toBe(1);
    expect(getRecentPosts(99).length).toBe(getAllPosts().length);
  });

  it("getAllProjects dan getProject bekerja", () => {
    const projects = getAllProjects();
    expect(projects.length).toBeGreaterThan(0);
    const p = getProject(projects[0].slug);
    expect(p?.title).toBe(projects[0].title);
    expect(getProject("tidak-ada")).toBeNull();
  });
});
