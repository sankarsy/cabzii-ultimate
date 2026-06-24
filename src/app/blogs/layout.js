import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { buildMetadataForPath } from "../../lib/seo/resolvePageSeo";
import { fetchSiteSettings } from "../../lib/serverSiteSettings";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return buildMetadataForPath("/blogs", settings);
}

export default function BlogsLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
