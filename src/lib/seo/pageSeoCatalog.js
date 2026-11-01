import { HOME_SEO_DESCRIPTION, HOME_SEO_KEYWORDS, HOME_SEO_TITLE } from "./constants";
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
    seoDescription: HOME_SEO_DESCRIPTION,
    seoKeywords: HOME_SEO_KEYWORDS.join(", ")
  },
  {
    id: "site:cabs",
    path: "/cabs",
    type: "site",
    typeLabel: "Cabs listing",
    productName: "Book Cabs Online",
    seoTitle: formatSerpTitle("Book Cabs Online", "Compare Dzire to Tempo"),
    seoDescription:
      "Compare Swift Dzire, Ertiga, Innova Crysta and Tempo Traveller on Cabzii. Airport, local and outstation fares from the published tariff before you confirm.",
    seoKeywords:
      "book cabs online, compare cabs, innova crysta rental, tempo traveller, dzire taxi, cabzii cabs"
  },
  {
    id: "site:acting-driver",
    path: "/acting-driver",
    type: "site",
    typeLabel: "Acting driver hub",
    productName: "Acting Driver",
    seoTitle: "Acting Driver by City | Hire Driver for Your Car | Cabzii",
    seoDescription:
      "Choose a city acting-driver page, then book Call Driver for your own car. Local, outstation, airport chauffeur, monthly quote, corporate and valet.",
    seoKeywords: "acting driver by city, chauffeur on hire, driver for own car, cabzii acting driver"
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
      "High-value cab routes such as Chennai–Tirupati and Chennai–Trichy with distance, fare context and WhatsApp support on Cabzii.",
    seoKeywords: "chennai to tirupati cab, one way cab, outstation routes, cabzii routes"
  },
  {
    id: "site:call-driver",
    path: "/call-driver",
    type: "site",
    typeLabel: "Call Driver",
    productName: "Call Driver Service",
    seoTitle: "Book Call Driver | Driver for Your Own Car | Cabzii",
    seoDescription:
      "Book a Cabzii Call Driver for your own car — local hours, outstation days, airport chauffeur, monthly quote and valet. Fares shown before you confirm.",
    seoKeywords:
      "book call driver, hire driver for own car, acting driver booking, airport chauffeur booking, monthly driver quote, cabzii call driver"
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
      "Cabzii is a cab booking platform for airport taxi, outstation, local packages and acting driver from Chennai and Tamil Nadu corridors.",
    seoKeywords: "about cabzii, cab booking company India, cabzii.in about"
  },
  {
    id: "site:contact",
    path: "/contact",
    type: "site",
    typeLabel: "Contact page",
    productName: "Contact Cabzii",
    seoTitle: "Contact Cabzii — Call, WhatsApp & Email",
    seoDescription:
      "Reach Cabzii for cab quotes, booking help and support. Phone, WhatsApp and email.",
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
      "Cabzii service areas across Chennai, Madurai, Tirupati, Trichy, Coimbatore and Vellore. Book cabs online.",
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
    id: "site:earn",
    path: "/earn",
    type: "site",
    typeLabel: "Earn with Cabzii",
    productName: "Earn with Cabzii",
    seoTitle: "Earn with Cabzii | Driver Attach, Vehicle Attach & Partner",
    seoDescription:
      "Attach your cab or join as a Cabzii driver in Chennai, Madurai, Trichy, Coimbatore, Vellore and more. Share city, vehicle, name and mobile on WhatsApp.",
    seoKeywords:
      "earn with cabzii, attach cab, driver attach, vehicle attach, lease vehicle, acting driver partner, cab partner login"
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
