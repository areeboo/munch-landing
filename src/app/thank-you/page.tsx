"use client";

import React, { useEffect, useState } from 'react';
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
    <main className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)'
    }}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl space-y-8">
          
          {/* Success Card */}
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body text-center p-12">
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

              <h1 className="text-5xl font-bold mb-6" style={{ color: '#f97316' }}>
                🎉 Welcome to The Munch!
              </h1>
              
              <p className="text-xl text-base-content opacity-80 leading-relaxed max-w-lg mx-auto">
                Thanks for subscribing{email ? `, ${email.split('@')[0]}` : ''}! 
                You're all set to receive the best cheap eats in Northern Virginia.
              </p>
            </div>
          </div>

          {/* What's Next Card */}
          <div className="card shadow-xl" style={{
            background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)'
          }}>
            <div className="card-body p-10">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">What happens next?</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  "First newsletter arrives this Sunday",
                  "5-8 verified deals under $10",
                  "Unsubscribe anytime with one click"
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-5 bg-white bg-opacity-70 rounded-2xl shadow-sm">
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#dc2626',
                      borderRadius: '50%',
                      marginRight: '20px',
                      flexShrink: 0,
                      boxShadow: '0 0 8px rgba(220, 38, 38, 0.6)'
                    }}></div>
                    <span className="font-bold text-lg" style={{ color: '#1f2937' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social links removed per request */}

          {/* Back to Home */}
          <div className="text-center pt-4">
            <Link 
              href="/" 
              className="btn btn-outline btn-lg text-white border-white border-opacity-30 hover:bg-white hover:text-gray-900"
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
