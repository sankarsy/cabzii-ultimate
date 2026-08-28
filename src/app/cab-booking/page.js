import JsonLd from "../../components/seo/JsonLd";
import Breadcrumbs from "../../components/seo/Breadcrumbs";
import ShowcaseCard from "../../components/home/ShowcaseCard";
import { breadcrumbJsonLd, buildPageMetadata } from "../../lib/seo";
import { fetchHomeShowcase } from "../../lib/serverCatalog";

export const metadata = buildPageMetadata({
  title: "Cab Services in All Cities | Cabzii",
  description:
    "Airport taxi, local hire and outstation cabs across Chennai, Bengaluru, Hyderabad, Coimbatore and more. Open a city to book on Cabzii.",
  path: "/cab-booking",
  keywords: ["cab services", "cab booking cities", "airport taxi", "outstation cab", "cabzii"]
});

export default async function CabBookingIndexPage() {
  const cards = await fetchHomeShowcase("services");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Cab services", path: "/cab-booking" }
        ])}
      />
      <article className="section-shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Cab services", path: "/cab-booking" }
          ]}
        />
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]">
          Cab services in all cities
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Airport taxi, local hire and outstation cabs with fares shown before you confirm. Open a city to book.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card._id || `${card.tag}-${card.title}`}>
              <ShowcaseCard card={card} section="services" layout="grid" />
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
