"use client";

import { trackEvent, utmFromSearch } from "./analytics";

const SESSION_KEY = "cabzii_enquiry_id";

function digits(value) {
  return String(value || "").replace(/\D/g, "").slice(-10);
}

export function getSessionEnquiryId() {
  try {
    return sessionStorage.getItem(SESSION_KEY) || "";
  } catch {
    return "";
  }
}

export function setSessionEnquiryId(id) {
  const next = String(id || "").trim();
  if (!next || next === "ok") return;
  try {
    sessionStorage.setItem(SESSION_KEY, next);
  } catch {
    /* private mode */
  }
}

function attribution() {
  if (typeof window === "undefined") return {};
  const utm = utmFromSearch(window.location.search);
  const landingPage = `${window.location.pathname}${window.location.search}`;
  return {
    landingPage,
    sourcePage: landingPage,
    referrer: typeof document !== "undefined" ? document.referrer || "" : "",
    utmSource: utm.utm_source || "",
    utmMedium: utm.utm_medium || "",
    utmCampaign: utm.utm_campaign || ""
  };
}

let queue = Promise.resolve();

async function upsertEnquiryNow(input = {}) {
  const mobile = digits(input.mobile || input.phone);
  if (!/^[6-9]\d{9}$/.test(mobile)) return null;
  const pickup = String(input.pickup || "").trim();
  const drop = String(input.drop || "").trim();
  const sourcePage = String(input.sourcePage || "").trim();
  if (!pickup && !drop && !sourcePage && !input.tripType) return null;

  const enquiryId = getSessionEnquiryId();
  const body = {
    enquiryId,
    mobile,
    name: String(input.name || "").trim(),
    email: String(input.email || "").trim(),
    message: String(input.message || "").trim(),
    service: input.service || "cab",
    vehicleId: input.vehicleId || "",
    vehicleName: input.vehicleName || "",
    pickup,
    drop,
    travelDate: input.travelDate || input.date || "",
    pickupTime: input.pickupTime || input.time || "",
    passengerCount: input.passengerCount || "",
    estimatedFare: Number(input.estimatedFare) || 0,
    distanceKm: Number(input.distanceKm) || 0,
    tripType: input.tripType || "",
    packageLabel: input.packageLabel || "",
    source: input.source || "",
    ctaLocation: input.ctaLocation || "booking_form",
    website: "",
    ...attribution(),
    ...(input.sourcePage ? { sourcePage: input.sourcePage } : {})
  };

  const res = await fetch("/api/quote-leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) return null;
  const id = String(json?.data?.enquiryId || json?.data?.id || "");
  if (id) setSessionEnquiryId(id);
  const eventName = enquiryId ? "enquiry_updated" : "enquiry_started";
  trackEvent(eventName, {
    service: body.service,
    pickup: body.pickup,
    city: body.pickup,
    landing_page: body.landingPage,
    cta_location: body.ctaLocation
  });
  return json.data || null;
}

/**
 * Create or update the session enquiry once there is phone + location/service.
 * Never call this from an onChange handler — only from continue/submit/OTP/WhatsApp.
 */
export function upsertEnquiry(input) {
  queue = queue.then(() => upsertEnquiryNow(input)).catch(() => null);
  return queue;
}
