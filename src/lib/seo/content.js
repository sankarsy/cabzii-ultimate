import { SEO_SERVICES } from "./services";

/** Homepage visible FAQs — must match faqJsonLd() for rich results. */
export const HOME_PAGE_FAQS = [
  [
    "How do I book a cab online on Cabzii?",
    "Visit cabzii.in, enter pickup and destination, pick date and time, compare cab fares and confirm with your mobile OTP — no app download required."
  ],
  [
    "Can I book a cab near me in Chennai, Madurai or Coimbatore?",
    "Yes. Search your pickup locality on Cabzii — we show verified taxis near you in Chennai, Madurai, Coimbatore, Trichy and 20+ cities with upfront package fares."
  ],
  [
    "How do I book car rental near me on Cabzii?",
    "Open cabzii.in, choose Local or Rental, enter your pickup area (e.g. Maduravoyal, OMR or your city), compare hourly packages and confirm with OTP — no app required."
  ],
  [
    "How do I book an outstation cab on Cabzii?",
    "Choose Cabs on the home page, select Outstation, enter pickup and drop cities, date and time, then compare vehicles and confirm with OTP login."
  ],
  [
    "Can I book airport pickup in Chennai?",
    "Yes. Use the Airport tab, set pickup or drop direction, and search cabs serving Chennai airport with fixed fare quotes."
  ],
  [
    "What is hourly / local cab rental?",
    "Book a cab for 4, 8 or 12 hours within a city — ideal for weddings, meetings, shopping or local sightseeing."
  ],
  [
    "How do I hire an acting driver?",
    "Open the Drivers tab or visit Acting Driver pages, pick your city and package (hourly, daily or outstation), then book like a regular cab trip."
  ],
  [
    "Are fares shown upfront before I pay?",
    "Yes. Cabzii displays package fare and any discount before payment. Outstation trips show km limits and allowance details on the booking page."
  ],
  [
    "Is OTP login required to book?",
    "Yes. Login with your 10-digit mobile number and OTP to confirm booking and access My Trips anytime."
  ],
  [
    "Which vehicles are available?",
    "Sedan (Dzire, Etios), SUV (Ertiga), Innova and Tempo Traveller options from verified partners across South India."
  ],
  [
    "Do you offer one-way cabs (e.g. Chennai to Tirupati)?",
    "Yes. Search outstation one-way routes or browse route pages like Chennai–Tirupati for upfront sedan and SUV fares."
  ],
  [
    "Can I book holiday packages on cabzii.in?",
    "Yes. Browse Holidays for pilgrimage, beach, family and honeymoon tours with optional cab upgrades shown in each package."
  ],
  [
    "How do I cancel or change my booking?",
    "Contact support via WhatsApp or phone from your booking confirmation. Refunds follow our cancellation policy on the website."
  ],
  [
    "Is Cabzii available outside Chennai?",
    "Cabzii serves Chennai, Bengaluru, Hyderabad, Coimbatore, Madurai, Tirupati and more cities — check Locations for service areas."
  ],
  [
    "What payment methods are accepted?",
    "Pay online through the secure checkout on cabzii.in after OTP verification. Payment options may vary by trip type."
  ],
  [
    "How can I contact Cabzii support?",
    "Use WhatsApp or call the number on the website footer. Share your booking ID for faster help with trips and refunds."
  ]
];

export function getCityFaqs(city, variant = "cab") {
  const name = city.name;
  if (variant === "driver") {
    return [
      [`How much does an acting driver cost in ${name}?`, `Acting driver rates in ${name} depend on hours, day type and outstation allowance. Cabzii shows hourly and daily packages upfront before you confirm.`],
      [`Can I hire a driver for my own car in ${name}?`, `Yes. Driver on hire lets you use your vehicle with a professional chauffeur for local errands, weddings or outstation trips from ${name}.`],
      [`Are acting drivers verified on Cabzii?`, `Cabzii partners with verified vendors. Driver details and package inclusions are shared after booking confirmation.`],
      [`Do you offer outstation acting drivers from ${name}?`, `Yes. Book daily or multi-day acting driver packages for trips leaving ${name} with clear allowance and night charge rules.`]
    ];
  }

  return [
    [`How much does cab booking cost in ${name}?`, `Cab fares in ${name} vary by trip type, vehicle and distance. Local packages and outstation per-km rates are displayed on Cabzii before payment.`],
    [`Can I book airport taxi in ${name}?`, `Yes. Pre-book airport pickup or drop in ${name} with terminal details, flight buffer time and fixed fare quote on Cabzii.`],
    [`Is Cabzii available for outstation trips from ${name}?`, `Yes. Book one way or round trip outstation cabs from ${name} to nearby cities with sedan, SUV, Innova and tempo options.`],
    [`How do I book a cab on Cabzii in ${name}?`, `Enter pickup in ${name}, choose destination, compare vendors, login with mobile OTP and confirm — driver details follow by SMS/WhatsApp.`]
  ];
}

export function getServiceFaqs(service, city) {
  const name = city.name;
  const svc = service.name.toLowerCase();

  const common = [
    [`How do I book ${svc} in ${name}?`, `Search ${service.searchQuery} on Cabzii, select your pickup in ${name}, compare fares and confirm with mobile OTP.`],
    [`Is the fare shown upfront for ${svc} in ${name}?`, `Yes. Cabzii displays package or estimated fare before payment so you know the cost before the trip starts.`],
    [`Which vehicles are available for ${svc} in ${name}?`, `Sedan, SUV, Innova and tempo traveller options depend on service type. Available fleet is shown during search.`]
  ];

  const bySlug = {
    "airport-taxi": [
      [`How early should I book airport taxi in ${name}?`, `Book at least 2–4 hours before pickup; for early morning flights, book the previous evening for guaranteed availability.`],
      [`Do you cover both airport terminals in ${name}?`, `Specify domestic or international terminal and pickup gate in booking notes. Cabzii shares driver contact before arrival.`]
    ],
    "outstation-cab": [
      [`What is included in outstation cab fare from ${name}?`, `Base km, driver allowance, and night charges (if applicable) are shown in the package. Tolls and parking may be listed separately.`],
      [`Can I book a round trip outstation cab from ${name}?`, `Yes. Choose round trip packages with return date or book separate one way legs for flexibility.`]
    ],
    "one-way-cab": [
      [`What is a one way cab from ${name}?`, `One way cab drops you at another city without paying return empty charges. Ideal for relocations and inter-city travel.`],
      [`Can I book Innova one way from ${name}?`, `Yes. SUV and Innova Crysta one way options are available on popular routes — fares shown before booking.`]
    ],
    "driver-on-hire": [
      [`Can I hire a driver for my car in ${name}?`, `Yes. Driver on hire packages cover local hourly, full-day and outstation trips with your own vehicle.`],
      [`What documents does the driver carry?`, `Professional drivers carry valid licence and ID. Vendor verification details are available through Cabzii support.`]
    ],
    "tempo-traveller": [
      [`How many seats in tempo traveller from ${name}?`, `12, 14 and 17 seater AC tempo travellers are common for group travel, tours and pilgrimage trips from ${name}.`],
      [`Is tempo traveller good for ${name} to Tirupati or Pondicherry?`, `Yes. Tempo is popular for family and group pilgrimage or weekend trips from ${name}. Book early on peak weekends.`]
    ],
    "hourly-rental": [
      [`What hourly packages are available in ${name}?`, `Typical slabs include 4 hour / 40 km, 8 hour / 80 km and 12 hour packages. Extra hour and km rates are listed on Cabzii.`],
      [`Is hourly cab rental good for city errands in ${name}?`, `Yes. Hourly rental suits multi-stop meetings, shopping runs and wedding logistics within ${name}.`]
    ],
    "car-rental": [
      ...(city.slug === "chennai"
        ? [
            [
              "Is car rental available in Maduravoyal, Chennai?",
              "Yes. Book car rental in Chennai on Cabzii with pickup in Maduravoyal, Porur, Valasaravakkam and nearby areas — hourly and full-day packages with upfront fares."
            ]
          ]
        : []),
      [
        `What is included in car rental in ${name}?`,
        `Typical packages cover base hours and km (e.g. 4hr/40km or 8hr/80km). Extra hour and km rates are shown before payment on Cabzii.`
      ],
      [
        `Can I book car rental in ${name} online?`,
        `Yes. Search car rental in ${name} on Cabzii, pick your package, login with mobile OTP and confirm — ideal for local sightseeing and city travel.`
      ]
    ]
  };

  return [...(bySlug[service.slug] || []), ...common];
}

export function getRouteFaqs(route) {
  const { fromCity, toCity, distance, duration, sedanFrom, suvFrom, slug } = route;

  const bySlug = {
    "chennai-to-trichy-cab": [
      [
        "What is the Chennai to Trichy distance by car?",
        `Chennai to Trichy is approximately ${distance} by road (around 330 km via NH44/NH38), typically ${duration} by car excluding long meal breaks.`
      ],
      [
        "How much is Chennai to Trichy one way taxi fare?",
        `Chennai to Trichy one-way taxi fares start around ₹${sedanFrom.toLocaleString("en-IN")} for sedan (Dzire/Etios) and from ₹${suvFrom.toLocaleString("en-IN")} for SUV/Innova. Exact fare is shown on Cabzii before booking.`
      ],
      [
        "Is Chennai to Trichy cab service available online?",
        "Yes. Book cab from Chennai to Trichy on Cabzii — enter pickup and drop, choose vehicle type and confirm with mobile OTP. Driver details are shared before departure."
      ],
      [
        "Can I book a cab from Chennai to Trichy for Srirangam temple visit?",
        "Yes. Specify Srirangam or Rock Fort as your drop landmark during booking. Sedan suits 1–3 passengers; families often choose SUV or Innova for luggage and prasadam."
      ],
      [
        "Is toll included in Chennai to Trichy cab fare?",
        "Toll treatment varies by vendor package. Cabzii shows toll, state tax and driver allowance inclusions clearly in the fare breakdown before payment."
      ]
    ]
  };

  if (bySlug[slug]) return bySlug[slug];

  return [
    [`What is the distance from ${fromCity.name} to ${toCity.name} by cab?`, `The road distance is approximately ${distance} and usually takes ${duration} depending on traffic and stops.`],
    [`How much is one way cab fare from ${fromCity.name} to ${toCity.name}?`, `Sedan one way fares start around ₹${sedanFrom.toLocaleString("en-IN")}; SUV/Innova from ₹${suvFrom.toLocaleString("en-IN")}. Exact fare is shown on Cabzii before booking.`],
    [`Can I book one way cab ${fromCity.name} to ${toCity.name} online?`, `Yes. Enter pickup in ${fromCity.name} and drop in ${toCity.name} on Cabzii, choose cab type and confirm with OTP.`],
    [`Is toll included in ${fromCity.name} to ${toCity.name} cab fare?`, `Toll treatment varies by vendor. Cabzii shows inclusions and any extra charges clearly in the fare breakdown.`],
    [`Can I book return cab ${toCity.name} to ${fromCity.name}?`, `Yes. Book the reverse route separately or choose round trip if you need the same cab to wait or return.`]
  ];
}

export function cityAreas(citySlug) {
  const areas = {
    chennai: ["T. Nagar", "OMR", "Anna Nagar", "Velachery", "Tambaram", "Adyar", "Porur", "Guindy"],
    bengaluru: ["Whitefield", "Electronic City", "Koramangala", "Indiranagar", "Hebbal", "Marathahalli", "Jayanagar"],
    hyderabad: ["Gachibowli", "HITEC City", "Secunderabad", "Madhapur", "Kukatpally", "LB Nagar"],
    coimbatore: ["RS Puram", "Peelamedu", "Gandhipuram", "Saibaba Colony"],
    madurai: ["Anna Nagar", "KK Nagar", "Simmakkal", "Tallakulam"]
  };
  return areas[citySlug] || [];
}

export function relatedServicesForCity(citySlug) {
  return SEO_SERVICES.filter((s) => {
    if (s.slug === "tour-packages") return true;
    return true;
  }).slice(0, 8);
}
