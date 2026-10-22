export const DEFAULT_CALL_DRIVER_PAGE = {
  title: "Book Call Driver",
  subtitle: "Need a professional driver for your own car? Choose the service you need.",
  intro:
    "You book a Cabzii Call Driver service. A professional driver is assigned after booking — you do not pick an individual driver.",
  sections: [
    {
      heading: "Call Driver for your own car",
      body: "<p>Cabzii Call Driver is for customers who already have a car and need a professional driver. Book local hours, an outstation day, or an airport chauffeur without browsing a public driver list. Cabzii assigns a professional after you confirm. For Chennai-specific areas and fare notes, use the <a href=\"/acting-driver/chennai\">acting driver in Chennai</a> page.</p>"
    },
    {
      heading: "How to book",
      body: "<ol><li>Choose the Call Driver service you need</li><li>Enter date, time, pickup and vehicle details</li><li>Review the estimated fare (or request a quote for monthly and corporate work)</li><li>Confirm the booking — Cabzii assigns an available driver</li></ol>"
    },
    {
      heading: "Outstation, airport, monthly and corporate",
      body: "<p>Outstation Call Driver covers full-day highway trips in your vehicle. Airport Call Driver is chauffeur-only pickup or drop — not an airport taxi. Monthly and school pickup requests are quoted. Corporate Call Driver is for offices, events and regular staff transport. Valet parking can be booked for functions with supervisor planning.</p>"
    },
    {
      heading: "Safety and professional drivers",
      body: "<p>Drivers are operational resources managed by Cabzii. We can replace a driver if needed, cover availability gaps, and keep personal driver records in the admin panel rather than on the public website. Cabzii does not publish a public list of named drivers.</p>"
    },
    {
      heading: "Related Chennai bookings",
      body: "<p>Need a Cabzii vehicle as well? Use <a href=\"/cab-booking/chennai\">cab booking Chennai</a> or <a href=\"/chennai/airport-cab-booking\">Chennai airport taxi</a>. City guide: <a href=\"/acting-driver/chennai\">acting driver in Chennai</a>. Published cab rates: <a href=\"/tariff\">tariff</a>.</p>"
    }
  ],
  services: {}
};

export function mergeCallDriverPage(stored) {
  const src = stored && typeof stored === "object" ? stored : {};
  const sections = Array.isArray(src.sections) && src.sections.length ? src.sections : DEFAULT_CALL_DRIVER_PAGE.sections;
  return {
    title: String(src.title || "").trim() || DEFAULT_CALL_DRIVER_PAGE.title,
    subtitle: String(src.subtitle || "").trim() || DEFAULT_CALL_DRIVER_PAGE.subtitle,
    intro: String(src.intro || "").trim() || DEFAULT_CALL_DRIVER_PAGE.intro,
    sections: sections.map((row) => ({
      heading: String(row?.heading || "").trim(),
      body: String(row?.body || "").trim()
    })),
    services: src.services && typeof src.services === "object" ? src.services : {}
  };
}

export function emptyCallDriverSection() {
  return { heading: "", body: "" };
}
