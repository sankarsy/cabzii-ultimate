/** Sample + public merge for holiday package page content (description, itinerary, etc.). */

function hasText(value) {
  return Boolean(String(value || "").trim());
}

function hasList(value) {
  return Array.isArray(value) && value.some((x) => hasText(x));
}

function hasItinerary(value) {
  return Array.isArray(value) && value.some((d) => hasText(d?.title) || hasText(d?.details));
}

function categoryLabel(category = "") {
  const map = {
    pilgrimage: "pilgrimage",
    beach: "beach",
    hill: "hill station",
    heritage: "heritage",
    honeymoon: "honeymoon",
    adventure: "adventure",
    family: "family"
  };
  return map[category] || "holiday";
}

/** Category-aware sample content for empty packages. */
export function buildSampleTourPackageContent(pkg = {}) {
  const name = pkg.name || "Holiday package";
  const city = pkg.city || pkg.destination || "your destination";
  const origin = pkg.pricingOriginCity || "Chennai";
  const vendor = pkg.vendor || "Cabzii tour partner";
  const kind = categoryLabel(pkg.category);
  const days = Number(pkg.days) > 0 ? Number(pkg.days) : pkg.duration?.match(/(\d+)/)?.[1] ? Number(pkg.duration.match(/(\d+)/)[1]) : 2;
  const nights = Number(pkg.nights) > 0 ? Number(pkg.nights) : Math.max(0, days - 1);

  const description = [
    `Experience ${name} with ${vendor} — a curated ${kind} package covering the best of ${city}.`,
    `Travel comfortably from ${origin} in an AC cab with a verified driver. Hotel stays, sightseeing support and flexible pickup are arranged so you can focus on the journey.`,
    `Book online on cabzii.in for transparent package fares. Toll, permit and driver bata are billed as per actuals.`
  ].join("\n\n");

  const highlightsByCategory = {
    pilgrimage: [
      "Temple darshan planning support",
      "AC cab with experienced driver",
      "Flexible pickup from your city",
      "Verified pilgrimage tour partner"
    ],
    beach: [
      "Beachside sightseeing coverage",
      "AC cab for local & beach hops",
      "Flexible pickup & drop timing",
      "Verified beach holiday partner"
    ],
    hill: [
      "Scenic hill-station itinerary",
      "AC cab for mountain roads",
      "Hotel & viewpoint coordination",
      "Verified hill tour partner"
    ],
    family: [
      "Family-friendly itinerary",
      "Spacious cab options (Sedan to Tempo)",
      "Kid-friendly stop planning",
      "Verified family tour partner"
    ]
  };

  const highlights =
    highlightsByCategory[pkg.category] ||
    [
      `Curated ${kind} itinerary for ${city}`,
      "AC cab with verified driver",
      `Pickup from ${origin} or your location`,
      "Transparent package pricing on cabzii.in"
    ];

  const itinerary = [];
  for (let i = 1; i <= Math.min(Math.max(days, 1), 5); i += 1) {
    if (i === 1) {
      itinerary.push({
        day: 1,
        title: `Start from ${origin} · Arrive ${city}`,
        details: `Pickup from your location, drive to ${city}, hotel check-in (as per package) and evening leisure or local visit.`
      });
    } else if (i === days || (days === 1 && i === 1)) {
      itinerary.push({
        day: i,
        title: days === 1 ? `${city} sightseeing & return` : `Checkout & return to ${origin}`,
        details:
          days === 1
            ? `Full-day sightseeing in ${city} with cab support, then return drop as per package timing.`
            : `Breakfast (as applicable), checkout, remaining sightseeing if scheduled, and comfortable return journey to ${origin}.`
      });
    } else {
      itinerary.push({
        day: i,
        title: `${city} sightseeing`,
        details: `Day tour covering popular ${kind} attractions around ${city} with cab at disposal as per itinerary.`
      });
    }
  }
  if (days === 1 && itinerary.length === 1) {
    /* already handled */
  } else if (nights > 0 && itinerary.length === 1) {
    itinerary.push({
      day: 2,
      title: `Return to ${origin}`,
      details: `Checkout after breakfast and return journey with drop at your preferred location.`
    });
  }

  const inclusions = [
    "AC cab with driver for the itinerary",
    "Driver allowance (bata) as per package note — confirm before travel",
    "Pickup & drop as selected at booking",
    "Tour coordination support from partner"
  ];

  const exclusions = [
    "Toll, parking & state permits (as actuals)",
    "Temple / attraction entry tickets",
    "Meals & hotel extras not listed in package",
    "Personal expenses & tips"
  ];

  const seoDescription = `Book ${name} from ${origin} on cabzii.in — ${kind} package for ${city} with AC cab options, transparent fares & instant confirmation.`.slice(
    0,
    158
  );

  return {
    description,
    highlights,
    itinerary,
    inclusions,
    exclusions,
    days: Number(pkg.days) > 0 ? Number(pkg.days) : days,
    nights: Number(pkg.nights) > 0 ? Number(pkg.nights) : nights,
    seoDescription
  };
}

/** Fill empty public fields with sample content (admin values always win). */
export function withPublicTourPackageContent(pkg) {
  if (!pkg) return pkg;
  const sample = buildSampleTourPackageContent(pkg);

  return {
    ...pkg,
    description: hasText(pkg.description) ? pkg.description : sample.description,
    seoDescription: hasText(pkg.seoDescription) ? pkg.seoDescription : sample.seoDescription,
    highlights: hasList(pkg.highlights) ? pkg.highlights.filter((x) => hasText(x)) : sample.highlights,
    inclusions: hasList(pkg.inclusions) ? pkg.inclusions.filter((x) => hasText(x)) : sample.inclusions,
    exclusions: hasList(pkg.exclusions) ? pkg.exclusions.filter((x) => hasText(x)) : sample.exclusions,
    itinerary: hasItinerary(pkg.itinerary) ? pkg.itinerary : sample.itinerary,
    days: Number(pkg.days) > 0 ? Number(pkg.days) : sample.days,
    nights: Number(pkg.nights) > 0 ? Number(pkg.nights) : sample.nights
  };
}

/** Admin form helpers — arrays ⇄ newline strings already handled elsewhere; this fills empty form fields. */
export function applySampleToTourPackageForm(form = {}) {
  const sample = buildSampleTourPackageContent({
    name: form.name,
    city: form.city,
    destination: form.destination,
    pricingOriginCity: form.pricingOriginCity,
    vendor: form.vendor,
    category: form.category,
    days: form.days,
    nights: form.nights,
    duration: form.duration
  });

  const itineraryLines = sample.itinerary
    .map((d) => [d.day, d.title, d.details].filter((x) => x !== undefined && x !== "").join(" | "))
    .join("\n");

  return {
    ...form,
    description: hasText(form.description) ? form.description : sample.description,
    seoDescription: hasText(form.seoDescription) ? form.seoDescription : sample.seoDescription,
    highlights: hasText(form.highlights) ? form.highlights : sample.highlights.join("\n"),
    inclusions: hasText(form.inclusions) ? form.inclusions : sample.inclusions.join("\n"),
    exclusions: hasText(form.exclusions) ? form.exclusions : sample.exclusions.join("\n"),
    itinerary: hasText(form.itinerary) ? form.itinerary : itineraryLines,
    days: Number(form.days) > 0 ? form.days : sample.days,
    nights: Number(form.nights) > 0 ? form.nights : sample.nights
  };
}
