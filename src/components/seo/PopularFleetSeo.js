import Link from "next/link";
import { FLEET_MODELS } from "../../lib/seo/vehicleKeywordMap";

export default function PopularFleetSeo({ cityName = "Chennai", citySlug = "chennai" }) {
  const bookingHref = `/cab-booking/${citySlug}`;
  const carRentalHref = `/services/car-rental/${citySlug}`;
  const cabRentalHref = `/services/cab-rental/${citySlug}`;

  return (
    <section className="cabzii-seo-block rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      <h2>Popular cabs for booking &amp; car rental in {cityName}</h2>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-700 sm:text-xs">
        Book {FLEET_MODELS.map((m) => m.name).join(", ")} for cab booking, taxi hire and car rental in {cityName}.
        Sedans suit airport drops; Ertiga and Innova fit families; Bolero and Tempo suit groups. Fares show before you pay
        on Cabzii.
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {FLEET_MODELS.map((model) => (
          <li key={model.id}>
            <Link
              href="/cabs"
              className="inline-block rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[var(--cabzii-brand)] hover:text-[var(--cabzii-brand)]"
            >
              {model.name}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold sm:text-xs">
        <Link href={bookingHref} className="text-[var(--cabzii-brand)] hover:underline">
          Cab booking {cityName} →
        </Link>
        <Link href={carRentalHref} className="text-[var(--cabzii-brand)] hover:underline">
          Car rental {cityName} →
        </Link>
        <Link href={cabRentalHref} className="text-[var(--cabzii-brand)] hover:underline">
          Cab rental {cityName} →
        </Link>
      </p>
    </section>
  );
}
