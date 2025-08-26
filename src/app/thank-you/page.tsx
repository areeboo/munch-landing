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

          {/* Social Links Card */}
          <div className="card shadow-xl" style={{
            background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)'
          }}>
            <div className="card-body text-center p-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Stay Connected</h3>
              </div>
              
              <p className="text-gray-700 text-lg mb-8">
                Follow us for daily deal updates
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://instagram.com/themunch.news" 
                  className="btn btn-lg text-white border-0 hover:shadow-xl transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                    transition: 'all 0.3s ease'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
                <a 
                  href="https://twitter.com/themunchnews" 
                  className="btn btn-lg text-white border-0 hover:shadow-xl transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    transition: 'all 0.3s ease'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </a>
              </div>
            </div>
          </div>

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
