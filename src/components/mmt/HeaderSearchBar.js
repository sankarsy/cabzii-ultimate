"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readSelectedCity } from "../../lib/locationPriority";

const PLACEHOLDER = "Search cabs, buses, drivers, holidays...";

function SearchLineIcon({ className }) {
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

export default function HeaderSearchBar({
  className = "",
  inputClassName = "",
  onSubmitted,
  compact = false,
  variant = "dark"
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const isLight = variant === "light";

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
      <div
        className={`flex items-center bg-white shadow-[0_10px_28px_rgba(15,23,42,0.12)] ${
          compact ? "h-11 gap-2 rounded-full pl-3.5 pr-1.5" : "h-14 gap-3 rounded-full pl-5 pr-1.5 sm:h-[3.75rem] sm:pl-6 sm:pr-2"
        } ${isLight ? "ring-1 ring-slate-200/70" : "ring-1 ring-white/25"}`}
      >
        <SearchLineIcon
          className={`shrink-0 text-slate-800 ${compact ? "h-4 w-4" : "h-5 w-5"}`}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={PLACEHOLDER}
          aria-label="Search cabs, drivers, holidays and more"
          className={`min-w-0 flex-1 border-0 bg-transparent text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:ring-0 ${
            compact ? "text-sm" : "text-[15px] sm:text-base"
          } ${inputClassName}`}
        />
        {compact ? (
          <button type="submit" className="sr-only">
            Search
          </button>
        ) : (
          <button
            type="submit"
            className="cabzii-tap shrink-0 rounded-full bg-[var(--cabzii-cta)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--cabzii-cta-hover)] sm:px-7 sm:py-2.5"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
}
