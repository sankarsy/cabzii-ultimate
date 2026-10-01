/** Canonical redirects for marketing-friendly URLs (prompt spec + SEO). */
import {
  actingDriverLandingPath,
  airportCabBookingPath,
  cityCabLandingPath,
  isActingDriverHubCity,
  isAirportCabBookingCity,
  TRICHY_CITY_ALIASES
} from "../cityCabPaths";
import { outstationPath, parseLegacyRoutesPathname } from "../seo/outstationPaths";
import { isPackageDoorwayService, packageDoorwayCanonicalPath } from "../seo/packageDoorways";

export const PUBLIC_ROUTE_REDIRECTS = {
  "/cars": "/cabs",
  "/blog": "/blogs",
  "/profile": "/account",
  "/bookings": "/my-bookings",
  "/outstation-cabs": "/services/outstation-cab/chennai",
  "/airport-taxi": "/chennai/airport-cab-booking",
  "/local-rental": "/chennai",
  "/one-way-cabs": "/services/one-way-cab/chennai",
  "/driver-service": "/call-driver",
  "/call-driver-chennai": "/chennai/acting-driver",
  "/acting-driver-chennai": "/chennai/acting-driver",
  "/call-drivers-chennai": "/chennai/acting-driver",
  "/chennai-airport-taxi": "/chennai/airport-cab-booking",
  "/chennai-to-tirupati-cab": "/chennai/outstation/chennai-to-tirupati",
  "/chennai-to-pondicherry-cab": "/chennai/outstation/chennai-to-pondicherry",
  "/routes/chennai-to-bengaluru-cab": "/chennai/outstation/chennai-to-bangalore",
};

const VEHICLE_SLUG_MAP = {
  "innova-crysta": "innova",
  "innova": "innova",
  "maruti-dzire": "dzire",
  "swift-dzire": "dzire",
  "ertiga": "ertiga",
  "tempo-traveller": "tempo"
};

/** SEO-friendly /cars/{vehicle} → catalog cab detail slug. */
const CAR_PAGE_SLUGS = {
  "innova-crysta": "mpv-toyota-innova-crysta",
  "toyota-innova-crysta": "mpv-toyota-innova-crysta",
  "toyota-innova": "mpv-toyota-innova-crysta",
  "swift-dzire": "swift-dzire",
  "maruti-dzire": "swift-dzire",
  "maruti-dzire-cab": "swift-dzire",
  "tempo-traveller": "tempo-traveller",
  "ertiga": "ertiga",
  "honda-amaze": "honda-amaze"
};

export function resolvePublicRouteRedirect(pathname) {
  if (PUBLIC_ROUTE_REDIRECTS[pathname]) {
    return PUBLIC_ROUTE_REDIRECTS[pathname];
  }
  const trichyAlias = String(pathname || "").match(/^\/([a-z0-9-]+)(\/.*)?$/);
  if (trichyAlias && TRICHY_CITY_ALIASES.includes(trichyAlias[1])) {
    return `/trichy${trichyAlias[2] || ""}`.replace(/\/$/, "") || "/trichy";
  }
  const legacyAirport = String(pathname || "").match(/^\/services\/airport-taxi\/([a-z0-9-]+)\/?$/);
  if (legacyAirport && isAirportCabBookingCity(legacyAirport[1])) {
    return airportCabBookingPath(legacyAirport[1]);
  }
  const packageService = String(pathname || "").match(/^\/services\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/);
  if (packageService && isPackageDoorwayService(packageService[1])) {
    return packageDoorwayCanonicalPath(packageService[1], packageService[2]);
  }
  const legacyActing = String(pathname || "").match(/^\/acting-driver\/([a-z0-9-]+)\/?$/);
  if (legacyActing && isActingDriverHubCity(legacyActing[1])) {
    return actingDriverLandingPath(legacyActing[1]);
  }
  const outstationFromLegacy = parseLegacyRoutesPathname(pathname);
  if (outstationFromLegacy) return outstationFromLegacy;
  const legacyCityHub = String(pathname || "").match(/^\/car-rental\/([a-z0-9-]+)-city-cabs\/?$/);
  if (legacyCityHub) return `/${legacyCityHub[1]}`;
  const cabSuffix = String(pathname || "").match(/^\/([a-z0-9-]+)\/outstation\/([a-z0-9-]+)-to-([a-z0-9-]+)-cab\/?$/);
  if (cabSuffix) return outstationPath(cabSuffix[1], cabSuffix[3]);
  const carsMatch = pathname.match(/^\/cars\/([^/]+)\/?$/);
  if (carsMatch) {
    const slug = carsMatch[1].toLowerCase();
    const cabSlug = CAR_PAGE_SLUGS[slug] || slug;
    return `/cabs/${cabSlug}`;
  }
  const carMatch = pathname.match(/^\/car\/([^/]+)\/?$/);
  if (carMatch) return `/cabs/${carMatch[1]}`;
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
