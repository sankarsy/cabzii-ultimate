import { notFound } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import SeoLandingPage from "../../../components/seo/SeoLandingPage";
import { breadcrumbJsonLd, buildPageMetadata, faqFromPairs } from "../../../lib/seo";
import { fetchSeoLandingBySlug } from "../../../lib/serverCatalog";
import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

function faqPairs(faqs) {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .map((row) => [row?.question, row?.answer])
    .filter(([q, a]) => String(q || "").trim() && String(a || "").trim());
}

function keywordsList(value) {
  return String(value || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }) {
  const page = await fetchSeoLandingBySlug(params.slug);
  const path = `/pages/${params.slug}`;
  if (!page || page.published === false) {
    return buildPageMetadata({
      title: "Page",
      description: "Cabzii landing page.",
      path,
      noindex: true,
      follow: false
    });
  }
  return buildPageMetadata({
    title: page.seoTitle || page.h1,
    description: page.seoDescription || page.intro || "",
    path: page.publicPath || path,
    keywords: keywordsList(page.seo)
  });
}

export default async function DynamicSeoLandingRoute({ params }) {
  const page = await fetchSeoLandingBySlug(params.slug);
  if (!page || page.published === false) notFound();

  const path = page.publicPath || `/pages/${page.slug}`;
  const faqs = faqPairs(page.faqs);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: page.h1 || "Page", path }
    ]),
    ...(faqs.length ? [faqFromPairs(faqs)] : [])
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <SeoLandingPage page={page} path={path} faqs={faqs} />
    </>
  );
}
