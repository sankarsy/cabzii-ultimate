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
import {
  RANKING_AI_VERSION,
  banLocalInMeta,
  ensureRankingDescription,
  ensureRankingFaqs,
  ensureRankingHtml,
  ensureRankingIntro,
  ensureRankingKeywords,
  ensureRankingTitle,
  fallbackRankingContent,
  fallbackRankingFaqs,
  fallbackRankingIntro,
  normalizeRankingMarkdown,
  rankingMetaTemplates,
  rankingScoreRules
} from "./seo/rankingAiCopy";

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
    vehicle: payload.vehicleName || payload.title || payload.name || payload.h1 || v.vehicle,
    brand: payload.brand || payload.brandName || v.brand,
    city: payload.city || v.city,
    state: payload.state || v.state,
    price: v.price,
    seats: payload.seats || v.seats,
    category: payload.category || payload.type || payload.pageType || "Cab",
    fuel: payload.fuelType || v.fuel,
    transmission: payload.transmission || v.transmission,
    pathPrefix: payload.pathPrefix || payload.path || "/cabs",
    existingTitle: payload.seoTitle || "",
    existingDescription: payload.seoDescription || "",
    content: payload.content || payload.longSeoContent || payload.html || "",
    customPrompt: String(payload.customPrompt || payload.instruction || "").trim(),
    imageType: payload.imageType || "gallery",
    index: payload.index || 1,
    pageKind: payload.pageKind === "ranking" ? "ranking" : "vehicle",
    path: payload.path || payload.pathPrefix || "",
    pageType: payload.pageType || payload.category || "",
    intro: payload.intro || "",
    keywords: payload.keywords || payload.seoKeywords || "",
    h1: payload.h1 || payload.vehicleName || "",
    rankGaps: payload.rankGaps || "",
    faqs: payload.faqs || payload.faq || [],
    promptVersion: payload.pageKind === "ranking" ? RANKING_AI_VERSION : "v1"
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

async function chatText(system, user, { temperature = 0.6, max_tokens = 2500 } = {}) {
  const client = getClient();
  if (!client) return null;
  const res = await client.chat.completions.create({
    model: MODEL,
    temperature,
    max_tokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });
  return res.choices?.[0]?.message?.content || null;
}

function brandRules() {
  return `You are an expert SEO copywriter for Cabzii (cabzii.in), an Indian cab booking platform.
Write natural Indian English for Google search. Focus on CTR, city SEO, and conversion.
Never invent fake certifications. Prefer Tamil Nadu city search language when city matches.
On city taxi-service pages do not mention local cab, hourly rental, round-trip, or any named package.
Return ONLY valid JSON when asked for JSON.`;
}

function promptNote(ctx) {
  return ctx.customPrompt ? `\nExtra instructions from admin: ${ctx.customPrompt}` : "";
}

function rankingBrief(ctx) {
  return `This is a Cabzii Google ranking page (not a vehicle catalog card).
Page type: ${ctx.pageType || ctx.category}
Product / H1: ${ctx.h1 || ctx.vehicle}
City: ${ctx.city}
State: ${ctx.state}
Live URL: ${ctx.path || ctx.pathPrefix}
Existing title: ${ctx.existingTitle || "(empty)"}
Existing description: ${ctx.existingDescription || "(empty)"}
Existing intro: ${ctx.intro || "(empty)"}
Existing body: ${(ctx.content || "").slice(0, 800) || "(empty)"}
Keywords: ${ctx.keywords || "(empty)"}
${ctx.rankGaps ? `Current failing score checks: ${ctx.rankGaps}` : ""}
${rankingScoreRules()}
No airport taxi copy unless the page is airport-taxi.${promptNote(ctx)}`;
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
      `Need a ${ctx.vehicle}? Hire in ${ctx.city}, ${ctx.state} with upfront fares on Cabzii.in.`.slice(0, 160),
      `${ctx.vehicle} rental ${ctx.city} — airport transfer and corporate travel. Transparent pricing. Book today.`.slice(0, 160),
      `Reserve ${ctx.vehicle} online in ${ctx.city}. AC cabs and professional drivers. Start booking on Cabzii.`.slice(0, 160)
    ]
  };
}

function fallbackKeywords(ctx) {
  const v = String(ctx.vehicle || "cab").toLowerCase();
  const c = String(ctx.city || "chennai").toLowerCase();
  return {
    primary: [`${v} ${c}`, `${v} rental ${c}`, `${c} taxi`],
    secondary: ["airport taxi", "outstation cab", "cab booking", "call taxi"],
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
Upfront pricing, WhatsApp support, and professional drivers across South India.

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
          ctx.pageKind === "ranking"
            ? `${rankingBrief(ctx)}
Generate 8 unique SEO titles. Each 50–60 characters. CTR-focused.
Never use the word "local". Prefer "cab booking" or "call taxi" (or "call driver" on acting-driver pages).
Return JSON: {"titles":["..."]}`
            : `Generate 10 unique SEO titles for this Cabzii listing.
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
        result = ai?.titles?.length
          ? {
              titles: ai.titles.map((t) =>
                ctx.pageKind === "ranking" ? ensureRankingTitle(t, ctx) : String(t).slice(0, 70)
              )
            }
          : ctx.pageKind === "ranking"
            ? { titles: [rankingMetaTemplates(ctx).title] }
            : fallbackTitle(ctx);
        break;
      }
      case "meta-description": {
        const ai = await chatJson(
          brandRules(),
          ctx.pageKind === "ranking"
            ? `${rankingBrief(ctx)}
Generate 5 meta descriptions. Each 120–155 characters with a booking CTA.
Never use the word "local". Prefer "cab booking" / "call taxi" (or "call driver" on acting-driver pages).
Return JSON: {"descriptions":["..."]}`
            : `Generate 5 meta descriptions for Cabzii.
Vehicle: ${ctx.vehicle}, City: ${ctx.city}, State: ${ctx.state}, Price: ${ctx.price}, Seats: ${ctx.seats}${promptNote(ctx)}
Rules: under 160 chars, high CTR, include CTA + keyword.
Return JSON: {"descriptions":["..."]}`
        );
        result = ai?.descriptions?.length
          ? {
              descriptions: ai.descriptions.map((d) =>
                ctx.pageKind === "ranking" ? ensureRankingDescription(d, ctx) : String(d).slice(0, 180)
              )
            }
          : ctx.pageKind === "ranking"
            ? { descriptions: [rankingMetaTemplates(ctx).description] }
            : fallbackDescriptions(ctx);
        break;
      }
      case "keywords": {
        const ai = await chatJson(
          brandRules(),
          ctx.pageKind === "ranking"
            ? `${rankingBrief(ctx)}
Generate ranking keywords for this URL. First primary term must match search intent.
Never use the word "local". Prefer cab booking, call taxi, or call driver.
Return JSON: {"primary":[],"secondary":[],"longTail":[],"lsi":[]}`
            : `Generate SEO keywords for Cabzii listing: ${ctx.vehicle} in ${ctx.city}, ${ctx.state}.
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
        if (ctx.pageKind === "ranking") {
          const clean = (arr) =>
            (arr || [])
              .map((k) => banLocalInMeta(String(k), ctx))
              .filter((k) => k && !/\blocal\b/i.test(k));
          result = {
            primary: clean(result.primary),
            secondary: clean(result.secondary),
            longTail: clean(result.longTail),
            lsi: clean(result.lsi)
          };
          if (!result.primary.length) {
            result.primary = ensureRankingKeywords("", ctx).split(",").map((k) => k.trim()).filter(Boolean).slice(0, 3);
          }
        }
        break;
      }
      case "faq": {
        const ai = await chatJson(
          brandRules(),
          ctx.pageKind === "ranking"
            ? `${rankingBrief(ctx)}
Generate exactly 6 complete FAQs customers would search. Each answer 40–70 words. Question AND answer required. No fake prices.
Return JSON: {"faqs":[{"question":"","answer":""}]}`
            : `Generate 10 SEO-optimized FAQs for booking ${ctx.vehicle} in ${ctx.city} on Cabzii.
Include fare, airport, outstation, inclusions, booking steps.
Return JSON: {"faqs":[{"question":"","answer":""}]}`
        );
        if (ctx.pageKind === "ranking") {
          result = { faqs: ensureRankingFaqs(ai?.faqs, ctx) };
        } else {
          result = ai?.faqs?.length ? { faqs: ai.faqs } : { faqs: generateFaqSuggestions(ctx) };
        }
        break;
      }
      case "content": {
        const ai = await chatText(
          brandRules() +
            (ctx.pageKind === "ranking"
              ? " Write long-form SEO Markdown only. Never use a top-level # H1. Use at least 4 ## H2 headings. Do not use ### — the rank calculator only counts H2. Keep headings under 60 characters. Never write 'All India' as a city."
              : " Write long-form SEO content in Markdown only. Never use a top-level # H1 — the product page already has one H1. Use ## for main sections and ### for subsections. Keep headings short (under 60 characters). Never write 'All India' as a city — use Chennai or the given city."),
          ctx.pageKind === "ranking"
            ? `${rankingBrief(ctx)}
Write 500–800 words Markdown for this ranking page. No top-level # H1.
Start with a 50–80 word intro paragraph (no heading).
Then at least these ## H2 sections (use ## not ###):
## What ${ctx.city} taxi services include
## How booking works on Cabzii
## Where ${ctx.city} travellers usually go
## Why book ${ctx.city} cabs with Cabzii
Do not mention local cab, hourly rental, 4-hour, 8-hour, 40 km, 80 km, round-trip, or any named package.
End with a short book CTA and one in-content link to /cabs.
Stay on this URL's intent only.`
            : `Write 900-1500 words Markdown SEO article for ${ctx.vehicle} rental in ${ctx.city}, ${ctx.state}.
Price from ${ctx.price}. Seats: ${ctx.seats}. Brand: ${ctx.brand}. Category: ${ctx.category}.
Start with ## ${ctx.vehicle} rental in ${ctx.city} (not #).
Then use ## or ### for: Introduction, Vehicle Overview, Features, Pricing, Why Choose Cabzii, Popular Routes, Airport Transfer, Corporate Travel, Wedding Travel, Tour Packages, FAQs, Conclusion.
Use natural keywords. End with a CTA to book on Cabzii.`,
          ctx.pageKind === "ranking" ? { max_tokens: 3500 } : {}
        );
        if (ctx.pageKind === "ranking") {
          if (ai) {
            const markdown = normalizeRankingMarkdown(ai);
            result = {
              html: ensureRankingHtml(marked.parse(markdown), ctx),
              markdown,
              intro: ensureRankingIntro(ctx.intro || "", ctx)
            };
          } else {
            const fb = fallbackRankingContent(ctx);
            result = { ...fb, intro: fallbackRankingIntro(ctx) };
          }
        } else if (ai) {
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
          ctx.pageKind === "ranking"
            ? `${rankingBrief(ctx)}
Generate 5 visible H1 options. Under 70 characters. Match search intent + city. Return JSON: {"headings":[]}`
            : `Generate 5 H1 headings for ${ctx.vehicle} in ${ctx.city}. Under 70 chars. Return JSON: {"headings":[]}`
        );
        result = ai?.headings?.length ? { headings: ai.headings } : fallbackH1(ctx);
        break;
      }
      case "h2": {
        const ai = await chatJson(
          brandRules(),
          ctx.pageKind === "ranking"
            ? `${rankingBrief(ctx)}
Generate 8 H2 headings (under 60 characters) for this ranking page. They must be usable as ## headings in the body. Return JSON: {"headings":[]}`
            : `Generate 10 SEO H2 headings for a ${ctx.vehicle} landing page in ${ctx.city}. Return JSON: {"headings":[]}`
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
        const rankingExpand =
          task === "expand" ||
          task === "improve" ||
          task === "rewrite" ||
          String(ctx.customPrompt || "").toLowerCase().includes("intro");
        const ai = await chatText(
          brandRules(),
          ctx.pageKind === "ranking"
            ? `${rankingBrief(ctx)}
${intents[task]}.
${
  String(ctx.customPrompt || "").toLowerCase().includes("intro")
    ? "Write only a 50–80 word intro paragraph as plain text. No heading, no HTML, no title."
    : "Expand or rewrite so the body is 500–800 words with at least 3 ## H2 headings (not ###). Return Markdown, no H1."
}
Current copy:
${ctx.content || ctx.intro || ctx.existingDescription || "Write ranking copy for this Cabzii page."}`
            : `${intents[task]}.
Vehicle context: ${ctx.vehicle} in ${ctx.city}.
Content:
${ctx.content || ctx.existingDescription || "Book this cab on Cabzii."}
Return improved HTML paragraphs only.`,
          ctx.pageKind === "ranking" && rankingExpand ? { max_tokens: 3500 } : {}
        );
        if (ctx.pageKind === "ranking") {
          const isIntro = String(ctx.customPrompt || "").toLowerCase().includes("intro");
          if (isIntro) {
            const intro = ensureRankingIntro(ai || ctx.intro, ctx);
            result = { html: intro, text: intro, intro };
          } else if (ai) {
            const markdown = normalizeRankingMarkdown(ai);
            const html = ensureRankingHtml(marked.parse(markdown), ctx);
            result = { html, text: html, markdown };
          } else {
            const fb = fallbackRankingContent(ctx);
            result = { html: fb.html, text: fb.html, markdown: fb.markdown };
          }
        } else {
          result = { html: ai || ctx.content, text: ai || ctx.content };
        }
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
        const titles = pick(0, ctx.pageKind === "ranking" ? { titles: [rankingMetaTemplates(ctx).title] } : fallbackTitle(ctx));
        const descriptions = pick(
          1,
          ctx.pageKind === "ranking" ? { descriptions: [rankingMetaTemplates(ctx).description] } : fallbackDescriptions(ctx)
        );
        const keywords = pick(2, fallbackKeywords(ctx));
        const faqs = pick(3, ctx.pageKind === "ranking" ? { faqs: fallbackRankingFaqs(ctx) } : { faqs: generateFaqSuggestions(ctx) });
        const h1s = pick(4, fallbackH1(ctx));
        const h2s = pick(5, fallbackH2(ctx));
        const content = pick(6, ctx.pageKind === "ranking" ? fallbackRankingContent(ctx) : fallbackContent(ctx));
        const slugs = pick(7, { slugs: [localSlug(ctx)] });
        const alt = pick(8, {
          alt: `${ctx.vehicle} photo in ${ctx.city}`,
          title: `${ctx.vehicle} rental`,
          caption: "",
          filename: localSlug(ctx)
        });
        const rankingFaqs = ctx.pageKind === "ranking" ? ensureRankingFaqs(faqs.faqs, ctx) : faqs.faqs || [];
        const rankingHtml =
          ctx.pageKind === "ranking" ? ensureRankingHtml(content.html || content.longSeoContent || "", ctx) : content.html || "";
        result = {
          seoTitle: ctx.pageKind === "ranking" ? ensureRankingTitle(titles.titles?.[0] || "", ctx) : titles.titles?.[0] || "",
          titles: titles.titles || [],
          seoDescription:
            ctx.pageKind === "ranking"
              ? ensureRankingDescription(descriptions.descriptions?.[0] || "", ctx)
              : descriptions.descriptions?.[0] || "",
          descriptions: descriptions.descriptions || [],
          keywords,
          faq: rankingFaqs,
          faqs: rankingFaqs,
          h1: h1s.headings?.[0] || "",
          h1Options: h1s.headings || [],
          h2: h2s.headings || [],
          longSeoContent: rankingHtml || content.html || "",
          html: rankingHtml || content.html || "",
          intro: ctx.pageKind === "ranking" ? ensureRankingIntro(content.intro || ctx.intro || "", ctx) : "",
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
    else if (task === "faq") result = { faqs: ctx.pageKind === "ranking" ? fallbackRankingFaqs(ctx) : generateFaqSuggestions(ctx) };
    else if (task === "content") result = ctx.pageKind === "ranking" ? { ...fallbackRankingContent(ctx), intro: fallbackRankingIntro(ctx) } : fallbackContent(ctx);
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
    else if (["rewrite", "improve", "expand", "simplify", "grammar", "cta"].includes(task) && ctx.pageKind === "ranking") {
      const isIntro = String(ctx.customPrompt || "").toLowerCase().includes("intro");
      if (isIntro) {
        const intro = fallbackRankingIntro(ctx);
        result = { html: intro, text: intro, intro };
      } else {
        const fb = fallbackRankingContent(ctx);
        result = { html: fb.html, text: fb.html, markdown: fb.markdown };
      }
    } else throw err;
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
