import JsonLd from "../../components/seo/JsonLd";
import CityCabLandingPage from "../../components/city-cabs/CityCabLandingPage";
import { getCityCabData } from "../../data/city-cabs";
import { cabsCatalogJsonLd } from "../../lib/seo";
import { fetchCabsForTrip, fetchCatalogList } from "../../lib/serverCatalog";

export default async function CabsPage() {
  const data = getCityCabData("chennai");
  const [cabs, testimonialRows] = await Promise.all([
    data ? fetchCabsForTrip(data.bookingTrip, 100) : Promise.resolve([]),
    fetchCatalogList("testimonials", 8)
  ]);
  const quotes = (Array.isArray(testimonialRows) ? testimonialRows : [])
    .filter((row) => row && !row.sampleReview && String(row.message || "").trim())
    .slice(0, 2);

  return (
    <>
      <JsonLd data={cabsCatalogJsonLd()} />
      {data ? (
        <CityCabLandingPage
          data={{ ...data, path: "/cabs" }}
          cabs={JSON.parse(JSON.stringify(cabs || []))}
          quotes={JSON.parse(JSON.stringify(quotes || []))}
        />
      ) : null}
    </>
  );
}
