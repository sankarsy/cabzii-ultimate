import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { buildMetadataForPath } from "../../lib/seo/resolvePageSeo";
import { fetchSiteSettings } from "../../lib/serverSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return buildMetadataForPath("/drivers", settings);
}

export default function DriversLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
