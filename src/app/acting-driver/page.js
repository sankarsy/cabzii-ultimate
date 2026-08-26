import JsonLd from "../../components/seo/JsonLd";
import ActingDriverHubSeo from "../../components/seo/ActingDriverHubSeo";
import { breadcrumbJsonLd, buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Acting Driver — Chauffeur on Hire for Your Car | Cabzii",
  description:
    "Acting driver service on Cabzii — book a chauffeur for your own car by city. Hourly, daily and outstation packages. Cabzii assigns a driver after you book.",
  path: "/acting-driver",
  keywords: ["acting driver", "call driver", "chauffeur on hire", "driver for own car", "cabzii"]
});

export default function ActingDriverIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Call Driver", path: "/call-driver" },
          { name: "Acting driver", path: "/acting-driver" }
        ])}
      />
      <ActingDriverHubSeo />
    </>
  );
}
