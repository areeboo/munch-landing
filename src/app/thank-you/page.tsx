"use client";
import { useEffect } from "react";

const foods = ["","","","","","","","","","","","","","","","",""];

export default function ThankYouPage() {
  // safety: trigger verify if not already done
  useEffect(() => {
    const email = localStorage.getItem("munch_sub");
    if (!email) return;
    fetch("/api/subscribe/verify-subscriber", { // Corrected URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    }).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-base-200 text-center">
      {/* ambient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-hero-gradient opacity-60" />
        {/* gentle orbs */}
        <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full blur-3xl bg-primary/20 animate-float" />
        <div className="absolute -bottom-16 -right-8 w-80 h-80 rounded-full blur-3xl bg-accent/20 animate-float" style={{ animationDelay: "2s" }} />
        {/* rotating ring */}
        <div className="pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
          <div className="absolute -inset-32 bg-gradient-conic from-primary/20 via-transparent to-accent/20 animate-spin" style={{ animationDuration: "24s" }} />
        </div>
      </div>

      {/* floating food emojis */}
      <div className="pointer-events-none absolute inset-0">
        <div className="grid grid-cols-12 gap-6 p-8 opacity-30">
          {Array.from({ length: 84 }).map((_, i) => (
            <span
              key={i}
              className="text-2xl lg:text-3xl animate-float"
              style={{ animationDelay: `${(i % 12) * 0.15}s`, animationDuration: `${4 + (i % 3)}s` }}
              aria-hidden
            >
              {foods[i % foods.length]}
            </span>
          ))}
        </div>
      </div>

      {/* card */}
      <section className="relative z-10 mx-auto max-w-xl px-6 py-24">
        <div className="card bg-base-100/80 backdrop-blur-xl rounded-3xl shadow-xl p-10 border border-base-300">
          <div className="mx-auto mb-6 size-16 rounded-2xl grid place-items-center text-primary bg-button-gradient shadow-glow animate-scale-in">
            <span className="text-3xl" aria-hidden></span>
          </div>
          <h1 className="text-4xl font-black gradient-text mb-3">Thank you!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            You’re on the list. We’ll send the best cheap eats in NOVA each week.
          </p>

          <div className="rounded-2xl bg-base-200 p-4 text-left mb-8">
            <p className="text-sm text-foreground font-semibold mb-2">Next steps</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Add <span className="font-mono text-foreground">hello@themunch.news</span> to contacts.</li>
              <li>• Check Promotions/Spam if you don’t see our email.</li>
              <li>• Follow along for pop-up deals and late adds.</li>
            </ul>
          </div>

          <div className="grid gap-3">
            <a href="/#sample" className="btn btn-primary btn-lg rounded-2xl">See sample deals</a>
            <a href="/" className="btn btn-outline btn-lg rounded-2xl">Back to home</a>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            NOVA first. DC/MD coming soon. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </main>
  );
}
