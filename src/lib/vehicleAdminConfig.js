import { SITE_URL } from "./seo/constants";
import { buildEnterpriseSeoPayload, emptyEnterpriseSeoFields } from "./vehicleEnterpriseSeo";

export const PACKAGE_TYPES = [
  { value: "local_4hr", label: "Local 4Hr / 40Km" },
  { value: "local_5hr", label: "Local 5Hr / 50Km" },
  { value: "local_8hr", label: "Local 8Hr / 80Km" },
  { value: "local_10hr", label: "Local 10Hr / 100Km" },
  { value: "local_15hr", label: "Local 15Hr / 150Km" },
  { value: "airport_pickup", label: "Airport Pickup" },
  { value: "airport_drop", label: "Airport Drop" },
  { value: "one_way", label: "Outstation One Way" },
  { value: "round_trip", label: "Outstation Round Trip" },
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate" },
  { value: "hourly", label: "Hourly" },
  { value: "custom", label: "Custom" }
];

export const VEHICLE_TABS = [
  { id: "basic", label: "Basic Info" },
  { id: "inventory", label: "Inventory" },
  { id: "specs", label: "Specifications" },
  { id: "pricing", label: "Pricing" },
  { id: "packages", label: "Packages" },
  { id: "pickup", label: "Pickup Locations" },
  { id: "features", label: "Features" },
  { id: "gallery", label: "Gallery" },
  { id: "seo", label: "SEO" },
  { id: "preview", label: "Preview" }
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price Low → High" },
  { value: "price_desc", label: "Price High → Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "bookings", label: "Most Booked" },
  { value: "alpha", label: "Alphabetical" }
];

export const FEATURE_PRESETS = [
  "AC",
  "GPS",
  "FastTag",
  "Bottle Water",
  "Music System",
  "USB Charger",
  "Phone Charger",
  "Sanitized",
  "WiFi",
  "Child Seat",
  "Wheelchair"
];

/** Vehicle / cab type presets — searchable in admin (still allow custom). */
export const VEHICLE_CATEGORY_OPTIONS = [
  "Sedan",
  "SUV",
  "MUV",
  "Hatchback",
  "Luxury",
  "Premium Sedan",
  "Innova",
  "Innova Crysta",
  "Ertiga",
  "Dzire",
  "Honda Amaze",
  "Tempo Traveller",
  "Mini Bus",
  "Bus",
  "Electric"
];

export const FUEL_TYPE_OPTIONS = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];

export const TRANSMISSION_OPTIONS = ["Manual", "Automatic"];

export const BRAND_OPTIONS = [
  "Maruti Suzuki",
  "Toyota",
  "Honda",
  "Hyundai",
  "Mahindra",
  "Tata",
  "Ford",
  "Kia",
  "MG",
  "Force"
];

export const DEFAULT_HQ_CITY = "Chennai";

export const VEHICLE_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "under_verification", label: "Under verification" },
  { value: "maintenance", label: "Maintenance" },
  { value: "suspended", label: "Suspended", adminOnly: true }
];

export const AVAILABILITY_STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "blocked", label: "Blocked" },
  { value: "offline", label: "Offline" },
  { value: "busy", label: "Busy", adminOnly: true }
];

export const VERIFICATION_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" }
];

export const VEHICLE_DOCUMENT_TYPES = [
  { value: "rc", label: "RC" },
  { value: "insurance", label: "Insurance" },
  { value: "permit", label: "Permit" },
  { value: "fitness", label: "Fitness" },
  { value: "other", label: "Other" }
];

export const DOCUMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" }
];

export function emptyVehicleDocument() {
  return { docType: "rc", url: "", status: "pending", expiresAt: "", label: "" };
}

export function normalizeCatalogStatus(value, fallback = "draft") {
  const s = String(value || "").toLowerCase();
  if (VEHICLE_STATUS_OPTIONS.some((o) => o.value === s)) return s;
  return fallback;
}

export function normalizeAvailabilityStatus(value, fallback = "available") {
  const s = String(value || "").toLowerCase();
  if (AVAILABILITY_STATUS_OPTIONS.some((o) => o.value === s)) return s;
  return fallback;
}

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function emptyPackage(index = 0) {
  return {
    packageType: "local_4hr",
    packageName: "",
    includedHours: 4,
    includedKm: 40,
    originalPrice: 0,
    price: 0,
    discountPercentage: 0,
    extraKmRate: 0,
    extraHourRate: 0,
    sortOrder: index,
    active: true
  };
}

export function emptyVehicleForm() {
  return {
    title: "",
    slug: "",
    productCode: "",
    vehicleName: "",
    brand: "",
    model: "",
    variant: "",
    year: "",
    category: "Sedan",
    type: "Sedan",
    vendor: "Cabzii",
    city: DEFAULT_HQ_CITY,
    location: "",
    pickupLocations: [],
    serviceAreas: [],
    status: "draft",
    availabilityStatus: "available",
    verificationStatus: "approved",
    registrationNumber: "",
    blockedDates: [],
    vehicleDocuments: [],
    featured: false,
    recommended: false,
    bestseller: false,
    seats: 4,
    bags: 2,
    doors: 4,
    fuelType: "Petrol",
    transmission: "Manual",
    mileage: "",
    engine: "",
    ac: true,
    airCondition: true,
    gps: false,
    fastTag: false,
    musicSystem: true,
    charger: false,
    bottledWater: false,
    childSeat: false,
    wheelchairAccessible: false,
    startingPrice: 0,
    originalPrice: 0,
    price: 0,
    discountPercentage: 0,
    pricePerKm: 0,
    pricePerHour: 0,
    currency: "INR",
    hourlyRate: 0,
    dayRate: 0,
    extraHourRate: 0,
    driverAllowance: 0,
    packages: [emptyPackage(0)],
    features: [],
    images: [],
    image: "",
    gallery: [],
    seoTitle: "",
    seoDescription: "",
    seo: "",
    metaKeywords: "",
    canonicalUrl: "",
    schemaEnabled: true,
    faq: [{ question: "", answer: "" }],
    breadcrumb: "",
    rating: "",
    reviewCount: 0,
    brandName: "",
    imageAlt: "",
    imageTitle: "",
    ...emptyEnterpriseSeoFields()
  };
}

export function vehicleFromApi(item) {
  if (!item) return emptyVehicleForm();
  const packages =
    Array.isArray(item.packages) && item.packages.length
      ? item.packages.map((p, i) => ({
          ...emptyPackage(i),
          ...p,
          sortOrder: num(p.sortOrder, i)
        }))
      : [emptyPackage(0)];

  const images =
    Array.isArray(item.images) && item.images.length
      ? item.images
      : [
          ...(item.image ? [{ url: item.image, type: "cover", alt: item.imageAlt || "", sortOrder: 0 }] : []),
          ...(Array.isArray(item.gallery)
            ? item.gallery.map((url, i) => ({ url, type: "gallery", alt: "", sortOrder: i + 1 }))
            : [])
        ];

  return {
    ...emptyVehicleForm(),
    title: item.title || "",
    slug: item.slug || "",
    productCode: item.productCode || "",
    vehicleName: item.vehicleName || item.vehicleModel || item.title || "",
    brand: item.brand || item.brandName || "",
    model: item.model || "",
    variant: item.variant || "",
    year: item.year ? String(item.year) : "",
    category: item.category || item.type || "Sedan",
    type: item.type || item.category || "Sedan",
    vendor: item.vendor || "",
    city: item.city || "",
    location: item.location || "",
    pickupLocations: Array.isArray(item.pickupLocations) ? item.pickupLocations : [],
    serviceAreas: Array.isArray(item.serviceAreas) ? item.serviceAreas : [],
    status: normalizeCatalogStatus(item.status, "active"),
    availabilityStatus: normalizeAvailabilityStatus(item.availabilityStatus, "available"),
    verificationStatus: ["pending", "approved", "rejected"].includes(String(item.verificationStatus || ""))
      ? item.verificationStatus
      : "approved",
    registrationNumber: item.registrationNumber || "",
    blockedDates: Array.isArray(item.blockedDates) ? item.blockedDates : [],
    vehicleDocuments: Array.isArray(item.vehicleDocuments)
      ? item.vehicleDocuments.map((d) => ({
          docType: d.docType || "other",
          url: d.url || "",
          status: d.status || "pending",
          expiresAt: d.expiresAt || "",
          label: d.label || ""
        }))
      : [],
    featured: Boolean(item.featured),
    recommended: Boolean(item.recommended),
    bestseller: Boolean(item.bestseller),
    seats: num(item.seats, 4),
    bags: num(item.bags, 2),
    doors: num(item.doors, 4),
    fuelType: item.fuelType || "Petrol",
    transmission: item.transmission || "Manual",
    mileage: item.mileage || "",
    engine: item.engine || "",
    ac: item.ac !== false,
    airCondition: item.airCondition !== false,
    gps: Boolean(item.gps),
    fastTag: Boolean(item.fastTag),
    musicSystem: item.musicSystem !== false,
    charger: Boolean(item.charger),
    bottledWater: Boolean(item.bottledWater),
    childSeat: Boolean(item.childSeat),
    wheelchairAccessible: Boolean(item.wheelchairAccessible),
    startingPrice: num(item.startingPrice),
    originalPrice: num(item.originalPrice),
    price: num(item.price),
    discountPercentage: num(item.discountPercentage),
    pricePerKm: num(item.pricePerKm),
    pricePerHour: num(item.pricePerHour),
    currency: item.currency || "INR",
    hourlyRate: num(item.hourlyRate),
    dayRate: num(item.dayRate),
    extraHourRate: num(item.extraHourRate),
    driverAllowance: num(item.driverAllowance),
    packages,
    features: Array.isArray(item.features) ? item.features : [],
    images,
    image: item.image || "",
    gallery: Array.isArray(item.gallery) ? item.gallery : [],
    seoTitle: item.seoTitle || "",
    seoDescription: item.seoDescription || "",
    seo: item.seo || "",
    metaKeywords: item.metaKeywords || "",
    canonicalUrl: item.canonicalUrl || "",
    schemaEnabled: item.schemaEnabled !== false,
    faq: Array.isArray(item.faq) && item.faq.length ? item.faq : [{ question: "", answer: "" }],
    breadcrumb: item.breadcrumb || "",
    rating: item.rating != null ? String(item.rating) : "",
    reviewCount: num(item.reviewCount || item.stats?.totalReviews),
    brandName: item.brandName || item.brand || "",
    imageAlt: item.imageAlt || "",
    imageTitle: item.imageTitle || "",
    ...emptyEnterpriseSeoFields(),
    ...(item.enterpriseSeo && typeof item.enterpriseSeo === "object" ? item.enterpriseSeo : {}),
    h2: Array.isArray(item.enterpriseSeo?.h2) && item.enterpriseSeo.h2.length ? item.enterpriseSeo.h2 : item.h2 || [""],
    h3: Array.isArray(item.enterpriseSeo?.h3) && item.enterpriseSeo.h3.length ? item.enterpriseSeo.h3 : item.h3 || [""],
    _stats: item.stats || {},
    _id: item._id || item.id || ""
  };
}

export function vehicleToPayload(form) {
  const rating = form.rating !== "" && form.rating != null ? num(form.rating) : undefined;
  const packages = (form.packages || []).map((p, i) => ({
    packageType: p.packageType || "custom",
    packageName: String(p.packageName || "").trim(),
    includedHours: num(p.includedHours),
    includedKm: num(p.includedKm),
    originalPrice: num(p.originalPrice),
    price: num(p.price),
    discountPercentage: Math.min(100, num(p.discountPercentage)),
    extraKmRate: num(p.extraKmRate),
    extraHourRate: num(p.extraHourRate),
    sortOrder: num(p.sortOrder, i),
    active: p.active !== false
  }));

  const images = (form.images || [])
    .filter((img) => img?.url)
    .map((img, i) => ({
      url: String(img.url).trim(),
      type: img.type || "gallery",
      alt: String(img.alt || "").trim(),
      title: String(img.title || "").trim(),
      caption: String(img.caption || "").trim(),
      sortOrder: num(img.sortOrder, i)
    }));

  const cover = images.find((img) => img.type === "cover") || images[0];
  const enterpriseSeo = buildEnterpriseSeoPayload(form);

  return {
    title: form.title,
    vehicleName: form.vehicleName || form.title,
    vehicleModel: form.vehicleName || form.model || form.title,
    brand: form.brand,
    brandName: form.brandName || form.brand,
    model: form.model,
    variant: form.variant,
    year: form.year ? num(form.year) : undefined,
    category: form.category || form.type,
    type: form.type || form.category,
    vendor: form.vendor,
    city: form.city,
    location: form.location || "",
    pickupLocations: form.pickupLocations || [],
    serviceAreas: form.serviceAreas || [],
    status: normalizeCatalogStatus(form.status, "draft"),
    availabilityStatus: normalizeAvailabilityStatus(form.availabilityStatus, "available"),
    verificationStatus: form.verificationStatus || "approved",
    registrationNumber: String(form.registrationNumber || "").trim(),
    blockedDates: Array.isArray(form.blockedDates)
      ? form.blockedDates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(String(d)))
      : [],
    vehicleDocuments: (form.vehicleDocuments || [])
      .filter((d) => d && String(d.url || "").trim())
      .map((d) => ({
        docType: d.docType || "other",
        url: String(d.url).trim(),
        status: d.status || "pending",
        expiresAt: String(d.expiresAt || "").trim(),
        label: String(d.label || "").trim()
      })),
    featured: Boolean(form.featured),
    recommended: Boolean(form.recommended),
    bestseller: Boolean(form.bestseller),
    seats: num(form.seats) || 4,
    bags: num(form.bags),
    doors: num(form.doors) || 4,
    fuelType: form.fuelType,
    transmission: form.transmission,
    mileage: form.mileage,
    engine: form.engine,
    ac: form.ac !== false,
    airCondition: form.airCondition !== false,
    gps: Boolean(form.gps),
    fastTag: Boolean(form.fastTag),
    musicSystem: form.musicSystem !== false,
    charger: Boolean(form.charger),
    bottledWater: Boolean(form.bottledWater),
    childSeat: Boolean(form.childSeat),
    wheelchairAccessible: Boolean(form.wheelchairAccessible),
    startingPrice: num(form.startingPrice),
    originalPrice: num(form.originalPrice),
    price: num(form.price),
    discountPercentage: Math.min(100, num(form.discountPercentage)),
    pricePerKm: num(form.pricePerKm),
    pricePerHour: num(form.pricePerHour),
    currency: form.currency || "INR",
    hourlyRate: num(form.hourlyRate),
    dayRate: num(form.dayRate),
    extraHourRate: num(form.extraHourRate),
    driverAllowance: num(form.driverAllowance),
    packages,
    features: form.features || [],
    images,
    image: cover?.url || form.image || "",
    gallery: images.map((img) => img.url),
    seoTitle: form.seoTitle || "",
    seoDescription: form.seoDescription || "",
    seo: form.seo || "",
    metaKeywords: form.metaKeywords || "",
    canonicalUrl: form.canonicalUrl || "",
    schemaEnabled: form.schemaEnabled !== false,
    faq: (form.faq || []).filter((f) => f.question?.trim() || f.answer?.trim()),
    breadcrumb: form.breadcrumb || "",
    slug: form.slug || "",
    productCode: form.productCode || "",
    imageAlt: form.imageAlt || "",
    imageTitle: form.imageTitle || "",
    enterpriseSeo,
    reviewCount: num(form.reviewCount),
    ...(rating != null && rating > 0 ? { rating } : {})
  };
}

export function buildVehicleListUrl(params = {}) {
  const qs = new URLSearchParams({ admin: "1", limit: "50" });
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== "" && v !== false) qs.set(k, String(v));
  });
  return `/api/cabs?${qs.toString()}`;
}

export function buildSeoPreview(form) {
  const city = form.city || "Chennai";
  const name = form.vehicleName || form.title || "Cab";
  const perKm = num(form.pricePerKm);
  const title =
    form.seoTitle ||
    `${name} Taxi Rental in ${city} | ${perKm > 0 ? `₹${perKm} Per KM` : `From ₹${num(form.startingPrice || form.price).toLocaleString("en-IN")}`} | Cabzii`;
  const description =
    form.seoDescription ||
    `Book ${name} Taxi Rental in ${city} starting from ₹${(perKm || num(form.startingPrice || form.price)).toLocaleString("en-IN")}${perKm ? " per km" : ""}. Local packages, airport transfers and outstation cab booking with verified drivers on Cabzii.`;
  const slug = form.slug || name.toLowerCase().replace(/\s+/g, "-");
  const url = form.canonicalUrl || `${SITE_URL}/cabs/${slug}`;
  return { title, description, url };
}
