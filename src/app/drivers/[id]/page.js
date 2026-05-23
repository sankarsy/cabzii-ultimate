import DriverDetailPage from "../../../components/DriverDetailPage";
import { fetchDriverById } from "../../../lib/serverCatalog";
import { driverDetailMetadata } from "../../../lib/metadataHelpers";

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

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      <DriverDetailPage driverId={id} initialDriver={driver} />
    </>
  );
}
