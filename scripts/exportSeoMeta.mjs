/**
 * Export SEO meta review sheet (CSV) — same format as the SEO team's
 * product upload sheet: S.No | Page | URL | SEO Title | SEO Description.
 *
 * Run: npx tsx scripts/exportSeoMeta.mjs
 * Output: seo-meta-review.csv (project root)
 */
import { writeFileSync } from "node:fs";
import { SEO_CITIES } from "../src/lib/seo/cities.js";
import { SEO_ROUTES, routeBySlug } from "../src/lib/seo/routes.js";
import { SEO_SERVICES, servicePath } from "../src/lib/seo/services.js";
import {
  getCabBookingMeta,
  getRouteMeta,
  getServiceMeta
} from "../src/lib/seo/programmaticMeta.js";
import {
  tunedActingDriverTitle,
  tunedActingDriverDescription
} from "../src/lib/seo/metadataTuning.js";

const rows = [];
let sno = 0;

function add(pageType, url, title, description) {
  sno += 1;
  rows.push({ sno, pageType, url, title, description });
}

for (const city of SEO_CITIES) {
  const meta = getCabBookingMeta(city);
  add("Cab booking city", `/cab-booking/${city.slug}`, meta.title, meta.description);
}

for (const city of SEO_CITIES) {
  add(
    "Acting driver city",
    `/acting-driver/${city.slug}`,
    tunedActingDriverTitle(city),
    tunedActingDriverDescription(city)
  );
}

for (const service of SEO_SERVICES) {
  for (const city of SEO_CITIES) {
    const meta = getServiceMeta(service, city);
    add(`Service: ${service.name}`, servicePath(service, city), meta.title, meta.description);
  }
}

for (const r of SEO_ROUTES) {
  const route = routeBySlug(r.slug);
  if (!route) continue;
  const meta = getRouteMeta(route);
  add("One-way route", `/routes/${route.slug}`, meta.title, meta.description);
}

function csvCell(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const header = "S.No,Page Type,URL,SEO Title,Title Length,SEO Description,Description Length";
const body = rows
  .map((r) =>
    [r.sno, r.pageType, r.url, r.title, r.title.length, r.description, r.description.length]
      .map(csvCell)
      .join(",")
  )
  .join("\n");

// UTF-8 BOM so Excel renders ₹ and — correctly
writeFileSync("seo-meta-review.csv", `\uFEFF${header}\n${body}\n`, "utf8");
console.log(`Exported ${rows.length} pages to seo-meta-review.csv`);
