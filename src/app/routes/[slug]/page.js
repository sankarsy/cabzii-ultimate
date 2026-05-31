import { notFound } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import RouteLandingPage from "../../../components/seo/RouteLandingPage";
import {
  SEO_ROUTES,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqFromPairs,
  getRouteFaqs,
  routeBySlug,
  routeDescription,
  routeServiceJsonLd,
  routeTitle
} from "../../../lib/seo";

export function generateStaticParams() {
  return SEO_ROUTES.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({ params }) {
  const route = routeBySlug(params.slug);
  if (!route) {
    return buildPageMetadata({
      title: "Route Not Found",
      description: "This cab route page is not available on Cabzii.",
      path: `/routes/${params.slug}`,
      noindex: true
    });
  }

  const path = `/routes/${route.slug}`;
  return buildPageMetadata({
    title: routeTitle(route.fromCity, route.toCity),
    description: routeDescription(route.fromCity, route.toCity, route),
    path,
    keywords: [
      `one way cab ${route.fromCity.name.toLowerCase()} to ${route.toCity.name.toLowerCase()}`,
      `${route.fromCity.name.toLowerCase()} to ${route.toCity.name.toLowerCase()} taxi`,
      "cabzii one way cab",
      `outstation cab ${route.fromCity.name.toLowerCase()}`
    ]
  });
}

export default function RoutePage({ params }) {
  const route = routeBySlug(params.slug);
  if (!route) notFound();

  const path = `/routes/${route.slug}`;
  const faqs = getRouteFaqs(route);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: route.fromCity.name, path: `/cab-booking/${route.fromCity.slug}` },
      { name: `${route.fromCity.name} to ${route.toCity.name}`, path }
    ]),
    routeServiceJsonLd({
      fromCity: route.fromCity,
      toCity: route.toCity,
      urlPath: path,
      description: routeDescription(route.fromCity, route.toCity, route),
      priceFrom: route.sedanFrom,
      priceTo: route.innovaFrom || Math.round((route.sedanFrom || 1400) * 1.8)
    }),
    faqFromPairs(faqs)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <RouteLandingPage route={route} faqs={faqs} />
    </>
  );
}
