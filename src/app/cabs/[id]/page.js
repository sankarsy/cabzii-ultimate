import CabDetailPage from "../../../components/CabDetailPage";
import JsonLd from "../../../components/seo/JsonLd";
import { fetchCabById } from "../../../lib/serverCatalog";
import { catalogPublicPath } from "../../../lib/catalogProduct";
import { cabDetailMetadata } from "../../../lib/metadataHelpers";
import { breadcrumbJsonLd } from "../../../lib/seo";

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
  const schema = cab
    ? [
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Cabs", path: "/cabs" },
          { name: cab.title || "Cab", path: catalogPublicPath(cab, "/cabs") }
        ]),
        jsonLd
      ]
    : null;

  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}
      <CabDetailPage cabId={id} initialCab={cab} />
    </>
  );
}
