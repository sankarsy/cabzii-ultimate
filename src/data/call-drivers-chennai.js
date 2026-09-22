import { ORG_EMAIL, ORG_PHONE, SITE_NAME, SITE_URL } from "../lib/seo/constants";
import { CABZII_PHONE_DIGITS, whatsappBookingUrl } from "../lib/conversion";
import { cityCabLandingPath, CALL_DRIVERS_CHENNAI_PATH } from "../lib/cityCabPaths";

export { CALL_DRIVERS_CHENNAI_PATH };

/** Published Call Driver tariff defaults (backend src/config/callDriverTariff.js). */
export const CALL_DRIVER_TARIFF = {
  nightStartHour: 22,
  nightEndHour: 6,
  local: {
    minHours: 4,
    standard: 500,
    premium: 600,
    extraHourStandard: 80,
    extraHourPremium: 100,
    nightCharge: 100
  },
  outstation: {
    perDayHours: 12,
    perDayStandard: 1100,
    perDayPremium: 1200,
    extraHourStandard: 80,
    extraHourPremium: 100,
    nightCharge: 100,
    foodStayNote: "Food and accommodation for the driver are the customer's responsibility."
  },
  airport: {
    minHours: 4,
    standard: 500,
    premium: 600,
    extraHourStandard: 80,
    extraHourPremium: 100,
    nightCharge: 100
  },
  valet: {
    driverRate: 650,
    minHours: 5,
    extraHour: 70
  }
};

const local = CALL_DRIVER_TARIFF.local;
const halfDayStandard = local.standard + 4 * local.extraHourStandard;
const halfDayPremium = local.premium + 4 * local.extraHourPremium;

export const CALL_DRIVERS_CHENNAI = {
  brand: SITE_NAME,
  domain: SITE_URL,
  path: CALL_DRIVERS_CHENNAI_PATH,
  city: "Chennai",
  phoneDisplay: "+91 99441 97416",
  phones: [ORG_PHONE],
  telephoneSchema: [ORG_PHONE],
  email: ORG_EMAIL,
  whatsappHref: whatsappBookingUrl({
    phone: CABZII_PHONE_DIGITS,
    message: "Hi Cabzii, I need a Call Driver / acting driver in Chennai.\nPickup:\nDate:\nHours:\nVehicle:"
  }),
  telHref: `tel:${ORG_PHONE}`,
  title: "Acting Drivers in Chennai | Call Driver for Your Car | Cabzii",
  description:
    "Hire a professional acting driver in Chennai for city, airport and outstation trips. Hourly and daily rates. Call or WhatsApp to book.",
  h1: "Hire Acting Drivers in Chennai — Call Driver for Your Own Car",
  intro: [
    "Cabzii Call Driver is a chauffeur for your own car in Chennai — city hours, MAA airport pickup or drop, and outstation days.",
    "Call or WhatsApp to book. A professional driver is assigned after you confirm. Availability depends on a driver being free at that hour."
  ],
  trustBadges: [
    "Driver for your own car",
    "4-hour city minimum",
    "Night charge after 10 pm",
    "Assigned after you book"
  ],
  hero: {
    src: "/images/acting-driver-chennai-hero.svg",
    alt: "Acting driver in Chennai standing beside a customer car for a Cabzii Call Driver booking",
    width: 1200,
    height: 630
  },
  tariffCaption: "Acting Driver Tariff in Chennai — standard and premium bands on the published Call Driver rate card.",
  tariffRows: [
    {
      service: "City hourly (4 hr min)",
      standard: local.standard,
      premium: local.premium,
      note: "Extra hour ₹80 standard / ₹100 premium"
    },
    {
      service: "Half day (8 hrs)",
      standard: halfDayStandard,
      premium: halfDayPremium,
      note: "4 hr package plus 4 extra hours"
    },
    {
      service: "Full day / outstation per day",
      standard: CALL_DRIVER_TARIFF.outstation.perDayStandard,
      premium: CALL_DRIVER_TARIFF.outstation.perDayPremium,
      note: "12-hour day. Longer km days may use the long-run slab."
    },
    {
      service: "Airport pickup or drop",
      standard: CALL_DRIVER_TARIFF.airport.standard,
      premium: CALL_DRIVER_TARIFF.airport.premium,
      note: "4 hr min. Driver in your car at MAA — not an airport taxi."
    },
    {
      service: "Night charge (10 pm – 6 am)",
      standard: local.nightCharge,
      premium: local.nightCharge,
      note: "Added when pickup time falls in the night window."
    }
  ],
  services: [
    {
      id: "city",
      title: "City call drivers in Chennai",
      subtitle:
        "Local Call Driver starts at 4 hours for office days, hospitals and multi-stop city trips in your car. Book on Call Driver → Local.",
      href: "/call-driver/book?service=local",
      image: { src: "/images/acting-driver-chennai-city.svg", alt: "City call driver for a Chennai local trip in the customer’s car", width: 640, height: 360 }
    },
    {
      id: "outstation",
      title: "Outstation drivers from Chennai",
      subtitle:
        "Highway days in your car to Tirupati, Pondicherry, Bengaluru and similar corridors. Billed per 12-hour day. Food and stay for the driver are yours.",
      href: "/call-driver/book?service=outstation",
      image: { src: "/images/call-driver-chennai-outstation.svg", alt: "Outstation acting driver for a Chennai highway trip in a family SUV", width: 640, height: 360 }
    },
    {
      id: "airport",
      title: "Airport pickup and drop drivers",
      subtitle:
        "A chauffeur in your vehicle to or from Chennai International Airport (MAA). This is not a Cabzii airport taxi.",
      href: "/call-driver/book?service=airport",
      image: { src: "/images/acting-driver-chennai-airport.svg", alt: "Airport call driver collecting a customer car for Chennai MAA pickup", width: 640, height: 360 }
    },
    {
      id: "school",
      title: "School pickup and drop drivers",
      subtitle:
        "Regular school or household driving is quote-only. Share shift, days and pickup area — Cabzii confirms a rate before assignment.",
      href: "/call-driver/book?service=school",
      image: null
    },
    {
      id: "event",
      title: "Party, wedding and night-out drivers",
      subtitle:
        "Valet Call Driver covers functions and guest parking. Minimum 5 hours; extra hours follow the valet tariff. Night charge may apply after 10 pm.",
      href: "/call-driver/book?service=valet",
      image: { src: "/images/acting-driver-chennai-event.svg", alt: "Wedding and event call drivers for guest cars in Chennai", width: 640, height: 360 }
    },
    {
      id: "corporate",
      title: "Corporate and monthly drivers",
      subtitle:
        "Office retainers and monthly drivers are quoted from your schedule. Cabzii assigns professionals after you confirm — there is no public driver directory.",
      href: "/call-driver/book?service=corporate",
      image: null
    }
  ],
  howToHire: [
    {
      title: "Tell us pickup, time and trip type",
      subtitle: "Call, WhatsApp, or open Call Driver. Choose city, airport, outstation, valet or a quote-only monthly/corporate request."
    },
    {
      title: "Share your car details",
      subtitle: "Call Driver is chauffeur-only. You provide the vehicle. Add model, pickup landmark and hours on the booking form."
    },
    {
      title: "Confirm the published estimate",
      subtitle: "Local, airport and outstation show a fare before you pay. Monthly and corporate stay quote-only until Cabzii replies."
    },
    {
      title: "A driver is assigned after booking",
      subtitle: "You do not pick a named driver from a list. Cabzii assigns an available professional and sends driver details."
    }
  ],
  safety: [
    {
      title: "How Cabzii assigns drivers",
      subtitle:
        "You book a service, not a public profile. A professional driver is assigned after confirmation. You can note a preference; replacements stay with operations."
    },
    {
      title: "Experience on Chennai roads",
      subtitle:
        "City, MAA and outstation Call Driver trips are staffed from the same assignment pool. Live availability is shown at booking — not a guaranteed emergency dispatch."
    },
    {
      title: "Insurance and your car",
      subtitle:
        "You supply the vehicle. Keep your car insurance valid. Fare notes cover driving service only — not vehicle damage cover from Cabzii."
    },
    // TODO: Confirm whether every assigned Call Driver has a police-verification certificate before claiming it in copy or schema.
    // TODO: Confirm a mandatory uniform policy before advertising uniformed drivers.
  ],
  safetyImage: {
    src: "/images/acting-driver-chennai-safety.svg",
    alt: "Cabzii Call Driver assignment notes for acting drivers in Chennai",
    width: 640,
    height: 360
  },
  areas: [
    "T. Nagar",
    "Adyar",
    "Velachery",
    "OMR",
    "Anna Nagar",
    "Tambaram",
    "Porur",
    "ECR",
    "Guindy",
    "Nungambakkam"
  ],
  faqs: [
    {
      question: "How do I book an acting driver in Chennai?",
      answer:
        "Call or WhatsApp Cabzii with pickup location, time and trip type, or book on Call Driver. Choose city, airport, outstation or valet, confirm the estimate, and a driver is assigned after booking."
    },
    {
      question: "What are Call Driver charges in Chennai?",
      answer:
        "Local and airport start at ₹500 for 4 hours (standard). Outstation is ₹1,100 per 12-hour day (standard). Premium bands are ₹600 city/airport and ₹1,200 outstation. Extra hours and night charge are listed on this page and on the live quote."
    },
    {
      question: "Do night rates apply for Chennai call drivers?",
      answer:
        "Yes. A ₹100 night charge may apply when pickup is between 10 pm and 6 am. Night bookings depend on a driver being free — Cabzii does not run a separate emergency-driver product."
    },
    {
      question: "How is waiting time billed?",
      answer:
        "Time beyond the package is extra hours: ₹80/hour standard and ₹100/hour premium on local, airport and outstation. Valet extra hours are ₹70. The quote shows extra hours before you confirm."
    },
    {
      question: "Do I need to use my own car?",
      answer:
        "Yes. Acting driver / Call Driver is chauffeur-only. You provide the car. If you need a Cabzii vehicle as well, book a cab instead."
    },
    {
      question: "Who pays outstation food and stay for the driver?",
      answer:
        "You do. The published outstation tariff states that food and accommodation for the driver are the customer's responsibility."
    },
    {
      question: "What is the cancellation policy for Call Driver?",
      answer:
        "Taxi and driver bookings: more than 24 hours before pickup is a full refund after gateway deductions; 6–24 hours may attract up to 25%; under 6 hours or no-show may be up to 100%. See the cancellation policy page."
    },
    {
      question: "How much notice do I need to book?",
      answer:
        "Book as early as you can. Same-day city and airport trips are accepted when a driver is free. Outstation and event valet are safer with advance notice."
    },
    {
      question: "How do I pay for an acting driver in Chennai?",
      answer:
        "Confirm the estimate on Call Driver and pay as shown on the booking form. Cash is the currently enabled checkout method; the fare is visible before you confirm."
    },
    {
      question: "Is airport Call Driver the same as airport taxi?",
      answer:
        "No. Airport Call Driver is a chauffeur in your car to or from MAA. Airport taxi includes a Cabzii cab — book that on the Chennai airport taxi page."
    }
  ],
  related: [
    { href: "/services/airport-taxi/chennai", label: "Airport transfers in Chennai" },
    { href: "/services/car-rental/chennai", label: "Car rental Chennai (with driver)" },
    { href: "/call-driver/book?service=corporate", label: "Employee and corporate drivers" },
    { href: "/tariff", label: "Chennai cab tariff" },
    { href: "/contact", label: "Contact Cabzii" },
    { href: "/about", label: "About Cabzii" }
  ],
  address: {
    streetAddress: "Maduravoyal",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600095",
    addressCountry: "IN"
  },
  bookHref: "/call-driver",
  cityCabsHref: cityCabLandingPath("chennai")
};

export function formatInrCell(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}
