import MmtHomePage from "../components/mmt/MmtHomePage";
import JsonLd from "../components/seo/JsonLd";
import { breadcrumbJsonLd } from "../lib/seo";
import { buildMetadataForPath } from "../lib/seo/resolvePageSeo";
import { fetchSiteSettings } from "../lib/serverSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return buildMetadataForPath("/", settings);
}

export default async function Page() {
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Home", path: "/" }])]} />
      <MmtHomePage />
    </>
  );
}
