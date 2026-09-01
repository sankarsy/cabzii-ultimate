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
<p>Trichy airport: <a href="/services/airport-taxi/trichy">TRZ taxi</a>. Continue south: <a href="/routes/chennai-to-madurai-cab">Chennai to Madurai</a>. Tirupati from Trichy: <a href="/routes/trichy-to-tirupati-cab">Trichy to Tirupati cab</a>.</p>
`,

  "chennai-to-palani-cab": (route) => `
<h2>Chennai to Palani cab</h2>
<p>Murugan temple corridor: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Same-day return is long; many families stay overnight near the hill.</p>
<p>Related pilgrimage: <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>, <a href="/holidays?category=pilgrimage">pilgrimage packages</a>. Round-trip wait: <a href="/services/outstation-cab/chennai">outstation cab Chennai</a>.</p>
`,

  "chennai-to-chidambaram-cab": (route) => `
<h2>Chennai to Chidambaram cab</h2>
<p>Nataraja temple visits: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Often combined with coastal temple stops — mention extra waiting if the same cab should wait.</p>
<p>Nearby devotion: <a href="/routes/chennai-to-velankanni-cab">Chennai to Velankanni</a>, <a href="/cab-booking/chidambaram">cab booking Chidambaram</a>.</p>
`,

  "chennai-to-velankanni-cab": (route) => `
<h2>Chennai to Velankanni cab</h2>
<p>Basilica pilgrimage: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Festival weeks fill vehicles early; book the date you travel.</p>
<p>Related pilgrimage: <a href="/routes/chennai-to-chidambaram-cab">Chennai to Chidambaram</a>. Airport origin: <a href="/services/airport-taxi/chennai">MAA taxi</a>. Cab hub: <a href="/cab-booking/velankanni">cab booking Velankanni</a>.</p>
`,

  "chennai-to-thiruchendur-cab": (route) => `
<h2>Chennai to Thiruchendur cab</h2>
<p>Seashore Murugan temple run: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} This is a long coastal corridor, not a city hop.</p>
<p>Shorter south origin: Madurai or Thoothukudi hubs. Related: <a href="/routes/chennai-to-kanyakumari-cab">Chennai to Kanyakumari</a>, <a href="/services/airport-taxi/thoothukudi">Tuticorin airport taxi</a>.</p>
`,

  "chennai-to-kumbakonam-cab": (route) => `
<h2>Chennai to Kumbakonam cab</h2>
<p>Temple-town corridor: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Mahamaham and festival dates are slower; leave early from Chennai.</p>
<p>Pair with <a href="/routes/chennai-to-thanjavur-cab">Chennai to Thanjavur</a> rather than extra URLs. Acting driver in your car: <a href="/acting-driver/chennai">acting driver Chennai</a>.</p>
`,

  "chennai-to-thanjavur-cab": (route) => `
<h2>Chennai to Thanjavur (Tanjore) cab</h2>
<p>Brihadeeswarar and family visits: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)}</p>
<p>Related: <a href="/routes/chennai-to-kumbakonam-cab">Chennai to Kumbakonam</a>, <a href="/routes/chennai-to-trichy-cab">Chennai to Trichy</a> for Srirangam. Cab hub: <a href="/cab-booking/thanjavur">cab booking Thanjavur</a>.</p>
`,

  "trichy-to-tirupati-cab": (route) => `
<h2>Trichy (Tiruchirappalli) to Tirupati cab</h2>
<p>Darshan corridor from central Tamil Nadu: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Early starts are common so families can reach queue complexes in time.</p>
<p>TRZ airport pickup: <a href="/services/airport-taxi/trichy">Trichy airport taxi</a>. Other origins: <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>, <a href="/routes/madurai-to-tirupati-cab">Madurai to Tirupati</a>. Return: <a href="/routes/tirupati-to-chennai-cab">Tirupati to Chennai</a> if you are heading to the coast, not back to Trichy.</p>
`,

  "madurai-to-tirupati-cab": (route) => `
<h2>Madurai to Tirupati cab</h2>
<p>Temple-to-temple highway: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Meenakshi visitors who continue to Tirumala use this one-way rather than a Chennai-origin run.</p>
<p>Madurai airport: <a href="/services/airport-taxi/madurai">IXM taxi</a>. Related: <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>, <a href="/routes/madurai-to-rameswaram-cab">Madurai to Rameswaram</a>.</p>
`,

  "coimbatore-to-tirupati-cab": (route) => `
<h2>Coimbatore to Tirupati cab</h2>
<p>West Tamil Nadu darshan corridor: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)}</p>
<p>CJB airport: <a href="/services/airport-taxi/coimbatore">Coimbatore airport taxi</a>. Hill split: <a href="/routes/coimbatore-to-ooty-cab">Coimbatore to Ooty</a> is a different product. Reverse Karnataka origin: <a href="/routes/bengaluru-to-tirupati-cab">Bengaluru to Tirupati</a>.</p>
`,

  "salem-to-tirupati-cab": (route) => `
<h2>Salem to Tirupati cab</h2>
<p>NH corridor for darshan: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Useful when you fly into Salem (SXV) or start from the city rather than Chennai.</p>
<p>Salem airport taxi: <a href="/services/airport-taxi/salem">SXV taxi</a>. Nearby: <a href="/routes/vellore-to-tirupati-cab">Vellore to Tirupati</a>, <a href="/cab-booking/salem">cab booking Salem</a>.</p>
`,

  "vellore-to-tirupati-cab": (route) => `
<h2>Vellore to Tirupati cab</h2>
<p>A short pilgrimage hop: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Vellore has no commercial passenger airport — most air arrivals use MAA or TIR then this road.</p>
<p>Related: <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>, <a href="/cab-booking/vellore">cab booking Vellore</a>, <a href="/services/airport-taxi/tirupati">Tirupati airport taxi</a>.</p>
`,

  "pondicherry-to-tirupati-cab": (route) => `
<h2>Pondicherry (Puducherry) to Tirupati cab</h2>
<p>Coastal-to-hills darshan: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)}</p>
<p>PNY airport: <a href="/services/airport-taxi/pondicherry">Pondicherry airport taxi</a>. Related: <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>, <a href="/routes/kanchipuram-to-tirupati-cab">Kanchipuram to Tirupati</a>.</p>
`,

  "kanchipuram-to-tirupati-cab": (route) => `
<h2>Kanchipuram to Tirupati cab</h2>
<p>Temple-to-Tirumala corridor: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Same-day pairing is common; overnight stays in Tirupati use one-way on this page.</p>
<p>Kanchipuram has no commercial airport — typical air gateway is MAA then <a href="/routes/chennai-to-kanchipuram-cab">Chennai to Kanchipuram</a>. Reverse: continue from Tirupati on <a href="/routes/tirupati-to-chennai-cab">Tirupati to Chennai</a>.</p>
`,

  "tirupati-to-chennai-cab": (route) => `
<h2>Tirupati to Chennai cab</h2>
<p>Return darshan corridor: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)} Book this one-way when you arrived by another vehicle or flight into TIR and need a drop in Chennai city, OMR or MAA.</p>
<p>Opposite direction: <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>. Airports: <a href="/services/airport-taxi/tirupati">TIR taxi</a>, <a href="/services/airport-taxi/chennai">MAA taxi</a>.</p>
`,

  "tirupati-to-bengaluru-cab": (route) => `
<h2>Tirupati to Bengaluru (Bangalore) cab</h2>
<p>Return corridor into Karnataka: <strong>${route.distance}</strong>, typically <strong>${route.duration}</strong>. ${fareLine(route)}</p>
<p>Opposite: <a href="/routes/bengaluru-to-tirupati-cab">Bengaluru to Tirupati</a>. BLR drop: <a href="/services/airport-taxi/bengaluru">Bengaluru airport taxi</a>. TIR pickup: <a href="/services/airport-taxi/tirupati">Tirupati airport taxi</a>.</p>
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
