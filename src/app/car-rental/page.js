import Link from "next/link";
import JsonLd from "../../components/seo/JsonLd";
import Breadcrumbs from "../../components/seo/Breadcrumbs";
import { breadcrumbJsonLd, buildPageMetadata, MAIN_PAGE_CITY_SLUGS, cityBySlug } from "../../lib/seo";
import { cityCabLandingPath } from "../../lib/cityCabPaths";
import { SEO_REVALIDATE_SECONDS } from "../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;

export const metadata = buildPageMetadata({
  title: "City Taxi & Car Rental | Tamil Nadu Cabs | Cabzii",
  description:
    "Book outstation, airport and full-day city cabs across Tamil Nadu, Tirupati, Pondicherry and Bengaluru. Pay 50% now on Cabzii.",
  path: "/car-rental",
  image: "/opengraph-image",
  imageAlt: "Cabzii city taxi and car rental"
});

export default function CarRentalHubPage() {
  const cities = MAIN_PAGE_CITY_SLUGS.map((slug) => cityBySlug(slug)).filter(Boolean);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Car Rental", path: "/car-rental" }
        ])}
      />
      <article className="section-shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Car Rental", path: "/car-rental" }
          ]}
        />
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]">
          City taxi and car rental
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Open a city for Hatchback, Sedan, SUV and Tempo Traveller fares, airport transfers and outstation cabs.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <li key={city.slug}>
              <Link
                href={cityCabLandingPath(city.slug)}
                className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-[var(--cabzii-brand)] hover:text-[var(--cabzii-brand)]"
              >
                Taxi service in {city.name}
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
