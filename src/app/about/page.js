import MarketingPageShell, { marketingMetadata } from "../../components/marketing/MarketingPageShell";
import { aboutPageJsonLd } from "../../lib/seo";

export const metadata = marketingMetadata({
  title: "About Cabzii — Cabs & Acting Driver in South India",
  description:
    "Cabzii is an UrbanWolf Technologies brand for chauffeur-driven cabs, airport taxi, outstation trips, acting drivers and bus tickets from Chennai across South India.",
  path: "/about",
  keywords: ["about cabzii", "urbanwolf technologies", "cab booking south india", "cabzii.in about"]
});

export default function AboutPage() {
  return (
    <MarketingPageShell
      title="About Cabzii"
      subtitle="Chauffeur-driven cabs, acting drivers and bus tickets from Chennai — fares shown before you confirm."
      path="/about"
      breadcrumbs={[{ name: "About", path: "/about" }]}
      jsonLdExtra={[aboutPageJsonLd()]}
    >
      <p>
        Cabzii (cabzii.in) is an UrbanWolf Technologies brand focused on South India — Chennai, Madurai, Tirupati, Trichy,
        Coimbatore, Vellore and connecting cities. Book airport taxis, outstation cabs, hourly local packages, one-way
        inter-city travel, professional acting drivers and bus tickets.
      </p>
      <h2>What we stand for</h2>
      <ul>
        <li>Fares shown before you pay</li>
        <li>WhatsApp and phone support for bookings</li>
        <li>OTP checkout and booking confirmation</li>
        <li>City, airport, route, bus and acting-driver pages that match live Cabzii services</li>
      </ul>
      <h2>Book in seconds</h2>
      <p>
        Search cabs online, call us directly, or message on WhatsApp — whichever is fastest for you. Most quotes are shared
        within minutes.
      </p>
    </MarketingPageShell>
  );
}
