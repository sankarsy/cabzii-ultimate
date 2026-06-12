import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import SectionIntro from "../ui/SectionIntro";

const DESTINATIONS = [
  {
    name: "Ooty",
    desc: "Queen of hill stations — tea gardens & toy train",
    priceFrom: 6499,
    href: "/routes/coimbatore-to-ooty-cab",
    image: "https://images.unsplash.com/photo-1580891034942-67d5f6e9b9b0?auto=format&fit=crop&w=600&h=400&q=75"
  },
  {
    name: "Kodaikanal",
    desc: "Misty lakes, pine forests & Coaker's Walk",
    priceFrom: 5999,
    href: "/cab-booking/kodaikanal",
    image: "https://images.unsplash.com/photo-1593183230684-ca2a8e6a7f15?auto=format&fit=crop&w=600&h=400&q=75"
  },
  {
    name: "Rameswaram",
    desc: "Sacred island temple & Pamban bridge drive",
    priceFrom: 4999,
    href: "/routes/madurai-to-rameswaram-cab",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&h=400&q=75"
  },
  {
    name: "Munnar",
    desc: "Rolling tea estates in Kerala's high ranges",
    priceFrom: 7999,
    href: "/cabs",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&h=400&q=75"
  },
  {
    name: "Coorg",
    desc: "Coffee plantations, waterfalls & cool weather",
    priceFrom: 7499,
    href: "/cabs",
    image: "https://images.unsplash.com/photo-1600100397608-f010f63b1aff?auto=format&fit=crop&w=600&h=400&q=75"
  },
  {
    name: "Mysore",
    desc: "Palace city — heritage, silk & sandalwood",
    priceFrom: 4499,
    href: "/routes/bengaluru-to-mysore-cab",
    image: "https://images.unsplash.com/photo-1600112356915-089abb8fc71a?auto=format&fit=crop&w=600&h=400&q=75"
  },
  {
    name: "Pondicherry",
    desc: "French quarter cafés & ECR beach drive",
    priceFrom: 3999,
    href: "/routes/chennai-to-pondicherry-cab",
    image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&h=400&q=75"
  },
  {
    name: "Madurai",
    desc: "Meenakshi temple & 2,500 years of history",
    priceFrom: 5499,
    href: "/routes/chennai-to-madurai-cab",
    image: "https://images.unsplash.com/photo-1604693433772-7e0e7d2cb1d9?auto=format&fit=crop&w=600&h=400&q=75"
  }
];

function inr(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

/** Curated South India destinations with cab fares — always populated, never empty. */
export default function PopularDestinations() {
  return (
    <section className="border-t border-slate-200 bg-white py-8 sm:py-10">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Destinations"
          title="Popular destinations by cab"
          subtitle="Hill stations, temple towns and beach drives across South India — fixed fares, verified drivers."
        />
        <div className="scroll-x-touch -mx-4 mt-5 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {DESTINATIONS.map((d) => (
            <Link
              key={d.name}
              href={d.href}
              className="cabzii-tap group w-[16rem] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--cabzii-brand)]/30 hover:shadow-md sm:w-auto"
            >
              <div className="relative h-32 overflow-hidden bg-slate-100 sm:h-36">
                <img
                  src={d.image}
                  alt={`${d.name} cab booking`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-slate-800 backdrop-blur">
                  <MapPin className="h-3 w-3 text-[var(--cabzii-brand)]" strokeWidth={2.5} aria-hidden />
                  {d.name}
                </span>
              </div>
              <div className="p-3.5">
                <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{d.desc}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <p className="text-sm font-extrabold text-slate-900">
                    <span className="text-[11px] font-semibold text-slate-400">from </span>
                    {inr(d.priceFrom)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--cabzii-brand)]">
                    Book cab
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" strokeWidth={2.5} aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
