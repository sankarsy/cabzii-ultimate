export const FARE_PACKAGE_FIELDS = [
  { key: "local4hr", label: "Local — 4 Hrs / 40 Km" },
  { key: "local8hr", label: "Local — 8 Hrs / 80 Km" },
  { key: "outstationOneWay", label: "Outstation — One Way" },
  { key: "outstationRoundTrip", label: "Outstation — Round Trip" }
];

function emptyPackageFare() {
  return {
    originalPrice: 0,
    price: 0,
    discountPercentage: 0,
    extraKmRate: 0,
    extraHourRate: 0
  };
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
    image: "",
    features: "",
    seoTitle: "",
    seoDescription: "",
    farePackages: {
      local4hr: emptyPackageFare(),
      local8hr: emptyPackageFare(),
      outstationOneWay: emptyPackageFare(),
      outstationRoundTrip: emptyPackageFare()
    }
  };
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

export function cabFormFromItem(item) {
  const fp = item?.farePackages || {};
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
    image: item?.image || "",
    features: Array.isArray(item?.features) ? item.features.join(", ") : "",
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
    farePackages: {
      local4hr: packageFromItem(fp.local4hr),
      local8hr: packageFromItem(fp.local8hr),
      outstationOneWay: packageFromItem(fp.outstationOneWay),
      outstationRoundTrip: packageFromItem(fp.outstationRoundTrip)
    }
  };
}

export function cabFormToPayload(form) {
  const features = String(form.features || "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  const farePackages = {};
  for (const { key } of FARE_PACKAGE_FIELDS) {
    const pkg = form.farePackages?.[key] || {};
    farePackages[key] = {
      originalPrice: numField(pkg.originalPrice),
      price: numField(pkg.price),
      discountPercentage: numField(pkg.discountPercentage),
      extraKmRate: numField(pkg.extraKmRate),
      extraHourRate: numField(pkg.extraHourRate)
    };
  }

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
    image: form.image || "",
    features,
    farePackages,
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
      features: ["AC", "GPS", "Music"],
      farePackages: {
        local4hr: {
          originalPrice: 1280,
          price: 998,
          discountPercentage: 22,
          extraKmRate: 14,
          extraHourRate: 250
        },
        local8hr: {
          originalPrice: 2800,
          price: 2184,
          discountPercentage: 22,
          extraKmRate: 14,
          extraHourRate: 250
        },
        outstationOneWay: {
          originalPrice: 1800,
          price: 1400,
          discountPercentage: 22,
          extraKmRate: 16,
          extraHourRate: 250
        },
        outstationRoundTrip: {
          originalPrice: 5180,
          price: 4038,
          discountPercentage: 22,
          extraKmRate: 16,
          extraHourRate: 250
        }
      },
      seoTitle: "",
      seoDescription: ""
    },
    required: ["title", "vendor", "type", "price"]
  },
  drivers: {
    label: "Drivers",
    base: "/api/drivers",
    superAdminOnly: false,
    sample: {
      name: "Driver Name",
      vendor: "Your Vendor Name",
      experience: "5 Years",
      trips: 120,
      rating: "4.9",
      languages: ["English", "Tamil"],
      supportedVehicles: ["Sedan", "SUV"],
      pricing: { hourly: 250, day: 3000, extraHour: 250 }
    },
    required: ["name"]
  },
  packages: {
    label: "Packages",
    base: "/api/packages",
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