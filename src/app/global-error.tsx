'use client';

import React from 'react';

/**
 * Global Error Boundary for the entire Next.js application.
 * Catches errors that occur in the root layout itself.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-8">
        <h2 className="text-2xl font-bold mb-4">Critical Error</h2>
        <p className="text-slate-400 mb-6 text-center max-w-md">
          A critical application error occurred. Error: {error.message}
        </p>
        <button
          onClick={reset}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          aria-label="Try again to recover from the critical error"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
