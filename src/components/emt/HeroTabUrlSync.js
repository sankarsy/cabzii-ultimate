"use client";

import { useEffect, useRef } from "react";
import { useHeroSearch } from "./HeroSearchContext";

const VALID_TABS = new Set(["cabs", "drivers", "buses", "holidays"]);

/**
 * Mirror the hero tab in the URL without a Next.js navigation.
 * router.replace() remounts the homepage (Suspense + searchParams) and
 * storms /manifest.webmanifest — use history.replaceState instead.
 */
export default function HeroTabUrlSync() {
  const hero = useHeroSearch();
  const skipInitial = useRef(true);

  useEffect(() => {
    const tab = hero?.activeTab;
    if (!tab || !VALID_TABS.has(tab) || typeof window === "undefined") return;

    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }

    const url = new URL(window.location.href);
    const current = url.searchParams.get("tab");
    if (tab === "cabs") {
      if (!current) return;
      url.searchParams.delete("tab");
    } else if (current === tab) {
      return;
    } else {
      url.searchParams.set("tab", tab);
    }

    const next = `${url.pathname}${url.search}${url.hash}`;
    const now = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (now === next) return;
    window.history.replaceState(window.history.state, "", next);
  }, [hero?.activeTab]);

  return null;
}
