import MarketingPageShell, { marketingMetadata } from "../../components/marketing/MarketingPageShell";
import { aboutPageJsonLd } from "../../lib/seo";

export const metadata = marketingMetadata({
  title: "About Cabzii — Trusted Cab Booking Across India",
  description:
    "Cabzii connects riders with verified cab partners for airport transfers, outstation trips, local rentals and acting drivers across Chennai, Bengaluru and 20+ cities.",
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
        <li>Verified drivers and transparent pricing before you pay</li>
        <li>24×7 WhatsApp and phone support for every booking</li>
        <li>OTP-secured checkout and instant booking confirmation</li>
        <li>SEO-optimised city pages so you find the right service fast</li>
      </ul>
      <h2>Book in seconds</h2>
      <p>
        Search cabs online, call us directly, or message on WhatsApp — whichever is fastest for you. Most quotes are shared
        within minutes.
      </p>
    </MarketingPageShell>
  );
}
