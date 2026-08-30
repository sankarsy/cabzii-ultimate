import JsonLd from "../../components/seo/JsonLd";
import RoutesHubSeo from "../../components/seo/RoutesHubSeo";
import { breadcrumbJsonLd, buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Popular Cab Routes — One-Way & Outstation | Cabzii",
  description:
    "Book high-value cab routes such as Chennai–Tirupati, Chennai–Trichy and Bengaluru–Mysore with distance, fare context and WhatsApp support on Cabzii.",
  path: "/routes",
  keywords: ["chennai to tirupati cab", "one way cab", "outstation routes", "cabzii routes"]
});

export default function RoutesIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Routes", path: "/routes" }])} />
      <RoutesHubSeo />
    </>
  );
}
