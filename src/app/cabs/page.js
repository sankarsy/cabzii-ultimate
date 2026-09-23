import JsonLd from "../../components/seo/JsonLd";
import CabsBrowsePage from "../../components/mmt/CabsBrowsePage";
import PopularFleetSeo from "../../components/seo/PopularFleetSeo";
import CabsCategorySeo from "../../components/seo/CabsCategorySeo";
import RelatedSeoLinks from "../../components/seo/RelatedSeoLinks";
import { cabsCatalogJsonLd } from "../../lib/seo";
import { fetchSiteSettings } from "../../lib/serverSiteSettings";

export default async function CabsPage() {
  const settings = await fetchSiteSettings();
  const stored = settings?.pageSeo?.["/cabs"] || {};
  return (
    <>
      <JsonLd data={cabsCatalogJsonLd()} />
      <CabsBrowsePage
        heading={stored.h1 || stored.productName || ""}
        intro={stored.intro || ""}
        extraBody={stored.html || ""}
      />
      <div className="section-shell space-y-8 pb-10">
        <PopularFleetSeo cityName="Chennai" citySlug="chennai" />
        <RelatedSeoLinks page="cabs" />
      </div>
      <CabsCategorySeo />
    </>
  );
}
