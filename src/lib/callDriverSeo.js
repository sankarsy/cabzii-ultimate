import { CALL_DRIVER_SERVICES } from "./callDriver";

export const CALL_DRIVER_SEO_IDS = CALL_DRIVER_SERVICES.map((s) => s.id);

export const DEFAULT_CALL_DRIVER_SEO = {
  local: {
    seoTitle: "Local Call Driver Chennai | Driver for Your Own Car | Cabzii",
    seoDescription:
      "Book a local Call Driver in Chennai for your own car. 4-hour city trips, OTP booking, and a professional driver assigned after you confirm.",
    heading: "Local call driver in Chennai for your own car",
    html: `<p>A Cabzii local Call Driver is a professional chauffeur for <strong>your car</strong> — city trips, office days, shopping and hospital visits in Chennai. You do not hire a Cabzii cab. You keep the vehicle; we assign a driver after you confirm.</p>
<p>The usual city package starts at <strong>4 hours</strong>. Choose Standard or Premium at booking. Extra hours and night charges follow the published Call Driver tariff. Confirm the fare on the form above before you pay.</p>
<h3>When to book a local driver</h3>
<ul>
<li>Multi-stop days in Maduravoyal, Porur, Anna Nagar, T. Nagar, OMR or ECR</li>
<li>You prefer not to drive in traffic but want to use your own car</li>
<li>You need a driver for a few hours, not a full outstation day</li>
</ul>
<p>Need a Cabzii vehicle instead? Open <a href="/cab-booking/chennai">cab booking Chennai</a> or the <a href="/tariff">Chennai tariff</a>. For a driver on a highway trip in your car, use <a href="/call-driver/book?service=outstation">outstation Call Driver</a>.</p>`,
    faqs: [
      ["How many hours is a local Call Driver booking?", "The local package starts at 4 hours. Extra hours are billed as shown when you calculate the fare."],
      ["Do I get a Cabzii car with this booking?", "No. Call Driver is chauffeur-only. You provide the car. For a cab with driver, book on Cabzii Cabs."]
    ]
  },
  outstation: {
    seoTitle: "Outstation Call Driver Chennai | Highway Driver for Your Car | Cabzii",
    seoDescription:
      "Hire an outstation Call Driver for your own car from Chennai. Full-day highway trips, food and stay for the driver as per tariff, OTP booking.",
    heading: "Outstation call driver from Chennai",
    html: `<p>Outstation Call Driver is for <strong>highway trips in your own car</strong> — Tirupati, Pondicherry, Bengaluru, Madurai and other corridors. Cabzii assigns a professional driver after you confirm. You do not pick a named driver from a public list.</p>
<p>The outstation package is typically a <strong>full day (12 hours)</strong>. Long-distance days follow the Call Driver tariff. Food and accommodation for the driver are the customer's responsibility, as shown on the fare step.</p>
<h3>Outstation vs one-way cab</h3>
<p>If you need a Cabzii vehicle for a one-way drop, book a cab on the matching route page (for example <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>). If you want to travel in <em>your</em> car with a Cabzii driver, stay on this page.</p>
<p>City-only hours belong on <a href="/call-driver/book?service=local">local Call Driver</a>. Airport pickup or drop in your car: <a href="/call-driver/book?service=airport">airport Call Driver</a>.</p>`,
    faqs: [
      ["Is food and hotel for the driver included?", "No. The fare note on the quote step states that food and stay for the driver are your responsibility on outstation trips."],
      ["Can I book a round trip in my own car?", "Yes. Add the return date if you know it, then calculate the fare. The same driver is assigned after confirmation."]
    ]
  },
  airport: {
    seoTitle: "Airport Call Driver Chennai | Driver for Airport Pickup in Your Car | Cabzii",
    seoDescription:
      "Book an airport Call Driver in Chennai — chauffeur for your own car at MAA pickup or drop. Not an airport taxi. OTP booking on Cabzii.",
    heading: "Airport call driver — your car at Chennai airport",
    html: `<p>Airport Call Driver is <strong>driver-only</strong> pickup or drop at Chennai International Airport (MAA) in <em>your</em> vehicle. It is not an airport taxi and not a Cabzii cab waiting at the terminal.</p>
<p>Use this when someone should collect your car from home, drive to the airport, or bring the car to arrivals. Minimum hours follow the airport Call Driver tariff (usually 4 hours).</p>
<p>If you need a Cabzii taxi to or from the airport, book <a href="/services/airport-taxi/chennai">Chennai airport taxi</a> instead. Acting-driver city guide: <a href="/acting-driver/chennai">acting driver in Chennai</a>.</p>`,
    faqs: [
      ["Is this the same as airport taxi?", "No. Airport taxi is a Cabzii cab. Airport Call Driver is a chauffeur for the car you already own."],
      ["Which airport is covered?", "Chennai International Airport (MAA) is the default. Enter the exact terminal or pickup note in the form."]
    ]
  },
  school: {
    seoTitle: "Monthly Call Driver Chennai | School & Regular Driver Quote | Cabzii",
    seoDescription:
      "Request a quote for a monthly or school Call Driver in Chennai. Cabzii assigns a professional driver after you confirm — not a public driver list.",
    heading: "Monthly and school call driver in Chennai",
    html: `<p>Monthly Call Driver is for <strong>regular school, personal or household</strong> driving in your own car. This service is <strong>quote-only</strong> — Cabzii reviews shift, working days and location, then confirms a rate. You do not pick a driver from a website directory.</p>
<p>Share school name or pickup address, morning/evening shift, and working days per month. After you submit, our team follows up on WhatsApp or phone.</p>
<p>One-off city hours: <a href="/call-driver/book?service=local">local Call Driver</a>. Office retainers: <a href="/call-driver/book?service=corporate">corporate Call Driver</a>.</p>`,
    faqs: [
      ["Why is there no instant fare?", "Monthly and school work depends on shift, days and area. Cabzii sends a quote after you submit the form."],
      ["Can I choose the same driver every day?", "Assignment is managed by Cabzii. We can note a preference, but availability and replacements stay with operations."]
    ]
  },
  corporate: {
    seoTitle: "Corporate Call Driver Chennai | Office & Event Drivers | Cabzii",
    seoDescription:
      "Request corporate Call Driver service in Chennai for offices and events. Quote-based. Professional drivers assigned after confirmation.",
    heading: "Corporate call driver for offices and events",
    html: `<p>Corporate Call Driver covers <strong>office travel, staff cars and event fleets</strong> using your vehicles. Pricing is quoted from the number of drivers, days and working hours you enter. Cabzii assigns professionals after you confirm — there is no public driver marketplace.</p>
<p>Enter company name, contact person and the requirement (daily office, visiting guests, or a one-day event). Our team replies with a quote.</p>
<p>Related: <a href="/call-driver/book?service=valet">valet drivers for functions</a> and <a href="/cab-booking/chennai">cab booking Chennai</a> if you also need Cabzii vehicles.</p>`,
    faqs: [
      ["How fast is the quote?", "Submit the form with company contact details. Cabzii follows up during operating hours on phone or WhatsApp."],
      ["Can you supply several drivers on one date?", "Yes. Set drivers needed and days, then send the request. Assignment is confirmed after the quote."]
    ]
  },
  valet: {
    seoTitle: "Valet Call Driver Chennai | Event Parking Drivers | Cabzii",
    seoDescription:
      "Book valet Call Drivers for events in Chennai. Minimum hours and supervisor planning as per tariff. Drivers assigned after you confirm.",
    heading: "Valet call drivers for events and functions",
    html: `<p>Valet Call Driver is for <strong>functions, weddings and events</strong> where guests need professional drivers to park and return cars. Cabzii plans drivers and supervisors from the tariff (one supervisor for every 10 drivers). You do not hire named drivers off a public list.</p>
<p>Minimum hours apply (typically 5). Extra hours follow the valet tariff. Enter the event location in notes if it is not the pickup field.</p>
<p>Need a cab for the host family instead? Use <a href="/cabs">Cabzii cabs</a>. For a single chauffeur in your own car, book <a href="/call-driver/book?service=local">local Call Driver</a>.</p>`,
    faqs: [
      ["How many supervisors do I get?", "The fare step shows supervisor count from the tariff — typically one supervisor for every 10 valet drivers."],
      ["What is the minimum booking?", "Valet starts at the published minimum hours on the Call Driver tariff, usually 5 hours."]
    ]
  }
};

function normalizeFaqs(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => {
      if (Array.isArray(item) && item[0] && item[1]) return [String(item[0]).trim(), String(item[1]).trim()];
      if (item?.question && item?.answer) return [String(item.question).trim(), String(item.answer).trim()];
      return null;
    })
    .filter(Boolean);
}

export function emptyCallDriverSeo() {
  return { heading: "", seoTitle: "", seoDescription: "", html: "", faqs: [] };
}

/** Admin override wins when a field is non-empty; otherwise default copy. */
export function resolveCallDriverSeo(serviceId, adminMap = {}) {
  const id = String(serviceId || "");
  const def = DEFAULT_CALL_DRIVER_SEO[id] || emptyCallDriverSeo();
  const over = adminMap && typeof adminMap === "object" ? adminMap[id] || {} : {};
  const html = String(over.html || "").trim() || def.html || "";
  const faqs = normalizeFaqs(over.faqs?.length ? over.faqs : def.faqs);
  return {
    heading: String(over.heading || "").trim() || def.heading || "",
    seoTitle: String(over.seoTitle || "").trim() || def.seoTitle || "",
    seoDescription: String(over.seoDescription || "").trim() || def.seoDescription || "",
    html,
    faqs
  };
}
