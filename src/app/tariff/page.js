import Link from "next/link";
import MarketingPageShell, { marketingMetadata } from "../../components/marketing/MarketingPageShell";
import { TariffTerms } from "../../components/TariffTerms";
import { BusTariffTable, CarTariffTable, VanTariffTable } from "../../components/tariff/PublishedTariffTables";
import { BUS_TARIFF, CAR_TARIFF, TARIFF_FAQS, VAN_TARIFF } from "../../lib/publishedTariff";
import { faqFromPairs, productJsonLd } from "../../lib/seo";
import ChennaiClusterLinks from "../../components/seo/ChennaiClusterLinks";
import SeoPageView from "../../components/seo/SeoPageView";
import { SEO_REVALIDATE_SECONDS } from "../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;

export const metadata = marketingMetadata({
  title: "Cab Rental Tariff in Chennai | Car, Tempo Traveller & Mini Bus Rates | Cabzii",
  description:
    "Cabzii Chennai cab rental tariff 2026 — Swift Dzire from ₹1,200 (4 Hrs/40 Km), Innova Crysta from ₹2,200, Tempo Traveller from ₹3,000, mini bus from ₹8,500. Extra km, extra hour and driver batta listed.",
  path: "/tariff",
  keywords: [
    "cab rental tariff chennai",
    "tempo traveller rental chennai price",
    "innova crysta rental chennai",
    "swift dzire taxi rate chennai",
    "mini bus rental chennai",
    "outstation cab tariff chennai",
    "cabzii tariff"
  ]
});

export default function TariffPage() {
  const jsonLd = [
    faqFromPairs(TARIFF_FAQS),
    productJsonLd({
      name: "Cabzii Cab Rental Tariff — Chennai",
      description:
        "Published car, tempo traveller and mini bus rental tariff for Chennai. Local packages, extra km, extra hour, outstation minimum and driver batta.",
      urlPath: "/tariff",
      price: 1200,
      lowPrice: 1200,
      highPrice: 16500
    })
  ];

  return (
    <MarketingPageShell
      title="Cab rental tariff in Chennai"
      subtitle="Current Cabzii rates for cars, tempo travellers and mini buses. Fuel and driver included. Tolls, parking and standing AC extra."
      path="/tariff"
      breadcrumbs={[{ name: "Tariff", path: "/tariff" }]}
      faqs={TARIFF_FAQS}
      jsonLdExtra={jsonLd}
    >
      <SeoPageView pageType="tariff" city="chennai" />
      <p>
        Cabzii tariff is for <strong>chauffeur-driven</strong> cab, van and mini-bus hire in Chennai — not self-drive.
        Book with the published rate card. Compare packages, then{" "}
        <Link href="/cabs">search live cabs</Link> or{" "}
        <Link href="/cab-booking/chennai">book a cab in Chennai</Link>. Vehicle model is subject to
        availability.
      </p>
      <div className="not-prose my-6">
        <ChennaiClusterLinks title="Book these Chennai services" excludeHref="/tariff" />
      </div>
      <h2>Car rental tariff</h2>
      <p>
        Sedan, MUV and SUV packages for local Chennai and outstation trips. Outstation cars have a 250 km
        minimum.
      </p>
      <div className="not-prose">
      <CarTariffTable rows={CAR_TARIFF} />
      </div>

      <h2>Van rental tariff</h2>
      <p>
        Tempo Traveller and Tourister rates for groups. Local packages are 5 Hrs / 50 Km, 10 Hrs / 100 Km and
        15 Hrs / 150 Km. Outstation vans have a 300 km minimum.
      </p>
      <div className="not-prose">
      <VanTariffTable rows={VAN_TARIFF} />
      </div>

      <h2>Mini bus rental price</h2>
      <p>
        21, 25 and 30 seater mini bus hire for weddings, corporate trips and pilgrimages. 30 seater is
        outstation-only.
      </p>
      <div className="not-prose">
      <BusTariffTable rows={BUS_TARIFF} />
      </div>

      <p className="not-prose mt-8">
        <Link href="/cabs" className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-12 px-6">
          Book a cab
        </Link>
      </p>

      <div className="not-prose mt-8">
        <TariffTerms />
      </div>
    </MarketingPageShell>
  );
}
