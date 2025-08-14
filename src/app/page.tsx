import Image from "next/image";
import SubscribeForm from "@/components/SubscribeForm";

const sampleDeals = [
  { title: "Half-Price Appetizers at The Gastropub", meta: "Every Mon-Wed, 4-6 PM. Dine-in only.", img: "/images/deal-1.jpg", distance: 2.1 },
  { title: "$5 Sushi Rolls at Sushi Haven", meta: "Tuesdays all day. Select rolls.", img: "/images/deal-2.jpg", distance: 3.5 },
  { title: "Buy One Get One Free Burgers at Burger Joint", meta: "Thursdays after 5 PM. Valid on classic burgers.", img: "/images/deal-3.jpg", distance: 1.8 },
  { title: "Vegan Pizza Special at Green Slice", meta: "Weekends. Any large vegan pizza for $12.", img: "/images/deal-4.jpg", distance: 4.0 },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-mesh-gradient relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40 mix-blend-screen"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-radial from-neon-orange/20 via-neon-orange/5 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-neon-yellow/15 via-accent/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-radial from-primary/25 via-primary/5 to-transparent rounded-full blur-2xl animate-float" style={{ animationDelay: "6s" }}></div>
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-conic from-primary/10 via-transparent to-primary/5 animate-spin opacity-30" style={{ animationDuration: "20s" }}></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-conic from-primary/5 via-transparent to-primary/10 animate-spin opacity-30" style={{ animationDuration: "25s", animationDirection: "reverse" }}></div>
      </div>

      {/* Top Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 supports-[backdrop-filter]:shadow-sm animate-fade-in">
        <div className="mx-auto max-w-6xl px-4 py-4 relative flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black tracking-tight gradient-text">🍽️ The Munch</span>
            <div className="ml-3 flex flex-col items-center relative group">
              <button className="btn btn-sm btn-success rounded-full uppercase tracking-wider flex items-center gap-1.5">
                NOVA Edition
                <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <span className="text-xs text-emerald-400/70 font-medium mt-0.5">Northern Virginia</span>

              <div className="absolute top-full mt-2 w-64 rounded-2xl shadow-xl hidden group-hover:block z-50" style={{ backgroundColor: "hsl(25, 18%, 10%)" }}>
                <div className="p-4">
                  <div className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    Current Location
                  </div>
                  <div className="bg-emerald-700 rounded-lg p-3 mb-4">
                    <div className="font-medium text-emerald-100">Northern Virginia (NOVA)</div>
                    <div className="text-xs text-emerald-200 mt-1">Arlington • Alexandria • Fairfax • Loudoun • Prince William</div>
                  </div>

                  <div className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                    Coming Soon
                  </div>
                  <div className="space-y-2">
                    {["Washington DC", "New York City", "Baltimore", "Philadelphia"].map((city) => (
                      <div key={city} className="py-2 px-3 bg-secondary rounded-lg">
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

          <nav className="absolute right-0 flex items-center gap-2">
            <a href="#why" className="btn btn-ghost btn-sm rounded-lg text-foreground hover:text-primary font-medium transition-all duration-200">Why</a>
            <a href="#sample" className="btn btn-ghost btn-sm rounded-lg text-foreground hover:text-primary font-medium transition-all duration-200">Sample</a>
            <a href="#faq" className="btn btn-ghost btn-sm rounded-lg text-foreground hover:text-primary font-medium transition-all duration-200">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
          <FoodGridPattern />
        </div>

        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/5 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-primary/15 rounded-full blur-lg animate-float" style={{ animationDelay: "4s" }}></div>

        <div className="mx-auto max-w-6xl px-4 py-16 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-card/60 rounded-full px-3 py-1.5 text-sm text-muted-foreground mb-5 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              Live deals updated weekly
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[0.95] mb-6">
              The best
              <span className="gradient-text relative block mt-1">
                cheap eats
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-accent-gradient rounded-full opacity-60"></div>
              </span>
              <span className="block mt-1 text-4xl sm:text-5xl lg:text-6xl text-muted-foreground/80">in Northern Virginia</span>
            </h1>

            <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-xl font-light">
              Free weekly digest of <span className="text-foreground font-semibold">fast food steals</span>, <span className="text-foreground font-semibold">sit-down specials</span>, <span className="text-foreground font-semibold">late-night bites</span>, and <span className="text-foreground font-semibold">vegan wins</span> under $10.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
              {[
                { text: "$3–$9 real deals only", icon: "💰", accent: "No fake 'savings'" },
                { text: "Distance and hours included", icon: "📍", accent: "Never waste a trip" },
                { text: "No spam. One-tap unsubscribe", icon: "✨", accent: "Respect your inbox" },
                { text: "NOVA-first. DC/MD later", icon: "🗺️", accent: "Locally curated" },
              ].map((item, i) => (
                <div key={item.text} className="card flex items-start gap-3 p-4 rounded-xl bg-base-100 hover:bg-base-200 transition-all duration-200 animate-slide-up group shadow-md" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="text-2xl group-hover:scale-105 transition-transform duration-200">{item.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckIcon />
                      <span className="text-foreground font-semibold text-sm">{item.text}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.accent}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <a href="#subscribe" className="btn btn-primary btn-lg inline-flex items-center justify-center rounded-2xl shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-300 animate-glow focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Get Weekly Deals
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </a>
              <a href="#sample" className="btn btn-outline btn-lg inline-flex items-center justify-center rounded-2xl">
                View Sample Deals
              </a>
            </div>
          </div>

          {/* Form Card uses shared SubscribeForm */}
          <div id="subscribe" className="card bg-base-200 backdrop-blur-2xl rounded-3xl p-10 sm:p-12 animate-scale-in relative overflow-hidden group hover:shadow-[0_0_80px_rgba(251,146,60,0.15)] transition-all duration-700 shadow-xl">
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_70%)]"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
                <h2 className="text-3xl font-black gradient-text">Subscribe free</h2>
              </div>
              <p className="text-muted-foreground mb-10 text-lg">NOVA only for now. DC and new locations coming soon.</p>

              <SubscribeForm />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof / sample */}
      <section id="sample" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-card/40 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-muted-foreground mb-4">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Real deals from last week
            </div>
            <h3 className="text-4xl sm:text-5xl font-black mb-4">
              Sample deals you can <span className="gradient-text">expect</span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Here&apos;s what landed in NOVA inboxes this week</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleDeals.map((d, i) => (
              <article
                key={d.title}
                className="card group bg-base-200 backdrop-blur-xl rounded-3xl overflow-hidden  transition-all duration-700 hover:scale-[1.03] animate-slide-up relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-accent/5 before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-500 shadow-lg"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <Image src={d.img} alt="" width={500} height={300} className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/50 transition-all duration-500"></div>
                  <span className="absolute top-4 right-4 rounded-2xl bg-background/90 backdrop-blur-sm text-sm px-4 py-2 font-bold text-primary shadow-glow-lg">{d.distance} mi</span>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-glass-gradient backdrop-blur-xl rounded-2xl p-4 shadow-card-hover">
                      <h4 className="font-bold text-foreground text-lg mb-2 line-clamp-2">{d.title}</h4>
                      <p className="text-sm text-muted-foreground font-medium">{d.meta}</p>
                      <button className="btn btn-primary btn-sm btn-block mt-3 rounded-xl hover:shadow-glow-lg hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                        View Deal →
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-4xl font-black mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h3>
            <p className="text-xl text-muted-foreground">Everything you need to know about The Munch</p>
          </div>

          <div className="grid gap-6">
            {[
              { question: "Is it really free?", answer: "Absolutely! We find and curate the best deals in NOVA. You get one beautifully designed email per week with no strings attached.", icon: "💰" },
              { question: "Which areas in NOVA do you cover?", answer: "Arlington, Alexandria, Fairfax, Loudoun, and Prince William to start. We're expanding coverage based on subscriber feedback.", icon: "📍" },
              { question: "When will you cover DC and Maryland?", answer: "Soon! We're building our NOVA foundation first. Join now and you'll be the first to know when we expand to DC/MD.", icon: "🗺️" },
              { question: "How do you find these deals?", answer: "Our team scours social media, restaurant websites, and local communities daily. We verify every deal before it hits your inbox.", icon: "🔍" },
            ].map((faq, i) => (
              <details key={faq.question} className="collapse collapse-plus bg-base-200 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-[0_0_60px_rgba(251,146,60,0.1)] transition-all duration-500 animate-slide-up relative overflow-hidden" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="collapse-title font-bold text-xl cursor-pointer flex items-center gap-4 hover:text-primary transition-colors relative z-10">
                  <span className="text-3xl drop-shadow-lg">{faq.icon}</span>
                  {faq.question}
                  <svg className="ml-auto w-6 h-6 transition-transform group-open:rotate-180 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                <div className="collapse-content">
                  <p className="mt-6 text-muted-foreground leading-relaxed pl-16 text-lg relative z-10">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative bg-card-gradient backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50"></div>
        <div className="mx-auto max-w-7xl px-4 py-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Logo />
              <div>
                <p className="font-bold text-foreground">© {new Date().getFullYear()} The Munch</p>
                <p className="text-sm text-muted-foreground">NOVA Edition • Made with 🧡 in Virginia</p>
              </div>
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors font-medium">Privacy</a>
              <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors font-medium">Terms</a>
              <a href="mailto:hello@themunch.news" className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105">Contact</a>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Logo() {
  return (
    <div className="size-12 rounded-3xl bg-button-gradient grid place-items-center text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-110 animate-float">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2c-3.866 0-7 2.582-7 6 0 2.485 1.864 4.61 4.5 5.483L9 22l3-2 3 2-.5-8.517C17.136 12.61 19 10.485 19 8c0-3.418-3.134-6-7-6Z" />
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
      <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
  );
}

function FoodGridPattern() {
  const icons = ["🍔","🥗","🍣","🍕","🌮","🥙","🥟","🍜","🍟","🧋","🥪","🧇","🍩","🍱","🥞","🌯","🍗","🥑","🍝","🧀","🍦","🥨","🌭","🥓","🍰","🥮","🍤","🦞","🥘","🍲"];
  return (
    <div className="grid grid-cols-12 gap-8 p-12 select-none">
      {Array.from({ length: 180 }).map((_, i) => (
        <div key={i} className="text-3xl opacity-30 hover:opacity-60 transition-opacity duration-500 animate-float" style={{ animationDelay: `${i * 0.1}s`, animationDuration: `${4 + (i % 3)}s` }}>
          <span aria-hidden>{icons[i % icons.length]}</span>
        </div>
      ))}
    </div>
  );
}