import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { buildMetadataForPath } from "../../lib/seo/resolvePageSeo";
import { fetchSiteSettings } from "../../lib/serverSiteSettings";
import { SITE_URL } from "../../lib/seo/constants";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  const meta = buildMetadataForPath("/drivers", settings);
  return {
    ...meta,
    alternates: { ...(meta.alternates || {}), canonical: `${SITE_URL}/call-driver` },
    robots: { index: false, follow: true }
  };
}

export default function DriversLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
