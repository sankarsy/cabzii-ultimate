import JsonLd from "../../components/seo/JsonLd";
import ActingDriverHubSeo from "../../components/seo/ActingDriverHubSeo";
import { breadcrumbJsonLd, buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Acting Driver | Hire a Driver for Your Own Car | Cabzii",
  description:
    "Acting driver and call driver service on Cabzii — a professional chauffeur for your own car. Hourly, daily, airport and outstation packages. Book Call Driver after you pick a city.",
  path: "/acting-driver",
  keywords: ["acting driver", "call driver", "driver on hire", "driver for own car", "cabzii"]
});

export default function ActingDriverIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Acting driver", path: "/acting-driver" }
        ])}
      />
      <ActingDriverHubSeo />
    </>
  );
}
