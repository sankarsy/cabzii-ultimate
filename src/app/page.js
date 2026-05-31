import HomePage from "../components/HomePage";
import JsonLd from "../components/seo/JsonLd";
import { faqJsonLd, homeMetadata } from "../lib/seo";

export const metadata = homeMetadata;

export default function Page() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <HomePage />
    </>
  );
}
