import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LocationBadge from "@/components/LocationBadge";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 supports-[backdrop-filter]:shadow-sm border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:py-3 relative grid grid-cols-3 items-center">
        <div className="justify-self-start">
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 justify-self-center">
          <Link href="/" className="text-3xl font-black tracking-tight gradient-text">
            🍽️ The Munch
          </Link>
          <LocationBadge />
        </div>
        <nav className="justify-self-end">
          <Link
            href="/blogs"
            className="btn btn-primary btn-sm rounded-full shadow-sm hover:shadow-lg hover:scale-[1.02] px-4"
          >
            Blogs
          </Link>
        </nav>
      </div>
    </header>
  );
}
