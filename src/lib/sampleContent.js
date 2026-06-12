/**
 * Sample content shown only while the real catalog is empty.
 * As soon as admin-approved testimonials/blogs exist, these are not used.
 */

export const SAMPLE_TESTIMONIALS = [
  {
    id: "s1",
    name: "Ramesh Kumar",
    location: "Chennai",
    rating: 5,
    date: "May 2026",
    message:
      "Booked a Chennai to Pondicherry cab for a family weekend. Clean Ertiga, polite driver, and the fare matched the quote exactly. No last-minute surprises."
  },
  {
    id: "s2",
    name: "Priya Venkatesan",
    location: "Madurai",
    rating: 5,
    date: "May 2026",
    message:
      "Used the acting driver service for my own car for a Madurai–Rameswaram trip. Driver arrived 10 minutes early and drove very safely the whole way."
  },
  {
    id: "s3",
    name: "Arun Prasad",
    location: "Coimbatore",
    rating: 4,
    date: "April 2026",
    message:
      "Airport pickup at 4 AM went perfectly. WhatsApp confirmation within minutes of booking and the driver shared live location before arrival."
  },
  {
    id: "s4",
    name: "Deepa Lakshmi",
    location: "Bengaluru",
    rating: 5,
    date: "April 2026",
    message:
      "Took the Bengaluru to Ooty round trip in an Innova. Transparent per-km pricing, toll receipts shared, and the driver knew all the viewpoints."
  },
  {
    id: "s5",
    name: "Suresh Babu",
    location: "Trichy",
    rating: 5,
    date: "March 2026",
    message:
      "Wedding car booking for 3 days — spotless Innova Crysta with decoration support. The team coordinated directly with our event planner."
  },
  {
    id: "s6",
    name: "Kavitha Raj",
    location: "Hyderabad",
    rating: 4,
    date: "March 2026",
    message:
      "Tempo Traveller for our office team outing of 11 people. Comfortable, on time, and the per-day rate was cheaper than other operators we compared."
  }
];

export const SAMPLE_BLOGS = [
  {
    slug: "",
    title: "Chennai to Pondicherry by Cab: ECR Route Guide, Fare & Best Stops",
    excerpt:
      "Planning the classic ECR drive? Here is what a one-way cab costs in 2026, where to stop for breakfast, and how to time your trip to skip toll-queue rush.",
    category: "Route Guide",
    date: "June 2026",
    readMinutes: 6
  },
  {
    slug: "",
    title: "Acting Driver vs Self-Drive: Which Saves More on Outstation Trips?",
    excerpt:
      "We compare hiring a verified acting driver for your own car against self-driving and full cab rental — with real cost breakdowns for a 3-day hill trip.",
    category: "Travel Tips",
    date: "June 2026",
    readMinutes: 5
  },
  {
    slug: "",
    title: "Tempo Traveller Booking Guide: Seating, Rates & Group Trip Planning",
    excerpt:
      "12-seater or 17-seater? AC pushback or standard? Everything to know before booking a Tempo Traveller for your family function or office outing.",
    category: "Booking Guide",
    date: "May 2026",
    readMinutes: 7
  }
];

/** ~200 wpm reading estimate from any text fields available on a post. */
export function estimateReadMinutes(post) {
  if (post?.readMinutes) return post.readMinutes;
  const words = String(post?.content || post?.body || post?.excerpt || "").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}
