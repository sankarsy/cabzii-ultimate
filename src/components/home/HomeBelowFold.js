import dynamic from "next/dynamic";
import EmtWhyChooseUs from "../emt/EmtWhyChooseUs";
import MmtCabResultCard from "../mmt/MmtCabResultCard";
import MmtHomeCatalogSection, { MmtHomeCatalogScroll, MmtHomeCatalogScrollItem } from "../mmt/MmtHomeCatalogSection";
import CallDriverHomeSection from "./CallDriverHomeSection";
import FaqSection from "../seo/FaqSection";
import { HOME_PAGE_FAQS } from "../../lib/seo/content";
import { DEFAULT_HQ_CITY } from "../../lib/vehicleAdminConfig";
import HomeSeoDiscover from "../seo/HomeSeoDiscover";
import HomeShowcaseCarousel from "./HomeShowcaseCarousel";
import HomeBlogTeasers from "./HomeBlogTeasers";
import HomeFleetLoader from "./HomeFleetLoader";

const TestimonialsSection = dynamic(() => import("../reviews/TestimonialsSection"), {
  loading: () => (
    <section className="border-t border-slate-200 bg-white py-8 sm:py-10" aria-hidden>
      <div className="section-shell h-24" />
    </section>
  )
});

const HOME_FLEET_SUBTITLE = `Sedan, hatchback, MPV & SUV taxi cars · ${DEFAULT_HQ_CITY}`;

function HomeFleetGrid({ cabs }) {
  return (
    <MmtHomeCatalogSection
      eyebrow="Our fleet"
      title="Top cabs for you"
      subtitle={HOME_FLEET_SUBTITLE}
      viewAllHref="/cabs"
      viewAllLabel="View all cabs"
      loading={false}
      isEmpty={cabs.length === 0}
      emptyMessage="No cabs yet. Start the backend and add listings in admin."
    >
      <MmtHomeCatalogScroll>
        {cabs.map((cab) => (
          <MmtHomeCatalogScrollItem key={String(cab._id ?? cab.id)}>
            <MmtCabResultCard cab={cab} layout="card" catalogMode displayCity={cab.city || DEFAULT_HQ_CITY} />
          </MmtHomeCatalogScrollItem>
        ))}
      </MmtHomeCatalogScroll>
    </MmtHomeCatalogSection>
  );
}

/** Below-the-fold home sections — server-rendered so hero JS stays smaller. */
export default function HomeBelowFold({
  cabs = [],
  showcase = {},
  blogs,
  callDriverServices,
  siteSettings
}) {
  return (
    <>
      <HomeShowcaseCarousel section="offers" cards={showcase.offers} />
      <HomeShowcaseCarousel section="services" cards={showcase.services} />
      <HomeShowcaseCarousel section="routes" cards={showcase.routes} />

      {cabs.length ? <HomeFleetGrid cabs={cabs} /> : <HomeFleetLoader />}

      <CallDriverHomeSection services={callDriverServices} />
      <EmtWhyChooseUs settings={siteSettings} />
      <TestimonialsSection />
      <HomeBlogTeasers posts={blogs} />
      <HomeSeoDiscover />

      <section className="border-t border-slate-200 bg-white py-8 sm:py-10">
        <div className="section-shell">
          <FaqSection
            eyebrow="Help"
            title="Frequently asked questions"
            subtitle="Quick answers about booking on cabzii.in."
            faqs={HOME_PAGE_FAQS}
            scrollable
            scrollMaxClass="max-h-[min(18rem,48vh)] sm:max-h-[min(20rem,50vh)]"
          />
        </div>
      </section>
    </>
  );
}
