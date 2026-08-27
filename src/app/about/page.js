import MarketingPageShell, { marketingMetadata } from "../../components/marketing/MarketingPageShell";
import { aboutPageJsonLd } from "../../lib/seo";

export const metadata = marketingMetadata({
  title: "About Cabzii — Trusted Cab Booking Across India",
  description:
    "Cabzii is a cab booking platform for airport taxi, outstation, local packages and acting driver from Chennai and Tamil Nadu corridors.",
  path: "/about",
  keywords: ["about cabzii", "cab booking company India", "cabzii.in about"]
});

export default function AboutPage() {
  return (
    <MarketingPageShell
      title="About Cabzii"
      subtitle="Premium cab, taxi and acting driver booking — built for trust, transparent fares and instant support."
      path="/about"
      breadcrumbs={[{ name: "About", path: "/about" }]}
      jsonLdExtra={[aboutPageJsonLd()]}
    >
      <p>
        Cabzii (cabzii.in) is a cab booking platform focused on South India — Chennai, Bengaluru, Hyderabad, Coimbatore,
        Madurai and more. We help you book airport taxis, outstation cabs, hourly rentals, one-way inter-city travel and
        professional acting drivers.
      </p>
      <h2>What we stand for</h2>
      <ul>
        <li>Fares shown before you pay</li>
        <li>WhatsApp and phone support for bookings</li>
        <li>OTP checkout and booking confirmation</li>
        <li>City, airport, route and acting-driver pages that match real Cabzii services</li>
      </ul>
      <h2>Book in seconds</h2>
      <p>
        Search cabs online, call us directly, or message on WhatsApp — whichever is fastest for you. Most quotes are shared
        within minutes.
      </p>
    </MarketingPageShell>
  );
}
