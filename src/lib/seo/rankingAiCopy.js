/**
 * Ranking-page AI copy that meets computeRankingSeoScore minima:
 * 400+ body words, 2+ H2s, 4 complete FAQs, 40+ intro words.
 * City taxi pages must not name local / hourly / round-trip packages.
 */
import { marked } from "marked";
import { cityHubContext } from "./cityHubCopy";

export const RANKING_AI_VERSION = "rank-minima-3-call-taxi";

export function isRankingDriverPage(ctx = {}) {
  return /acting-driver|call-driver|acting driver|call driver/i.test(
    `${ctx.path || ""} ${ctx.pageType || ""} ${ctx.h1 || ""} ${ctx.vehicle || ""}`
  );
}

/** Never put "local" in title, meta description or keyword strings. */
export function banLocalInMeta(value, ctx = {}) {
  const driver = isRankingDriverPage(ctx);
  let s = String(value || "");
  s = s.replace(/\bno local airport(?: taxi)?\b/gi, "no airport");
  s = s.replace(/\blocal\s*&\s*outstation\b/gi, driver ? "call driver" : "call taxi");
  s = s.replace(/\boutstation\s*&\s*local(?:\s+taxi)?\b/gi, driver ? "call driver" : "call taxi");
  s = s.replace(/\bairport,?\s*local(?:ly)? and outstation\b/gi, "call taxi and airport");
  s = s.replace(/\blocal(?:ly)?,?\s*airport and outstation\b/gi, "call taxi, airport and outstation");
  s = s.replace(/\blocal(?:ly)?\s+(?:cab|cabs|taxi|taxis|hire|packages?|rental|drops?|hours)\b/gi, driver ? "call driver" : "call taxi");
  s = s.replace(/\blocal(?:ly)?\b/gi, driver ? "call driver" : "call taxi");
  s = s.replace(/\b(call taxi|call driver)(?:\s*[,&]\s*|\s+)+\1\b/gi, "$1");
  return s.replace(/\s{2,}/g, " ").replace(/\s+\|/g, " |").replace(/\|\s+/g, "| ").trim();
}

export function rankingMetaTemplates(ctx = {}) {
  const { city } = cityBits(ctx);
  if (isRankingDriverPage(ctx)) {
    const title = `Call Driver in ${city} | Acting Driver | Cabzii`.slice(0, 60);
    const description =
      `Hire a ${city} call driver / acting driver for your own car. City, outstation and airport chauffeur. Fares show before you pay on Cabzii.`.slice(
        0,
        155
      );
    return { title, description, keywords: `call driver ${city.toLowerCase()}, acting driver ${city.toLowerCase()}, chauffeur ${city.toLowerCase()}, cabzii` };
  }
  const title = `Cab Booking in ${city} | Call Taxi Online | Cabzii`.slice(0, 60);
  const description =
    `Book ${city} call taxi and cab booking on Cabzii. City, airport and outstation cabs. Sedan, SUV and Innova. Tolls extra.`.slice(
      0,
      155
    );
  return {
    title,
    description,
    keywords: `cab booking ${city.toLowerCase()}, ${city.toLowerCase()} call taxi, ${city.toLowerCase()} taxi, taxi service ${city.toLowerCase()}, cabzii`
  };
}

export function ensureRankingTitle(title, ctx = {}) {
  const cleaned = banLocalInMeta(title, ctx);
  const banned = /\b(local|hourly|round[ -]?trip|packages?)\b/i.test(cleaned);
  if (!banned && cleaned.length >= 40 && cleaned.length <= 70) return cleaned.slice(0, 60);
  return rankingMetaTemplates(ctx).title;
}

export function ensureRankingDescription(description, ctx = {}) {
  const cleaned = banLocalInMeta(description, ctx);
  const banned = /\b(local|hourly|round[ -]?trip|packages?)\b/i.test(cleaned);
  if (!banned && cleaned.length >= 90 && cleaned.length <= 170) return cleaned.slice(0, 155);
  return rankingMetaTemplates(ctx).description;
}

export function ensureRankingKeywords(keywords, ctx = {}) {
  const cleaned = banLocalInMeta(String(keywords || ""), ctx)
    .split(/[,|\n]+/)
    .map((k) => k.trim())
    .filter(Boolean)
    .filter((k) => !/\blocal\b/i.test(k));
  if (cleaned.length >= 3) return cleaned.join(", ");
  return rankingMetaTemplates(ctx).keywords;
}

export function rankingCitySlug(ctx = {}) {
  const path = String(ctx.path || ctx.pathPrefix || "");
  const last = path.split("/").filter(Boolean).pop() || "";
  if (last && !["cabs", "services", "cab-booking", "airport-taxi", "acting-driver"].includes(last)) {
    return last.toLowerCase();
  }
  return String(ctx.city || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .trim();
}

export function rankingScoreRules() {
  return `Rank calculator — do not return copy that fails these:
- Meta title 50–60 characters with city + search intent
- Meta description 120–155 characters with a booking CTA
- Visible H1 includes the city or focus keyword
- Intro 40+ words (plain paragraph, no heading)
- Body (intro + HTML) 400+ words — write 500–800 words
- At least 3 Markdown ## H2 headings. Do NOT use ### — only <h2> counts
- At least 4 complete FAQs (question AND answer, both non-empty)
- First keyword is the focus term; include 3+ keywords
Never mention local cab, local taxi, hourly rental, 4-hour / 40 km, 8-hour / 80 km, round-trip, slabs, or any named package product. Write city taxi services / cab booking only. Say “fare” not “package”.
Title and meta must NOT contain the word “local”. Use “cab booking” or “call taxi” on city cab pages, and “call driver” on acting-driver pages.
No fake prices, reviews, certifications, or “cheapest in India” claims. Stay on this URL’s intent.`;
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function rankingWordCount(value) {
  const text = stripHtml(value);
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}

export function rankingH2Count(html) {
  return String(html || "").match(/<h2\b/gi)?.length || 0;
}

/** Remove local / hourly / round-trip / package product language from ranking copy. */
export function stripRankingProductSpeak(value) {
  return String(value || "")
    .replace(/\b4[ -]?hours?\s*\/\s*40\s*k[m.m]?\b/gi, "")
    .replace(/\b8[ -]?hours?\s*\/\s*80\s*k[m.m]?\b/gi, "")
    .replace(/\b(?:4|8)[ -]?hours?(?:\s*\/\s*\d+\s*k[m.m]?)?\b/gi, "")
    .replace(/\b40\s*km\b/gi, "")
    .replace(/\b80\s*km\b/gi, "")
    .replace(/\bhourly(?:\s+(?:rental|hire|cab|cabs|taxi|fares?|slabs?|packages?))?\b/gi, "")
    .replace(/\bround[ -]?trips?(?:\s+(?:cab|cabs|taxi|hire))?\b/gi, "")
    .replace(/\blocal(?:ly)?\b/gi, "")
    .replace(/\bpackages?\b/gi, "fares")
    .replace(/\bslabs?\b/gi, "fares")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/,\s*,+/g, ",")
    .replace(/\(\s*\)/g, "")
    .replace(/\s+—\s+—/g, " —")
    .trim();
}

function cityBits(ctx = {}) {
  const slug = rankingCitySlug(ctx);
  const city = ctx.city || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "this city";
  const name = ctx.h1 || ctx.vehicle || (isRankingDriverPage(ctx) ? `${city} Call Driver` : `${city} Cab Booking`);
  const hub = cityHubContext(slug);
  return {
    slug,
    city,
    name,
    travel: `${city} taxi bookings cover city pickups, hotel and railway drops, and same-day family travel on Cabzii. Fares show before payment.`,
    useCases:
      stripRankingProductSpeak(hub?.useCases) ||
      `Typical ${city} trips are hotel pickups, railway stations, temple or hospital visits, and same-day returns.`
  };
}

export function fallbackRankingIntro(ctx = {}) {
  const { city, name } = cityBits(ctx);
  return `Book ${name} on Cabzii: enter pickup and drop in ${city}, verify your mobile number, choose a vehicle and confirm the live fare. Finish the booking on this city taxi page — no second URL and no invented prices.`;
}

export function fallbackRankingFaqs(ctx = {}) {
  const { city, name } = cityBits(ctx);
  return [
    {
      question: `How do I book ${name} on Cabzii?`,
      answer: `Open this ${city} taxi page, enter pickup and drop, verify your mobile number, pick a vehicle and check the fare card. Confirm only after the fare looks right. You get a booking record to share with family or the driver.`
    },
    {
      question: `What can I book on this ${city} taxi page?`,
      answer: `This URL is ${city} taxi services: city pickups, hotel and railway drops, and same-day trips. Outstation, one-way, airport and tempo-traveller landings stay on their own URLs so this page is not a duplicate.`
    },
    {
      question: `Are fares shown before I pay?`,
      answer: `Yes. Cabzii shows the fare for the vehicle before payment. We do not invent a fake “lowest fare in India”. Waiting, extra stops or hill-road notes appear on the fare card when they apply to your trip.`
    },
    {
      question: `Which vehicles can I choose in ${city}?`,
      answer: `Pick a sedan for two or three riders, Ertiga or Innova for families, after you see the live fare. Larger groups should open the tempo-traveller page under Services instead of squeezing extra seats into a sedan.`
    },
    {
      question: `Does Cabzii assign a driver after I confirm?`,
      answer: `Yes. A driver is assigned after you confirm. Keep the same booking thread if the pickup pin needs a tweak. WhatsApp support can help if the gate or apartment name is hard to see on the map.`
    },
    {
      question: `Is this the airport taxi page for ${city}?`,
      answer: `Only if this URL is the airport-taxi landing. City taxi-service pages cover pickup and drop in ${city}. Airport copy belongs on the airport URL when the city has that product. Acting driver (your car, our driver) is a separate city page.`
    }
  ];
}

export function fallbackRankingMarkdown(ctx = {}) {
  const { city, name, travel, useCases } = cityBits(ctx);
  return `Book **${name}** in ${city} with Cabzii. Enter pickup and drop, verify your mobile number, select a vehicle, check the live fare and confirm. This city taxi page is the place to finish — you do not hunt a second URL.

## ${city} taxi services you can book

${travel}

Use this page for city pickups, railway or hotel drops, temple and hospital visits, and same-day family travel in ${city}. Cabzii shows the fare before you pay. Drivers are assigned after you confirm — we do not invent ratings or fake certification badges.

${useCases}

Sedans suit couples and light luggage on city roads. Ertiga and Innova fit families. Larger groups should open the tempo-traveller landing under Services instead of stuffing extra seats into a sedan. Multi-stop temple, hospital or shopping days work when you keep the same booking thread so the driver already knows the next pin.

Tell the driver your darshan, discharge or train slot when you book. Early-morning and late-night pickups are normal on this mix. If a pilgrimage city has a last motorable point, the drop is that point — not a restricted inner shrine.

## How booking works on Cabzii

1. Enter pickup and drop in ${city}.
2. Verify your mobile number with OTP.
3. Select vehicle type and check the live rate.
4. Book the ride and keep the confirmation handy.

WhatsApp support can adjust a pickup pin if the driver cannot see the gate. Cancellation and waiting rules sit on the fare card before payment. Keep the same booking thread if you add a stop; do not create a second trip unless the first one ended.

Saved riders and GST details speed repeat or corporate trips. First-time users complete OTP once, then see the same fare screen as everyone else. Share the booking with family so they know the vehicle and driver details.

## Where ${city} travellers usually go

City point-to-point is one drop. A same-day return to your hotel or home stays on this taxi-service URL. Outstation, one-way and tempo-traveller pages live under Services so this URL stays a ${city} taxi-service hub, not a thin duplicate.

We do not quote a fake nationwide lowest fare. The number on the screen is the fare for that vehicle. Extra waiting, child seats or hill-road notes are asked on the form when the trip needs them.

If you searched “${city} taxi services” or “cab booking in ${city}”, this is the page to finish on. Airport-only copy belongs on the airport taxi URL when this city has that product. Acting driver — your car, our driver — is a separate city page.

## Why travellers book ${city} cabs with Cabzii

Cabzii is built for South India city taxi search: one H1, one URL, honest fares. You get an upfront fare, a driver assignment after confirm, and a booking record you can share. Support is on WhatsApp and phone during trip hours.

Stay on this page to book ${city} taxi services, or continue from the fare widget. You can also open the main [cab booking](/cabs) flow if you already know pickup and drop.

Book ${name} today — pickup in ${city}, live fare on screen, driver after you confirm.`;
}

export function fallbackRankingContent(ctx = {}) {
  const markdown = fallbackRankingMarkdown(ctx);
  return { html: marked.parse(markdown), markdown };
}

export function normalizeRankingMarkdown(md) {
  let s = stripRankingProductSpeak(String(md || "").trim());
  if (!s) return s;
  s = s.replace(/^# /gm, "## ");
  const h2 = (s.match(/^## /gm) || []).length;
  if (h2 < 3) s = s.replace(/^### /gm, "## ");
  return s;
}

export function ensureRankingFaqs(faqs, ctx = {}) {
  const complete = (Array.isArray(faqs) ? faqs : [])
    .map((row) => ({
      question: stripRankingProductSpeak(row?.question || ""),
      answer: stripRankingProductSpeak(row?.answer || "")
    }))
    .filter((row) => row.question && row.answer);
  const extras = fallbackRankingFaqs(ctx);
  const merged = [...complete];
  for (const faq of extras) {
    if (merged.length >= 6) break;
    const q = faq.question.toLowerCase();
    if (!merged.some((row) => row.question.toLowerCase() === q)) merged.push(faq);
  }
  return merged.slice(0, 8);
}

export function ensureRankingHtml(html, ctx = {}) {
  let out = stripRankingProductSpeak(String(html || "").trim());
  if (out && !out.includes("<") && /^#+\s/m.test(out)) {
    out = marked.parse(normalizeRankingMarkdown(out));
  }
  if (rankingH2Count(out) < 2) {
    out = out.replace(/<h3\b/gi, "<h2").replace(/<\/h3>/gi, "</h2>");
  }
  const words = rankingWordCount(out);
  const h2s = rankingH2Count(out);
  if (words >= 400 && h2s >= 3) return out;
  const fallback = fallbackRankingContent(ctx).html;
  if (words < 120) return fallback;
  if (h2s < 3 || words < 400) return `${out}\n${fallback}`;
  return out;
}

export function ensureRankingIntro(intro, ctx = {}) {
  const text = stripRankingProductSpeak(
    String(intro || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
  if (rankingWordCount(text) >= 40) return text;
  return fallbackRankingIntro(ctx);
}
