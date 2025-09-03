import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blogs";
import { renderMarkdownToHtml } from "@/lib/markdown";

// Using 'any' here to align with Next.js 15 generated PageProps typing
// which may wrap params in a Promise during type generation.
type AnyProps = any;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: AnyProps) {
  const resolved = await params; // handles promise-wrapped params in types
  const post = await getPostBySlug(resolved.slug);
  if (!post) return {};
  return {
    title: `${post.title} • The Munch`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: AnyProps) {
  const resolved = await params; // handles promise-wrapped params in types
  const post = await getPostBySlug(resolved.slug);
  if (!post) return notFound();

  return (
    <main className="min-h-screen">
      {/* Header is global via RootLayout */}

      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">{post.title}</h1>
        <time className="text-sm text-muted-foreground">{post.date}</time>
        <div className="h-px bg-white/10 my-8" />
        <div
          className="prose text-foreground/90"
          dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(post.content) }}
        />
        <div className="mt-10">
          <Link href="/blogs" className="text-primary hover:underline underline-offset-4">
            ← Back to Blog
          </Link>
        </div>
      </article>
    </main>
  );
}
