import { MAIN_PAGE_CITY_SLUGS } from "../seo/cities";

const BLOCKED_PREFIXES = [
  "/api",
  "/admin",
  "/account",
  "/payment",
  "/booking",
  "/my-bookings",
  "/quote",
  "/login",
  "/signin",
  "/search",
  "/cabs/results",
  "/cabs/passenger",
  "/drivers/results",
  "/drivers/passenger",
  "/call-driver/book",
  "/buses/results",
  "/buses/seats",
  "/buses/passenger"
];

const MAX_PATHS_PER_MUTATION = 40;

export function isSafeSeoPath(path) {
  if (!path || typeof path !== "string") return false;
  if (!path.startsWith("/")) return false;
  if (path.length > 200) return false;
  if (path.includes("..") || path.includes("//") || path.includes("\\")) return false;
  if (path.includes("?") || path.includes("#")) return false;
  if (!/^\/[a-z0-9\-_/]*$/.test(path)) return false;
  return !BLOCKED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function slug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

function cap(paths) {
  return [...new Set(paths.filter(isSafeSeoPath))].slice(0, MAX_PATHS_PER_MUTATION);
}

export function pathsFromSeoCityPage(record = {}) {
  const city = slug(record.citySlug);
  if (!city) return [];
  const pageType = record.pageType === "acting-driver" ? "acting-driver" : "cab-booking";
  return cap([`/${pageType}/${city}`]);
}

export function pathsFromSeoService(record = {}) {
  const serviceSlug = slug(record.slug);
  if (!serviceSlug) return [];
  const listed = Array.isArray(record.citySlugs) ? record.citySlugs.map(slug).filter(Boolean) : [];
  const cities =
    record.allCities === false && listed.length
      ? listed.filter((city) => MAIN_PAGE_CITY_SLUGS.includes(city))
      : MAIN_PAGE_CITY_SLUGS;
  return cap(cities.map((city) => `/services/${serviceSlug}/${city}`));
}

export function pathsFromSeoRoute(record = {}) {
  const routeSlug = slug(record.slug);
  return routeSlug ? cap([`/routes/${routeSlug}`]) : [];
}

export function pathsFromSiteSettings(record = {}) {
  const paths = ["/"];
  const pageSeo = record.pageSeo;
  if (pageSeo && typeof pageSeo === "object") {
    for (const key of Object.keys(pageSeo)) {
      if (isSafeSeoPath(key)) paths.push(key);
    }
  }
  return cap(paths);
}

export function pathsFromCab(record = {}, id = "") {
  const paths = ["/cabs"];
  const cabSlug = slug(record.slug);
  const cabId = slug(id || record._id || record.id);
  if (cabSlug) paths.push(`/cabs/${cabSlug}`);
  if (cabId && cabId !== cabSlug) paths.push(`/cabs/${cabId}`);
  return cap(paths);
}

export function pathsFromPackage(record = {}, id = "") {
  const paths = ["/holidays"];
  const pkgSlug = slug(record.slug);
  const pkgId = slug(id || record._id || record.id);
  if (pkgSlug) {
    paths.push(`/tour-packages/${pkgSlug}`);
    paths.push(`/holidays/${pkgSlug}`);
  }
  if (pkgId && pkgId !== pkgSlug) paths.push(`/holidays/${pkgId}`);
  return cap(paths);
}

export function pathsFromBlog(record = {}, fallbackSlug = "") {
  const blogSlug = slug(record.slug || fallbackSlug);
  const paths = ["/blogs"];
  if (blogSlug) paths.push(`/blog/${blogSlug}`);
  return cap(paths);
}

export function pathsFromKind(kind, record = {}, extra = {}) {
  switch (kind) {
    case "seo-city-page":
      return pathsFromSeoCityPage(record);
    case "seo-service":
      return pathsFromSeoService(record);
    case "seo-route":
      return pathsFromSeoRoute(record);
    case "site-settings":
      return pathsFromSiteSettings(record);
    case "cab":
      return pathsFromCab(record, extra.id);
    case "package":
      return pathsFromPackage(record, extra.id);
    case "blog":
      return pathsFromBlog(record, extra.slug);
    default:
      return [];
  }
}

export { MAX_PATHS_PER_MUTATION };
