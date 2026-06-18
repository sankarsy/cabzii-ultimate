"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchIcon } from "../icons";
import { getHolidayThemeIcon, HOLIDAY_THEME_ICON_STYLES } from "../icons/heroIcons";
import { HOLIDAY_THEMES, themeHref } from "../../lib/holidayHome";

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
          {HOLIDAY_THEMES.map((theme) => {
            const ThemeIcon = getHolidayThemeIcon(theme.iconKey || theme.id);
            const iconStyle = HOLIDAY_THEME_ICON_STYLES[theme.iconKey || theme.id] || HOLIDAY_THEME_ICON_STYLES.beach;
            return (
            <Link key={theme.id} href={themeHref(theme)} className="emt-holiday-theme cabzii-tap">
              <span className={`emt-holiday-theme-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconStyle}`} aria-hidden>
                <ThemeIcon className="h-4 w-4" />
              </span>
              <span>{theme.title}</span>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
