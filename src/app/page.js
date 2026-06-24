import HomePage from "../components/HomePage";
import JsonLd from "../components/seo/JsonLd";
import {
  ORG_ADDRESS,
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd
} from "../lib/seo";
import { buildMetadataForPath } from "../lib/seo/resolvePageSeo";
import { fetchSiteSettings } from "../lib/serverSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return buildMetadataForPath("/", settings);
}

const homeStructuredData = [
  breadcrumbJsonLd([{ name: "Home", path: "/" }]),
  localBusinessJsonLd("Chennai", ORG_ADDRESS.addressRegion, "/"),
  faqJsonLd()
];

export default function Page() {
  return (
    <>
      <JsonLd data={homeStructuredData} />
      <HomePage />
    </>
  );
}
