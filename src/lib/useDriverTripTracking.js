"use client";

import { useEffect, useRef, useState } from "react";
import { authHeaders } from "./auth";
import { isOnTrip } from "./driverUi";

export const PING_INTERVAL_MS = 20 * 1000;
const STALE_AFTER_MS = 45 * 1000;

function payloadFromPosition(position) {
  const coords = position?.coords;
  if (!coords) return null;
  if (!Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) return null;
  const body = {
    latitude: coords.latitude,
    longitude: coords.longitude
  };
  if (Number.isFinite(coords.accuracy) && coords.accuracy >= 0) body.accuracy = coords.accuracy;
  if (Number.isFinite(coords.heading)) body.heading = coords.heading;
  if (Number.isFinite(coords.speed) && coords.speed >= 0) body.speed = coords.speed;
  return body;
}

export function trackingStatusLabel(state) {
  switch (state) {
    case "starting":
      return "Tracking STARTING";
    case "active":
      return "Tracking ACTIVE";
    case "stale":
      return "Tracking STALE";
    case "stopped":
      return "Tracking STOPPED";
    case "denied":
      return "Location permission denied";
    default:
      return "Tracking OFF";
  }
}

export default function useDriverTripTracking(trip) {
  const tripId = trip?._id;
  const active = isOnTrip(trip);
  const [state, setState] = useState("off");
  const [error, setError] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);
  const deniedRef = useRef(false);
  const watchRef = useRef(null);
  const intervalRef = useRef(null);
  const staleRef = useRef(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    const stopTimers = () => {
      if (watchRef.current != null && navigator.geolocation?.clearWatch) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (staleRef.current) {
        clearInterval(staleRef.current);
        staleRef.current = null;
      }
    };

    if (!active || !tripId) {
      stopTimers();
      setState(trip?.tripFinishedAt || trip?.status === "finished" || trip?.status === "cancelled" ? "stopped" : "off");
      setError("");
      return undefined;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState("denied");
      setError("This device cannot share location.");
      return undefined;
    }

    let cancelled = false;
    deniedRef.current = false;
    setState("starting");
    setError("");

    staleRef.current = setInterval(() => {
      if (lastSentRef.current && Date.now() - lastSentRef.current > STALE_AFTER_MS) {
        setState((s) => (s === "denied" ? s : "stale"));
      }
    }, 5000);

    const send = async (position) => {
      const body = payloadFromPosition(position);
      if (!body || cancelled || deniedRef.current) return;
      try {
        const res = await fetch(`/api/driver/trips/${tripId}/location`, {
          method: "POST",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          if (res.status === 400 || res.status === 409) {
            setState("stopped");
            setError(json?.message || "Tracking stopped.");
            stopTimers();
            return;
          }
          setState((s) => (s === "denied" ? s : "stale"));
          return;
        }
        if (!cancelled) {
          lastSentRef.current = Date.now();
          setState("active");
          setError("");
        }
      } catch {
        if (!cancelled) setState((s) => (s === "denied" ? s : "stale"));
      }
    };

    const onError = (err) => {
      if (cancelled) return;
      if (err?.code === 1) {
        deniedRef.current = true;
        setState("denied");
        setError("Location permission is required to share this trip. Enable it in the browser, then tap Enable location.");
        stopTimers();
        return;
      }
      setState((s) => (s === "denied" ? s : "stale"));
    };

    const requestPosition = () => {
      if (cancelled || deniedRef.current) return;
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      navigator.geolocation.getCurrentPosition(send, onError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 15000
      });
    };

    const startWatching = () => {
      if (cancelled || deniedRef.current) return;
      requestPosition();
      if (watchRef.current == null) {
        watchRef.current = navigator.geolocation.watchPosition(send, onError, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 15000
        });
      }
      if (!intervalRef.current) {
        intervalRef.current = setInterval(requestPosition, PING_INTERVAL_MS);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (watchRef.current != null && navigator.geolocation?.clearWatch) {
          navigator.geolocation.clearWatch(watchRef.current);
          watchRef.current = null;
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setState((s) => (s === "denied" ? s : "stale"));
        return;
      }
      if (!deniedRef.current) startWatching();
    };

    startWatching();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      stopTimers();
    };
  }, [active, tripId, trip?.tripFinishedAt, trip?.status, retryNonce]);

  const retry = () => {
    deniedRef.current = false;
    setError("");
    setRetryNonce((n) => n + 1);
  };

  return { state, error, retry, active };
}
