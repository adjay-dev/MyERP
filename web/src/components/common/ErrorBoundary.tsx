'use client';

import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
              <p className="text-gray-700 mb-4">
                Algo deu errado. Por favor, tente recarregar a página.
              </p>
              <p className="text-sm text-gray-500 font-mono mb-4">
                {this.state.error?.message}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Recarregar
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
