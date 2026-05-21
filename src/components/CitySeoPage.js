import Link from "next/link";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function CitySeoPage({ city, variant }) {
  const isCab = variant === "cab";
  const title = isCab
    ? `Cab & Taxi Booking in ${city.name}`
    : `Acting Driver in ${city.name}`;
  const lead = isCab
    ? `Book outstation cabs, airport taxis and local rentals in ${city.name}, ${city.state} with transparent pricing on Cabzii.`
    : `Hire verified acting drivers and chauffeurs in ${city.name} for hourly, daily and outstation trips on Cabzii.`;

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <article className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
          {city.state} · Cabzii
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">{lead}</p>

        <h2 className="mt-10 text-xl font-bold text-slate-900 md:text-2xl">
          {isCab ? "Why book cabs on Cabzii?" : "Why hire acting drivers on Cabzii?"}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          <li>Instant online booking with clear fare breakdown</li>
          <li>Verified vendors and professional drivers in {city.name}</li>
          <li>Outstation, airport, local and tour options in one place</li>
          <li>Support on WhatsApp for quick trip changes</li>
        </ul>

        <h2 className="mt-10 text-xl font-bold text-slate-900 md:text-2xl">Popular services in {city.name}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/search?q=${encodeURIComponent(`cab ${city.name}`)}&pickup=${encodeURIComponent(city.name)}`}
            className="rounded-full bg-[#0056D2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0046b0]"
          >
            Search cabs in {city.name}
          </Link>
          <Link
            href={`/search?q=${encodeURIComponent(`acting driver ${city.name}`)}`}
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-sky-300"
          >
            Find acting drivers
          </Link>
          <Link href="/cabs" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">
            All cabs
          </Link>
          <Link href="/drivers" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">
            All drivers
          </Link>
        </div>

        <h2 className="mt-10 text-xl font-bold text-slate-900 md:text-2xl">Other cities</h2>
        <p className="mt-2 text-sm text-slate-600">
          Cabzii serves Chennai, Bengaluru, Mumbai, Delhi, Hyderabad, Pune, Kolkata and more.
        </p>
      </article>
      <Footer />
    </main>
  );
}
