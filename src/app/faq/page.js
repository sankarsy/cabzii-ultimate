import MarketingPageShell, { marketingMetadata } from "../../components/marketing/MarketingPageShell";
import { HOME_PAGE_FAQS } from "../../lib/seo/content";
import { faqJsonLd } from "../../lib/seo";

export const metadata = marketingMetadata({
  title: "FAQ — Cabs, Acting Driver & Bus Tickets | Cabzii",
  description:
    "Answers about cab booking on cabzii.in — fares, airport pickup, outstation trips, acting drivers, bus tickets, payment and cancellation.",
  path: "/faq",
  keywords: ["cab booking faq", "acting driver faq", "bus booking faq", "cabzii help"]
});

export default function FaqPage() {
  return (
    <MarketingPageShell
      title="Frequently asked questions"
      subtitle="Cabs, airport taxi, outstation, acting drivers and bus tickets on Cabzii — fares shown before you confirm."
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
