import { cityAreas } from "./content";
import { routesForCity } from "./routes";
import { servicePath, SEO_SERVICES } from "./services";

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

const LOCAL_CITIES = new Set([
  "chennai",
  "bengaluru",
  "coimbatore",
  "madurai",
  "trichy",
  "salem",
  "vellore",
  "pondicherry"
]);

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
  "one-way-cab"
]);

function cityServiceLinks(city) {
  return SEO_SERVICES.filter((s) => PRIORITY_SERVICES.has(s.slug))
    .map((s) => link(servicePath(s, city), `${s.name} ${city.name}`))
    .join(", ");
}

function cityRouteLinks(citySlug, limit = 6) {
  return routesForCity(citySlug)
    .slice(0, limit)
    .map((r) => link(`/routes/${r.slug}`, `${r.fromCity.name} to ${r.toCity.name} cab`))
    .join(", ");
}

function buildCityCabBody(city) {
  const name = city.name;
  const areas = cityAreas(city.slug);
  const areaText = areas.length ? areas.join(", ") : `central ${name} and nearby suburbs`;
  const services = cityServiceLinks(city);
  const routes = cityRouteLinks(city.slug);

  return `
<h2>Cab booking in ${name} — complete guide</h2>
<p>Looking for reliable <strong>cab booking in ${name}</strong>? Cabzii connects you with verified taxi partners for airport transfers, local hourly packages, outstation trips and one-way inter-city travel. Whether you need a sedan for a business meeting, an Innova for a family airport drop, or a tempo traveller for a group pilgrimage, you can compare fares upfront and confirm your ride with mobile OTP — no app download required.</p>
<p>${name} is one of South India's busiest travel hubs. Riders search for <strong>taxi service ${name}</strong> at all hours: early-morning airport runs, hospital visits, wedding logistics, factory transfers and weekend getaways. Cabzii is built for these real-world needs — transparent package pricing, professional drivers and WhatsApp support when plans change.</p>

<h2>Types of cab services available in ${name}</h2>
<p>Cabzii covers every major taxi category riders search for in ${name}:</p>
${benefitsList([
  `<strong>Airport taxi ${name}</strong> — fixed-fare pickup and drop with terminal details and flight buffer time`,
  `<strong>Local taxi ${name}</strong> — point-to-point city rides and hourly packages (4hr/8hr slabs)`,
  `<strong>Outstation cab ${name}</strong> — round-trip and multi-day highway packages with per-km clarity`,
  `<strong>One way taxi ${name}</strong> — inter-city drops without paying confusing return empty charges`,
  `<strong>Car rental ${name}</strong> — full-day hire for weddings, corporate events and sightseeing`,
  `<strong>Tempo traveller ${name}</strong> — 12–17 seater AC options for groups and pilgrimage circuits`
])}
<p>Explore dedicated service pages: ${services}.</p>

<h2>How to book a cab online in ${name}</h2>
<p>Booking on cabzii.in takes under two minutes:</p>
<ol>
<li>Enter your pickup location in ${name} (or airport / outstation destination)</li>
<li>Select date, time and vehicle type — Dzire, Ertiga, Innova or Tempo</li>
<li>Compare vendor packages with upfront fare breakdown</li>
<li>Login with your 10-digit mobile number and OTP to confirm</li>
<li>Receive driver contact details on SMS / WhatsApp before pickup</li>
</ol>
<p>This flow works on mobile and desktop. For repeat riders, <strong>online cab booking ${name}</strong> is faster because your number is already verified.</p>

<h2>Popular pickup areas in ${name}</h2>
<p>Cabzii serves ${areaText}. Enter your exact locality during search — including society name, hotel, hospital or IT park — so the nearest available cab can reach you quickly. For airport trips, specify domestic (T1/T2/T3 where applicable) or international terminal and preferred pickup gate in booking notes.</p>

<h2>Indicative cab fares in ${name}</h2>
<p>Fares depend on distance, vehicle, time of day and trip type. Cabzii always shows the package amount before payment. Typical starting ranges:</p>
${pricingTable([
  ["Sedan (Dzire / Etios)", "₹999 – ₹1,800", "Airport drops, short local trips"],
  ["SUV (Ertiga)", "₹1,400 – ₹2,400", "Family airport transfer, 4hr local package"],
  ["Innova Crysta", "₹2,200 – ₹3,800", "Premium outstation, 8hr wedding hire"],
  ["Tempo Traveller 12–17 seater", "₹3,200 – ₹6,500", "Group tours, temple trips, corporate"]
])}
<p>Exact quotes appear on the booking page. Outstation and one-way trips include base km, driver allowance and night charges (if applicable) in the breakdown.</p>

<h2>Popular outstation routes from ${name}</h2>
<p>Inter-city travel is a core strength on Cabzii. Riders from ${name} frequently book: ${routes || "nearby city pairs shown on our routes hub"}. Each route page includes distance, travel time, sedan/SUV starting fares and FAQs — so you know what to expect before booking.</p>

<h2>Why choose Cabzii for taxi service in ${name}?</h2>
${benefitsList([
  "Upfront fares — no surprise meter disputes at the end of the trip",
  "Verified vendor network with professional, highway-experienced drivers",
  "Airport, local, outstation and acting driver options in one platform",
  "OTP-secured booking and WhatsApp support for trip changes",
  "Sedan to tempo fleet for solo travellers, families and large groups",
  "Transparent inclusions — tolls, parking and state taxes listed where applicable"
])}

<h2>Local SEO — ${name} cab service coverage</h2>
<p>Cabzii operates as an online cab aggregator for ${name}, ${city.state}. Our ${name} landing pages, service pages and route guides are updated regularly with fare guidance, travel tips and booking instructions. For businesses, hospitals, hotels and wedding planners in ${name}, Cabzii offers repeatable booking with consistent pricing — ideal for guest transfers and staff commute packages.</p>

<h2>Acting driver and chauffeur options in ${name}</h2>
<p>Need a driver for your own car? Visit ${link(`/acting-driver/${city.slug}`, `acting driver ${name}`)} for hourly, daily and outstation chauffeur packages. This is popular for owners who prefer their vehicle but want a professional driver for long highway stretches or city congestion.</p>

<h2>Common travel scenarios in ${name}</h2>
<p>Riders in ${name} book cabs for diverse real-world needs. <strong>Airport transfers</strong> dominate early-morning and late-night slots — specify terminal and flight time for smooth pickup. <strong>Hospital and clinic visits</strong> often need round-trip local packages with waiting time — choose 4-hour or 8-hour slabs. <strong>Wedding and event logistics</strong> require multi-stop hourly hire across ${areaText}. <strong>Corporate travel</strong> benefits from upfront invoicing-friendly packages and professional drivers. <strong>Pilgrimage and temple circuits</strong> frequently combine outstation legs with early-start sedan or Innova bookings.</p>

<h2>Seasonal booking tips for ${name}</h2>
<p>During monsoon months, add 30–45 minutes buffer for highway outstation trips. Festival seasons (Pongal, Diwali, long weekends) fill airport and pilgrimage routes fast — book 24–48 hours ahead. Summer hill-station departures from ${name} should start before 6 AM to avoid city heat and traffic. Corporate Monday mornings and Friday evenings see higher local taxi demand — off-peak hours often have better vehicle availability.</p>

<h2>Vehicle selection guide for ${name} trips</h2>
<p><strong>Maruti Dzire / Toyota Etios (sedan):</strong> Best value for 1–3 passengers, airport drops and short outstation legs. <strong>Maruti Ertiga (SUV):</strong> Ideal for families with child seats and extra luggage. <strong>Toyota Innova Crysta:</strong> Premium choice for long highway journeys and executive travel. <strong>Tempo Traveller 12–17 seater:</strong> Perfect for group temple tours, college trips and corporate outings. Vehicle availability is shown live during Cabzii search — compare before you confirm.</p>

<h2>Book your ${name} cab now</h2>
<p>Ready to travel? Use the search widget above or browse ${link(`/cab-booking/${city.slug}`, `cab booking ${name}`)}, ${link("/cabs", "all cabs")} and ${link("/blogs", "travel guides")} for route-specific tips. For urgent airport pickups or same-day outstation departures, book early — peak hours and festival weekends fill quickly. Need help choosing a package? WhatsApp our support team from the website footer with your pickup, destination and preferred vehicle — we will guide you to the right ${name} cab option.</p>
`;
}

function buildServiceBody(service, city) {
  const name = city.name;
  const svc = service.name;
  const slug = service.slug;
  const areas = cityAreas(city.slug);
  const areaText = areas.length ? areas.join(", ") : `popular neighbourhoods across ${name}`;
  const routes = cityRouteLinks(city.slug);
  const priceFrom = service.priceFrom ? `₹${service.priceFrom.toLocaleString("en-IN")}` : "₹999";

  const intros = {
    "airport-taxi": `<p><strong>Airport taxi ${name}</strong> is one of the most searched travel services in the city. Whether you are catching an early-morning flight, receiving international guests, or returning home after a long trip, a pre-booked airport cab removes stress from the last mile. Cabzii offers fixed-fare airport pickup and drop in ${name} with professional drivers, flight buffer time and terminal-specific instructions.</p>
<p>Unlike random street-hail taxis, Cabzii shows your <strong>${name} airport transfer</strong> fare before payment. You choose sedan, SUV or Innova based on luggage and passengers. Driver contact is shared before arrival so you can coordinate at the pickup gate.</p>`,
    "local-taxi": `<p><strong>Local taxi ${name}</strong> covers point-to-point city rides and hourly packages for errands that do not fit a single drop. From hospital visits and shopping runs to wedding logistics and corporate multi-stop meetings, a local cab on Cabzii gives you predictable pricing without haggling.</p>
<p>Riders search <strong>taxi service ${name}</strong> when they need immediate availability across ${areaText}. Cabzii surfaces verified vendors with 4-hour, 8-hour and 12-hour slabs — extra km and hour rates are listed upfront.</p>`,
    "outstation-cab": `<p><strong>Outstation cab ${name}</strong> is the right choice when your trip crosses city limits — family visits, temple pilgrimages, factory audits, hill station weekends and multi-day tours. Cabzii packages include base km, driver allowance and clear rules for night charges so you are not surprised on the highway.</p>
<p>From ${name}, popular outstation searches include routes to nearby cities and pilgrimage centres. Compare sedan, SUV, Innova and tempo options for group size and luggage before you confirm.</p>`,
    "one-way-cab": `<p><strong>One way taxi ${name}</strong> lets you travel to another city without paying for the cab's return empty journey. This is ideal for relocations, one-direction airport connections, temple visits and business transfers where you do not need the same vehicle back.</p>
<p>Cabzii lists dedicated one-way fares on route pages — ${routes}. Each shows distance, travel time and starting sedan/SUV prices so you can budget accurately.</p>`
  };

  const pricing = {
    "airport-taxi": [
      ["Sedan airport drop", `${priceFrom} – ₹1,600`, "1–3 passengers, 2 bags"],
      ["SUV airport transfer", "₹1,400 – ₹2,200", "Family, extra luggage"],
      ["Innova airport cab", "₹2,000 – ₹3,200", "Premium, 6–7 passengers"],
      ["Early morning surcharge", "Shown upfront", "Book night before for 4–6 AM flights"]
    ],
    "local-taxi": [
      ["Point-to-point local ride", `${priceFrom} – ₹900`, "Short city trips"],
      ["4 hours / 40 km package", "₹1,200 – ₹1,800", "Meetings, shopping, hospital"],
      ["8 hours / 80 km package", "₹1,800 – ₹2,800", "Weddings, multi-stop tours"],
      ["12 hours package", "₹2,400 – ₹3,600", "Full wedding day logistics"]
    ],
    "outstation-cab": [
      ["Sedan outstation (per day)", "₹1,400 – ₹2,200 base + km", "Couples, solo travellers"],
      ["SUV outstation", "₹2,200 – ₹3,500 base + km", "Family highway trips"],
      ["Innova outstation", "₹3,000 – ₹4,500 base + km", "Premium long distance"],
      ["Tempo 12–17 seater", "₹3,200 – ₹6,500", "Group pilgrimage, tours"]
    ],
    "one-way-cab": [
      ["Sedan one way", "Route-based from ₹2,600", "Budget inter-city drop"],
      ["SUV one way", "Route-based from ₹3,600", "Family with luggage"],
      ["Innova one way", "Route-based from ₹4,800", "Premium inter-city"],
      ["Tolls & state tax", "Listed in fare breakdown", "Varies by highway and state"]
    ]
  };

  return `
<h2>${svc} in ${name} — book online on Cabzii</h2>
${intros[slug] || `<p>Book <strong>${svc.toLowerCase()} in ${name}</strong> with transparent fares and verified drivers on Cabzii.in.</p>`}

<h2>Benefits of booking ${svc.toLowerCase()} on Cabzii</h2>
${benefitsList(service.highlights.length ? service.highlights : [
  `Upfront fare quote for ${svc.toLowerCase()} in ${name}`,
  "Verified drivers with highway and city experience",
  "Sedan, SUV, Innova and tempo options",
  "OTP booking and WhatsApp trip support",
  "No hidden charges — inclusions shown before payment"
])}

<h2>${svc} pricing in ${name}</h2>
<p>Indicative fares below help you plan. Exact package price is always shown on Cabzii before you pay:</p>
${pricingTable(pricing[slug] || pricing["local-taxi"])}
<p><em>Fares vary by date, vehicle availability and trip details. Festival weekends and peak hours may affect pricing — book early for guaranteed availability.</em></p>

<h2>Areas we serve for ${svc.toLowerCase()} in ${name}</h2>
<p>Pickup and drop available across ${areaText}. For airport trips, mention terminal and gate. For outstation and one-way bookings, enter exact pickup address including landmark for faster driver assignment.</p>

<h2>How ${svc.toLowerCase()} booking works</h2>
<ol>
<li>Open Cabzii and search ${service.searchQuery} with pickup in ${name}</li>
<li>Select date, time and cab type matching your passengers and luggage</li>
<li>Review fare breakdown — base fare, km limits, allowances and extras</li>
<li>Confirm with mobile OTP — driver details follow on SMS / WhatsApp</li>
<li>Track support via WhatsApp if your schedule changes</li>
</ol>

<h2>Vehicle options for ${svc.toLowerCase()} in ${name}</h2>
<p><strong>Sedan (Dzire / Etios):</strong> Best value for 1–3 passengers and standard luggage. <strong>SUV (Ertiga):</strong> Comfortable for families. <strong>Innova Crysta:</strong> Premium seating for long highway legs. <strong>Tempo Traveller:</strong> Ideal for group temple trips and corporate outings. Vehicle availability is shown during search.</p>

<h2>Related services and routes from ${name}</h2>
<p>Combine your trip planning with related Cabzii pages: ${cityServiceLinks(city)}. Popular routes: ${routes || "see our routes hub"}.</p>

<h2>When to book ${svc.toLowerCase()} in advance</h2>
<p>Book at least 2–4 hours ahead for airport pickups; 12–24 hours for outstation and one-way highway departures; and 1–2 days before wedding or event hourly packages. Early booking secures your preferred vehicle class and avoids last-minute surge on peak travel days.</p>

<h2>Who should book ${svc.toLowerCase()} in ${name}?</h2>
<p>Business travellers use ${svc.toLowerCase()} for predictable pricing and GST-friendly receipts. Families prefer upfront Innova and SUV quotes for luggage-heavy trips. Senior citizens value verified drivers and door-to-door assistance. Tourists benefit from English-speaking chauffeurs familiar with ${name} landmarks. Event planners rely on hourly packages for multi-stop wedding and corporate schedules.</p>

<h2>Documents and checkpoints before your trip</h2>
<p>Keep your booking confirmation and driver contact handy. For airport ${svc.toLowerCase()}, share flight number and terminal. For outstation legs, confirm toll and state tax inclusions in the fare breakdown. Carry valid ID for interstate highway checkpoints where applicable. For night departures, verify driver allowance and night charges in the package — Cabzii lists these before payment.</p>

<h2>Book ${svc.toLowerCase()} in ${name} now</h2>
<p>Ready to travel? Tap the booking button above to search live availability, or visit ${link(`/cab-booking/${city.slug}`, `cab booking ${name}`)} for all taxi options in the city. Compare sedan, SUV and Innova fares in seconds — confirm with mobile OTP and receive driver details on WhatsApp.</p>
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
      "Chennai to Madurai connects two major Tamil Nadu hubs. Trichy–Chennai highway traffic peaks during festival seasons. Book Innova or SUV for temple visits with extended family and prasadam luggage."
  };

  return `
<h2>One way cab from ${from} to ${to}</h2>
<p>Book a <strong>one way taxi ${from} to ${to}</strong> on Cabzii with upfront sedan and SUV fares. This route covers approximately <strong>${distance}</strong> and typically takes <strong>${duration}</strong> depending on traffic, weather and rest stops. One-way pricing means you pay only for the forward journey — no confusion about return empty charges.</p>
<p>${routeNotes[slug] || `The ${from} to ${to} corridor is served daily by Cabzii partners with highway-experienced drivers. Enter your exact pickup address in ${from} and drop landmark in ${to} for accurate quotes.`}</p>

<h2>Route information — ${from} to ${to}</h2>
${pricingTable([
  ["Road distance", distance, "Approximate highway km"],
  ["Travel time", duration, "Excluding long meal breaks"],
  ["Sedan one way from", sedan, "Dzire / Etios — 1–3 passengers"],
  ["SUV / Innova from", suv, "Family, extra luggage, groups"]
])}
<p>Tolls, state permits and parking (if any) are shown in the Cabzii fare breakdown before payment. Night departures may include driver allowance — always review inclusions on the booking screen.</p>

<h2>Why book ${from} to ${to} cab on Cabzii?</h2>
${benefitsList([
  `Fixed one-way fare quote for ${from} → ${to} before you pay`,
  "Highway-experienced drivers familiar with the route",
  "Sedan, SUV, Innova and tempo options for every group size",
  "OTP-secured booking with WhatsApp support",
  "No hidden return charges — true one-way pricing",
  "Easy reverse booking for return legs when needed"
])}

<h2>Best time to travel ${from} to ${to}</h2>
<p>Early morning (5–7 AM) departures help you avoid city congestion in ${from}. Weekday mid-morning runs are smoother on highways; Friday evenings and long weekends see heavier traffic. For temple destinations, plan arrival before peak darshan hours. Monsoon months may add 30–60 minutes — build buffer into your schedule.</p>

<h2>Vehicle guide for ${from} to ${to}</h2>
<p><strong>Sedan:</strong> Most economical for 1–3 riders with standard luggage. <strong>SUV (Ertiga):</strong> Better for families and child seats. <strong>Innova Crysta:</strong> Premium comfort on ${duration} drives. <strong>Tempo Traveller:</strong> Choose 12–17 seater for group pilgrimage or corporate outings. Select vehicle based on passengers, bags and comfort preference for the ${distance} journey.</p>

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
<p>Ready to travel? Use the booking button above to get your live fare for ${from} to ${to}. Compare sedan and SUV options, confirm with OTP and receive driver details before departure. Need a return leg later? Book ${link(`/routes/${reverse}`, `${to} to ${from} cab`)} separately or explore ${link(`/services/outstation-cab/${fromCity.slug}`, `round-trip outstation packages from ${from}`)}.</p>
`;
}

export function getCityLandingBody(city, variant = "cab") {
  if (variant !== "cab" || !LOCAL_CITIES.has(city.slug)) return "";
  return buildCityCabBody(city);
}

export function getServiceLandingBody(service, city) {
  if (!PRIORITY_SERVICES.has(service.slug)) return "";
  if (city.slug === "chennai" || LOCAL_CITIES.has(city.slug)) {
    return buildServiceBody(service, city);
  }
  return "";
}

export function getRouteLandingBody(route) {
  if (!shouldGenerateRouteBody(route)) return "";
  return buildRouteBody(route);
}

export function mergeLandingBody(existing, generated) {
  if (existing?.trim()) return existing;
  return generated || "";
}
