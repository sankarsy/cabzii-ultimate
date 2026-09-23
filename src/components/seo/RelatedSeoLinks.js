"use client";

import { usePathname } from "next/navigation";
import { useSiteSettings } from "../SiteSettingsProvider";
import { normalizePageLinkGroups } from "../../lib/seo/pageLinksCore";
import PageHubLinks from "./PageHubLinks";

const FALLBACK_LINKS = [
  { label: "Book a cab", href: "/cabs", hint: "", children: [] },
  { label: "Airport taxi Chennai", href: "/services/airport-taxi/chennai", hint: "", children: [] },
  { label: "Call Driver", href: "/call-driver", hint: "", children: [] },
  { label: "Holiday packages", href: "/holidays", hint: "", children: [] },
  { label: "All routes", href: "/routes", hint: "", children: [] }
];

export default function RelatedSeoLinks({ title = "Related pages" }) {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const stored = normalizePageLinkGroups(settings?.pageSeo?.[pathname]?.pageLinks);
  const groups = stored.length
    ? stored
    : [
        {
          id: "related",
          title,
          intro: "",
          layout: "pills",
          links: FALLBACK_LINKS
        }
      ];

  return (
    <div className="mt-10">
      <PageHubLinks groups={groups} />
    </div>
  );
}
