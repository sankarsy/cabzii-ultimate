import { getBackendUrl } from "./seo";
import { DEFAULT_SITE_SETTINGS } from "./siteSettingsDefaults";

export async function fetchSiteSettings() {
  const backend = getBackendUrl();
  try {
    const res = await fetch(`${backend}/api/v1/site-settings`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return DEFAULT_SITE_SETTINGS;
    const json = await res.json();
    return json?.data || DEFAULT_SITE_SETTINGS;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
