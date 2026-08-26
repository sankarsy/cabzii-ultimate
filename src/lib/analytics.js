"use client";

const SENSITIVE = /phone|mobile|email|token|password|otp|jwt/i;

function sanitizeParams(params = {}) {
  const out = {};
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    if (SENSITIVE.test(key)) continue;
    if (typeof value === "string" && value.length > 180) {
      out[key] = value.slice(0, 180);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/** Fire a named event if GTM/GA4 is present. No-ops when analytics is not installed. */
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || !name) return;
  const payload = sanitizeParams(params);
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...payload });
    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }
  } catch {
    /* analytics must never break booking */
  }
}

export function utmFromSearch(search = "") {
  const q = typeof search === "string" ? new URLSearchParams(search.startsWith("?") ? search : `?${search}`) : search;
  if (!q || typeof q.get !== "function") return {};
  return {
    utm_source: q.get("utm_source") || "",
    utm_medium: q.get("utm_medium") || "",
    utm_campaign: q.get("utm_campaign") || ""
  };
}
