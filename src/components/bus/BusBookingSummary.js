"use client";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function BusBookingSummary({ trip, selectedSeats = [], boarding, dropping, total }) {
  if (!trip) return null;

  return (
    <aside className="cabzii-card sticky top-20 p-4">
      <p className="text-sm font-bold text-slate-900">Trip summary</p>
      <p className="mt-1 text-xs text-slate-600">
        {trip.fromCity} → {trip.toCity} · {trip.departure.time}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-slate-700">{trip.operator?.name} · {trip.busType}</p>

      {boarding ? (
        <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs">
          <p className="font-bold text-emerald-800">Boarding</p>
          <p className="text-emerald-900">{boarding}</p>
        </div>
      ) : null}
      {dropping ? (
        <div className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs">
          <p className="font-bold text-rose-800">Dropping</p>
          <p className="text-rose-900">{dropping}</p>
        </div>
      ) : null}

      {selectedSeats.length ? (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="text-xs font-bold uppercase text-slate-500">Seats ({selectedSeats.length})</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {selectedSeats.map((s) => (
              <span key={s.id} className="rounded-lg bg-sky-100 px-2 py-1 text-xs font-bold text-sky-800">
                {s.id}
              </span>
            ))}
          </div>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            {selectedSeats.map((s) => (
              <li key={s.id} className="flex justify-between">
                <span>{s.id}</span>
                <span>{formatINR(s.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {total > 0 ? (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-sm font-semibold text-slate-700">Total</span>
          <span className="text-xl font-extrabold text-slate-900">{formatINR(total)}</span>
        </div>
      ) : null}
    </aside>
  );
}
