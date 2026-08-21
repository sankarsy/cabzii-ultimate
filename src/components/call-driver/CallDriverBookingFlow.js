"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { SegmentedOption } from "../ui/RadioOption";
import {
  CALL_DRIVER_AIRPORTS,
  callDriverServiceById,
  todayISODate
} from "../../lib/callDriver";
import { authHeaders, buildLoginHref, getToken, isLoggedIn } from "../../lib/auth";
import { saveCheckoutDraft } from "../../lib/checkoutStorage";
import { inputBaseClass, typo } from "../../lib/typography";
import { SEARCH_FIELD_ICONS, SEARCH_FIELD_ICON_CHIPS } from "../icons/heroIcons";

const inputCls = `${inputBaseClass} max-sm:min-h-12`;
const areaCls = `${inputBaseClass} h-auto min-h-[5.5rem] py-2.5`;

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className={typo.label}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function emptyForm(serviceId) {
  return {
    pickup: "",
    drop: "",
    date: todayISODate(),
    pickupTime: "09:00",
    hours: serviceId === "valet" ? 5 : serviceId === "outstation" ? 12 : 4,
    days: 1,
    returnDate: "",
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

export default function CallDriverBookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service") || "";
  const service = callDriverServiceById(serviceId);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => emptyForm(serviceId));
  const [quote, setQuote] = useState(null);
  const [quoting, setQuoting] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(emptyForm(serviceId));
    setQuote(null);
    setStep(1);
  }, [serviceId]);

  const patch = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

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
        days: Number(form.days) || 1,
        estimatedKm: Number(form.estimatedKm) || undefined,
        returnDate: form.returnDate
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
  }, [form, serviceId]);

  const pickupLabel = serviceId === "valet" ? form.eventLocation || form.pickup : form.pickup;
  const dropLabel =
    serviceId === "airport"
      ? form.airportDirection === "drop"
        ? form.pickup
        : form.airport
      : form.drop;

  async function loadQuote() {
    setQuoting(true);
    setError("");
    try {
      const res = await fetch("/api/call-driver/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(callDriverPayload)
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Could not calculate fare");
      setQuote(json.data);
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
      return "";
    }
    if (!form.drop.trim() && serviceId !== "corporate") return "Enter destination.";
    if (serviceId === "local" && Number(form.hours) < 4) return "Local Call Driver has a 4-hour minimum.";
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

  function goToCheckout() {
    if (!isLoggedIn() || !getToken()) {
      const next = `/call-driver/book?service=${encodeURIComponent(serviceId)}`;
      router.push(buildLoginHref(next, "customer"));
      return;
    }
    const total = Number(quote?.total || 0);
    saveCheckoutDraft({
      callDriver: callDriverPayload,
      pickup: pickupLabel,
      drop: dropLabel,
      date: form.date,
      pickupTime: form.pickupTime
    });
    const q = new URLSearchParams({
      type: "driver",
      service: serviceId,
      pickup: pickupLabel,
      drop: dropLabel || "",
      date: form.date,
      time: form.pickupTime,
      baseFare: String(total),
      total: String(total),
      package: service?.title || "Call Driver",
      callDriver: "1"
    });
    router.push(`/payment?${q.toString()}`);
  }

  async function submitQuoteRequest() {
    if (!isLoggedIn() || !getToken()) {
      const next = `/call-driver/book?service=${encodeURIComponent(serviceId)}`;
      router.push(buildLoginHref(next, "customer"));
      return;
    }
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
  const primaryLabel = quoting
    ? "Calculating…"
    : service.quoteOnly
      ? "Continue"
      : "Calculate price";

  return (
    <div className="bg-slate-50 pb-28 sm:pb-10">
      <div className="section-shell py-4 sm:py-8">
        <div className="mx-auto w-full max-w-lg">
        <Link href="/call-driver" className="text-[12px] font-semibold text-[var(--cabzii-brand)]">
          ← All Call Driver services
        </Link>
        <p className={`${typo.eyebrow} mt-3`}>Call Driver Service</p>
        <h1 className="mt-1 text-[1.35rem] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl">
          {service.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{service.blurb}</p>

        <ol className="mt-4 flex gap-2">
          {[
            { n: 1, label: "Details" },
            { n: 2, label: service.quoteOnly ? "Request" : "Fare" }
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
          <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700">{error}</p>
        ) : null}

        {step === 1 ? (
          <form
            className="mt-4 space-y-3.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:space-y-4 sm:p-5"
            onSubmit={(e) => {
              e.preventDefault();
              continueToQuote();
            }}
          >
            {serviceId === "valet" ? (
              <Field label="Event / location">
                <input className={inputCls} value={form.eventLocation} onChange={(e) => patch("eventLocation", e.target.value)} placeholder="Venue, hall or residence" />
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
              <>
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
                  <div className="cabzii-segmented mt-1.5">
                    <SegmentedOption name="airportdir" className="cabzii-tap min-h-10 flex-1" checked={form.airportDirection === "pickup"} onChange={() => patch("airportDirection", "pickup")} label="Airport pickup" />
                    <SegmentedOption name="airportdir" className="cabzii-tap min-h-10 flex-1" checked={form.airportDirection === "drop"} onChange={() => patch("airportDirection", "drop")} label="Airport drop" />
                  </div>
                </div>
              </>
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
                  <input className={inputCls} value={form.companyName} onChange={(e) => patch("companyName", e.target.value)} placeholder="Company name" />
                </Field>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Contact person">
                    <input className={inputCls} value={form.contactPerson} onChange={(e) => patch("contactPerson", e.target.value)} placeholder="Name" />
                  </Field>
                  <Field label="Phone">
                    <input className={inputCls} inputMode="numeric" maxLength={10} value={form.companyPhone} onChange={(e) => patch("companyPhone", e.target.value)} placeholder="10-digit mobile" />
                  </Field>
                </div>
              </>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label={serviceId === "outstation" ? "Travel date" : "Date"}>
                <input type="date" className={inputCls} value={form.date} onChange={(e) => patch("date", e.target.value)} />
              </Field>
              <Field label="Pickup time">
                <input type="time" className={inputCls} value={form.pickupTime} onChange={(e) => patch("pickupTime", e.target.value)} />
              </Field>
            </div>

            {serviceId === "outstation" ? (
              <Field label="Return date (optional)">
                <input type="date" className={inputCls} value={form.returnDate} onChange={(e) => patch("returnDate", e.target.value)} />
              </Field>
            ) : null}

            {serviceId === "local" || serviceId === "airport" || serviceId === "outstation" ? (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Hours">
                  <input
                    type="number"
                    min={serviceId === "local" || serviceId === "airport" ? 4 : 1}
                    className={inputCls}
                    value={form.hours}
                    onChange={(e) => patch("hours", e.target.value)}
                  />
                </Field>
                {serviceId === "outstation" ? (
                  <Field label="Days">
                    <input type="number" min={1} className={inputCls} value={form.days} onChange={(e) => patch("days", e.target.value)} />
                  </Field>
                ) : (
                  <Field label="Vehicle model">
                    <input className={inputCls} value={form.vehicleModel} onChange={(e) => patch("vehicleModel", e.target.value)} placeholder="Dzire" />
                  </Field>
                )}
              </div>
            ) : null}

            {showVehicleType ? (
              <div>
                <p className={typo.label}>Vehicle type</p>
                <div className="cabzii-segmented mt-1.5">
                  <SegmentedOption name="vehicleType" className="cabzii-tap min-h-10 flex-1" checked={form.vehicleType === "standard"} onChange={() => patch("vehicleType", "standard")} label="Standard" />
                  <SegmentedOption name="vehicleType" className="cabzii-tap min-h-10 flex-1" checked={form.vehicleType === "premium"} onChange={() => patch("vehicleType", "premium")} label="Premium" />
                </div>
              </div>
            ) : null}

            {serviceId === "outstation" ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Vehicle model">
                  <input className={inputCls} value={form.vehicleModel} onChange={(e) => patch("vehicleModel", e.target.value)} placeholder="Innova, Dzire…" />
                </Field>
                <Field label="Estimated KM">
                  <input type="number" min={0} className={inputCls} value={form.estimatedKm} onChange={(e) => patch("estimatedKm", e.target.value)} placeholder="e.g. 350" />
                </Field>
              </div>
            ) : null}

            {serviceId === "school" ? (
              <>
                <div>
                  <p className={typo.label}>Shift</p>
                  <div className="cabzii-segmented mt-1.5">
                    <SegmentedOption name="schoolShift" className="cabzii-tap min-h-10 flex-1" checked={form.schoolShift === "morning"} onChange={() => patch("schoolShift", "morning")} label="Morning" />
                    <SegmentedOption name="schoolShift" className="cabzii-tap min-h-10 flex-1" checked={form.schoolShift === "evening"} onChange={() => patch("schoolShift", "evening")} label="Evening" />
                    <SegmentedOption name="schoolShift" className="cabzii-tap min-h-10 flex-1" checked={form.schoolShift === "both"} onChange={() => patch("schoolShift", "both")} label="Both" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Working days / month">
                    <input type="number" min={1} className={inputCls} value={form.workingDays} onChange={(e) => patch("workingDays", e.target.value)} />
                  </Field>
                  <Field label="Parent contact">
                    <input className={inputCls} inputMode="numeric" maxLength={10} value={form.parentContact} onChange={(e) => patch("parentContact", e.target.value)} placeholder="10-digit mobile" />
                  </Field>
                </div>
              </>
            ) : null}

            {serviceId === "corporate" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Drivers needed">
                    <input type="number" min={1} className={inputCls} value={form.driversRequired} onChange={(e) => patch("driversRequired", e.target.value)} />
                  </Field>
                  <Field label="Days">
                    <input type="number" min={1} className={inputCls} value={form.days} onChange={(e) => patch("days", e.target.value)} />
                  </Field>
                </div>
                <Field label="Working hours">
                  <input className={inputCls} value={form.workingHours} onChange={(e) => patch("workingHours", e.target.value)} placeholder="9 AM – 6 PM" />
                </Field>
                <Field label="Requirement">
                  <textarea className={areaCls} rows={3} value={form.requirement} onChange={(e) => patch("requirement", e.target.value)} placeholder="Office travel, events, monthly driver…" />
                </Field>
              </>
            ) : null}

            {serviceId === "valet" ? (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Drivers">
                  <input type="number" min={1} className={inputCls} value={form.driversRequired} onChange={(e) => patch("driversRequired", e.target.value)} />
                </Field>
                <Field label="Hours">
                  <input type="number" min={5} className={inputCls} value={form.hours} onChange={(e) => patch("hours", e.target.value)} />
                </Field>
              </div>
            ) : null}

            {serviceId !== "corporate" ? (
              <Field label="Notes (optional)">
                <textarea className={areaCls} rows={3} value={form.notes} onChange={(e) => patch("notes", e.target.value)} placeholder="Gate code, car details, instructions" />
              </Field>
            ) : null}

            <button type="submit" disabled={quoting} className="cabzii-btn cabzii-btn-cta cabzii-tap hidden min-h-12 w-full sm:flex">
              {primaryLabel}
            </button>
          </form>
        ) : null}

        {step === 2 && quote ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              {quote.quoteOnly ? (
                <p className="text-sm font-semibold text-slate-800">{quote.quoteMessage}</p>
              ) : (
                <>
                  <p className={typo.label}>Estimated fare</p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                    ₹{Number(quote.total || 0).toLocaleString("en-IN")}
                  </p>
                  <ul className="mt-3 divide-y divide-slate-100 text-sm text-slate-600">
                    {(quote.lines || []).map((line) => (
                      <li key={line.label} className="flex justify-between gap-3 py-1.5">
                        <span>{line.label}</span>
                        <span className="font-semibold text-slate-900">₹{Number(line.amount || 0).toLocaleString("en-IN")}</span>
                      </li>
                    ))}
                  </ul>
                  {quote.foodStayNote ? <p className="mt-3 text-xs text-slate-500">{quote.foodStayNote}</p> : null}
                  {serviceId === "valet" ? (
                    <p className="mt-3 text-xs text-slate-500">
                      Supervisors: {quote.supervisorCount || 0} (one for every 10 drivers)
                    </p>
                  ) : null}
                </>
              )}
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Driver: Professional Cabzii Driver. Assigned after booking.
              </p>
            </div>
            <div className="hidden gap-3 sm:flex">
              <button type="button" onClick={() => setStep(1)} className="cabzii-btn cabzii-btn-secondary cabzii-tap min-h-12 flex-1">
                Back
              </button>
              {quote.quoteOnly ? (
                <button type="button" onClick={submitQuoteRequest} disabled={submitting} className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-12 flex-[2]">
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
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:hidden">
        {step === 1 ? (
          <button
            type="button"
            disabled={quoting}
            onClick={continueToQuote}
            className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-12 w-full text-base"
          >
            {primaryLabel}
          </button>
        ) : (
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="cabzii-btn cabzii-btn-secondary cabzii-tap min-h-12 flex-1">
              Back
            </button>
            {quote?.quoteOnly ? (
              <button type="button" onClick={submitQuoteRequest} disabled={submitting} className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-12 flex-[2]">
                {submitting ? "Sending…" : service.cta}
              </button>
            ) : (
              <button type="button" onClick={goToCheckout} className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-12 flex-[2]">
                Book this service
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
