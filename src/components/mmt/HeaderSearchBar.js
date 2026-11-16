"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { resolveSiteSearchHref } from "../../lib/siteSearch";

const PLACEHOLDER = "Search cabs, buses, drivers, routes...";

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
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const isLight = variant === "light";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (pathname === "/search" && q) setQuery(q);
  }, [pathname]);

  function submit() {
    router.push(resolveSiteSearchHref(query.trim()));
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
        className={`flex items-center bg-white ${
          compact
            ? "h-10 gap-1.5 rounded-full pl-3 pr-1 shadow-none ring-1 ring-white/40 sm:gap-2 sm:pr-1.5"
            : `h-14 gap-3 rounded-full pl-5 pr-1.5 shadow-[0_10px_28px_rgba(15,23,42,0.12)] sm:h-[3.75rem] sm:pl-6 sm:pr-2 ${
                isLight ? "ring-1 ring-slate-200/70" : "ring-1 ring-white/25"
              }`
        }`}
      >
        <SearchLineIcon className={`shrink-0 text-slate-500 ${compact ? "h-4 w-4" : "h-5 w-5"}`} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={compact ? "Search cabs, drivers…" : PLACEHOLDER}
          aria-label="Search cabs, drivers, routes and more"
          enterKeyHint="search"
          className={`min-w-0 flex-1 appearance-none border-0 bg-transparent text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:ring-0 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none ${
            compact ? "text-[13px] sm:text-sm" : "text-[15px] sm:text-base"
          } ${inputClassName}`}
        />
        {compact ? (
          <button
            type="submit"
            className="cabzii-tap inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-[var(--cabzii-cta)] px-3.5 text-xs font-bold text-white hover:bg-[var(--cabzii-cta-hover)]"
          >
            Search
          </button>
        ) : (
          <button
            type="submit"
            className="cabzii-tap shrink-0 rounded-xl bg-[var(--cabzii-cta)] px-5 py-2 text-sm font-semibold text-[var(--cabzii-ink)] hover:bg-[var(--cabzii-cta-hover)] sm:px-7 sm:py-2.5"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
}
