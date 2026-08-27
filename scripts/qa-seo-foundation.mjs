/**
 * SEO foundation QA — run with:
 * node --experimental-vm-modules scripts/qa-seo-foundation.mjs
 */
import { relatedLinksForPage } from "../src/lib/seo/internalLinks.js";
import { cityAreas, getCityFaqs, getServiceFaqs } from "../src/lib/seo/content.js";
import { cityHasCommercialAirport, airportInfoForCity } from "../src/lib/seo/airports.js";
import { getServiceH1, getCabBookingMeta, clampDescription, getServiceMeta } from "../src/lib/seo/programmaticMeta.js";
import { getCityLandingBody, getServiceLandingBody, getRouteLandingBody } from "../src/lib/seo/landingContent.js";
import { SEO_SERVICES } from "../src/lib/seo/services.js";
import { cityBySlug, SEO_CITIES } from "../src/lib/seo/cities.js";
import {
  classifyCityHub,
  classifyRoute,
  classifyServiceCity,
  summarizeIndexationPolicy
} from "../src/lib/seo/indexation.js";
import { SEO_ROUTES } from "../src/lib/seo/routes.js";
import { FEATURED_ROUTE_SLUGS } from "../src/lib/seo/featuredRoutes.js";
import { featuredRouteUniqueHtml } from "../src/lib/seo/featuredRouteContent.js";
import { revenueSeoReport } from "../src/lib/seo/revenueAudit.js";
import { PUBLIC_ROUTE_REDIRECTS } from "../src/lib/routes/publicRoutes.js";
import { SERVICE_URL_PREFIXES, TRAVELS_URL_PREFIXES } from "../src/lib/seo/urlAliases.js";
import { isLiveApiHostProtected } from "../src/lib/liveApiHostGuard.js";
import { DEFAULT_KEYWORDS } from "../src/lib/seo/constants.js";
import { websiteJsonLd, localBusinessJsonLd } from "../src/lib/seo/schema.js";

const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

const vellore = cityBySlug("vellore");
const chennai = cityBySlug("chennai");
const trichy = cityBySlug("trichy");
const airportTaxi = SEO_SERVICES.find((s) => s.slug === "airport-taxi");
const cabRental = SEO_SERVICES.find((s) => s.slug === "cab-rental");
const carRental = SEO_SERVICES.find((s) => s.slug === "car-rental");

assert(cityAreas("vellore").length >= 4, "Vellore should have localities");
assert(cityAreas("trichy").length >= 4, "Trichy should have localities");
assert(!cityHasCommercialAirport("vellore"), "Vellore must not be listed as having a commercial airport");
assert(cityHasCommercialAirport("chennai"), "Chennai has MAA");
assert(airportInfoForCity("vellore")?.type === "nearest", "Vellore airport copy must be nearest-airport transfer");

const velloreLinks = relatedLinksForPage("cabs", "vellore").map((l) => l.href);
assert(
  velloreLinks.includes("/cab-booking/vellore"),
  "Vellore hub related links must include /cab-booking/vellore"
);
assert(
  !velloreLinks.includes("/cab-booking/chennai"),
  "Vellore hub related links must not include /cab-booking/chennai"
);
assert(
  velloreLinks.includes("/acting-driver/vellore"),
  "Vellore hub related links must include acting-driver/vellore"
);

const trichyLinks = relatedLinksForPage("cabs", "trichy").map((l) => l.href);
assert(trichyLinks.includes("/cab-booking/trichy"), "Trichy related links stay in Trichy");
assert(!trichyLinks.includes("/cab-booking/chennai"), "Trichy related links must not force Chennai hub");

const velloreAirportH1 = getServiceH1(airportTaxi, vellore);
assert(!/24\/7 Airport Taxi in Vellore/i.test(velloreAirportH1), "Do not claim a local Vellore airport H1");
assert(/Chennai International|MAA|transfer/i.test(velloreAirportH1), "Vellore airport H1 should mention transfer/MAA");

const cabMeta = getCabBookingMeta(vellore);
assert(!/Airport & Outstation/i.test(cabMeta.title), "Vellore cab hub title should not say Airport & Outstation");

const faqs = getCityFaqs(vellore, "cab").map(([q]) => q).join(" ");
assert(!/Can I book airport taxi in Vellore\?/i.test(faqs), "Vellore FAQ must not pretend there is a local airport taxi terminal");

const serviceFaqs = getServiceFaqs(airportTaxi, vellore)
  .map(([q, a]) => `${q} ${a}`)
  .join(" ");
assert(/no commercial|no airport|does not have/i.test(serviceFaqs), "Vellore airport-taxi FAQ must state no local airport");

const velloreBody = getCityLandingBody(vellore, "cab");
assert(/no commercial passenger airport/i.test(velloreBody), "Vellore hub body must say no passenger airport");
assert(/CMC|VIT|Katpadi/i.test(velloreBody), "Vellore hub body must use local context");

const driverVellore = getCityLandingBody(vellore, "driver");
assert(driverVellore === "", "Do not auto-generate acting-driver body for Vellore (freeze)");

const cabRentalBody = getServiceLandingBody(cabRental, vellore);
const carRentalBody = getServiceLandingBody(carRental, vellore);
assert(cabRentalBody.length > 200, "cab-rental city pages need a real body");
assert(carRentalBody.length > 200, "car-rental city pages need a real body");
assert(/chauffeur-driven/i.test(cabRentalBody + carRentalBody), "Rental copy should say chauffeur-driven, not self-drive inventory");

const chennaiBody = getCityLandingBody(chennai, "cab");
assert(/Chennai International Airport|MAA/i.test(chennaiBody), "Chennai hub may mention MAA");

const chennaiCabMeta = getCabBookingMeta(chennai);
assert(/Chennai Cab Booking/i.test(chennaiCabMeta.title), "Chennai hub title should lead with Chennai Cab Booking");
assert(!/24\/7|Low Rates|Best Rates/i.test(chennaiCabMeta.title), "Chennai title must not use 24/7 or Low Rates");

const padded = clampDescription("Short.");
assert(!/24\/7 support/i.test(padded), "clampDescription must not append 24/7 support");

assert(DEFAULT_KEYWORDS.length <= 16, "Homepage keywords must not be a stuffed list");
assert(!DEFAULT_KEYWORDS.some((k) => /best cab|cheap taxi|near me/i.test(k)), "DEFAULT_KEYWORDS must not include stuffed bargain phrases");

const siteSchema = JSON.stringify(websiteJsonLd());
assert(!/Cab Booking Chennai \| Airport Taxi/i.test(siteSchema), "WebSite alternateName must not be a stuffed title");

const lb = JSON.stringify(localBusinessJsonLd("Chennai", "Tamil Nadu", "/cab-booking/chennai"));
assert(!/opens":"00:00"/i.test(lb), "LocalBusiness must not claim 24-hour opening hours");

const chennaiAirport = getServiceMeta(airportTaxi, chennai);
assert(/Pickup & Drop/i.test(chennaiAirport.title), "Chennai airport title should say pickup & drop");
assert(!/24/.test(chennaiAirport.title), "Chennai airport title must not say 24/7");

assert(classifyCityHub("chennai").indexable, "Chennai cab hub stays indexable");
assert(classifyCityHub("chennai", "acting-driver").indexable, "Chennai acting-driver stays indexable");
assert(classifyServiceCity("airport-taxi", "chennai").indexable, "Chennai airport taxi stays indexable");
assert(classifyServiceCity("driver-on-hire", "chennai").indexable, "Do not noindex Chennai driver-on-hire without GSC");
assert(classifyServiceCity("chauffeur-service", "madurai").indexable, "Do not mass-noindex chauffeur city pages");

const tirupatiRoute = SEO_ROUTES.find((r) => r.slug === "chennai-to-tirupati-cab");
assert(tirupatiRoute && classifyRoute(tirupatiRoute).indexable, "Chennai–Tirupati stays indexable");
for (const slug of FEATURED_ROUTE_SLUGS) {
  const route = SEO_ROUTES.find((r) => r.slug === slug);
  assert(route && classifyRoute(route).indexable, `Featured route stays indexable: ${slug}`);
}

const delhiRoute = SEO_ROUTES.find((r) => r.slug === "chennai-to-delhi-cab");
assert(delhiRoute && classifyRoute(delhiRoute).indexable === false, "Chennai–Delhi long-haul should be noindex,follow");

assert(classifyServiceCity("tour-packages", "karur").indexable === false, "Thin tour-packages city pages are noindex");
assert(classifyServiceCity("tour-packages", "chennai").indexable, "Chennai tour-packages stays indexable");

const summary = summarizeIndexationPolicy();
assert(summary.indexable > 500, "Most existing programmatic pages remain indexable");
assert(summary.noindex > 0, "Phase 1 should noindex only weak pages");
assert(summary.noindex < 80, "Do not mass-noindex the catalog");

const preservedAliases =
  Object.keys(PUBLIC_ROUTE_REDIRECTS).length +
  SERVICE_URL_PREFIXES.size * SEO_CITIES.length +
  TRAVELS_URL_PREFIXES.size * SEO_CITIES.length;
assert(preservedAliases > 100, "Existing 301 alias patterns must remain in code");
assert(PUBLIC_ROUTE_REDIRECTS["/airport-taxi"] === "/services/airport-taxi/chennai", "Bare /airport-taxi remains a 301");

assert(typeof isLiveApiHostProtected === "function", "Live API guard must remain exported");

const chennaiAirportBody = getServiceLandingBody(airportTaxi, chennai);
assert(/MAA/i.test(chennaiAirportBody), "Chennai airport body must mention MAA");
assert(/pickup/i.test(chennaiAirportBody) && /drop/i.test(chennaiAirportBody), "Chennai airport body must cover pickup and drop");
assert(!/self-drive/i.test(chennaiAirportBody) || /not a self-drive/i.test(chennaiAirportBody), "Chennai airport must not sell self-drive");
assert(!/guaranteed availability/i.test(chennaiAirportBody), "Chennai airport must not promise guaranteed availability");

const outstation = SEO_SERVICES.find((s) => s.slug === "outstation-cab");
const oneWay = SEO_SERVICES.find((s) => s.slug === "one-way-cab");
const tempo = SEO_SERVICES.find((s) => s.slug === "tempo-traveller");
const chennaiOutstation = getServiceLandingBody(outstation, chennai);
const chennaiOneWay = getServiceLandingBody(oneWay, chennai);
const chennaiTempo = getServiceLandingBody(tempo, chennai);
assert(/250 km/i.test(chennaiOutstation), "Chennai outstation must state 250 km car minimum");
assert(/round trip/i.test(chennaiOutstation), "Chennai outstation must explain round trip");
assert(/chennai-to-tirupati-cab/.test(chennaiOneWay), "Chennai one-way must link Tirupati route");
assert(/not bus ticket/i.test(chennaiTempo), "Tempo page must not be bus ticketing");
assert(/chauffeur-driven/i.test(getServiceLandingBody(carRental, chennai)), "Chennai car rental must say chauffeur-driven");

assert(/MAA/i.test(chennaiBody) && /tariff/i.test(chennaiBody), "Chennai hub unique copy must mention MAA and tariff");

const airportFaqs = getServiceFaqs(airportTaxi, chennai).map(([q, a]) => `${q} ${a}`).join(" ");
assert(/pickup or drop/i.test(airportFaqs), "Chennai airport FAQs must mention pickup or drop");

for (const slug of FEATURED_ROUTE_SLUGS) {
  const route = SEO_ROUTES.find((r) => r.slug === slug);
  assert(route, `Featured route exists: ${slug}`);
  const unique = featuredRouteUniqueHtml(route);
  assert(unique.length > 200, `Featured route unique HTML: ${slug}`);
  const body = getRouteLandingBody({ ...route, fromCity: cityBySlug(route.from), toCity: cityBySlug(route.to) });
  assert(body.includes(String(route.distance)), `Featured route body uses catalog distance: ${slug}`);
}

const report = revenueSeoReport();
assert(report.topMoneyPages.length === 20, "Revenue audit must list top 20 money pages");
assert(report.topContentImprovement.length === 20, "Revenue audit must list top 20 content pages");
assert(report.bookingDataAvailable === false, "Do not invent booking conversion rates");
assert(report.revenueDataAvailable === false, "Do not invent GMV/revenue");
assert(report.tnCities.length >= 10, "TN city ranking must exist");
assert(report.nationalExpansion.length >= 8, "National expansion is a report, not new URLs");

if (failures.length) {
  console.error(`SEO foundation QA FAILED (${failures.length}):`);
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}

console.log("SEO foundation QA passed.");
console.log(
  JSON.stringify(
    {
      programmaticPages: summary.programmaticPages,
      indexable: summary.indexable,
      noindex: summary.noindex,
      classA: summary.classA,
      classB: summary.classB,
      preservedAliasPatterns: preservedAliases,
      noindexSample: summary.noindexSample
    },
    null,
    2
  )
);
