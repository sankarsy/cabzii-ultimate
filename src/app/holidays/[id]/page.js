import { notFound, redirect } from "next/navigation";
import TourBookingPage from "../../../components/TourBookingPage";
import JsonLd from "../../../components/seo/JsonLd";
import SerpRichBar from "../../../components/seo/SerpRichBar";
import { packageDetailMetadata } from "../../../lib/metadataHelpers";
import { fetchPackageById } from "../../../lib/serverCatalog";
import { fetchSiteReviewStats } from "../../../lib/serverReviewStats";
import { breadcrumbJsonLd } from "../../../lib/seo";
import { formatSerpPrice, tourPackageSerpBadges } from "../../../lib/seo/serpRichData";
import { catalogPublicPath } from "../../../lib/catalogProduct";
import { packageBookingHref } from "../../../lib/holidayHome";
import { packageDisplayPrice } from "../../../lib/tourPackagePricing";

const MONGO_ID_RE = /^[a-f0-9]{24}$/i;

export async function generateMetadata({ params }) {
  const pkg = await fetchPackageById(params.id);
  return packageDetailMetadata(pkg, params.id).metadata;
}

export default async function HolidayDetailPage({ params }) {
  const pkg = await fetchPackageById(params.id);
  if (!pkg) notFound();

  /* Pretty URL: /holidays/{mongoId} → /holidays/{slug} */
  if (MONGO_ID_RE.test(String(params.id)) && pkg.slug) {
    redirect(packageBookingHref(pkg));
  }

  const reviewStats = await fetchSiteReviewStats();
  const { jsonLd } = packageDetailMetadata(pkg, params.id);
  const path = catalogPublicPath(pkg, "/holidays");
  const schema = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Holiday packages", path: "/holidays" },
      { name: pkg.name || "Package", path }
    ]),
    jsonLd
  ].filter(Boolean);
  const searchParams = { id: pkg.slug || pkg._id || params.id };

  return (
    <>
      {schema.length ? <JsonLd data={schema} /> : null}
      <div className="section-shell pt-6">
        <SerpRichBar
          ratingValue={reviewStats?.ratingValue}
          reviewCount={reviewStats?.reviewCount}
          priceLabel={formatSerpPrice(packageDisplayPrice(pkg), { prefix: "From" })}
          badges={tourPackageSerpBadges(pkg)}
        />
      </div>
      <TourBookingPage searchParams={searchParams} initialPackage={pkg} />
    </>
  );
}
