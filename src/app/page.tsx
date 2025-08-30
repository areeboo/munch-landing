import SubscribeForm from "@/components/SubscribeForm";
import ThemeToggle from "@/components/ThemeToggle";

export default function Page() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Subtle background texture and glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '6px 6px',
          }}
        />
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(249,115,22,0.35) 0%, rgba(249,115,22,0) 60%)',
          }}
        />
      </div>
      {/* Top Nav (brand + NOVA badge + theme toggle) */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 supports-[backdrop-filter]:shadow-sm animate-fade-in border-b border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 relative flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black tracking-tight gradient-text">🍽️ The Munch</span>
            <div className="ml-3 flex flex-col items-center relative group">
              <button className="nova-badge btn btn-sm rounded-full uppercase tracking-wider flex items-center gap-1.5 px-3">
                NOVA Edition
                <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <span className="text-xs text-muted-foreground font-medium mt-0.5">Northern Virginia</span>

              <div className="absolute top-full mt-2 w-64 rounded-2xl shadow-xl hidden group-hover:block z-50 bg-base-200/90 border border-white/10 backdrop-blur-xl">
                <div className="p-4">
                  <div className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    Current Location
                  </div>
                  <div className="rounded-lg p-3 mb-4 bg-base-100/80">
                    <div className="font-medium">Northern Virginia (NOVA)</div>
                    <div className="text-xs text-muted-foreground mt-1">Arlington • Alexandria • Fairfax • Loudoun • Prince William</div>
                  </div>

                  <div className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                    Coming Soon
                  </div>
                  <div className="space-y-2">
                    {["Washington DC", "New York City", "Baltimore", "Philadelphia"].map((city) => (
                      <div key={city} className="py-2 px-3 bg-base-100/70 rounded-lg">
                        <div className="font-medium text-foreground text-sm">{city}</div>
                        <div className="text-xs text-muted-foreground">{city === "Washington DC" ? "Metro area" : city === "New York City" ? "Manhattan & Brooklyn" : city === "Baltimore" ? "Inner Harbor & Fells Point" : "Center City & Fishtown"}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 text-center">
                    <span className="text-xs text-muted-foreground">Want your city next? </span>
                    <a href="mailto:hello@themunch.news" className="text-xs text-primary hover:text-primary/80 underline font-medium">Let us know!</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prominent toggle on top-left */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero: only three elements — pill, headline, subscribe card */}
      <section className="relative min-h-[calc(100svh-64px)] flex items-center py-0">
        <div className="absolute inset-0 opacity-[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
          {/* background intentionally minimal */}
        </div>

        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-card/60 rounded-full px-3 py-1.5 text-sm text-muted-foreground mb-6">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              Live deals updated weekly
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.04]">
              The best
              <span className="gradient-text relative block mt-1">
                cheap eats
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-accent-gradient rounded-full opacity-60"></div>
              </span>
              <span className="block mt-2 text-4xl sm:text-5xl lg:text-6xl text-muted-foreground/80">in Northern Virginia</span>
            </h1>
          </div>

          {/* Form Card uses shared SubscribeForm */}
          <div id="subscribe" className="subscribe-card card bg-base-200/70 backdrop-blur-2xl rounded-3xl p-10 sm:p-12 animate-scale-in relative overflow-hidden group hover:shadow-[0_0_80px_rgba(251,146,60,0.15)] transition-all duration-700 shadow-xl border border-white/10">
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_70%)]"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
                <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text">Subscribe free</h2>
              </div>
              <p className="text-muted-foreground mb-8 text-base sm:text-lg">NOVA only for now. DC and new locations coming soon.</p>

              <SubscribeForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
