"use client";

import React, { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

export default function ThankYouPage() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("munch_sub");
    if (!storedEmail) return;
    
    setEmail(storedEmail);
    
    fetch("/api/subscribe/verify-subscriber", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: storedEmail }),
      cache: "no-store",
    });
  }, []);

  return (
    <main className="min-h-screen relative">
      {/* Theme toggle top-left */}
      <div className="absolute left-4 top-4 z-10">
        <ThemeToggle />
      </div>
      {/* subtle texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '6px 6px',
      }} />

      <div className="flex items-center justify-center min-h-screen p-6 sm:p-8">
        <div className="w-full max-w-2xl space-y-10">
          
          {/* Success Card */}
          <div className="card bg-base-100/95 shadow-2xl backdrop-blur-xl">
            <div className="card-body text-center p-10 sm:p-12">
              {/* Success Icon with Pulse */}
              <div className="mx-auto mb-8 animate-pulse" style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4), 0 0 0 0 rgba(16, 185, 129, 0.7)',
                animation: 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite'
              }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              <style jsx>{`
                @keyframes pulse-ring {
                  0% {
                    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4), 0 0 0 0 rgba(16, 185, 129, 0.7);
                  }
                  50% {
                    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4), 0 0 0 15px rgba(16, 185, 129, 0);
                  }
                  100% {
                    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4), 0 0 0 0 rgba(16, 185, 129, 0);
                  }
                }
              `}</style>

              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight" style={{ color: '#f97316' }}>
                🎉 Welcome to The Munch!
              </h1>
              
              <p className="text-lg sm:text-xl text-base-content opacity-80 leading-relaxed max-w-lg mx-auto">
                Thanks for subscribing{email ? `, ${email.split('@')[0]}` : ''}! 
                You're all set to receive the best cheap eats in Northern Virginia.
              </p>
            </div>
          </div>

          {/* What's Next Card */}
          <div className="card bg-base-200/70 backdrop-blur-xl shadow-xl">
            <div className="card-body p-8 sm:p-10">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">What happens next?</h2>
              </div>

              <div className="space-y-4">
                {[
                  'First newsletter arrives this Sunday',
                  '5–8 verified deals under $10',
                  'Unsubscribe anytime with one click',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-5 rounded-2xl border dark:bg-white/5 bg-black/5 dark:border-white/10 border-black/10"
                  >
                    <div
                      className="mr-4 flex-shrink-0 rounded-full shadow"
                      style={{
                        width: '12px',
                        height: '12px',
                        background: '#f97316',
                        boxShadow: '0 0 10px rgba(249, 115, 22, 0.6)',
                      }}
                    />
                    <span className="font-semibold text-base sm:text-lg text-foreground leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social links removed per request */}

          {/* Back to Home */}
          <div className="text-center pt-2">
            <Link 
              href="/" 
              className="btn btn-outline btn-lg rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] text-foreground dark:border-white/30 border-black/20 hover:bg-foreground hover:text-background focus:ring-2 focus:ring-offset-2 focus:ring-foreground/40"
              style={{ transition: 'all 0.3s ease' }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to home
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
