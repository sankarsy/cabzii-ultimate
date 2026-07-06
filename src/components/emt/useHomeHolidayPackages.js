"use client";

import { useEffect, useState } from "react";

/** Prefetch packages for destination tiles */
export function useHomeHolidayPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/packages?limit=100&page=1", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setPackages(Array.isArray(json?.data) ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setPackages([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { packages, loading };
}
