import fs from "node:fs/promises";
import path from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO date string
  excerpt: string;
  content: string; // raw markdown for now
};

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blogs");

async function readFileSafe(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function parseFrontMatter(md: string): Omit<BlogPost, "slug"> {
  // Very lightweight front-matter parser: key: value pairs between --- lines
  // Example:
  // ---\n
  // title: My Post\n
  // date: 2025-09-01\n
  // excerpt: Something...\n
  // ---\n
  const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    return {
      title: "Untitled",
      date: new Date().toISOString().slice(0, 10),
      excerpt: "",
      content: md.trim(),
    };
  }
  const [, fm, content] = fmMatch;
  const meta: Record<string, string> = {};
  for (const line of fm.split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    meta[key] = value;
  }
  return {
    title: meta.title || "Untitled",
    date: meta.date || new Date().toISOString().slice(0, 10),
    excerpt: meta.excerpt || "",
    content: content.trim(),
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = await fs.readdir(CONTENT_DIR).catch(() => []);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const posts: BlogPost[] = [];
  for (const file of mdFiles) {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(CONTENT_DIR, file);
    const md = await readFileSafe(fullPath);
    if (!md) continue;
    const meta = parseFrontMatter(md);
    posts.push({ slug, ...meta });
  }
  // Newest first
  posts.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(CONTENT_DIR, `${slug}.md`);
  const md = await readFileSafe(fullPath);
  if (!md) return null;
  const meta = parseFrontMatter(md);
  return { slug, ...meta };
}

