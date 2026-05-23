import CabDetailPage from "../../../components/CabDetailPage";
import { fetchCabById } from "../../../lib/serverCatalog";
import { cabDetailMetadata } from "../../../lib/metadataHelpers";

export async function generateMetadata({ params }) {
  const id = params?.id;
  if (!id) {
    return { title: "Cab Booking", description: "Book cabs on cabzii.in." };
  }
  const cab = await fetchCabById(id);
  return cabDetailMetadata(cab, id).metadata;
}

export default async function CabDetailRoutePage({ params }) {
  const id = params?.id;
  const cab = id ? await fetchCabById(id) : null;
  const { jsonLd } = cab ? cabDetailMetadata(cab, id) : { jsonLd: null };

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      <CabDetailPage cabId={id} initialCab={cab} />
    </>
  );
}
