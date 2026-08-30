"use client";

import { useState } from "react";
import { trackEvent } from "../../lib/analytics";

const SERVICE_OPTIONS = [
  { id: "cab", label: "Local / cab" },
  { id: "airport", label: "Airport taxi" },
  { id: "outstation", label: "Outstation" },
  { id: "driver", label: "Hire a driver" },
  { id: "bus", label: "Bus" },
  { id: "tour", label: "Holiday" }
];

export default function WriteReviewForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(5);
  const [serviceType, setServiceType] = useState("cab");
  const [tripRoute, setTripRoute] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("Enter your name.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Write a short review (at least 10 characters).");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/testimonials/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          location: location.trim(),
          phone: phone.trim(),
          rating,
          serviceType,
          tripRoute: tripRoute.trim(),
          message: message.trim(),
          website
        })
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Could not submit review");
      trackEvent("review_submitted", { service: serviceType });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit review");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div id="write-review" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-bold text-emerald-900">Thank you. Your review has been submitted for approval.</p>
        <p className="mt-1 text-xs text-emerald-800">It is not published yet. It appears after our team checks it.</p>
      </div>
    );
  }

  return (
    <form id="write-review" onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900">Write a review</h2>
      <p className="mt-0.5 text-xs text-slate-600">Share a real trip. We publish after a short check — no sample quotes.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="block text-[11px] font-semibold text-slate-600">
          Name *
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
            className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-2.5 text-sm outline-none focus:border-[var(--cabzii-brand)]"
          />
        </label>
        <label className="block text-[11px] font-semibold text-slate-600">
          Service
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-2.5 text-sm outline-none focus:border-[var(--cabzii-brand)]"
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[11px] font-semibold text-slate-600">
          Route
          <input
            value={tripRoute}
            onChange={(e) => setTripRoute(e.target.value)}
            maxLength={120}
            placeholder="Chennai → Trichy"
            className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-2.5 text-sm outline-none focus:border-[var(--cabzii-brand)]"
          />
        </label>
        <label className="block text-[11px] font-semibold text-slate-600">
          City
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={80}
            placeholder="Chennai"
            className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-2.5 text-sm outline-none focus:border-[var(--cabzii-brand)]"
          />
        </label>
        <label className="block text-[11px] font-semibold text-slate-600">
          Mobile (optional)
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            maxLength={10}
            placeholder="10-digit number"
            className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-2.5 text-sm outline-none focus:border-[var(--cabzii-brand)]"
          />
        </label>
        <label className="block text-[11px] font-semibold text-slate-600">
          Rating
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-2.5 text-sm outline-none focus:border-[var(--cabzii-brand)]"
          >
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} star{star === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>
        <label className="sr-only" aria-hidden>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
        <label className="block text-[11px] font-semibold text-slate-600 sm:col-span-2">
          Your review *
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={2000}
            required
            placeholder="How was the cab, driver and fare?"
            className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm outline-none focus:border-[var(--cabzii-brand)]"
          />
        </label>
      </div>
      {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="mt-3 rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--cabzii-brand-hover)] disabled:opacity-60"
      >
        {saving ? "Sending…" : "Submit review"}
      </button>
    </form>
  );
}
