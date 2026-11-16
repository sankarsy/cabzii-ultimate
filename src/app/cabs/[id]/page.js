import CabDetailPage from "../../../components/CabDetailPage";
import { fetchCabById } from "../../../lib/serverCatalog";
import { catalogPublicPath } from "../../../lib/catalogProduct";
import { getCabVehicleName } from "../../../lib/catalogDisplay";
import { buildPageMetadata } from "../../../lib/seo";
import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const id = params?.id;
  if (!id) {
    return { title: "Cab Booking", description: "Book cabs on cabzii.in." };
  }
  const cab = await fetchCabById(id);
  if (!cab) {
    return buildPageMetadata({
      title: "Cab Not Found",
      description: "This cab listing is not available on Cabzii.",
      path: `/cabs/${id}`,
      noindex: true
    });
  }
  const name = getCabVehicleName(cab);
  return buildPageMetadata({
    title: name,
    description: `Book ${name} on Cabzii. Fares shown before you confirm.`,
    path: catalogPublicPath(cab, "/cabs"),
    noindex: true
  });
}

export default async function CabDetailRoutePage({ params }) {
  const id = params?.id;
  const cab = id ? await fetchCabById(id) : null;

  return <CabDetailPage cabId={id} initialCab={cab ? JSON.parse(JSON.stringify(cab)) : null} />;
}
