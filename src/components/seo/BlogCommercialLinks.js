import Link from "next/link";
import { detectCitySlugFromText } from "../../lib/seo/internalLinks";
import { cityBySlug } from "../../lib/seo/cities";
import { cityHasCommercialAirport } from "../../lib/seo/airports";

export default function BlogCommercialLinks({ title = "", slug = "", excerpt = "" }) {
  const citySlug = detectCitySlugFromText(title, slug, excerpt);
  const city = citySlug ? cityBySlug(citySlug) : null;

  const links = city
    ? [
        { href: `/cab-booking/${city.slug}`, label: `Cab booking ${city.name}` },
        {
          href: `/services/airport-taxi/${city.slug}`,
          label: cityHasCommercialAirport(city.slug)
            ? `Airport taxi ${city.name}`
            : `Airport transfer from ${city.name}`
        },
        { href: `/services/outstation-cab/${city.slug}`, label: `Outstation cab ${city.name}` },
        { href: `/acting-driver/${city.slug}`, label: `Acting driver ${city.name}` },
        { href: "/cabs", label: "Browse all cabs" }
      ]
    : [
        { href: "/cabs", label: "Browse all cabs" },
        { href: "/call-driver", label: "Call Driver" },
        { href: "/holidays", label: "Holiday packages" },
        { href: "/acting-driver", label: "Acting driver cities" }
      ];

  return (
    <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Book on Cabzii</p>
      <p className="mt-1 text-sm text-slate-600">
        {city
          ? `Continue to ${city.name} cab, airport transfer, outstation and acting-driver pages.`
          : "Continue to cabs, Call Driver, holidays and acting-driver pages."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 first:border-transparent first:bg-[#0056D2] first:text-white first:hover:bg-[#0047b3]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
