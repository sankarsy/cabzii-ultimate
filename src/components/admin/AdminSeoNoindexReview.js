"use client";

import { useMemo, useState } from "react";

function show(m) {
  if (m == null) return "GSC DATA NOT CONNECTED";
  if (typeof m === "number") return String(m);
  if (m.available === false) return m.label || "GSC DATA NOT CONNECTED";
  if (typeof m.value === "number") return String(m.value);
  return "GSC DATA NOT CONNECTED";
}

function showInr(m) {
  if (m == null) return "DATA UNAVAILABLE";
  if (typeof m === "number") return `₹${m.toLocaleString("en-IN")}`;
  if (m.available === false) return m.label || "DATA UNAVAILABLE";
  if (typeof m.value === "number") return `₹${Number(m.value).toLocaleString("en-IN")}`;
  return "DATA UNAVAILABLE";
}

function showCtr(m) {
  if (m == null || m.available === false) return m?.label || "GSC DATA NOT CONNECTED";
  const n = typeof m === "number" ? m : m.value;
  if (!Number.isFinite(n)) return "GSC DATA NOT CONNECTED";
  return `${(n * 100).toFixed(2)}%`;
}

const FILTERS = ["ALL", "KEEP NOINDEX", "REVIEW", "POTENTIAL REINDEX"];

function tone(rec) {
  if (rec === "POTENTIAL REINDEX") return "bg-amber-50 text-amber-900 ring-amber-200";
  if (rec === "REVIEW") return "bg-sky-50 text-sky-900 ring-sky-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export default function AdminSeoNoindexReview({ rows = [] }) {
  const [filter, setFilter] = useState("ALL");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c = { ALL: rows.length, "KEEP NOINDEX": 0, REVIEW: 0, "POTENTIAL REINDEX": 0 };
    for (const r of rows) {
      if (c[r.recommendation] != null) c[r.recommendation] += 1;
    }
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "ALL" && r.recommendation !== filter) return false;
      if (!needle) return true;
      return String(r.url || "").toLowerCase().includes(needle);
    });
  }, [rows, filter, q]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">37 noindex pages — index review</h3>
          <p className="mt-1 text-xs text-slate-500">
            Review only. This screen does not change robots, meta, or the sitemap. Current status stays{" "}
            <span className="font-semibold">noindex,follow</span>.
          </p>
        </div>
        <p className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
          {rows.length} URLs catalogued
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${
              filter === f ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-700 ring-slate-200"
            }`}
          >
            {f} ({counts[f] || 0})
          </button>
        ))}
      </div>
      <input
        className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        placeholder="Filter by URL"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="mt-3 space-y-3 md:hidden">
        {visible.length ? (
          visible.map((r) => (
            <article key={r.url} className="rounded-xl border border-slate-200 p-3">
              <p className="break-all text-xs font-semibold text-slate-900">{r.url}</p>
              <p className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${tone(r.recommendation)}`}>
                {r.recommendation}
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-700">
                <div>
                  <dt className="text-slate-400">Impressions</dt>
                  <dd className="font-semibold">{show(r.impressions)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Clicks</dt>
                  <dd className="font-semibold">{show(r.clicks)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">CTR</dt>
                  <dd className="font-semibold">{showCtr(r.ctr)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Position</dt>
                  <dd className="font-semibold">{show(r.position)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Booking starts</dt>
                  <dd className="font-semibold">{show(r.bookingStarts)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Completed</dt>
                  <dd className="font-semibold">{show(r.completedBookings || r.bookings)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-400">GMV</dt>
                  <dd className="font-semibold">{showInr(r.gmv)}</dd>
                </div>
              </dl>
            </article>
          ))
        ) : (
          <p className="py-6 text-center text-xs text-slate-400">No pages in this filter.</p>
        )}
      </div>

      <div className="mt-3 hidden overflow-x-auto md:block">
        <table className="min-w-[960px] text-left text-xs">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-500">
              {["URL", "Impressions", "Clicks", "CTR", "Position", "Starts", "Completed", "GMV", "Status", "Recommendation"].map(
                (h) => (
                  <th key={h} className="px-3 py-2 font-semibold">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.url} className="border-b border-slate-100">
                <td className="sticky left-0 max-w-[18rem] bg-white px-3 py-2 font-medium text-slate-800">{r.url}</td>
                <td className="px-3 py-2">{show(r.impressions)}</td>
                <td className="px-3 py-2">{show(r.clicks)}</td>
                <td className="px-3 py-2">{showCtr(r.ctr)}</td>
                <td className="px-3 py-2">{show(r.position)}</td>
                <td className="px-3 py-2">{show(r.bookingStarts)}</td>
                <td className="px-3 py-2">{show(r.completedBookings || r.bookings)}</td>
                <td className="px-3 py-2">{showInr(r.gmv)}</td>
                <td className="px-3 py-2">{r.currentStatus}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${tone(r.recommendation)}`}>
                    {r.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
