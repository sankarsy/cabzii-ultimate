"use client";

import { usePathname } from "next/navigation";
import { useSiteSettings } from "../SiteSettingsProvider";
import { resolvePageLinkGroups } from "../../lib/seo/pageLinks";
import PageHubLinks from "./PageHubLinks";

export default function RelatedSeoLinks({ page = "cabs", citySlug = "", title = "Related pages" }) {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const stored = settings?.pageSeo?.[pathname]?.pageLinks;
  const groups = resolvePageLinkGroups(stored, pathname, page, citySlug).map((group, index) =>
    index === 0 && !stored?.length ? { ...group, title } : group
  );

  if (!groups.length) return null;

  return (
    <div className="mt-10">
      <PageHubLinks groups={groups} />
    </div>
  );
}
