/**
 * Chennai Slice 1 — one intent → one existing URL.
 * Commercial priority (booking value): airport, outstation/one-way routes,
 * local 4/8hr packages, acting driver, Tempo Traveller, pilgrimage packages.
 * Do not add new App Router paths from this file.
 */

export { chennaiServiceUniqueHtml } from "./chennaiServiceContent";

export const CHENNAI_MONEY_LINKS = [
  { href: "/cab-booking/chennai", label: "Cab booking in Chennai", intent: "cab" },
  { href: "/services/airport-taxi/chennai", label: "Chennai airport taxi", intent: "airport" },
  { href: "/services/hourly-rental/chennai", label: "Hourly / full-day taxi", intent: "local" },
  { href: "/services/outstation-cab/chennai", label: "Outstation cab Chennai", intent: "outstation" },
  { href: "/services/one-way-cab/chennai", label: "One-way cab from Chennai", intent: "one-way" },
  { href: "/services/car-rental/chennai", label: "Car rental (with driver)", intent: "rental" },
  { href: "/acting-driver/chennai", label: "Acting driver in Chennai", intent: "driver" },
  { href: "/call-driver", label: "Book Call Driver", intent: "book-driver" },
  { href: "/services/tempo-traveller/chennai", label: "Tempo Traveller Chennai", intent: "tempo" },
  { href: "/tariff", label: "Chennai cab tariff", intent: "tariff" },
  { href: "/holidays?category=pilgrimage", label: "Pilgrimage packages", intent: "pilgrimage" },
  { href: "/holidays", label: "Holiday packages", intent: "tours" },
  { href: "/routes/chennai-to-tirupati-cab", label: "Chennai to Tirupati cab", intent: "route" },
  { href: "/routes/chennai-to-pondicherry-cab", label: "Chennai to Pondicherry cab", intent: "route" },
  { href: "/routes/chennai-to-bangalore-cab", label: "Chennai to Bengaluru cab", intent: "route" },
  { href: "/routes/chennai-to-kanchipuram-cab", label: "Chennai to Kanchipuram cab", intent: "route" },
  { href: "/routes/chennai-to-rameswaram-cab", label: "Chennai to Rameswaram cab", intent: "route" }
];

export const CHENNAI_KEYWORD_URL_MAP = [
  { keyword: "cab booking Chennai", url: "/cab-booking/chennai" },
  { keyword: "taxi booking Chennai", url: "/cab-booking/chennai" },
  { keyword: "local taxi Chennai", url: "/services/local-taxi/chennai" },
  { keyword: "hourly cab Chennai", url: "/services/hourly-rental/chennai" },
  { keyword: "full day taxi Chennai", url: "/services/hourly-rental/chennai" },
  { keyword: "car rental Chennai", url: "/services/car-rental/chennai" },
  { keyword: "cab rental Chennai", url: "/services/cab-rental/chennai" },
  { keyword: "airport taxi Chennai", url: "/services/airport-taxi/chennai" },
  { keyword: "Chennai airport cab", url: "/services/airport-taxi/chennai" },
  { keyword: "Chennai airport pickup", url: "/services/airport-taxi/chennai" },
  { keyword: "Chennai airport drop", url: "/services/airport-taxi/chennai" },
  { keyword: "airport cab booking Chennai", url: "/services/airport-taxi/chennai" },
  { keyword: "Chennai airport to city", url: "/services/airport-taxi/chennai" },
  { keyword: "round trip cab Chennai", url: "/services/outstation-cab/chennai" },
  { keyword: "outstation cab Chennai", url: "/services/outstation-cab/chennai" },
  { keyword: "one way cab Chennai", url: "/services/one-way-cab/chennai" },
  { keyword: "acting driver Chennai", url: "/acting-driver/chennai" },
  { keyword: "call driver Chennai", url: "/call-driver" },
  { keyword: "driver on hire Chennai", url: "/acting-driver/chennai" },
  { keyword: "tempo traveller Chennai", url: "/services/tempo-traveller/chennai" },
  { keyword: "cab fare Chennai", url: "/tariff" },
  { keyword: "Chennai to Tirupati cab", url: "/routes/chennai-to-tirupati-cab" },
  { keyword: "Chennai to Pondicherry cab", url: "/routes/chennai-to-pondicherry-cab" },
  { keyword: "Tirupati package", url: "/holidays?category=pilgrimage" }
];

export function chennaiCabUniqueHtml() {
  return `
<h2>How to book a cab in Chennai</h2>
<p>Enter pickup, choose local, airport or outstation, compare the package, then confirm. Driver details follow by SMS or WhatsApp. Cabzii is chauffeur-driven cab hire — not self-drive. HQ locality is Maduravoyal; pickup is city-wide when a partner cab is available.</p>
<ol>
<li>Open this page or <a href="/cabs">Cabs</a></li>
<li>Select trip type and vehicle class (Dzire, Ertiga, Innova, Tempo Traveller)</li>
<li>Read km/hour limits, extra km, batta, tolls and parking on the quote</li>
<li>Confirm — fares are shown first</li>
</ol>

<h2>Chennai airport taxi (MAA)</h2>
<p>Chennai International Airport (MAA) is one of Cabzii’s highest-demand bookings. Pre-book pickup or drop, share your terminal and flight time, and confirm the fare before payment. This is a cab with driver — not a self-drive desk. Full pickup/drop process: <a href="/services/airport-taxi/chennai">airport taxi Chennai</a>.</p>

<h2>Local, hourly and full-day cabs in Chennai</h2>
<p>OMR office days, T. Nagar shopping, hospital visits in Kilpauk or Vadapalani, and wedding logistics usually fit a 4 hour / 40 km or 8 hour / 80 km package. Extra km and extra hour rates are on the <a href="/tariff">published Chennai tariff</a>. Use <a href="/services/hourly-rental/chennai">hourly / full-day taxi Chennai</a> when you need the cab for several stops in one day.</p>

<h2>Outstation and one-way from Chennai</h2>
<p>Round-trip outstation packages suit temple weekends and family visits when the same cab should wait or return. One-way drops suit Tirupati darshan, Pondicherry weekends and Bengaluru transfers when you do not need the cab back. Compare <a href="/services/outstation-cab/chennai">outstation cab Chennai</a> with <a href="/services/one-way-cab/chennai">one-way cab from Chennai</a>, then open the route page for distance and starting fares.</p>
<p>High-demand routes: <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>, <a href="/routes/chennai-to-pondicherry-cab">Chennai to Pondicherry</a>, <a href="/routes/chennai-to-bangalore-cab">Chennai to Bengaluru</a>, <a href="/routes/chennai-to-madurai-cab">Chennai to Madurai</a>, <a href="/routes/chennai-to-trichy-cab">Chennai to Trichy</a> and <a href="/routes/chennai-to-rameswaram-cab">Chennai to Rameswaram</a>.</p>

<h2>Tempo Traveller and group travel</h2>
<p>12, 13, 14 and 18 seater Tempo Travellers are used for family pilgrimages, corporate groups and wedding guest movement. Local van packages start from the published 5 Hrs / 50 Km slab. Book via <a href="/services/tempo-traveller/chennai">Tempo Traveller Chennai</a> or compare rates on the tariff page.</p>

<h2>Acting driver for your own car</h2>
<p>If you already have a car, Cabzii Call Driver assigns a professional to drive it — local, airport chauffeur, outstation highway days, monthly/corporate quotes and valet for functions. The Chennai guide is <a href="/acting-driver/chennai">acting driver in Chennai</a>; booking starts at <a href="/call-driver">Call Driver</a>.</p>

<h2>Pilgrimage and holiday packages from Chennai</h2>
<p>Cabzii holiday packages include pilgrimage circuits (Tirupati, Rameswaram–Madurai) and hill/family trips such as Ooty–Kodaikanal. Transport origin is typically Chennai. Browse <a href="/holidays?category=pilgrimage">pilgrimage packages</a> or all <a href="/holidays">holiday packages</a>. Cab-only temple runs stay on existing route pages — there is no /pilgrimage URL tree.</p>

<h2>Indicative Chennai fares (published tariff)</h2>
<p>Swift Dzire from ₹1,200 (4 Hrs / 40 Km). Innova Crysta from ₹2,200. Tempo Traveller 12 seater from ₹3,000 (5 Hrs / 50 Km). Outstation cars: 250 km minimum (Dzire from ₹3,250). Extra km, extra hour and driver batta are on the <a href="/tariff">tariff</a>. Live quotes can vary.</p>
`;
}

export function chennaiDriverUniqueHtml() {
  return `
<h2>Acting Driver Services in Chennai</h2>
<p>An acting driver (also searched as call driver, driver on hire or chauffeur) drives <em>your</em> vehicle. Cabzii does not list public driver profiles. You choose local, outstation, airport, monthly, corporate or valet on <a href="/call-driver">Call Driver</a>, enter date, time, pickup and vehicle details, then pay Cabzii. A driver is assigned after confirmation.</p>

<h2>Hire a Driver for Your Own Car in Chennai</h2>
<p>Typical Chennai use: OMR peak-hour office days, multi-stop wedding cars, hospital visits, and outstation darshan in a family Innova or SUV so elders are not driving the highway. Pickup areas include T. Nagar, Anna Nagar, Velachery, Tambaram, OMR, ECR, Porur, Guindy and Adyar — enter the exact landmark at booking.</p>

<h2>Call Driver Service in Chennai</h2>
<p>Call Driver is the booking product. Local city trips have a 4-hour minimum on the published driver tariff. Outstation is billed per day (typically 12 hours) with a night charge after 10 pm when it applies. Airport chauffeur is driver-only pickup or drop in your car — not an airport taxi. Monthly and corporate work is quote-only after you share the schedule.</p>

<h2>Hourly and Daily Driver Hire in Chennai</h2>
<p>Local packages start from the Call Driver local slab (from ₹500 for a 4-hour city booking on the current tariff). Extra hours and night charges are shown in the estimate before you confirm. Daily / outstation days start from the outstation per-day slab (from ₹1,100). Live price depends on hours, trip type and timing — always check the quote on <a href="/call-driver">Call Driver</a>.</p>

<h2>Outstation Acting Driver in Chennai</h2>
<p>Highway days in your car are common for Tirupati, Pondicherry (ECR), Bengaluru and Madurai. Food and stay for the driver on outstation trips are the customer’s responsibility, as listed on the Call Driver tariff. If you need a Cabzii cab instead of your own car, use <a href="/services/outstation-cab/chennai">outstation cab Chennai</a>.</p>

<h2>Airport Driver Service in Chennai</h2>
<p>Airport acting driver means a chauffeur in your vehicle to or from MAA. If you need a Cabzii taxi (vehicle included), book <a href="/services/airport-taxi/chennai">Chennai airport taxi</a> instead.</p>

<h2>Night bookings</h2>
<p>Night bookings after 10 pm may include a night charge. Availability depends on a driver being free in Chennai at that hour — Cabzii does not promise a guaranteed emergency dispatch product.</p>

<h2>Book an acting driver</h2>
<p>The booking CTA is <a href="/call-driver">Call Driver</a>. Synonym searches (chauffeur, driver on hire, airport chauffeur, outstation driver) stay on this city guide plus Call Driver — they are not separate thin pages. Need a Cabzii vehicle as well? Use <a href="/cab-booking/chennai">cab booking Chennai</a>.</p>
`;
}

export const CHENNAI_CAB_FAQS = [
  [
    "How do I book a cab in Chennai on Cabzii?",
    "Open cab booking Chennai or Cabs, enter pickup, choose local, airport or outstation, compare the published package, then confirm. Driver details follow by SMS or WhatsApp."
  ],
  [
    "What is the cab fare in Chennai?",
    "Published local car packages start from ₹1,200 for Swift Dzire (4 Hrs / 40 Km). Outstation cars have a 250 km minimum (Dzire from ₹3,250). Extra km, extra hour and driver batta are on the Cabzii tariff. Live quotes can vary by date and vehicle availability."
  ],
  [
    "Can I book Chennai airport taxi for MAA pickup?",
    "Yes. Use airport taxi Chennai, set pickup or drop at Chennai International Airport, and add terminal and flight time in notes."
  ],
  [
    "When should I book an acting driver instead of a cab?",
    "Book an acting driver when you want a chauffeur for your own car. Book a cab when you need the vehicle as well. Both are booked on Cabzii; acting driver starts from Call Driver."
  ],
  [
    "Is Cabzii car rental in Chennai self-drive?",
    "No. Cabzii car rental and cab booking in Chennai are chauffeur-driven. For a driver in your own car, use acting driver / Call Driver."
  ]
];

export const CHENNAI_DRIVER_FAQS = [
  [
    "What is an acting driver in Chennai?",
    "An acting driver is a professional who drives your car. Cabzii Call Driver assigns the driver after you book — it is not a public directory of named drivers."
  ],
  [
    "Can I hire a driver to drive my own car in Chennai?",
    "Yes. Choose Local, Outstation or Airport on Call Driver, add your vehicle details, and confirm. Monthly and corporate requests are quoted after you share the schedule."
  ],
  [
    "Can I book an acting driver for one day or a few hours?",
    "Local bookings use a 4-hour minimum on the current tariff. Outstation is typically billed per day. The estimate is shown before you confirm."
  ],
  [
    "How much does an acting driver cost in Chennai?",
    "Local packages typically start from ₹500 for 4 hours. Outstation days typically start from ₹1,100. Airport chauffeur typically starts from ₹500. Night bookings after 10 pm may include a night charge. Your live estimate depends on hours and trip type."
  ],
  [
    "Do you provide outstation acting drivers from Chennai?",
    "Yes, via the Outstation Call Driver option. Food and accommodation for the driver are the customer’s responsibility on outstation trips."
  ],
  [
    "Can I book a driver at night?",
    "Night bookings are possible when a driver is available. A night charge may apply after 10 pm. Cabzii does not run a separate emergency-driver product."
  ],
  [
    "How do I book an acting driver?",
    "Open Call Driver, pick the service, enter date, time, pickup and vehicle, review the estimate or request a quote, then confirm. Cabzii assigns an available driver after booking."
  ],
  [
    "Is airport chauffeur the same as airport taxi?",
    "No. Airport chauffeur on Call Driver is a driver in your car to or from MAA. Airport taxi includes a Cabzii vehicle — book that on the Chennai airport taxi page."
  ]
];
