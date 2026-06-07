import { notFound } from "next/navigation";
import JsonLd from "../../../../components/seo/JsonLd";
import ServiceLandingPage from "../../../../components/seo/ServiceLandingPage";
import { resolveServiceForCity } from "../../../../lib/seo/cmsResolve";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  cityBySlug,
  faqFromPairs,
  getServiceFaqs,
  servicePageJsonLd,
  servicePath,
  tunedServiceDescription,
  tunedServiceKeywords,
  tunedServiceTitle
} from "../../../../lib/seo";

export const revalidate = 600;

export async function generateMetadata({ params }) {
  const { service: serviceRow, city, cmsMeta } = await resolveServiceForCity(params.service, params.city);
  if (!serviceRow || !city) {
    return buildPageMetadata({
      title: "Service Not Found",
      description: "This cab service page is not available on Cabzii.",
      path: `/services/${params.service}/${params.city}`,
      noindex: true
    });
  }

  const path = servicePath(serviceRow, city);
  const title = cmsMeta?.seoTitle || tunedServiceTitle(serviceRow, city);
  const description = cmsMeta?.seoDescription || tunedServiceDescription(serviceRow, city);
  const keywords = cmsMeta?.seo
    ? cmsMeta.seo.split(",").map((k) => k.trim()).filter(Boolean)
    : tunedServiceKeywords(serviceRow, city);

  return buildPageMetadata({ title, description, path, keywords });
}

export default async function ServiceCityPage({ params }) {
  const { service, city } = await resolveServiceForCity(params.service, params.city);
  if (!service || !city) notFound();

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
      productName: service.seoTitle || tunedServiceTitle(service, city),
      description: service.seoDescription || tunedServiceDescription(service, city),
      urlPath: path,
      priceFrom: service.priceFrom,
      priceTo: Math.round((service.priceFrom || 999) * 3.5)
    }),
    faqFromPairs(faqs)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ServiceLandingPage city={city} service={service} faqs={faqs} extraBody={service.body} />
    </>
  );
}
