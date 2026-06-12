import { notFound } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import TourPackageLanding from "../../../components/tour/TourPackageLanding";
import { fetchCatalogList, fetchPackageById } from "../../../lib/serverCatalog";
import { buildPageMetadata } from "../../../lib/seo/constants";
import { breadcrumbJsonLd, faqFromPairs } from "../../../lib/seo";
import { productJsonLd } from "../../../lib/seo/schema";
import { resolveMediaUrl } from "../../../lib/media";

export const revalidate = 600;

function packageMeta(pkg, slug) {
  if (!pkg) {
    return buildPageMetadata({
      title: "Tour Package Not Found",
      description: "This tour package is not available on cabzii.in.",
      path: `/tour-packages/${slug}`,
      noindex: true
    });
  }
  const durationLabel =
    pkg.days > 0 ? `${pkg.days} Days${pkg.nights > 0 ? ` ${pkg.nights} Nights` : ""}` : pkg.duration;
  const title = pkg.seoTitle || `${pkg.name}${durationLabel ? ` — ${durationLabel}` : ""} | Book from ₹${Number(pkg.price || 0).toLocaleString("en-IN")}`;
  const description =
    pkg.seoDescription ||
    pkg.description?.slice(0, 158) ||
    `Book ${pkg.name} tour package with verified cabs and drivers on cabzii.in. ${durationLabel || ""} from ₹${Number(pkg.price || 0).toLocaleString("en-IN")}.`;
  const keywords = (pkg.seo || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  return buildPageMetadata({
    title,
    description,
    path: `/tour-packages/${pkg.slug || slug}`,
    keywords: keywords.length ? keywords : undefined,
    image: resolveMediaUrl(pkg.image) || undefined
  });
}

export async function generateMetadata({ params }) {
  const pkg = await fetchPackageById(params.slug);
  return packageMeta(pkg, params.slug);
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

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Tour Packages", path: "/holidays" },
      { name: pkg.name, path }
    ]),
    productJsonLd({
      name: pkg.name,
      description: pkg.seoDescription || pkg.description?.slice(0, 200) || `${pkg.name} tour package on cabzii.in`,
      urlPath: path,
      image: resolveMediaUrl(pkg.image) || undefined,
      price: pkg.price,
      ...(Number(pkg.originalPrice) > Number(pkg.price)
        ? { lowPrice: pkg.price, highPrice: pkg.originalPrice }
        : {}),
      category: "Tour Package · Holiday"
    }),
    ...(faqPairs.length ? [faqFromPairs(faqPairs)] : [])
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <TourPackageLanding pkg={pkg} related={related} />
    </>
  );
}
