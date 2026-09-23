"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PlaceAutocomplete from "../PlaceAutocomplete";
import {
  CALL_DRIVER_AIRPORTS,
  CALL_DRIVER_SERVICES,
  addCalendarDays,
  callDriverServiceById,
  inclusiveCalendarDays,
  todayISODate
} from "../../lib/callDriver";
import CallDriverServiceSeo from "./CallDriverServiceSeo";
import { authHeaders, buildLoginHref, getToken, isLoggedIn } from "../../lib/auth";
import { loadCheckoutDraft, saveCheckoutDraft } from "../../lib/checkoutStorage";
import { upsertEnquiry } from "../../lib/enquiryCapture";
import { formatInrCurrency } from "../../lib/formatInr";
import { inputBaseClass, typo } from "../../lib/typography";
import { SEARCH_FIELD_ICONS, SEARCH_FIELD_ICON_CHIPS } from "../icons/heroIcons";

const inputCls = `${inputBaseClass} max-sm:min-h-12`;
const areaCls = `${inputBaseClass} h-auto min-h-[4.5rem] py-2.5`;
const PER_DAY_HOURS = 12;
const HOUR_CHIPS = {
  local: [3, 4, 6, 8, 10, 12],
  airport: [3, 4, 6, 8, 10, 12],
  valet: [5, 6, 8, 10, 12]
};
const DAY_CHIPS = [1, 2, 3, 4, 5];
const EXTRA_HOUR_CHIPS = [0, 1, 2, 3, 4];
const SERVICE_HINTS = {
  local: "From ₹450 · 3 hrs min · extra ₹100/hr · night ₹100 after 10:15 PM",
  outstation: "Return ₹1,500/day + stay · One-way ₹1,700 including bus fare",
  airport: "From ₹450 · 3 hrs min · extra ₹100/hr · your car at the airport",
  school: "Monthly from ₹22,000 · Cabzii sends a quote after you submit",
  corporate: "Office and event drivers · quoted from your schedule",
  valet: "From ₹600 / driver · 5 hrs min · 1 supervisor per 10 drivers"
};

function Field({ label, children, className = "", hint = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className={typo.label}>{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint ? <p className="mt-1 text-[11px] leading-snug text-slate-500">{hint}</p> : null}
    </label>
  );
}

function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cabzii-tap min-h-10 shrink-0 rounded-full px-3.5 text-sm font-semibold ring-1 transition ${
        selected
          ? "bg-[var(--cabzii-brand)] text-white ring-[var(--cabzii-brand)]"
          : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function ChoiceCard({ selected, onClick, title, subtitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cabzii-tap rounded-2xl border p-3.5 text-left transition ${
        selected
          ? "border-[var(--cabzii-brand)] bg-blue-50/70 shadow-sm ring-1 ring-[var(--cabzii-brand)]"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <span className="block text-sm font-bold text-slate-900">{title}</span>
      <span className="mt-0.5 block text-[11px] leading-snug text-slate-500 sm:text-xs">{subtitle}</span>
    </button>
  );
}

function emptyForm(serviceId) {
  const today = todayISODate();
  return {
    pickup: "",
    drop: "",
    date: today,
    pickupTime: "09:00",
    hours: serviceId === "valet" ? 5 : serviceId === "outstation" ? 12 : 3,
    extraHours: 0,
    days: 1,
    returnDate: today,
    tripMode: "return",
    vehicleType: "standard",
    vehicleModel: "",
    estimatedKm: "",
    notes: "",
    airport: "Chennai International Airport (MAA)",
    airportDirection: "pickup",
    schoolName: "",
    schoolShift: "morning",
    workingDays: 22,
    parentContact: "",
    companyName: "",
    contactPerson: "",
    companyPhone: "",
    driversRequired: 1,
    workingHours: "",
    eventLocation: "",
    requirement: ""
  };
}

function lineAmountLabel(line) {
  if (line?.note && !Number(line.amount)) return line.note;
  return formatInrCurrency(line?.amount || 0);
}

function FareBreakdown({ quote, serviceId }) {
  if (!quote) {
    return <p className="text-sm text-slate-500">Enter trip details to see the fare.</p>;
  }
  if (quote.quoteOnly) {
    return <p className="text-sm font-semibold text-slate-800">{quote.quoteMessage}</p>;
  }
  return (
    <>
      <p className={typo.label}>Estimated fare</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{formatInrCurrency(quote.total)}</p>
      <ul className="mt-3 divide-y divide-slate-100 text-sm text-slate-600">
        {(quote.lines || []).map((line) => (
          <li key={line.label} className="flex justify-between gap-3 py-1.5">
            <span>{line.label}</span>
            <span className={`shrink-0 font-semibold ${line.note && !Number(line.amount) ? "text-amber-700" : "text-slate-900"}`}>
              {lineAmountLabel(line)}
            </span>
          </li>
        ))}
      </ul>
      {quote.foodStayNote ? <p className="mt-3 text-xs leading-relaxed text-slate-500">{quote.foodStayNote}</p> : null}
      {serviceId === "valet" ? (
        <p className="mt-3 text-xs text-slate-500">Supervisors: {quote.supervisorCount || 0} (one for every 10 drivers)</p>
      ) : null}
      {quote.nightApplied ? (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          Night charge included — pickup is between 10:15 PM and 5:30 AM.
        </p>
      ) : null}
    </>
  );
}

export default function CallDriverBookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service") || "";
  const service = callDriverServiceById(serviceId);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => emptyForm(serviceId));
  const [quote, setQuote] = useState(null);
  const [liveQuote, setLiveQuote] = useState(null);
  const [quoting, setQuoting] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const liveTimer = useRef(null);

  useEffect(() => {
    const draft = loadCheckoutDraft();
    const pickup = searchParams.get("pickup") || draft.pickup || "";
    const drop = searchParams.get("drop") || draft.drop || "";
    const date = searchParams.get("date") || draft.date || todayISODate();
    const pickupTime =
      searchParams.get("time") || searchParams.get("pickupTime") || draft.pickupTime || draft.time || "09:00";
    const next = emptyForm(serviceId);
    setForm({
      ...next,
      pickup,
      drop,
      date,
      pickupTime,
      returnDate: date
    });
    setQuote(null);
    setLiveQuote(null);
    setStep(1);
    setError("");
  }, [serviceId]);

  const patch = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const outstationDays = useMemo(() => {
    if (serviceId !== "outstation" || form.tripMode === "one_way") return 1;
    return inclusiveCalendarDays(form.date, form.returnDate) || Math.max(1, Number(form.days) || 1);
  }, [serviceId, form.tripMode, form.date, form.returnDate, form.days]);

  const outstationHours = useMemo(() => {
    if (form.tripMode === "one_way") return 0;
    return outstationDays * PER_DAY_HOURS + Math.max(0, Number(form.extraHours) || 0);
  }, [form.tripMode, form.extraHours, outstationDays]);

  const callDriverPayload = useMemo(() => {
    const base = {
      serviceType: serviceId,
      vehicleType: form.vehicleType,
      vehicleModel: form.vehicleModel,
      hours: Number(form.hours) || undefined,
      pickupTime: form.pickupTime,
      notes: form.notes
    };
    if (serviceId === "outstation") {
      return {
        ...base,
        date: form.date,
        days: outstationDays,
        hours: outstationHours || undefined,
        estimatedKm: Number(form.estimatedKm) || undefined,
        returnDate: form.tripMode === "one_way" ? "" : form.returnDate,
        tripMode: form.tripMode || "return"
      };
    }
    if (serviceId === "airport") {
      return {
        ...base,
        airport: form.airport,
        airportDirection: form.airportDirection
      };
    }
    if (serviceId === "school") {
      return {
        ...base,
        schoolName: form.schoolName,
        schoolShift: form.schoolShift,
        workingDays: Number(form.workingDays) || undefined,
        parentContact: form.parentContact,
        notes: form.requirement || form.notes
      };
    }
    if (serviceId === "corporate") {
      return {
        ...base,
        companyName: form.companyName,
        contactPerson: form.contactPerson,
        driversRequired: Number(form.driversRequired) || undefined,
        workingHours: form.workingHours,
        days: Number(form.days) || undefined,
        notes: form.requirement || form.notes
      };
    }
    if (serviceId === "valet") {
      return {
        ...base,
        eventLocation: form.eventLocation,
        driversRequired: Number(form.driversRequired) || 1,
        hours: Number(form.hours) || 5
      };
    }
    return base;
  }, [form, serviceId, outstationDays, outstationHours]);

  const pickupLabel = serviceId === "valet" ? form.eventLocation || form.pickup : form.pickup;
  const dropLabel =
    serviceId === "airport"
      ? form.airportDirection === "drop"
        ? form.pickup
        : form.airport
      : form.drop;

  function switchService(id) {
    if (id === serviceId) return;
    const params = new URLSearchParams();
    params.set("service", id);
    if (form.pickup) params.set("pickup", form.pickup);
    if (form.drop) params.set("drop", form.drop);
    if (form.date) params.set("date", form.date);
    if (form.pickupTime) params.set("time", form.pickupTime);
    router.push(`/call-driver/book?${params.toString()}`);
  }

  function setTravelDate(date) {
    setForm((prev) => {
      let returnDate = prev.returnDate || date;
      if (prev.tripMode !== "one_way" && (!returnDate || returnDate < date)) returnDate = date;
      const days = inclusiveCalendarDays(date, returnDate) || 1;
      return { ...prev, date, returnDate, days };
    });
  }

  function setReturnDate(returnDate) {
    setForm((prev) => {
      const days = inclusiveCalendarDays(prev.date, returnDate) || 1;
      return { ...prev, returnDate, days };
    });
  }

  function setReturnDays(days) {
    const n = Math.max(1, Number(days) || 1);
    setForm((prev) => ({
      ...prev,
      days: n,
      extraHours: prev.extraHours,
      returnDate: addCalendarDays(prev.date, n - 1)
    }));
  }

  function setTripMode(mode) {
    setForm((prev) => {
      if (mode === "one_way") return { ...prev, tripMode: mode };
      const returnDate = prev.returnDate && prev.returnDate >= prev.date ? prev.returnDate : prev.date;
      const days = inclusiveCalendarDays(prev.date, returnDate) || 1;
      return { ...prev, tripMode: mode, returnDate, days };
    });
  }

  async function fetchQuote() {
    const res = await fetch("/api/call-driver/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(callDriverPayload)
    });
    const json = await res.json();
    if (!res.ok || json?.success === false) throw new Error(json?.message || "Could not calculate fare");
    return json.data;
  }

  useEffect(() => {
    if (!service || service.quoteOnly || step !== 1) return undefined;
    if (!form.date || !form.pickupTime) return undefined;
    if (serviceId === "valet" && !form.eventLocation.trim()) return undefined;
    if (serviceId !== "valet" && !form.pickup.trim()) return undefined;
    if (liveTimer.current) clearTimeout(liveTimer.current);
    liveTimer.current = setTimeout(() => {
      fetchQuote()
        .then((data) => setLiveQuote(data))
        .catch(() => {});
    }, 350);
    return () => {
      if (liveTimer.current) clearTimeout(liveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- quote when trip fields that affect fare change
  }, [
    serviceId,
    step,
    form.hours,
    form.extraHours,
    form.days,
    form.date,
    form.returnDate,
    form.pickupTime,
    form.tripMode,
    form.vehicleType,
    form.driversRequired,
    form.estimatedKm,
    form.pickup,
    form.eventLocation,
    outstationDays,
    outstationHours
  ]);

  async function loadQuote() {
    setQuoting(true);
    setError("");
    try {
      const data = await fetchQuote();
      setQuote(data);
      setLiveQuote(data);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not calculate fare");
    } finally {
      setQuoting(false);
    }
  }

  function validateStep1() {
    if (!form.date) return "Select a date.";
    if (!form.pickupTime) return "Select pickup time.";
    if (serviceId === "valet") {
      if (!form.eventLocation.trim()) return "Enter the event or location.";
      if (!form.driversRequired || Number(form.driversRequired) < 1) return "Enter number of drivers.";
      return "";
    }
    if (serviceId === "corporate") {
      if (!form.companyName.trim()) return "Enter company name.";
      if (!form.contactPerson.trim()) return "Enter contact person.";
      if (!form.pickup.trim()) return "Enter pickup location.";
      return "";
    }
    if (serviceId === "school") {
      if (!form.pickup.trim()) return "Enter pickup location.";
      if (!form.schoolName.trim()) return "Enter school location.";
      if (!form.parentContact.trim()) return "Enter parent contact.";
      return "";
    }
    if (!form.pickup.trim()) return "Enter pickup location.";
    if (serviceId === "airport") {
      if (!form.airport) return "Select the airport.";
      if (Number(form.hours) < 3) return "Airport Call Driver has a 3-hour minimum.";
      return "";
    }
    if (serviceId === "outstation") {
      if (!form.drop.trim()) return "Enter destination.";
      if (form.tripMode !== "one_way") {
        if (!form.returnDate) return "Select a return date.";
        if (form.returnDate < form.date) return "Return date cannot be before travel date.";
      }
      return "";
    }
    if (!form.drop.trim() && serviceId !== "corporate") return "Enter destination.";
    if (serviceId === "local" && Number(form.hours) < 3) return "Local Call Driver has a 3-hour minimum.";
    if (serviceId === "airport" && Number(form.hours) < 3) return "Airport Call Driver has a 3-hour minimum.";
    if (serviceId === "valet" && Number(form.hours) < 5) return "Valet parking has a 5-hour minimum.";
    return "";
  }

  function continueToQuote() {
    const msg = validateStep1();
    if (msg) {
      setError(msg);
      return;
    }
    loadQuote();
  }

  function captureDriverEnquiry() {
    const phone = form.parentContact || form.companyPhone || "";
    return upsertEnquiry({
      name: form.contactPerson || form.companyName || "",
      phone,
      pickup: pickupLabel,
      drop: dropLabel || form.schoolName || "",
      travelDate: form.date,
      pickupTime: form.pickupTime,
      service: "driver",
      tripType: serviceId,
      message: form.notes || form.requirement || "",
      ctaLocation: "call_driver_book"
    });
  }

  function paymentQuery() {
    const total = Number(quote?.total || 0);
    const vehicle = service?.title || "Call Driver";
    saveCheckoutDraft({
      callDriver: callDriverPayload,
      pickup: pickupLabel,
      drop: dropLabel,
      date: form.date,
      time: form.pickupTime,
      pickupTime: form.pickupTime,
      vehicleName: vehicle,
      total: String(total),
      packageLine: vehicle,
      serviceTripType: serviceId
    });
    return new URLSearchParams({
      type: "driver",
      service: serviceId,
      pickup: pickupLabel || "",
      drop: dropLabel || "",
      date: form.date || "",
      time: form.pickupTime || "",
      baseFare: String(total),
      total: String(total),
      package: vehicle,
      vehicle,
      callDriver: "1"
    });
  }

  function goToCheckout() {
    captureDriverEnquiry();
    const q = paymentQuery();
    const next = `/payment?${q.toString()}`;
    if (!isLoggedIn() || !getToken()) {
      router.push(buildLoginHref(next, "customer"));
      return;
    }
    router.push(next);
  }

  async function submitQuoteRequest() {
    if (!isLoggedIn() || !getToken()) {
      const q = paymentQuery();
      router.push(buildLoginHref(`/call-driver/book?service=${encodeURIComponent(serviceId)}&${q.toString()}`, "customer"));
      return;
    }
    await captureDriverEnquiry();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          customerName: form.contactPerson || form.companyName || "Cabzii customer",
          phone: form.parentContact || form.companyPhone || undefined,
          type: "driver",
          pickup: pickupLabel,
          drop: dropLabel || form.schoolName || "",
          date: form.date,
          pickupTime: form.pickupTime,
          serviceTripType: serviceId,
          callDriver: callDriverPayload,
          amount: 0,
          paymentMethod: "cash"
        })
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Could not submit request");
      router.push("/my-bookings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit request");
    } finally {
      setSubmitting(false);
    }
  }

  if (!service) {
    return (
      <div className="section-shell py-12 text-center">
        <p className="text-sm text-slate-600">Select a Call Driver service to continue.</p>
        <Link href="/call-driver" className="cabzii-btn cabzii-btn-cta cabzii-tap mt-4">
          View Call Driver services
        </Link>
      </div>
    );
  }

  const showVehicleType = serviceId === "local" || serviceId === "airport" || serviceId === "outstation";
  const hourChips = HOUR_CHIPS[serviceId] || [];
  const displayQuote = step === 2 ? quote : liveQuote;
  const primaryLabel = quoting
    ? "Calculating…"
    : service.quoteOnly
      ? "Continue"
      : displayQuote && !displayQuote.quoteOnly
        ? `Continue · ${formatInrCurrency(displayQuote.total)}`
        : "See fare";

  return (
    <div className="bg-slate-50 pb-28 sm:pb-10">
      <div className="section-shell py-4 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <Link href="/call-driver" className="text-[12px] font-semibold text-[var(--cabzii-brand)]">
            ← All Call Driver services
          </Link>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className={typo.eyebrow}>Call Driver · your car</p>
              <h1 className="mt-1 text-[1.4rem] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl">
                {service.title}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">{SERVICE_HINTS[serviceId] || service.blurb}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CALL_DRIVER_SERVICES.map((item) => (
              <Chip key={item.id} selected={item.id === serviceId} onClick={() => switchService(item.id)}>
                {item.shortTitle}
              </Chip>
            ))}
          </div>

          <ol className="mt-4 flex max-w-md gap-2">
            {[
              { n: 1, label: "Trip details" },
              { n: 2, label: service.quoteOnly ? "Request" : "Confirm fare" }
            ].map((item) => (
              <li
                key={item.n}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold sm:text-xs ${
                  step === item.n ? "bg-[var(--cabzii-brand)] text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"
                }`}
              >
                <span>{item.n}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ol>

          {error ? (
            <p className="mt-4 max-w-3xl rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700">{error}</p>
          ) : null}

          <div className="mt-4 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19.5rem]">
            <div>
              {step === 1 ? (
                <form
                  className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    continueToQuote();
                  }}
                >
                  {serviceId === "valet" ? (
                    <Field label="Event / location">
                      <input
                        className={inputCls}
                        value={form.eventLocation}
                        onChange={(e) => patch("eventLocation", e.target.value)}
                        placeholder="Venue, hall or residence"
                      />
                    </Field>
                  ) : (
                    <PlaceAutocomplete
                      label={serviceId === "airport" && form.airportDirection === "drop" ? "Drop location" : "Pickup location"}
                      value={form.pickup}
                      onChange={(v) => patch("pickup", v)}
                      placeholder="Search pickup address"
                      leadingIcon={SEARCH_FIELD_ICONS.pickup}
                      leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.pickup}
                    />
                  )}

                  {serviceId === "airport" ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Airport">
                        <select className={inputCls} value={form.airport} onChange={(e) => patch("airport", e.target.value)}>
                          {CALL_DRIVER_AIRPORTS.map((a) => (
                            <option key={a.id} value={a.label}>
                              {a.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <div>
                        <p className={typo.label}>Pickup or drop</p>
                        <div className="mt-1.5 grid grid-cols-2 gap-2">
                          <ChoiceCard
                            selected={form.airportDirection === "pickup"}
                            onClick={() => patch("airportDirection", "pickup")}
                            title="Airport pickup"
                            subtitle="Driver meets you at arrivals"
                          />
                          <ChoiceCard
                            selected={form.airportDirection === "drop"}
                            onClick={() => patch("airportDirection", "drop")}
                            title="Airport drop"
                            subtitle="Driver takes you to the terminal"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {serviceId === "school" ? (
                    <PlaceAutocomplete
                      label="School location"
                      value={form.schoolName}
                      onChange={(v) => patch("schoolName", v)}
                      placeholder="School name or address"
                      leadingIcon={SEARCH_FIELD_ICONS.drop}
                      leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.drop}
                    />
                  ) : null}

                  {serviceId !== "valet" && serviceId !== "airport" && serviceId !== "school" && serviceId !== "corporate" ? (
                    <PlaceAutocomplete
                      label="Destination"
                      value={form.drop}
                      onChange={(v) => patch("drop", v)}
                      placeholder="Search drop location"
                      leadingIcon={SEARCH_FIELD_ICONS.drop}
                      leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.drop}
                    />
                  ) : null}

                  {serviceId === "corporate" ? (
                    <>
                      <Field label="Company name">
                        <input
                          className={inputCls}
                          value={form.companyName}
                          onChange={(e) => patch("companyName", e.target.value)}
                          placeholder="Company name"
                        />
                      </Field>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Contact person">
                          <input
                            className={inputCls}
                            value={form.contactPerson}
                            onChange={(e) => patch("contactPerson", e.target.value)}
                            placeholder="Name"
                          />
                        </Field>
                        <Field label="Phone">
                          <input
                            className={inputCls}
                            inputMode="numeric"
                            maxLength={10}
                            value={form.companyPhone}
                            onChange={(e) => patch("companyPhone", e.target.value)}
                            placeholder="10-digit mobile"
                          />
                        </Field>
                      </div>
                    </>
                  ) : null}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label={serviceId === "outstation" ? "Travel date" : "Date"}>
                      <input type="date" className={inputCls} value={form.date} onChange={(e) => setTravelDate(e.target.value)} />
                    </Field>
                    <Field label="Pickup time">
                      <input
                        type="time"
                        className={inputCls}
                        value={form.pickupTime}
                        onChange={(e) => patch("pickupTime", e.target.value)}
                      />
                    </Field>
                  </div>

                  {serviceId === "outstation" ? (
                    <div>
                      <p className={typo.label}>Trip type</p>
                      <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                        <ChoiceCard
                          selected={form.tripMode !== "one_way"}
                          onClick={() => setTripMode("return")}
                          title="Return · ₹1,500 / day"
                          subtitle="12 hrs per day. Driver stay is extra."
                        />
                        <ChoiceCard
                          selected={form.tripMode === "one_way"}
                          onClick={() => setTripMode("one_way")}
                          title="One-way · ₹1,700"
                          subtitle="Min 250 km. Bus fare included. No stay."
                        />
                      </div>
                    </div>
                  ) : null}

                  {serviceId === "outstation" && form.tripMode !== "one_way" ? (
                    <>
                      <Field label="Return date" hint={`${outstationDays} day${outstationDays === 1 ? "" : "s"} · ${outstationDays * PER_DAY_HOURS} hrs included`}>
                        <input
                          type="date"
                          min={form.date || undefined}
                          className={inputCls}
                          value={form.returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                        />
                      </Field>
                      <div>
                        <p className={typo.label}>Days</p>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {DAY_CHIPS.map((d) => (
                            <Chip key={d} selected={outstationDays === d} onClick={() => setReturnDays(d)}>
                              {d} day{d === 1 ? "" : "s"}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className={typo.label}>Extra hours after {outstationDays * PER_DAY_HOURS} hrs</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          {EXTRA_HOUR_CHIPS.map((h) => (
                            <Chip key={h} selected={Number(form.extraHours) === h} onClick={() => patch("extraHours", h)}>
                              {h === 0 ? "None" : `+${h} hr`}
                            </Chip>
                          ))}
                          <input
                            type="number"
                            min={0}
                            className={`${inputCls} w-24`}
                            value={form.extraHours}
                            onChange={(e) => patch("extraHours", Math.max(0, Number(e.target.value) || 0))}
                            aria-label="Custom extra hours"
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500">₹100 per extra hour. Accommodation is not in this fare.</p>
                      </div>
                    </>
                  ) : null}

                  {serviceId === "outstation" && form.tripMode === "one_way" ? (
                    <Field label="Estimated KM" hint="One-way rate is ₹1,700 for a minimum 250 km, including bus fare.">
                      <input
                        type="number"
                        min={0}
                        className={inputCls}
                        value={form.estimatedKm}
                        onChange={(e) => patch("estimatedKm", e.target.value)}
                        placeholder="e.g. 280"
                      />
                    </Field>
                  ) : null}

                  {hourChips.length ? (
                    <div>
                      <p className={typo.label}>Hours</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {hourChips.map((h) => (
                          <Chip key={h} selected={Number(form.hours) === h} onClick={() => patch("hours", h)}>
                            {h} hrs
                          </Chip>
                        ))}
                        <input
                          type="number"
                          min={serviceId === "valet" ? 5 : 3}
                          className={`${inputCls} w-24`}
                          value={form.hours}
                          onChange={(e) => patch("hours", e.target.value)}
                          aria-label="Custom hours"
                        />
                      </div>
                    </div>
                  ) : null}

                  {showVehicleType ? (
                    <div>
                      <p className={typo.label}>Your car</p>
                      <div className="mt-1.5 grid grid-cols-2 gap-2">
                        <ChoiceCard
                          selected={form.vehicleType === "standard"}
                          onClick={() => patch("vehicleType", "standard")}
                          title="Normal"
                          subtitle="Dzire, Etios, similar"
                        />
                        <ChoiceCard
                          selected={form.vehicleType === "premium"}
                          onClick={() => patch("vehicleType", "premium")}
                          title="Luxury"
                          subtitle="Innova, SUV, similar"
                        />
                      </div>
                      <Field label="Vehicle model (optional)" className="mt-3">
                        <input
                          className={inputCls}
                          value={form.vehicleModel}
                          onChange={(e) => patch("vehicleModel", e.target.value)}
                          placeholder="e.g. Dzire, Innova"
                        />
                      </Field>
                    </div>
                  ) : null}

                  {serviceId === "outstation" && form.tripMode !== "one_way" ? (
                    <Field label="Estimated KM (optional)">
                      <input
                        type="number"
                        min={0}
                        className={inputCls}
                        value={form.estimatedKm}
                        onChange={(e) => patch("estimatedKm", e.target.value)}
                        placeholder="Highway km, if you know it"
                      />
                    </Field>
                  ) : null}

                  {serviceId === "school" ? (
                    <>
                      <div>
                        <p className={typo.label}>Shift</p>
                        <div className="mt-1.5 grid grid-cols-3 gap-2">
                          {["morning", "evening", "both"].map((shift) => (
                            <Chip key={shift} selected={form.schoolShift === shift} onClick={() => patch("schoolShift", shift)}>
                              {shift[0].toUpperCase() + shift.slice(1)}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Working days / month">
                          <input
                            type="number"
                            min={1}
                            className={inputCls}
                            value={form.workingDays}
                            onChange={(e) => patch("workingDays", e.target.value)}
                          />
                        </Field>
                        <Field label="Parent contact">
                          <input
                            className={inputCls}
                            inputMode="numeric"
                            maxLength={10}
                            value={form.parentContact}
                            onChange={(e) => patch("parentContact", e.target.value)}
                            placeholder="10-digit mobile"
                          />
                        </Field>
                      </div>
                    </>
                  ) : null}

                  {serviceId === "corporate" ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Drivers needed">
                          <input
                            type="number"
                            min={1}
                            className={inputCls}
                            value={form.driversRequired}
                            onChange={(e) => patch("driversRequired", e.target.value)}
                          />
                        </Field>
                        <Field label="Days">
                          <input
                            type="number"
                            min={1}
                            className={inputCls}
                            value={form.days}
                            onChange={(e) => patch("days", e.target.value)}
                          />
                        </Field>
                      </div>
                      <Field label="Working hours">
                        <input
                          className={inputCls}
                          value={form.workingHours}
                          onChange={(e) => patch("workingHours", e.target.value)}
                          placeholder="9 AM – 6 PM"
                        />
                      </Field>
                      <Field label="Requirement">
                        <textarea
                          className={areaCls}
                          rows={3}
                          value={form.requirement}
                          onChange={(e) => patch("requirement", e.target.value)}
                          placeholder="Office travel, events, monthly driver…"
                        />
                      </Field>
                    </>
                  ) : null}

                  {serviceId === "valet" ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Drivers">
                        <input
                          type="number"
                          min={1}
                          className={inputCls}
                          value={form.driversRequired}
                          onChange={(e) => patch("driversRequired", e.target.value)}
                        />
                      </Field>
                    </div>
                  ) : null}

                  {serviceId !== "corporate" ? (
                    <Field label="Notes (optional)">
                      <textarea
                        className={areaCls}
                        rows={2}
                        value={form.notes}
                        onChange={(e) => patch("notes", e.target.value)}
                        placeholder="Gate code, car details, instructions"
                      />
                    </Field>
                  ) : null}

                  <button type="submit" disabled={quoting} className="cabzii-btn cabzii-btn-cta cabzii-tap hidden min-h-12 w-full sm:flex">
                    {primaryLabel}
                  </button>
                </form>
              ) : null}

              {step === 2 && quote ? (
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:hidden">
                  <FareBreakdown quote={quote} serviceId={serviceId} />
                  <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    Driver: Professional Cabzii Driver. Assigned after booking.
                  </p>
                  <div className="hidden gap-3 sm:flex">
                    <button type="button" onClick={() => setStep(1)} className="cabzii-btn cabzii-btn-secondary cabzii-tap min-h-12 flex-1">
                      Back
                    </button>
                    {quote.quoteOnly ? (
                      <button
                        type="button"
                        onClick={submitQuoteRequest}
                        disabled={submitting}
                        className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-12 flex-[2]"
                      >
                        {submitting ? "Sending…" : service.cta}
                      </button>
                    ) : (
                      <button type="button" onClick={goToCheckout} className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-12 flex-[2]">
                        Book this service
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-20 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <FareBreakdown quote={displayQuote} serviceId={serviceId} />
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  Professional Cabzii driver assigned after you confirm. 50% advance.
                </p>
                {step === 2 && quote ? (
                  <div className="flex flex-col gap-2">
                    <button type="button" onClick={() => setStep(1)} className="cabzii-btn cabzii-btn-secondary cabzii-tap min-h-11 w-full">
                      Edit details
                    </button>
                    {quote.quoteOnly ? (
                      <button
                        type="button"
                        onClick={submitQuoteRequest}
                        disabled={submitting}
                        className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-11 w-full"
                      >
                        {submitting ? "Sending…" : service.cta}
                      </button>
                    ) : (
                      <button type="button" onClick={goToCheckout} className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-11 w-full">
                        Book this service
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={quoting}
                    onClick={continueToQuote}
                    className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-11 w-full"
                  >
                    {primaryLabel}
                  </button>
                )}
              </div>
            </aside>
          </div>

          <details className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-800">About this Call Driver service</summary>
            <div className="mt-4">
              <CallDriverServiceSeo serviceId={serviceId} compact />
            </div>
          </details>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        {step === 1 ? (
          <div className="flex items-center gap-3">
            {displayQuote && !displayQuote.quoteOnly ? (
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Estimate</p>
                <p className="text-lg font-extrabold leading-none text-slate-900">{formatInrCurrency(displayQuote.total)}</p>
              </div>
            ) : null}
            <button
              type="button"
              disabled={quoting}
              onClick={continueToQuote}
              className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-12 flex-1 text-base"
            >
              {quoting ? "Calculating…" : service.quoteOnly ? "Continue" : "See fare"}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="cabzii-btn cabzii-btn-secondary cabzii-tap min-h-12 flex-1">
              Back
            </button>
            {quote?.quoteOnly ? (
              <button
                type="button"
                onClick={submitQuoteRequest}
                disabled={submitting}
                className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-12 flex-[2]"
              >
                {submitting ? "Sending…" : service.cta}
              </button>
            ) : (
              <button type="button" onClick={goToCheckout} className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-12 flex-[2]">
                Book · {formatInrCurrency(quote?.total || 0)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
