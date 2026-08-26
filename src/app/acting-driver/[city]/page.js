import { notFound } from "next/navigation";
import CitySeoPage from "../../../components/CitySeoPage";
import JsonLd from "../../../components/seo/JsonLd";
import {
  SEO_CITIES,
  breadcrumbJsonLd,
  buildPageMetadata,
  cityBySlug,
  cityGeo,
  cityDriverSearchJsonLd,
  faqFromPairs,
  getCityFaqs,
  localBusinessJsonLd,
  tunedActingDriverDescription,
  tunedActingDriverTitle,
  tunedActingDriverKeywords
} from "../../../lib/seo";

import { fetchSeoCityPage } from "../../../lib/serverCatalog";
import { getCityLandingBody } from "../../../lib/seo/landingContent";
import { resolveMediaUrl } from "../../../lib/media";

export const revalidate = 600;

export function generateStaticParams() {
  return SEO_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (!city) {
    return buildPageMetadata({
      title: "Acting Driver",
      description: "Acting driver hire on Cabzii.",
      path: `/acting-driver/${params.city}`,
      noindex: true
    });
  }
  const path = `/acting-driver/${city.slug}`;
  const cms = await fetchSeoCityPage("acting-driver", city.slug);
  const keywords = cms?.seo
    ? cms.seo.split(",").map((k) => k.trim()).filter(Boolean)
    : tunedActingDriverKeywords(city);
  const cmsImage = resolveMediaUrl(cms?.image || cms?.banner || "");
  return buildPageMetadata({
    title: cms?.seoTitle || tunedActingDriverTitle(city),
    description: cms?.seoDescription || tunedActingDriverDescription(city),
    path,
    keywords,
    ...(cmsImage ? { image: cmsImage, imageAlt: `Acting driver in ${city.name}` } : {})
  });
}

export default async function ActingDriverCityPage({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();

  const path = `/acting-driver/${city.slug}`;
  const cms = await fetchSeoCityPage("acting-driver", city.slug);
  const title = cms?.seoTitle || tunedActingDriverTitle(city);
  const description = cms?.seoDescription || tunedActingDriverDescription(city);
  const faqs = getCityFaqs(city, "driver");
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Call Driver", path: "/call-driver" },
      { name: `Acting driver ${city.name}`, path }
    ]),
    cityDriverSearchJsonLd(city, {
      productName: title,
      description,
      urlPath: path
    }),
    localBusinessJsonLd(city.name, city.state, path, cityGeo(city.slug)),
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
