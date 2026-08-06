/** Canonical redirects for marketing-friendly URLs (prompt spec + SEO). */
export const PUBLIC_ROUTE_REDIRECTS = {
  "/cars": "/cabs",
  "/blog": "/blogs",
  "/profile": "/account",
  "/bookings": "/my-bookings",
  "/outstation-cabs": "/services/outstation-cab/chennai",
  "/airport-taxi": "/services/airport-taxi/chennai",
  "/local-rental": "/services/hourly-rental/chennai",
  "/one-way-cabs": "/services/one-way-cab/chennai",
  "/driver-service": "/drivers",
  "/chennai-airport-taxi": "/services/airport-taxi/chennai",
  "/chennai-to-tirupati-cab": "/routes/chennai-to-tirupati-cab",
  "/chennai-to-pondicherry-cab": "/routes/chennai-to-pondicherry-cab",
  /* Canonical corridor: keep featured bangalore slug; mesh twin redirects here */
  "/routes/chennai-to-bengaluru-cab": "/routes/chennai-to-bangalore-cab"
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
  if (locationMatch) return `/cab-booking/${locationMatch[1].toLowerCase()}`;
  const cityMatch = pathname.match(/^\/city\/([^/]+)\/?$/);
  if (cityMatch) return `/cab-booking/${cityMatch[1]}`;
  return null;
}
