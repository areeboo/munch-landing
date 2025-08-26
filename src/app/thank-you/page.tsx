"use client";

import React, { useEffect } from 'react';

export default function ThankYouPage() {
  useEffect(() => {
    const email = localStorage.getItem("munch_sub");
    if (!email) return;
    fetch("/api/subscribe/verify-subscriber", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });
  }, []);

  return (
    <main>
      <h1>Thank You!</h1>
      <p>Your subscription has been confirmed.</p>
    </main>
  );
}
