export const CAB_PACKAGE_FIELDS = [
  { key: "local4hr", defaultLabel: "Local — 4 Hrs / 40 Km" },
  { key: "local8hr", defaultLabel: "Local — 8 Hrs / 80 Km" },
  { key: "outstationOneWay", defaultLabel: "Outstation — One Way" },
  { key: "outstationRoundTrip", defaultLabel: "Outstation — Round Trip" }
];

export const DRIVER_PACKAGE_FIELDS = [
  { key: "local4hr", defaultLabel: "Local — 4 Hours" },
  { key: "localDay", defaultLabel: "Local — 1 Day" },
  { key: "outstation12hr", defaultLabel: "Outstation — 12 Hours" },
  { key: "outstationOneWay", defaultLabel: "Outstation — One Way" }
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
    title: "",
    vendor: "",
    type: "Sedan",
    seats: 4,
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
    farePackages: emptyPackages(CAB_PACKAGE_FIELDS),
    farePackageLabels: emptyLabels(CAB_PACKAGE_FIELDS)
  };
}

export function cabFormFromItem(item) {
  return {
    title: item?.title || "",
    vendor: item?.vendor || "",
    type: item?.type || "Sedan",
    seats: numField(item?.seats) || 4,
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
    farePackages: packagesFromItem(item?.farePackages, CAB_PACKAGE_FIELDS),
    farePackageLabels: labelsFromItem(item?.farePackageLabels, CAB_PACKAGE_FIELDS)
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
    vendor: form.vendor,
    type: form.type,
    seats: numField(form.seats) || 4,
    price: numField(form.price),
    hourlyRate: numField(form.hourlyRate),
    dayRate: numField(form.dayRate),
    extraHourRate: numField(form.extraHourRate),
    originalPrice: numField(form.originalPrice),
    discountPercentage: numField(form.discountPercentage),
    ...(rating != null && rating > 0 ? { rating } : {}),
    image: form.image || "",
    gallery: String(form.gallery || "")
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean)
      .slice(0, 3),
    city: form.city || "",
    location: form.location || "",
    features,
    farePackages,
    farePackageLabels,
    seoTitle: form.seoTitle || "",
    seoDescription: form.seoDescription || ""
  };
}

export function emptyDriverForm() {
  return {
    name: "",
    vendor: "",
    type: "local",
    experience: "0 Years",
    trips: 0,
    rating: "4.5",
    image: "",
    gallery: "",
    city: "",
    location: "",
    discountPercentage: 0,
    languages: "",
    supportedVehicles: "",
    pricingHourly: 0,
    pricingDay: 0,
    pricingExtraHour: 0,
    seoTitle: "",
    seoDescription: "",
    farePackages: emptyPackages(DRIVER_PACKAGE_FIELDS),
    farePackageLabels: emptyLabels(DRIVER_PACKAGE_FIELDS)
  };
}

export function driverFormFromItem(item) {
  return {
    name: item?.name || "",
    vendor: item?.vendor || "",
    type: item?.type || "local",
    experience: item?.experience || "0 Years",
    trips: numField(item?.trips),
    rating: item?.rating != null ? String(item.rating) : "0.0",
    image: item?.image || "",
    gallery: Array.isArray(item?.gallery) ? item.gallery.join(", ") : "",
    city: item?.city || "",
    location: item?.location || "",
    discountPercentage: numField(item?.discountPercentage),
    languages: Array.isArray(item?.languages) ? item.languages.join(", ") : "",
    supportedVehicles: Array.isArray(item?.supportedVehicles) ? item.supportedVehicles.join(", ") : "",
    pricingHourly: numField(item?.pricing?.hourly),
    pricingDay: numField(item?.pricing?.day),
    pricingExtraHour: numField(item?.pricing?.extraHour),
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
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
    vendor: form.vendor || "",
    type: form.type || "local",
    experience: form.experience || "0 Years",
    trips: numField(form.trips),
    rating: String(form.rating || "0.0"),
    image: form.image || "",
    gallery: String(form.gallery || "")
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean)
      .slice(0, 3),
    city: form.city || "",
    location: form.location || "",
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
    seoTitle: form.seoTitle || "",
    seoDescription: form.seoDescription || ""
  };
}

export function emptyTourPackageForm() {
  return {
    name: "",
    vendor: "",
    duration: "",
    price: 0,
    originalPrice: 0,
    discountPercentage: 0,
    hourlyRate: 0,
    dayRate: 0,
    extraHourRate: 0,
    image: "",
    gallery: "",
    city: "",
    location: "",
    tags: "",
    seoTitle: "",
    seoDescription: ""
  };
}

export function tourPackageFormFromItem(item) {
  return {
    name: item?.name || "",
    vendor: item?.vendor || "",
    duration: item?.duration || "",
    price: numField(item?.price),
    originalPrice: numField(item?.originalPrice),
    discountPercentage: numField(item?.discountPercentage),
    hourlyRate: numField(item?.hourlyRate),
    dayRate: numField(item?.dayRate),
    extraHourRate: numField(item?.extraHourRate),
    image: item?.image || "",
    gallery: Array.isArray(item?.gallery) ? item.gallery.join(", ") : "",
    city: item?.city || "",
    location: item?.location || "",
    tags: Array.isArray(item?.tags) ? item.tags.join(", ") : "",
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || ""
  };
}

export function tourPackageFormToPayload(form) {
  return {
    name: form.name,
    vendor: form.vendor,
    duration: form.duration,
    price: numField(form.price),
    originalPrice: numField(form.originalPrice),
    discountPercentage: numField(form.discountPercentage),
    hourlyRate: numField(form.hourlyRate),
    dayRate: numField(form.dayRate),
    extraHourRate: numField(form.extraHourRate),
    image: form.image || "",
    gallery: String(form.gallery || "")
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean)
      .slice(0, 3),
    city: form.city || "",
    location: form.location || "",
    tags: String(form.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    seoTitle: form.seoTitle || "",
    seoDescription: form.seoDescription || ""
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
      title: "City Comfort Sedan",
      vendor: "SwiftRide",
      type: "Sedan",
      seats: 4,
      price: 1400,
      hourlyRate: 320,
      dayRate: 2800,
      extraHourRate: 250,
      originalPrice: 1800,
      discountPercentage: 22,
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
        local4hr: { originalPrice: 1280, price: 998, discountPercentage: 22, extraKmRate: 14, extraHourRate: 250 },
        local8hr: { originalPrice: 2800, price: 2184, discountPercentage: 22, extraKmRate: 14, extraHourRate: 250 },
        outstationOneWay: { originalPrice: 1800, price: 1400, discountPercentage: 22, extraKmRate: 16, extraHourRate: 250 },
        outstationRoundTrip: { originalPrice: 5180, price: 4038, discountPercentage: 22, extraKmRate: 16, extraHourRate: 250 }
      },
      seoTitle: "",
      seoDescription: ""
    },
    required: ["title", "vendor", "type", "price"]
  },
  drivers: {
    label: "Drivers",
    base: "/api/drivers",
    form: "driver",
    superAdminOnly: false,
    sample: {
      name: "Driver Name",
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
        local4hr: "Local — 4 Hours",
        localDay: "Local — 1 Day",
        outstation12hr: "Outstation — 12 Hours",
        outstationOneWay: "Outstation — One Way"
      },
      farePackages: {
        local4hr: { originalPrice: 1000, price: 900, discountPercentage: 0, extraKmRate: 14, extraHourRate: 250 },
        localDay: { originalPrice: 3000, price: 2800, discountPercentage: 0, extraKmRate: 14, extraHourRate: 250 },
        outstation12hr: { originalPrice: 3600, price: 3400, discountPercentage: 0, extraKmRate: 16, extraHourRate: 250 },
        outstationOneWay: { originalPrice: 3000, price: 2800, discountPercentage: 0, extraKmRate: 16, extraHourRate: 250 }
      }
    },
    required: ["name"]
  },
  packages: {
    label: "Tour packages",
    base: "/api/packages",
    form: "tourPackage",
    superAdminOnly: false,
    sample: {
      name: "Weekend Getaway",
      vendor: "Your Vendor Name",
      duration: "2 Days",
      price: 5999,
      originalPrice: 6999,
      discountPercentage: 14,
      hourlyRate: 0,
      dayRate: 5999,
      extraHourRate: 300,
      image: "/uploads/package.jpg",
      gallery: ["/uploads/package.jpg"],
      city: "Bengaluru",
      location: "Indiranagar",
      tags: ["Family", "Outstation"]
    },
    required: ["name", "vendor", "duration", "price"]
  },
  bookings: {
    label: "Bookings",
    base: "/api/bookings",
    superAdminOnly: false,
    sample: { status: "confirmed" },
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
  }
};

export const CATALOG_TAB_KEYS = Object.keys(CATALOG_TABS);

export function buildCatalogListUrl(tabKey) {
  const tab = CATALOG_TABS[tabKey];
  if (!tab) return "";
  const params = new URLSearchParams({ limit: "100", page: "1" });
  if (tab.adminList) params.set("admin", "1");
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
    published: true
  };
}
