import JsonLd from "../../components/seo/JsonLd";
import DriversBrowsePage from "../../components/mmt/DriversBrowsePage";
import { driversCatalogJsonLd } from "../../lib/seo";

export default function DriversPage() {
  return (
    <>
      <JsonLd data={driversCatalogJsonLd()} />
      <DriversBrowsePage />
    </>
  );
}
