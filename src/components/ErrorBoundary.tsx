"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details (in production, you'd send this to monitoring service)
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In a real app, you'd send this to your error tracking service:
    // sendToErrorService(error, errorInfo, window.location.href);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
          <div className="text-center max-w-md px-6">
            <div className="text-6xl mb-4">🛠️</div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              We're sorry for the inconvenience. The page encountered an error, but don't worry - your subscription data is safe!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary"
              >
                Refresh Page
              </button>
              <a 
                href="/" 
                className="btn btn-outline"
              >
                Go Home
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Error ID: {this.state.error?.message?.substring(0, 8) || 'unknown'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;