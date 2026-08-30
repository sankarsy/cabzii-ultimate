"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { readSelectedCity } from "../../lib/locationPriority";

const PLACEHOLDER = "Search cabs, buses, drivers, holidays...";

function SearchLineIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.25" />
      <path d="M20 20l-4.15-4.15" />
    </svg>
  );
}

function SearchForm({ initialQuery = "" }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function submit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const params = new URLSearchParams({ q });
    const city = readSelectedCity();
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form role="search" onSubmit={submit} className="mx-auto max-w-2xl">
      <div className="flex h-14 items-center gap-3 rounded-full bg-white pl-5 pr-1.5 shadow-[0_10px_28px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 sm:h-[3.75rem] sm:pl-6 sm:pr-2">
        <SearchLineIcon className="h-5 w-5 shrink-0 text-slate-800" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={PLACEHOLDER}
          aria-label="Search everything on Cabzii"
          className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:ring-0 sm:text-base"
        />
        <button
          type="submit"
          className="cabzii-tap shrink-0 rounded-full bg-[var(--cabzii-cta)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--cabzii-cta-hover)] sm:px-7 sm:py-2.5"
        >
          Search
        </button>
      </div>
    </form>
  );
}

function SearchFormFromParams() {
  const searchParams = useSearchParams();
  return <SearchForm initialQuery={searchParams.get("q") || ""} />;
}

export default function SearchPageSearchBar({ initialQuery = "" }) {
  if (initialQuery) {
    return <SearchForm initialQuery={initialQuery} />;
  }
  return (
    <Suspense fallback={<SearchForm initialQuery="" />}>
      <SearchFormFromParams />
    </Suspense>
  );
}
