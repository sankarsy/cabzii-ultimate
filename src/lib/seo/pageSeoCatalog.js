import { HOME_SEO_TITLE } from "./constants";
import { formatSerpTitle } from "./programmaticMeta";

/** Admin-managed static pages for Google / Meta ads campaigns. */
export const STATIC_PAGE_SEO_LIST = [
  {
    id: "site:home",
    path: "/",
    type: "site",
    typeLabel: "Homepage",
    productName: "Cabzii Home",
    seoTitle: HOME_SEO_TITLE,
    seoDescription:
      "Book cabs from Chennai and across Tamil Nadu with Cabzii — airport taxi, local packages, outstation and one-way trips. Transparent fares and OTP booking.",
    seoKeywords:
      "cab booking chennai, taxi service chennai, airport taxi chennai, outstation cab chennai, cab rental tariff chennai, cab booking tamil nadu, cabzii, cabzii.in"
  },
  {
    id: "site:cabs",
    path: "/cabs",
    type: "site",
    typeLabel: "Cabs listing",
    productName: "Book Cabs Online",
    seoTitle: formatSerpTitle("Cab Booking Chennai", "Airport Taxi, Local & Outstation Cabs"),
    seoDescription:
      "Book Swift Dzire, Honda Amaze, Ertiga, Toyota Innova Crysta and Tempo Traveller with the Cabzii tariff. Outstation, airport and local cab booking on cabzii.in.",
    seoKeywords:
      "cab booking chennai, tour s taxi booking, dzire taxi, dezire taxi, wagon r taxi, wegon r, bolero taxi, boliro, innova crysta rental, car rental chennai, cab rental chennai, airport taxi, cabzii cabs"
  },
  {
    id: "site:drivers",
    path: "/drivers",
    type: "site",
    typeLabel: "Drivers category",
    productName: "Driver Hire",
    seoTitle: "Driver Hire & Chauffeur Service | Acting Driver | Cabzii",
    seoDescription:
      "Book acting driver, chauffeur and driver-on-hire on Cabzii. You book a service — Cabzii assigns a professional driver after confirmation.",
    seoKeywords: "driver hire, acting driver, chauffeur service, call driver, cabzii drivers"
  },
  {
    id: "site:acting-driver",
    path: "/acting-driver",
    type: "site",
    typeLabel: "Acting driver hub",
    productName: "Acting Driver",
    seoTitle: "Acting Driver — Chauffeur on Hire for Your Car | Cabzii",
    seoDescription:
      "Acting driver cities on Cabzii — chauffeur for your own car. Hourly, daily and outstation packages. Driver assigned after you book.",
    seoKeywords: "acting driver, chauffeur on hire, driver for own car, cabzii acting driver"
  },
  {
    id: "site:services",
    path: "/services",
    type: "site",
    typeLabel: "Services hub",
    productName: "Services",
    seoTitle: "Cab & Driver Services by City | Cabzii",
    seoDescription:
      "Cab rental, car rental, airport taxi, outstation and one-way services by city on Cabzii. Open the city you travel from.",
    seoKeywords: "cab rental, airport taxi, outstation cab, car rental, cabzii services"
  },
  {
    id: "site:routes",
    path: "/routes",
    type: "site",
    typeLabel: "Routes hub",
    productName: "Routes",
    seoTitle: "Popular Cab Routes — One-Way & Outstation | Cabzii",
    seoDescription:
      "High-value cab routes such as Chennai–Tirupati and Chennai–Trichy with distance, fare context and OTP booking on Cabzii.",
    seoKeywords: "chennai to tirupati cab, one way cab, outstation routes, cabzii routes"
  },
  {
    id: "site:call-driver",
    path: "/call-driver",
    type: "site",
    typeLabel: "Call Driver",
    productName: "Call Driver Service",
    seoTitle: "Call Driver in Chennai | Acting Driver Service | Cabzii",
    seoDescription:
      "Book a call driver in Chennai for your own car. Acting driver, outstation driver, airport call driver, monthly driver, corporate driver and valet parking on Cabzii.",
    seoKeywords:
      "call driver Chennai, acting driver Chennai, driver for own car Chennai, outstation driver Chennai, airport call driver Chennai, monthly driver Chennai, corporate driver service Chennai"
  },
  {
    id: "site:holidays",
    path: "/holidays",
    type: "site",
    typeLabel: "Holiday packages",
    productName: "Holiday Packages",
    seoTitle: "Holiday Packages — Pilgrimage, Beach & Hill Trips",
    seoDescription:
      "Book pilgrimage, beach, heritage and family holiday packages on cabzii.in. Choose cab type — sedan, SUV, Innova or tempo.",
    seoKeywords: "holiday packages India, pilgrimage tour, Tirupati package, cabzii holidays"
  },
  {
    id: "site:blogs",
    path: "/blogs",
    type: "site",
    typeLabel: "Blog listing",
    productName: "Travel Blog",
    seoTitle: "Travel Blog — Cabs, Pilgrimage & Holiday Tips",
    seoDescription: "Guides on cab booking, pilgrimage packages, airport transfers and holiday planning on cabzii.in.",
    seoKeywords: "cab booking tips, pilgrimage travel guide, cabzii blog"
  },
  {
    id: "site:about",
    path: "/about",
    type: "site",
    typeLabel: "About page",
    productName: "About Cabzii",
    seoTitle: "About Cabzii — Trusted Cab Booking Across India",
    seoDescription:
      "Cabzii connects riders with verified cab partners for airport transfers, outstation trips, local rentals and acting drivers across Chennai, Bengaluru and 20+ cities.",
    seoKeywords: "about cabzii, cab booking company India, cabzii.in about"
  },
  {
    id: "site:contact",
    path: "/contact",
    type: "site",
    typeLabel: "Contact page",
    productName: "Contact Cabzii",
    seoTitle: "Contact Cabzii — Call, WhatsApp & Email Support 24×7",
    seoDescription:
      "Reach Cabzii for cab quotes, booking help and support. Phone, WhatsApp and email — available 24×7 across India.",
    seoKeywords: "contact cabzii, cab booking support, cabzii phone number"
  },
  {
    id: "site:faq",
    path: "/faq",
    type: "site",
    typeLabel: "FAQ page",
    productName: "Cabzii FAQ",
    seoTitle: "FAQ — Cab Booking, Airport Taxi & Outstation Cabs | Cabzii",
    seoDescription:
      "Answers about cab booking on cabzii.in — fares, airport pickup, outstation trips, acting drivers, payment and cancellation.",
    seoKeywords: "cab booking faq, airport taxi faq, cabzii help"
  },
  {
    id: "site:locations",
    path: "/locations",
    type: "site",
    typeLabel: "Locations hub",
    productName: "Service Locations",
    seoTitle: "Cab & Taxi Service Locations in South India | Cabzii",
    seoDescription:
      "Cabzii service areas across Chennai, Bengaluru, Hyderabad, Coimbatore, Madurai, Tirupati and 20+ cities. Book cabs online.",
    seoKeywords: "cab service locations, taxi near me South India, cabzii cities"
  },
  {
    id: "site:testimonials",
    path: "/testimonials",
    type: "site",
    typeLabel: "Reviews page",
    productName: "Customer Reviews",
    seoTitle: "Customer Reviews & Ratings | Cabzii",
    seoDescription:
      "Read verified Cabzii customer reviews for cab booking, airport taxi, outstation trips and acting drivers across South India.",
    seoKeywords: "cabzii reviews, cab booking reviews, taxi service ratings"
  },
  {
    id: "site:tariff",
    path: "/tariff",
    type: "site",
    typeLabel: "Tariff page",
    productName: "Cab Rental Tariff",
    seoTitle: "Cab Rental Tariff in Chennai | Car, Tempo Traveller & Mini Bus Rates | Cabzii",
    seoDescription:
      "Cabzii Chennai cab rental tariff — Swift Dzire from ₹1,200, Innova Crysta from ₹2,200, Tempo Traveller from ₹3,000, mini bus from ₹8,500. Extra km, extra hour and driver batta.",
    seoKeywords:
      "cab rental tariff chennai, tempo traveller rental chennai price, innova crysta rental chennai, mini bus rental chennai, cabzii tariff"
  }
];

export const STATIC_PAGE_SEO_BY_PATH = Object.fromEntries(
  STATIC_PAGE_SEO_LIST.map((p) => [p.path, p])
);
