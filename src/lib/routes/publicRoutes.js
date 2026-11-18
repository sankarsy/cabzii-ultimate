/** Canonical redirects for marketing-friendly URLs (prompt spec + SEO). */
import {
  airportCabBookingPath,
  cityCabLandingPath,
  isAirportCabBookingCity,
  TRICHY_CITY_ALIASES
} from "../cityCabPaths";
import { outstationPath, parseLegacyRoutesPathname } from "../seo/outstationPaths";
import { isPackageDoorwayService, packageDoorwayCanonicalPath } from "../seo/packageDoorways";
import { resolveDroppedSeoRedirect } from "../seo/keepLivePages";

export const PUBLIC_ROUTE_REDIRECTS = {
  "/cars": "/cabs",
  "/locations": "/cabs",
  "/car-rental": "/cab-booking",
  "/blog": "/blogs",
  "/bangalore": "/cabs",
  "/cab-booking/bangalore": "/cabs",
  "/cab-booking/bengaluru": "/cabs",
  "/acting-driver/bangalore": "/call-driver",
  "/acting-driver/bengaluru": "/call-driver",
  "/puducherry": "/cab-booking/pondicherry",
  "/cab-booking/puducherry": "/cab-booking/pondicherry",
  "/pondichery": "/cab-booking/pondicherry",
  "/kodai": "/cab-booking/kodaikanal",
  "/udhagamandalam": "/cab-booking/ooty",
  "/sabarimalai": "/cab-booking/sabarimala",
  "/pamba": "/cab-booking/sabarimala",
  "/ayyappan-kovil": "/cab-booking/ayyappankovil",
  "/ayyappankoil": "/cab-booking/ayyappankovil",
  "/profile": "/account",
  "/bookings": "/my-bookings",
  "/outstation-cabs": "/services/outstation-cab/chennai",
  "/airport-taxi": "/chennai/airport-cab-booking",
  "/local-rental": "/cab-booking/chennai",
  "/one-way-cabs": "/services/one-way-cab/chennai",
  "/driver-service": "/call-driver",
  "/drivers": "/call-driver",
  "/call-driver-chennai": "/acting-driver/chennai",
  "/acting-driver-chennai": "/acting-driver/chennai",
  "/call-drivers-chennai": "/acting-driver/chennai",
  "/chennai-airport-taxi": "/chennai/airport-cab-booking",
  "/chennai-to-tirupati-cab": "/chennai/outstation/chennai-to-tirupati",
  "/chennai-to-pondicherry-cab": "/services/outstation-cab/chennai",
  "/routes/chennai-to-bengaluru-cab": "/services/outstation-cab/chennai",
  "/services/outstation-cab/bengaluru": "/cabs",
  "/services/airport-taxi/bengaluru": "/cabs"
};

const VEHICLE_SLUG_MAP = {
  "innova-crysta": "innova",
  "innova": "innova",
  "maruti-dzire": "dzire",
  "swift-dzire": "dzire",
  "ertiga": "ertiga",
  "tempo-traveller": "tempo"
};

export function resolvePublicRouteRedirect(pathname) {
  if (PUBLIC_ROUTE_REDIRECTS[pathname]) {
    return PUBLIC_ROUTE_REDIRECTS[pathname];
  }
  if (/^\/drivers(\/|$)/.test(String(pathname || ""))) {
    return "/call-driver";
  }
  if (/^\/(hotels|flights|trains)(\/|$)/.test(String(pathname || ""))) {
    return "/";
  }
  const droppedSeo = resolveDroppedSeoRedirect(pathname);
  if (droppedSeo) {
    return droppedSeo;
  }
  const trichyAlias = String(pathname || "").match(/^\/([a-z0-9-]+)(\/.*)?$/);
  if (trichyAlias && TRICHY_CITY_ALIASES.includes(trichyAlias[1])) {
    const rest = trichyAlias[2] || "";
    return rest ? `/trichy${rest}` : cityCabLandingPath("trichy");
  }
  const legacyAirport = String(pathname || "").match(/^\/services\/airport-taxi\/([a-z0-9-]+)\/?$/);
  if (legacyAirport && isAirportCabBookingCity(legacyAirport[1])) {
    return airportCabBookingPath(legacyAirport[1]);
  }
  const packageService = String(pathname || "").match(/^\/services\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/);
  if (packageService && isPackageDoorwayService(packageService[1])) {
    return packageDoorwayCanonicalPath(packageService[1], packageService[2]);
  }
  const outstationFromLegacy = parseLegacyRoutesPathname(pathname);
  if (outstationFromLegacy) return outstationFromLegacy;
  const legacyCityHub = String(pathname || "").match(/^\/car-rental\/([a-z0-9-]+)-city-cabs\/?$/);
  if (legacyCityHub) return cityCabLandingPath(legacyCityHub[1]);
  const cabSuffix = String(pathname || "").match(/^\/([a-z0-9-]+)\/outstation\/([a-z0-9-]+)-to-([a-z0-9-]+)-cab\/?$/);
  if (cabSuffix) return outstationPath(cabSuffix[1], cabSuffix[3]);
  if (/^\/cars\/([^/]+)\/?$/.test(pathname) || /^\/car\/([^/]+)\/?$/.test(pathname)) {
    return "/cabs";
  }
  const vehicleMatch = pathname.match(/^\/vehicle\/([^/]+)\/?$/);
  if (vehicleMatch) {
    const query = VEHICLE_SLUG_MAP[vehicleMatch[1].toLowerCase()] || vehicleMatch[1];
    return `/cabs?vehicle=${encodeURIComponent(query)}`;
  }
  const locationMatch = pathname.match(/^\/location\/([^/]+)\/?$/);
  if (locationMatch) return cityCabLandingPath(locationMatch[1].toLowerCase());
  const cityMatch = pathname.match(/^\/city\/([^/]+)\/?$/);
  if (cityMatch) return cityCabLandingPath(cityMatch[1].toLowerCase());
  return null;
}
