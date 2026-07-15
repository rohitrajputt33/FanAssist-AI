'use client';

import React from 'react';

/**
 * Next.js Error Boundary for the application.
 * Catches runtime errors in route segments and displays a recovery UI.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-slate-400 mb-6 text-center max-w-md">
        An unexpected error occurred in the application. Error: {error.message}
      </p>
      <button
        onClick={reset}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        aria-label="Try again to recover from the error"
      >
        Try Again
      </button>
    </div>
  );
}
