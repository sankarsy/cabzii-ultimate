"use client";

import { useEffect } from "react";
import { trackEvent } from "../../lib/analytics";
import { beaconSeoEvent, recordSeoLanding } from "../../lib/seoAttribution";

/**
 * Fire seo_page_view once per landing so GTM/GA4 can join
 * SEO landings → booking_started → booking_completed.
 * Also stores first-party attribution for bookings (7-day session window).
 */
export default function SeoPageView({
  pageType = "",
  city = "",
  service = "",
  origin = "",
  destination = "",
  route = ""
}) {
  useEffect(() => {
    const landingPage = typeof window !== "undefined" ? window.location.pathname : "";
    recordSeoLanding({ landingPage, pageType, city, service, origin, destination, route });
    trackEvent("seo_page_view", {
      pageType,
      city,
      service,
      origin,
      destination,
      route
    });
    beaconSeoEvent("seo_page_view", { pageType, city, service, origin, destination, route });
  }, [pageType, city, service, origin, destination, route]);

  return null;
}
