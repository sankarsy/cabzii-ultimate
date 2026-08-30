/**
 * Unique Chennai service-page bodies for existing URLs only.
 * Fares come from the published tariff. Do not invent airport fees or distances.
 */

export function chennaiServiceUniqueHtml(slug) {
  const extras = {
    "airport-taxi": CHENNAI_AIRPORT,
    "outstation-cab": CHENNAI_OUTSTATION,
    "one-way-cab": CHENNAI_ONE_WAY,
    "hourly-rental": CHENNAI_HOURLY,
    "local-taxi": CHENNAI_LOCAL,
    "car-rental": CHENNAI_CAR_RENTAL,
    "cab-rental": CHENNAI_CAB_RENTAL,
    "tempo-traveller": CHENNAI_TEMPO,
    "driver-on-hire": CHENNAI_DRIVER_ON_HIRE,
    "chauffeur-service": CHENNAI_CHAUFFEUR,
    "tour-packages": CHENNAI_TOURS
  };
  return extras[slug] || "";
}

const CHENNAI_AIRPORT = `
<h2>Chennai airport taxi at MAA</h2>
<p>This page is the Cabzii booking page for <strong>Chennai airport taxi</strong>, <strong>Chennai airport cab</strong>, <strong>airport pickup</strong> and <strong>airport drop</strong>. Searches such as airport cab booking Chennai, Chennai airport to city, and Chennai airport to nearby towns belong here — there is no second thin URL for each phrase.</p>
<p>Chennai International Airport (IATA: <strong>MAA</strong>, Meenambakkam) is Cabzii’s home-market airport. You book a <strong>cab with a driver</strong>, not a self-drive counter. Share the terminal printed on your ticket (commonly T1 or T2) and your flight time so the assigned driver knows where to wait.</p>

<h2>Airport pickup and airport drop</h2>
<p><strong>Pickup:</strong> set the airport as origin, add flight number and terminal in notes, and allow time for baggage and the walk to the meeting point. The driver contact is shared after you confirm. <strong>Drop:</strong> set your Chennai home, hotel, office or hospital as origin and MAA as destination. Early-morning departures from OMR, ECR, Tambaram and Anna Nagar are common — book the evening before when you can.</p>
<p>This is not a guaranteed last-minute dispatch product. Availability depends on a partner cab being free at that hour. Confirm the live fare on the booking widget above before you pay.</p>

<h2>Airport to city and nearby destinations</h2>
<p>Typical city drops include T. Nagar, Anna Nagar, Adyar, Velachery, OMR (Sholinganallur, Thoraipakkam), Porur, Guindy, Tambaram and hotel clusters around GST Road. Enter the exact landmark — “Chennai” alone is not a drop pin.</p>
<p>When the trip continues out of the city, use the existing route pages rather than a new airport URL: <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>, <a href="/routes/chennai-to-pondicherry-cab">Chennai to Pondicherry</a>, <a href="/routes/chennai-to-kanchipuram-cab">Chennai to Kanchipuram</a>, <a href="/routes/chennai-to-bangalore-cab">Chennai to Bengaluru</a>. For a cab that must wait or return, compare this airport local package with <a href="/services/outstation-cab/chennai">outstation cab Chennai</a>.</p>

<h2>Vehicles and published fares</h2>
<p>Airport trips are usually billed as a local Chennai package (or an airport search) using the published rate card. Swift Dzire starts at <strong>₹1,200 for 4 Hrs / 40 Km</strong>. Honda Amaze from ₹1,400. Ertiga / Innova 6+1 from ₹1,800. Innova Crysta from ₹2,200. Extra km and extra hour rates, driver batta, tolls and parking are listed on the <a href="/tariff">Chennai tariff</a> — they are not assumed included.</p>
<p>Choose sedan for 1–3 passengers and standard luggage; Ertiga or Innova when you have family and extra bags; <a href="/services/tempo-traveller/chennai">Tempo Traveller</a> for groups. Vehicle model is subject to availability at search time.</p>

<h2>How booking works</h2>
<ol>
<li>Use the search on this page (Airport tab) or open <a href="/cabs">Cabs</a> with pickup or drop at Chennai airport</li>
<li>Enter date, time, terminal/flight notes and passenger count</li>
<li>Compare the package shown — local hour/km slab or the live airport quote</li>
<li>Confirm — driver details follow by SMS or WhatsApp</li>
</ol>
<p>Need a chauffeur in <em>your</em> car instead of a Cabzii taxi? That is <a href="/acting-driver/chennai">acting driver Chennai</a>, booked at <a href="/call-driver">Call Driver</a> — not this airport-taxi page.</p>

<h2>Related Chennai services</h2>
<p><a href="/cab-booking/chennai">Cab booking Chennai</a> · <a href="/services/hourly-rental/chennai">Hourly / full-day taxi</a> · <a href="/services/one-way-cab/chennai">One-way cab</a> · <a href="/tariff">Tariff</a></p>
`;

const CHENNAI_OUTSTATION = `
<h2>Outstation cab from Chennai</h2>
<p>Use this page when you want a Cabzii cab for a <strong>highway trip leaving Chennai</strong> — typically a <strong>round trip</strong> or a package where the same vehicle should wait or return. A single drop with no return is <a href="/services/one-way-cab/chennai">one-way cab Chennai</a>. There is no separate /round-trip-cab URL.</p>

<h2>One-way vs round trip</h2>
<p><strong>One-way:</strong> you pay for the forward journey to another city. Open the matching <a href="/services/one-way-cab/chennai">one-way</a> or route page (Tirupati, Pondicherry, Bengaluru, Madurai and others). <strong>Round trip:</strong> the cab stays with you or brings you back. That is this outstation product.</p>

<h2>Minimum kilometres, batta, tolls and parking</h2>
<p>On the published Chennai tariff, <strong>cars have a 250 km outstation minimum</strong> and <strong>vans / mini buses have a 300 km minimum</strong>. Extra km beyond the minimum is charged at the outstation per-km rate. <strong>Driver batta</strong> is added per calendar day (Dzire / Amaze ₹600 on the current card; higher on some SUVs and vans). Package fares include fuel and driver service. <strong>Tolls, parking and standing AC</strong> are extra unless the live quote lists them as included. Always read the fare breakdown before payment.</p>

<h2>Vehicle categories</h2>
<p>Sedan (Dzire, Amaze) for 1–3 riders. Ertiga, Carens and Innova for families. Innova Crysta and Fortuner when you want more space on long legs. Tempo Traveller 12–18 seater for groups — van outstation minimum is 300 km. See the <a href="/tariff">tariff</a> for each model’s outstation starting slab (Dzire outstation from ₹3,250 on the published card).</p>

<h2>How to book</h2>
<ol>
<li>Search Outstation from Chennai with return date if you need the cab back</li>
<li>Pick vehicle class and review km minimum, extra km, batta and extras</li>
<li>Confirm — driver details follow before departure</li>
</ol>
<p>High-demand corridors: <a href="/routes/chennai-to-tirupati-cab">Tirupati</a>, <a href="/routes/chennai-to-pondicherry-cab">Pondicherry</a>, <a href="/routes/chennai-to-bangalore-cab">Bengaluru</a>, <a href="/routes/chennai-to-madurai-cab">Madurai</a>, <a href="/routes/chennai-to-rameswaram-cab">Rameswaram</a>, <a href="/routes/chennai-to-ooty-cab">Ooty</a>.</p>
`;

const CHENNAI_ONE_WAY = `
<h2>One-way cab from Chennai</h2>
<p>One-way is a <strong>single drop</strong> to another city. You do not pay a round-trip package for a cab that must return empty. If the same vehicle should wait or bring you back, book <a href="/services/outstation-cab/chennai">outstation cab Chennai</a> instead.</p>

<h2>Popular destinations and route pages</h2>
<p>Each corridor has its own existing route URL with distance, indicative duration and starting fares from the catalog — do not treat this city page as a substitute for those numbers:</p>
<ul>
<li><a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a></li>
<li><a href="/routes/chennai-to-pondicherry-cab">Chennai to Pondicherry</a></li>
<li><a href="/routes/chennai-to-bangalore-cab">Chennai to Bengaluru</a></li>
<li><a href="/routes/chennai-to-kanchipuram-cab">Chennai to Kanchipuram</a></li>
<li><a href="/routes/chennai-to-tiruvannamalai-cab">Chennai to Tiruvannamalai</a></li>
<li><a href="/routes/chennai-to-trichy-cab">Chennai to Trichy</a></li>
<li><a href="/routes/chennai-to-madurai-cab">Chennai to Madurai</a></li>
<li><a href="/routes/chennai-to-rameswaram-cab">Chennai to Rameswaram</a></li>
<li><a href="/routes/chennai-to-kanyakumari-cab">Chennai to Kanyakumari</a></li>
<li><a href="/routes/chennai-to-ooty-cab">Chennai to Ooty</a></li>
</ul>

<h2>Route-based fares and vehicles</h2>
<p>Indicative sedan and SUV starting fares live on the route page. Live quotes can differ by date and vehicle. Cars on the published outstation card use a 250 km minimum — a short drop still follows the live package, not a made-up per-km headline. Toll treatment is shown in the breakdown. Sedan, Ertiga, Innova and Tempo Traveller options appear during search when partners list them.</p>

<h2>Booking process</h2>
<ol>
<li>Open the destination route page or search Outstation one-way from Chennai</li>
<li>Enter exact pickup and drop landmarks</li>
<li>Compare vehicle class, confirm, receive driver details</li>
</ol>
<p>Airport start: <a href="/services/airport-taxi/chennai">MAA airport taxi</a>. Group vehicle: <a href="/services/tempo-traveller/chennai">Tempo Traveller</a>.</p>
`;

const CHENNAI_HOURLY = `
<h2>Hourly and full-day taxi in Chennai</h2>
<p>This page is for <strong>4 hour / 40 km</strong> and <strong>8 hour / 80 km</strong> city packages (and longer slabs shown at search). Use it for multi-stop OMR office days, T. Nagar shopping, hospital visits and wedding logistics. A single airport pickup or drop is usually better on <a href="/services/airport-taxi/chennai">airport taxi Chennai</a>.</p>
<p>Published car examples: Swift Dzire from <strong>₹1,200 (4 Hrs / 40 Km)</strong> and <strong>₹2,400 (8 Hrs / 80 Km)</strong>. Extra km and extra hour rates are on the <a href="/tariff">tariff</a>. Point-to-point wording also lives on <a href="/services/local-taxi/chennai">local taxi Chennai</a> — same chauffeur-driven product, not a second fleet.</p>
<p>Book via the widget above or <a href="/cabs">Cabs</a> with the hourly tab. Cabzii car hire is <strong>driver included</strong>, not self-drive.</p>
`;

const CHENNAI_LOCAL = `
<h2>Local taxi in Chennai</h2>
<p>Local taxi covers city rides and the same hourly packages as <a href="/services/hourly-rental/chennai">hourly rental Chennai</a>. Pickup areas include Maduravoyal (Cabzii HQ locality), Porur, Anna Nagar, T. Nagar, Adyar, Velachery, Tambaram, OMR and ECR — enter the exact pin.</p>
<p>Airport local runs: <a href="/services/airport-taxi/chennai">airport taxi</a>. Highway drops: <a href="/services/one-way-cab/chennai">one-way</a>.</p>
`;

const CHENNAI_CAR_RENTAL = `
<h2>Car rental in Chennai is chauffeur-driven</h2>
<p>Cabzii <strong>does not offer self-drive car rental</strong>. “Car rental Chennai” here means <strong>chauffeur-driven</strong> local hire — a cab with a professional driver on a local hour/km package — the same fleet as cab booking: Dzire, Amaze, Ertiga, Carens, Innova, Innova Crysta and other models on the <a href="/tariff">published tariff</a>.</p>
<p>Use this page for full-day city hire. Related products: <a href="/cab-booking/chennai">cab booking</a>, <a href="/services/outstation-cab/chennai">outstation</a>, <a href="/services/airport-taxi/chennai">airport taxi</a>, <a href="/acting-driver/chennai">acting driver</a> (your car), <a href="/services/tempo-traveller/chennai">Tempo Traveller</a>.</p>
`;

const CHENNAI_CAB_RENTAL = `
<h2>Cab rental in Chennai</h2>
<p>Cab rental is the hourly and full-day <strong>chauffeur-driven</strong> city product. It is not a self-drive desk. Airport and outstation use their own tabs on <a href="/cab-booking/chennai">cab booking Chennai</a>. Rates: <a href="/tariff">tariff</a>. Same-intent wording as <a href="/services/car-rental/chennai">car rental Chennai</a> — one fleet, two search phrases.</p>
`;

const CHENNAI_TEMPO = `
<h2>Tempo Traveller hire in Chennai — group travel, not bus tickets</h2>
<p>This page is for <strong>hiring a Tempo Traveller with a chauffeur</strong> for a group. It is <strong>not bus ticket booking</strong> and not a public-service bus. Cabzii lists van hire: 12, 13, 14 and 18 seater Tempo Travellers, plus Tourister 16 seater on the van card. Mini bus 21–30 seater hire is on the same <a href="/tariff">tariff</a> as a larger vehicle class — still hire, not a scheduled bus seat.</p>

<h2>Capacity and published local slabs</h2>
<p>Tempo Traveller 12 and 13 seater local packages start from <strong>₹3,000 (5 Hrs / 50 Km)</strong> on the published van tariff. 18 seater local from ₹4,000 for the same 5-hour slab. Outstation vans have a <strong>300 km minimum</strong>. Extra km, extra hour and driver batta are listed on the tariff. Availability is shown at search.</p>

<h2>When groups book Tempo from Chennai</h2>
<p><strong>Local:</strong> weddings, airport group pickup, corporate outings. <strong>Outstation:</strong> family highway trips. <strong>Pilgrimage:</strong> Tirupati, Kanchipuram, Tiruvannamalai, Rameswaram circuits — use existing route pages plus this vehicle class. <strong>Multi-day:</strong> holiday packages on <a href="/holidays">holidays</a> when a vendor has listed a tour; otherwise book outstation van days.</p>
<p>Related: <a href="/cab-booking/chennai">cab booking</a>, <a href="/services/outstation-cab/chennai">outstation</a>, <a href="/holidays?category=pilgrimage">pilgrimage packages</a>.</p>
`;

const CHENNAI_DRIVER_ON_HIRE = `
<h2>Driver on hire is the same service as acting driver</h2>
<p>This URL matches searches for “driver on hire Chennai”. The full Chennai guide is <a href="/acting-driver/chennai">acting driver in Chennai</a>. Booking starts at <a href="/call-driver">Call Driver</a>. Do not create a second booking — one confirmation assigns a chauffeur for your own car (local, airport or outstation).</p>
`;

const CHENNAI_CHAUFFEUR = `
<h2>Chauffeur service in Chennai</h2>
<p>Corporate days, wedding cars and multi-stop driving use the same Call Driver assignment as acting driver. City guide: <a href="/acting-driver/chennai">acting driver in Chennai</a>. Book: <a href="/call-driver">Call Driver</a>. A Cabzii taxi (vehicle included) is <a href="/cab-booking/chennai">cab booking</a>, not this page.</p>
`;

const CHENNAI_TOURS = `
<h2>Holiday and pilgrimage packages from Chennai</h2>
<p>Live itineraries are on <a href="/holidays">holiday packages</a>. Pilgrimage listings (Tirupati, Rameswaram–Madurai and similar circuits) use <a href="/holidays?category=pilgrimage">/holidays?category=pilgrimage</a> — not a /pilgrimage URL tree. Cab-only temple runs stay on route pages such as <a href="/routes/chennai-to-tirupati-cab">Chennai to Tirupati</a>.</p>
`;
