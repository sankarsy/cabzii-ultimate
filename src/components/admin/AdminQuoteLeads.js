"use client";

import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "../../lib/analytics";

const STATUSES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "quotation_sent", label: "Quoted" },
  { id: "confirmed", label: "Converted" },
  { id: "lost", label: "Closed" }
];

const SERVICES = [
  { id: "cab", label: "Cab" },
  { id: "driver", label: "Driver" },
  { id: "bus", label: "Bus" },
  { id: "tour", label: "Holiday" }
];

export default function AdminQuoteLeads({ token }) {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [source, setSource] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({ admin: "1", page: "1", limit: "20" });
      if (status) q.set("status", status);
      if (service) q.set("service", service);
      if (vehicle.trim()) q.set("vehicle", vehicle.trim());
      if (source.trim()) q.set("source", source.trim());
      if (from) q.set("from", from);
      if (to) q.set("to", to);
      const res = await fetch(`/api/quote-leads?${q}`, {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store"
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Could not load leads");
      setRows(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      setError(err.message || "Could not load leads");
    } finally {
      setLoading(false);
    }
  }, [token, status, service, vehicle, source, from, to]);

  useEffect(() => {
    load();
  }, [load]);

  const setStage = async (id, stage) => {
    const res = await fetch(`/api/quote-leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ stage })
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json?.message || "Update failed");
      return;
    }
    if (stage === "contacted") trackEvent("enquiry_contacted", { enquiry_id: id });
    if (stage === "confirmed") trackEvent("enquiry_converted", { enquiry_id: id });
    await load();
  };

  function phoneDigits(row) {
    return String(row.mobile || "").replace(/\D/g, "").slice(-10);
  }

  function telHref(row) {
    const d = phoneDigits(row);
    return d ? `tel:+91${d}` : "";
  }

  function waHref(row) {
    const d = phoneDigits(row);
    if (!d) return "";
    const route = row.route || [row.boardingPoint, row.droppingPoint].filter(Boolean).join(" → ");
    const text = `Hi, this is Cabzii following up on your ${row.productType || "cab"} enquiry${route ? ` (${route})` : ""}.`;
    return `https://wa.me/91${d}?text=${encodeURIComponent(text)}`;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Enquiries</h3>
          <p className="text-xs text-slate-500">Website and WhatsApp leads. Quote Ref matches the customer message. Vendor view is limited to own vehicles.</p>
        </div>
      </div>
      <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        <input type="date" className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
        <input type="date" className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" />
        <select className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs" value={service} onChange={(e) => setService(e.target.value)}>
          <option value="">All services</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <input className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs" placeholder="Vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
        <input className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs" placeholder="UTM source" value={source} onChange={(e) => setSource(e.target.value)} />
        <select className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="mb-2 text-xs text-rose-700">{error}</p> : null}
      {loading ? <p className="text-xs text-slate-500">Loading…</p> : null}
      <div className="overflow-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-left uppercase text-slate-500">
            <tr>
              <th className="px-2 py-2">Date</th>
              <th className="px-2 py-2">Customer</th>
              <th className="px-2 py-2">Phone</th>
              <th className="px-2 py-2">Lead ID</th>
              <th className="px-2 py-2">Service</th>
              <th className="px-2 py-2">Vehicle</th>
              <th className="px-2 py-2">Pickup / Drop</th>
              <th className="px-2 py-2">Travel date</th>
              <th className="px-2 py-2">Source / CTA</th>
              <th className="px-2 py-2">UTM</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} className="border-t border-slate-100">
                <td className="px-2 py-2 whitespace-nowrap">{row.createdAt ? new Date(row.createdAt).toLocaleString("en-IN") : "—"}</td>
                <td className="px-2 py-2">{row.name || "—"}</td>
                <td className="px-2 py-2 font-mono">{row.mobile || "—"}</td>
                <td className="px-2 py-2 font-mono">{row.quoteRef || "—"}</td>
                <td className="px-2 py-2">{row.productType || "cab"}</td>
                <td className="px-2 py-2">{row.vehicleName || row.vehicleType || "—"}</td>
                <td className="px-2 py-2">{row.route || [row.boardingPoint, row.droppingPoint].filter(Boolean).join(" → ") || "—"}</td>
                <td className="px-2 py-2">{row.travelDate || "—"}</td>
                <td className="px-2 py-2">
                  <div>{row.ctaLocation || row.source || "—"}</div>
                  <div className="text-slate-400">{row.sourcePage || row.landingPage || ""}</div>
                </td>
                <td className="px-2 py-2">{[row.utmSource, row.utmCampaign].filter(Boolean).join(" / ") || "—"}</td>
                <td className="px-2 py-2">
                  <select className="rounded border border-slate-300 px-1 py-0.5" value={row.stage || "new" } onChange={(e) => setStage(row._id, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <div className="flex flex-wrap gap-1">
                    {telHref(row) ? (
                      <a href={telHref(row)} className="rounded border border-slate-300 px-1.5 py-0.5 font-semibold text-sky-700">
                        Call
                      </a>
                    ) : null}
                    {waHref(row) ? (
                      <a href={waHref(row)} target="_blank" rel="noreferrer" className="rounded border border-slate-300 px-1.5 py-0.5 font-semibold text-emerald-700">
                        WhatsApp
                      </a>
                    ) : null}
                    {row.stage !== "contacted" ? (
                      <button type="button" className="rounded border border-slate-300 px-1.5 py-0.5 font-semibold" onClick={() => setStage(row._id, "contacted")}>
                        Contacted
                      </button>
                    ) : null}
                    {row.stage !== "confirmed" ? (
                      <button type="button" className="rounded border border-slate-300 px-1.5 py-0.5 font-semibold" onClick={() => setStage(row._id, "confirmed")}>
                        Converted
                      </button>
                    ) : null}
                    {row.stage !== "lost" ? (
                      <button type="button" className="rounded border border-slate-300 px-1.5 py-0.5 font-semibold" onClick={() => setStage(row._id, "lost")}>
                        Closed
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && !loading ? (
              <tr>
                <td colSpan={12} className="px-2 py-6 text-center text-slate-500">
                  No enquiries yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
