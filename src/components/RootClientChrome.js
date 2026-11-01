"use client";

import AnalyticsTags from "./AnalyticsTags";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import SiteChrome from "./SiteChrome";
import SiteSettingsProvider from "./SiteSettingsProvider";
import StickyBookingBar from "./StickyBookingBar";

/** One client boundary for root chrome so webpack registers these factories together. */
export default function RootClientChrome({ initialSettings, children }) {
  return (
    <SiteSettingsProvider initialSettings={initialSettings}>
      {children}
      <StickyBookingBar />
      <SiteChrome />
      <AnalyticsTags />
      <ServiceWorkerRegister />
    </SiteSettingsProvider>
  );
}
