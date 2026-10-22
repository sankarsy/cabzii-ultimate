"use client";

import { useEffect, useState } from "react";
import { hasRouteEndpoints } from "./tripCoords";
import { tripNeedsDrop } from "./mmtTrip";

export function useTripRoute(trip) {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const next = trip || {};
    const needsDrop = tripNeedsDrop(next?.tripType);

    if (!next?.from?.trim()) {
      setRoute(null);
      setError("");
      return undefined;
    }
    if (needsDrop && !next?.to?.trim()) {
      setRoute(null);
      setError("");
      return undefined;
    }
    if (!needsDrop) {
      setRoute(null);
      setError("");
      return undefined;
    }

    if (next.distanceKm && hasRouteEndpoints(next)) {
      setRoute({
        distanceKm: next.distanceKm,
        durationMin: next.durationMin,
        fromLat: next.fromLat,
        fromLng: next.fromLng,
        toLat: next.toLat,
        toLng: next.toLng,
        geometry: null,
        cached: true
      });
      setError("");
      return undefined;
    }

    let cancelled = false;
    const params = new URLSearchParams();
    if (hasRouteEndpoints(next)) {
      params.set("fromLat", String(next.fromLat));
      params.set("fromLng", String(next.fromLng));
      params.set("toLat", String(next.toLat));
      params.set("toLng", String(next.toLng));
    } else {
      params.set("from", next.from);
      params.set("to", next.to);
    }

    setLoading(true);
    setError("");
    fetch(`/api/distance?${params}`, { cache: "no-store" })
      .then(async (r) => {
        const json = await r.json();
        if (cancelled) return;
        if (r.ok && json?.distanceKm) {
          setRoute(json);
          return;
        }
        setError(json?.error || "No driving route between these places.");
        setRoute(null);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load driving distance.");
          setRoute(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    trip?.from,
    trip?.to,
    trip?.tripType,
    trip?.fromLat,
    trip?.fromLng,
    trip?.toLat,
    trip?.toLng,
    trip?.distanceKm,
    trip?.durationMin
  ]);

  return { route, loading, error };
}
