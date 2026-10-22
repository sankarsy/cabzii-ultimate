"use client";

import { useMemo } from "react";
import HomeShowcaseInteractive from "./HomeShowcaseInteractive";
import ShowcaseCard from "./ShowcaseCard";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { cityCabLandingPath } from "../../lib/cityCabPaths";
import { cityRouteCards, cityServiceCards, resolveScopedCity } from "../../lib/cityShowcase";

export default function CityScopedShowcase({ section = "services" }) {
  const { city: selectedCity } = useSelectedCity();
  const scoped = useMemo(() => resolveScopedCity(selectedCity), [selectedCity]);
  const cards = useMemo(
    () => (section === "routes" ? cityRouteCards(scoped, 12) : cityServiceCards(scoped)),
    [section, scoped]
  );

  if (!cards.length) return null;

  const title = section === "routes" ? `Popular routes from ${scoped.name}` : `Cab services in ${scoped.name}`;
  const viewAllHref = section === "routes" ? `/services/outstation-cab/${scoped.slug}` : cityCabLandingPath(scoped.slug);

  return (
    <section className="section-shell py-8 sm:py-10">
      <HomeShowcaseInteractive
        title={title}
        viewAllHref={viewAllHref}
        viewAllLabel="View all →"
        ariaLabel={title}
      >
        {cards.map((card, index) => (
          <ShowcaseCard
            key={`${section}-${card.href}-${card.title}-${index}`}
            card={card}
            section={section}
          />
        ))}
      </HomeShowcaseInteractive>
    </section>
  );
}
