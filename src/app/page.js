import HomePage from "../components/HomePage";
import JsonLd from "../components/seo/JsonLd";
import {
  ORG_ADDRESS,
  breadcrumbJsonLd,
  faqJsonLd,
  homeMetadata,
  localBusinessJsonLd
} from "../lib/seo";

export const metadata = homeMetadata;

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
