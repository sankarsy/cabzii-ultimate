import JsonLd from "../../components/seo/JsonLd";
import CabsBrowsePage from "../../components/mmt/CabsBrowsePage";
import PopularFleetSeo from "../../components/seo/PopularFleetSeo";
import CabsCategorySeo from "../../components/seo/CabsCategorySeo";
import { cabsCatalogJsonLd } from "../../lib/seo";

export default function CabsPage() {
  return (
    <>
      <JsonLd data={cabsCatalogJsonLd()} />
      <div className="section-shell pt-4">
        <PopularFleetSeo cityName="Chennai" citySlug="chennai" />
      </div>
      <CabsBrowsePage />
      <CabsCategorySeo />
    </>
  );
}
