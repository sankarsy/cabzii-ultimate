/** Unique Chennai cab-booking guide — matches live hub copy, not a keyword dump. */

export const CHENNAI_GUIDE_SLUG = "cab-booking-in-chennai-complete-guide-2026";

export const CHENNAI_GUIDE_H1 = "Chennai cab booking guide";

export const CHENNAI_GUIDE_LEAD =
  "Book local, hourly, airport and outstation cabs in Chennai on Cabzii. Fares show before you pay. Fuel and driver are included. Tolls extra unless listed.";

export const CHENNAI_GUIDE_FAQS = [
  [
    "How do I book a cab in Chennai?",
    "Open /chennai, enter pickup and drop, choose local, airport or outstation, compare Hatchback, Sedan, SUV or Tempo Traveller, then pay the published 50% advance. Driver details follow after confirmation."
  ],
  [
    "Are package fares exact?",
    "No. Catalog and package prices are approximate starting fares. The live quote can change with date, vehicle, extra km, tolls and parking."
  ],
  [
    "What is acting driver in Chennai?",
    "Acting driver is a chauffeur for your own car — not a Cabzii taxi. Book Call Driver packages on /chennai/acting-driver or /call-driver."
  ],
  [
    "Can I book Chennai to Tirupati?",
    "Yes. Use the Chennai–Tirupati route page or outstation search from /chennai. Tolls extra unless listed on the quote."
  ]
];

export function chennaiCabGuideHtml() {
  return `
<h2>How cab booking in Chennai works</h2>
<p>Use the form on <a href="/chennai">cab booking Chennai</a>. Enter pickup and drop, choose local, hourly, airport or outstation, then compare vehicles. Pay 50% to confirm. Driver details follow on SMS or WhatsApp. Call <a href="tel:+919944197416">+91-9944197416</a> or email support@cabzii.com. There is no separate Cabzii app required.</p>
<ol>
<li>Enter pickup in Chennai — add from, to and date.</li>
<li>Compare Hatchback, Sedan, SUV and Tempo Traveller. Fares show before you pay.</li>
<li>Pay 50% to confirm. Apply CABZII500 for ₹500 off the first outstation trip.</li>
<li>Get assigned driver details after confirmation.</li>
</ol>

<h2>Local and hourly packages</h2>
<p>4 hour and 8 hour packages book on the same Chennai hub — they are not separate SEO pages. Prices shown are approximate starting fares. Extra km and extra hour rates are on the <a href="/tariff">published tariff</a>.</p>

<h2>Airport taxi (MAA)</h2>
<p>Pre-book pickup or drop at Chennai International Airport on <a href="/chennai/airport-cab-booking">airport cab booking Chennai</a>. Parking, tolls and extra km are extra unless listed. Cabzii assigns a driver after you confirm — this is not a walk-up airport queue.</p>

<h2>Outstation and one-way</h2>
<p>Round-trip and one-way highway trips start from <a href="/services/outstation-cab/chennai">outstation cab Chennai</a> or <a href="/services/one-way-cab/chennai">one-way cab Chennai</a>. Popular corridors: <a href="/chennai/outstation/chennai-to-tirupati">Chennai to Tirupati</a>, <a href="/chennai/outstation/chennai-to-pondicherry">Pondicherry</a>, <a href="/chennai/outstation/chennai-to-bangalore">Bengaluru</a> and <a href="/chennai/outstation/chennai-to-rameswaram">Rameswaram</a>.</p>

<h2>Acting driver for your own car</h2>
<p>Need a chauffeur in your vehicle? That is <a href="/chennai/acting-driver">acting driver Chennai</a>, booked with the same Call Driver packages as <a href="/call-driver">Call Driver</a>. It is not a Cabzii taxi.</p>
`;
}
