"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_SITE_SETTINGS } from "../lib/siteSettingsDefaults";

const SiteSettingsContext = createContext(DEFAULT_SITE_SETTINGS);

export default function SiteSettingsProvider({ initialSettings, children }) {
  const value = useMemo(() => initialSettings || DEFAULT_SITE_SETTINGS, [initialSettings]);
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
