import { notFound } from "next/navigation";
import CitySeoPage from "../../../components/CitySeoPage";
import JsonLd from "../../../components/seo/JsonLd";
import {
  MAIN_PAGE_CITY_SLUGS,
  breadcrumbJsonLd,
  buildPageMetadata,
  cityBySlug,
  cityGeo,
  actingDriverServiceJsonLd,
  faqFromPairs,
  getCityFaqs,
  localBusinessJsonLd,
  tunedActingDriverDescription,
  tunedActingDriverTitle,
  tunedActingDriverKeywords,
  classifyCityHub
} from "../../../lib/seo";

import { fetchSeoCityPage } from "../../../lib/serverCatalog";
import { getCityLandingBody } from "../../../lib/seo/landingContent";
import { resolveMediaUrl } from "../../../lib/media";

import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return MAIN_PAGE_CITY_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (!city) {
    return buildPageMetadata({
      title: "Acting Driver",
      description: "Acting driver hire on Cabzii.",
      path: `/acting-driver/${params.city}`,
      noindex: true,
      follow: false
    });
  }
  const path = `/acting-driver/${city.slug}`;
  const cms = await fetchSeoCityPage("acting-driver", city.slug);
  const keywords = cms?.seo
    ? cms.seo.split(",").map((k) => k.trim()).filter(Boolean)
    : tunedActingDriverKeywords(city);
  const cmsImage = resolveMediaUrl(cms?.image || cms?.banner || "");
  const indexPolicy = classifyCityHub(city.slug, "acting-driver");
  return buildPageMetadata({
    title: cms?.seoTitle || tunedActingDriverTitle(city),
    description: cms?.seoDescription || tunedActingDriverDescription(city),
    path,
    keywords,
    noindex: !indexPolicy.indexable,
    follow: indexPolicy.follow,
    ...(cmsImage ? { image: cmsImage, imageAlt: `Acting driver in ${city.name}` } : {})
  });
}

export default async function ActingDriverCityPage({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();

  const path = `/acting-driver/${city.slug}`;
  const cms = await fetchSeoCityPage("acting-driver", city.slug);
  const description = cms?.seoDescription || tunedActingDriverDescription(city);
  const faqs = getCityFaqs(city, "driver");
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Acting driver", path: "/acting-driver" },
      { name: `Acting Driver in ${city.name}`, path }
    ]),
    actingDriverServiceJsonLd(city, { description, urlPath: path }),
    ...(city.slug === "chennai" ? [localBusinessJsonLd(city.name, city.state, path, cityGeo(city.slug))] : []),
    faqFromPairs(faqs)
  ];

  const extraBody = (() => {
    const generated = getCityLandingBody(city, "driver") || "";
    const cmsBody = typeof cms?.body === "string" ? cms.body.trim() : "";
    if (city.slug === "vellore") return cmsBody;
    if (cmsBody.length > 400) return cmsBody;
    if (cmsBody && generated) return `${cmsBody}${generated}`;
    return cmsBody || generated;
  })();

  return (
    <>
      <JsonLd data={jsonLd} />
      <CitySeoPage city={city} variant="driver" extraBody={extraBody} headingOverride={cms?.h1 || ""} />
    </>
  );
}
