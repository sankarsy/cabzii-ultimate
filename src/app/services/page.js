import JsonLd from "../../components/seo/JsonLd";
import ServicesHubSeo from "../../components/seo/ServicesHubSeo";
import { breadcrumbJsonLd, buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Cab & Driver Services by City | Cabzii",
  description:
    "Cab rental, car rental, airport taxi, outstation, one-way and chauffeur services on Cabzii — open the city you travel from.",
  path: "/services",
  keywords: ["cab rental", "airport taxi", "outstation cab", "car rental", "cabzii services"]
});

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <ServicesHubSeo />
    </>
  );
}
