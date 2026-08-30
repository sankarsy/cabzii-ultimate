/**
 * Unique copy for existing featured route URLs only.
 * Distances and starting fares come from the route object — do not invent numbers.
 */

import { cityBySlug } from "./cities";

function inr(n) {
  const num = Number(n);
  if (!Number.isFinite(num) || num <= 0) return null;
  return `₹${num.toLocaleString("en-IN")}`;
}

function fareLine(route) {
  const sedan = inr(route.sedanFrom);
  const suv = inr(route.suvFrom);
  if (sedan && suv) {
    return `Indicative one-way starting fares on this page: sedan from ${sedan}, SUV/Innova from ${suv}. The live quote on Cabzii can differ by date, vehicle and extras.`;
  }
  return "Indicative fares are shown on this page. Confirm the live quote before payment.";
}

const UNIQUE = {
  "chennai-to-tirupati-cab": (route) => `
<h2>Chennai to Tirupati cab for darshan</h2>
<p>This is one of Cabzii’s highest-demand one-way corridors. Families often leave Chennai before dawn so they can reach Tirumala queue complexes in time. The road distance on this page is <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong> in clear traffic. ${fareLine(route)}</p>
<p>Book a <strong>one-way cab</strong> when you will stay in Tirupati or return by another vehicle. Book a <strong>round-trip outstation package</strong> when the same cab should wait or bring you back to Chennai — that product lives on <a href="/services/outstation-cab/chennai">outstation cab Chennai</a>, not as a second URL.</p>

<h2>Pickup, drop and vehicle choice</h2>
<p>Pickup can be a Chennai home, hotel, OMR office or <a href="/services/airport-taxi/chennai">MAA airport</a>. Drop landmarks in Tirupati include Alipiri, city hotels and the railway station — enter the exact pin at booking. Sedan (Dzire / Amaze) suits 1–3 passengers; Ertiga and Innova are common when elders and luggage travel together. Group darshan with more seats: <a href="/services/tempo-traveller/chennai">Tempo Traveller Chennai</a>.</p>
<p>Tolls, parking and driver batta treatment are listed in the fare breakdown before you pay. Do not assume they are always included.</p>

<h2>Related pilgrimage travel</h2>
<p>Same-intent searches (Tirupati taxi, Chennai Tirupati car rental, one-way darshan cab) stay on this URL. Temple packages with itinerary: <a href="/holidays?category=pilgrimage">pilgrimage packages</a>. Acting driver in your own car: <a href="/acting-driver/chennai">acting driver Chennai</a>.</p>
`,

  "chennai-to-pondicherry-cab": (route) => `
<h2>Chennai to Pondicherry (Puducherry) cab</h2>
<p>Weekend ECR trips are a core Chennai one-way product. Distance on this page: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Many riders stop at Mahabalipuram or coastal resorts — mention extra waiting in notes if you need the same cab to wait; otherwise a one-way drop is enough.</p>
<p>Round-trip with the same vehicle is an <a href="/services/outstation-cab/chennai">outstation package</a> (cars have a 250 km outstation minimum on the published tariff). One-way is this route page.</p>

<h2>Pickup and drop</h2>
<p>Typical pickups: Adyar, ECR, OMR, T. Nagar, airport. Drops: White Town, Auroville road, Promenade hotels. Enter the landmark so the driver is not guessing the last kilometre. Sedan is the usual weekend choice; Innova if you have beach bags and children.</p>
`,

  "chennai-to-bangalore-cab": (route) => `
<h2>Chennai to Bengaluru (Bangalore) cab</h2>
<p>This is a business and family highway corridor, not a sightseeing hop. Distance on this page: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong> on NH48 via Krishnagiri, excluding long meal stops. ${fareLine(route)}</p>
<p>One-way suits office transfers and one-way relocation. If the cab must return or wait, use <a href="/services/outstation-cab/chennai">outstation cab Chennai</a>. Airport connections: <a href="/services/airport-taxi/chennai">MAA</a> and <a href="/services/airport-taxi/bengaluru">BLR airport taxi</a>.</p>
<p>Innova is common for corporate luggage. Toll plazas apply — see the quote line items. The canonical slug uses “bangalore”; chennai-to-bengaluru-cab 301s here.</p>
`,

  "chennai-to-kanchipuram-cab": (route) => `
<h2>Chennai to Kanchipuram cab</h2>
<p>A short temple corridor: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Same-day darshan at Kamakshi / Ekambareswarar is common; many riders still book one-way if they will stay overnight.</p>
<p>Kanchipuram has no commercial passenger airport — visitors usually fly into MAA then take this cab. Round-trip wait: <a href="/services/outstation-cab/chennai">outstation cab Chennai</a>. Packages: <a href="/holidays?category=pilgrimage">pilgrimage holidays</a>.</p>
`,

  "chennai-to-tiruvannamalai-cab": (route) => `
<h2>Chennai to Tiruvannamalai cab</h2>
<p>Girivalam and Arunachaleswarar visits drive this route. Distance: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Pournami weekends fill vehicles early — book the date you actually travel.</p>
<p>No local commercial airport; MAA is the usual air gateway. One-way vs waiting cab: compare this page with <a href="/services/outstation-cab/chennai">outstation Chennai</a>. Related: <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>.</p>
`,

  "chennai-to-rameswaram-cab": (route) => `
<h2>Chennai to Rameswaram pilgrimage cab</h2>
<p>A long temple run: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>, including the Pamban approach. ${fareLine(route)} Published outstation cars use a 250 km minimum plus extra km — the live quote is the number to trust, not a headline “from” figure alone.</p>
<p>Many families split the journey via Trichy or Madurai. Shorter temple hop: <a href="/routes/madurai-to-rameswaram-cab">Madurai to Rameswaram</a>. Group vehicle: <a href="/services/tempo-traveller/chennai">Tempo Traveller</a>. Itineraries: <a href="/holidays?category=pilgrimage">pilgrimage packages</a>.</p>
`,

  "chennai-to-madurai-cab": (route) => `
<h2>Chennai to Madurai cab</h2>
<p>Meenakshi temple and family visits: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Festival weeks are slower; leave early from Chennai.</p>
<p>Continue to Rameswaram or Kanyakumari from Madurai on the existing route pages rather than inventing extra URLs. Airport at either end: MAA or <a href="/services/airport-taxi/madurai">Madurai airport taxi</a>.</p>
`,

  "chennai-to-kanyakumari-cab": (route) => `
<h2>Chennai to Kanyakumari cab</h2>
<p>A full-day-plus highway: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} This is rarely a casual same-day return in a sedan without a planned halt.</p>
<p>Shorter last leg: <a href="/routes/madurai-to-kanyakumari-cab">Madurai to Kanyakumari</a>. Group travel: Tempo Traveller from Chennai. Round-trip wait belongs on <a href="/services/outstation-cab/chennai">outstation cab</a>.</p>
`,

  "chennai-to-ooty-cab": (route) => `
<h2>Chennai to Ooty (Udhagamandalam) cab</h2>
<p>Hill station transfer: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>, usually via Salem–Coimbatore then the ghat. ${fareLine(route)} Ghat driving is slower than the highway average — the duration on this page is indicative.</p>
<p>Shorter hill hop: <a href="/routes/coimbatore-to-ooty-cab">Coimbatore to Ooty</a>. Many riders fly or train to Coimbatore then take that cab. SUV/Innova is the usual ask for ghats and luggage.</p>
`,

  "madurai-to-rameswaram-cab": (route) => `
<h2>Madurai to Rameswaram cab</h2>
<p>Same-day temple pairing is the commercial intent: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong> one way. ${fareLine(route)} Pamban bridge traffic can add time; this is not a city hop.</p>
<p>Start from Chennai instead: <a href="/routes/chennai-to-rameswaram-cab">Chennai to Rameswaram</a>. Madurai airport: <a href="/services/airport-taxi/madurai">airport taxi Madurai</a>.</p>
`,

  "madurai-to-kanyakumari-cab": (route) => `
<h2>Madurai to Kanyakumari cab</h2>
<p>Temple-to-coast: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Useful after Meenakshi darshan when you do not want a Chennai-origin full run.</p>
<p>Related: <a href="/routes/chennai-to-kanyakumari-cab">Chennai to Kanyakumari</a>, <a href="/cab-booking/madurai">cab booking Madurai</a>.</p>
`,

  "coimbatore-to-ooty-cab": (route) => `
<h2>Coimbatore to Ooty cab</h2>
<p>The usual hill transfer from CJB / city: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong> including ghat. ${fareLine(route)} Mettupalayam is a common approach; exact timing depends on weather and tourist traffic.</p>
<p>Coimbatore airport taxi: <a href="/services/airport-taxi/coimbatore">CJB airport</a>. Longer origin: <a href="/routes/chennai-to-ooty-cab">Chennai to Ooty</a>.</p>
`,

  "bengaluru-to-tirupati-cab": (route) => `
<h2>Bengaluru to Tirupati cab</h2>
<p>Darshan corridor from Karnataka: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Early starts are common, same as the Chennai origin trip.</p>
<p>Chennai origin: <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>. Bengaluru airport: <a href="/services/airport-taxi/bengaluru">BLR taxi</a>. Cab hub: <a href="/cab-booking/bengaluru">cab booking Bengaluru</a>.</p>
`,

  "bengaluru-to-mysore-cab": (route) => `
<h2>Bengaluru to Mysore cab</h2>
<p>A short, high-frequency leisure and family route: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)}</p>
<p>One-way drop vs same-cab return: use this page for one-way; round-trip wait is <a href="/services/outstation-cab/bengaluru">outstation cab Bengaluru</a>. Related: <a href="/cab-booking/mysore">cab booking Mysore</a>.</p>
`,

  "chennai-to-trichy-cab": (route) => `
<h2>Chennai to Trichy (Tiruchirappalli) cab</h2>
<p>Srirangam, Rock Fort and hospital visits: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)}</p>
<p>Trichy airport: <a href="/services/airport-taxi/trichy">TRZ taxi</a>. Continue south: <a href="/routes/chennai-to-madurai-cab">Chennai to Madurai</a>.</p>
`
};

export function featuredRouteUniqueHtml(route) {
  if (!route?.slug) return "";
  const fn = UNIQUE[route.slug];
  if (!fn) return "";
  const fromSlug = route.fromCity?.slug || route.from || "";
  const toSlug = route.toCity?.slug || route.to || "";
  const from = route.fromCity?.name || cityBySlug(fromSlug)?.name || "";
  const to = route.toCity?.name || cityBySlug(toSlug)?.name || "";
  const reverse = toSlug && fromSlug ? `${toSlug}-to-${fromSlug}-cab` : "";
  return `${fn(route)}
<h2>How to book ${from} to ${to} on Cabzii</h2>
<ol>
<li>Use the booking widget on this page or search Cabs with pickup in ${from} and drop in ${to}</li>
<li>Compare sedan, SUV/Innova or Tempo when listed</li>
<li>Read toll, parking and batta line items before payment</li>
<li>Confirm — driver details follow by SMS or WhatsApp</li>
</ol>
<p>Related: ${fromSlug ? `<a href="/cab-booking/${fromSlug}">cab booking ${from}</a>` : "cab booking"} · ${fromSlug ? `<a href="/services/one-way-cab/${fromSlug}">one-way cab ${from}</a>` : ""} · ${fromSlug ? `<a href="/services/outstation-cab/${fromSlug}">round-trip / outstation from ${from}</a>` : ""} · ${reverse ? `<a href="/routes/${reverse}">${to} to ${from} cab</a>` : ""}</p>
`;
}
