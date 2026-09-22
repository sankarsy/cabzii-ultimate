import HomeShowcaseInteractive from "./HomeShowcaseInteractive";
import ShowcaseCard from "./ShowcaseCard";
import { HOME_CARD_COPY, SHOWCASE_FALLBACKS } from "../../lib/homeShowcase";
import { filterActiveOffers } from "../../lib/offers";

export default function HomeShowcaseCarousel({ section = "offers", cards: cardsProp }) {
  const copy = HOME_CARD_COPY[section] || HOME_CARD_COPY.offers;
  const raw = Array.isArray(cardsProp) && cardsProp.length ? cardsProp : SHOWCASE_FALLBACKS[section] || SHOWCASE_FALLBACKS.offers;
  const cards = section === "offers" ? filterActiveOffers(raw) : raw;
  if (!cards.length) return null;

  return (
    <section className="section-shell py-8 sm:py-10">
      <HomeShowcaseInteractive
        title={copy.title}
        viewAllHref={copy.viewAllHref}
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
