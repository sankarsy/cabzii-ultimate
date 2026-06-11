import Image from "next/image";
import Link from "next/link";
import { Dumbbell, Sparkles, SquareParking, Star, TreePalm, Waves, Wifi } from "lucide-react";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const AMENITY_ICONS = { wifi: Wifi, pool: Waves, parking: SquareParking, spa: Sparkles, gym: Dumbbell, beach: TreePalm };

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
            <span className="flex items-center gap-0.5" aria-label={`${hotel.stars} star hotel`}>
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} aria-hidden />
              ))}
            </span>
            <span className="rounded bg-[var(--emt-accent)]/15 px-2 py-0.5 text-xs font-bold text-[var(--emt-secondary)]">
              {hotel.rating.score} · {hotel.rating.label}
            </span>
          </div>
          <h3 className="mt-1 text-lg font-bold text-slate-900">{hotel.name}</h3>
          <p className="text-sm text-slate-500">{hotel.location.address}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hotel.amenities.map((a) => {
              const AmenityIcon = AMENITY_ICONS[a];
              if (!AmenityIcon) return null;
              return (
                <span
                  key={a}
                  title={a}
                  className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-600"
                >
                  <AmenityIcon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                </span>
              );
            })}
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
