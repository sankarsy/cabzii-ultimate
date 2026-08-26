/**
 * SEO foundation QA — run with:
 * node --experimental-vm-modules scripts/qa-seo-foundation.mjs
 */
import { relatedLinksForPage } from "../src/lib/seo/internalLinks.js";
import { cityAreas, getCityFaqs, getServiceFaqs } from "../src/lib/seo/content.js";
import { cityHasCommercialAirport, airportInfoForCity } from "../src/lib/seo/airports.js";
import { getServiceH1, getCabBookingMeta } from "../src/lib/seo/programmaticMeta.js";
import { getCityLandingBody, getServiceLandingBody } from "../src/lib/seo/landingContent.js";
import { SEO_SERVICES } from "../src/lib/seo/services.js";
import { cityBySlug } from "../src/lib/seo/cities.js";

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

if (failures.length) {
  console.error(`SEO foundation QA FAILED (${failures.length}):`);
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}

console.log("SEO foundation QA passed.");
