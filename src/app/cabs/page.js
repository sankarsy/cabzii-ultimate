import JsonLd from "../../components/seo/JsonLd";
import CabsBrowsePage from "../../components/mmt/CabsBrowsePage";
import PopularFleetSeo from "../../components/seo/PopularFleetSeo";
import CabsCategorySeo from "../../components/seo/CabsCategorySeo";
import RelatedSeoLinks from "../../components/seo/RelatedSeoLinks";
import { cabsCatalogJsonLd } from "../../lib/seo";

export default function CabsPage() {
  return (
    <>
      <JsonLd data={cabsCatalogJsonLd()} />
      <CabsBrowsePage />
      <div className="section-shell space-y-8 pb-10">
        <PopularFleetSeo cityName="Chennai" citySlug="chennai" />
        <RelatedSeoLinks page="cabs" />
      </div>
      <CabsCategorySeo />
    </>
  );
}
