"use client";

const SENSITIVE = /phone|mobile|email|token|password|otp|jwt/i;
export const COOKIE_CONSENT_KEY = "cabzii_cookie_consent";
const ATTR_KEY = "cabzii_attribution";
const ATTR_MAX_AGE = 60 * 60 * 24 * 90;

const ATTR_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid"
];

const EVENT_ALIASES = {
  whatsapp_clicked: ["whatsapp_click"],
  whatsapp_quote_clicked: ["whatsapp_click", "quote_request"],
  quote_request_submitted: ["quote_request"],
  call_clicked: ["phone_click"],
  booking_started: ["booking_start"],
  booking_completed: ["booking_complete"]
};

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

function readJsonStorage(read) {
  try {
    const raw = read();
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readCookie(name) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  if (!match) return "";
  try {
    return decodeURIComponent(match.slice(name.length + 1));
  } catch {
    return "";
  }
}

function storedAttribution() {
  if (typeof window === "undefined") return {};
  const fromSession = readJsonStorage(() => sessionStorage.getItem(ATTR_KEY));
  if (Object.keys(fromSession).length) return fromSession;
  return readJsonStorage(() => readCookie(ATTR_KEY));
}

function writeAttribution(payload) {
  const json = JSON.stringify(payload);
  try {
    sessionStorage.setItem(ATTR_KEY, json);
  } catch {
    /* private mode */
  }
  try {
    document.cookie = `${ATTR_KEY}=${encodeURIComponent(json)}; path=/; max-age=${ATTR_MAX_AGE}; SameSite=Lax`;
  } catch {
    /* cookie blocked */
  }
}

/** Persist first-touch UTM / gclid for the session and 90 days. */
export function captureAttribution() {
  if (typeof window === "undefined") return storedAttribution();
  const q = new URLSearchParams(window.location.search);
  const next = {};
  ATTR_FIELDS.forEach((key) => {
    const value = q.get(key);
    if (value) next[key] = value;
  });
  if (!Object.keys(next).length) return storedAttribution();
  const merged = {
    ...storedAttribution(),
    ...next,
    landing_path: window.location.pathname,
    captured_at: Date.now()
  };
  writeAttribution(merged);
  return merged;
}

export function getStoredAttribution() {
  return storedAttribution();
}

export function hasMarketingConsent() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

/** Fire a named event if GTM/GA4 is present. No-ops when analytics is not installed. */
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || !name) return;
  const payload = sanitizeParams(params);
  const names = [name, ...(EVENT_ALIASES[name] || [])];
  try {
    window.dataLayer = window.dataLayer || [];
    names.forEach((event) => {
      window.dataLayer.push({ event, ...payload });
      if (typeof window.gtag === "function") {
        window.gtag("event", event, payload);
      }
    });
  } catch {
    /* analytics must never break booking */
  }
}

/** Canonical lead events for WhatsApp / phone / quote CTAs. */
export function trackLead(kind, params = {}) {
  if (kind === "whatsapp") {
    trackEvent("whatsapp_clicked", params);
    trackEvent("quote_request", params);
    return;
  }
  if (kind === "phone") {
    trackEvent("call_clicked", params);
    return;
  }
  if (kind === "quote") {
    trackEvent("quote_request", params);
  }
}

export function utmFromSearch(search = "") {
  const q =
    typeof search === "string"
      ? new URLSearchParams(search.startsWith("?") ? search : `?${search}`)
      : search;
  const live = {};
  if (q && typeof q.get === "function") {
    ATTR_FIELDS.forEach((key) => {
      live[key] = q.get(key) || "";
    });
  }
  const stored = storedAttribution();
  return {
    utm_source: live.utm_source || stored.utm_source || "",
    utm_medium: live.utm_medium || stored.utm_medium || "",
    utm_campaign: live.utm_campaign || stored.utm_campaign || "",
    utm_term: live.utm_term || stored.utm_term || "",
    utm_content: live.utm_content || stored.utm_content || "",
    gclid: live.gclid || stored.gclid || ""
  };
}
