"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readSelectedCity } from "../../lib/locationPriority";

const PLACEHOLDER = "Search cabs, drivers, holidays, flights…";

export default function HeaderSearchBar({ className = "", inputClassName = "", onSubmitted, compact = false }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q && window.location.pathname === "/search") setQuery(q);
  }, []);

  function submit() {
    const q = query.trim();
    if (!q) return;
    const params = new URLSearchParams({ q });
    const city = readSelectedCity();
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
    onSubmitted?.();
  }

  return (
    <form
      className={className}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="relative flex items-center">
        <svg
          className="pointer-events-none absolute left-3.5 h-[1.125rem] w-[1.125rem] text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={PLACEHOLDER}
          aria-label="Search cabs, drivers, holidays and more"
          className={`w-full rounded-full border border-white/20 bg-white/95 text-slate-800 placeholder:text-slate-400 outline-none focus:border-white focus:ring-2 focus:ring-white/30 ${
            compact ? "py-2 pl-9 pr-3 text-sm" : "py-2.5 pl-10 pr-[4.75rem] text-sm"
          } ${inputClassName}`}
        />
        {!compact ? (
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[var(--cabzii-brand)] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[var(--cabzii-brand-hover)]"
          >
            Search
          </button>
        ) : null}
      </div>
    </form>
  );
}
