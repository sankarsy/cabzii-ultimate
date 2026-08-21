import CabDetailPage from "../../../components/CabDetailPage";
import JsonLd from "../../../components/seo/JsonLd";
import SerpRichBar from "../../../components/seo/SerpRichBar";
import { fetchCabById, fetchCatalogList } from "../../../lib/serverCatalog";
import { fetchSiteReviewStats } from "../../../lib/serverReviewStats";
import { catalogPublicPath } from "../../../lib/catalogProduct";
import { cabDetailMetadata } from "../../../lib/metadataHelpers";
import { breadcrumbJsonLd, faqFromPairs, getCabFaqs } from "../../../lib/seo";
import { formatSerpPrice, vehicleSerpBadges } from "../../../lib/seo/serpRichData";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const cabs = await fetchCatalogList("cabs", 100);
  return (Array.isArray(cabs) ? cabs : [])
    .filter((cab) => cab?.slug || cab?._id || cab?.id)
    .map((cab) => ({ id: String(cab.slug || cab._id || cab.id) }));
}

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
  const reviewStats = await fetchSiteReviewStats();
  const { jsonLd } = cab ? cabDetailMetadata(cab, id) : { jsonLd: null };
  // Enterprise JSON-LD already includes FAQ/breadcrumb; avoid duplicating when present
  const hasGraph = Boolean(jsonLd?.["@graph"]);
  const schema = cab
    ? hasGraph
      ? [jsonLd]
      : [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Cabs", path: "/cabs" },
            { name: cab.title || "Cab", path: catalogPublicPath(cab, "/cabs") }
          ]),
          jsonLd,
          faqFromPairs(getCabFaqs(cab))
        ]
    : null;

  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}
      {cab ? (
        <div className="section-shell pt-2 sm:pt-4">
          <SerpRichBar
            ratingValue={cab.rating || reviewStats?.ratingValue}
            reviewCount={cab.reviewCount || reviewStats?.reviewCount}
            priceLabel={formatSerpPrice(cab.price)}
            badges={vehicleSerpBadges(cab)}
          />
        </div>
      ) : null}
      <CabDetailPage cabId={id} initialCab={cab ? JSON.parse(JSON.stringify(cab)) : null} />
    </>
  );
}
