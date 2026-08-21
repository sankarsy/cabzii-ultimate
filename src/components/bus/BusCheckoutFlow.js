"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import BusSeatMap from "./BusSeatMap";
import BusInfoPanel from "./BusInfoPanel";
import { calcBusTotal, seatPrice } from "../../lib/busBooking";
import { saveCheckoutDraft } from "../../lib/checkoutStorage";
import { buildLoginHref, getToken, getUser } from "../../lib/auth";

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

const STEPS = [
  { id: "seats", label: "Select seats" },
  { id: "stops", label: "Board/Drop point" },
  { id: "passenger", label: "Passenger Info" }
];

function Stepper({ step }) {
  const idx = STEPS.findIndex((s) => s.id === step);
  return (
    <nav className="flex shrink-0 items-center justify-center gap-6 border-b border-[#eee] bg-white px-4 py-3">
      {STEPS.map((s, i) => (
        <span
          key={s.id}
          className={`text-sm font-semibold ${
            i === idx ? "border-b-2 border-[#d84e55] pb-1 text-[#d84e55]" : i < idx ? "text-emerald-600" : "text-slate-500"
          }`}
        >
          {i < idx ? "✓ " : ""}
          {s.label}
        </span>
      ))}
    </nav>
  );
}

function StopColumn({ title, subtitle, stops, value, onChange, showDate }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="divide-y divide-slate-100">
        {(stops || []).map((s) => {
          const selected = value === s.name;
          return (
            <label key={s.name} className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-slate-50">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold tabular-nums text-slate-900">{s.time}</p>
                {showDate && s.dateLabel ? <p className="text-[11px] font-semibold text-[#d84e55]">{s.dateLabel}</p> : null}
                <p className="text-sm font-bold text-slate-900">{s.name}</p>
                {s.landmark ? <p className="text-xs text-slate-500">{s.landmark}</p> : null}
              </div>
              <input type="radio" className="mt-1 accent-[#d84e55]" checked={selected} onChange={() => onChange(s.name)} />
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function BusCheckoutFlow({ trip, searchParams, backHref }) {
  const router = useRouter();
  const date = searchParams.get("date") || "";
  const [step, setStep] = useState(() => {
    if (searchParams.get("step") === "passenger") return "passenger";
    if (searchParams.get("step") === "stops") return "stops";
    return "seats";
  });
  const [selected, setSelected] = useState(() => (searchParams.get("seats") || "").split(",").filter(Boolean));
  const [boarding, setBoarding] = useState(searchParams.get("boarding") || trip.boardingPoints?.[0]?.name || "");
  const [dropping, setDropping] = useState(searchParams.get("dropping") || trip.droppingPoints?.[0]?.name || "");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("M");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [stateName, setStateName] = useState("Tamil Nadu");
  const [whatsapp, setWhatsapp] = useState(true);
  const [guarantee, setGuarantee] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user?.mobileNumber) setPhone(user.mobileNumber);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const selectedSeats = useMemo(
    () =>
      selected.map((id) => {
        const seat = trip.seatLayout?.find((s) => s.id === id);
        return { ...seat, id, price: seatPrice(seat, trip.fares) };
      }),
    [selected, trip]
  );

  const subtotal = calcBusTotal(selectedSeats, trip.fares);
  const discount = 0;
  const guaranteeAmt = guarantee ? Number(trip.tripGuaranteePrice || 24) * Math.max(selected.length, 1) : 0;
  const total = Math.max(0, subtotal - discount) + guaranteeAmt;
  const original = subtotal;

  function toggleSeat(seat) {
    if (seat.status === "booked") return;
    setSelected((prev) => (prev.includes(seat.id) ? prev.filter((x) => x !== seat.id) : [...prev, seat.id]));
  }

  function goStops() {
    if (!selected.length) return;
    setStep("stops");
  }

  function goPassenger() {
    if (!boarding || !dropping) return;
    setStep("passenger");
  }

  function payNow() {
    if (!name.trim() || !phone.trim() || !selected.length) return;
    const q = new URLSearchParams({
      type: "bus",
      id: trip.id,
      pickup: boarding,
      drop: dropping,
      date,
      total: String(total),
      baseFare: String(total),
      seats: selected.join(","),
      from: trip.fromCity,
      to: trip.toCity,
      operator: trip.operator?.name || "",
      busType: trip.busType || "",
      passengerName: name.trim(),
      gender,
      age,
      guarantee: guarantee ? "1" : "0"
    });
    saveCheckoutDraft({
      type: "bus",
      tripId: trip.id,
      seats: selected,
      boarding,
      dropping,
      total,
      from: trip.fromCity,
      to: trip.toCity,
      date,
      customerName: name,
      phone,
      email,
      passengers: [{ name, age, gender, seatId: selected[0] }],
      tripGuarantee: guarantee
    });
    if (!getToken()) {
      router.push(buildLoginHref(`/payment?${q.toString()}`, "customer"));
      return;
    }
    router.push(`/payment?${q.toString()}`);
  }

  const droppingStops = (trip.droppingPoints || []).map((s) => ({
    ...s,
    dateLabel: date
      ? new Date(`${date}T${trip.departure?.time || "20:00"}:00`).getHours() > 12
        ? new Date(new Date(date).getTime() + 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
        : ""
      : ""
  }));

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-[#f3f4f8]">
      <header className="flex shrink-0 items-center justify-between border-b border-[#eee] bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={backHref} className="rounded-md p-1 text-slate-600 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </Link>
          <p className="text-sm font-bold text-slate-900 sm:text-base">
            {trip.fromCity} → {trip.toCity}
          </p>
        </div>
        {discount > 0 ? (
          <span className="rounded bg-amber-300 px-2 py-1 text-[11px] font-extrabold text-slate-900">Exclusive ₹{discount} OFF</span>
        ) : null}
      </header>
      <Stepper step={step} />

      <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1100px] px-3 py-4 sm:px-5">
        {step === "seats" ? (
          <div className="grid items-start gap-4 xl:grid-cols-[auto_minmax(320px,1fr)]">
            <BusSeatMap layout={trip.seatLayout} selectedIds={selected} onToggle={toggleSeat} fares={trip.fares} />
            <BusInfoPanel trip={trip} travelDate={date} />
          </div>
        ) : null}

        {step === "stops" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <StopColumn title="Boarding points" subtitle="Select Boarding Point" stops={trip.boardingPoints} value={boarding} onChange={setBoarding} />
            <StopColumn title="Dropping points" subtitle="Select Dropping Point" stops={droppingStops} value={dropping} onChange={setDropping} showDate />
          </div>
        ) : null}

        {step === "passenger" ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-slate-900">Contact details</h3>
                <p className="text-xs text-slate-500">Ticket details will be sent to</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-semibold text-slate-600">
                    Phone *
                    <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="10-digit mobile" />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    Email ID
                    <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                  </label>
                  <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
                    State of Residence
                    <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={stateName} onChange={(e) => setStateName(e.target.value)} />
                    <span className="mt-0.5 block font-normal text-slate-400">Required for GST tax invoicing</span>
                  </label>
                </div>
                <label className="mt-3 flex items-center justify-between text-sm text-slate-700">
                  <span>Send booking details and trip updates on WhatsApp</span>
                  <input type="checkbox" className="accent-[#d84e55]" checked={whatsapp} onChange={(e) => setWhatsapp(e.target.checked)} />
                </label>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800">Login to view saved passengers list.</div>
                <p className="text-sm font-bold text-slate-900">
                  Passenger 1 <span className="font-normal text-slate-500">· Seat {selected[0] || "—"}{selectedSeats[0]?.deck ? `, ${selectedSeats[0].deck} deck` : ""}</span>
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-semibold text-slate-600">
                    Name *
                    <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="As on ID proof" />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    Age *
                    <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={age} onChange={(e) => setAge(e.target.value)} inputMode="numeric" />
                  </label>
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-600">Gender *</p>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {[
                    ["M", "Male"],
                    ["F", "Female"]
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setGender(id)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${gender === id ? "border-[#d84e55] bg-rose-50 text-[#d84e55]" : "border-slate-200 text-slate-700"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">Trip Guarantee</h3>
                    <p className="text-xs text-slate-500">₹{trip.tripGuaranteePrice || 24} per passenger</p>
                    <p className="mt-1 text-sm text-slate-700">Get a full refund + ₹500 extra if your bus is cancelled by the operator.</p>
                  </div>
                  <span className="rounded-full bg-[#d84e55] p-2 text-white" aria-hidden>
                    🛡
                  </span>
                </div>
                <div className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-center text-xs font-semibold text-slate-700">
                  Get {formatINR(original + 500)} refund if bus gets cancelled
                </div>
                <p className="mt-2 rounded bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800">Bought by 7,42,445+ people in the last month.</p>
                <div className="mt-3 grid gap-2">
                  <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                    <span>Add Trip Guarantee ({formatINR(trip.tripGuaranteePrice || 24)} for {selected.length || 1} passenger)</span>
                    <input type="radio" name="tg" checked={guarantee} onChange={() => setGuarantee(true)} className="accent-[#d84e55]" />
                  </label>
                  <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                    <span>Don&apos;t add Trip Guarantee</span>
                    <input type="radio" name="tg" checked={!guarantee} onChange={() => setGuarantee(false)} className="accent-[#d84e55]" />
                  </label>
                </div>
              </div>
            </div>

            <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-extrabold uppercase tracking-wide text-slate-900">{trip.operator?.name}</p>
              <p className="text-xs text-slate-500">
                {selected.length} seat{selected.length === 1 ? "" : "s"} · {trip.busType}
              </p>
              <p className="mt-2 rounded bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-800">
                IS STARTING FROM: {(trip.boardingPoints || []).slice(0, 2).map((s) => s.name).join(" > ") || trip.fromCity}
              </p>
              <div className="mt-3 border-l-2 border-slate-200 pl-3 text-xs">
                <p className="font-bold text-slate-900">
                  {trip.departure?.time}, {date || "Today"} · {boarding || trip.fromCity}
                </p>
                <p className="my-2 text-slate-500">{trip.duration}</p>
                <p className="font-bold text-slate-900">
                  {trip.arrival?.time} · {dropping || trip.toCity}
                </p>
              </div>
              <p className="mt-3 text-xs font-bold text-slate-700">Seat details</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {selectedSeats.map((s) => (
                  <span key={s.id} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                    {s.id} · {s.deck === "upper" ? "Upper" : "Lower"} deck
                  </span>
                ))}
              </div>
            </aside>
          </div>
        ) : null}
      </div>
      </div>

      <footer className="shrink-0 border-t border-[#eee] bg-white">
        {discount > 0 && selected.length ? (
          <div className="bg-amber-200 px-4 py-1.5 text-center text-xs font-bold text-slate-900">Exclusive deal applied • ₹{discount} saved</div>
        ) : null}
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs text-slate-500">{selected.length} seat{selected.length === 1 ? "" : "s"}</p>
            <p className="text-lg font-extrabold text-slate-900">
              {discount > 0 && original > total - guaranteeAmt ? (
                <span className="mr-2 text-sm font-semibold text-slate-400 line-through">{formatINR(original)}</span>
              ) : null}
              {formatINR(total)}
            </p>
          </div>
          {step === "seats" ? (
            <button type="button" disabled={!selected.length} onClick={goStops} className="rounded-full bg-[#d84e55] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40">
              Select boarding & dropping points
            </button>
          ) : null}
          {step === "stops" ? (
            <button type="button" disabled={!boarding || !dropping} onClick={goPassenger} className="rounded-full bg-[#d84e55] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40">
              Fill passenger details
            </button>
          ) : null}
          {step === "passenger" ? (
            <button type="button" disabled={!name.trim() || !phone.trim()} onClick={payNow} className="rounded-full bg-[#d84e55] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40">
              Proceed to pay
            </button>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
