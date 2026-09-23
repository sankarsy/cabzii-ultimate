import { ORG_EMAIL, ORG_PHONE, SITE_NAME, SITE_URL } from "../lib/seo/constants";
import { CABZII_PHONE_DIGITS, whatsappBookingUrl } from "../lib/conversion";
import { cityCabLandingPath, CALL_DRIVERS_CHENNAI_PATH } from "../lib/cityCabPaths";

export { CALL_DRIVERS_CHENNAI_PATH };

/** Published Call Driver tariff (backend src/config/callDriverTariff.js). Extra hour is ₹100. */
export const CALL_DRIVER_TARIFF = {
  nightStartHour: 22,
  nightStartMinute: 15,
  nightEndHour: 5,
  nightEndMinute: 30,
  cancelCharge: 100,
  local: {
    minHours: 3,
    standard: 450,
    premium: 450,
    extraHourStandard: 100,
    extraHourPremium: 100,
    nightCharge: 100,
    dropChargeMin: 50,
    dropCharge: 100,
    outOfCityCharge: 100
  },
  outstation: {
    perDayHours: 12,
    perDayStandard: 1500,
    perDayPremium: 1500,
    extraHourStandard: 100,
    extraHourPremium: 100,
    oneWayMinKm: 250,
    oneWayRate: 1700,
    foodStayNote:
      "Return trips: driver accommodation is extra (you arrange stay — not in this fare). One-way ₹1,700 includes bus fare for the driver."
  },
  airport: {
    minHours: 3,
    standard: 450,
    premium: 450,
    extraHourStandard: 100,
    extraHourPremium: 100,
    nightCharge: 100
  },
  valet: {
    driverRate: 600,
    minHours: 5,
    extraHour: 100,
    supervisorRate: 700,
    driversPerSupervisor: 10
  },
  monthly: {
    extraHour: 60,
    normal10: 22000,
    normal12: 22000,
    luxury10: 24000,
    luxury12: 26000
  }
};

const local = CALL_DRIVER_TARIFF.local;

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
  title: "Call Drivers in Chennai | Hire Acting Drivers | Cabzii",
  description:
    "Hire call drivers in Chennai for your own car — city trips, outstation acting driver days and MAA airport chauffeur. Fares shown before you confirm.",
  keywords:
    "call drivers in Chennai, acting driver in Chennai, outstation acting driver, hire acting drivers Chennai, airport call driver Chennai, city call driver",
  h1: "Hire Call Drivers in Chennai",
  intro: [
    "Cabzii Call Driver is an acting driver for your own car in Chennai — city hours, MAA airport pickup or drop, and outstation acting driver days.",
    "Call or WhatsApp to book. A professional driver is assigned after you confirm. Availability depends on a driver being free at that hour."
  ],
  trustBadges: [
    "Driver for your own car",
    "3-hour city minimum",
    "Extra hour ₹100",
    "Assigned after you book"
  ],
  hero: {
    src: "/images/acting-driver-chennai-hero.svg",
    alt: "Acting driver in Chennai standing beside a customer car for a Cabzii Call Driver booking",
    width: 1200,
    height: 630
  },
  tariffCaption: "Acting drivers hiring tariff in Chennai — published Call Driver rate card. Extra per hour is ₹100.",
  tariffSections: [
    {
      title: "Incity tariff (normal & luxury cars)",
      rows: [
        { schedule: "Minimum 3 hours", amount: "₹450" },
        { schedule: "Extra per hour", amount: "₹100" },
        { schedule: "Night charges (10:15 PM – 5:30 AM)", amount: "₹100 extra" },
        { schedule: "Drop charge minimum (5 km)", amount: "₹50 / ₹100" },
        { schedule: "Out of city (more than 40 km)", amount: "₹100" },
        { schedule: "Cancel charge (inform before 30 min)", amount: "₹100" }
      ]
    },
    {
      title: "Outstation return trip",
      intro: "Per-day charge covers one-way and return days in your car. Accommodation for the driver is extra on return trips.",
      rows: [
        { schedule: "Per day (12 hrs)", amount: "₹1,500 + accommodation" },
        { schedule: "Extra per hour", amount: "₹100" },
        { schedule: "Cancel charge", amount: "₹100" }
      ]
    },
    {
      title: "Outstation one-way trip",
      rows: [
        { schedule: "Minimum 250 km", amount: "₹1,700 (including bus fare)" },
        { schedule: "Cancel charge", amount: "₹100" }
      ]
    },
    {
      title: "Valet parking",
      intro: "Trained Call Drivers for events. One supervisor is required for every ten drivers.",
      rows: [
        { schedule: "Per driver", amount: "₹600" },
        { schedule: "Minimum hours", amount: "5" },
        { schedule: "Extra per hour", amount: "₹100" },
        { schedule: "Supervisor (per 10 drivers)", amount: "₹700" }
      ]
    },
    {
      title: "Monthly Call Driver plans",
      intro: "Regular driver plans. Extra hours on monthly retainers are ₹60.",
      rows: [
        { schedule: "Normal · 10 hrs", amount: "₹22,000 · extra hr ₹60" },
        { schedule: "Normal · 12 hrs", amount: "₹22,000 · extra hr ₹60" },
        { schedule: "Luxury · 10 hrs", amount: "₹24,000 · extra hr ₹60" },
        { schedule: "Luxury · 12 hrs", amount: "₹26,000 · extra hr ₹60" }
      ]
    }
  ],
  tariffRows: [
    {
      service: "City hourly (3 hr min)",
      standard: local.standard,
      premium: local.premium,
      note: "Extra hour ₹100"
    },
    {
      service: "Full day / outstation return",
      standard: CALL_DRIVER_TARIFF.outstation.perDayStandard,
      premium: CALL_DRIVER_TARIFF.outstation.perDayPremium,
      note: "12-hour day. Accommodation extra."
    },
    {
      service: "Outstation one-way",
      standard: CALL_DRIVER_TARIFF.outstation.oneWayRate,
      premium: CALL_DRIVER_TARIFF.outstation.oneWayRate,
      note: "Min 250 km, including bus fare."
    },
    {
      service: "Airport pickup or drop",
      standard: CALL_DRIVER_TARIFF.airport.standard,
      premium: CALL_DRIVER_TARIFF.airport.premium,
      note: "3 hr min. Driver in your car at MAA — not an airport taxi."
    },
    {
      service: "Night charge (10:15 pm – 5:30 am)",
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
        "Local Call Driver starts at 3 hours for office days, hospitals and multi-stop city trips in your car. Book on Call Driver → Local.",
      href: "/call-driver/book?service=local",
      image: { src: "/images/acting-driver-chennai-city.svg", alt: "City call driver for a Chennai local trip in the customer’s car", width: 640, height: 360 }
    },
    {
      id: "outstation",
      title: "Outstation acting driver from Chennai",
      subtitle:
        "Hire an outstation acting driver for highway days in your car to Tirupati, Pondicherry, Bengaluru and similar corridors. Return is ₹1,500 per 12-hour day plus accommodation. One-way is ₹1,700 (min 250 km, bus fare included).",
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
        "Valet Call Driver covers functions and guest parking. Minimum 5 hours; extra hours ₹100. One supervisor (₹700) for every ten drivers.",
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
      question: "Do you provide an outstation acting driver from Chennai?",
      answer:
        "Yes. Book Outstation on Call Driver for a return 12-hour day in your own car (from ₹1,500 plus accommodation) or a one-way trip from ₹1,700 including bus fare (min 250 km)."
    },
    {
      question: "What are Call Driver charges in Chennai?",
      answer:
        "Local and airport start at ₹450 for 3 hours. Extra hour is ₹100. Outstation return is ₹1,500 per 12-hour day plus accommodation. One-way is ₹1,700 (min 250 km, bus fare included). Night charge ₹100 from 10:15 pm to 5:30 am. Monthly plans from ₹22,000."
    },
    {
      question: "Do night rates apply for Chennai call drivers?",
      answer:
        "Yes. A ₹100 night charge may apply when pickup is between 10:15 pm and 5:30 am. Night bookings depend on a driver being free — Cabzii does not run a separate emergency-driver product."
    },
    {
      question: "How is waiting time billed?",
      answer:
        "Time beyond the package is extra hours at ₹100/hour on city, airport and outstation return trips. Valet extra hours are also ₹100. Monthly retainers use ₹60 extra hour. The quote shows extra hours before you confirm."
    },
    {
      question: "Do I need to use my own car?",
      answer:
        "Yes. Acting driver / Call Driver is chauffeur-only. You provide the car. If you need a Cabzii vehicle as well, book a cab instead."
    },
    {
      question: "Who pays outstation food and stay for the driver?",
      answer:
        "On return outstation trips, accommodation for the driver is extra. One-way outstation includes bus fare in the ₹1,700 rate."
    },
    {
      question: "What is the cancellation policy for Call Driver?",
      answer:
        "Call Driver cancel charge is ₹100 when you inform at least 30 minutes before pickup. Cab bookings follow the published time-based cancellation policy. See the cancellation policy page."
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
