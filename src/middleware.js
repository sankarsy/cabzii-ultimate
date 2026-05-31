import { NextResponse } from "next/server";
import { resolveSeoAliasPath } from "./lib/seo/urlAliases";

const PROTECTED_PREFIXES = ["/payment", "/booking", "/my-bookings"];

/** Prefix redirects: /taxi-booking/chennai → /cab-booking/chennai */
const SEO_PREFIX_REDIRECTS = {
  "/taxi-booking": "/cab-booking"
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname !== pathname.toLowerCase() && !pathname.startsWith("/api")) {
    const lower = new URL(pathname.toLowerCase(), request.url);
    lower.search = request.nextUrl.search;
    return NextResponse.redirect(lower, 301);
  }

  for (const [prefix, target] of Object.entries(SEO_PREFIX_REDIRECTS)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      const rest = pathname.slice(prefix.length);
      return NextResponse.redirect(new URL(`${target}${rest}`, request.url), 301);
    }
  }

  const aliasTarget = resolveSeoAliasPath(pathname);
  if (aliasTarget && aliasTarget !== pathname) {
    const url = new URL(aliasTarget, request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  if (pathname === "/tour-booking") {
    const id = request.nextUrl.searchParams.get("id");
    if (id) {
      return NextResponse.redirect(new URL(`/holidays/${id}`, request.url), 301);
    }
    return NextResponse.redirect(new URL("/holidays", request.url), 301);
  }

  if (pathname === "/packages" || pathname.startsWith("/packages/")) {
    const rest = pathname.slice("/packages".length) || "";
    const url = new URL(`/holidays${rest}`, request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("cabzii_token")?.value;
  if (token) return NextResponse.next();

  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname);
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
    "/((?!_next/static|_next/image|favicon.ico|images|api).*)"
  ]
};
