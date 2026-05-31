import Image from "next/image";
import Link from "next/link";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const AMENITY_ICONS = { wifi: "📶", pool: "🏊", parking: "🅿️", spa: "💆", gym: "🏋️", beach: "🏖️" };

export default function EmtHotelCard({ hotel, searchQuery }) {
  const href = `/hotels/${hotel.id}?${searchQuery}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-[var(--emt-shadow-hover)] sm:flex-row">
      <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-56">
        <Image src={hotel.images[0]} alt={hotel.name} fill sizes="224px" className="object-cover" />
        {hotel.freeCancellation ? (
          <span className="absolute left-2 top-2 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            Free cancellation
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-amber-500">{"★".repeat(hotel.stars)}</span>
            <span className="rounded bg-[var(--emt-accent)]/15 px-2 py-0.5 text-xs font-bold text-[var(--emt-secondary)]">
              {hotel.rating.score} · {hotel.rating.label}
            </span>
          </div>
          <h3 className="mt-1 text-lg font-bold text-slate-900">{hotel.name}</h3>
          <p className="text-sm text-slate-500">{hotel.location.address}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {hotel.amenities.map((a) => (
              <span key={a} title={a}>
                {AMENITY_ICONS[a] || "•"}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{formatINR(hotel.pricePerNight)}</p>
            <p className="text-xs text-slate-500">per night</p>
          </div>
          <Link
            href={href}
            className="rounded-full bg-[var(--emt-primary)] px-5 py-2 text-sm font-bold text-white hover:bg-[var(--emt-primary-dark)]"
          >
            View Rooms
          </Link>
        </div>
      </div>
    </article>
  );
}
