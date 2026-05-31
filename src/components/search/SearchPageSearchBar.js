"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { readSelectedCity } from "../../lib/locationPriority";

const PLACEHOLDER = "Search cabs, drivers, holidays, flights, hotels…";

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
      <div className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={PLACEHOLDER}
          aria-label="Search everything on Cabzii"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none focus:border-[var(--cabzii-brand)] focus:ring-2 focus:ring-[var(--cabzii-brand)]/20"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-[var(--cabzii-brand)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--cabzii-brand-hover)]"
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
