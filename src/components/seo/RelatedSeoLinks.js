"use client";

import { usePathname } from "next/navigation";
import { useSiteSettings } from "../SiteSettingsProvider";
import { normalizePageLinkGroups } from "../../lib/seo/pageLinksCore";
import PageHubLinks from "./PageHubLinks";

const FALLBACK_LINKS = [
  { label: "Book a cab", href: "/cabs", hint: "", children: [] },
  { label: "Airport taxi Chennai", href: "/chennai/airport-cab-booking", hint: "", children: [] },
  { label: "Call Driver", href: "/call-driver", hint: "", children: [] },
  { label: "All routes", href: "/routes", hint: "", children: [] }
];

const RETIRED_HREF = /^\/(holidays|tour-packages|packages|tour-booking)(\/|$)/i;
const RETIRED_LABEL = /holiday packages?|tour packages?/i;

function isLiveRelatedLink(link) {
  if (!link) return false;
  if (RETIRED_HREF.test(String(link.href || ""))) return false;
  if (RETIRED_LABEL.test(String(link.label || ""))) return false;
  return true;
}

function stripRetiredLinks(groups) {
  return (Array.isArray(groups) ? groups : [])
    .map((group) => ({
      ...group,
      links: (group.links || [])
        .map((link) => ({
          ...link,
          children: (link.children || []).filter(isLiveRelatedLink)
        }))
        .filter(isLiveRelatedLink)
    }))
    .filter((group) => group.links.length);
}

export default function RelatedSeoLinks({ title = "Related pages" }) {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const stored = stripRetiredLinks(normalizePageLinkGroups(settings?.pageSeo?.[pathname]?.pageLinks));
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
