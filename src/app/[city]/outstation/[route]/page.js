import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "../../../../components/seo/JsonLd";
import RouteLandingPage from "../../../../components/seo/RouteLandingPage";
import { resolveRouteBySlug } from "../../../../lib/seo/cmsResolve";
import { fetchCabsForTrip } from "../../../../lib/serverCatalog";
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
} from "../../../../lib/seo";
import { classifyRoute } from "../../../../lib/seo/indexation";
import { cityCabLandingPath } from "../../../../lib/cityCabPaths";
import { routeToTrip } from "../../../../lib/routeTrip";
import {
  outstationHubPath,
  outstationPath,
  outstationPathFromLegacySlug,
  parseOutstationRouteSegment
} from "../../../../lib/seo/outstationPaths";
import { cityBySlug } from "../../../../lib/seo/cities";
import { SEO_REVALIDATE_SECONDS } from "../../../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return allRouteSlugsForBuild()
    .map((slug) => {
      const path = outstationPathFromLegacySlug(slug);
      const parts = path.split("/").filter(Boolean);
      if (parts.length !== 3) return null;
      return { city: parts[0], route: parts[2] };
    })
    .filter(Boolean);
}

async function loadRoute(params) {
  const city = cityBySlug(params.city);
  const parsed = parseOutstationRouteSegment(params.route);
  if (!city || !parsed) return { city: city || null, parsed, route: null, path: "" };

  if (parsed.fromToken !== params.city) {
    return {
      city,
      parsed,
      route: null,
      path: "",
      redirectTo: outstationPath(parsed.fromToken, parsed.toToken)
    };
  }

  const route = await resolveRouteBySlug(parsed.legacySlug);
  const path = route ? outstationPathFromLegacySlug(route.slug) : outstationPath(parsed.fromToken, parsed.toToken);
  return { city, parsed, route, path };
}

export async function generateMetadata({ params }) {
  const loaded = await loadRoute(params);
  if (loaded.redirectTo) {
    return buildPageMetadata({
      title: "Outstation cab",
      description: "Cabzii outstation cab route.",
      path: loaded.redirectTo,
      noindex: true,
      follow: true
    });
  }
  if (!loaded.route) {
    return buildPageMetadata({
      title: "Route Not Found",
      description: "This cab route page is not available on Cabzii.",
      path: `/${params.city}/outstation/${params.route}`,
      noindex: true,
      follow: false
    });
  }

  const { route, path } = loaded;
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

export default async function OutstationRoutePage({ params }) {
  const loaded = await loadRoute(params);
  if (loaded.redirectTo) permanentRedirect(loaded.redirectTo);
  if (!loaded.route) notFound();

  const { route, path, city } = loaded;
  const faqs = getRouteFaqs(route);
  const trip = routeToTrip(route);
  const cabs = await fetchCabsForTrip(trip, 50);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: city.name, path: cityCabLandingPath(city.slug) },
      { name: "Outstation", path: outstationHubPath(city.slug) },
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
        path={path}
      />
    </>
  );
}
