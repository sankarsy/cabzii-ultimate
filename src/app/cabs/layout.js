import { buildMetadataForPath } from "../../lib/seo/resolvePageSeo";
import { cabsCatalogJsonLd } from "../../lib/seo";
import JsonLd from "../../components/seo/JsonLd";
import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { fetchSiteSettings } from "../../lib/serverSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return buildMetadataForPath("/cabs", settings);
}

export default function CabsLayout({ children }) {
  return (
    <>
      <JsonLd data={cabsCatalogJsonLd()} />
      <TravelLayoutClient>{children}</TravelLayoutClient>
    </>
  );
}
