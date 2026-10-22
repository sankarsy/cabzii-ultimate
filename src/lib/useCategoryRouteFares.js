"use client";

import { useEffect, useState } from "react";
import { categoryFareMap, shouldApplyCategoryRouteFare } from "./categoryRouteFare";

export function useCategoryRouteFares(trip) {
  const from = String(trip?.from || "").trim();
  const to = String(trip?.to || "").trim();
  const enabled = shouldApplyCategoryRouteFare(trip);
  const [fares, setFares] = useState(null);

  useEffect(() => {
    if (!enabled || !from || !to) {
      setFares(null);
      return undefined;
    }
    let cancelled = false;
    const q = new URLSearchParams({ from, to });
    fetch(`/api/route-fares?${q}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setFares(categoryFareMap(json?.data));
      })
      .catch(() => {
        if (!cancelled) setFares(null);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, from, to]);

  return fares;
}
