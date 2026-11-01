/**
 * After a GitHub push, tell Google which public Cabzii URLs changed.
 *
 * Uses the Indexing API (URL_UPDATED). Quota is small (~200/day) so this
 * only sends mapped + priority pages, never the full sitemap.
 *
 * GitHub secrets (repo → Settings → Secrets):
 *   GOOGLE_INDEXING_SA_JSON  — service account JSON (preferred)
 *   or GSC_CLIENT_EMAIL + GSC_PRIVATE_KEY
 *
 * The same service account must be an Owner on the Search Console property
 * and Indexing API must be enabled on the Google Cloud project.
 *
 * Run locally: node scripts/google-index-on-push.mjs
 */
import { execSync } from "node:child_process";
import crypto from "node:crypto";

const SITE = String(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.cabzii.in").replace(
  /\/$/,
  ""
);
const MAX_URLS = Number(process.env.GOOGLE_INDEX_MAX_URLS || 40);
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const INDEX_SCOPE = "https://www.googleapis.com/auth/indexing";
const PUBLISH_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish";

const HUB_CITIES = ["chennai", "madurai", "trichy", "coimbatore", "vellore", "tirupati"];

const PRIORITY_PATHS = [
  "/",
  "/cabs",
  "/call-driver",
  "/earn",
  "/contact",
  "/acting-driver",
  "/cab-booking/chennai",
  "/acting-driver/chennai",
  "/call-driver/chennai",
  "/chennai/airport-cab-booking"
];

const SKIP_PREFIXES = [
  "/admin",
  "/api",
  "/account",
  "/payment",
  "/booking",
  "/my-bookings",
  "/quote",
  "/login",
  "/signin",
  "/search",
  "/cabs/results",
  "/cabs/passenger",
  "/drivers/results",
  "/drivers/passenger",
  "/call-driver/book",
  "/buses/results",
  "/buses/seats",
  "/buses/passenger"
];

function b64url(value) {
  return Buffer.from(value).toString("base64url");
}

function loadServiceAccount() {
  const inline = String(process.env.GOOGLE_INDEXING_SA_JSON || process.env.GSC_SERVICE_ACCOUNT_JSON || "").trim();
  if (inline) {
    try {
      const json = JSON.parse(inline);
      if (json.client_email && json.private_key) return json;
    } catch {
      /* fall through */
    }
  }
  const email = String(process.env.GSC_CLIENT_EMAIL || "").trim();
  let key = String(process.env.GSC_PRIVATE_KEY || "").trim();
  if (key.includes("\\n")) key = key.replace(/\\n/g, "\n");
  if (email && key) return { client_email: email, private_key: key };
  return null;
}

function signJwt(email, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss: email,
      scope: INDEX_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600
    })
  );
  const unsigned = `${header}.${payload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  return `${unsigned}.${signer.sign(privateKey, "base64url")}`;
}

async function getAccessToken(sa) {
  const assertion = signJwt(sa.client_email, sa.private_key);
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new Error(json.error_description || json.error || "Google token request failed");
  }
  return json.access_token;
}

function changedFiles() {
  const explicit = String(process.env.GOOGLE_INDEX_FILES || "").trim();
  if (explicit) return explicit.split(/\r?\n/).map((s) => s.replace(/\\/g, "/").trim()).filter(Boolean);
  try {
    const before = String(process.env.GITHUB_EVENT_BEFORE || "").trim();
    const sha = String(process.env.GITHUB_SHA || "").trim();
    const range =
      before && sha && !/^0+$/.test(before) ? `${before} ${sha}` : "HEAD~1 HEAD";
    const out = execSync(`git diff --name-only --diff-filter=ACMR ${range}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });
    return out.split(/\r?\n/).map((s) => s.replace(/\\/g, "/").trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function isSafePath(path) {
  if (!path || path[0] !== "/") return false;
  if (path.includes("?") || path.includes("#") || path.includes("..")) return false;
  return !SKIP_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function cityPaths(build) {
  return HUB_CITIES.map(build).filter(isSafePath);
}

function routeFromAppPage(file) {
  const match = file.match(/^src\/app\/(.+)\/page\.(js|jsx|ts|tsx)$/);
  if (!match) return [];
  const rel = match[1];
  if (rel === "page" || rel === ".") return ["/"];
  if (rel === "[city]") return cityPaths((city) => `/cab-booking/${city}`);
  if (rel === "acting-driver/[city]" || rel === "[city]/acting-driver") {
    return ["/acting-driver", ...cityPaths((city) => `/acting-driver/${city}`)];
  }
  if (rel === "[city]/airport-cab-booking") return ["/chennai/airport-cab-booking"];
  if (rel === "[city]/outstation") return cityPaths((city) => `/${city}/outstation`);
  if (rel === "cab-booking/[city]") return cityPaths((city) => `/cab-booking/${city}`);
  if (rel === "call-driver/[city]") return cityPaths((city) => `/call-driver/${city}`);
  if (rel === "services/[service]/[city]") {
    return [
      "/services/airport-taxi/chennai",
      "/services/outstation-cab/chennai",
      "/services/one-way-cab/chennai"
    ];
  }
  if (rel.includes("[")) return [];
  const route = `/${rel}`;
  return isSafePath(route) ? [route] : [];
}

function pathsFromFile(file) {
  if (file.startsWith("src/app/") && /\/page\.(js|jsx|ts|tsx)$/.test(file)) {
    return routeFromAppPage(file);
  }
  if (file.includes("ActingDriverLandingPage") || file.includes("acting-driver")) {
    return ["/acting-driver", ...cityPaths((city) => `/acting-driver/${city}`)];
  }
  if (file.includes("CityCabLandingPage") || file.includes("cab-booking")) {
    return cityPaths((city) => `/cab-booking/${city}`);
  }
  if (file.includes("AirportCabLandingPage") || file.includes("airport-cab")) {
    return ["/chennai/airport-cab-booking"];
  }
  if (file.includes("CallDriver") || file.includes("call-driver")) {
    return ["/call-driver", "/call-driver/chennai", "/acting-driver/chennai"];
  }
  if (file.includes("earn/") || file.includes("/earn")) return ["/earn"];
  if (file.includes("MmtHomePage") || file.includes("HomeSeo") || file === "src/app/page.js") {
    return ["/"];
  }
  if (
    file.startsWith("src/lib/seo/") ||
    file.includes("sitemap.js") ||
    file.includes("robots.js") ||
    file.includes("pageSeoCatalog")
  ) {
    return PRIORITY_PATHS;
  }
  return [];
}

function collectPaths(files) {
  const paths = new Set(PRIORITY_PATHS);
  const seoTouch = files.some(
    (file) =>
      file.startsWith("src/app/") ||
      file.startsWith("src/lib/seo/") ||
      file.startsWith("src/components/seo/") ||
      file.startsWith("src/components/city-cabs/") ||
      file.includes("sitemap") ||
      file.includes("robots")
  );
  if (seoTouch || !files.length) {
    for (const path of PRIORITY_PATHS) paths.add(path);
  }
  for (const file of files) {
    for (const path of pathsFromFile(file)) paths.add(path);
  }
  return [...paths].filter(isSafePath).slice(0, MAX_URLS);
}

function toUrl(path) {
  return path === "/" ? `${SITE}/` : `${SITE}${path}`;
}

async function publishUrl(token, url) {
  const res = await fetch(PUBLISH_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url, type: "URL_UPDATED" })
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json.error?.message || json.error_description || json.error || res.statusText;
    throw new Error(`${res.status} ${msg}`);
  }
  return json;
}

async function pingSitemap() {
  const sitemap = `${SITE}/sitemap.xml`;
  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`);
    console.log(`Sitemap ping sent: ${sitemap}`);
  } catch (err) {
    console.log(`Sitemap ping skipped: ${err.message}`);
  }
}

async function main() {
  const files = changedFiles();
  const paths = collectPaths(files);
  const urls = paths.map(toUrl);

  console.log(`Site: ${SITE}`);
  console.log(`Changed files: ${files.length || "none (priority URLs only)"}`);
  console.log(`URLs to notify (${urls.length}):`);
  for (const url of urls) console.log(`  ${url}`);

  await pingSitemap();

  const sa = loadServiceAccount();
  if (!sa) {
    console.log(
      "::warning::Google Indexing API skipped. Add GitHub secret GOOGLE_INDEXING_SA_JSON (Search Console Owner service account) to request indexing on every push."
    );
    return;
  }

  const token = await getAccessToken(sa);
  let ok = 0;
  let failed = 0;
  for (const url of urls) {
    try {
      await publishUrl(token, url);
      ok += 1;
      console.log(`Indexed: ${url}`);
    } catch (err) {
      failed += 1;
      console.log(`Failed: ${url} — ${err.message}`);
    }
  }
  console.log(`Google Indexing API: ${ok} updated, ${failed} failed`);
  if (failed && !ok) process.exit(1);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
