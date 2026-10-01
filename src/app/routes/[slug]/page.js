import { notFound, permanentRedirect } from "next/navigation";
import { outstationPathFromLegacySlug, parseLegacyRouteSlug } from "../../../lib/seo/outstationPaths";
import { allRouteSlugsForBuild, buildPageMetadata } from "../../../lib/seo";

export const dynamicParams = true;

export function generateStaticParams() {
  return allRouteSlugsForBuild().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const path = outstationPathFromLegacySlug(params.slug);
  if (!path) {
    return buildPageMetadata({
      title: "Route Not Found",
      description: "This cab route page is not available on Cabzii.",
      path: `/routes/${params.slug}`,
      noindex: true,
      follow: false
    });
  }
  return buildPageMetadata({
    title: "Outstation cab",
    description: "This route has moved to the outstation URL.",
    path,
    noindex: true,
    follow: true
  });
}

export default function LegacyRouteRedirect({ params }) {
  if (!parseLegacyRouteSlug(params.slug)) notFound();
  permanentRedirect(outstationPathFromLegacySlug(params.slug));
}
