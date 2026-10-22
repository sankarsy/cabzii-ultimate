/**
 * STEP 0 SEO audit dump. Read-only: no writes, no deletes.
 * Usage (from cabzii-ultimate/): node --import ./scripts/register-js-ext.mjs scripts/seo-audit-before.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { listProgrammaticSeoPages } from "../src/lib/seo/seoPagesCatalog.js";
import { STATIC_PAGE_SEO_LIST } from "../src/lib/seo/pageSeoCatalog.js";
import { SEO_CITIES } from "../src/lib/seo/cities.js";
import { SEO_ROUTES } from "../src/lib/seo/routes.js";
import { SEO_SERVICES } from "../src/lib/seo/services.js";
import { previewCatalogSlug } from "../src/lib/catalogProduct.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.resolve(__dirname, "..");
const WORKSPACE_ROOT = path.resolve(FRONTEND_ROOT, "..");
const BACKEND_ENV = path.join(WORKSPACE_ROOT, "cabzii-ultimate-backend", ".env");
const OUT_DIR = path.join(FRONTEND_ROOT, "reports");
const OUT_CSV = path.join(OUT_DIR, "audit-before.csv");

const KEEP_CITIES = new Set(["chennai", "trichy", "coimbatore", "bengaluru", "vellore"]);
const KEEP_AIRPORT_CITIES = new Set(["chennai", "trichy", "coimbatore", "bengaluru", "vellore"]);
const KEEP_SERVICES = new Set(["outstation-cab", "one-way-cab", "tempo-traveller"]);
const KEEP_SITE = new Set([
  "/",
  "/cabs",
  "/call-driver",
  "/about",
  "/contact",
  "/tariff",
  "/cancellation-policy",
  "/terms-and-conditions",
  "/privacy",
  "/privacy-policy",
  "/holidays",
  "/tour-packages",
  "/blogs",
  "/blog",
  "/pilgrimage-packages"
]);

const KEEP_ROUTE_CORRIDORS = new Set([
  "chennai|tirupati",
  "bengaluru|tirupati",
  "coimbatore|tirupati",
  "vellore|tirupati",
  "trichy|tirupati",
  "kanchipuram|tirupati",
  "hyderabad|tirupati",
  "chennai|kanchipuram",
  "chennai|tiruvannamalai",
  "chennai|rameswaram",
  "chennai|madurai",
  "chennai|palani",
  "chennai|velankanni",
  "chennai|kumbakonam",
  "chennai|thanjavur",
  "chennai|chidambaram",
  "chennai|kanyakumari",
  "chennai|pondicherry",
  "chennai|vellore",
  "chennai|bengaluru",
  "chennai|coimbatore",
  "chennai|trichy",
  "coimbatore|palani",
  "coimbatore|madurai",
  "coimbatore|rameswaram",
  "coimbatore|ooty",
  "bengaluru|mysore",
  "bengaluru|madurai",
  "trichy|rameswaram",
  "trichy|madurai",
  "trichy|thanjavur",
  "trichy|velankanni",
  "bengaluru|chennai",
  "coimbatore|chennai",
  "trichy|chennai",
  "vellore|chennai",
  "vellore|bengaluru",
  "bengaluru|vellore"
]);

const OFF_THEME_RE = /\b(manali|goa|andaman|kerala|rajasthan|jaipur|udaipur|jaisalmer)\b/i;

function loadDotenv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] == null || process.env[key] === "") process.env[key] = val;
  }
}

function csvEscape(value) {
  const s = value == null ? "" : String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function seoStatus(row) {
  const hasTitle = Boolean(String(row.seoTitle || "").trim());
  const hasDesc = Boolean(String(row.seoDescription || "").trim());
  const hasKw = Boolean(String(row.seoKeywords || row.seo || "").trim());
  if (hasTitle && hasDesc && hasKw) return "complete";
  if (hasTitle || hasDesc || hasKw) return "partial";
  return "auto";
}

function normalizeCity(slug) {
  const s = String(slug || "").toLowerCase();
  if (s === "bangalore") return "bengaluru";
  if (["tiruchi", "tiruchirappalli", "tiruchirapalli"].includes(s)) return "trichy";
  return s;
}

function corridorFromPath(urlPath) {
  const p = String(urlPath || "").replace(/\/+$/, "") || "/";
  const out = p.match(/^\/([a-z0-9-]+)\/outstation\/([a-z0-9-]+)-to-([a-z0-9-]+)$/);
  if (out) return `${normalizeCity(out[2])}|${normalizeCity(out[3])}`;
  const legacy = p.match(/^\/routes\/([a-z0-9-]+)-to-([a-z0-9-]+)-cab$/);
  if (legacy) return `${normalizeCity(legacy[1])}|${normalizeCity(legacy[2])}`;
  return "";
}

function inAllowlist(row) {
  const p = String(row.path || "").replace(/\/+$/, "") || "/";
  if (row.type === "tour") return true;
  if (row.type === "blog") return true;
  if (KEEP_SITE.has(p)) return true;
  if (p.startsWith("/tour-packages/")) return true;
  if (p.startsWith("/holidays/") && p !== "/holidays") return true;
  if (p.startsWith("/blog/") || (p.startsWith("/blogs/") && p !== "/blogs")) return true;

  const cab = p.match(/^\/cab-booking\/([a-z0-9-]+)$/);
  if (cab) return KEEP_CITIES.has(normalizeCity(cab[1]));

  const act = p.match(/^\/acting-driver\/([a-z0-9-]+)$/);
  if (act) return KEEP_CITIES.has(normalizeCity(act[1]));

  const airport = p.match(/^\/([a-z0-9-]+)\/airport-cab-booking$/);
  if (airport) return KEEP_AIRPORT_CITIES.has(normalizeCity(airport[1]));

  const svc = p.match(/^\/services\/([a-z0-9-]+)\/([a-z0-9-]+)$/);
  if (svc) {
    const service = svc[1];
    const city = normalizeCity(svc[2]);
    if (service === "airport-taxi") return KEEP_AIRPORT_CITIES.has(city);
    if (KEEP_SERVICES.has(service)) return KEEP_CITIES.has(city);
    return false;
  }

  const corridor = corridorFromPath(p);
  if (corridor) return KEEP_ROUTE_CORRIDORS.has(corridor);

  return false;
}

function isOffThemePackage(pkg) {
  const hay = [pkg?.name, pkg?.city, pkg?.destination, pkg?.state, pkg?.slug, pkg?.location]
    .map((v) => String(v || ""))
    .join(" ");
  return OFF_THEME_RE.test(hay);
}

function databaseNameFromMongoUri(uri) {
  try {
    const name = decodeURIComponent(new URL(uri).pathname.replace(/^\//, "").split("/")[0] || "");
    return name.trim();
  } catch {
    return "";
  }
}

async function findAll(db, name) {
  if (!db.collection(name)) return [];
  return db.collection(name).find({}).toArray();
}

function rowFromProgrammatic(page, cmsMaps) {
  const { cityPageMap, serviceBySlug, routeBySlug, pageSeo } = cmsMaps;
  let cms = null;
  let seoTitle = "";
  let seoDescription = "";
  let seoKeywords = "";
  let productName = page.title;
  let published = true;

  if (page.type === "city" || page.type === "acting-driver") {
    cms = cityPageMap.get(page.cmsKey);
    if (cms) {
      seoTitle = cms.seoTitle || "";
      seoDescription = cms.seoDescription || "";
      seoKeywords = cms.seo || "";
      productName = cms.h1 || page.title;
      published = cms.published !== false;
    }
  } else if (page.type === "service") {
    const svc = serviceBySlug.get(page.serviceSlug);
    if (svc) {
      seoTitle = svc.seoTitle || "";
      seoDescription = svc.seoDescription || "";
      seoKeywords = svc.seo || "";
      productName = svc.name || svc.menuLabel || page.title;
      published = svc.published !== false;
    }
  } else if (page.type === "route") {
    const route = routeBySlug.get(page.routeSlug);
    if (route) {
      seoTitle = route.seoTitle || "";
      seoDescription = route.seoDescription || "";
      seoKeywords = route.seo || "";
      productName = route.title || page.title;
      published = route.published !== false;
    }
  }

  const stored = pageSeo[page.path] || {};
  seoTitle = stored.seoTitle || seoTitle || page.title;
  seoDescription = stored.seoDescription || seoDescription;
  seoKeywords = stored.seoKeywords || seoKeywords;
  productName = stored.productName || stored.h1 || productName;

  const statusBits = [seoStatus({ seoTitle, seoDescription, seo: seoKeywords })];
  if (!published) statusBits.push("unpublished");

  return {
    type: page.typeLabel || page.type,
    productName,
    path: page.path,
    seoTitle,
    seoDescription,
    seoKeywords,
    status: statusBits.join("|"),
    source: cms ? "cms" : "programmatic"
  };
}

async function main() {
  loadDotenv(BACKEND_ENV);
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing from backend .env");
  const dbName = databaseNameFromMongoUri(uri) || process.env.MONGODB_DB_NAME || "cabzii";

  await mongoose.connect(uri, {
    dbName,
    serverSelectionTimeoutMS: 20000
  });
  const db = mongoose.connection.db;

  const [
    packages,
    blogs,
    seoCityPages,
    seoRoutes,
    seoServices,
    seoLandings,
    cmsPages,
    siteSettingsDocs
  ] = await Promise.all([
    findAll(db, "packages"),
    findAll(db, "blogs"),
    findAll(db, "seocitypages"),
    findAll(db, "seoroutes"),
    findAll(db, "seoservices"),
    findAll(db, "seolandings"),
    findAll(db, "cmspages"),
    findAll(db, "sitesettings")
  ]);

  const pageSeo = siteSettingsDocs[0]?.pageSeo && typeof siteSettingsDocs[0].pageSeo === "object"
    ? siteSettingsDocs[0].pageSeo
    : {};

  const cityPageMap = new Map(
    seoCityPages.map((p) => [`${p.pageType}:${String(p.citySlug || "").toLowerCase()}`, p])
  );
  const serviceBySlug = new Map(seoServices.map((s) => [s.slug, s]));
  const routeBySlug = new Map(seoRoutes.map((r) => [r.slug, r]));
  const cmsMaps = { cityPageMap, serviceBySlug, routeBySlug, pageSeo };

  const rows = [];
  const seenPaths = new Set();

  function pushRow(row) {
    const p = String(row.path || "").replace(/\/+$/, "") || "/";
    row.path = p;
    const key = `${row.type}|${p}`;
    if (seenPaths.has(key)) return;
    seenPaths.add(key);
    rows.push(row);
  }

  for (const pkg of packages) {
    if (pkg.isDeleted) continue;
    const slug = pkg.slug || previewCatalogSlug(pkg, "name", "city") || String(pkg._id);
    const seoTitle = pkg.seoTitle || pkg.name || "";
    const seoDescription = pkg.seoDescription || "";
    const seoKeywords = pkg.seo || pkg.metaKeywords || "";
    const statusBits = [seoStatus({ seoTitle, seoDescription, seo: seoKeywords })];
    if (pkg.status && pkg.status !== "active") statusBits.push(pkg.status);
    if (isOffThemePackage(pkg)) statusBits.push("OFF_THEME");
    pushRow({
      type: "tour package",
      productName: pkg.name || "Tour package",
      path: `/tour-packages/${slug}`,
      seoTitle,
      seoDescription,
      seoKeywords,
      status: statusBits.join("|"),
      source: "db"
    });
  }

  for (const blog of blogs) {
    const slug = blog.slug || String(blog._id);
    const seoTitle = blog.seoTitle || blog.title || "";
    const seoDescription = blog.seoDescription || blog.excerpt || "";
    const seoKeywords = blog.seo || "";
    const statusBits = [seoStatus({ seoTitle, seoDescription, seo: seoKeywords })];
    if (blog.status && blog.status !== "published") statusBits.push(blog.status);
    if (blog.published === false) statusBits.push("unpublished");
    pushRow({
      type: "blog",
      productName: blog.title || "Blog post",
      path: `/blog/${slug}`,
      seoTitle,
      seoDescription,
      seoKeywords,
      status: statusBits.join("|"),
      source: "db"
    });
  }

  for (const page of listProgrammaticSeoPages()) {
    pushRow(rowFromProgrammatic(page, cmsMaps));
  }

  for (const sitePage of STATIC_PAGE_SEO_LIST) {
    const stored = pageSeo[sitePage.path] || {};
    const seoTitle = stored.seoTitle || sitePage.seoTitle;
    const seoDescription = stored.seoDescription || sitePage.seoDescription;
    const seoKeywords = stored.seoKeywords || sitePage.seoKeywords;
    const productName = stored.productName || sitePage.productName;
    pushRow({
      type: sitePage.typeLabel || "site",
      productName,
      path: sitePage.path,
      seoTitle,
      seoDescription,
      seoKeywords,
      status: seoStatus({ seoTitle, seoDescription, seo: seoKeywords }),
      source: stored.seoTitle || stored.seoDescription ? "cms" : "static"
    });
  }

  for (const landing of seoLandings) {
    const pathValue = landing.publicPath || `/pages/${landing.slug}`;
    const seoTitle = landing.seoTitle || "";
    const seoDescription = landing.seoDescription || "";
    const seoKeywords = landing.seo || "";
    const statusBits = [seoStatus({ seoTitle, seoDescription, seo: seoKeywords })];
    if (landing.published === false) statusBits.push("unpublished");
    pushRow({
      type: "custom landing",
      productName: landing.h1 || landing.seoTitle || landing.slug,
      path: pathValue,
      seoTitle,
      seoDescription,
      seoKeywords,
      status: statusBits.join("|"),
      source: "db"
    });
  }

  const cmsPathByType = {
    about: "/about",
    contact: "/contact",
    privacy: "/privacy",
    terms: "/terms-and-conditions",
    refund: "/cancellation-policy",
    cancellation: "/cancellation-policy",
    legal: "/legal-declaration"
  };
  for (const page of cmsPages) {
    const pathValue = cmsPathByType[page.pageType] || `/pages/${page.slug}`;
    const seoTitle = page.seoTitle || page.seo?.metaTitle || page.title || "";
    const seoDescription = page.seoDescription || page.seo?.metaDescription || page.excerpt || "";
    const seoKeywords = page.seo?.keywords || "";
    const statusBits = [seoStatus({ seoTitle, seoDescription, seo: seoKeywords })];
    if (page.published === false) statusBits.push("unpublished");
    pushRow({
      type: `cms:${page.pageType || "custom"}`,
      productName: page.title || page.slug,
      path: pathValue,
      seoTitle,
      seoDescription,
      seoKeywords,
      status: statusBits.join("|"),
      source: "db"
    });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const header = [
    "type",
    "product name",
    "URL",
    "title",
    "title_len",
    "description",
    "description_len",
    "keywords",
    "status",
    "in-allowlist"
  ];
  const lines = [header.join(",")];
  for (const row of rows) {
    const title = row.seoTitle || "";
    const desc = row.seoDescription || "";
    lines.push(
      [
        csvEscape(row.type),
        csvEscape(row.productName),
        csvEscape(row.path),
        csvEscape(title),
        String(title.length),
        csvEscape(desc),
        String(desc.length),
        csvEscape(row.seoKeywords || ""),
        csvEscape(row.status),
        inAllowlist({ type: row.type === "tour package" ? "tour" : row.type === "blog" ? "blog" : row.type, path: row.path })
          ? "Y"
          : "N"
      ].join(",")
    );
  }
  fs.writeFileSync(OUT_CSV, `${lines.join("\n")}\n`, "utf8");

  const y = rows.filter((r) =>
    inAllowlist({ type: r.type === "tour package" ? "tour" : r.type === "blog" ? "blog" : r.type, path: r.path })
  );
  const n = rows.filter((r) => !y.includes(r));
  const byType = {};
  for (const r of rows) {
    byType[r.type] = (byType[r.type] || 0) + 1;
  }
  const offTheme = rows.filter((r) => String(r.status).includes("OFF_THEME"));
  const counts = {
    programmaticPages: listProgrammaticSeoPages().length,
    seoCities: SEO_CITIES.length,
    seoRoutes: SEO_ROUTES.length,
    seoServices: SEO_SERVICES.length,
    db: {
      packages: packages.length,
      blogs: blogs.length,
      seoCityPages: seoCityPages.length,
      seoRoutes: seoRoutes.length,
      seoServices: seoServices.length,
      seoLandings: seoLandings.length,
      cmsPages: cmsPages.length,
      siteSettings: siteSettingsDocs.length
    },
    csvRows: rows.length,
    allowlistY: y.length,
    allowlistN: n.length,
    offThemePackages: offTheme.map((r) => ({ name: r.productName, url: r.path })),
    byType,
    outFile: OUT_CSV
  };
  fs.writeFileSync(path.join(OUT_DIR, "audit-before-summary.json"), JSON.stringify(counts, null, 2));
  console.log(JSON.stringify(counts, null, 2));

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
