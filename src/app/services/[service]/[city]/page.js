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
  serviceDescription,
  serviceKeywords,
  servicePageJsonLd,
  servicePath,
  serviceTitle
} from "../../../../lib/seo";

export function generateStaticParams() {
  return SEO_CITIES.flatMap((city) =>
    SEO_SERVICES.map((service) => ({ city: city.slug, service: service.slug }))
  );
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  const service = serviceBySlug(params.service);
  if (!city || !service) return {};

  const path = servicePath(service, city);
  return buildPageMetadata({
    title: serviceTitle(service, city.name),
    description: serviceDescription(service, city),
    path,
    keywords: serviceKeywords(service, city)
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
      description: serviceDescription(service, city),
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
