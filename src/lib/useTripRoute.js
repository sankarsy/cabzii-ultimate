"use client";

import { useEffect, useState } from "react";
import { coordsForPlaceLabel } from "./indiaCityCoords";
import { hasRouteEndpoints } from "./tripCoords";
import { tripNeedsDrop } from "./mmtTrip";
import { estimateDurationMin, estimateRoadDistanceKm } from "./openRouteService";

function enrichTripCoords(trip) {
  const next = { ...trip };
  if (!next.fromLat && next.from) {
    const hit = coordsForPlaceLabel(next.from);
    if (hit) {
      next.fromLat = hit.lat;
      next.fromLng = hit.lng;
    }
  }
  if (!next.toLat && next.to) {
    const hit = coordsForPlaceLabel(next.to);
    if (hit) {
      next.toLat = hit.lat;
      next.toLng = hit.lng;
    }
  }
  return next;
}

export function useTripRoute(trip) {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const enriched = enrichTripCoords(trip || {});
    const needsDrop = tripNeedsDrop(enriched?.tripType);

    if (!enriched?.from?.trim()) {
      setRoute(null);
      return;
    }
    if (needsDrop && !enriched?.to?.trim()) {
      setRoute(null);
      return;
    }
    if (!needsDrop) {
      setRoute(null);
      return;
    }

    if (enriched.distanceKm) {
      setRoute({
        distanceKm: enriched.distanceKm,
        durationMin: enriched.durationMin,
        fromLat: enriched.fromLat,
        fromLng: enriched.fromLng,
        toLat: enriched.toLat,
        toLng: enriched.toLng,
        geometry: null,
        cached: true
      });
      if (hasRouteEndpoints(enriched)) return;
    }

    let cancelled = false;
    const params = new URLSearchParams();
    if (hasRouteEndpoints(enriched)) {
      params.set("fromLat", String(enriched.fromLat));
      params.set("fromLng", String(enriched.fromLng));
      params.set("toLat", String(enriched.toLat));
      params.set("toLng", String(enriched.toLng));
    } else {
      params.set("from", enriched.from);
      params.set("to", enriched.to);
    }

    if (hasRouteEndpoints(enriched) && !enriched.distanceKm) {
      const distanceKm = estimateRoadDistanceKm(
        enriched.fromLat,
        enriched.fromLng,
        enriched.toLat,
        enriched.toLng
      );
      setRoute({
        fromLat: enriched.fromLat,
        fromLng: enriched.fromLng,
        toLat: enriched.toLat,
        toLng: enriched.toLng,
        distanceKm,
        durationMin: estimateDurationMin(distanceKm),
        estimated: true
      });
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

        if (hasRouteEndpoints(enriched)) {
          const distanceKm = estimateRoadDistanceKm(
            enriched.fromLat,
            enriched.fromLng,
            enriched.toLat,
            enriched.toLng
          );
          setRoute({
            fromLat: enriched.fromLat,
            fromLng: enriched.fromLng,
            toLat: enriched.toLat,
            toLng: enriched.toLng,
            distanceKm,
            durationMin: estimateDurationMin(distanceKm),
            geometry: [
              [enriched.fromLat, enriched.fromLng],
              [enriched.toLat, enriched.toLng]
            ],
            estimated: true
          });
          return;
        }

        setError(json?.error || "Route unavailable");
        setRoute(null);
      })
      .catch(() => {
        if (!cancelled) {
          if (hasRouteEndpoints(enriched)) {
            const distanceKm = estimateRoadDistanceKm(
              enriched.fromLat,
              enriched.fromLng,
              enriched.toLat,
              enriched.toLng
            );
            setRoute({
              fromLat: enriched.fromLat,
              fromLng: enriched.fromLng,
              toLat: enriched.toLat,
              toLng: enriched.toLng,
              distanceKm,
              durationMin: estimateDurationMin(distanceKm),
              estimated: true
            });
          } else {
            setError("Could not load route");
            setRoute(null);
          }
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
