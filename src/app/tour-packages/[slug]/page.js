import { notFound } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import TourPackageLanding from "../../../components/tour/TourPackageLanding";
import { fetchCatalogList, fetchPackageById } from "../../../lib/serverCatalog";
import { tourPackageLandingMetadata } from "../../../lib/metadataHelpers";
import { breadcrumbJsonLd, faqFromPairs } from "../../../lib/seo";

import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;

export async function generateMetadata({ params }) {
  const pkg = await fetchPackageById(params.slug);
  return tourPackageLandingMetadata(pkg, params.slug).metadata;
}

export default async function TourPackagePage({ params }) {
  const pkg = await fetchPackageById(params.slug);
  if (!pkg || pkg.status === "inactive" || pkg.isDeleted) notFound();

  const all = await fetchCatalogList("packages", 12);
  const related = all
    .filter(
      (p) =>
        String(p._id) !== String(pkg._id) &&
        (p.category === pkg.category || p.city === pkg.city || !pkg.category)
    )
    .slice(0, 3);

  const path = `/tour-packages/${pkg.slug || params.slug}`;
  const faqPairs = (pkg.faqs || [])
    .filter((f) => f.question && f.answer)
    .map((f) => [f.question, f.answer]);

  const { jsonLd: tourLd } = tourPackageLandingMetadata(pkg, params.slug);

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Tour Packages", path: "/holidays" },
      { name: pkg.name, path }
    ]),
    ...(tourLd ? [tourLd] : []),
    ...(faqPairs.length ? [faqFromPairs(faqPairs)] : [])
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <TourPackageLanding pkg={pkg} related={related} />
    </>
  );
}
