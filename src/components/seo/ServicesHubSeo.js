import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import { SEO_SERVICES, servicePath } from "../../lib/seo/services";
import { isPackageDoorwayService } from "../../lib/seo/packageDoorways";
import { SEO_CITIES } from "../../lib/seo/cities";
import { INTERNAL_LINK_CITIES } from "../../lib/seo/internalLinks";

export default function ServicesHubSeo() {
  const cities = INTERNAL_LINK_CITIES.map((slug) => SEO_CITIES.find((c) => c.slug === slug)).filter(Boolean);

  return (
    <article className="section-shell cabzii-seo-landing pb-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" }
        ]}
      />
      <p className="cabzii-seo-kicker">Cabzii services</p>
      <h1>Cab, airport, outstation and Tempo Traveller services</h1>
      <p className="cabzii-seo-lead">
        Open the service you need, then pick the city you travel from. Local cab packages and acting-driver packages
        book on the city hub — they are not separate service pages.
      </p>
      <section className="cabzii-seo-block">
        <h2>Service categories</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {SEO_SERVICES.filter((svc) => !isPackageDoorwayService(svc.slug)).map((svc) => (
            <li key={svc.slug} className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="font-semibold text-slate-900">{svc.name}</p>
              <p className="mt-1 text-xs text-slate-600">{svc.highlights?.[0]}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cities.slice(0, 6).map((city) => (
                  <Link
                    key={city.slug}
                    href={servicePath(svc, city)}
                    className="text-[11px] font-semibold text-[var(--cabzii-brand)] hover:underline"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
