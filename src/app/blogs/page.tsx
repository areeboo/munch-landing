import Link from "next/link";
import { getAllPosts } from "@/lib/blogs";

export const metadata = {
  title: "Blog • The Munch",
  description: "Updates, roundups, and news from The Munch.",
};

export default async function BlogsPage() {
  const posts = await getAllPosts();
  return (
    <main className="min-h-screen">
      {/* Header is global via RootLayout */}

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">Blog</h1>
        <p className="text-muted-foreground mb-10">
          A few placeholder posts to get us started. We’ll design this page next.
        </p>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <li key={p.slug} className="group">
              <Link
                href={`/blogs/${p.slug}`}
                className="block rounded-2xl p-6 border blog-card transition-all h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/40 hover:-translate-y-0.5"
                aria-label={`Read: ${p.title}`}
              >
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-primary to-accent opacity-70 group-hover:opacity-100 mb-4" />
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight group-hover:underline underline-offset-4">
                    {p.title}
                  </h2>
                  <time className="text-xs nova-badge px-2 py-1 rounded-full whitespace-nowrap">{p.date}</time>
                </div>
                <p className="text-foreground/80 mb-4">{p.excerpt}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <span>Read post</span>
                  <span aria-hidden>→</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
