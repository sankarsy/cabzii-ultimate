import { cityAreas } from "./content";
import { routesForCity } from "./routes";
import { servicePath, SEO_SERVICES } from "./services";
import { airportInfoForCity } from "./airports";
import { cityHubContext, driverCityContext } from "./cityHubCopy";
import { chennaiCabUniqueHtml, chennaiDriverUniqueHtml, chennaiServiceUniqueHtml } from "./chennaiCluster";
import { featuredRouteUniqueHtml } from "./featuredRouteContent";

function link(href, label) {
  return `<a href="${href}">${label}</a>`;
}

function pricingTable(rows) {
  const body = rows
    .map(
      ([vehicle, fare, notes]) =>
        `<tr><td>${vehicle}</td><td>${fare}</td><td>${notes}</td></tr>`
    )
    .join("");
  return `<table><thead><tr><th>Vehicle</th><th>Indicative fare</th><th>Best for</th></tr></thead><tbody>${body}</tbody></table>`;
}

function benefitsList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

/** Chennai-origin and top reverse routes get long-form content. */
function shouldGenerateRouteBody(route) {
  if (!route?.slug) return false;
  if (route.from === "chennai" || route.to === "chennai") return true;
  const hubs = new Set(["bengaluru", "coimbatore", "madurai"]);
  return hubs.has(route.from) || hubs.has(route.to);
}

const PRIORITY_SERVICES = new Set([
  "airport-taxi",
  "local-taxi",
  "outstation-cab",
  "one-way-cab",
  "cab-rental",
  "car-rental"
]);

function cityServiceLinks(city) {
  return SEO_SERVICES.filter((s) => PRIORITY_SERVICES.has(s.slug))
    .map((s) => link(servicePath(s, city), `${s.name} ${city.name}`))
    .join(", ");
}

function cityRouteLinks(citySlug, limit = 6) {
  const seen = new Set();
  const unique = [];
  for (const r of routesForCity(citySlug)) {
    if (!r?.fromCity || !r?.toCity) continue;
    const key = `${r.from}|${r.to}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(r);
    if (unique.length >= limit) break;
  }
  return unique.map((r) => link(`/routes/${r.slug}`, `${r.fromCity.name} to ${r.toCity.name} cab`)).join(", ");
}

function airportBodyBits(city) {
  const info = airportInfoForCity(city.slug);
  if (info?.type === "local") {
    return {
      listItem: `<strong>Airport taxi ${city.name}</strong> — pickup and drop at ${info.name} (${info.code}) with flight buffer time`,
      pickupNote: `For ${info.name} trips, specify terminal and preferred pickup gate in booking notes.`,
      hubPara: `<h2>Airport transfers in ${city.name}</h2>
<p>${city.name} is served by <strong>${info.name} (${info.code})</strong>. Pre-book airport pickup or drop on Cabzii with a fare shown before payment. Share flight time so the driver can plan buffer.</p>`
    };
  }
  if (info?.type === "nearest") {
    return {
      listItem: `<strong>Airport transfer from ${city.name}</strong> — cab to ${info.name} (${info.code})${info.also ? ` or ${info.also}` : ""} (no passenger airport in ${city.name})`,
      pickupNote: info.note,
      hubPara: `<h2>Airport transfers from ${city.name}</h2>
<p>${info.note} Cabzii lists this as an airport-transfer booking from ${city.name} — not a claim that ${city.name} has its own commercial terminal.</p>`
    };
  }
  return {
    listItem: `<strong>Airport transfer from ${city.name}</strong> — cab to the nearest commercial airport`,
    pickupNote: `Enter the airport name as your drop or pickup landmark.`,
    hubPara: ""
  };
}

function buildCityCabBody(city) {
  if (city.slug === "chennai") return chennaiCabUniqueHtml();

  const name = city.name;
  const areas = cityAreas(city.slug);
  const areaText = areas.length ? areas.join(", ") : `central ${name} and nearby suburbs`;
  const services = cityServiceLinks(city);
  const routes = cityRouteLinks(city.slug);
  const context = cityHubContext(city.slug);
  const airport = airportBodyBits(city);

  return `
<h2>Cab booking in ${name} — local guide</h2>
<p>${context?.travel || `Cabzii connects ${name} riders with taxi partners for local hourly packages, outstation trips and one-way inter-city travel.`}</p>
<p>${context?.useCases || `Enter your pickup in ${name}, compare sedan, SUV, Innova or tempo fares, and confirm.`}</p>

<h2>Types of cab services in ${name}</h2>
<p>Cabzii covers the taxi categories riders actually book in ${name}:</p>
${benefitsList([
  airport.listItem,
  `<strong>Local taxi ${name}</strong> — point-to-point city rides and hourly packages (4hr/8hr slabs)`,
  `<strong>Outstation cab ${name}</strong> — round-trip and multi-day highway packages with per-km clarity`,
  `<strong>One way taxi ${name}</strong> — inter-city drops without paying confusing return empty charges`,
  `<strong>Car rental ${name}</strong> — chauffeur-driven full-day hire for weddings, events and sightseeing`,
  `<strong>Cab rental ${name}</strong> — local day packages with extra km rates listed before payment`,
  `<strong>Tempo traveller ${name}</strong> — 12, 13, 14, 16 and 18 seater AC options for groups`
])}
<p>Explore dedicated service pages: ${services}.</p>

<h2>How to book a cab online in ${name}</h2>
<p>Booking on cabzii.in takes under two minutes:</p>
<ol>
<li>Enter your pickup location in ${name}</li>
<li>Select date, time and vehicle type — Dzire, Ertiga, Innova or Tempo</li>
<li>Compare packages with upfront fare breakdown</li>
<li>Confirm with your mobile number — fares are shown first</li>
<li>Receive driver contact details on SMS / WhatsApp before pickup</li>
</ol>

<h2>Popular pickup areas in ${name}</h2>
<p>Cabzii serves ${areaText}. Enter your exact locality during search — society, hotel, hospital or campus — so the nearest available cab can reach you. ${airport.pickupNote}</p>
${airport.hubPara}

<h2>Indicative cab fares in ${name}</h2>
<p>Fares depend on distance, vehicle, time of day and trip type. Cabzii always shows the package amount before payment. Typical starting ranges:</p>
${pricingTable([
  ["Swift Dzire", "From ₹1,200 (4 Hrs / 40 Km)", "Short local trips and inter-city sedan legs"],
  ["Maruti Ertiga", "From ₹1,800 (4 Hrs / 40 Km)", "Family transfer, extra luggage"],
  ["Innova Crysta 6+1 / 7+1", "From ₹2,200 (4 Hrs / 40 Km)", "Premium highway and 8hr hire"],
  ["Tempo Traveller 12 Seater", "From ₹3,000 (5 Hrs / 50 Km)", "Group tours and temple trips"]
])}
<p>Exact quotes appear on the booking page. See the <a href="/tariff">Cabzii tariff</a> for extra km, extra hour and driver batta.</p>

<h2>Popular outstation routes from ${name}</h2>
<p>Riders from ${name} frequently book: ${routes || "nearby city pairs shown on our routes hub"}. Each route page includes distance, travel time and sedan/SUV starting fares.</p>

<h2>Why choose Cabzii in ${name}?</h2>
${benefitsList([
  "Upfront fares — package amount shown before you pay",
  "Professional drivers assigned after booking confirmation",
  "Local, outstation, one-way and acting-driver options in one platform",
  "WhatsApp support for trip changes"
])}

<h2>Acting driver in ${name}</h2>
<p>Need a driver for your own car? Visit ${link(`/acting-driver/${city.slug}`, `acting driver ${name}`)} for hourly, daily and outstation chauffeur packages. Cabzii assigns a professional driver after you book — this is not a public driver directory.</p>

<h2>Book your ${name} cab now</h2>
<p>Use the search widget above or browse ${link(`/cab-booking/${city.slug}`, `cab booking ${name}`)}, ${link("/cabs", "all cabs")} and ${link("/blogs", "travel guides")}. For same-day outstation departures, book early on festival weekends.</p>
`;
}

function buildServiceBody(service, city) {
  const name = city.name;
  const svc = service.name;
  const slug = service.slug;
  const areas = cityAreas(city.slug);
  const areaText = areas.length ? areas.join(", ") : `popular neighbourhoods across ${name}`;
  const routes = cityRouteLinks(city.slug);
  const priceFrom = service.priceFrom ? `₹${service.priceFrom.toLocaleString("en-IN")}` : "₹1,200";

  const airport = airportInfoForCity(city.slug);
  const airportIntro =
    airport?.type === "local"
      ? `<p><strong>Airport taxi ${name}</strong> is a pre-booked pickup or drop at <strong>${airport.name} (${airport.code})</strong>. Cabzii shows the fare before payment. Choose sedan, SUV or Innova based on luggage. Driver contact is shared before arrival so you can coordinate at the gate.</p>`
      : airport?.type === "nearest"
        ? `<p>${airport.note} This page is for <strong>airport transfer cabs from ${name}</strong> to ${airport.name} (${airport.code})${airport.also ? ` or ${airport.also}` : ""} — not a local passenger terminal in ${name}.</p>`
        : `<p>Book an airport-transfer cab from ${name} on Cabzii with an upfront fare. Enter the airport name as pickup or drop.</p>`;

  const intros = {
    "airport-taxi": airportIntro,
    "local-taxi": `<p><strong>Local taxi ${name}</strong> covers point-to-point city rides and hourly packages for errands that do not fit a single drop — hospital visits, shopping, wedding logistics and multi-stop meetings across ${areaText}.</p>
<p>Cabzii surfaces 4-hour, 8-hour and 12-hour slabs with extra km and hour rates listed upfront.</p>`,
    "outstation-cab": `<p><strong>Outstation cab ${name}</strong> is for trips that leave city limits — family visits, temple pilgrimages, factory audits and multi-day tours. Packages include base km and driver allowance rules so highway pricing is clear before you pay.</p>`,
    "one-way-cab": `<p><strong>One way taxi ${name}</strong> drops you in another city without paying for an empty return. Use it for relocations, temple visits and business transfers. Route pages: ${routes || "see Cabzii routes"}.</p>`,
    "cab-rental": `<p><strong>Cab rental in ${name}</strong> is chauffeur-driven local hire — 4hr/40km and 8hr/80km slabs — not a self-drive desk. You book a Cabzii cab with driver for weddings, city tours and corporate days across ${areaText}.</p>
<p>Compare this with ${link(servicePath(SEO_SERVICES.find((s) => s.slug === "car-rental") || { slug: "car-rental" }, city), `car rental ${name}`)} when you want the same hourly model described as car hire, and with ${link(`/cab-booking/${city.slug}`, `cab booking ${name}`)} for airport or outstation tabs.</p>`,
    "car-rental": `<p><strong>Car rental in ${name}</strong> on Cabzii is a driver-included car for local packages. It is not a vendor-branded self-drive fleet page. Search hourly or full-day Innova, Dzire, Wagon R or Ertiga packages, then confirm.</p>
<p>For taxi-style city packages see ${link(servicePath(SEO_SERVICES.find((s) => s.slug === "cab-rental") || { slug: "cab-rental" }, city), `cab rental ${name}`)}. For outstation, use ${link(`/services/outstation-cab/${city.slug}`, `outstation cab ${name}`)}.</p>`
  };

  const pricing = {
    "airport-taxi": [
      ["Sedan airport drop", "From ₹1,200 (4 Hrs / 40 Km)", "Swift Dzire, 1–3 passengers"],
      ["Ertiga airport transfer", "From ₹1,800 (4 Hrs / 40 Km)", "Family, extra luggage"],
      ["Innova Crysta airport cab", "From ₹2,200 (4 Hrs / 40 Km)", "Premium, 6–7 passengers"],
      ["Early morning surcharge", "Shown upfront", "Book night before for 4–6 AM flights"]
    ],
    "local-taxi": [
      ["4 hours / 40 km package", "From ₹1,200", "Dzire — meetings, shopping, hospital"],
      ["8 hours / 80 km package", "From ₹2,400", "Dzire — weddings, multi-stop tours"],
      ["Ertiga 4 Hrs / 40 Km", "From ₹1,800", "Family local hire"],
      ["Innova Crysta 4 Hrs / 40 Km", "From ₹2,200", "Premium local hire"]
    ],
    "outstation-cab": [
      ["Swift Dzire outstation (250 km min)", "From ₹3,250", "Couples, solo travellers"],
      ["Maruti Ertiga outstation", "From ₹4,500", "Family highway trips"],
      ["Innova Crysta outstation", "From ₹5,000", "Premium long distance"],
      ["Tempo Traveller 12 seater", "From ₹6,600 (300 km min)", "Group pilgrimage, tours"]
    ],
    "one-way-cab": [
      ["Sedan one way (250 km min)", "From ₹3,250", "Swift Dzire / Honda Amaze"],
      ["Ertiga one way", "From ₹4,500", "Family with luggage"],
      ["Innova Crysta one way", "From ₹5,000", "Premium inter-city"],
      ["Tolls & parking", "Extra as listed", "See Cabzii tariff terms"]
    ]
  };

  return `
<h2>${svc} in ${name} — book online on Cabzii</h2>
${intros[slug] || `<p>Book <strong>${svc.toLowerCase()} in ${name}</strong> with fares shown before you confirm on Cabzii.in.</p>`}

<h2>Benefits of booking ${svc.toLowerCase()} on Cabzii</h2>
${benefitsList(service.highlights.length ? service.highlights : [
  `Upfront fare quote for ${svc.toLowerCase()} in ${name}`,
  "Professional drivers assigned after booking",
  "Sedan, SUV, Innova and tempo options",
  "WhatsApp trip support",
  "No hidden charges — inclusions shown before payment"
])}

<h2>${svc} pricing in ${name}</h2>
<p>Packages start from ${priceFrom}. Exact package price is always shown on Cabzii before you pay. Full rate card: <a href="/tariff">Cabzii tariff</a>.</p>
${pricingTable(pricing[slug] || pricing["local-taxi"])}
<p><em>Fares vary by date, vehicle availability and trip details. Festival weekends and peak hours may affect pricing — book early when you need a specific vehicle class.</em></p>

<h2>Areas we serve for ${svc.toLowerCase()} in ${name}</h2>
<p>Pickup and drop available across ${areaText}. ${
    slug === "airport-taxi" ? airportBodyBits(city).pickupNote : "Enter an exact pickup landmark for faster assignment."
  }</p>

<h2>How ${svc.toLowerCase()} booking works</h2>
<ol>
<li>Open Cabzii and search ${service.searchQuery} with pickup in ${name}</li>
<li>Select date, time and cab type matching your passengers and luggage</li>
<li>Review fare breakdown — base fare, km limits, allowances and extras</li>
<li>Confirm — driver details follow on SMS / WhatsApp</li>
<li>Track support via WhatsApp if your schedule changes</li>
</ol>

<h2>Vehicle options for ${svc.toLowerCase()} in ${name}</h2>
<p><strong>Sedan (Dzire / Amaze):</strong> Best value for 1–3 passengers and standard luggage. <strong>Ertiga:</strong> Comfortable for families. <strong>Innova Crysta 6+1 / 7+1:</strong> Premium seating for long highway legs. <strong>Tempo Traveller:</strong> 12, 13 or 18 seater for group temple trips and corporate outings. Vehicle availability is shown during search. Full rates: <a href="/tariff">Cabzii tariff</a>.</p>

<h2>Related services and routes from ${name}</h2>
<p>Combine your trip planning with related Cabzii pages: ${cityServiceLinks(city)}. Popular routes: ${routes || "see our routes hub"}.</p>

<h2>When to book ${svc.toLowerCase()} in advance</h2>
<p>Book at least 2–4 hours ahead for airport pickups; 12–24 hours for outstation and one-way highway departures; and 1–2 days before wedding or event hourly packages. Early booking secures your preferred vehicle class and avoids last-minute surge on peak travel days.</p>

<h2>Who should book ${svc.toLowerCase()} in ${name}?</h2>
<p>Business travellers use ${svc.toLowerCase()} for predictable pricing. Families prefer upfront Innova and SUV quotes for luggage-heavy trips. Tourists benefit from chauffeurs familiar with ${name} landmarks. Event planners rely on hourly packages for multi-stop wedding and corporate schedules.</p>

<h2>Documents and checkpoints before your trip</h2>
<p>Keep your booking confirmation and driver contact handy. For airport ${svc.toLowerCase()}, share flight number and terminal. For outstation legs, confirm toll and state tax inclusions in the fare breakdown. Carry valid ID for interstate highway checkpoints where applicable. For night departures, verify driver allowance and night charges in the package — Cabzii lists these before payment.</p>

<h2>Book ${svc.toLowerCase()} in ${name} now</h2>
<p>Ready to travel? Tap the booking button above to search live availability, or visit ${link(`/cab-booking/${city.slug}`, `cab booking ${name}`)} for all taxi options in the city. Compare sedan, SUV and Innova fares in seconds — confirm and receive driver details on WhatsApp.</p>
`;
}

function buildRouteBody(route) {
  const { fromCity, toCity, distance, duration, sedanFrom, suvFrom, slug } = route;
  const from = fromCity.name;
  const to = toCity.name;
  const sedan = sedanFrom ? `₹${sedanFrom.toLocaleString("en-IN")}` : "₹2,600";
  const suv = suvFrom ? `₹${suvFrom.toLocaleString("en-IN")}` : "₹3,600";
  const reverse = `${toCity.slug}-to-${fromCity.slug}-cab`;

  const routeNotes = {
    "chennai-to-pondicherry-cab":
      "The Chennai–Pondicherry highway (ECR) is popular for weekend getaways. Riders often stop at Mahabalipuram, Muttukadadu or seaside resorts. Early morning departures help you beat city traffic on GST Road and OMR connectors.",
    "chennai-to-bangalore-cab":
      "Chennai to Bengaluru is a high-volume business corridor. Most trips use NH48 via Krishnagiri with toll plazas along the route. Plan 6–7 hours excluding long meal stops. Innova is popular for corporate transfers with luggage.",
    "chennai-to-tirupati-cab":
      "Tirupati darshan trips are among the most booked one-way routes from Chennai. Many families prefer pre-dawn departure to reach Tirumala queue complexes early. Cabzii one-way pricing avoids paying for return empty haul.",
    "chennai-to-vellore-cab":
      "Vellore is a frequent medical and education travel destination from Chennai. The route via Sriperumbudur is relatively short — ideal for same-day return or one-way drop to CMC, VIT and surrounding areas.",
    "chennai-to-coimbatore-cab":
      "Chennai to Coimbatore is a long highway leg through Salem. Sedan one-way is economical for solo travellers; families often choose SUV or Innova for comfort on 8–9 hour drives.",
    "chennai-to-madurai-cab":
      "Chennai to Madurai connects two major Tamil Nadu hubs. Trichy–Chennai highway traffic peaks during festival seasons. Book Innova or SUV for temple visits with extended family and prasadam luggage.",
    "chennai-to-trichy-cab":
      "Chennai to Trichy is a high-volume Tamil Nadu corridor — popular for Srirangam Ranganathaswamy Temple, Rock Fort (Malai Kottai), and CMC hospital visits. The route uses NH44/NH38 with multiple toll plazas. One-way taxi booking avoids train waitlists during festival weekends."
  };

  const trichyDistanceSection =
    slug === "chennai-to-trichy-cab"
      ? `
<h2>Chennai to Trichy distance by car</h2>
<p>The <strong>Chennai to Trichy distance by car</strong> is approximately <strong>${distance}</strong> (about 330 km) on NH44/NH38. Typical drive time is <strong>${duration}</strong> in clear traffic — add 30–45 minutes during peak hours or monsoon. Most riders depart early morning from OMR, Guindy, T. Nagar or Chennai airport for same-day temple visits in Trichy.</p>
<p>Popular drop points include Srirangam, Rock Fort, Trichy Junction, and CMC/VIT areas. Book a <strong>cab from Chennai to Trichy</strong> with upfront one-way pricing — sedan from ${sedan}, SUV/Innova from ${suv}.</p>
`
      : "";

  return `
<h2>One way cab from ${from} to ${to}</h2>
<p>Book a <strong>one way taxi ${from} to ${to}</strong> on Cabzii with upfront sedan and SUV fares. This route covers approximately <strong>${distance}</strong> and typically takes <strong>${duration}</strong> depending on traffic, weather and rest stops. One-way pricing means you pay only for the forward journey — no confusion about return empty charges.</p>
<p>${routeNotes[slug] || `The ${from} to ${to} corridor is served daily by Cabzii partners with highway-experienced drivers. Enter your exact pickup address in ${from} and drop landmark in ${to} for accurate quotes.`}</p>

<h2>Route information — ${from} to ${to}</h2>
${pricingTable([
  ["Road distance", distance, "Approximate highway km"],
  ["Travel time", duration, "Excluding long meal breaks"],
  ["Sedan one way from", sedan, "Dzire / Amaze — 1–3 passengers"],
  ["SUV / Innova from", suv, "Family, extra luggage, groups"]
])}
<p>Tolls, state permits and parking (if any) are shown in the Cabzii fare breakdown before payment. Night departures may include driver allowance — always review inclusions on the booking screen.</p>
${trichyDistanceSection}

<h2>Why book ${from} to ${to} cab on Cabzii?</h2>
${benefitsList([
  `Fixed one-way fare quote for ${from} → ${to} before you pay`,
  "Highway-experienced drivers familiar with the route",
  "Sedan, SUV, Innova and tempo options for every group size",
  "WhatsApp support after you confirm",
  "No hidden return charges — true one-way pricing",
  "Easy reverse booking for return legs when needed"
])}

<h2>Best time to travel ${from} to ${to}</h2>
<p>Early morning (5–7 AM) departures help you avoid city congestion in ${from}. Weekday mid-morning runs are smoother on highways; Friday evenings and long weekends see heavier traffic. For temple destinations, plan arrival before peak darshan hours. Monsoon months may add 30–60 minutes — build buffer into your schedule.</p>

<h2>Vehicle guide for ${from} to ${to}</h2>
<p><strong>Sedan:</strong> Most economical for 1–3 riders with standard luggage. <strong>Ertiga:</strong> Better for families and extra bags. <strong>Innova Crysta:</strong> Premium comfort on ${duration} drives. <strong>Tempo Traveller:</strong> Choose 12, 13 or 18 seater for group pilgrimage or corporate outings. Select vehicle based on passengers, bags and comfort preference for the ${distance} journey.</p>

<h2>Pickup and drop flexibility</h2>
<p>Pickup anywhere in ${from} — enter society, hotel, airport or hospital name. Drop anywhere in ${to} including hotels, temples, industrial estates and residential areas. For airport-connected legs, specify terminal in notes. Cabzii shares driver contact before pickup so you can coordinate gate or security pass requirements.</p>

<h2>Popular stops and travel tips</h2>
<p>Highway trips from ${from} to ${to} may include toll plazas — keep FASTag-ready vehicles or confirm cash toll handling with your vendor. Carry water, light snacks and confirmation of drop landmark pin. For round-trip needs, you can book ${link(`/routes/${reverse}`, `${to} to ${from} cab`)} as a separate one-way or choose a round-trip outstation package from ${link(`/services/outstation-cab/${fromCity.slug}`, `outstation cab ${from}`)}.</p>

<h2>Related services in ${from}</h2>
<p>Planning more travel from ${from}? Explore ${link(`/cab-booking/${fromCity.slug}`, `cab booking ${from}`)}, ${link(`/services/airport-taxi/${fromCity.slug}`, `airport taxi ${from}`)}, ${link(`/services/one-way-cab/${fromCity.slug}`, `one way cab ${from}`)} and ${link(`/services/outstation-cab/${fromCity.slug}`, `outstation cab ${from}`)} on Cabzii.</p>

<h2>What is included in ${from} to ${to} one-way fare?</h2>
<p>Typical inclusions: base one-way fare for selected vehicle class, driver charges for the forward journey, and standard highway driving time. Extras that may apply: toll plazas (FASTag or cash), state border permits for certain routes, parking at destination, and driver night allowance for late departures. Cabzii shows these line items before you pay — no surprise add-ons at drop point.</p>

<h2>Customer checklist for ${from} → ${to}</h2>
<p>Confirm pickup pin and drop landmark a day before departure. Share passenger count and large luggage details so the right vehicle is assigned. Keep hydration and light snacks for ${duration} drives. For temple trips, plan darshan timing at ${to} before setting pickup hour. Save driver contact in WhatsApp for coordination at toll plazas and rest stops.</p>

<h2>Book ${from} to ${to} cab now</h2>
<p>Ready to travel? Use the booking button above to get your live fare for ${from} to ${to}. Compare sedan and SUV options, confirm and receive driver details before departure. Need a return leg later? Book ${link(`/routes/${reverse}`, `${to} to ${from} cab`)} separately or explore ${link(`/services/outstation-cab/${fromCity.slug}`, `round-trip outstation packages from ${from}`)}.</p>
`;
}

function buildCityDriverBody(city) {
  if (city.slug === "vellore") return "";
  const name = city.name;
  const areas = cityAreas(city.slug);
  const areaText = areas.length ? areas.join(", ") : `${name} and nearby localities`;
  const context = driverCityContext(city.slug);
  const airport = airportBodyBits(city);

  return `
<h2>Acting driver in ${name} — chauffeur for your own car</h2>
<p>${context?.travel || `Book an acting driver in ${name} when you want a professional chauffeur in your vehicle. Cabzii assigns the driver after you book — this is not a public list of vendor drivers.`}</p>
<p>${context?.useCases || `Typical uses: local hourly hire, outstation highway driving, and chauffeur-only airport runs.`}</p>

<h2>How acting driver booking works in ${name}</h2>
<ol>
<li>Open ${link(`/acting-driver/${city.slug}`, `acting driver ${name}`)} or ${link("/call-driver", "Call Driver")}</li>
<li>Choose local, outstation or chauffeur package and enter date, time and pickup</li>
<li>Add your vehicle details where asked</li>
<li>Confirm — Cabzii assigns an available driver</li>
</ol>

<h2>Where we pick up in ${name}</h2>
<p>Drivers reach you across ${areaText}. ${airport.pickupNote}</p>

<h2>Related ${name} travel</h2>
<p>Need a Cabzii cab instead of your own car? Use ${link(`/cab-booking/${city.slug}`, `cab booking ${name}`)}, ${link(`/services/cab-rental/${city.slug}`, `cab rental ${name}`)} or ${link(`/services/outstation-cab/${city.slug}`, `outstation cab ${name}`)}.</p>
`;
}

export function getCityLandingBody(city, variant = "cab") {
  if (variant === "driver") {
    if (city.slug === "chennai") return chennaiDriverUniqueHtml();
    if (city.slug === "vellore") return "";
    return buildCityDriverBody(city);
  }
  if (variant !== "cab") return "";
  return buildCityCabBody(city);
}

export function getServiceLandingBody(service, city) {
  if (city?.slug === "chennai") {
    const extra = chennaiServiceUniqueHtml(service.slug);
    if (extra) return extra;
    const generated = PRIORITY_SERVICES.has(service.slug) ? buildServiceBody(service, city) : "";
    return generated;
  }
  if (!PRIORITY_SERVICES.has(service.slug)) return "";
  return buildServiceBody(service, city);
}

export function getRouteLandingBody(route) {
  const unique = featuredRouteUniqueHtml(route);
  if (unique) return unique;
  if (!shouldGenerateRouteBody(route)) return "";
  return buildRouteBody(route);
}

export function mergeLandingBody(existing, generated) {
  if (existing?.trim()) return existing;
  return generated || "";
}
