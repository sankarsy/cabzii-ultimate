import { ORG_ADDRESS, ORG_EMAIL, ORG_PHONE, SITE_NAME, SITE_URL } from "./constants";

/** NAP — must match Google Business Profile exactly. */
export const LOCAL_NAP = {
  name: SITE_NAME,
  legalName: "Cabzii",
  phone: ORG_PHONE,
  phoneDisplay: "+91 99441 97416",
  email: ORG_EMAIL,
  website: SITE_URL,
  address: {
    street: ORG_ADDRESS.streetAddress,
    locality: ORG_ADDRESS.addressLocality,
    region: ORG_ADDRESS.addressRegion,
    postalCode: ORG_ADDRESS.postalCode,
    country: "India"
  },
  formatted: "Maduravoyal, Chennai, Tamil Nadu 600095, India",
  hours: "Open 24 hours",
  categories: ["Taxi service", "Airport shuttle service", "Car rental agency", "Travel agency"],
  serviceArea: [
    "Chennai",
    "Bengaluru",
    "Coimbatore",
    "Madurai",
    "Trichy",
    "Salem",
    "Vellore",
    "Pondicherry",
    "Tirupati",
    "Hosur"
  ]
};

/** Priority citation directories for India cab/travel. */
export const CITATION_TARGETS = [
  { name: "Google Business Profile", url: "https://business.google.com", priority: "critical", action: "Claim & verify Maduravoyal listing" },
  { name: "Justdial", url: "https://www.justdial.com", priority: "critical", action: "List under Taxi Services Chennai — match NAP" },
  { name: "Sulekha", url: "https://www.sulekha.com", priority: "high", action: "Cab booking + airport taxi categories" },
  { name: "IndiaMART", url: "https://www.indiamart.com", priority: "high", action: "B2B + corporate cab hire listing" },
  { name: "Bing Places", url: "https://www.bingplaces.com", priority: "medium", action: "Mirror GBP data" },
  { name: "Apple Business Connect", url: "https://businessconnect.apple.com", priority: "medium", action: "Maps visibility for iOS users" },
  { name: "Facebook Business", url: "https://www.facebook.com/business", priority: "medium", action: "Local business page + reviews" },
  { name: "TripAdvisor", url: "https://www.tripadvisor.in", priority: "medium", action: "Airport transfer & city taxi listing" },
  { name: "Practo-style local — AskLaila / Locanto", url: "https://www.locanto.in", priority: "low", action: "Chennai taxi classified" }
];

/** Review request SMS/WhatsApp templates. */
export const REVIEW_TEMPLATES = {
  postTripSms:
    "Hi {name}, thanks for riding with Cabzii! If your trip went well, please leave a quick review: {reviewLink} — it helps other riders find us. 🙏 Team Cabzii",
  postTripWhatsapp:
    "Hi {name}! Thanks for booking your {route} cab with Cabzii.\n\nIf you're happy with the driver & fare, could you leave us a 5⭐ review?\n👉 {reviewLink}\n\nYour feedback helps us serve more riders in Chennai. — Team Cabzii",
  gbpDirect:
    "Hi {name}, hope your Cabzii trip to {destination} was smooth! We'd love your feedback on Google — takes 30 seconds: {reviewLink}",
  emailSubject: "How was your Cabzii ride to {destination}?",
  emailBody:
    "Hi {name},\n\nThank you for booking with Cabzii for your recent trip ({route}).\n\nIf the driver and fare met your expectations, please share a quick review:\n{reviewLink}\n\nReviews help us improve and help other travellers book with confidence.\n\n— Cabzii Support\n{phone}"
};

/** First 10 reviews playbook. */
export const REVIEW_PLAYBOOK_10 = [
  "Ask every completed booking via WhatsApp within 2 hours of drop (highest response rate).",
  "Offer ₹50 off next ride for verified Google review (honour manually via support).",
  "Target repeat corporate clients — 1 review each from 3 companies = high-trust B2B signal.",
  "Ask airport pickup riders while still in cab (QR to Google review link on headrest card).",
  "Personal request from founder for first 5 reviews — mention specific route taken.",
  "Family/friends who actually used Cabzii for real trips — no fake reviews.",
  "Pilgrimage route riders (Tirupati) — emotional peak = higher review willingness.",
  "Follow up next morning for overnight outstation drops.",
  "Add review link to booking confirmation SMS.",
  "Pin Google review link in WhatsApp Business quick replies."
];

/** Scale to 50 reviews. */
export const REVIEW_PLAYBOOK_50 = [
  ...REVIEW_PLAYBOOK_10,
  "Automate post-trip WhatsApp via backend booking finish webhook.",
  "Monthly review campaign — top 20 riders by trip count.",
  "Hotel concierge partnerships — leave Cabzii cards with QR at airport hotels.",
  "Wedding planner referrals — 1 review per event from bride/groom family.",
  "Hospital discharge desk flyers (Vellore/Chennai hospital corridor).",
  "Driver incentive: ₹100 bonus per genuine Google review mentioning driver name.",
  "Respond to every review within 24h on GBP.",
  "Add testimonials page CTA → Google review for riders who submitted on-site.",
  "Festival season (Pongal/Diwali) — 2x review requests on outstation routes.",
  "Track review velocity in admin — goal 5 reviews/week until 50."
];
