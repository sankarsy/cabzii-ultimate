"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHeroSearch } from "./HeroSearchContext";

/** Keeps ?tab= in sync when user switches hero category tabs. */
export default function HeroTabUrlSync() {
  const hero = useHeroSearch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const skipInitial = useRef(true);

  useEffect(() => {
    const tab = hero?.activeTab;
    if (!tab) return;

    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams?.toString() || "");
    if (params.get("tab") === tab) return;
    params.set("tab", tab);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }, [hero?.activeTab, router, searchParams]);

  return null;
}
