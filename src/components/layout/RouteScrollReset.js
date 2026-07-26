"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Reset scroll when navigating between pages (fixes mobile bleed from homepage hero). */
export default function RouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);

  return null;
}
