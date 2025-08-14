"use client";
import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle");

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
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="input input-bordered"
      />
      <button className="btn btn-primary" disabled={state==="loading"}>
        {state==="loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {state==="ok" && <span className="text-success">You're in.</span>}
      {state==="err" && <span className="text-error">Try again.</span>}
    </form>
  );
}