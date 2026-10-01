import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "../../../../components/seo/JsonLd";
import ServiceLandingPage from "../../../../components/seo/ServiceLandingPage";
import { resolveServiceForCity } from "../../../../lib/seo/cmsResolve";
import { fetchSiteReviewStats } from "../../../../lib/serverReviewStats";
import { fetchCatalogForCity } from "../../../../lib/serverCatalog";
import {
  MAIN_PAGE_CITY_SLUGS,
  MAIN_PAGE_SERVICE_SLUGS,
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
import { cityCabLandingPath, airportCabBookingPath, isAirportCabBookingCity } from "../../../../lib/cityCabPaths";
import { isPackageDoorwayService, packageDoorwayCanonicalPath } from "../../../../lib/seo/packageDoorways";

import { SEO_REVALIDATE_SECONDS } from "../../../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return MAIN_PAGE_SERVICE_SLUGS.flatMap((service) =>
    MAIN_PAGE_CITY_SLUGS.filter((city) => !(service === "airport-taxi" && isAirportCabBookingCity(city))).map((city) => ({
      service,
      city
    }))
  );
}

export async function generateMetadata({ params }) {
  if (isPackageDoorwayService(params.service)) {
    permanentRedirect(packageDoorwayCanonicalPath(params.service, params.city));
  }
  if (params.service === "airport-taxi" && isAirportCabBookingCity(params.city)) {
    permanentRedirect(airportCabBookingPath(params.city));
  }
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
  if (isPackageDoorwayService(params.service)) {
    permanentRedirect(packageDoorwayCanonicalPath(params.service, params.city));
  }
  if (params.service === "airport-taxi" && isAirportCabBookingCity(params.city)) {
    permanentRedirect(airportCabBookingPath(params.city));
  }
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
      { name: city.name, path: cityCabLandingPath(city.slug) },
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
