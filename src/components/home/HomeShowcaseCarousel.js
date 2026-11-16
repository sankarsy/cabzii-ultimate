"use client";

import HomeShowcaseInteractive from "./HomeShowcaseInteractive";
import ShowcaseCard from "./ShowcaseCard";
import { HOME_CARD_COPY, SHOWCASE_FALLBACKS } from "../../lib/homeShowcase";
import { filterActiveOffers } from "../../lib/offers";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { cityScopedCardHref } from "../../lib/cityShowcase";

export default function HomeShowcaseCarousel({ section = "offers", cards: cardsProp }) {
  const { city: selectedCity } = useSelectedCity();
  const copy = HOME_CARD_COPY[section] || HOME_CARD_COPY.offers;
  const raw = Array.isArray(cardsProp) && cardsProp.length ? cardsProp : SHOWCASE_FALLBACKS[section] || SHOWCASE_FALLBACKS.offers;
  const cards = section === "offers" ? filterActiveOffers(raw) : raw;
  if (!cards.length) return null;
  const viewAllHref =
    section === "offers" ? cityScopedCardHref(copy.viewAllHref, selectedCity) : copy.viewAllHref;

  return (
    <section className="section-shell">
      <HomeShowcaseInteractive
        title={copy.title}
        viewAllHref={viewAllHref}
        viewAllLabel={copy.viewAllLabel}
        ariaLabel={copy.ariaLabel}
      >
        {cards.map((o, index) => (
          <ShowcaseCard
            key={o._id || `${section}-${o.href || o.tag || "card"}-${o.title}-${index}`}
            card={o}
            section={section}
          />
        ))}
      </HomeShowcaseInteractive>
    </section>
  );
}
