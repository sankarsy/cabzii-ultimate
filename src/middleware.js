import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/payment", "/booking", "/my-bookings"];

/** SEO-friendly redirects for legacy or alias URLs. */
const SEO_REDIRECTS = {
  "/taxi-booking": "/cab-booking"
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname !== pathname.toLowerCase() && !pathname.startsWith("/api")) {
    const lower = new URL(pathname.toLowerCase(), request.url);
    lower.search = request.nextUrl.search;
    return NextResponse.redirect(lower, 301);
  }

  for (const [prefix, target] of Object.entries(SEO_REDIRECTS)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      const rest = pathname.slice(prefix.length);
      return NextResponse.redirect(new URL(`${target}${rest}`, request.url), 301);
    }
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
    "/((?!_next/static|_next/image|favicon.ico|images).*)"
  ]
};
