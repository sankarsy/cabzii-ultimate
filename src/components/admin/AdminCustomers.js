"use client";

import { useCallback, useEffect, useState } from "react";
import { formatINR, formatNumber } from "./charts";

function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_STYLES = {
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-rose-100 text-rose-700"
};

export default function AdminCustomers({ token, isSuperAdmin }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (query) params.set("q", query);
      const res = await fetch(`/api/customers?${params.toString()}`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Could not load customers.");
      }
      setRows(Array.isArray(data.data) ? data.data : []);
      setMeta(data.meta || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.message || "Could not load customers.");
      setRows([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, token]);

  useEffect(() => {
    if (isSuperAdmin) loadCustomers();
  }, [isSuperAdmin, loadCustomers]);

  const openCustomer = async (id) => {
    setSelected(id);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/customers/${id}`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok && data?.data) setDetail(data.data);
    } finally {
      setDetailLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Customers</h2>
        <p className="mt-2 text-sm text-slate-600">
          Only a super admin can view the customer directory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Customers</h2>
            <p className="text-sm text-slate-500">
              {formatNumber(meta.total)} registered {meta.total === 1 ? "customer" : "customers"} · saved automatically on login
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQuery(search.trim());
            }}
            className="flex gap-2"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, mobile or email"
              className="w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Search
            </button>
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setQuery("");
                  setPage(1);
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear
              </button>
            ) : null}
          </form>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
        ) : null}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2 font-semibold">Customer</th>
                <th className="px-3 py-2 font-semibold">Joined</th>
                <th className="px-3 py-2 font-semibold">Last login</th>
                <th className="px-3 py-2 text-right font-semibold">Bookings</th>
                <th className="px-3 py-2 text-right font-semibold">Spent</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-400">
                    Loading customers…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                rows.map((c) => (
                  <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-3">
                      <p className="font-semibold text-slate-800">{c.name || "Unnamed"}</p>
                      <p className="text-xs text-slate-500">{c.mobileNumber}</p>
                      {c.email ? <p className="text-xs text-slate-400">{c.email}</p> : null}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{fmtDate(c.createdAt)}</td>
                    <td className="px-3 py-3 text-slate-600">{fmtDate(c.lastLoginAt)}</td>
                    <td className="px-3 py-3 text-right font-medium text-slate-700">{formatNumber(c.bookingsCount)}</td>
                    <td className="px-3 py-3 text-right font-medium text-slate-700">{formatINR(c.totalSpent)}</td>
                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openCustomer(c._id)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                      >
                        View bookings
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta.totalPages > 1 ? (
          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-600 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-slate-500">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-600 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
          <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {detail?.customer?.name || "Customer"}
                </h3>
                <p className="text-sm text-slate-500">
                  {detail?.customer?.mobileNumber}
                  {detail?.customer?.email ? ` · ${detail.customer.email}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setDetail(null);
                }}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            {detailLoading ? (
              <p className="mt-6 text-center text-sm text-slate-400">Loading bookings…</p>
            ) : detail ? (
              <>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat label="Bookings" value={formatNumber(detail.stats.bookingsCount)} />
                  <Stat label="Confirmed" value={formatNumber(detail.stats.confirmed)} />
                  <Stat label="Total spent" value={formatINR(detail.stats.totalSpent)} />
                  <Stat label="Logins" value={formatNumber(detail.customer.loginCount)} />
                </div>

                <h4 className="mt-5 text-sm font-bold text-slate-800">Booking history</h4>
                <div className="mt-2 space-y-2">
                  {detail.bookings.length === 0 ? (
                    <p className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-500">
                      No bookings yet.
                    </p>
                  ) : (
                    detail.bookings.map((b) => (
                      <div
                        key={b._id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5"
                      >
                        <div>
                          <p className="text-sm font-semibold capitalize text-slate-800">
                            {b.type} · {b.pickup || "—"}
                            {b.drop ? ` → ${b.drop}` : ""}
                          </p>
                          <p className="text-xs text-slate-500">
                            {b.date || fmtDate(b.createdAt)}
                            {b.routeType ? ` · ${b.routeType}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-700">{formatINR(b.amount)}</span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                              STATUS_STYLES[b.status] || "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <p className="mt-6 text-center text-sm text-rose-500">Could not load customer details.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-base font-bold text-slate-900">{value}</p>
    </div>
  );
}
