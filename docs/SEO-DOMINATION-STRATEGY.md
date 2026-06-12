# CABZII — SEO DOMINATION STRATEGY
**Prepared:** June 2026 · **Scope:** Full-stack technical audit + 12-month execution plan
**Audit basis:** Direct codebase analysis of cabzii.in (not external crawl estimates)

---

## PHASE 0 — BUSINESS CONTEXT

| Field | Value |
|---|---|
| Website | https://cabzii.in |
| Tech Stack | Next.js 14 App Router (Vercel) + Express/MongoDB backend; 490 pre-rendered pages |
| Primary Cities | 25 live: Chennai (primary), Bengaluru, Hyderabad, Coimbatore, Madurai, Trichy, Salem, Pondicherry, Tirupati, Vellore + 15 more South India cities |
| Current Inventory | 25×2 city pages (cab-booking + acting-driver), 97 route pages, 275 service×city pages, cab/driver/package detail pages, 1 blog post |
| Verticals Live | Cab booking, acting driver (chauffeur on your car), airport taxi, outstation, hourly rental, tour packages |
| Target Tier | State-level (Tamil Nadu dominance) → South India regional |
| Main Competitors | Savaari, Gozo Cabs, MakeMyTrip Cabs, Ola Outstation, Red Taxi (Coimbatore), local one-way operators (OneWay.cab, CabBazar) |
| Team | Solo/small team — strategy below is sequenced for low headcount |
| Differentiator | Acting-driver vertical (low competition), verified-booking review system (already built), CMS-controlled SEO meta |

---

## 1. SEO HEALTH SCORE: **72 / 100**

| Category | Score | Notes |
|---|---|---|
| Technical foundation | 17/20 | Sitemap, robots, canonicals, 301 alias middleware, SSG — strong |
| Schema markup | 12/20 | Wide coverage BUT self-serving sitewide AggregateRating = compliance risk |
| Content depth | 11/20 | Programmatic pages live with variant rotation; thin on unique data points (landmarks, real reviews per route) |
| Page experience | 16/20 | 87.7 kB shared JS, SSG, sticky CTAs, mobile-first — excellent lab signals; field CWV unmeasured |
| E-E-A-T / trust | 6/10 | Review system built; missing /about, /safety, /our-drivers pages |
| Off-site (GBP, links, citations) | 4/10 | Biggest gap — no GBP optimization, citations, or backlink program evidenced |
| **Total** | **72/100** | Strong on-site engine; off-site + content uniqueness are the growth levers |

---

## 2. TOP CRITICAL ISSUES TABLE

| # | Issue | Location | Priority | Fix | Est. Impact |
|---|---|---|---|---|---|
| 1 | **Sitewide hardcoded AggregateRating** (`SITE_REVIEW_STATS`) injected into Product schema on ~400 pages. Google treats identical self-serving ratings across many products as schema spam → rich-result loss or manual action risk | `src/lib/seo/schema.js` (`siteAggregateRating()` used in 8 builders) | **CRITICAL** | Only emit `aggregateRating` where the item has real approved reviews (review system already stores `reviewCount` + `rating` per cab/driver). Remove from city/route/service Product schema until per-page review data exists | Protects all existing rich results; prevents penalty |
| 2 | No Google Business Profile optimization | Off-site | **CRITICAL** | Claim GBP for registered address; complete every field; category = Taxi service; weekly posts (Phase 6) | Map pack = 40%+ of taxi-intent clicks in India |
| 3 | Reverse-route duplication risk (A→B and B→A pages with near-identical content from `buildExpandedRoutes`) | `src/lib/seo/routes.js` | **HIGH** | Keep both directions ONLY where each has demand; differentiate content (pickup landmarks differ by direction); otherwise canonical B→A → A→B | Consolidates ranking signals on 97 route pages |
| 4 | Single monolithic sitemap (~900 URLs, will not scale to programmatic expansion) | `src/app/sitemap.js` | HIGH | Split into segmented sitemaps: `/sitemap/cities.xml`, `/routes.xml`, `/services.xml`, `/catalog.xml`, `/blog.xml` via Next.js `generateSitemaps` | Faster discovery, per-type indexation monitoring in GSC |
| 5 | Route pages lack the 5 unique data points (landmarks, toll info, route-specific reviews) | `RouteLandingPage.js` | HIGH | Add per-route landmark/toll/highway data to route CMS model; surface verified reviews filtered by route | Moves pages from "templated" to "genuinely useful" — the #1 programmatic ranking factor |
| 6 | Blog has 1 post — zero topical authority velocity | `/blogs` | HIGH | 2 posts/month minimum from content calendar (Section 7) | Informational keywords feed commercial pages via internal links |
| 7 | Missing E-E-A-T pages: /about-us, /our-drivers, /safety, /partners, /careers | App routes | HIGH | Create 5 static pages (templates in Phase 5) | Trust signals for both users and quality raters |
| 8 | No field CWV measurement | Infrastructure | MEDIUM | Verify GSC CWV report + CrUX; add GA4 web-vitals events | Detects real-device regressions lab tests miss |
| 9 | `/holidays?category=pilgrimage` query-string URL in sitemap | `sitemap.js` L55 | MEDIUM | Create clean path `/holidays/pilgrimage` or drop from sitemap | Query URLs dilute crawl; minor |
| 10 | No "Last updated" date on fare/pricing pages | Route/service templates | MEDIUM | Add visible `Last updated: {date}` + `dateModified` in schema | Freshness signal for fare queries |
| 11 | No speakable schema or Quick Answer blocks | Route/city templates | MEDIUM | Add 40–50-word direct answer paragraph at top + speakable schema | Voice + AI Overview citations |
| 12 | GA4 conversion events not confirmed (call_click, whatsapp_click, booking_initiated) | Analytics | MEDIUM | GTM container with click triggers on `tel:`, `wa.me`, booking CTAs | Cannot optimize what isn't measured |
| 13 | No hub interlinking from route pages back to city hubs with descriptive anchors | `RouteLandingPage.js` | MEDIUM | Add "More cabs from {CityA}" block linking city hub + 5 sibling routes | PageRank flow to hubs |
| 14 | Wikidata/Knowledge panel entity absent | Off-site | LOW | Create Wikidata item once press mentions exist | AI search entity grounding |
| 15 | Hreflang absent (acceptable — single language en-IN) | — | LOW | Only revisit if Tamil pages launch | — |

---

## 3. QUICK WINS (< 2 weeks)

- [ ] **Fix AggregateRating compliance** (Issue #1) — 1 day of code, protects everything
- [ ] Wire real per-cab/per-driver `aggregateRating` from the verified review system into detail page Product schema
- [ ] Claim + fully complete GBP (services, areas served, photos, booking link, WhatsApp)
- [ ] Add GTM + GA4 events: `call_click`, `whatsapp_click`, `booking_initiated`, `booking_completed`
- [ ] Add "Last updated" dates to all route/service fare tables
- [ ] Create /about-us and /safety pages (highest E-E-A-T value per hour)
- [ ] Submit segmented sitemaps; annotate baseline metrics in GSC
- [ ] Build 10 NAP citations: JustDial, Sulekha, IndiaMART, Bing Places, Apple Maps, HERE, TripAdvisor, Yellow Pages India, TradeIndia, Justdial Tamil
- [ ] Add Quick Answer paragraph to top 10 route pages ("Chennai to Bangalore cab costs ₹X–₹Y for a sedan, 350 km, ~6.5 hours via NH48.")
- [ ] Turn on review-request WhatsApp message post-trip (review system backend already supports it)

---

## 4. KEYWORD MASTER TABLE (200+ keywords)

**Legend:** Vol = estimated monthly India searches (directional; validate in GSC/keyword tool). KD = difficulty. T1 = highest revenue priority.

### Cluster A — Commercial core (national/generic modifiers, target with brand + Chennai-first pages)

| Keyword | Intent | Vol | KD | Target page | Tier |
|---|---|---|---|---|---|
| cab booking | Transactional | 90k | High | Homepage | T2 |
| taxi booking | Transactional | 60k | High | Homepage | T2 |
| book taxi online | Transactional | 12k | High | Homepage | T2 |
| online cab booking | Transactional | 25k | High | Homepage | T2 |
| cab service near me | Local | 40k | Med | GBP + city hubs | T1 |
| taxi near me | Local | 110k | Med | GBP | T1 |
| one way taxi | Commercial | 22k | Med | /routes hub | T1 |
| one way cab | Commercial | 30k | Med | /routes hub | T1 |
| outstation cab | Commercial | 35k | High | /services/outstation-cab | T1 |
| outstation taxi | Commercial | 18k | High | /services/outstation-cab | T1 |
| round trip taxi | Commercial | 5k | Med | /services/outstation-cab | T2 |
| airport taxi | Commercial | 45k | High | /services/airport-taxi | T1 |
| airport cab booking | Transactional | 15k | Med | /services/airport-taxi | T1 |
| corporate cab service | Commercial | 4k | Low | NEW /services/corporate-cab | T2 |
| intercity cab | Commercial | 8k | Med | /routes hub | T2 |
| cab with driver | Commercial | 14k | Med | /drivers | T1 |
| acting driver | Commercial | 9k | **Low** | /drivers + /acting-driver/* | **T1** |
| hire driver for my car | Commercial | 6k | **Low** | /drivers | **T1** |
| call driver | Commercial | 12k | Low | /acting-driver/* | T1 |
| chauffeur service india | Commercial | 3k | Med | /drivers | T2 |

### Cluster B — Vehicle intent

| Keyword | Intent | Vol | KD | Target page | Tier |
|---|---|---|---|---|---|
| innova crysta taxi | Commercial | 12k | Med | NEW /vehicles/innova-crysta | T1 |
| innova taxi booking | Transactional | 8k | Med | /vehicles/innova-crysta | T1 |
| ertiga taxi | Commercial | 4k | Low | NEW /vehicles/ertiga | T1 |
| sedan taxi | Commercial | 3k | Low | NEW /vehicles/sedan | T2 |
| suv taxi booking | Commercial | 2.5k | Low | NEW /vehicles/suv | T2 |
| tempo traveller rental | Commercial | 27k | Med | NEW /vehicles/tempo-traveller | **T1** |
| tempo traveller hire | Commercial | 14k | Med | /vehicles/tempo-traveller | T1 |
| 12 seater tempo traveller | Commercial | 9k | Low | /vehicles/tempo-traveller | T1 |
| luxury car rental | Commercial | 18k | High | NEW /vehicles/luxury | T3 |
| fortuner taxi | Commercial | 2k | Low | /vehicles/luxury | T3 |
| mini bus hire | Commercial | 6k | Med | NEW /vehicles/mini-bus | T2 |
| dzire taxi | Commercial | 2k | Low | /vehicles/sedan | T2 |
| etios taxi | Commercial | 1.5k | Low | /vehicles/sedan | T3 |
| innova 7 seater taxi | Commercial | 3k | Low | /vehicles/innova-crysta | T1 |

### Cluster C — City × service (repeat per 25 cities; Chennai shown, ~120 keyword slots across cities)

| Keyword pattern | Intent | Vol (Chennai) | KD | Target page | Tier |
|---|---|---|---|---|---|
| cab service in chennai | Commercial | 9k | Med | /cab-booking/chennai | T1 |
| taxi service chennai | Commercial | 7k | Med | /cab-booking/chennai | T1 |
| chennai airport taxi | Commercial | 6k | Med | /services/airport-taxi/chennai | T1 |
| chennai airport cab | Commercial | 4k | Med | /services/airport-taxi/chennai | T1 |
| car rental chennai | Commercial | 15k | High | /services/car-rental/chennai | T1 |
| cab rental chennai | Commercial | 3k | Med | /services/cab-rental/chennai | T1 |
| outstation cab chennai | Commercial | 4k | Med | /services/outstation-cab/chennai | T1 |
| driver service chennai | Commercial | 2.5k | **Low** | /acting-driver/chennai | **T1** |
| acting driver chennai | Commercial | 2k | **Low** | /acting-driver/chennai | **T1** |
| hourly cab chennai | Commercial | 1k | Low | /services/hourly-rental/chennai | T2 |
| cheap taxi chennai | Problem | 1.5k | Low | /cab-booking/chennai (FAQ) | T2 |
| best cab service chennai | Problem | 2k | Med | /cab-booking/chennai + reviews | T1 |
| 24 hour taxi chennai | Problem | 800 | Low | /cab-booking/chennai (FAQ) | T2 |
| wedding car rental chennai | Seasonal | 2.5k | Low | NEW /services/wedding-car/chennai | T1 |
| *(Repeat all 14 patterns × Bengaluru, Hyderabad, Coimbatore, Madurai, Trichy, Salem, Pondicherry, Tirupati, Vellore…)* | | | | | |

### Cluster D — Route intent (97 live routes; top demand shown)

| Keyword | Intent | Vol | KD | Target page | Tier |
|---|---|---|---|---|---|
| chennai to bangalore cab | Commercial | 8k | Med | /routes/chennai-to-bangalore-cab | T1 |
| chennai to bangalore taxi fare | Informational | 3k | Low | same page (fare table) | T1 |
| chennai to tirupati cab | Commercial | 6k | Med | /routes/chennai-to-tirupati-cab | **T1** |
| chennai to tirupati taxi package | Commercial | 2k | Low | same + package section | T1 |
| chennai to pondicherry cab | Commercial | 4k | Low | /routes/chennai-to-pondicherry-cab | T1 |
| chennai to vellore taxi | Commercial | 1.5k | Low | /routes/chennai-to-vellore-cab | T2 |
| bangalore to chennai cab | Commercial | 7k | Med | /routes/bengaluru-to-chennai-cab | T1 |
| coimbatore to ooty taxi | Commercial | 3k | Low | /routes/coimbatore-to-ooty-cab | T1 |
| madurai to rameshwaram cab | Commercial | 2k | Low | route page | T1 |
| chennai to mahabalipuram cab | Commercial | 1.5k | Low | route page | T2 |
| trichy to thanjavur taxi | Commercial | 900 | Low | route page | T2 |
| salem to yercaud cab | Commercial | 700 | Low | route page | T2 |
| hyderabad to srisailam cab | Commercial | 2k | Low | route page | T2 |
| chennai to bangalore one way cab | Commercial | 2.5k | Low | route page (one-way block) | T1 |
| chennai to tirupati one day trip by cab | Commercial | 1.8k | Low | route page + FAQ | T1 |
| *(+82 more live route slugs — every one targets `{from} to {to} cab/taxi/fare` triple)* | | | | | |

### Cluster E — Vehicle × route / vehicle × city combinations (programmatic expansion)

| Keyword | Intent | Vol | KD | Target page | Tier |
|---|---|---|---|---|---|
| innova taxi chennai to bangalore | Commercial | 800 | Low | NEW combo page | T1 |
| tempo traveller chennai to tirupati | Commercial | 1.2k | Low | NEW combo page | **T1** |
| innova taxi in chennai | Commercial | 1.5k | Low | NEW /vehicles/innova-crysta/chennai | T1 |
| tempo traveller rental chennai | Commercial | 4k | Med | /vehicles/tempo-traveller/chennai | T1 |
| tempo traveller coimbatore | Commercial | 2k | Low | combo page | T1 |
| innova rental bangalore | Commercial | 2.5k | Med | combo page | T2 |
| 17 seater tempo traveller chennai | Commercial | 600 | Low | combo page | T2 |
| sedan cab chennai airport | Commercial | 400 | Low | airport-taxi page variant | T2 |

### Cluster F — Informational (blog + FAQ targets)

| Keyword | Intent | Vol | KD | Target | Tier |
|---|---|---|---|---|---|
| taxi fare from chennai to bangalore | Informational | 2.5k | Low | Route page Quick Answer | T1 |
| chennai to tirupati taxi fare | Informational | 2k | Low | Route page | T1 |
| outstation cab rates per km | Informational | 3k | Low | Blog + fare index page | T1 |
| taxi fare calculator | Informational | 8k | Med | NEW /fare-calculator tool | T1 |
| how to book outstation taxi | Informational | 600 | Low | Blog | T2 |
| chennai to bangalore by car time | Informational | 4k | Low | Route page Quick Answer | T1 |
| is cab cheaper than train chennai to bangalore | Informational | 300 | Low | Route "Compare with" block | T2 |
| best time to travel chennai to tirupati | Informational | 500 | Low | Route page FAQ | T2 |
| driver charges per day | Informational | 2k | **Low** | /drivers + blog | **T1** |
| acting driver charges in chennai | Informational | 800 | **Low** | /acting-driver/chennai FAQ | **T1** |
| toll charges chennai to bangalore | Informational | 1.5k | Low | Route page toll table | T1 |
| one way cab vs round trip | Informational | 400 | Low | Blog | T3 |

### Cluster G — Seasonal / event

| Keyword | Intent | Vol (peak) | KD | Target | Tier |
|---|---|---|---|---|---|
| wedding car rental chennai | Commercial | 2.5k | Low | /services/wedding-car/chennai | T1 |
| wedding car rental madurai | Commercial | 900 | Low | wedding-car × city | T1 |
| decorated car for wedding | Commercial | 1.5k | Low | wedding-car pages | T2 |
| pongal taxi booking | Seasonal | 1k (Jan) | Low | /pongal-taxi-booking evergreen | T2 |
| diwali cab booking | Seasonal | 800 (Oct) | Low | seasonal page | T2 |
| new year cab booking chennai | Seasonal | 600 (Dec) | Low | seasonal page | T2 |
| sabarimala taxi package | Seasonal | 3k (Nov–Jan) | Low | NEW pilgrimage route page | **T1** |
| tirupati darshan package with cab | Seasonal | 2k | Low | tirupati packages | T1 |

### Cluster H — Long-tail gems (near-zero competition)

| Keyword | Intent | Vol | KD | Target | Tier |
|---|---|---|---|---|---|
| one way taxi chennai to bangalore with toll included | Commercial | 200 | Low | Route FAQ | T1 |
| ac cab chennai to pondicherry with driver | Commercial | 150 | Low | Route page | T2 |
| tempo traveller for family trip chennai | Commercial | 400 | Low | Vehicle × city | T1 |
| cab for tirupati from chennai 2 days | Commercial | 250 | Low | Route package block | T1 |
| night driver for car chennai | Commercial | 300 | **Low** | /acting-driver/chennai | **T1** |
| monthly driver service chennai | Commercial | 350 | **Low** | /acting-driver/chennai | **T1** |
| airport pickup chennai t2 terminal | Commercial | 200 | Low | Airport taxi FAQ | T2 |
| cab from chennai airport to velachery | Commercial | 150 | Low | Airport landmark section | T2 |

**Total keyword universe: ~210 mapped above (Cluster C patterns × 25 cities alone = 350 slots). Priority: every Tier-1 Low-KD keyword first — the acting-driver cluster is Cabzii's unfair advantage (no national competitor targets it).**

---

## 5. PROGRAMMATIC PAGE ARCHITECTURE

### Current (live)
```
cabzii.in/
├── /cab-booking/{city}          ← 25 city hubs (cab)
├── /acting-driver/{city}        ← 25 city hubs (driver) — UNIQUE vertical
├── /routes/{a}-to-{b}-cab       ← 97 route pages
├── /services/{service}/{city}   ← 275 service×city pages (11 services)
├── /cabs/{id}, /drivers/{id}    ← catalog detail (Product schema)
└── /blog/{slug}                 ← 1 post
```

### Target architecture (additions in CAPS)
```
cabzii.in/
├── /cab-booking/{city}                       ← promote to true CITY HUB (links all below)
├── /routes/{a}-to-{b}-cab                    ← expand 97 → 300 (demand-validated only)
├── /VEHICLES/{vehicle}                       ← 8 vehicle category pages
├── /VEHICLES/{vehicle}/{city}                ← vehicle × city (8 × 25 = 200, launch top 50)
├── /ROUTES/{a}-to-{b}-{vehicle}              ← vehicle × route (top 30 only — strict demand gate)
├── /services/{service}/{city}                ← add wedding-car, corporate-cab services
├── /SEASONAL: /pongal-taxi-booking, /wedding-car-rental-{city}
└── /blog/{slug}                              ← 2/month
```

### Deduplication rules
1. **Reverse routes:** index A→B and B→A only when both have GSC impressions or keyword-tool demand; otherwise `rel=canonical` from the weaker direction to the stronger. Differentiate indexed pairs with direction-specific pickup landmarks.
2. **Demand gate:** a new programmatic page ships `noindex` until it has ≥3 unique data points + demand evidence; flip to index via CMS flag (SeoRoute/SeoService models already support `published`).
3. **Vehicle × route:** create ONLY where the combo keyword has volume (≈30 pages, not 8×300=2,400). Thin combos canonical → the route page.
4. **Crawl control:** segmented sitemaps per template (`generateSitemaps`); keep `<priority>` scheme already in `sitemap.js`.

### Content differentiation requirements (every programmatic page)
| Data point | Source |
|---|---|
| Real distance + duration | Already in route data (`distance`, `duration`) |
| Fare breakdown (base + /km + toll + GST) | Extend SeoRoute CMS model with `tollEstimate`, `perKmRate` |
| 3+ pickup landmarks (direction-specific) | New CMS field `pickupLandmarks[]` |
| 3+ drop landmarks | New CMS field `dropLandmarks[]` |
| Route-specific FAQs (≥5, unique) | Variant rotation already implemented; extend with landmark mentions |
| ≥1 verified review mentioning route/city | Review system: filter approved reviews by `serviceUsed` route match |

---

## 6. CONTENT TEMPLATES

### City hub (upgrade `/cab-booking/{city}`)
```
H1: {City} Taxi Service — Book Cabs Online at Fixed Fares
[Quick Answer: "Book verified cabs in {City} from ₹X. Airport, outstation
 and hourly packages with upfront fares. Call/WhatsApp 99441 97416."]
→ Booking widget (live)
→ Services grid: airport / outstation / hourly / acting driver / wedding (links)
→ Top 6 routes from {City} with starting fares (links)
→ Available vehicles w/ fares (links to /vehicles/*)
→ Why Cabzii in {City}: verified drivers, upfront fare, OTP booking
→ Verified reviews from {City} customers (review system, city-filtered)
→ Pickup points: airport terminal, central railway station, bus stand (Maps embed)
→ 6–8 city-specific FAQs (FAQPage schema — live)
→ Nearby cities strip (live)
Schema: LocalBusiness + FAQPage + BreadcrumbList (live) — REMOVE sitewide AggregateRating until real city reviews exist
```

### Route page (upgrade `/routes/{slug}`)
```
H1: {A} to {B} Cab — ₹{fare} Onwards | One Way & Round Trip
[Quick Answer: "{A} to {B} is {distance} km, about {duration} by road via {highway}.
 One-way sedan cab from ₹{fare} including driver; toll ≈ ₹{toll} extra."]
→ Fare table: Sedan / Ertiga / Innova / Tempo (live) + "Last updated {date}"
→ Pickup landmarks in {A} (3–5, direction-specific)
→ Drop landmarks in {B}
→ Reverse route link + intermediate stops note
→ Compare: train ({time}, ₹{fare}) vs bus vs cab — featured-snippet table
→ Verified reviews mentioning this route
→ 5–7 route FAQs (live, variant-rotated)
→ Related routes strip (live)
Schema: Product+Offers (live), FAQPage (live), BreadcrumbList (live), Review (when real)
```

Vehicle, service×city, and seasonal templates follow the same pattern: Quick Answer → fare table → unique local data → verified reviews → FAQs → interlinks.

### Content quality rules (enforced)
- No two pages share an intro — variant rotation already deterministic by slug hash; extend variants from 4 → 8
- FAQs ≤ 50 words per answer
- Fares from CMS (live) — never hardcode in copy
- Local language: highway names (NH48, ECR, GST Road), toll plaza names, terminal names
- Visible "Last updated" on all fare content

---

## 7. CONTENT CALENDAR (Months 1–3)

| Week | Asset | Target keywords |
|---|---|---|
| M1-W1 | /about-us + /safety pages | brand + E-E-A-T |
| M1-W2 | Blog: "Chennai to Tirupati by cab: fares, timing, darshan tips (2026)" | chennai to tirupati cab/fare |
| M1-W3 | /our-drivers page (verification process) | trust |
| M1-W4 | Blog: "Outstation cab rates per km in Tamil Nadu — full breakdown" | outstation cab rates |
| M2-W1 | Vehicle pages: Innova Crysta, Tempo Traveller | innova taxi, tempo traveller rental |
| M2-W2 | Blog: "Chennai airport taxi guide: T1–T4 pickup explained" | chennai airport taxi |
| M2-W3 | Vehicle pages: Sedan, Ertiga, SUV, Mini Bus | vehicle cluster |
| M2-W4 | Blog: "Acting driver vs taxi: which is cheaper?" | acting driver cluster |
| M3-W1 | Wedding car service pages (top 5 cities) | wedding car rental {city} |
| M3-W2 | Blog: "Top 7 weekend road trips from Chennai with cab fares" | link bait + route links |
| M3-W3 | Top 10 vehicle×city combo pages | tempo traveller chennai etc. |
| M3-W4 | Fare calculator tool page | taxi fare calculator |

---

## 8. BACKLINK ACQUISITION (50 targets)

| Tier | Target type | Examples (approach) |
|---|---|---|
| 1 | Travel media | Outlook Traveller, Condé Nast Traveller India, Tripoto (data pitch: "South India cab fare index") |
| 1 | News | The Hindu MetroPlus, Times of India Chennai, DT Next (local business story) |
| 2 | Hotels/resorts ×20 | ECR resorts, Mahabalipuram hotels, Tirupati lodges — "recommended transfer partner" page swap |
| 2 | Wedding ×8 | WedMeGood, WeddingWire India vendors, local planners — wedding car listings |
| 2 | Travel blogs ×10 | South India travel bloggers — guest post "Best road trips from {city}" |
| 3 | Directories ×10 | JustDial, Sulekha, IndiaMART, TradeIndia, Yellow Pages, city directories, chamber of commerce |

**Hotel outreach template** (use as-is):
> Subject: Airport transfer partner for {Hotel} guests
> Hi {Name}, we're Cabzii (cabzii.in), a verified taxi service in {City}. We'd like to be your recommended transfer partner — no cost, just a genuine recommendation your guests can use for airport pickups and outstation trips, 24/7. Could we send a one-page partner sheet?

**Link bait assets:** South India Taxi Fare Index (quarterly), Route Travel-Time Dataset (cab vs train vs bus), toll-cost tables.

---

## 9. LOCAL SEO MONTHLY PLAN

- [ ] **Week 1:** Respond to every review (HEARD model for negatives); 1 GBP post (offer/route)
- [ ] **Week 2:** Add/refresh 5 citations; check NAP consistency
- [ ] **Week 3:** 1 location blog post; add 5 photos to GBP
- [ ] **Week 4:** GBP Q&A audit; spam-listing check; report stats

GBP setup: category "Taxi service" + secondary "Chauffeur service"; every service listed; service areas = all 25 cities; booking link; WhatsApp message button; pre-seeded Q&A (fares, advance booking, airport pickup, payment modes).

---

## 10. TECHNICAL FIX CHECKLIST (ordered)

- [ ] 1. Replace `siteAggregateRating()` in Product/LocalBusiness schema with real per-item review data; omit when zero reviews (CRITICAL)
- [ ] 2. Segment sitemaps with `generateSitemaps` (cities/routes/services/catalog/blog)
- [ ] 3. Reverse-route canonical audit on 97 routes (keep/canonicalize decision table)
- [ ] 4. Add `dateModified` + visible last-updated to fare templates
- [ ] 5. GTM + GA4 conversion events
- [ ] 6. Replace `/holidays?category=` sitemap entry with clean path
- [ ] 7. Add Quick Answer block + speakable schema to route/city templates
- [ ] 8. Extend SeoRoute CMS model: landmarks, toll, per-km rate fields
- [ ] 9. Route-filtered verified reviews on route pages
- [ ] 10. Verify field CWV in GSC; fix any mobile INP offenders

---

## 11. CRO CHECKLIST

- [x] Sticky mobile Call/WhatsApp/Book bar (live)
- [x] Desktop floating FABs (live)
- [x] Above-fold trust row + tap-to-call in hero (live)
- [x] Fare shown before contact details (live)
- [x] Verified review system w/ hidden-when-zero ratings (live)
- [ ] Fare calculator widget on homepage + route pages
- [ ] Social proof counter from real data ("{n} trips this month" — bookings collection)
- [ ] "No hidden charges" guarantee badge near every fare table
- [ ] GST-registered badge in footer
- [ ] Exit-intent WhatsApp offer (mobile scroll-up trigger)
- [ ] A/B tests: (1) hero CTA copy "Book now" vs "Get instant fare", (2) fare display range vs exact, (3) reviews above vs below widget

---

## 12. REVIEW FUNNEL WORKFLOW

```
Trip finished (booking.status = "finished")
   ↓ T+30 min — WhatsApp: "Hope your ride was comfortable! Rate your trip: {link}"
   ↓ Customer rates in /my-bookings (LIVE — verified, one per booking)
   ├── 4–5★ → after admin approval, follow-up: "Thanks! Mind sharing it on Google? {GBP link}"
   └── 1–3★ → internal resolution flow; respond within 24h; never argue publicly
   ↓ No action? One reminder at T+24h. Stop.
Admin approves → rating auto-recalculates on cab/driver (LIVE)
Velocity goals: M1–3: 5+/city/mo · M4–6: 10+ · M7+: 15+ Google reviews
```

---

## 13. ANALYTICS SETUP

1. GSC: verify domain property; submit segmented sitemaps; baseline export (queries, pages, CTR)
2. GA4: events `booking_initiated`, `booking_completed`, `call_click`, `whatsapp_click`, `fare_viewed`; mark all as conversions
3. GTM: click triggers on `a[href^="tel:"]`, `a[href*="wa.me"]`, booking CTAs — no code changes needed
4. Rank tracking: SerpRobot/SEMrush — track Tier-1 keywords per city, weekly
5. Weekly: impressions/clicks by page type · Monthly: indexed vs submitted, CWV, backlinks, reviews/city, conversion rate

---

## 14. EXPECTED TRAJECTORY

| Milestone | Organic sessions/mo | Page-1 keywords | Notes |
|---|---|---|---|
| Baseline (M1) | Record in GSC | Record | Schema fix + GBP live |
| Month 3 | 1.5–2× baseline | 10–20 (long-tail, acting-driver cluster first) | Programmatic enrichment indexed |
| Month 6 | 3–5× | 40–60 incl. 5+ route money terms | Map pack entries in 3+ cities |
| Month 12 | 8–12× | 100+ | Top-3 map pack in primary cities; route pages dominant in TN |

Acting-driver cluster will rank fastest (low competition + dedicated city pages already live). Route money terms (chennai-bangalore class) take 6–9 months and depend on backlinks + reviews.

---

## 15. PRIORITY IMPLEMENTATION CHECKLIST

**Week 1**
- [ ] AggregateRating compliance fix (code)
- [ ] GBP claimed + completed
- [ ] GTM/GA4 events live
- [ ] Baseline metrics recorded

**Week 2**
- [ ] /about-us, /safety, /our-drivers pages
- [ ] Segmented sitemaps
- [ ] 10 citations built
- [ ] Review WhatsApp follow-up enabled

**Month 1**
- [ ] Quick Answer blocks on top 20 route pages
- [ ] Last-updated dates on fare tables
- [ ] 2 blog posts
- [ ] First 5 hotel partnership emails sent

**Month 2**
- [ ] 8 vehicle category pages
- [ ] Route CMS enriched (landmarks/toll) for top 30 routes
- [ ] Wedding-car service pages (5 cities)
- [ ] Reverse-route canonical decisions executed
- [ ] 2 blog posts + first guest post placed
