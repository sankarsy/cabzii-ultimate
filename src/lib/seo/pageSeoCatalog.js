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
      "cab booking chennai, taxi service chennai, airport taxi chennai, outstation cab chennai, cab booking tamil nadu, cabzii, cabzii.in"
  },
  {
    id: "site:cabs",
    path: "/cabs",
    type: "site",
    typeLabel: "Cabs listing",
    productName: "Book Cabs Online",
    seoTitle: formatSerpTitle("Cab Booking Chennai", "Airport Taxi, Local & Outstation Cabs"),
    seoDescription:
      "Book Maruti Dzire, Ertiga, Toyota Innova and tempo traveller with transparent fares. Outstation, airport and local cab booking on cabzii.in.",
    seoKeywords:
      "cab booking chennai, airport taxi, outstation cab, Maruti Dzire cab, Innova taxi, cabzii cabs"
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
  }
];

export const STATIC_PAGE_SEO_BY_PATH = Object.fromEntries(
  STATIC_PAGE_SEO_LIST.map((p) => [p.path, p])
);
