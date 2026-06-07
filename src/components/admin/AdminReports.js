"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart, DonutChart, LineChart, formatINR, formatNumber } from "./charts";

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" }
];

export default function AdminReports({ token, isSuperAdmin }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/analytics?days=${days}`, { headers: authHeaders });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Could not load reports.");
      }
      setData(json.data);
    } catch (err) {
      setError(err.message || "Could not load reports.");
      setData(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, token]);

  useEffect(() => {
    if (isSuperAdmin) load();
  }, [isSuperAdmin, load]);

  if (!isSuperAdmin) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Reports</h2>
        <p className="mt-2 text-sm text-slate-600">Only a super admin can view reports.</p>
      </div>
    );
  }

  const kpis = data?.kpis;
  const statusData = data
    ? [
        { label: "Confirmed", value: data.statusCounts.confirmed, color: "#10b981" },
        { label: "Pending", value: data.statusCounts.pending, color: "#f59e0b" },
        { label: "Cancelled", value: data.statusCounts.cancelled, color: "#ef4444" }
      ]
    : [];
  const typeData = data
    ? [
        { label: "Cabs", value: data.typeCounts.cab, color: "var(--cabzii-brand)" },
        { label: "Drivers", value: data.typeCounts.driver, color: "#7c3aed" },
        { label: "Tours", value: data.typeCounts.tour, color: "#06b6d4" }
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Reports &amp; Analytics</h2>
          <p className="text-sm text-slate-500">Bookings, revenue and customer growth at a glance.</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-slate-200 p-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setDays(r.days)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                days === r.days ? "bg-sky-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
      ) : null}

      {loading && !data ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400 shadow-sm">
          Loading reports…
        </div>
      ) : kpis ? (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <KpiCard label="Total customers" value={formatNumber(kpis.totalCustomers)} accent="text-sky-600" />
            <KpiCard label={`New (${days}d)`} value={formatNumber(kpis.newCustomers)} accent="text-emerald-600" />
            <KpiCard label="Total bookings" value={formatNumber(kpis.totalBookings)} accent="text-violet-600" />
            <KpiCard label={`Bookings (${days}d)`} value={formatNumber(kpis.bookingsInRange)} accent="text-blue-600" />
            <KpiCard label={`Revenue (${days}d)`} value={formatINR(kpis.revenueInRange)} accent="text-amber-600" />
            <KpiCard label="Total revenue" value={formatINR(kpis.totalRevenue)} accent="text-rose-600" />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <h3 className="mb-2 text-xs font-bold text-slate-800">Bookings &amp; new customers</h3>
              <LineChart
                data={data.timeseries}
                height={140}
                series={[
                  { key: "bookings", color: "#0056D2", label: "Bookings", fill: true },
                  { key: "newCustomers", color: "#10b981", label: "New customers" }
                ]}
              />
              <Legend
                items={[
                  { label: "Bookings", color: "#0056D2" },
                  { label: "New customers", color: "#10b981" }
                ]}
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <h3 className="mb-2 text-xs font-bold text-slate-800">Daily revenue (confirmed)</h3>
              <BarChart data={data.timeseries} valueKey="revenue" height={140} color="#0056D2" formatValue={formatINR} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <h3 className="mb-2 text-xs font-bold text-slate-800">Bookings by status</h3>
              <DonutChart data={statusData} size={112} thickness={18} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <h3 className="mb-2 text-xs font-bold text-slate-800">Bookings by type</h3>
              <DonutChart data={typeData} size={112} thickness={18} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <h3 className="mb-2 text-xs font-bold text-slate-800">Top customers by spend</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2 font-semibold">#</th>
                    <th className="px-3 py-2 font-semibold">Customer</th>
                    <th className="px-3 py-2 text-right font-semibold">Bookings</th>
                    <th className="px-3 py-2 text-right font-semibold">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-slate-400">
                        No booking data yet.
                      </td>
                    </tr>
                  ) : (
                    data.topCustomers.map((c, i) => (
                      <tr key={`${c.phone}-${i}`} className="border-b border-slate-100">
                        <td className="px-3 py-2.5 text-slate-400">{i + 1}</td>
                        <td className="px-3 py-2.5">
                          <span className="font-semibold text-slate-800">{c.name || "Guest"}</span>
                          <span className="ml-2 text-xs text-slate-400">{c.phone}</span>
                        </td>
                        <td className="px-3 py-2.5 text-right text-slate-700">{formatNumber(c.bookings)}</td>
                        <td className="px-3 py-2.5 text-right font-medium text-slate-800">{formatINR(c.spent)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function KpiCard({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3">
      <p className="text-[10px] font-medium leading-tight text-slate-500 sm:text-xs">{label}</p>
      <p className={`mt-0.5 text-base font-extrabold sm:text-lg ${accent || "text-slate-900"}`}>{value}</p>
    </div>
  );
}

function Legend({ items }) {
  return (
    <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-slate-500 sm:text-xs">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
