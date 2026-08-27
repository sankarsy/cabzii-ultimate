"use strict";

/** Last SEO landing in this browser session. Not a Google ranking score. */
const STORAGE_KEY = "cabzii_seo_attribution";
const SESSION_ID_KEY = "cabzii_seo_session";
/** Attribution window: 7 days from landing view to booking create. */
export const SEO_ATTRIBUTION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
export const SEO_ATTRIBUTION_WINDOW_LABEL = "7 days from seo_page_view to booking create";

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `s_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getSeoSessionId() {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = randomId();
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function recordSeoLanding({
  landingPage = "",
  pageType = "",
  city = "",
  service = "",
  origin = "",
  destination = "",
  route = ""
} = {}) {
  if (typeof window === "undefined") return null;
  const path = String(landingPage || window.location?.pathname || "").split("?")[0];
  if (!path.startsWith("/")) return null;
  const payload = {
    landingPage: path.slice(0, 200),
    pageType: String(pageType || "").slice(0, 40),
    city: String(city || "").slice(0, 60),
    service: String(service || "").slice(0, 60),
    origin: String(origin || "").slice(0, 60),
    destination: String(destination || "").slice(0, 60),
    route: String(route || "").slice(0, 80),
    sessionId: getSeoSessionId(),
    viewedAt: new Date().toISOString()
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* private mode */
  }
  return payload;
}

export function readSeoAttribution() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const viewed = Date.parse(parsed?.viewedAt || "");
    if (!Number.isFinite(viewed)) return null;
    if (Date.now() - viewed > SEO_ATTRIBUTION_WINDOW_MS) return null;
    if (!String(parsed.landingPage || "").startsWith("/")) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function beaconSeoEvent(eventName, extra = {}) {
  if (typeof window === "undefined" || !eventName) return;
  const attr = readSeoAttribution() || {};
  const body = JSON.stringify({
    eventName,
    landingPage: attr.landingPage || window.location.pathname,
    pageType: attr.pageType || extra.pageType || "",
    city: attr.city || extra.city || "",
    service: attr.service || extra.service || "",
    origin: attr.origin || extra.origin || "",
    destination: attr.destination || extra.destination || "",
    route: attr.route || extra.route || "",
    sessionId: attr.sessionId || getSeoSessionId(),
    viewedAt: attr.viewedAt || ""
  });
  fetch("/api/seo-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => {});
}
