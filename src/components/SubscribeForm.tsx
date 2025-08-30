"use client";
import { useEffect, useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle");

  // Autofill helpers: prefill from URL or localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get("email");
      const fromStorage = localStorage.getItem("munch_sub") || "";
      const initial = (fromQuery || fromStorage || "").trim();
      if (initial) setEmail(initial);
    } catch {}
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      const em = email.trim().toLowerCase();
      localStorage.setItem("munch_sub", em);
      await fetch("/api/subscribe/verify-subscriber", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em }), cache: "no-store",
      });
      window.location.href = "/thank-you";
    } else {
      setState("err");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2" autoComplete="on">
      <label htmlFor="email" className="sr-only">Email</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        id="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        autoFocus
        enterKeyHint="send"
        className="input input-bordered"
      />
      <button className="btn btn-primary" disabled={state==="loading"} aria-disabled={state==="loading"}>
        {state==="loading" ? "Subscribing…" : "Subscribe"}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === "loading" ? "Submitting" : state === "ok" ? "Success" : state === "err" ? "Error" : "Idle"}
      </span>
      {state==="ok" && <span className="text-success" role="status" aria-live="polite">You're in.</span>}
      {state==="err" && <span className="text-error" role="alert">Try again.</span>}
    </form>
  );
}
