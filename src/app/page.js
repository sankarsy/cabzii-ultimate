import MmtHomePage from "../components/mmt/MmtHomePage";
import JsonLd from "../components/seo/JsonLd";
import SocialProofTicker from "../components/conversion/SocialProofTicker";
import TrustStrip from "../components/ui/TrustStrip";
import HomeBelowFold from "../components/home/HomeBelowFold";
import { breadcrumbJsonLd } from "../lib/seo";
import { buildMetadataForPath } from "../lib/seo/resolvePageSeo";
import { fetchSiteSettings } from "../lib/serverSiteSettings";
import { fetchCatalogList, fetchHomeCallDriverServices, fetchHomeShowcase } from "../lib/serverCatalog";
import { SAMPLE_BLOGS } from "../lib/sampleContent";
import { sortBySelectedCity } from "../lib/locationPriority";
import { DEFAULT_HQ_CITY } from "../lib/vehicleAdminConfig";
import { HOME_CABS_LIMIT, sortCabsForHome } from "../lib/homeFleetSort";

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return buildMetadataForPath("/", settings);
}

export default async function Page() {
  const [initialCabs, blogRows, offers, services, routes, callDriverServices, siteSettings] = await Promise.all([
    fetchCatalogList("cabs", 24),
    fetchCatalogList("blogs", 3),
    fetchHomeShowcase("offers"),
    fetchHomeShowcase("services"),
    fetchHomeShowcase("routes"),
    fetchHomeCallDriverServices(),
    fetchSiteSettings()
  ]);

  const cabs = sortCabsForHome(sortBySelectedCity(initialCabs, DEFAULT_HQ_CITY)).slice(0, HOME_CABS_LIMIT);
  const blogs = blogRows.length ? blogRows.slice(0, 3) : SAMPLE_BLOGS.slice(0, 3);

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Home", path: "/" }])]} />
      <MmtHomePage>
        <SocialProofTicker />
        <TrustStrip />
        <HomeBelowFold
          cabs={cabs}
          showcase={{ offers, services, routes }}
          blogs={blogs}
          callDriverServices={callDriverServices}
          siteSettings={siteSettings}
        />
      </MmtHomePage>
    </>
  );
}
