# Chennai & Tamil Nadu SEO focus

Cabzii HQ and primary operations are in **Chennai**. Service is available across India, but organic growth priority is:

1. **Chennai bookings** (airport, local, outstation, one-way, acting driver)
2. **Tamil Nadu cities** (Coimbatore, Madurai, Trichy, Salem, Vellore, …)
3. **Nearby demand** (Pondicherry, Tirupati, Bengaluru corridors)
4. **Rest of India** later (keep pages lean; do not expand thin national doorways)

## What the GSC drop on `/cab-booking/chennai` means

Your report (20–26 Jul vs 13–19 Jul):

- Impressions: **190 → 34** (−82%)
- Clicks: **0 → 0**
- Avg position: **54.9 → 41.1** (better)
- CTR: **0%**

Better average position with fewer impressions usually means Google is showing the page for a **smaller set of queries** (often dropping weak long-tail matches), not that the page “fell off” entirely. **Zero clicks** also trains Google that the snippet is not useful — titles/descriptions must improve CTR.

This is not a ranking guarantee after fixes. Expect recovery over **weeks**, not overnight.

## Code changes shipped for Chennai-first

- Shorter Chennai hub title/description (≤60 char title pattern)
- Clearer Chennai H1
- Removed spam H2 “Local SEO — …”
- Deduped bangalore/bengaluru twin routes; 301 `chennai-to-bengaluru-cab` → `chennai-to-bangalore-cab`
- Fixed driver-on-hire / chauffeur titles (no longer “Car Rental”)
- TN peer city links on hubs; TN-first internal link lists
- Homepage title/description oriented to Chennai & Tamil Nadu
- Sitemap priorities: Chennai > TN > focus corridors > rest of India
- CMS body no longer always stacks a full second template

## Manual tasks (required on live)

1. **Deploy** this frontend build to production (`cabzii.in`).
2. In **Admin → SEO city pages** for `cab-booking/chennai`: if CMS `seoTitle` / `seoDescription` / `body` still hold the old long title or spam sections, update or clear them so code defaults apply.
3. In GSC → inspect [https://cabzii.in/cab-booking/chennai](https://cabzii.in/cab-booking/chennai) → **Request indexing** after deploy.
4. Also inspect top Chennai services: airport-taxi, outstation-cab, one-way-cab, local-taxi.
5. Confirm **Google Business Profile** NAP matches Chennai HQ.
6. Track Performance filtered by page `/cab-booking/chennai` weekly (impressions + CTR). Aim for **CTR > 2%** before chasing more impressions.

## Content to write next (highest ROI)

1. Chennai airport pickup/drop guide (terminals, waiting, buffer time)
2. Chennai local 4hr / 8hr package explainer
3. Chennai → Pondicherry / Tirupati / Trichy / Salem route guides (unique facts)
4. Coimbatore + Madurai hub refresh (same depth as Chennai)
5. Real photos of Chennai fleet / airport pickup (feeds OG + trust)

## Do not

- Create hundreds of pan-India thin city pages
- Buy spam backlinks
- Fake urgency or fake ratings
- Keyword-stuff “Local SEO” style headings
