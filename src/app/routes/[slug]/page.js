import { notFound } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import RouteLandingPage from "../../../components/seo/RouteLandingPage";
import { resolveRouteBySlug } from "../../../lib/seo/cmsResolve";
import { fetchCatalogForCity } from "../../../lib/serverCatalog";
import {
  allRouteSlugsForBuild,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqFromPairs,
  getRouteFaqs,
  routeServiceJsonLd,
  tunedRouteDescription,
  tunedRouteKeywords,
  tunedRouteTitle
} from "../../../lib/seo";
import { classifyRoute } from "../../../lib/seo/indexation";

export const revalidate = 600;

export const dynamicParams = true;

export function generateStaticParams() {
  return allRouteSlugsForBuild().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const route = await resolveRouteBySlug(params.slug);
  if (!route) {
    return buildPageMetadata({
      title: "Route Not Found",
      description: "This cab route page is not available on Cabzii.",
      path: `/routes/${params.slug}`,
      noindex: true,
      follow: false
    });
  }

  const path = `/routes/${route.slug}`;
  const title = route.seoTitle || tunedRouteTitle(route);
  const description = route.seoDescription || tunedRouteDescription(route);
  const keywords = route.seo
    ? route.seo.split(",").map((k) => k.trim()).filter(Boolean)
    : tunedRouteKeywords(route);
  const indexPolicy = classifyRoute(route, { source: route.source });

  return buildPageMetadata({
    title,
    description,
    path,
    keywords,
    noindex: !indexPolicy.indexable,
    follow: indexPolicy.follow
  });
}

export default async function RoutePage({ params }) {
  const route = await resolveRouteBySlug(params.slug);
  if (!route) notFound();

  const path = `/routes/${route.slug}`;
  const faqs = getRouteFaqs(route);
  const cabs = await fetchCatalogForCity("cabs", route.fromCity?.name, 12);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: route.fromCity.name, path: `/cab-booking/${route.fromCity.slug}` },
      { name: `${route.fromCity.name} to ${route.toCity.name}`, path }
    ]),
    routeServiceJsonLd({
      fromCity: route.fromCity,
      toCity: route.toCity,
      productName: route.seoTitle || tunedRouteTitle(route),
      urlPath: path,
      description: route.seoDescription || tunedRouteDescription(route),
      priceFrom: route.sedanFrom,
      priceTo: route.innovaFrom || route.suvFrom || Math.round((route.sedanFrom || 1400) * 1.8)
    }),
    faqFromPairs(faqs)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <RouteLandingPage
        route={route}
        faqs={faqs}
        extraBody={route.body}
        cabs={JSON.parse(JSON.stringify(cabs))}
      />
    </>
  );
}
