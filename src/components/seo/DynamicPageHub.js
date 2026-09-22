import { fetchSiteSettings } from "../../lib/serverSiteSettings";
import { resolvePageLinkGroups, normalizePageLinkGroups } from "../../lib/seo/pageLinks";
import PageHubLinks from "./PageHubLinks";

/**
 * FastTrack-style city / route / service hubs.
 * Uses admin-saved pageSeo[path].pageLinks when present; otherwise the built-in unique template.
 */
export default async function DynamicPageHub({
  fallbackPage = "cabs",
  citySlug = "",
  path = "/",
  className = "",
  bare = false,
  onlyIfStored = false
}) {
  const settings = await fetchSiteSettings();
  const stored = settings?.pageSeo?.[path]?.pageLinks;
  if (onlyIfStored && !normalizePageLinkGroups(stored).length) return null;
  const pageKind = path === "/" ? "home" : fallbackPage;
  const groups = resolvePageLinkGroups(stored, path, pageKind, citySlug);

  if (!groups.length) return null;

  if (bare) {
    return (
      <div className={className || "mt-10"}>
        <PageHubLinks groups={groups} />
      </div>
    );
  }

  return (
    <section className={className || "border-t border-slate-200 bg-slate-50 py-8 sm:py-10"}>
      <div className="section-shell">
        <PageHubLinks groups={groups} />
      </div>
    </section>
  );
}
