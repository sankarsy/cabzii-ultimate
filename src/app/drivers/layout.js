import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import JsonLd from "../../components/seo/JsonLd";
import { driversCatalogJsonLd } from "../../lib/seo";
import { buildMetadataForPath } from "../../lib/seo/resolvePageSeo";
import { fetchSiteSettings } from "../../lib/serverSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return buildMetadataForPath("/drivers", settings);
}

export default function DriversLayout({ children }) {
  return (
    <>
      <JsonLd data={driversCatalogJsonLd()} />
      <TravelLayoutClient>{children}</TravelLayoutClient>
    </>
  );
}
