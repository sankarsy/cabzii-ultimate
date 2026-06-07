import { getBackendUrl } from "./seo";
import { DEFAULT_SITE_SETTINGS } from "./siteSettingsDefaults";
import { fetchSeoMenuLinks } from "./serverCatalog";

export async function fetchSiteSettings() {
  const backend = getBackendUrl();
  try {
    const [settingsRes, seoMenuLinks] = await Promise.all([
      fetch(`${backend}/api/v1/site-settings`, { next: { revalidate: 60 } }),
      fetchSeoMenuLinks()
    ]);
    if (!settingsRes.ok) {
      return { ...DEFAULT_SITE_SETTINGS, seoMenuLinks };
    }
    const json = await settingsRes.json();
    return { ...(json?.data || DEFAULT_SITE_SETTINGS), seoMenuLinks };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
