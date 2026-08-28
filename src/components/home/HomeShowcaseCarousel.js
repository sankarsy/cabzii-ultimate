import HomeShowcaseInteractive from "./HomeShowcaseInteractive";
import ShowcaseCard from "./ShowcaseCard";
import { HOME_CARD_COPY, SHOWCASE_FALLBACKS } from "../../lib/homeShowcase";

export default function HomeShowcaseCarousel({ section = "offers", cards: cardsProp }) {
  const copy = HOME_CARD_COPY[section] || HOME_CARD_COPY.offers;
  const cards = Array.isArray(cardsProp) && cardsProp.length ? cardsProp : SHOWCASE_FALLBACKS[section] || SHOWCASE_FALLBACKS.offers;

  return (
    <section className="section-shell py-8 sm:py-10">
      <HomeShowcaseInteractive
        title={copy.title}
        viewAllHref={copy.viewAllHref}
        viewAllLabel={copy.viewAllLabel}
        ariaLabel={copy.ariaLabel}
      >
        {cards.map((o) => (
          <ShowcaseCard key={o._id || `${section}-${o.tag}-${o.title}`} card={o} section={section} />
        ))}
      </HomeShowcaseInteractive>
    </section>
  );
}
