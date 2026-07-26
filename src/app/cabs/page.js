import JsonLd from "../../components/seo/JsonLd";
import CabsBrowsePage from "../../components/mmt/CabsBrowsePage";
import { cabsCatalogJsonLd } from "../../lib/seo";

export default function CabsPage() {
  return (
    <>
      <JsonLd data={cabsCatalogJsonLd()} />
      <CabsBrowsePage />
    </>
  );
}
