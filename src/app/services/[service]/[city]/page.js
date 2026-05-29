import { notFound } from "next/navigation";
import JsonLd from "../../../../components/seo/JsonLd";
import ServiceLandingPage from "../../../../components/seo/ServiceLandingPage";
import {
  SEO_CITIES,
  SEO_SERVICES,
  breadcrumbJsonLd,
  buildPageMetadata,
  cityBySlug,
  faqFromPairs,
  getServiceFaqs,
  serviceBySlug,
  servicePageJsonLd,
  servicePath,
  tunedServiceDescription,
  tunedServiceKeywords,
  tunedServiceTitle
} from "../../../../lib/seo";

export function generateStaticParams() {
  return SEO_CITIES.flatMap((city) =>
    SEO_SERVICES.map((service) => ({ city: city.slug, service: service.slug }))
  );
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  const service = serviceBySlug(params.service);
  if (!city || !service) {
    return buildPageMetadata({
      title: "Service Not Found",
      description: "This cab service page is not available on Cabzii.",
      path: `/services/${params.service}/${params.city}`,
      noindex: true
    });
  }

  const path = servicePath(service, city);
  return buildPageMetadata({
    title: tunedServiceTitle(service, city),
    description: tunedServiceDescription(service, city),
    path,
    keywords: tunedServiceKeywords(service, city)
  });
}

export default function ServiceCityPage({ params }) {
  const city = cityBySlug(params.city);
  const service = serviceBySlug(params.service);
  if (!city || !service) notFound();

  const path = servicePath(service, city);
  const faqs = getServiceFaqs(service, city);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: city.name, path: `/cab-booking/${city.slug}` },
      { name: service.name, path }
    ]),
    servicePageJsonLd({
      serviceName: service.name,
      cityName: city.name,
      description: tunedServiceDescription(service, city),
      urlPath: path,
      priceFrom: service.priceFrom
    }),
    faqFromPairs(faqs)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ServiceLandingPage city={city} service={service} faqs={faqs} />
    </>
  );
}
