"use client";

import { useEffect, useRef, useState } from "react";
import { authHeaders } from "./auth";
import { LOCATION_POLL_MS, locationErrorMessage } from "./customerTrackingUi";

export default function useBookingLocation(bookingId, { headers, enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [statusCode, setStatusCode] = useState(null);
  const [loading, setLoading] = useState(Boolean(bookingId && enabled));
  const headersRef = useRef(headers);

  useEffect(() => {
    headersRef.current = headers;
  }, [headers]);

  useEffect(() => {
    if (!bookingId || !enabled) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    let timeoutId = 0;
    let controller = null;

    const stopTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = 0;
      }
    };

    const tick = async () => {
      controller?.abort();
      controller = new AbortController();
      const abortTimer = setTimeout(() => controller.abort(), 12000);
      try {
        const requestHeaders = headersRef.current || authHeaders();
        const res = await fetch(`/api/bookings/${bookingId}/location`, {
          headers: requestHeaders,
          cache: "no-store",
          signal: controller.signal
        });
        const json = await res.json().catch(() => ({}));
        if (cancelled) return { stop: true };
        if (!res.ok) {
          setStatusCode(res.status);
          setError(locationErrorMessage(res.status));
          setLoading(false);
          return { stop: res.status === 401 || res.status === 403 || res.status === 404 || res.status === 400 };
        }
        setData(json?.data || null);
        setError("");
        setStatusCode(res.status);
        setLoading(false);
        if (json?.data?.poll === false) return { stop: true };
        return { stop: false };
      } catch (err) {
        if (cancelled) return { stop: true };
        if (err?.name === "AbortError") {
          setError("Location is taking too long to load.");
        } else {
          setError("Could not refresh location. Check your connection.");
        }
        setLoading(false);
        return { stop: false };
      } finally {
        clearTimeout(abortTimer);
      }
    };

    const loop = async () => {
      const result = await tick();
      if (cancelled || result?.stop) return;
      timeoutId = setTimeout(loop, LOCATION_POLL_MS);
    };

    loop();

    return () => {
      cancelled = true;
      stopTimer();
      controller?.abort();
    };
  }, [bookingId, enabled]);

  return { data, error, statusCode, loading };
}
