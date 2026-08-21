/**
 * Enterprise AI SEO service (OpenAI).
 * Falls back to Cabzii templates when OPENAI_API_KEY is missing.
 */
import OpenAI from "openai";
import { marked } from "marked";
import {
  applySeoTemplate,
  SEO_TEMPLATES,
  generateSlug as localSlug,
  generateFaqSuggestions,
  buildVehicleJsonLd,
  seoVars
} from "./vehicleEnterpriseSeo";

const MODEL = process.env.OPENAI_SEO_MODEL || "gpt-4o-mini";
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

export const AI_SEO_TASKS = [
  "seo-title",
  "meta-description",
  "keywords",
  "faq",
  "content",
  "slug",
  "h1",
  "h2",
  "image-alt",
  "schema",
  "rewrite",
  "improve",
  "simplify",
  "expand",
  "grammar",
  "cta",
  "everything"
];

function getClient() {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

function cacheKey(task, payload) {
  return `${task}:${JSON.stringify(payload)}`;
}

function getCached(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.data;
}

function setCache(key, data) {
  cache.set(key, { at: Date.now(), data });
  if (cache.size > 200) {
    const first = cache.keys().next().value;
    cache.delete(first);
  }
}

function contextFromPayload(payload = {}) {
  const v = seoVars(payload);
  const ctx = {
    vehicle: payload.vehicleName || payload.title || payload.name || v.vehicle,
    brand: payload.brand || payload.brandName || v.brand,
    city: payload.city || v.city,
    state: payload.state || v.state,
    price: v.price,
    seats: payload.seats || v.seats,
    category: payload.category || payload.type || "Cab",
    fuel: payload.fuelType || v.fuel,
    transmission: payload.transmission || v.transmission,
    pathPrefix: payload.pathPrefix || "/cabs",
    existingTitle: payload.seoTitle || "",
    existingDescription: payload.seoDescription || "",
    content: payload.content || payload.longSeoContent || "",
    customPrompt: String(payload.customPrompt || payload.instruction || "").trim(),
    imageType: payload.imageType || "gallery",
    index: payload.index || 1
  };
  // Shape expected by vehicleEnterpriseSeo helpers
  ctx.vehicleName = ctx.vehicle;
  ctx.title = ctx.vehicle;
  ctx.brandName = ctx.brand;
  ctx.fuelType = ctx.fuel;
  ctx.pricePerKm = payload.pricePerKm;
  ctx.startingPrice = payload.startingPrice || payload.price;
  return ctx;
}

async function chatJson(system, user, { temperature = 0.7 } = {}) {
  const client = getClient();
  if (!client) return null;
  const res = await client.chat.completions.create({
    model: MODEL,
    temperature,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });
  const text = res.choices?.[0]?.message?.content || "{}";
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function chatText(system, user, { temperature = 0.6 } = {}) {
  const client = getClient();
  if (!client) return null;
  const res = await client.chat.completions.create({
    model: MODEL,
    temperature,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });
  return res.choices?.[0]?.message?.content || null;
}

function brandRules() {
  return `You are an expert SEO copywriter for Cabzii (cabzii.in), an Indian cab booking platform.
Write natural Indian English for Google search. Focus on CTR, local SEO, and conversion.
Never invent fake certifications. Prefer Chennai/Tamil Nadu style local SEO when city matches.
Return ONLY valid JSON when asked for JSON.`;
}

function promptNote(ctx) {
  return ctx.customPrompt ? `\nExtra instructions from admin: ${ctx.customPrompt}` : "";
}

/* ── Fallbacks (no API key) ─────────────────────────────────── */

function fallbackTitle(ctx) {
  const base = applySeoTemplate(SEO_TEMPLATES.title, ctx);
  return {
    titles: [
      base.slice(0, 60),
      `${ctx.vehicle} Taxi in ${ctx.city} | Cabzii`.slice(0, 60),
      `Book ${ctx.vehicle} in ${ctx.city} from ${ctx.price}`.slice(0, 60),
      `${ctx.city} ${ctx.vehicle} Rental | Best Price`.slice(0, 60),
      `${ctx.seats ? `${ctx.seats} Seater ` : ""}${ctx.vehicle} ${ctx.city}`.slice(0, 60),
      `Hire ${ctx.vehicle} ${ctx.city} | Airport & Outstation`.slice(0, 60),
      `${ctx.vehicle} Cab Booking ${ctx.city} | Cabzii`.slice(0, 60),
      `Affordable ${ctx.vehicle} Rental ${ctx.city}`.slice(0, 60),
      `${ctx.brand} ${ctx.vehicle} Taxi ${ctx.city}`.slice(0, 60),
      `Best ${ctx.vehicle} in ${ctx.city} | Book Online`.slice(0, 60)
    ]
  };
}

function fallbackDescriptions(ctx) {
  const d = applySeoTemplate(SEO_TEMPLATES.description, ctx);
  return {
    descriptions: [
      d.slice(0, 160),
      `Book ${ctx.vehicle} in ${ctx.city} from ${ctx.price}. Verified drivers, airport & outstation. Book now on Cabzii.`.slice(0, 160),
      `Need a ${ctx.vehicle}? Hire in ${ctx.city}, ${ctx.state} with upfront fares. Instant OTP booking on Cabzii.in.`.slice(0, 160),
      `${ctx.vehicle} rental ${ctx.city} — local, airport transfer & corporate travel. Transparent pricing. Book today.`.slice(0, 160),
      `Reserve ${ctx.vehicle} online in ${ctx.city}. AC cabs, professional drivers, 24×7 support. Start booking on Cabzii.`.slice(0, 160)
    ]
  };
}

function fallbackKeywords(ctx) {
  const v = String(ctx.vehicle || "cab").toLowerCase();
  const c = String(ctx.city || "chennai").toLowerCase();
  return {
    primary: [`${v} ${c}`, `${v} rental ${c}`, `${c} taxi`],
    secondary: ["airport taxi", "outstation cab", "cab booking", "local taxi"],
    longTail: [`book ${v} in ${c}`, `${v} airport transfer ${c}`, `hire ${v} for outstation from ${c}`],
    lsi: ["chauffeur", "tempo traveller", "ac cab", "one way taxi", "corporate travel"]
  };
}

function fallbackH1(ctx) {
  return {
    headings: [
      applySeoTemplate(SEO_TEMPLATES.h1, ctx),
      `Book ${ctx.vehicle} in ${ctx.city}`,
      `${ctx.vehicle} Taxi Rental — ${ctx.city}`,
      `Hire ${ctx.vehicle} for ${ctx.city} Trips`,
      `${ctx.city} ${ctx.vehicle} with Driver`
    ]
  };
}

function fallbackH2(ctx) {
  return {
    headings: [
      `Why book ${ctx.vehicle} in ${ctx.city}?`,
      `${ctx.vehicle} pricing in ${ctx.city}`,
      `Airport transfer with ${ctx.vehicle}`,
      `Outstation trips from ${ctx.city}`,
      `Corporate travel packages`,
      `Wedding & event travel`,
      `Popular routes from ${ctx.city}`,
      `Vehicle features & amenities`,
      `How booking works on Cabzii`,
      `FAQs about ${ctx.vehicle}`
    ]
  };
}

function fallbackContent(ctx) {
  const md = `## ${ctx.vehicle} rental in ${ctx.city}

### Introduction
Book **${ctx.vehicle}** online in ${ctx.city}, ${ctx.state} with Cabzii. Transparent fares starting from ${ctx.price}.

### Vehicle overview
Our ${ctx.vehicle} (${ctx.seats || "comfortable"} seater) is ideal for airport transfers, local hire, outstation and corporate travel.

### Features
AC, verified drivers, GPS tracking, and sanitized vehicles.

### Pricing
Packages start from ${ctx.price}. See exact fares before payment.

### Why choose Cabzii
OTP booking, upfront pricing, 24×7 support, and professional drivers across South India.

### Popular routes
Explore popular one-way and round-trip routes from ${ctx.city}.

### Airport transfer
Reliable airport pickup and drop for ${ctx.vehicle} in ${ctx.city}.

### Corporate travel
Invoice-friendly corporate cab packages with Cabzii.

### Wedding travel
Group travel options for wedding and family events.

### Tour packages
Combine cab hire with popular tour packages from Cabzii.

### FAQs
See FAQs on this page for fare, inclusions and booking steps.

### Conclusion
Book your ${ctx.vehicle} in ${ctx.city} today on [cabzii.in](https://www.cabzii.in).`;
  return { html: marked.parse(md), markdown: md };
}

/* ── Task runners ───────────────────────────────────────────── */

export async function runAiSeoTask(task, payload = {}) {
  if (!AI_SEO_TASKS.includes(task)) {
    throw new Error(`Unknown AI SEO task: ${task}`);
  }

  const ctx = contextFromPayload(payload);
  const key = cacheKey(task, ctx);
  const cached = getCached(key);
  if (cached) return { ...cached, cached: true, source: cached.source || "cache" };

  let result;
  const hasOpenAi = Boolean(getClient());

  try {
    switch (task) {
      case "seo-title": {
        const ai = await chatJson(
          brandRules(),
          `Generate 10 unique SEO titles for this Cabzii listing.
Vehicle: ${ctx.vehicle}
Brand: ${ctx.brand}
City: ${ctx.city}
State: ${ctx.state}
Price: ${ctx.price}
Seats: ${ctx.seats}
Category: ${ctx.category}${promptNote(ctx)}
Rules: under 60 characters, CTR optimized, include city + primary keyword, natural language.
Return JSON: {"titles":["..."]}`
        );
        result = ai?.titles?.length ? { titles: ai.titles.map((t) => String(t).slice(0, 70)) } : fallbackTitle(ctx);
        break;
      }
      case "meta-description": {
        const ai = await chatJson(
          brandRules(),
          `Generate 5 meta descriptions for Cabzii.
Vehicle: ${ctx.vehicle}, City: ${ctx.city}, State: ${ctx.state}, Price: ${ctx.price}, Seats: ${ctx.seats}${promptNote(ctx)}
Rules: under 160 chars, high CTR, include CTA + keyword.
Return JSON: {"descriptions":["..."]}`
        );
        result = ai?.descriptions?.length
          ? { descriptions: ai.descriptions.map((d) => String(d).slice(0, 180)) }
          : fallbackDescriptions(ctx);
        break;
      }
      case "keywords": {
        const ai = await chatJson(
          brandRules(),
          `Generate SEO keywords for Cabzii listing: ${ctx.vehicle} in ${ctx.city}, ${ctx.state}.
Category: ${ctx.category}. Seats: ${ctx.seats}.
Return JSON: {"primary":[],"secondary":[],"longTail":[],"lsi":[]}`
        );
        result =
          ai?.primary || ai?.secondary
            ? {
                primary: ai.primary || [],
                secondary: ai.secondary || [],
                longTail: ai.longTail || ai.long_tail || [],
                lsi: ai.lsi || []
              }
            : fallbackKeywords(ctx);
        break;
      }
      case "faq": {
        const ai = await chatJson(
          brandRules(),
          `Generate 10 SEO-optimized FAQs for booking ${ctx.vehicle} in ${ctx.city} on Cabzii.
Include fare, airport, outstation, inclusions, booking steps.
Return JSON: {"faqs":[{"question":"","answer":""}]}`
        );
        result = ai?.faqs?.length
          ? { faqs: ai.faqs }
          : { faqs: generateFaqSuggestions(ctx) };
        break;
      }
      case "content": {
        const ai = await chatText(
          brandRules() +
            " Write long-form SEO content in Markdown only. Never use a top-level # H1 — the product page already has one H1. Use ## for main sections and ### for subsections. Keep headings short (under 60 characters). Never write 'All India' as a city — use Chennai or the given city.",
          `Write 900-1500 words Markdown SEO article for ${ctx.vehicle} rental in ${ctx.city}, ${ctx.state}.
Price from ${ctx.price}. Seats: ${ctx.seats}. Brand: ${ctx.brand}. Category: ${ctx.category}.
Start with ## ${ctx.vehicle} rental in ${ctx.city} (not #).
Then use ## or ### for: Introduction, Vehicle Overview, Features, Pricing, Why Choose Cabzii, Popular Routes, Airport Transfer, Corporate Travel, Wedding Travel, Tour Packages, FAQs, Conclusion.
Use natural keywords. End with a CTA to book on Cabzii.`
        );
        if (ai) {
          result = { html: marked.parse(ai), markdown: ai };
        } else {
          result = fallbackContent(ctx);
        }
        break;
      }
      case "slug": {
        const ai = await chatJson(
          brandRules(),
          `Generate 5 SEO-friendly URL slugs for ${ctx.vehicle} in ${ctx.city}.
Rules: lowercase, hyphens only, no stop words spam, max 80 chars.
Return JSON: {"slugs":["..."]}`
        );
        result = ai?.slugs?.length
          ? { slugs: ai.slugs.map((s) => String(s).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "")) }
          : { slugs: [localSlug(ctx)] };
        break;
      }
      case "h1": {
        const ai = await chatJson(
          brandRules(),
          `Generate 5 H1 headings for ${ctx.vehicle} in ${ctx.city}. Under 70 chars. Return JSON: {"headings":[]}`
        );
        result = ai?.headings?.length ? { headings: ai.headings } : fallbackH1(ctx);
        break;
      }
      case "h2": {
        const ai = await chatJson(
          brandRules(),
          `Generate 10 SEO H2 headings for a ${ctx.vehicle} landing page in ${ctx.city}. Return JSON: {"headings":[]}`
        );
        result = ai?.headings?.length ? { headings: ai.headings } : fallbackH2(ctx);
        break;
      }
      case "image-alt": {
        const ai = await chatJson(
          brandRules(),
          `Generate SEO image ALT, title, caption and filename for ${ctx.vehicle} (${ctx.imageType}) photo #${ctx.index} in ${ctx.city}.
Return JSON: {"alt":"","title":"","caption":"","filename":""}`
        );
        result = ai?.alt
          ? ai
          : {
              alt: `${ctx.vehicle} ${ctx.imageType} photo ${ctx.index} in ${ctx.city}`,
              title: `${ctx.vehicle} rental ${ctx.city}`,
              caption: `Book ${ctx.vehicle} in ${ctx.city} on Cabzii`,
              filename: localSlug({ vehicleName: ctx.vehicle, city: ctx.city, seats: ctx.seats })
            };
        break;
      }
      case "schema": {
        const ai = await chatJson(
          brandRules(),
          `Create JSON-LD @graph for Cabzii vehicle page.
Include Product, Offer, Vehicle/Rental, FAQPage, BreadcrumbList, Organization, LocalBusiness, AggregateRating, Review, WebSite SearchAction.
Vehicle: ${ctx.vehicle}, City: ${ctx.city}, State: ${ctx.state}, Price: ${ctx.price}, URL path prefix: ${ctx.pathPrefix}.
Return JSON: {"jsonLd": { "@context":"https://schema.org", "@graph":[] }}`
        );
        result = ai?.jsonLd
          ? { jsonLd: ai.jsonLd }
          : { jsonLd: buildVehicleJsonLd(payload, ctx.pathPrefix) };
        break;
      }
      case "rewrite":
      case "improve":
      case "simplify":
      case "expand":
      case "grammar":
      case "cta": {
        const intents = {
          rewrite: "Rewrite for higher SEO quality and clarity",
          improve: "Improve SEO, keyword usage and readability",
          simplify: "Simplify language for easier reading",
          expand: "Expand with useful SEO detail (keep truthful)",
          grammar: "Fix grammar and punctuation only",
          cta: "Add a strong booking CTA for Cabzii at the end"
        };
        const ai = await chatText(
          brandRules(),
          `${intents[task]}.
Vehicle context: ${ctx.vehicle} in ${ctx.city}.
Content:
${ctx.content || ctx.existingDescription || "Book this cab on Cabzii."}
Return improved HTML paragraphs only.`
        );
        result = { html: ai || ctx.content, text: ai || ctx.content };
        break;
      }
      case "everything": {
        const settled = await Promise.allSettled([
          runAiSeoTask("seo-title", payload),
          runAiSeoTask("meta-description", payload),
          runAiSeoTask("keywords", payload),
          runAiSeoTask("faq", payload),
          runAiSeoTask("h1", payload),
          runAiSeoTask("h2", payload),
          runAiSeoTask("content", payload),
          runAiSeoTask("slug", payload),
          runAiSeoTask("image-alt", payload)
        ]);
        const pick = (i, fb) => (settled[i].status === "fulfilled" ? settled[i].value : fb);
        const titles = pick(0, fallbackTitle(ctx));
        const descriptions = pick(1, fallbackDescriptions(ctx));
        const keywords = pick(2, fallbackKeywords(ctx));
        const faqs = pick(3, { faqs: generateFaqSuggestions(ctx) });
        const h1s = pick(4, fallbackH1(ctx));
        const h2s = pick(5, fallbackH2(ctx));
        const content = pick(6, fallbackContent(ctx));
        const slugs = pick(7, { slugs: [localSlug(ctx)] });
        const alt = pick(8, {
          alt: `${ctx.vehicle} photo in ${ctx.city}`,
          title: `${ctx.vehicle} rental`,
          caption: "",
          filename: localSlug(ctx)
        });
        result = {
          seoTitle: titles.titles?.[0] || "",
          titles: titles.titles || [],
          seoDescription: descriptions.descriptions?.[0] || "",
          descriptions: descriptions.descriptions || [],
          keywords,
          faq: faqs.faqs || [],
          h1: h1s.headings?.[0] || "",
          h1Options: h1s.headings || [],
          h2: h2s.headings || [],
          longSeoContent: content.html || "",
          shortDescription: descriptions.descriptions?.[1] || descriptions.descriptions?.[0] || "",
          slug: slugs.slugs?.[0] || localSlug(ctx),
          imageAlt: alt
        };
        break;
      }
      default:
        throw new Error(`Unhandled task: ${task}`);
    }
  } catch (err) {
    // Soft-fail to templates so admin UI never bricks
    if (task === "seo-title") result = fallbackTitle(ctx);
    else if (task === "meta-description") result = fallbackDescriptions(ctx);
    else if (task === "keywords") result = fallbackKeywords(ctx);
    else if (task === "faq") result = { faqs: generateFaqSuggestions(ctx) };
    else if (task === "content") result = fallbackContent(ctx);
    else if (task === "slug") result = { slugs: [localSlug(ctx)] };
    else if (task === "h1") result = fallbackH1(ctx);
    else if (task === "h2") result = fallbackH2(ctx);
    else if (task === "image-alt") {
      result = {
        alt: `${ctx.vehicle} photo in ${ctx.city}`,
        title: `${ctx.vehicle} rental`,
        caption: "",
        filename: localSlug(ctx)
      };
    } else if (task === "schema") result = { jsonLd: buildVehicleJsonLd(payload, ctx.pathPrefix) };
    else throw err;
    result._fallbackError = err?.message || "AI failed";
  }

  const out = {
    ...result,
    source: hasOpenAi && !result._fallbackError ? "openai" : "template",
    model: hasOpenAi ? MODEL : "template"
  };
  setCache(key, out);
  return out;
}
