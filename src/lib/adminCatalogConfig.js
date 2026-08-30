import { normalizeGalleryPaths, normalizeStoredImagePath } from "./media";
import { DEFAULT_HOLIDAY_CAB_TYPES } from "./holidays";
import { parseStops, stopsToLines } from "./busBooking";
import { cancellationToText, parseCancellationText, parseRestStopsText, restStopsToText } from "./busExperience";
import { SEO_ROUTES } from "./seo/routes";
import { SEO_SERVICES } from "./seo/services";

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
    taxPercent: 5,
    seo: ""
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
    taxPercent: numField(item?.taxPercent) || 5,
    seo: item?.seo || ""
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
    taxPercent: numField(form.taxPercent) || 5,
    seo: form.seo || "",
    seoTitle: form.seoTitle || "",
    seoDescription: form.seoDescription || ""
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
    seoTitle: "",
    seoDescription: "",
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
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
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
    seoTitle: "",
    seoDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
    schemaEnabled: true,
    faq: [{ question: "", answer: "" }],
    enterpriseSeo: {},
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
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
    metaKeywords: item?.metaKeywords || item?.seo || "",
    canonicalUrl: item?.canonicalUrl || "",
    schemaEnabled: item?.schemaEnabled !== false,
    faq: Array.isArray(item?.faq) && item.faq.length ? item.faq : [{ question: "", answer: "" }],
    enterpriseSeo: item?.enterpriseSeo && typeof item.enterpriseSeo === "object" ? item.enterpriseSeo : {},
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
    metaKeywords: form.metaKeywords || form.seo || "",
    canonicalUrl: form.canonicalUrl || "",
    schemaEnabled: form.schemaEnabled !== false,
    faq: Array.isArray(form.faq)
      ? form.faq
          .filter((f) => f?.question?.trim() || f?.answer?.trim())
          .map((f) => ({ question: String(f.question || ""), answer: String(f.answer || "") }))
      : [],
    enterpriseSeo: form.enterpriseSeo && typeof form.enterpriseSeo === "object" ? form.enterpriseSeo : {},
    ...productFieldsToPayload(form)
  };
}

const DEFAULT_CAB_TYPES_JSON = JSON.stringify(DEFAULT_HOLIDAY_CAB_TYPES, null, 2);

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
    slug: "",
    enterpriseSeo: {},
    seoTitle: "",
    seoDescription: "",
    seo: ""
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
    slug: item?.slug || "",
    enterpriseSeo: item?.enterpriseSeo || {},
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
    seo: item?.seo || ""
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
    slug: form.slug?.trim() || "",
    enterpriseSeo: form.enterpriseSeo || {},
    seoTitle: form.seoTitle?.trim(),
    seoDescription: form.seoDescription?.trim(),
    seo: form.seo?.trim()
  };
}

export function emptyTourPackageForm() {
  return {
    ...emptyProductFields(),
    name: "",
    vendor: "",
    category: "pilgrimage",
    duration: "",
    price: 0,
    originalPrice: 0,
    discountPercentage: 0,
    image: "",
    gallery: "",
    city: "",
    pricingOriginCity: "Chennai",
    location: "",
    tags: "",
    cabTypes: DEFAULT_CAB_TYPES_JSON,
    seoTitle: "",
    seoDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
    schemaEnabled: true,
    faq: [{ question: "", answer: "" }],
    enterpriseSeo: {},
    status: "active",
    packageType: "tour-package",
    state: "",
    destination: "",
    nights: 0,
    days: 0,
    description: "",
    highlights: "",
    inclusions: "",
    exclusions: "",
    termsAndConditions: "",
    cancellationPolicy: "",
    itinerary: ""
  };
}

/** "1 | Arrival & temple visit | Pickup at 6am..." per line ⇄ [{day,title,details}] */
export function itineraryToLines(itinerary) {
  if (!Array.isArray(itinerary)) return "";
  return itinerary.map((d) => [d.day, d.title, d.details].filter((x) => x !== undefined).join(" | ")).join("\n");
}

export function linesToItinerary(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const [day, title, ...rest] = line.split("|").map((s) => s.trim());
      return {
        day: Number(day) || i + 1,
        title: title || "",
        details: rest.join(" | ")
      };
    });
}

function linesToList(text) {
  return String(text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function tourPackageFormFromItem(item) {
  const cabTypes =
    Array.isArray(item?.cabTypes) && item.cabTypes.length
      ? JSON.stringify(item.cabTypes, null, 2)
      : DEFAULT_CAB_TYPES_JSON;
  return {
    ...productFieldsFromItem(item),
    name: item?.name || "",
    vendor: item?.vendor || "",
    category: item?.category || "",
    duration: item?.duration || "",
    price: numField(item?.price),
    originalPrice: numField(item?.originalPrice),
    discountPercentage: numField(item?.discountPercentage),
    image: item?.image || "",
    gallery: Array.isArray(item?.gallery) ? item.gallery.join(", ") : "",
    city: item?.city || "",
    pricingOriginCity: item?.pricingOriginCity || "Chennai",
    location: item?.location || "",
    tags: Array.isArray(item?.tags) ? item.tags.join(", ") : "",
    cabTypes,
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
    metaKeywords: item?.metaKeywords || item?.seo || "",
    canonicalUrl: item?.canonicalUrl || "",
    schemaEnabled: item?.schemaEnabled !== false,
    faq: Array.isArray(item?.faq) && item.faq.length ? item.faq : Array.isArray(item?.faqs) && item.faqs.length ? item.faqs : [{ question: "", answer: "" }],
    enterpriseSeo: item?.enterpriseSeo && typeof item.enterpriseSeo === "object" ? item.enterpriseSeo : {},
    status: item?.status === "inactive" ? "inactive" : "active",
    packageType: item?.packageType || "tour-package",
    state: item?.state || "",
    destination: item?.destination || "",
    nights: numField(item?.nights),
    days: numField(item?.days),
    description: item?.description || "",
    highlights: Array.isArray(item?.highlights) ? item.highlights.join("\n") : "",
    inclusions: Array.isArray(item?.inclusions) ? item.inclusions.join("\n") : "",
    exclusions: Array.isArray(item?.exclusions) ? item.exclusions.join("\n") : "",
    termsAndConditions: item?.termsAndConditions || "",
    cancellationPolicy: item?.cancellationPolicy || "",
    itinerary: itineraryToLines(item?.itinerary)
  };
}

export function tourPackageFormToPayload(form) {
  const cabTypesRaw = form.cabTypes;
  let cabTypes = [];
  if (typeof cabTypesRaw === "string" && cabTypesRaw.trim()) {
    try {
      cabTypes = JSON.parse(cabTypesRaw);
    } catch {
      cabTypes = [];
    }
  } else if (Array.isArray(cabTypesRaw)) {
    cabTypes = cabTypesRaw;
  }
  return {
    name: form.name,
    vendor: form.vendor,
    category: form.category || "",
    duration: form.duration,
    cabTypes,
    price: numField(form.price),
    originalPrice: numField(form.originalPrice),
    discountPercentage: numField(form.discountPercentage),
    image: normalizeStoredImagePath(form.image) || "",
    gallery: normalizeGalleryPaths(form.gallery).slice(0, 3),
    city: form.city || "",
    pricingOriginCity: String(form.pricingOriginCity || "Chennai").trim() || "Chennai",
    location: form.location || "",
    tags: String(form.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    status: form.status === "inactive" ? "inactive" : "active",
    packageType: form.packageType || "tour-package",
    state: form.state || "",
    destination: form.destination || "",
    nights: numField(form.nights),
    days: numField(form.days),
    description: form.description || "",
    highlights: linesToList(form.highlights),
    inclusions: linesToList(form.inclusions),
    exclusions: linesToList(form.exclusions),
    termsAndConditions: form.termsAndConditions || "",
    cancellationPolicy: form.cancellationPolicy || "",
    itinerary: linesToItinerary(form.itinerary),
    metaKeywords: form.metaKeywords || form.seo || "",
    canonicalUrl: form.canonicalUrl || "",
    schemaEnabled: form.schemaEnabled !== false,
    faq: Array.isArray(form.faq)
      ? form.faq
          .filter((f) => f?.question?.trim() || f?.answer?.trim())
          .map((f) => ({ question: String(f.question || ""), answer: String(f.answer || "") }))
      : [],
    enterpriseSeo: form.enterpriseSeo && typeof form.enterpriseSeo === "object" ? form.enterpriseSeo : {},
    ...productFieldsToPayload(form)
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
  drivers: {
    label: "Driver catalog",
    base: "/api/drivers",
    form: "driver",
    superAdminOnly: true,
    sample: {
      name: "Maruti Dzire",
      vendor: "Your Vendor Name",
      type: "local",
      experience: "5 Years",
      trips: 120,
      rating: "4.9",
      image: "",
      gallery: [],
      city: "Bengaluru",
      location: "MG Road",
      discountPercentage: 0,
      languages: ["English", "Tamil"],
      supportedVehicles: ["Sedan", "SUV"],
      pricing: { hourly: 250, day: 3000, extraHour: 250 },
      farePackageLabels: {
        local4hr: "Local — 4 Hrs / 40 Km",
        local8hr: "Local — 8 Hrs / 80 Km",
        outstationRoundTrip: "Outstation — Round Trip",
        outstationOneWay: "Outstation — One Way"
      },
      farePackages: {
        local4hr: { originalPrice: 1000, price: 900, discountPercentage: 0, extraKmRate: 14, extraHourRate: 250 },
        local8hr: { originalPrice: 3000, price: 2800, discountPercentage: 0, extraKmRate: 14, extraHourRate: 250 },
        outstationRoundTrip: { originalPrice: 3600, price: 3400, discountPercentage: 0, extraKmRate: 16, extraHourRate: 250 },
        outstationOneWay: { originalPrice: 3000, price: 2800, discountPercentage: 0, extraKmRate: 16, extraHourRate: 250 }
      }
    },
    required: ["name"]
  },
  packages: {
    label: "Holiday packages",
    base: "/api/packages",
    form: "tourPackage",
    superAdminOnly: false,
    sample: {
      name: "Tirupati Balaji Darshan",
      vendor: "Your Vendor Name",
      duration: "2 Days / 1 Night",
      price: 6999,
      originalPrice: 0,
      discountPercentage: 0,
      image: "/uploads/package.jpg",
      gallery: ["/uploads/package.jpg"],
      city: "Tirupati",
      pricingOriginCity: "Chennai",
      location: "Tirumala",
      category: "pilgrimage",
      destination: "Tirupati · Tirumala",
      state: "Andhra Pradesh",
      days: 2,
      nights: 1,
      description:
        "Experience Tirupati Balaji Darshan with a curated pilgrimage package from Chennai. Travel in an AC cab with darshan planning support, hotel stay options and a verified tour partner on cabzii.in.\n\nToll, permit and driver bata are billed as per actuals.",
      highlights: [
        "Temple darshan planning support",
        "AC cab with experienced driver",
        "Flexible pickup from Chennai",
        "Verified pilgrimage tour partner"
      ],
      inclusions: [
        "AC cab with driver for the itinerary",
        "Pickup & drop as selected at booking",
        "Tour coordination support"
      ],
      exclusions: [
        "Toll, parking & state permits (as actuals)",
        "Temple entry / special darshan tickets",
        "Meals & hotel extras not listed"
      ],
      itinerary: [
        {
          day: 1,
          title: "Chennai to Tirupati · Local darshan",
          details: "Pickup from your location, drive to Tirupati, temple visit support and overnight stay as per package."
        },
        {
          day: 2,
          title: "Morning visit & return to Chennai",
          details: "Checkout after breakfast, remaining local visits if scheduled, and comfortable return to Chennai."
        }
      ],
      cabTypes: [
        { id: "sedan", label: "Sedan", seats: 4, multiplier: 1 },
        { id: "suv", label: "SUV", seats: 6, multiplier: 1.12 },
        { id: "innova", label: "Innova", seats: 7, multiplier: 1.18 },
        { id: "tempo", label: "Tempo Traveller", seats: 12, multiplier: 1.35 }
      ],
      tags: ["Pilgrimage", "Tirupati"],
      seoDescription:
        "Book Tirupati Balaji Darshan package from Chennai on cabzii.in — AC cab options, transparent fares & instant confirmation."
    },
    required: ["name", "vendor", "price"]
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
      seoTitle: "Airport Taxi Chennai: Book Online, Fares & 24×7 Pickup | cabzii.in",
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
      sedanFrom: 4500,
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
  }
};

export const CATALOG_TAB_KEYS = Object.keys(CATALOG_TABS);

/** Built-in service pages (shown in admin until overridden by a saved CMS row with same slug). */
export function mergeStaticSeoServices(cmsItems = []) {
  const cmsSlugs = new Set((cmsItems || []).map((row) => row.slug).filter(Boolean));
  const staticRows = SEO_SERVICES.filter((s) => s.slug && !cmsSlugs.has(s.slug)).map((s) => ({
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
  return [...(cmsItems || []), ...staticRows];
}

/** Built-in route pages (shown in admin until overridden by a saved CMS row with same slug). */
export function mergeStaticSeoRoutes(cmsItems = []) {
  const cmsSlugs = new Set((cmsItems || []).map((row) => row.slug).filter(Boolean));
  const staticRows = SEO_ROUTES.filter((r) => r.slug && !cmsSlugs.has(r.slug)).map((r) => ({
    _id: `static:${r.slug}`,
    id: `static:${r.slug}`,
    slug: r.slug,
    title: `${r.from} to ${r.to} cab`.replace(/\b\w/g, (c) => c.toUpperCase()),
    seoTitle: `${r.from} to ${r.to} cab`.replace(/\b\w/g, (c) => c.toUpperCase()),
    fromCitySlug: r.from,
    toCitySlug: r.to,
    distance: r.distance || "",
    duration: r.duration || "",
    sedanFrom: r.sedanFrom || 0,
    suvFrom: r.suvFrom || 0,
    published: true,
    showInMenu: false,
    isStatic: true,
    source: "static",
    publicPath: `/routes/${r.slug}`
  }));
  return [...(cmsItems || []), ...staticRows];
}

export function emptySeoCityPageForm() {
  return {
    pageType: "cab-booking",
    citySlug: "",
    seoTitle: "",
    seoDescription: "",
    seo: "",
    h1: "",
    body: "",
    airportDetails: "",
    popularLocations: "",
    popularRoutes: "",
    published: true
  };
}

export function seoCityPageFormFromItem(item) {
  return {
    pageType: item?.pageType || "cab-booking",
    citySlug: item?.citySlug || "",
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
    seo: item?.seo || "",
    h1: item?.h1 || "",
    body: item?.body || "",
    airportDetails: item?.airportDetails || "",
    popularLocations: Array.isArray(item?.popularLocations) ? item.popularLocations.join(", ") : "",
    popularRoutes: Array.isArray(item?.popularRoutes) ? item.popularRoutes.join(", ") : "",
    published: item?.published !== false
  };
}

export function seoCityPageFormToPayload(form) {
  return {
    pageType: form.pageType || "cab-booking",
    citySlug: String(form.citySlug || "").trim().toLowerCase(),
    seoTitle: String(form.seoTitle || "").trim(),
    seoDescription: String(form.seoDescription || "").trim(),
    seo: String(form.seo || "").trim(),
    h1: String(form.h1 || "").trim(),
    body: form.body || "",
    airportDetails: String(form.airportDetails || "").trim(),
    popularLocations: String(form.popularLocations || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    popularRoutes: String(form.popularRoutes || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
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
    tabKey === "drivers" ||
    tabKey === "packages" ||
    tabKey === "bookings" ||
    tabKey === "buses" ||
    tabKey === "seoServices" ||
    tabKey === "seoRoutes" ||
    tabKey === "seoCityPages"
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
    sedanFrom: 0,
    suvFrom: 0,
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
    sedanFrom: numField(item?.sedanFrom),
    suvFrom: numField(item?.suvFrom),
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
    sedanFrom: numField(form.sedanFrom),
    suvFrom: numField(form.suvFrom),
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
