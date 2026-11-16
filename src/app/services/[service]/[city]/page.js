import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "../../../../components/seo/JsonLd";
import ServiceLandingPage from "../../../../components/seo/ServiceLandingPage";
import OutstationCabLandingPage from "../../../../components/city-cabs/OutstationCabLandingPage";
import { resolveServiceForCity } from "../../../../lib/seo/cmsResolve";
import { fetchSiteReviewStats } from "../../../../lib/serverReviewStats";
import { fetchCabsForTrip, fetchCatalogForCity, fetchCatalogList } from "../../../../lib/serverCatalog";
import { getCityCabData } from "../../../../data/city-cabs";
import { todayStr } from "../../../../lib/mmtTrip";
import {
  MAIN_PAGE_CITY_SLUGS,
  MAIN_PAGE_SERVICE_SLUGS,
  breadcrumbJsonLd,
  buildPageMetadata,
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
import { isKeepAirportCity, resolveDroppedSeoRedirect } from "../../../../lib/seo/keepLivePages";

import { SEO_REVALIDATE_SECONDS } from "../../../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return MAIN_PAGE_SERVICE_SLUGS.flatMap((service) =>
    MAIN_PAGE_CITY_SLUGS.filter((city) => !(service === "airport-taxi" && (isAirportCabBookingCity(city) || !isKeepAirportCity(city)))).map((city) => ({
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
  const dropped = resolveDroppedSeoRedirect(`/services/${params.service}/${params.city}`);
  if (dropped) permanentRedirect(dropped);
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
  const dropped = resolveDroppedSeoRedirect(`/services/${params.service}/${params.city}`);
  if (dropped) permanentRedirect(dropped);
  const { service, city } = await resolveServiceForCity(params.service, params.city);
  if (!service || !city) notFound();

  const path = servicePath(service, city);
  const faqs = getServiceFaqs(service, city);
  const isOutstation = service.slug === "outstation-cab";
  const cityHub = isOutstation ? getCityCabData(city.slug) : null;
  const bookingTrip = isOutstation
    ? {
        tripType: "outstation",
        from: city.name,
        to: "",
        date: todayStr(),
        time: "09:00",
        roundTrip: false,
        city: city.name
      }
    : null;
  const [reviewStats, cabs, testimonialRows] = await Promise.all([
    fetchSiteReviewStats(),
    isOutstation
      ? bookingTrip.to
        ? fetchCabsForTrip(bookingTrip, 100)
        : Promise.resolve([])
      : fetchCatalogForCity("cabs", city.name, 12),
    isOutstation ? fetchCatalogList("testimonials", 8) : Promise.resolve([])
  ]);
  const quotes = (Array.isArray(testimonialRows) ? testimonialRows : [])
    .filter((row) => row && !row.sampleReview && String(row.message || "").trim())
    .slice(0, 2);
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

  if (isOutstation) {
    return (
      <>
        <JsonLd data={jsonLd} />
        <OutstationCabLandingPage
          city={city}
          service={service}
          extraBody={service.body}
          faqs={faqs}
          cabs={JSON.parse(JSON.stringify(cabs || []))}
          quotes={JSON.parse(JSON.stringify(quotes))}
          fromRoutes={cityHub?.fromRoutes || []}
          places={cityHub?.places || []}
          localAreas={cityHub?.localAreas || []}
          bookingTrip={bookingTrip}
          airportLabel={cityHub?.airportLinks?.[0]?.label || cityHub?.airportHeading || ""}
          path={path}
        />
      </>
    );
  }

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
      />
    </>
  );
}
