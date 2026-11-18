"use client";

import { useEffect, useState } from "react";
import TestimonialCard from "../TestimonialCard";
import HomeSectionHeader from "../home/HomeSectionHeader";

function asCards(items = []) {
  return items
    .filter((item) => item && !item.sampleReview)
    .map((item) => ({
      ...item,
      verified: false
    }));
}

export default function TestimonialsSection() {
  const [cards, setCards] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/testimonials?limit=8&page=1", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setCards(asCards(Array.isArray(json?.data) ? json.data : []));
      })
      .catch(() => {
        if (!cancelled) setCards([]);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded || cards.length === 0) return null;

  return (
    <section className="home-band home-band-sky">
      <div className="section-shell">
        <HomeSectionHeader
          eyebrow="Reviews"
          title="What riders say"
          href="/testimonials#write-review"
          linkLabel="Leave a review →"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((item) => (
            <TestimonialCard key={String(item._id ?? item.id ?? item.name)} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
