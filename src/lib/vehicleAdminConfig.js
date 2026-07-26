import { SITE_URL } from "./seo/constants";
import { buildEnterpriseSeoPayload, emptyEnterpriseSeoFields } from "./vehicleEnterpriseSeo";

export const PACKAGE_TYPES = [
  { value: "local_4hr", label: "Local 4Hr" },
  { value: "local_8hr", label: "Local 8Hr" },
  { value: "airport_pickup", label: "Airport Pickup" },
  { value: "airport_drop", label: "Airport Drop" },
  { value: "one_way", label: "One Way" },
  { value: "round_trip", label: "Round Trip" },
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate" },
  { value: "hourly", label: "Hourly" },
  { value: "custom", label: "Custom" }
];

export const VEHICLE_TABS = [
  { id: "basic", label: "Basic Info" },
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
    vendor: "",
    city: "",
    location: "",
    pickupLocations: [],
    status: "active",
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
    status: item.status === "inactive" ? "inactive" : "active",
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
    status: form.status === "inactive" ? "inactive" : "active",
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
