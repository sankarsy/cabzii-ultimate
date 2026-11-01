import { NextResponse } from "next/server";
import { resolvePublicRouteRedirect } from "./lib/routes/publicRoutes";
import { resolveSeoAliasPath } from "./lib/seo/urlAliases";
import { cityCabLandingPath } from "./lib/cityCabPaths";
import { resolveSiteSearchHref } from "./lib/siteSearch";
import { prettyPublicCabRedirect } from "./lib/mmtTrip";

const PROTECTED_PREFIXES = ["/payment", "/booking", "/my-bookings"];

/** Prefix redirects: /taxi-booking/chennai → /chennai */
const SEO_PREFIX_REDIRECTS = {
  "/taxi-booking": "/cab-booking"
};

const TIRUPATI_PACKAGE_SLUG = "tirupati-balaji-darshan-tirupati";
const TIRUPATI_ROUTE_PATH = "/chennai/outstation/chennai-to-tirupati";
const RETIRED_HOLIDAY_PREFIXES = ["/holidays", "/tour-packages", "/packages"];

function retiredHolidayRedirect(pathname) {
  if (pathname === "/tour-booking") return "/";
  for (const prefix of RETIRED_HOLIDAY_PREFIXES) {
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) {
      const slug = pathname.slice(prefix.length + 1).split("/")[0];
      if (slug === TIRUPATI_PACKAGE_SLUG) return TIRUPATI_ROUTE_PATH;
      return "/";
    }
  }
  const serviceParts = pathname.split("/").filter(Boolean);
  if (serviceParts[0] === "services" && (serviceParts[1] === "tour-packages" || serviceParts[1] === "holiday-packages")) {
    return cityCabLandingPath(serviceParts[2] || "chennai");
  }
  return null;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Chrome DevTools probes these URLs. Compiling not-found first in Next 14.2
  // pins next/link to the 404 chunk and blank-screens every page with
  // "Cannot read properties of undefined (reading 'call')".
  if (pathname === "/json" || pathname.startsWith("/json/")) {
    return new NextResponse(null, { status: 404 });
  }

  if (pathname === "/cabs/results") {
    const pretty = prettyPublicCabRedirect(request.nextUrl.searchParams);
    if (pretty) return NextResponse.redirect(new URL(pretty, request.url), 307);
  }

  const retired = retiredHolidayRedirect(pathname);
  if (retired) {
    return NextResponse.redirect(new URL(retired, request.url), 301);
  }

  if (pathname === "/search") {
    const searchHref = resolveSiteSearchHref(request.nextUrl.searchParams.get("q"));
    if (searchHref && !searchHref.startsWith("/search")) {
      return NextResponse.redirect(new URL(searchHref, request.url));
    }
  }

  if (pathname !== pathname.toLowerCase() && !pathname.startsWith("/api")) {
    const lower = new URL(pathname.toLowerCase(), request.url);
    lower.search = request.nextUrl.search;
    return NextResponse.redirect(lower, 301);
  }

  for (const [prefix, target] of Object.entries(SEO_PREFIX_REDIRECTS)) {
    if (pathname === prefix) {
      return NextResponse.redirect(new URL(target, request.url), 301);
    }
    if (pathname.startsWith(`${prefix}/`)) {
      const rest = pathname.slice(prefix.length).replace(/^\/+/, "");
      const city = rest.split("/")[0];
      if (prefix === "/taxi-booking" && city) {
        return NextResponse.redirect(new URL(cityCabLandingPath(city.toLowerCase()), request.url), 301);
      }
      return NextResponse.redirect(new URL(`${target}${pathname.slice(prefix.length)}`, request.url), 301);
    }
  }

  const publicRedirect = resolvePublicRouteRedirect(pathname);
  if (publicRedirect) {
    const url = new URL(publicRedirect, request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  const aliasTarget = resolveSeoAliasPath(pathname);
  if (aliasTarget && aliasTarget !== pathname) {
    const url = new URL(aliasTarget, request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  if (pathname === "/signin" || pathname.startsWith("/signin/")) {
    const url = new URL("/login", request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("cabzii_token")?.value;
  if (token) return NextResponse.next();

  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname + request.nextUrl.search);
  login.searchParams.set("role", "customer");
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/payment/:path*",
    "/booking/:path*",
    "/my-bookings/:path*",
    "/taxi-booking/:path*",
    "/car-rental/:path*",
    "/cab-rental/:path*",
    "/travels/:path*",
    "/travel/:path*",
    "/travel-agency/:path*",
    "/((?!_next/static|_next/image|favicon|apple-touch|android-chrome|og-image|twitter-card|icon\\.svg|images|uploads|api|sw\\.js|ads\\.txt|llms\\.txt|\\.well-known).*)"
  ]
};
