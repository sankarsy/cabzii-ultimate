import { normalizeGalleryPaths, normalizeStoredImagePath } from "./media";
import { parseStops, stopsToLines } from "./busBooking";
import { cancellationToText, parseCancellationText, parseRestStopsText, restStopsToText } from "./busExperience";
import { SEO_ROUTES } from "./seo/routes";
import { SEO_SERVICES } from "./seo/services";
import { isPackageDoorwayService, isRankingService } from "./seo/packageDoorways";
import { routePublicPath } from "./seo/outstationPaths";
import { isSeoScopeRoute } from "../config/seo-scope";

export const CAB_PACKAGE_FIELDS = [
  { key: "local4hr", defaultLabel: "Local — 4 Hrs / 40 Km" },
  { key: "local8hr", defaultLabel: "Local — 8 Hrs / 80 Km" },
  { key: "outstationOneWay", defaultLabel: "Outstation — One Way" },
  { key: "outstationRoundTrip", defaultLabel: "Outstation — Round Trip" }
];

/** Same keys as cabs so driver packages match cab structure in admin & booking UI */
export const DRIVER_PACKAGE_FIELDS = [
  { key: "local4hr", defaultLabel: "Local — 4 Hrs / 40 Km" },
  { key: "local8hr", defaultLabel: "Local — 8 Hrs / 80 Km" },
  { key: "outstationOneWay", defaultLabel: "Outstation — One Way" },
  { key: "outstationRoundTrip", defaultLabel: "Outstation — Round Trip" }
];

/** @deprecated use CAB_PACKAGE_FIELDS */
export const FARE_PACKAGE_FIELDS = CAB_PACKAGE_FIELDS;

function emptyPackageFare() {
  return {
    originalPrice: 0,
    price: 0,
    discountPercentage: 0,
    extraKmRate: 0,
    extraHourRate: 0
  };
}

function emptyLabels(fields) {
  const labels = {};
  for (const { key, defaultLabel } of fields) {
    labels[key] = defaultLabel;
  }
  return labels;
}

function emptyPackages(fields) {
  const farePackages = {};
  for (const { key } of fields) {
    farePackages[key] = emptyPackageFare();
  }
  return farePackages;
}

function numField(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function emptyProductFields() {
  return {
    slug: "",
    productCode: "",
    brandName: "",
    imageAlt: "",
    imageTitle: "",
    countryOfOrigin: "India",
    speciality: "",
    condition: "",
    taxPercent: 5
  };
}

function productFieldsFromItem(item) {
  return {
    slug: item?.slug || "",
    productCode: item?.productCode || "",
    brandName: item?.brandName || "",
    imageAlt: item?.imageAlt || "",
    imageTitle: item?.imageTitle || "",
    countryOfOrigin: item?.countryOfOrigin || "India",
    speciality: item?.speciality || "",
    condition: item?.condition || "",
    taxPercent: numField(item?.taxPercent) || 5
  };
}

function productFieldsToPayload(form) {
  return {
    slug: String(form.slug || "").trim(),
    productCode: String(form.productCode || "").trim(),
    brandName: String(form.brandName || "").trim(),
    imageAlt: String(form.imageAlt || "").trim(),
    imageTitle: String(form.imageTitle || "").trim(),
    countryOfOrigin: String(form.countryOfOrigin || "India").trim() || "India",
    speciality: String(form.speciality || "").trim(),
    condition: String(form.condition || "").trim(),
    taxPercent: numField(form.taxPercent) || 5
  };
}

function packageFromItem(pkg) {
  const base = emptyPackageFare();
  if (!pkg || typeof pkg !== "object") return base;
  return {
    originalPrice: numField(pkg.originalPrice),
    price: numField(pkg.price),
    discountPercentage: numField(pkg.discountPercentage),
    extraKmRate: numField(pkg.extraKmRate),
    extraHourRate: numField(pkg.extraHourRate)
  };
}

function labelsFromItem(itemLabels, fields) {
  const out = emptyLabels(fields);
  if (!itemLabels || typeof itemLabels !== "object") return out;
  for (const { key, defaultLabel } of fields) {
    const v = itemLabels[key];
    out[key] = typeof v === "string" && v.trim() ? v.trim() : defaultLabel;
  }
  return out;
}

function packagesFromItem(itemPackages, fields) {
  const out = emptyPackages(fields);
  if (!itemPackages || typeof itemPackages !== "object") return out;
  for (const { key } of fields) {
    out[key] = packageFromItem(itemPackages[key]);
  }
  return out;
}

export function emptyCabForm() {
  return {
    ...emptyProductFields(),
    title: "",
    vehicleModel: "",
    serviceForm: "One Way",
    vendor: "",
    type: "Sedan",
    seats: 4,
    bags: 2,
    examples: "",
    price: 0,
    hourlyRate: 0,
    dayRate: 0,
    extraHourRate: 0,
    originalPrice: 0,
    discountPercentage: 0,
    rating: "",
    image: "",
    gallery: "",
    city: "",
    location: "",
    features: "",
    status: "active",
    farePackages: emptyPackages(CAB_PACKAGE_FIELDS),
    farePackageLabels: emptyLabels(CAB_PACKAGE_FIELDS)
  };
}

export function cabFormFromItem(item) {
  return {
    ...productFieldsFromItem(item),
    title: item?.title || "",
    vehicleModel: item?.vehicleModel || "",
    serviceForm: item?.serviceForm || "One Way",
    vendor: item?.vendor || "",
    type: item?.type || "Sedan",
    seats: numField(item?.seats) || 4,
    bags: numField(item?.bags) || 2,
    examples: item?.examples || "",
    price: numField(item?.price),
    hourlyRate: numField(item?.hourlyRate),
    dayRate: numField(item?.dayRate),
    extraHourRate: numField(item?.extraHourRate),
    originalPrice: numField(item?.originalPrice),
    discountPercentage: numField(item?.discountPercentage),
    rating: item?.rating != null ? String(item.rating) : "",
    image: item?.image || "",
    gallery: Array.isArray(item?.gallery) ? item.gallery.join(", ") : "",
    city: item?.city || "",
    location: item?.location || "",
    features: Array.isArray(item?.features) ? item.features.join(", ") : "",
    status: item?.status === "inactive" ? "inactive" : "active",
    farePackages: packagesFromItem(item?.farePackages, CAB_PACKAGE_FIELDS),
    farePackageLabels: labelsFromItem(item?.farePackageLabels, CAB_PACKAGE_FIELDS),
    createdAt: item?.createdAt ? new Date(item.createdAt).toLocaleString("en-IN") : "",
    updatedAt: item?.updatedAt ? new Date(item.updatedAt).toLocaleString("en-IN") : ""
  };
}

export function cabFormToPayload(form) {
  const features = String(form.features || "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  const farePackages = {};
  const farePackageLabels = {};
  for (const { key, defaultLabel } of CAB_PACKAGE_FIELDS) {
    const pkg = form.farePackages?.[key] || {};
    farePackages[key] = {
      originalPrice: numField(pkg.originalPrice),
      price: numField(pkg.price),
      discountPercentage: numField(pkg.discountPercentage),
      extraKmRate: numField(pkg.extraKmRate),
      extraHourRate: numField(pkg.extraHourRate)
    };
    const label = String(form.farePackageLabels?.[key] || "").trim();
    farePackageLabels[key] = label || defaultLabel;
  }

  const rating = form.rating !== "" && form.rating != null ? numField(form.rating) : undefined;

  return {
    title: form.title,
    vehicleModel: String(form.vehicleModel || "").trim(),
    serviceForm: String(form.serviceForm || "One Way").trim() || "One Way",
    vendor: form.vendor,
    type: form.type,
    seats: numField(form.seats) || 4,
    bags: numField(form.bags) || 2,
    examples: String(form.examples || "").trim(),
    price: numField(form.price),
    hourlyRate: numField(form.hourlyRate),
    dayRate: numField(form.dayRate),
    extraHourRate: numField(form.extraHourRate),
    originalPrice: numField(form.originalPrice),
    discountPercentage: numField(form.discountPercentage),
    ...(rating != null && rating > 0 ? { rating } : {}),
    image: normalizeStoredImagePath(form.image) || "",
    gallery: normalizeGalleryPaths(form.gallery).slice(0, 3),
    city: form.city || "",
    location: form.location || "",
    features,
    farePackages,
    farePackageLabels,
    status: form.status === "inactive" ? "inactive" : "active",
    ...productFieldsToPayload(form)
  };
}

export function emptyDriverForm() {
  return {
    ...emptyProductFields(),
    name: "",
    phone: "",
    vendor: "",
    type: "local",
    experience: "0 Years",
    trips: 0,
    rating: "4.5",
    image: "",
    gallery: "",
    city: "",
    location: "",
    serviceAreas: "",
    licenseNumber: "",
    licenseExpiry: "",
    availabilityStatus: "available",
    discountPercentage: 0,
    languages: "",
    supportedVehicles: "",
    pricingHourly: 0,
    pricingDay: 0,
    pricingExtraHour: 0,
    status: "active",
    farePackages: emptyPackages(DRIVER_PACKAGE_FIELDS),
    farePackageLabels: emptyLabels(DRIVER_PACKAGE_FIELDS)
  };
}

export function driverFormFromItem(item) {
  return {
    ...productFieldsFromItem(item),
    name: item?.name || "",
    phone: item?.phone || "",
    vendor: item?.vendor || "",
    type: item?.type || "local",
    experience: item?.experience || "0 Years",
    trips: numField(item?.trips),
    rating: item?.rating != null ? String(item.rating) : "0.0",
    image: item?.image || "",
    gallery: Array.isArray(item?.gallery) ? item.gallery.join(", ") : "",
    city: item?.city || "",
    location: item?.location || "",
    serviceAreas: Array.isArray(item?.serviceAreas) ? item.serviceAreas.join(", ") : "",
    licenseNumber: item?.licenseNumber || "",
    licenseExpiry: item?.licenseExpiry || "",
    availabilityStatus: item?.availabilityStatus || (item?.status === "inactive" ? "inactive" : "available"),
    discountPercentage: numField(item?.discountPercentage),
    languages: Array.isArray(item?.languages) ? item.languages.join(", ") : "",
    supportedVehicles: Array.isArray(item?.supportedVehicles) ? item.supportedVehicles.join(", ") : "",
    pricingHourly: numField(item?.pricing?.hourly),
    pricingDay: numField(item?.pricing?.day),
    pricingExtraHour: numField(item?.pricing?.extraHour),
    status: item?.status === "inactive" ? "inactive" : "active",
    farePackages: packagesFromItem(item?.farePackages, DRIVER_PACKAGE_FIELDS),
    farePackageLabels: labelsFromItem(item?.farePackageLabels, DRIVER_PACKAGE_FIELDS)
  };
}

export function driverFormToPayload(form) {
  const farePackages = {};
  const farePackageLabels = {};
  for (const { key, defaultLabel } of DRIVER_PACKAGE_FIELDS) {
    const pkg = form.farePackages?.[key] || {};
    farePackages[key] = {
      originalPrice: numField(pkg.originalPrice),
      price: numField(pkg.price),
      discountPercentage: numField(pkg.discountPercentage),
      extraKmRate: numField(pkg.extraKmRate),
      extraHourRate: numField(pkg.extraHourRate)
    };
    const label = String(form.farePackageLabels?.[key] || "").trim();
    farePackageLabels[key] = label || defaultLabel;
  }

  return {
    name: form.name,
    phone: String(form.phone || "").trim(),
    vendor: form.vendor || "",
    type: form.type || "local",
    experience: form.experience || "0 Years",
    trips: numField(form.trips),
    rating: String(form.rating || "0.0"),
    image: normalizeStoredImagePath(form.image) || "",
    gallery: normalizeGalleryPaths(form.gallery).slice(0, 3),
    city: form.city || "",
    location: form.location || "",
    serviceAreas: String(form.serviceAreas || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    licenseNumber: String(form.licenseNumber || "").trim(),
    licenseExpiry: String(form.licenseExpiry || "").trim(),
    availabilityStatus: form.availabilityStatus || "available",
    discountPercentage: numField(form.discountPercentage),
    languages: String(form.languages || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    supportedVehicles: String(form.supportedVehicles || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    pricing: {
      hourly: numField(form.pricingHourly),
      day: numField(form.pricingDay),
      extraHour: numField(form.pricingExtraHour)
    },
    farePackages,
    farePackageLabels,
    status: form.status === "inactive" ? "inactive" : "active",
    ...productFieldsToPayload(form)
  };
}

export function emptyBusTripForm() {
  return {
    operator: "",
    operatorCode: "",
    operatorLogo: "",
    vendor: "Cabzii Partner",
    fromCity: "Chennai",
    toCity: "",
    departureTime: "06:00",
    arrivalTime: "14:00",
    duration: "8h",
    durationMin: 480,
    busType: "AC Seater",
    seaterPrice: 599,
    sleeperPrice: 899,
    lowerBerthPrice: 999,
    upperBerthPrice: 799,
    boardingPointsText: "",
    droppingPointsText: "",
    bookedSeats: "",
    amenities: "Water bottle, Charging point, Blanket, Pillow",
    rating: 4.2,
    reviewCount: 100,
    exclusiveDiscount: 0,
    tripGuaranteePrice: 24,
    distanceKm: 0,
    onTimePercent: 86,
    liveTrackingEnabled: true,
    liveLat: "",
    liveLng: "",
    cancellationPolicyText: "8 | 85\n4 | 50\n0 | 5",
    restStopsText: "",
    routeStopsText: "",
    policyLuggage: "",
    policyPets: "Pets are not allowed.",
    policyLiquor: "",
    policyPickup: "",
    status: "active",
    slug: ""
  };
}

export function busTripFormFromItem(item) {
  return {
    operator: item?.operator?.name || item?.operator || "",
    operatorCode: item?.operator?.code || item?.operatorCode || "",
    operatorLogo: item?.operator?.logo || item?.operatorLogo || "",
    vendor: item?.vendor || "Cabzii Partner",
    fromCity: item?.fromCity || "",
    toCity: item?.toCity || "",
    departureTime: item?.departureTime || item?.departure?.time || "06:00",
    arrivalTime: item?.arrivalTime || item?.arrival?.time || "14:00",
    duration: item?.duration || "8h",
    durationMin: numField(item?.durationMin) || 480,
    busType: item?.busType || "AC Seater",
    seaterPrice: numField(item?.seaterPrice ?? item?.fares?.seater),
    sleeperPrice: numField(item?.sleeperPrice ?? item?.fares?.sleeper),
    lowerBerthPrice: numField(item?.lowerBerthPrice ?? item?.fares?.lowerBerth),
    upperBerthPrice: numField(item?.upperBerthPrice ?? item?.fares?.upperBerth),
    boardingPointsText: stopsToLines(item?.boardingPoints),
    droppingPointsText: stopsToLines(item?.droppingPoints),
    bookedSeats: Array.isArray(item?.bookedSeats) ? item.bookedSeats.join(", ") : "",
    amenities: Array.isArray(item?.amenities) ? item.amenities.join(", ") : item?.amenities || "",
    rating: numField(item?.rating) || 4.2,
    reviewCount: numField(item?.reviewCount) || 100,
    exclusiveDiscount: numField(item?.exclusiveDiscount) || 0,
    tripGuaranteePrice: numField(item?.tripGuaranteePrice) || 24,
    distanceKm: numField(item?.distanceKm) || 0,
    onTimePercent: numField(item?.onTimePercent) || 86,
    liveTrackingEnabled: item?.liveTracking?.enabled !== false,
    liveLat: item?.liveTracking?.lat ?? "",
    liveLng: item?.liveTracking?.lng ?? "",
    cancellationPolicyText: cancellationToText(item?.cancellationPolicy) || "8 | 85\n4 | 50\n0 | 5",
    restStopsText: restStopsToText(item?.restStops),
    routeStopsText: Array.isArray(item?.routeStops) ? item.routeStops.join(" → ") : item?.routeStops || "",
    policyLuggage: item?.policies?.luggage || "",
    policyPets: item?.policies?.pets || "",
    policyLiquor: item?.policies?.liquor || "",
    policyPickup: item?.policies?.pickupTime || "",
    status: item?.status || "active",
    slug: item?.slug || ""
  };
}

export function busTripFormToPayload(form) {
  return {
    operator: form.operator?.trim(),
    operatorCode: form.operatorCode?.trim(),
    operatorLogo: form.operatorLogo?.trim(),
    vendor: form.vendor?.trim() || "Cabzii Partner",
    fromCity: form.fromCity?.trim(),
    toCity: form.toCity?.trim(),
    departureTime: form.departureTime?.trim(),
    arrivalTime: form.arrivalTime?.trim(),
    duration: form.duration?.trim(),
    durationMin: Number(form.durationMin) || 480,
    busType: form.busType?.trim(),
    seaterPrice: Number(form.seaterPrice) || 0,
    sleeperPrice: Number(form.sleeperPrice) || 0,
    lowerBerthPrice: Number(form.lowerBerthPrice) || 0,
    upperBerthPrice: Number(form.upperBerthPrice) || 0,
    boardingPoints: parseStops(form.boardingPointsText),
    droppingPoints: parseStops(form.droppingPointsText),
    bookedSeats: String(form.bookedSeats || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    amenities: String(form.amenities || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    rating: Number(form.rating) || 4.2,
    reviewCount: Number(form.reviewCount) || 100,
    exclusiveDiscount: Number(form.exclusiveDiscount) || 0,
    tripGuaranteePrice: Number(form.tripGuaranteePrice) || 24,
    distanceKm: Number(form.distanceKm) || 0,
    onTimePercent: Number(form.onTimePercent) || 86,
    liveTracking: {
      enabled: form.liveTrackingEnabled !== false,
      lat: form.liveLat === "" || form.liveLat == null ? null : Number(form.liveLat),
      lng: form.liveLng === "" || form.liveLng == null ? null : Number(form.liveLng),
      status: "on_time"
    },
    cancellationPolicy: parseCancellationText(form.cancellationPolicyText),
    restStops: parseRestStopsText(form.restStopsText),
    routeStops: String(form.routeStopsText || "")
      .split(/→|,/)
      .map((s) => s.trim())
      .filter(Boolean),
    policies: {
      luggage: form.policyLuggage?.trim() || "",
      pets: form.policyPets?.trim() || "",
      liquor: form.policyLiquor?.trim() || "",
      pickupTime: form.policyPickup?.trim() || ""
    },
    status: form.status || "active",
    slug: form.slug?.trim() || ""
  };
}

export function formatCabPackageSummary(item) {
  const fp = item?.farePackages;
  if (!fp) return "No packages saved";
  const local = fp.local4hr?.price;
  const out = fp.outstationOneWay?.price;
  const parts = [];
  if (local > 0) parts.push(`Local from ₹${Number(local).toLocaleString("en-IN")}`);
  if (out > 0) parts.push(`Outstation from ₹${Number(out).toLocaleString("en-IN")}`);
  return parts.length ? parts.join(" · ") : "No packages saved";
}

export function formatDriverPackageSummary(item) {
  const fp = item?.farePackages;
  if (!fp) return item.experience || "No packages";
  const local = fp.local4hr?.price;
  const parts = [];
  if (local > 0) parts.push(`From ₹${Number(local).toLocaleString("en-IN")}`);
  return parts.length ? parts.join(" · ") : item.experience || "—";
}

export const CATALOG_TABS = {
  cabs: {
    label: "Cabs",
    base: "/api/cabs",
    form: "cab",
    superAdminOnly: false,
    sample: {
      title: "Maruti Dzire Taxi",
      vendor: "SwiftRide",
      type: "Sedan",
      seats: 4,
      price: 1400,
      hourlyRate: 320,
      dayRate: 2800,
      extraHourRate: 250,
      originalPrice: 1400,
      discountPercentage: 0,
      rating: 4.8,
      image: "/uploads/cab.jpg",
      gallery: ["/uploads/cab.jpg"],
      city: "Bengaluru",
      location: "Kempegowda Airport",
      features: ["AC", "GPS", "Music"],
      farePackageLabels: {
        local4hr: "Local — 4 Hrs / 40 Km",
        local8hr: "Local — 8 Hrs / 80 Km",
        outstationOneWay: "Outstation — One Way",
        outstationRoundTrip: "Outstation — Round Trip"
      },
      farePackages: {
        local4hr: { originalPrice: 998, price: 998, discountPercentage: 0, extraKmRate: 14, extraHourRate: 250 },
        local8hr: { originalPrice: 2184, price: 2184, discountPercentage: 0, extraKmRate: 14, extraHourRate: 250 },
        outstationOneWay: { originalPrice: 1400, price: 1400, discountPercentage: 0, extraKmRate: 16, extraHourRate: 250 },
        outstationRoundTrip: { originalPrice: 4038, price: 4038, discountPercentage: 0, extraKmRate: 16, extraHourRate: 250 }
      },
      seoTitle: "",
      seoDescription: ""
    },
    required: ["title", "vendor", "type", "price"]
  },
  buses: {
    label: "Buses",
    base: "/api/buses",
    form: "busTrip",
    superAdminOnly: false,
    sample: {
      operator: "Orange Travels",
      operatorCode: "OT",
      vendor: "Cabzii Partner",
      fromCity: "Chennai",
      toCity: "Bengaluru",
      departureTime: "22:00",
      arrivalTime: "06:00",
      duration: "8h",
      durationMin: 480,
      busType: "Volvo AC Sleeper",
      seaterPrice: 699,
      sleeperPrice: 899,
      lowerBerthPrice: 999,
      upperBerthPrice: 799,
      boardingPoints: [
        { name: "Chennai CMBT", time: "21:30", landmark: "Koyambedu" },
        { name: "Chennai Central", time: "21:45", landmark: "Near station" }
      ],
      droppingPoints: [
        { name: "Bengaluru Majestic", time: "05:45", landmark: "Bus stand" },
        { name: "Silk Board", time: "06:15", landmark: "Outer ring" }
      ],
      amenities: ["Water bottle", "Blanket", "Charging point"],
      status: "active"
    },
    required: ["operator", "fromCity", "toCity", "seaterPrice"]
  },
  bookings: {
    label: "Bookings",
    base: "/api/bookings",
    form: "booking",
    superAdminOnly: false,
    sample: {
      status: "confirmed",
      vendorContact: {
        name: "Cabzii Premier · Maruti Dzire",
        phone: "9944197416",
        whatsapp: "9944197416"
      }
    },
    required: ["status"]
  },
  blogs: {
    label: "Blogs",
    base: "/api/blogs",
    adminList: true,
    superAdminOnly: true,
    form: "blog"
  },
  testimonials: {
    label: "Testimonials",
    base: "/api/testimonials",
    adminList: true,
    superAdminOnly: true,
    form: "testimonial"
  },
  seoServices: {
    label: "Service landing pages",
    base: "/api/seo-services",
    adminList: true,
    superAdminOnly: true,
    form: "seoService",
    sample: {
      seoTitle: "Airport Taxi Chennai: Book Online & Fares | cabzii.in",
      seoDescription: "Book Chennai airport taxi with AC cabs, fixed local & outstation fares and instant confirmation on cabzii.in.",
      seo: "airport taxi chennai,chennai airport cab booking,airport pickup taxi",
      slug: "airport-taxi",
      menuCitySlug: "chennai",
      priceFrom: 899,
      published: true,
      showInMenu: true
    },
    required: ["seoTitle"]
  },
  seoRoutes: {
    label: "Route landing pages",
    base: "/api/seo-routes",
    adminList: true,
    superAdminOnly: true,
    form: "seoRoute",
    sample: {
      seoTitle: "Chennai to Bengaluru Cab: Book One-Way & Round Trip | cabzii.in",
      seoDescription: "Book Chennai to Bengaluru cab online. Sedan, SUV & Innova with transparent fares on cabzii.in.",
      seo: "chennai to bengaluru cab,chennai bangalore taxi fare,one way cab chennai bengaluru",
      fromCitySlug: "chennai",
      toCitySlug: "bengaluru",
      distance: "350 km",
      duration: "6–7 hours",
      hatchbackFrom: 3999,
      sedanFrom: 4500,
      suvFrom: 6200,
      vanFrom: 8500,
      published: true
    },
    required: ["seoTitle", "fromCitySlug", "toCitySlug"]
  },
  seoCityPages: {
    label: "City landing pages",
    base: "/api/seo-city-pages",
    adminList: true,
    superAdminOnly: true,
    form: "seoCityPage",
    sample: {
      pageType: "cab-booking",
      citySlug: "chennai",
      seoTitle: "Cab Booking Chennai | Airport Taxi, Local & Outstation Cabs | Cabzii",
      seoDescription: "Book airport taxi, local taxi, outstation taxi and one-way cabs in Chennai. Instant confirmation and affordable fares on cabzii.in.",
      seo: "cab booking chennai,taxi chennai,outstation cab chennai",
      published: true
    },
    required: ["seoTitle", "pageType", "citySlug"]
  },
  seoLandings: {
    label: "Custom SEO pages",
    base: "/api/seo-landings",
    adminList: true,
    superAdminOnly: true,
    form: "seoLanding",
    sample: {
      slug: "outstation-acting-driver-chennai",
      h1: "Outstation acting driver from Chennai",
      seoTitle: "Outstation Acting Driver Chennai | Cabzii",
      seoDescription: "Hire an outstation acting driver from Chennai for your own car. Fuel and driver included; tolls extra.",
      seo: "outstation acting driver, acting driver in chennai, call driver chennai",
      published: true
    },
    required: ["h1", "seoTitle"]
  }
};

export const CATALOG_TAB_KEYS = Object.keys(CATALOG_TABS);

/** Built-in service pages (shown in admin until overridden by a saved CMS row with same slug). */
export function mergeStaticSeoServices(cmsItems = []) {
  const liveCms = (cmsItems || []).filter((row) => !isPackageDoorwayService(row.slug));
  const cmsSlugs = new Set(liveCms.map((row) => row.slug).filter(Boolean));
  const staticRows = SEO_SERVICES.filter((s) => isRankingService(s.slug) && s.slug && !cmsSlugs.has(s.slug)).map((s) => ({
    _id: `static:${s.slug}`,
    id: `static:${s.slug}`,
    slug: s.slug,
    name: s.name,
    seoTitle: s.name,
    primaryKeyword: s.primaryKeyword || s.name,
    priceFrom: s.priceFrom || 0,
    highlights: s.highlights || [],
    published: true,
    showInMenu: false,
    menuCitySlug: "chennai",
    allCities: true,
    isStatic: true,
    source: "static",
    publicPath: `/services/${s.slug}/chennai`
  }));
  return [...liveCms, ...staticRows];
}

/** Built-in route pages (shown in admin until overridden by a saved CMS row with same slug). */
export function mergeStaticSeoRoutes(cmsItems = []) {
  const liveCms = (cmsItems || []).filter((row) => {
    const from = row.fromCitySlug || row.from;
    const to = row.toCitySlug || row.to;
    if (from && to) return isSeoScopeRoute(from, to);
    return SEO_ROUTES.some((route) => route.slug === row.slug && isSeoScopeRoute(route.from, route.to));
  });
  const cmsSlugs = new Set(liveCms.map((row) => row.slug).filter(Boolean));
  const staticRows = SEO_ROUTES.filter((r) => r.slug && !cmsSlugs.has(r.slug) && isSeoScopeRoute(r.from, r.to)).map((r) => ({
    _id: `static:${r.slug}`,
    id: `static:${r.slug}`,
    slug: r.slug,
    title: `${r.from} to ${r.to} cab`.replace(/\b\w/g, (c) => c.toUpperCase()),
    seoTitle: `${r.from} to ${r.to} cab`.replace(/\b\w/g, (c) => c.toUpperCase()),
    fromCitySlug: r.from,
    toCitySlug: r.to,
    distance: r.distance || "",
    duration: r.duration || "",
    hatchbackFrom: r.hatchbackFrom || 0,
    sedanFrom: r.sedanFrom || 0,
    suvFrom: r.suvFrom || 0,
    vanFrom: r.vanFrom || 0,
    published: true,
    showInMenu: false,
    isStatic: true,
    source: "static",
    publicPath: routePublicPath(r.slug)
  }));
  return [...liveCms, ...staticRows];
}

function robotsFlags(robots) {
  const raw = String(robots || "index,follow").toLowerCase();
  return {
    robotsIndex: !raw.includes("noindex"),
    robotsFollow: !raw.includes("nofollow")
  };
}

function robotsString(form) {
  const index = form.robotsIndex !== false ? "index" : "noindex";
  const follow = form.robotsFollow !== false ? "follow" : "nofollow";
  return `${index},${follow}`;
}

export function emptySeoCityPageForm() {
  return {
    pageType: "cab-booking",
    citySlug: "",
    seoTitle: "",
    seoDescription: "",
    seo: "",
    h1: "",
    lead: "",
    aboutCity: "",
    body: "",
    faqsText: "",
    touristPlacesText: "",
    airportDetails: "",
    popularLocations: "",
    popularRoutes: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    schemaJson: "",
    robotsIndex: true,
    robotsFollow: true,
    published: true
  };
}

export function seoCityPageFormFromItem(item) {
  const meta = item?.seoMeta || {};
  return {
    pageType: item?.pageType || "cab-booking",
    citySlug: item?.citySlug || "",
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
    seo: item?.seo || "",
    h1: item?.h1 || "",
    lead: item?.lead || "",
    aboutCity: item?.aboutCity || "",
    body: item?.body || "",
    faqsText: Array.isArray(item?.faqs)
      ? item.faqs.map((row) => `${row.question || ""} | ${row.answer || ""}`.trim()).filter(Boolean).join("\n")
      : "",
    touristPlacesText: Array.isArray(item?.touristPlaces)
      ? item.touristPlaces.map((row) => `${row.title || ""} | ${row.body || ""}`.trim()).filter(Boolean).join("\n")
      : "",
    airportDetails: item?.airportDetails || "",
    popularLocations: Array.isArray(item?.popularLocations) ? item.popularLocations.join(", ") : "",
    popularRoutes: Array.isArray(item?.popularRoutes) ? item.popularRoutes.join(", ") : "",
    canonicalUrl: meta.canonicalUrl || "",
    ogTitle: meta.ogTitle || "",
    ogDescription: meta.ogDescription || "",
    ogImage: meta.ogImage || item?.image || "",
    twitterTitle: meta.twitterTitle || "",
    twitterDescription: meta.twitterDescription || "",
    schemaJson: item?.schemaJson || meta.schemaJson || "",
    ...robotsFlags(meta.robots),
    published: item?.published !== false
  };
}

function parsePipeLines(text, keys) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf("|");
      const left = (idx === -1 ? line : line.slice(0, idx)).trim();
      const right = (idx === -1 ? "" : line.slice(idx + 1)).trim();
      return { [keys[0]]: left, [keys[1]]: right };
    })
    .filter((row) => row[keys[0]]);
}

export function seoCityPageFormToPayload(form) {
  return {
    pageType: form.pageType || "cab-booking",
    citySlug: String(form.citySlug || "").trim().toLowerCase(),
    seoTitle: String(form.seoTitle || "").trim(),
    seoDescription: String(form.seoDescription || "").trim(),
    seo: String(form.seo || "").trim(),
    h1: String(form.h1 || "").trim(),
    lead: String(form.lead || "").trim(),
    aboutCity: String(form.aboutCity || "").trim(),
    body: form.body || "",
    faqs: parsePipeLines(form.faqsText, ["question", "answer"]),
    touristPlaces: parsePipeLines(form.touristPlacesText, ["title", "body"]),
    airportDetails: String(form.airportDetails || "").trim(),
    popularLocations: String(form.popularLocations || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    popularRoutes: String(form.popularRoutes || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    schemaJson: String(form.schemaJson || "").trim(),
    seoMeta: {
      metaTitle: String(form.seoTitle || "").trim(),
      metaDescription: String(form.seoDescription || "").trim(),
      keywords: String(form.seo || "").trim(),
      canonicalUrl: String(form.canonicalUrl || "").trim(),
      robots: robotsString(form),
      schemaJson: String(form.schemaJson || "").trim(),
      ogTitle: String(form.ogTitle || "").trim(),
      ogDescription: String(form.ogDescription || "").trim(),
      ogImage: String(form.ogImage || "").trim(),
      twitterTitle: String(form.twitterTitle || "").trim(),
      twitterDescription: String(form.twitterDescription || "").trim()
    },
    published: form.published !== false
  };
}

export function buildCatalogListUrl(tabKey) {
  const tab = CATALOG_TABS[tabKey];
  if (!tab) return "";
  const params = new URLSearchParams({ limit: tabKey === "buses" ? "500" : "100", page: "1" });
  if (
    tab.adminList ||
    tabKey === "cabs" ||
    tabKey === "bookings" ||
    tabKey === "buses" ||
    tabKey === "seoServices" ||
    tabKey === "seoRoutes" ||
    tabKey === "seoCityPages" ||
    tabKey === "seoLandings"
  ) {
    params.set("admin", "1");
  }
  return `${tab.base}?${params.toString()}`;
}

export function emptyBlogForm() {
  return {
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    author: "Cabzii Editorial",
    date: "",
    seoTitle: "",
    seoDescription: "",
    published: true
  };
}

export function emptyTestimonialForm() {
  return {
    name: "",
    location: "",
    message: "",
    rating: 5,
    sortOrder: 0,
    published: false,
    sampleReview: false,
    serviceType: "",
    tripRoute: ""
  };
}

export function emptySeoServiceForm() {
  return {
    slug: "",
    name: "",
    primaryKeyword: "",
    searchQuery: "",
    priceFrom: 0,
    highlights: "",
    body: "",
    image: "",
    imageAlt: "",
    imageTitle: "",
    gallery: "",
    seo: "",
    seoTitle: "",
    seoDescription: "",
    published: true,
    showInMenu: false,
    menuLabel: "",
    menuSortOrder: 0,
    menuCitySlug: "chennai",
    allCities: true,
    citySlugs: ""
  };
}

export function seoServiceFormFromItem(item) {
  const seoTitle = item?.seoTitle || item?.name || "";
  return {
    slug: item?.slug || "",
    name: seoTitle,
    primaryKeyword: item?.primaryKeyword || "",
    searchQuery: item?.searchQuery || "",
    priceFrom: numField(item?.priceFrom),
    highlights: Array.isArray(item?.highlights) ? item.highlights.join(", ") : "",
    body: item?.body || "",
    image: item?.image || "",
    imageAlt: item?.imageAlt || "",
    imageTitle: item?.imageTitle || "",
    gallery: Array.isArray(item?.gallery) ? item.gallery.join(", ") : "",
    seo: item?.seo || "",
    seoTitle,
    seoDescription: item?.seoDescription || "",
    published: item?.published !== false,
    showInMenu: Boolean(item?.showInMenu),
    menuLabel: item?.menuLabel || "",
    menuSortOrder: numField(item?.menuSortOrder),
    menuCitySlug: item?.menuCitySlug || "chennai",
    allCities: item?.allCities !== false,
    citySlugs: Array.isArray(item?.citySlugs) ? item.citySlugs.join(", ") : ""
  };
}

export function seoServiceFormToPayload(form) {
  const seoTitle = String(form.seoTitle || form.name || "").trim();
  const seo = String(form.seo || "").trim();
  return {
    slug: form.slug || "",
    name: seoTitle,
    primaryKeyword: seo.split(",")[0]?.trim() || seoTitle,
    searchQuery: seoTitle,
    priceFrom: numField(form.priceFrom),
    highlights: form.highlights || "",
    body: form.body || "",
    image: form.image || "",
    imageAlt: form.imageAlt || "",
    imageTitle: form.imageTitle || "",
    gallery: String(form.gallery || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    seo,
    seoTitle,
    seoDescription: String(form.seoDescription || "").trim(),
    published: form.published !== false,
    showInMenu: Boolean(form.showInMenu),
    menuLabel: form.menuLabel || "",
    menuSortOrder: numField(form.menuSortOrder),
    menuCitySlug: form.menuCitySlug || "chennai",
    allCities: form.allCities !== false,
    citySlugs: form.citySlugs || ""
  };
}

export function emptySeoRouteForm() {
  return {
    slug: "",
    title: "",
    fromCitySlug: "",
    toCitySlug: "",
    distance: "",
    duration: "",
    hatchbackFrom: 0,
    sedanFrom: 0,
    suvFrom: 0,
    vanFrom: 0,
    highlights: "",
    body: "",
    seo: "",
    seoTitle: "",
    seoDescription: "",
    published: true,
    showInMenu: false,
    menuLabel: "",
    menuSortOrder: 0
  };
}

export function seoRouteFormFromItem(item) {
  const seoTitle = item?.seoTitle || item?.title || "";
  return {
    slug: item?.slug || "",
    title: seoTitle,
    fromCitySlug: item?.fromCitySlug || "",
    toCitySlug: item?.toCitySlug || "",
    distance: item?.distance || "",
    duration: item?.duration || "",
    hatchbackFrom: numField(item?.hatchbackFrom),
    sedanFrom: numField(item?.sedanFrom),
    suvFrom: numField(item?.suvFrom),
    vanFrom: numField(item?.vanFrom),
    highlights: Array.isArray(item?.highlights) ? item.highlights.join(", ") : "",
    body: item?.body || "",
    seo: item?.seo || "",
    seoTitle,
    seoDescription: item?.seoDescription || "",
    published: item?.published !== false,
    showInMenu: Boolean(item?.showInMenu),
    menuLabel: item?.menuLabel || "",
    menuSortOrder: numField(item?.menuSortOrder)
  };
}

export function seoRouteFormToPayload(form) {
  const seoTitle = String(form.seoTitle || form.title || "").trim();
  return {
    slug: form.slug || "",
    title: seoTitle,
    fromCitySlug: form.fromCitySlug,
    toCitySlug: form.toCitySlug,
    distance: form.distance || "",
    duration: form.duration || "",
    hatchbackFrom: numField(form.hatchbackFrom),
    sedanFrom: numField(form.sedanFrom),
    suvFrom: numField(form.suvFrom),
    vanFrom: numField(form.vanFrom),
    highlights: form.highlights || "",
    body: form.body || "",
    seo: String(form.seo || "").trim(),
    seoTitle,
    seoDescription: String(form.seoDescription || "").trim(),
    published: form.published !== false,
    showInMenu: Boolean(form.showInMenu),
    menuLabel: form.menuLabel || "",
    menuSortOrder: numField(form.menuSortOrder)
  };
}

export function emptyBookingForm() {
  return {
    customerName: "",
    phone: "",
    email: "",
    type: "cab",
    itemId: "",
    pickup: "",
    drop: "",
    date: "",
    pickupTime: "",
    amount: 0,
    paymentMethod: "cash",
    distanceKm: "",
    status: "pending",
    vendorContactName: "",
    vendorContactPhone: "",
    vendorContactWhatsapp: "",
    vendorContactEmail: "",
    vendorContactNotes: ""
  };
}

export function bookingFormFromItem(item) {
  const contact = item?.vendorContact || {};
  return {
    customerName: item?.customerName || "",
    phone: item?.phone || "",
    email: item?.email || "",
    type: item?.type || "cab",
    itemId: String(item?.itemId || ""),
    pickup: item?.pickup || "",
    drop: item?.drop || "",
    date: item?.date || "",
    pickupTime: item?.pickupTime || "",
    amount: numField(item?.amount),
    paymentMethod: item?.paymentMethod || "cash",
    distanceKm: item?.distanceKm != null ? String(item.distanceKm) : "",
    status: item?.status || "pending",
    vendorContactName: contact.name || "",
    vendorContactPhone: contact.phone || "",
    vendorContactWhatsapp: contact.whatsapp || contact.phone || "",
    vendorContactEmail: contact.email || "",
    vendorContactNotes: contact.notes || ""
  };
}

export function bookingFormToPayload(form) {
  return {
    customerName: form.customerName,
    phone: form.phone,
    email: form.email || "",
    type: form.type,
    itemId: form.itemId,
    pickup: form.pickup || "",
    drop: form.drop || "",
    date: form.date || "",
    pickupTime: form.pickupTime || "",
    amount: numField(form.amount),
    status: form.status || "pending",
    vendorContact: {
      name: form.vendorContactName || "",
      phone: form.vendorContactPhone || "",
      whatsapp: form.vendorContactWhatsapp || form.vendorContactPhone || "",
      email: form.vendorContactEmail || "",
      notes: form.vendorContactNotes || ""
    }
  };
}
