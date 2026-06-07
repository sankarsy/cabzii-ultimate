import { Suspense } from "react";
import DriverDetailPage from "../../../components/DriverDetailPage";
import JsonLd from "../../../components/seo/JsonLd";
import { fetchDriverById } from "../../../lib/serverCatalog";
import { catalogPublicPath } from "../../../lib/catalogProduct";
import { driverDetailMetadata } from "../../../lib/metadataHelpers";
import { breadcrumbJsonLd } from "../../../lib/seo";

export async function generateMetadata({ params }) {
  const id = params?.id;
  if (!id) {
    return driverDetailMetadata(null, "").metadata ?? { title: "Driver Booking" };
  }
  const driver = await fetchDriverById(id);
  return driverDetailMetadata(driver, id).metadata;
}

export default async function DriverDetailRoutePage({ params }) {
  const id = params?.id;
  const driver = id ? await fetchDriverById(id) : null;
  const { jsonLd } = driver ? driverDetailMetadata(driver, id) : { jsonLd: null };
  const schema = driver
    ? [
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Drivers", path: "/drivers" },
          { name: driver.name || "Driver", path: catalogPublicPath(driver, "/drivers") }
        ]),
        jsonLd
      ]
    : null;

  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}
      <Suspense
        fallback={
          <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-slate-600">Loading driver…</div>
        }
      >
        <DriverDetailPage driverId={id} initialDriver={driver} />
      </Suspense>
    </>
  );
}
