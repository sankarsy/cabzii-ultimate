"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "../icons";
import { HOLIDAY_THEMES, themeHref } from "../../lib/holidayHome";
import HolidayThemeTile from "./HolidayThemeTile";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&h=700&q=80";

export default function EmtHolidaySearchForm({ emtHero = false }) {
  const router = useRouter();
  const [destination, setDestination] = useState("");

  function search(e) {
    e?.preventDefault?.();
    const q = destination.trim();
    router.push(q ? `/holidays?q=${encodeURIComponent(q)}` : "/holidays");
  }

  if (!emtHero) {
    return null;
  }

  return (
    <div className="emt-holiday-hero">
      <div className="emt-holiday-hero-bg" style={{ backgroundImage: `url(${HERO_IMAGE})` }} aria-hidden />
      <div className="emt-holiday-hero-overlay" aria-hidden />

      <div className="emt-holiday-hero-content">
        <p className="emt-holiday-script">Explore India with Cabzii</p>
        <p className="emt-holiday-headline">Where Every Journey Counts!</p>

        <form onSubmit={search} className="emt-holiday-search-pill">
          <SearchIcon className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter Your Dream Destination!"
            className="min-w-0 flex-1 border-0 bg-transparent text-base font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button type="submit" className="emt-holiday-search-btn cabzii-tap">
            Search
          </button>
        </form>

        <div className="emt-holiday-themes">
          {HOLIDAY_THEMES.map((theme) => (
            <HolidayThemeTile
              key={theme.id}
              theme={{ ...theme, href: themeHref(theme) }}
              size="compact"
              variant="onDark"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
