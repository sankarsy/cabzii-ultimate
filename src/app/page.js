import MmtHomePage from "../components/mmt/MmtHomePage";
import JsonLd from "../components/seo/JsonLd";
import { breadcrumbJsonLd } from "../lib/seo";
import { buildMetadataForPath } from "../lib/seo/resolvePageSeo";
import { fetchSiteSettings } from "../lib/serverSiteSettings";
import { fetchCatalogList } from "../lib/serverCatalog";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return buildMetadataForPath("/", settings);
}

export default async function Page() {
  const initialCabs = await fetchCatalogList("cabs", 24);
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Home", path: "/" }])]} />
      <MmtHomePage initialCabs={initialCabs} />
    </>
  );
}
