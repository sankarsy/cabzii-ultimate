import TourBookingPage from "../../components/TourBookingPage";
import { packageDetailMetadata } from "../../lib/metadataHelpers";
import { fetchPackageById } from "../../lib/serverCatalog";

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  if (!id) {
    return {
      title: "Tour Package Booking",
      description: "Book tour packages with transparent per-person pricing on cabzii.in."
    };
  }
  const pkg = await fetchPackageById(id);
  return packageDetailMetadata(pkg, id).metadata;
}

export default async function TourBookingRoutePage({ searchParams }) {
  const id = searchParams?.id;
  const pkg = id ? await fetchPackageById(id) : null;
  const { jsonLd } = id && pkg ? packageDetailMetadata(pkg, id) : { jsonLd: null };

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      <TourBookingPage searchParams={searchParams} initialPackage={pkg} />
    </>
  );
}
