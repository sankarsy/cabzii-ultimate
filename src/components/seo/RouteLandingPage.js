import Link from "next/link";
import Footer from "../Footer";
import Navbar from "../Navbar";
import Breadcrumbs from "./Breadcrumbs";
import FaqSection from "./FaqSection";

export default function RouteLandingPage({ route, faqs }) {
  const { fromCity, toCity, distance, duration, sedanFrom, suvFrom, slug } = route;
  const path = `/routes/${slug}`;
  const searchHref = `/search?q=${encodeURIComponent(`one way cab ${fromCity.name} ${toCity.name}`)}&pickup=${encodeURIComponent(fromCity.name)}&drop=${encodeURIComponent(toCity.name)}`;
  const reverseSlug = `${toCity.slug}-to-${fromCity.slug}-cab`;
  const reversePath = `/routes/${reverseSlug}`;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <article className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: fromCity.name, path: `/cab-booking/${fromCity.slug}` },
            { name: `${fromCity.name} to ${toCity.name}`, path }
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">One way cab · Cabzii</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
          One Way Cab from {fromCity.name} to {toCity.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
          Book a one way cab from {fromCity.name} to {toCity.name} ({distance}, {duration}). Compare sedan, SUV and
          Innova fares with upfront pricing on Cabzii — ideal for relocations, work travel and family trips.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={searchHref}
            className="rounded-full bg-[#0056D2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0046b0]"
          >
            Book one way cab
          </Link>
          <Link
            href={`/services/outstation-cab/${fromCity.slug}`}
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800"
          >
            Outstation cabs from {fromCity.name}
          </Link>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Trip overview</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <tbody>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 font-semibold text-slate-700">Distance</th>
                  <td className="px-4 py-3 text-slate-600">{distance}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 font-semibold text-slate-700">Travel time</th>
                  <td className="px-4 py-3 text-slate-600">{duration}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 font-semibold text-slate-700">Sedan from</th>
                  <td className="px-4 py-3 text-slate-600">₹{sedanFrom.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">SUV / Innova from</th>
                  <td className="px-4 py-3 text-slate-600">₹{suvFrom.toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Indicative fares — exact quote shown on Cabzii before booking. Tolls and state taxes may apply.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Why book this route on Cabzii?</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>One way pricing without return empty charge confusion</li>
            <li>Highway-experienced drivers for {fromCity.name} – {toCity.name}</li>
            <li>Sedan, SUV, Innova and tempo options for groups</li>
            <li>OTP login and WhatsApp support for trip updates</li>
          </ul>
        </section>

        <FaqSection
          title={`${fromCity.name} to ${toCity.name} cab — FAQ`}
          faqs={faqs}
        />

        <section className="mt-10 rounded-2xl bg-slate-900 p-6 text-white md:p-8">
          <h2 className="text-xl font-bold">Need the return trip?</h2>
          <p className="mt-2 text-sm text-slate-300">
            Book {toCity.name} to {fromCity.name} as a separate one way or plan a round trip package.
          </p>
          <Link
            href={reversePath}
            className="mt-4 inline-flex rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
          >
            {toCity.name} → {fromCity.name} cab
          </Link>
        </section>
      </article>
      <Footer />
    </main>
  );
}
