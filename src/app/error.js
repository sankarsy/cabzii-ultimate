"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-extrabold text-slate-900">Something went wrong</h1>
      <p className="mt-3 text-sm text-slate-600">
        Please try again, go back to the homepage, or get a quote on WhatsApp.
      </p>
      <pre className="mt-4 max-w-full overflow-auto rounded-lg bg-slate-100 p-3 text-left text-xs text-rose-700">
        {error?.message || String(error || "Unknown error")}
        {error?.digest ? `\ndigest ${error.digest}` : ""}
        {error?.stack ? `\n${error.stack}` : ""}
      </pre>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => reset?.()} className="cabzii-btn cabzii-btn-primary">
          Try again
        </button>
        <Link href="/" className="cabzii-btn cabzii-btn-secondary">
          Go to homepage
        </Link>
        <Link href="/contact" className="cabzii-btn cabzii-btn-secondary">
          Contact Cabzii
        </Link>
      </div>
    </main>
  );
}
