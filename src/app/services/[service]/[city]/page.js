import { notFound } from "next/navigation";
import JsonLd from "../../../../components/seo/JsonLd";
import ServiceLandingPage from "../../../../components/seo/ServiceLandingPage";
import { resolveServiceForCity } from "../../../../lib/seo/cmsResolve";
import { fetchSiteReviewStats } from "../../../../lib/serverReviewStats";
import { fetchCatalogForCity } from "../../../../lib/serverCatalog";
import {
  SEO_CITIES,
  SEO_SERVICES,
  breadcrumbJsonLd,
  buildPageMetadata,
  cityBySlug,
  faqFromPairs,
  getServiceFaqs,
  servicePageJsonLd,
  servicePath,
  tunedServiceDescription,
  tunedServiceKeywords,
  tunedServiceTitle,
  classifyServiceCity
} from "../../../../lib/seo";
import { serviceSerpBadges } from "../../../../lib/seo/serpRichData";
import { resolveMediaUrl } from "../../../../lib/media";

export const revalidate = 600;

export function generateStaticParams() {
  return SEO_SERVICES.flatMap((service) =>
    SEO_CITIES.map((city) => ({
      service: service.slug,
      city: city.slug
    }))
  );
}

export async function generateMetadata({ params }) {
  const { service: serviceRow, city, cmsMeta } = await resolveServiceForCity(params.service, params.city);
  if (!serviceRow || !city) {
    return buildPageMetadata({
      title: "Service Not Found",
      description: "This cab service page is not available on Cabzii.",
      path: `/services/${params.service}/${params.city}`,
      noindex: true,
      follow: false
    });
  }

  const path = servicePath(serviceRow, city);
  const title = cmsMeta?.seoTitle || tunedServiceTitle(serviceRow, city);
  const description = cmsMeta?.seoDescription || tunedServiceDescription(serviceRow, city);
  const keywords = cmsMeta?.seo
    ? cmsMeta.seo.split(",").map((k) => k.trim()).filter(Boolean)
    : tunedServiceKeywords(serviceRow, city);

  const cmsImage = resolveMediaUrl(cmsMeta?.image || "");
  const indexPolicy = classifyServiceCity(serviceRow.slug, city.slug);
  return buildPageMetadata({
    title,
    description,
    path,
    keywords,
    noindex: !indexPolicy.indexable,
    follow: indexPolicy.follow,
    ...(cmsImage ? { image: cmsImage, imageAlt: `${serviceRow.name} in ${city.name}` } : {})
  });
}

export default async function ServiceCityPage({ params }) {
  const { service, city } = await resolveServiceForCity(params.service, params.city);
  if (!service || !city) notFound();

  const path = servicePath(service, city);
  const faqs = getServiceFaqs(service, city);
  const reviewStats = await fetchSiteReviewStats();
  const isTourPackages = service.slug === "tour-packages" || service.slug === "holiday-packages";
  const [cabs, drivers, packages] = await Promise.all([
    isTourPackages ? Promise.resolve([]) : fetchCatalogForCity("cabs", city.name, 12),
    isTourPackages ? Promise.resolve([]) : fetchCatalogForCity("drivers", city.name, 6),
    isTourPackages ? fetchCatalogForCity("packages", city.name, 8) : Promise.resolve([])
  ]);
  const serpBadges = serviceSerpBadges(service, city);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: city.name, path: `/cab-booking/${city.slug}` },
      { name: service.name, path }
    ]),
    servicePageJsonLd({
      serviceName: service.name,
      cityName: city.name,
      productName: service.seoTitle || tunedServiceTitle(service, city),
      description: service.seoDescription || tunedServiceDescription(service, city),
      urlPath: path,
      priceFrom: service.priceFrom,
      priceTo: Math.round((service.priceFrom || 999) * 3.5),
      reviewStats,
      additionalBadges: serpBadges
    }),
    faqFromPairs(faqs)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ServiceLandingPage
        city={city}
        service={service}
        faqs={faqs}
        extraBody={service.body}
        reviewStats={reviewStats}
        cabs={JSON.parse(JSON.stringify(cabs))}
        drivers={JSON.parse(JSON.stringify(drivers))}
        packages={JSON.parse(JSON.stringify(packages))}
      />
    </>
  );
}
