"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Armchair, Bus, MapPin } from "lucide-react";
import MmtLayout from "../../../components/mmt/MmtLayout";
import BusSeatMap from "../../../components/bus/BusSeatMap";
import BusStopPicker from "../../../components/bus/BusStopPicker";
import BusBookingSummary from "../../../components/bus/BusBookingSummary";
import { calcBusTotal, seatPrice } from "../../../lib/busBooking";
import { resolveBusTrip } from "../../../lib/busCatalog";
import { saveCheckoutDraft } from "../../../lib/checkoutStorage";

const STEPS = ["Choose bus", "Select seats", "Passenger", "Payment"];

function BusSeatsSkeleton() {
  return (
    <div className="section-shell cabzii-section animate-pulse space-y-6">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="h-8 w-64 rounded bg-slate-200" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="cabzii-card h-[28rem] bg-slate-100" />
        <div className="cabzii-card h-64 bg-slate-100" />
      </div>
    </div>
  );
}

function BookingSteps({ active = 1 }) {
  return (
    <ol className="mb-6 flex flex-wrap gap-2 sm:gap-3">
      {STEPS.map((label, i) => (
        <li
          key={label}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
            i === active
              ? "bg-[var(--cabzii-brand)] text-white"
              : i < active
                ? "bg-sky-100 text-sky-800"
                : "bg-slate-100 text-slate-500"
          }`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">{i + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}

function BusSeatsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("id") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [boarding, setBoarding] = useState("");
  const [dropping, setDropping] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    resolveBusTrip({ id: tripId, from, to, date }).then((t) => {
      if (cancelled) return;
      if (t) {
        setTrip(t);
        setBoarding(t.boardingPoints?.[0]?.name || "");
        setDropping(t.droppingPoints?.[0]?.name || "");
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [tripId, from, to, date]);

  const selectedSeats = useMemo(
    () =>
      selected.map((id) => {
        const seat = trip?.seatLayout?.find((s) => s.id === id);
        return { ...seat, id, price: seatPrice(seat, trip?.fares) };
      }),
    [selected, trip]
  );

  const total = calcBusTotal(selectedSeats, trip?.fares);
  const isSleeper = String(trip?.busType || "").toLowerCase().includes("sleeper");

  function toggleSeat(seat) {
    if (seat.status === "booked") return;
    setSelected((prev) => (prev.includes(seat.id) ? prev.filter((x) => x !== seat.id) : [...prev, seat.id]));
  }

  function continueBooking() {
    if (!selected.length || !boarding || !dropping || !trip) return;
    const q = new URLSearchParams(searchParams.toString());
    q.set("seats", selected.join(","));
    q.set("boarding", boarding);
    q.set("dropping", dropping);
    q.set("total", String(total));
    saveCheckoutDraft({
      type: "bus",
      tripId: trip.id,
      seats: selected,
      boarding,
      dropping,
      total,
      from: trip.fromCity,
      to: trip.toCity,
      date
    });
    router.push(`/buses/passenger?${q.toString()}`);
  }

  if (loading) {
    return <BusSeatsSkeleton />;
  }

  if (!trip) {
    return (
      <div className="section-shell cabzii-section py-12 text-center">
        <div className="cabzii-empty mx-auto max-w-md">
          <Bus className="cabzii-empty-icon mx-auto h-8 w-8" aria-hidden />
          <p className="text-lg font-bold text-slate-900">Bus trip not found</p>
          <p className="mt-2 text-sm text-slate-600">
            Search for buses and pick &quot;Select seats&quot; from the results to open the seat map.
          </p>
          <div className="cabzii-btn-stack mt-6 justify-center">
            <Link href="/buses/results" className="cabzii-btn cabzii-btn-primary cabzii-tap justify-center">
              Search buses
            </Link>
            <Link
              href="/buses/results?from=Chennai&to=Bengaluru"
              className="cabzii-btn cabzii-btn-secondary cabzii-tap justify-center"
            >
              Chennai → Bengaluru
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const backQuery = searchParams.toString().replace(/&?id=[^&]*/g, "").replace(/^&/, "");

  return (
    <div className="section-shell cabzii-section">
      <Link
        href={`/buses/results?${backQuery}`}
        className="cabzii-tap inline-flex min-h-[var(--cabzii-touch-min)] items-center text-sm font-semibold text-[var(--cabzii-brand)] hover:underline"
      >
        ← Back to buses
      </Link>

      <BookingSteps active={1} />

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Select your seats</h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">{trip.operator?.name}</span>
          <span aria-hidden>·</span>
          <span>
            {trip.fromCity} → {trip.toCity}
          </span>
          <span aria-hidden>·</span>
          <span>{trip.departure.time}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
            {isSleeper ? <Armchair className="h-3 w-3" /> : <Armchair className="h-3 w-3" />}
            {trip.busType}
          </span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <BusSeatMap layout={trip.seatLayout} selectedIds={selected} onToggle={toggleSeat} maxSeats={6} />
          <div className="grid gap-4 sm:grid-cols-2">
            <BusStopPicker
              label="Boarding point"
              stops={trip.boardingPoints}
              value={boarding}
              onChange={setBoarding}
              variant="boarding"
            />
            <BusStopPicker
              label="Dropping point"
              stops={trip.droppingPoints}
              value={dropping}
              onChange={setDropping}
              variant="dropping"
            />
          </div>
        </div>
        <div className="lg:sticky lg:top-20 lg:self-start">
          <BusBookingSummary trip={trip} selectedSeats={selectedSeats} boarding={boarding} dropping={dropping} total={total} />
          <button
            type="button"
            disabled={!selected.length || !boarding || !dropping}
            onClick={continueBooking}
            className="cabzii-btn cabzii-btn-primary cabzii-tap mt-4 w-full"
          >
            Continue · {selected.length} seat{selected.length !== 1 ? "s" : ""}
            {total > 0 ? ` · ₹${total.toLocaleString("en-IN")}` : ""}
          </button>
          {!selected.length ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Tap available seats on the bus diagram above
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function BusSeatsPage() {
  return (
    <MmtLayout>
      <Suspense fallback={<BusSeatsSkeleton />}>
        <BusSeatsContent />
      </Suspense>
    </MmtLayout>
  );
}
