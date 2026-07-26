import { buildMetadataForPath } from "../../lib/seo/resolvePageSeo";
import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { fetchSiteSettings } from "../../lib/serverSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return buildMetadataForPath("/cabs", settings);
}

export default function CabsLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
