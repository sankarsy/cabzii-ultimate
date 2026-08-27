import MarketingPageShell, { marketingMetadata } from "../../components/marketing/MarketingPageShell";
import { HOME_PAGE_FAQS } from "../../lib/seo/content";
import { faqJsonLd } from "../../lib/seo";

export const metadata = marketingMetadata({
  title: "FAQ — Cab Booking, Airport Taxi & Outstation Cabs | Cabzii",
  description: "Answers about cab booking on cabzii.in — fares, airport pickup, outstation trips, acting drivers, payment and cancellation.",
  path: "/faq",
  keywords: ["cab booking faq", "airport taxi faq", "cabzii help"]
});

export default function FaqPage() {
  return (
    <MarketingPageShell
      title="Frequently asked questions"
      subtitle="Everything you need to know about booking cabs, airport taxis and acting drivers on Cabzii."
      path="/faq"
      breadcrumbs={[{ name: "FAQ", path: "/faq" }]}
      faqs={HOME_PAGE_FAQS}
      jsonLdExtra={[faqJsonLd()]}
    >
      <p>
        Can&apos;t find your answer?{" "}
        <a href="/contact" className="font-semibold text-sky-700 hover:underline">
          Contact us
        </a>{" "}
        on WhatsApp or phone.
      </p>
    </MarketingPageShell>
  );
}
