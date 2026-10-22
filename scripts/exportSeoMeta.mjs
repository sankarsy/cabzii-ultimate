/**
 * Export live SEO titles for review. Keep-city pages only.
 *
 * Run: node --import ./scripts/register-js-ext.mjs scripts/exportSeoMeta.mjs
 * Output: seo-meta-review.csv
 */
import { writeFileSync } from "node:fs";
import { SEO_SCOPE_CITY_SLUGS, SEO_SCOPE_SERVICES, isSeoScopeRoute } from "../src/config/seo-scope.js";
import { cityBySlug } from "../src/lib/seo/cities.js";
import { SEO_ROUTES, routeBySlug } from "../src/lib/seo/routes.js";
import { serviceBySlug, servicePath } from "../src/lib/seo/services.js";
import { getCabBookingMeta, getRouteMeta, getServiceMeta } from "../src/lib/seo/programmaticMeta.js";
import { tunedActingDriverTitle, tunedActingDriverDescription } from "../src/lib/seo/metadataTuning.js";
import { cityHubSeo } from "../src/data/cityHubSeo.js";
import { ACTING_DRIVER_HUB_SEO } from "../src/data/actingDriverHubSeo.js";
import { airportHubSeo } from "../src/data/airportHubSeo.js";
import { STATIC_PAGE_SEO_LIST } from "../src/lib/seo/pageSeoCatalog.js";
import { cityCabLandingPath, actingDriverLandingPath, airportTaxiPublicPath } from "../src/lib/cityCabPaths.js";
import { routePublicPath } from "../src/lib/seo/outstationPaths.js";

const SKIP_STATIC_PATHS = new Set([
  "/drivers",
  "/services",
  "/routes",
  "/blogs",
  "/about",
  "/contact",
  "/faq",
  "/locations",
  "/testimonials"
]);

const KEEP_CITIES = SEO_SCOPE_CITY_SLUGS.map((slug) => cityBySlug(slug)).filter(Boolean);

const rows = [];
let sno = 0;

function add(pageType, url, title, description) {
  sno += 1;
  rows.push({
    sno,
    pageType,
    url,
    title: String(title || "").trim(),
    description: String(description || "").trim()
  });
}

for (const page of STATIC_PAGE_SEO_LIST) {
  if (SKIP_STATIC_PATHS.has(page.path)) continue;
  add(page.typeLabel, page.path, page.seoTitle, page.seoDescription);
}

for (const city of KEEP_CITIES) {
  const hub = cityHubSeo(city.slug);
  const cabMeta = hub || getCabBookingMeta(city);
  add("Cab booking", cityCabLandingPath(city.slug), cabMeta.title, cabMeta.description);

  const driverHub = ACTING_DRIVER_HUB_SEO[city.slug];
  add(
    "Acting driver",
    actingDriverLandingPath(city.slug),
    driverHub?.title || tunedActingDriverTitle(city),
    driverHub?.description || tunedActingDriverDescription(city)
  );

  for (const serviceSlug of SEO_SCOPE_SERVICES) {
    const service = serviceBySlug(serviceSlug);
    if (!service) continue;
    const path = servicePath(service, city);
    if (serviceSlug === "airport-taxi") {
      const airport = airportHubSeo(city.slug);
      add("Airport taxi", path || airportTaxiPublicPath(city.slug), airport?.title || getServiceMeta(service, city).title, airport?.description || getServiceMeta(service, city).description);
      continue;
    }
    const meta = getServiceMeta(service, city);
    add(`Service: ${service.name}`, path, meta.title, meta.description);
  }

  for (const row of SEO_ROUTES) {
    const route = routeBySlug(row.slug);
    if (!route || route.from !== city.slug) continue;
    if (!isSeoScopeRoute(route.from, route.to)) continue;
    const meta = getRouteMeta(route);
    add("Outstation route", routePublicPath(route), meta.title, meta.description);
  }
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

const header = "S.No,Page Type,URL,SEO Title,Title Length,SEO Description,Description Length";
const body = rows
  .map((row) =>
    [row.sno, row.pageType, row.url, row.title, row.title.length, row.description, row.description.length]
      .map(csvCell)
      .join(",")
  )
  .join("\n");

writeFileSync("seo-meta-review.csv", `\uFEFF${header}\n${body}\n`, "utf8");
console.log(`Exported ${rows.length} live pages to seo-meta-review.csv (dropped cities removed)`);
