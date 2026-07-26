"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cabzii_vehicle_wishlist";

function readStore() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function useVehicleWishlist() {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    setIds(readStore());
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setIds(readStore());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next) => {
    setIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("cabzii-wishlist-change"));
  }, []);

  const toggle = useCallback(
    (id) => {
      const key = String(id);
      persist(ids.includes(key) ? ids.filter((x) => x !== key) : [...ids, key]);
    },
    [ids, persist]
  );

  const isWishlisted = useCallback((id) => ids.includes(String(id)), [ids]);

  return { ids, toggle, isWishlisted, count: ids.length };
}
