import {
  actingDriverLandingPath,
  airportTaxiPublicPath,
  cityCabLandingPath
} from "../cityCabPaths";

export const CMS_SERVICE_MODULES = {
  cab: {
    key: "cab",
    title: "Cab Services",
    kicker: "CMS",
    intro: "One taxi-service page per city.",
    serviceFlag: "cabBooking",
    addLabel: "Add taxi service page",
    backLabel: "← Back to Cab Services",
    types: [
      {
        id: "local-cab",
        label: "Cab Booking",
        kind: "city",
        pageType: "cab-booking",
        uniqueSeo: true,
        cityNamed: true
      },
      {
        id: "hourly-4hr",
        label: "Hourly Rental — 4 Hours / 40 KM",
        kind: "city",
        pageType: "cab-booking",
        uniqueSeo: false,
        booksOn: "local-cab"
      },
      {
        id: "hourly-8hr",
        label: "Hourly Rental — 8 Hours / 80 KM",
        kind: "city",
        pageType: "cab-booking",
        uniqueSeo: false,
        booksOn: "local-cab"
      },
      {
        id: "round-trip-cab",
        label: "Round-Trip Cab",
        kind: "city",
        pageType: "cab-booking",
        uniqueSeo: false,
        booksOn: "local-cab"
      }
    ]
  },
  service: {
    key: "service",
    title: "Services",
    kicker: "CMS",
    intro: "Ranking service pages by city — outstation, one-way and tempo traveller. Each row is one live URL.",
    serviceFlag: "cabBooking",
    addLabel: "Add service page",
    backLabel: "← Back to Services",
    types: [
      {
        id: "outstation-cab",
        label: "Outstation Cab",
        kind: "service",
        serviceSlug: "outstation-cab",
        uniqueSeo: true
      },
      {
        id: "one-way-cab",
        label: "One-Way Cab",
        kind: "service",
        serviceSlug: "one-way-cab",
        uniqueSeo: true
      },
      {
        id: "tempo-traveller",
        label: "Tempo Traveller",
        kind: "service",
        serviceSlug: "tempo-traveller",
        uniqueSeo: true
      }
    ]
  },
  airport: {
    key: "airport",
    title: "Airport Taxi",
    kicker: "CMS",
    intro: "Pickup, drop and transfer pages reuse the Cities collection. Airport details and SEO are edited here.",
    serviceFlag: "airportTaxi",
    addLabel: "Add airport taxi page",
    backLabel: "← Back to Airport Taxi",
    types: [
      {
        id: "airport-hub",
        label: "Airport Transfer",
        kind: "airport",
        pageType: "airport-cab-booking",
        uniqueSeo: true
      },
      {
        id: "airport-pickup",
        label: "Airport Pickup",
        kind: "airport",
        pageType: "airport-cab-booking",
        uniqueSeo: false,
        booksOn: "airport-hub"
      },
      {
        id: "airport-drop",
        label: "Airport Drop",
        kind: "airport",
        pageType: "airport-cab-booking",
        uniqueSeo: false,
        booksOn: "airport-hub"
      },
      {
        id: "city-to-airport",
        label: "City to Airport",
        kind: "airport",
        pageType: "airport-cab-booking",
        uniqueSeo: false,
        booksOn: "airport-hub"
      },
      {
        id: "airport-to-city",
        label: "Airport to City",
        kind: "airport",
        pageType: "airport-cab-booking",
        uniqueSeo: false,
        booksOn: "airport-hub"
      }
    ]
  },
  actingDriver: {
    key: "actingDriver",
    title: "Acting Driver Services",
    kicker: "CMS",
    intro: "Public acting-driver pages by city. Driver profiles stay under Operations.",
    serviceFlag: "actingDriver",
    addLabel: "Add acting driver page",
    backLabel: "← Back to Acting Driver Services",
    types: [
      {
        id: "acting-local",
        label: "Call Driver",
        kind: "acting-driver",
        pageType: "acting-driver",
        uniqueSeo: true
      },
      {
        id: "acting-outstation",
        label: "Outstation Acting Driver",
        kind: "acting-driver",
        pageType: "acting-driver",
        uniqueSeo: false,
        booksOn: "acting-local"
      },
      {
        id: "acting-airport",
        label: "Airport Pickup / Drop Driver",
        kind: "acting-driver",
        pageType: "acting-driver",
        uniqueSeo: false,
        booksOn: "acting-local"
      }
    ]
  }
};

export function cmsPagePath(type, citySlug) {
  if (type.kind === "service") return `/services/${type.serviceSlug}/${citySlug}`;
  if (type.kind === "airport") return airportTaxiPublicPath(citySlug);
  if (type.kind === "acting-driver") return actingDriverLandingPath(citySlug);
  return cityCabLandingPath(citySlug);
}

export function seoStatusOf({ seoTitle, seoDescription, seoKeywords }) {
  const hasTitle = Boolean(String(seoTitle || "").trim());
  const hasDesc = Boolean(String(seoDescription || "").trim());
  const hasKw = Boolean(String(seoKeywords || "").trim());
  if (hasTitle && hasDesc && hasKw) return "complete";
  if (hasTitle || hasDesc || hasKw) return "partial";
  return "auto";
}

export function suggestCmsCopy(type, city) {
  const name = city?.name || city?.slug || "this city";
  const lower = String(name).toLowerCase();
  if (type.kind === "acting-driver") {
    return {
      productName: `Call Driver in ${name}`,
      seoTitle: `Call Driver in ${name} | Acting Driver | Cabzii`.slice(0, 60),
      seoDescription: `Hire a ${name} call driver / acting driver for your own car. City, outstation and airport chauffeur. Fares show before you pay on Cabzii.`,
      seoKeywords: `call driver ${lower}, acting driver ${lower}, chauffeur ${lower}, cabzii`
    };
  }
  if (type.kind === "airport") {
    return {
      productName: `${name} airport taxi`,
      seoTitle: `Airport Taxi ${name} | Pickup & Drop | Cabzii`.slice(0, 60),
      seoDescription: `Book ${name} airport taxi pickup and drop with AC cabs, flight buffer time and instant confirmation on cabzii.in. Fares show before you pay.`,
      seoKeywords: `airport taxi ${lower}, ${lower} airport cab, airport pickup ${lower}, cabzii`
    };
  }
  if (type.kind === "service") {
    const label = type.label;
    return {
      productName: `${label} in ${name}`,
      seoTitle: `${label} ${name} | Book Online | Cabzii`.slice(0, 60),
      seoDescription: `Book ${label.toLowerCase()} in ${name} with AC cabs and transparent fares on cabzii.in. Pay 50% to confirm. Tolls extra.`,
      seoKeywords: `${label.toLowerCase()} ${lower}, cab booking ${lower}, cabzii`
    };
  }
  return {
    productName: `${name} Cab Booking`,
    seoTitle: `Cab Booking in ${name} | Call Taxi Online | Cabzii`.slice(0, 60),
    seoDescription: `Book ${name} call taxi and cab booking on Cabzii. City, airport and outstation cabs. Sedan, SUV and Innova. Pay 50% to confirm. Tolls extra.`,
    seoKeywords: `cab booking ${lower}, ${lower} call taxi, ${lower} taxi, taxi service ${lower}, cabzii`
  };
}

function snippetFromPageSeo(pageSeo, path) {
  const stored = pageSeo?.[path];
  return stored && typeof stored === "object" ? stored : {};
}

export function seoTypesOf(module) {
  return (module?.types || []).filter((type) => type.uniqueSeo !== false);
}

export function buildCmsServiceRows({ moduleKey, cities = [], cityPages = [], seoServices = [], pageSeo = {} }) {
  const module = CMS_SERVICE_MODULES[moduleKey];
  if (!module) return [];
  const types = seoTypesOf(module);
  const extrasByParent = {};
  for (const type of module.types) {
    if (type.uniqueSeo === false && type.booksOn) {
      extrasByParent[type.booksOn] = extrasByParent[type.booksOn] || [];
      extrasByParent[type.booksOn].push(type.label);
    }
  }

  return cities.flatMap((city) =>
    types.map((type) => {
      const seoType = type;
      const path = cmsPagePath(seoType, city.slug);
      const stored = snippetFromPageSeo(pageSeo, path);
      const cityCms =
        seoType.kind === "service"
          ? null
          : cityPages.find(
              (page) =>
                page.pageType === seoType.pageType && String(page.citySlug || "").toLowerCase() === city.slug
            );
      const serviceCms =
        seoType.kind === "service"
          ? seoServices.find((row) => row.slug === seoType.serviceSlug && !String(row._id || "").startsWith("static:"))
          : null;

      const seoTitle = stored.seoTitle || cityCms?.seoTitle || serviceCms?.seoTitle || "";
      const seoDescription = stored.seoDescription || cityCms?.seoDescription || serviceCms?.seoDescription || "";
      const seoKeywords = stored.seoKeywords || cityCms?.seo || serviceCms?.seo || "";
      const typeLabel = type.cityNamed ? `${city.name} Cab Booking` : type.label;
      const productName = stored.productName || stored.h1 || cityCms?.h1 || serviceCms?.name || typeLabel;
      const savedOverride = Boolean(stored.seoTitle || stored.seoDescription || stored.h1 || cityCms || (serviceCms && stored.seoTitle));
      const cmsRecord = cityCms || serviceCms;
      const editId = cmsRecord && !String(cmsRecord._id || "").startsWith("static:") ? String(cmsRecord._id) : "";
      const apiType = seoType.kind === "airport" ? "city" : seoType.kind === "city" ? "city" : seoType.kind;

      return {
        id: `${moduleKey}:${city.slug}:${type.id}`,
        moduleKey,
        typeId: type.id,
        typeLabel,
        uniqueSeo: true,
        sharedNote: extrasByParent[type.id]?.length
          ? type.cityNamed
            ? ""
            : `Also books on this URL: ${extrasByParent[type.id].join(", ")}`
          : "",
        citySlug: city.slug,
        cityName: city.name,
        cityActive: city.isActive !== false,
        cityState: city.state || "",
        airportDetails: city.airportDetails || "",
        path,
        kind: seoType.kind,
        pageType: seoType.pageType || "",
        serviceSlug: seoType.serviceSlug || "",
        type: apiType,
        productName,
        h1: stored.h1 || cityCms?.h1 || productName,
        seoTitle,
        seoDescription,
        seoKeywords,
        intro: stored.intro || cityCms?.lead || "",
        html: stored.html || cityCms?.body || serviceCms?.body || "",
        faqs: Array.isArray(stored.faqs) && stored.faqs.length ? stored.faqs : cityCms?.faqs || [],
        source: savedOverride || cmsRecord ? "cms" : "auto",
        editId,
        canDelete: Boolean(type.uniqueSeo && (editId || stored.seoTitle || stored.seoDescription)),
        seoStatus: savedOverride || cmsRecord ? seoStatusOf({ seoTitle, seoDescription, seoKeywords }) : "auto",
        published: cityCms ? cityCms.published !== false : serviceCms ? serviceCms.published !== false : false
      };
    })
  );
}
