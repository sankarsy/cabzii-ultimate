import { SEO_SERVICES } from "./services";
import { airportInfoForCity, cityHasCommercialAirport } from "./airports";
import { CHENNAI_CAB_FAQS, CHENNAI_DRIVER_FAQS } from "./chennaiCluster";

/** Homepage visible FAQs — must match faqJsonLd() for rich results. */
export const HOME_PAGE_FAQS = [
  [
    "How do I book a cab online on Cabzii?",
    "Visit cabzii.in, enter pickup and destination, pick date and time, compare cab fares and confirm — no app download required."
  ],
  [
    "Can I book a cab near me in Chennai, Madurai or Coimbatore?",
    "Yes. Search your pickup locality on Cabzii — we show available cabs near you in Chennai, Madurai, Coimbatore, Trichy, Kanchipuram, Tirupati, Kanyakumari and 30+ cities with package fares shown before you pay."
  ],
  [
    "How do I book car rental near me on Cabzii?",
    "Open cabzii.in, choose Local Cab, enter your pickup area, compare hourly packages (including 4hr/40km and 8hr/80km) and confirm — no app required."
  ],
  [
    "How do I book an outstation cab on Cabzii?",
    "Choose Cabs on the home page, select Outstation, enter pickup and drop cities, date and time, then compare vehicles. Fares are shown before you confirm."
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
    "Login uses a 10-digit mobile OTP when SMS is working. If OTP fails, use Call or WhatsApp — your enquiry is still saved when you enter pickup and phone."
  ],
  [
    "Which vehicles are available?",
    "Sedan (Swift Dzire, Honda Amaze), Ertiga, Innova Crysta and Tempo Traveller (12 / 13 / 18 seater) from Cabzii in South India."
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
    "Cabzii serves Chennai, Coimbatore, Madurai, Trichy, Kanchipuram, Tirupati, Kanyakumari, Thoothukudi, Bengaluru, Hyderabad and more — check Locations and city cab-booking pages."
  ],
  [
    "What payment methods are accepted?",
    "Pay online through the secure checkout on cabzii.in. Payment options may vary by trip type."
  ],
  [
    "How can I contact Cabzii support?",
    "Use WhatsApp or call the number on the website footer. Share your booking ID for faster help with trips and refunds."
  ]
];

export function getCityFaqs(city, variant = "cab") {
  const name = city.name;
  if (variant === "driver") {
    if (city.slug === "chennai") return CHENNAI_DRIVER_FAQS;
    return [
      [`How much does an acting driver cost in ${name}?`, `Acting driver rates in ${name} depend on hours, day type and outstation allowance. Cabzii shows hourly and daily packages upfront before you confirm.`],
      [`Can I hire a driver for my own car in ${name}?`, `Yes. Driver on hire lets you use your vehicle with a professional chauffeur for local errands, weddings or outstation trips from ${name}.`],
      [`Do you offer outstation acting drivers from ${name}?`, `Yes. Book daily or multi-day acting driver packages for trips leaving ${name} with clear allowance and night charge rules.`]
    ];
  }

  const chennaiCabFaqs =
    city.slug === "chennai"
      ? [
          ...CHENNAI_CAB_FAQS,
          [
            "Can I book a Dzire Tour S taxi in Chennai?",
            "Yes. Tour S taxi booking in Chennai is available on Cabzii — choose a Swift Dzire / Tour S sedan for local packages, airport drops and outstation trips with fares shown before you pay."
          ],
          [
            "What is Tour S taxi booking?",
            "Tour S is Maruti Suzuki’s commercial Dzire taxi used by cab operators. On Cabzii you book it like any sedan in Chennai — 4-hour / 8-hour local hire or one-way outstation."
          ]
        ]
      : [];

  const airportFaq = cityHasCommercialAirport(city.slug)
    ? [
        [
          `Can I book airport taxi in ${name}?`,
          `Yes. Pre-book airport pickup or drop in ${name} with terminal details, flight buffer time and a fixed fare quote on Cabzii.`
        ]
      ]
    : [
        [
          `Does ${name} have an airport taxi?`,
          airportInfoForCity(city.slug)?.note
            ? `${airportInfoForCity(city.slug).note} Book the transfer on Cabzii with an upfront fare.`
            : `${name} airport transfers are booked as a cab to the nearest commercial airport. Cabzii shows the fare before you pay.`
        ]
      ];

  return [
    ...chennaiCabFaqs,
    [`How much does cab booking cost in ${name}?`, `Cab fares in ${name} vary by trip type, vehicle and distance. Local packages and outstation per-km rates are displayed on Cabzii before payment.`],
    ...airportFaq,
    [`Is Cabzii available for outstation trips from ${name}?`, `Yes. Book one way or round trip outstation cabs from ${name} to nearby cities with sedan, SUV, Innova and tempo options.`],
    [`How do I book a cab on Cabzii in ${name}?`, `Enter pickup in ${name}, choose destination, compare vendors and confirm — driver details follow by SMS/WhatsApp.`]
  ];
}

export function getServiceFaqs(service, city) {
  const name = city.name;
  const svc = service.name.toLowerCase();

  const common = [
    [`How do I book ${svc} in ${name}?`, `Search ${service.searchQuery} on Cabzii, select your pickup in ${name}, compare fares and confirm.`],
    [`Is the fare shown upfront for ${svc} in ${name}?`, `Yes. Cabzii displays package or estimated fare before payment so you know the cost before the trip starts.`],
    [`Which vehicles are available for ${svc} in ${name}?`, `Sedan, SUV, Innova and tempo traveller options depend on service type. Available fleet is shown during search.`]
  ];

  const chennaiAirportFaqs =
    city.slug === "chennai" && service.slug === "airport-taxi"
      ? [
          [
            "How do I book Chennai airport taxi pickup or drop?",
            "Open this page or Cabs, choose the Airport tab, set MAA as pickup or drop, add terminal and flight time in notes, then confirm. Driver details follow by SMS or WhatsApp."
          ],
          [
            "What is the Chennai airport cab fare?",
            "Airport trips usually use a local Chennai package. Swift Dzire starts at ₹1,200 for 4 Hrs / 40 Km on the published tariff. Extra km, extra hour, tolls and parking are listed on the tariff and on your live quote — they are not assumed included."
          ],
          [
            "Does this page cover Chennai airport to the city and nearby towns?",
            "Yes. City drops (T. Nagar, OMR, Anna Nagar, Tambaram and similar) stay on this airport page. Longer one-way trips use existing route pages such as Chennai to Tirupati or Chennai to Pondicherry — not a second airport URL."
          ],
          [
            "Is Chennai airport taxi a self-drive car?",
            "No. It is a chauffeur-driven cab. For a driver in your own car to MAA, book Call Driver / acting driver instead."
          ]
        ]
      : [];

  const chennaiOutstationFaqs =
    city.slug === "chennai" && service.slug === "outstation-cab"
      ? [
          [
            "What is the outstation km minimum from Chennai?",
            "On the published tariff, cars have a 250 km outstation minimum and vans have a 300 km minimum. Extra km and driver batta are listed before you pay."
          ],
          [
            "Should I book one-way or round trip from Chennai?",
            "Book one-way for a single drop (see one-way cab Chennai and the route page). Book this outstation page when the same cab should wait or return. There is no separate round-trip URL."
          ]
        ]
      : [];

  const chennaiOneWayFaqs =
    city.slug === "chennai" && service.slug === "one-way-cab"
      ? [
          [
            "Where are Chennai one-way fares listed?",
            "Indicative sedan and SUV starting fares are on each route page (Tirupati, Pondicherry, Bengaluru, Madurai and others). Confirm the live quote before payment."
          ]
        ]
      : [];

  const chennaiTempoFaqs =
    city.slug === "chennai" && service.slug === "tempo-traveller"
      ? [
          [
            "Is Tempo Traveller booking the same as bus tickets?",
            "No. This is chauffeur-driven van hire (12–18 seater), not a scheduled bus seat. Mini bus hire on the tariff is also vehicle hire, not bus ticketing."
          ]
        ]
      : [];

  const chennaiRentalFaqs =
    city.slug === "chennai" && (service.slug === "car-rental" || service.slug === "cab-rental")
      ? [
          [
            "Does Cabzii offer self-drive car rental in Chennai?",
            "No. Car rental and cab rental on Cabzii are chauffeur-driven packages. For a driver in your own car, use acting driver / Call Driver."
          ]
        ]
      : [];

  const bySlug = {
    "airport-taxi": [
      ...(cityHasCommercialAirport(city.slug)
        ? [
            [
              `How early should I book airport taxi in ${name}?`,
              `Book at least 2–4 hours before pickup when you can; for early morning flights, book the previous evening. Availability depends on a partner cab being free — Cabzii does not guarantee last-minute dispatch.`
            ],
            [
              `Do you cover airport terminals in ${name}?`,
              `Specify domestic or international terminal and pickup gate in booking notes. Cabzii shares driver contact before arrival.`
            ]
          ]
        : [
            [
              `Is there an airport in ${name}?`,
              airportInfoForCity(city.slug)?.note ||
                `${name} does not have a commercial passenger airport. Book a Cabzii cab to the nearest airport.`
            ],
            [
              `How do I book an airport transfer from ${name}?`,
              `Open airport taxi for ${name} on Cabzii, set pickup in ${name} and drop at the nearest airport shown on the page, then confirm.`
            ]
          ])
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
      [`What documents does the driver carry?`, `Drivers assigned after booking carry a valid licence. For questions about a specific trip, contact Cabzii support with your booking ID.`]
    ],
    "tempo-traveller": [
      [`How many seats in tempo traveller from ${name}?`, `12, 13, 14, 16 and 18 seater AC tempo travellers are available for group travel, tours and pilgrimage trips from ${name}.`],
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
        `Yes. Search car rental in ${name} on Cabzii, pick your package and confirm — ideal for local sightseeing and city travel.`
      ]
    ]
  };

  return [
    ...chennaiAirportFaqs,
    ...chennaiOutstationFaqs,
    ...chennaiOneWayFaqs,
    ...chennaiTempoFaqs,
    ...chennaiRentalFaqs,
    ...(bySlug[service.slug] || []),
    ...common
  ];
}

export function getRouteFaqs(route) {
  const { fromCity, toCity, distance, duration, sedanFrom, suvFrom, slug } = route;

  const bySlug = {
    "chennai-to-tirupati-cab": [
      [
        "How much is Chennai to Tirupati cab fare?",
        `Chennai to Tirupati one-way cab fares start around ₹${sedanFrom.toLocaleString("en-IN")} for sedan (Swift Dzire / Honda Amaze) and from ₹${suvFrom.toLocaleString("en-IN")} for Ertiga or Innova. Exact fare is shown on Cabzii before booking.`
      ],
      [
        "What is the Chennai to Tirupati distance by car?",
        `Chennai to Tirupati is approximately ${distance} by road (${duration} by car), ideal for temple darshan and same-day return trips.`
      ],
      [
        "Can I book Tirupati car booking online from Chennai?",
        "Yes. Book Chennai to Tirupati cab on Cabzii — enter pickup and drop, choose sedan or SUV, and confirm. Driver details are shared before departure."
      ],
      [
        "Which cars are available for Chennai to Tirupati cab?",
        "Swift Dzire, Honda Amaze (sedan), Ertiga and Toyota Innova Crysta are popular on this route. Select your vehicle while booking on Cabzii."
      ],
      [
        "Is toll included in Chennai to Tirupati taxi fare?",
        "Toll and state tax treatment varies by package. Cabzii shows inclusions and any extra charges clearly in the fare breakdown before payment."
      ]
    ],
    "chennai-to-rameswaram-cab": [
      [
        "How much is Chennai to Rameswaram cab fare?",
        `Chennai to Rameswaram one-way cab fares start around ₹${sedanFrom.toLocaleString("en-IN")} for sedan and from ₹${suvFrom.toLocaleString("en-IN")} for SUV/Innova. Exact fare is shown on Cabzii before booking.`
      ],
      [
        "What is the Chennai to Rameswaram distance by car?",
        `Chennai to Rameswaram is approximately ${distance} by road (${duration}), including the scenic Pamban bridge approach.`
      ],
      [
        "Can I book Chennai to Rameswaram pilgrimage cab online?",
        "Yes. Book Chennai to Rameswaram cab on Cabzii — choose sedan or SUV, confirm, and receive driver details before departure."
      ]
    ],
    "madurai-to-rameswaram-cab": [
      [
        "How much is Madurai to Rameswaram cab fare?",
        `Madurai to Rameswaram day-trip cab fares start around ₹${sedanFrom.toLocaleString("en-IN")} for sedan. SUV/Innova from ₹${suvFrom.toLocaleString("en-IN")}.`
      ],
      [
        "What is Madurai to Rameswaram travel time?",
        `The drive is approximately ${distance} and usually takes ${duration} one way, ideal for same-day temple darshan.`
      ]
    ],
    "chennai-to-trichy-cab": [
      [
        "What is the Chennai to Trichy distance by car?",
        `Chennai to Trichy is approximately ${distance} by road (around 330 km via NH44/NH38), typically ${duration} by car excluding long meal breaks.`
      ],
      [
        "How much is Chennai to Trichy one way taxi fare?",
        `Chennai to Trichy one-way taxi fares start around ₹${sedanFrom.toLocaleString("en-IN")} for sedan (Dzire/Amaze) and from ₹${suvFrom.toLocaleString("en-IN")} for Ertiga/Innova. Exact fare is shown on Cabzii before booking.`
      ],
      [
        "Is Chennai to Trichy cab service available online?",
        "Yes. Book cab from Chennai to Trichy on Cabzii — enter pickup and drop, choose vehicle type and confirm. Driver details are shared before departure."
      ],
      [
        "Can I book a cab from Chennai to Trichy for Srirangam temple visit?",
        "Yes. Specify Srirangam or Rock Fort as your drop landmark during booking. Sedan suits 1–3 passengers; families often choose SUV or Innova for luggage and prasadam."
      ],
      [
        "Is toll included in Chennai to Trichy cab fare?",
        "Toll treatment varies by vendor package. Cabzii shows toll, state tax and driver allowance inclusions clearly in the fare breakdown before payment."
      ]
    ],
    "chennai-to-pondicherry-cab": [
      [
        "What is the Chennai to Pondicherry cab distance?",
        `This route is approximately ${distance} by road, typically ${duration}. Indicative sedan fares start around ₹${sedanFrom.toLocaleString("en-IN")}; confirm the live quote.`
      ],
      [
        "Is round trip booked on this page?",
        "This page is one-way. If the same cab should wait or return, book outstation cab Chennai instead."
      ]
    ],
    "chennai-to-bangalore-cab": [
      [
        "How long is Chennai to Bangalore by cab?",
        `The catalog distance is ${distance}, typically ${duration} on NH48 excluding long stops. Sedan from ₹${sedanFrom.toLocaleString("en-IN")} on this page — live fare may differ.`
      ]
    ],
    "chennai-to-kanchipuram-cab": [
      [
        "What is Chennai to Kanchipuram cab distance?",
        `Approximately ${distance}, typically ${duration}. Indicative sedan from ₹${sedanFrom.toLocaleString("en-IN")}.`
      ]
    ],
    "chennai-to-tiruvannamalai-cab": [
      [
        "Can I book Chennai to Tiruvannamalai cab for Girivalam?",
        `Yes, as a one-way or via outstation if the cab should wait. Distance on this page: ${distance}, typically ${duration}.`
      ]
    ],
    "chennai-to-madurai-cab": [
      [
        "What is Chennai to Madurai cab fare?",
        `Indicative sedan from ₹${sedanFrom.toLocaleString("en-IN")}, SUV from ₹${suvFrom.toLocaleString("en-IN")}. Distance ${distance}, typically ${duration}. Confirm the live quote.`
      ]
    ],
    "chennai-to-kanyakumari-cab": [
      [
        "How long is Chennai to Kanyakumari by cab?",
        `This page lists ${distance}, typically ${duration}. It is a long highway, not a casual same-day hop.`
      ]
    ],
    "chennai-to-ooty-cab": [
      [
        "Should I book Chennai to Ooty or Coimbatore to Ooty?",
        `Chennai to Ooty on this page is ${distance}, typically ${duration}. The shorter hill transfer is Coimbatore to Ooty.`
      ]
    ],
    "madurai-to-kanyakumari-cab": [
      [
        "What is Madurai to Kanyakumari cab distance?",
        `Approximately ${distance}, typically ${duration}. Indicative sedan from ₹${sedanFrom.toLocaleString("en-IN")}.`
      ]
    ],
    "bengaluru-to-mysore-cab": [
      [
        "What is Bengaluru to Mysore cab fare?",
        `Indicative sedan from ₹${sedanFrom.toLocaleString("en-IN")}. Distance ${distance}, typically ${duration}.`
      ]
    ],
    "coimbatore-to-ooty-cab": [
      [
        "How long is Coimbatore to Ooty by cab?",
        `This page lists ${distance}, typically ${duration} including the ghat. Timing varies with weather and tourist traffic.`
      ]
    ],
    "bengaluru-to-tirupati-cab": [
      [
        "How much is Bengaluru to Tirupati cab fare?",
        `Indicative sedan from ₹${sedanFrom.toLocaleString("en-IN")}, SUV from ₹${suvFrom.toLocaleString("en-IN")}. Distance ${distance}, typically ${duration}. Confirm before payment.`
      ]
    ]
  };

  if (bySlug[slug]) return bySlug[slug];

  return [
    [`What is the distance from ${fromCity.name} to ${toCity.name} by cab?`, `The road distance is approximately ${distance} and usually takes ${duration} depending on traffic and stops.`],
    [`How much is one way cab fare from ${fromCity.name} to ${toCity.name}?`, `Sedan one way fares start around ₹${sedanFrom.toLocaleString("en-IN")}; SUV/Innova from ₹${suvFrom.toLocaleString("en-IN")}. Exact fare is shown on Cabzii before booking.`],
    [`Can I book one way cab ${fromCity.name} to ${toCity.name} online?`, `Yes. Enter pickup in ${fromCity.name} and drop in ${toCity.name} on Cabzii, choose cab type and confirm.`],
    [`Is toll included in ${fromCity.name} to ${toCity.name} cab fare?`, `Toll treatment varies by vendor. Cabzii shows inclusions and any extra charges clearly in the fare breakdown.`],
    [`Can I book return cab ${toCity.name} to ${fromCity.name}?`, `Yes. Book the reverse route separately or choose round trip if you need the same cab to wait or return.`]
  ];
}

/** Vehicle / cab detail page FAQs — dynamic from catalog data. */
export function getCabFaqs(cab) {
  if (Array.isArray(cab?.faq) && cab.faq.length) {
    return cab.faq
      .filter((f) => f?.question?.trim() && f?.answer?.trim())
      .map((f) => [f.question.trim(), f.answer.trim()]);
  }

  const title = cab?.vehicleName || cab?.title || "this cab";
  const city = cab?.city || "your city";
  const type = cab?.type || "AC cab";
  const priceFrom =
    cab?.price && Number(cab.price) > 0
      ? `₹${Number(cab.price).toLocaleString("en-IN")}`
      : "rates shown at checkout";

  return [
    [
      `How much does ${title} cost on Cabzii?`,
      `Packages for ${title} start from ${priceFrom}. Local 4hr/8hr and outstation fares are displayed before you pay on Cabzii.in.`
    ],
    [
      `Is driver included when I book ${title}?`,
      "Yes. All Cabzii cab packages include a professional driver. Package km/hour limits and extras are shown in the fare breakdown."
    ],
    [
      `Can I book ${title} for airport pickup in ${city}?`,
      `Yes. Choose a local or airport package while booking ${title} on Cabzii for ${city} pickup, drop or outstation trips.`
    ],
    [
      `What vehicles are similar to ${title}?`,
      `${title} is listed as ${type}. Browse similar cabs on Cabzii or contact us on WhatsApp for the best match for your group size.`
    ],
    [
      `How do I book ${title} online?`,
      "Select your package on this page, continue to payment and receive driver details after confirmation."
    ]
  ];
}

export function cityAreas(citySlug) {
  const areas = {
    chennai: ["T. Nagar", "OMR", "Anna Nagar", "Velachery", "Tambaram", "Adyar", "Porur", "Guindy"],
    bengaluru: ["Whitefield", "Electronic City", "Koramangala", "Indiranagar", "Hebbal", "Marathahalli", "Jayanagar"],
    hyderabad: ["Gachibowli", "HITEC City", "Secunderabad", "Madhapur", "Kukatpally", "LB Nagar"],
    coimbatore: ["RS Puram", "Peelamedu", "Gandhipuram", "Saibaba Colony", "Sitra", "Singanallur"],
    madurai: ["Anna Nagar", "KK Nagar", "Simmakkal", "Tallakulam", "Mattuthavani", "Goripalayam"],
    vellore: ["CMC / Scudder Road", "Katpadi", "Sathuvachari", "Gandhi Nagar", "Bagayam", "Sripuram"],
    trichy: ["Srirangam", "Cantonment", "Thillai Nagar", "Woraiyur", "K. K. Nagar", "Thuvakudi"],
    salem: ["Fairlands", "Hasthampatti", "New Bus Stand", "Suramangalam", "Steel Plant", "Yercaud Road"],
    erode: ["Powerhouse Road", "Collectorate", "Brough Road", "Perundurai Road", "Solar", "Bhavani"],
    hosur: ["SIPCOT", "Bagalur Road", "Bus Stand", "Rayakottai Road", "Mathigiri", "Electronic City Road"],
    pondicherry: ["White Town", "Auroville", "Lawspet", "Villianur", "Promenade", "ECR"],
    tirupati: ["Alipiri", "Renigunta", "Kapila Theertham", "Tiruchanur", "Chandragiri", "Airport Road"],
    tirunelveli: ["Junction", "Palayamkottai", "Vannarpettai", "Melapalayam", "Maharaja Nagar", "Pettai"],
    rameswaram: ["Ramanathaswamy Temple", "Agni Theertham", "Pamban", "Thangachi Madam", "Kunthukal"],
    ooty: ["Charing Cross", "Botanical Garden", "Commercial Road", "Coonoor", "Lovedale", "Ketti"],
    kodaikanal: ["Lake Road", "Coaker's Walk", "Seven Roads", "Anna Salai", "Kodai Road approach"],
    kanchipuram: ["Kamakshi Temple", "Ekambareswarar", "Varadaraja Perumal", "Silk streets", "Kanchi Mutt", "Bus stand"],
    tiruvannamalai: ["Arunachaleswarar Temple", "Girivalam Road", "Ramana Ashram", "Pradakshina", "Bus stand"],
    thanjavur: ["Brihadeeswarar Temple", "Palace", "Bus stand", "Medical College Road", "Vallam"],
    kumbakonam: ["Sarangapani", "Adi Kumbeswarar", "Mahamaham tank", "Bus stand", "Thirunageswaram"],
    palani: ["Temple base", "Winch station", "Adivaram", "Bus stand", "Ayyampalayam Road"],
    chidambaram: ["Nataraja Temple", "East Car Street", "Bus stand", "Pichavaram Road", "Annamalai Nagar"],
    kanyakumari: ["Sunrise viewpoint", "Ferry jetty", "Kumari Amman", "Suchindram", "Railway"],
    velankanni: ["Basilica", "Beach Road", "Bus stand", "Nagore Road", "Vailankanni station"],
    thoothukudi: ["TCR Airport", "Harbour", "Palayamkottai Road", "Bryant Nagar", "Spit"],
    tiruppur: ["Avinashi Road", "Bus stand", "Export cluster", "Kangeyam Road", "CJB approach"],
    nagercoil: ["Town centre", "Railway", "Nagaraja Temple", "Suchindram Road", "Court"],
    dindigul: ["Bus stand", "Fort Road", "Palani Road", "Collectorate", "Kodai Road"],
    karur: ["Pasupatheeswarar", "Bus stand", "NH44", "Vengamedu", "LNS Puram"],
    villupuram: ["Junction", "Bus stand", "Gingee Road", "East Pondy Road", "Collectorate"],
    karaikudi: ["Town hotels", "Kanadukathan", "Athangudi", "Bus stand", "Sekkalai"],
    theni: ["Bus stand", "Cumbum Road", "Periyakulam Road", "Suruli approach", "Allinagaram"],
    nagapattinam: ["Beach Road", "Bus stand", "Velankanni Road", "Harbour", "Nagore"],
    thiruchendur: ["Temple east gopuram", "Beach lodges", "Station", "Kayalpattinam Road", "Manapad Road"],
    mysore: ["Mysore Palace", "Chamundi Hill", "KRS", "Vijayanagar", "Railway Station"],
    mumbai: ["Andheri", "Bandra", "BKC", "Powai", "Navi Mumbai", "Airport (BOM)"],
    delhi: ["Aerocity", "Connaught Place", "Gurgaon", "Noida", "Dwarka", "IGI"],
    pune: ["Hinjawadi", "Koregaon Park", "Viman Nagar", "Hadapsar", "PNQ Airport"],
    kolkata: ["Park Street", "Salt Lake", "Howrah", "New Town", "CCU Airport"],
    kochi: ["MG Road", "Marine Drive", "Kakkanad", "Fort Kochi", "COK Airport"],
    visakhapatnam: ["Beach Road", "RTC Complex", "Gajuwaka", "Madhurawada", "VTZ Airport"],
    goa: ["Panaji", "Calangute", "Margao", "Mapusa", "Airport"],
    jaipur: ["MI Road", "C-Scheme", "Malviya Nagar", "Amber", "JAI Airport"],
    ahmedabad: ["SG Highway", "Navrangpura", "Maninagar", "Gandhinagar Road", "AMD Airport"],
    chandigarh: ["Sector 17", "Elante", "Panchkula", "Mohali", "IXC Airport"]
  };
  return areas[citySlug] || [];
}

export function relatedServicesForCity(citySlug) {
  return SEO_SERVICES.filter((s) => {
    if (s.slug === "tour-packages") return true;
    return true;
  }).slice(0, 8);
}
