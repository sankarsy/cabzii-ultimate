/**
 * Sample blogs only — testimonials are never faked. Empty catalog stays empty
 * until a real review is approved.
 */

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
      "12-seater, 13-seater or 18-seater? AC pushback or standard? Everything to know before booking a Tempo Traveller for your family function or office outing.",
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
