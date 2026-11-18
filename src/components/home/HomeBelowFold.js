"use client";

import EmtWhyChooseUs from "../emt/EmtWhyChooseUs";
import CallDriverHomeSection from "./CallDriverHomeSection";
import FaqSection from "../seo/FaqSection";
import PageHubLinks from "../seo/PageHubLinks";
import TestimonialsSection from "../reviews/TestimonialsSection";
import { HOME_PAGE_FAQS } from "../../lib/seo/content";
import { resolvePageLinkGroups } from "../../lib/seo/pageLinks";
import HomeHowToBook from "./HomeHowToBook";
import CityScopedShowcase from "./CityScopedShowcase";
import HomeBlogTeasers from "./HomeBlogTeasers";
import HomeFleetLoader from "./HomeFleetLoader";
import HomeFleetSection from "./HomeFleetSection";
import HomeSectionHeader from "./HomeSectionHeader";

/**
 * Conversion order after search:
 * cabs → how to book → trip types / routes → call driver → trust → FAQ → guides
 */
export default function HomeBelowFold({
  cabs = [],
  blogs,
  callDriverServices,
  siteSettings
}) {
  const hubGroups = resolvePageLinkGroups(siteSettings?.pageSeo?.["/"]?.pageLinks, "/", "home");
  return (
    <div className="home-below">
      {cabs.length ? <HomeFleetSection cabs={cabs} /> : <HomeFleetLoader />}

      <HomeHowToBook />

      <div className="home-band home-band-white">
        <div className="home-stack">
          <CityScopedShowcase section="services" />
          <div className="hidden sm:block">
            <CityScopedShowcase section="routes" />
          </div>
        </div>
      </div>

      <CallDriverHomeSection services={callDriverServices} />
      <div className="hidden sm:block">
        <EmtWhyChooseUs settings={siteSettings} />
      </div>
      <TestimonialsSection />

      <section className="home-band home-band-white">
        <div className="section-shell">
          <HomeSectionHeader
            eyebrow="Help"
            title="Frequently asked questions"
            subtitle="Quick answers about booking on cabzii.in."
          />
          <FaqSection
            hideTitle
            faqs={HOME_PAGE_FAQS}
            scrollable
            scrollMaxClass="max-h-[min(18rem,48vh)] sm:max-h-[min(20rem,50vh)]"
          />
        </div>
      </section>

      <div className="hidden sm:block">
        <HomeBlogTeasers posts={blogs} />
      </div>

      {hubGroups.length ? (
        <section className="home-band home-band-white hidden sm:block">
          <div className="section-shell">
            <PageHubLinks groups={hubGroups} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
