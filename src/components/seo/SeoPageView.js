"use client";

import { useEffect } from "react";
import { trackEvent } from "../../lib/analytics";

/**
 * Fire seo_page_view once per landing so GTM/GA4 can join
 * SEO landings → booking_started → booking_completed.
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
    trackEvent("seo_page_view", {
      pageType,
      city,
      service,
      origin,
      destination,
      route
    });
  }, [pageType, city, service, origin, destination, route]);

  return null;
}
