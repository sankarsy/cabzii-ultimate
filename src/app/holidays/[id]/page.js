import { notFound } from "next/navigation";
import TourBookingPage from "../../../components/TourBookingPage";
import JsonLd from "../../../components/seo/JsonLd";
import { packageDetailMetadata } from "../../../lib/metadataHelpers";
import { fetchPackageById } from "../../../lib/serverCatalog";

export async function generateMetadata({ params }) {
  const pkg = await fetchPackageById(params.id);
  return packageDetailMetadata(pkg, params.id).metadata;
}

export default async function HolidayDetailPage({ params }) {
  const pkg = await fetchPackageById(params.id);
  if (!pkg) notFound();

  const { jsonLd } = packageDetailMetadata(pkg, params.id);
  const searchParams = { id: params.id };

  return (
    <>
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
      <TourBookingPage searchParams={searchParams} initialPackage={pkg} />
    </>
  );
}
