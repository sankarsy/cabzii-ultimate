"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** True after the homepage hero is out of the way, or immediately on other pages. */
export function usePastHero(offsetPx = 280) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [ready, setReady] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setReady(true);
      return;
    }
    const onScroll = () => setReady(window.scrollY > offsetPx);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, offsetPx]);

  return ready;
}
