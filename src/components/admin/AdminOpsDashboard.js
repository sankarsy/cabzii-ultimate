"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { extractCabList, extractDriverList } from "../../lib/apiClient";
import { todayStr } from "../../lib/istDate";
import useBookingLocation from "../../lib/useBookingLocation";
import { formatUpdatedAgo, isTrackableBooking, trackingStateLabel } from "../../lib/customerTrackingUi";
import { trackEvent } from "../../lib/analytics";

const LiveTripMap = dynamic(() => import("../maps/LiveTripMap"), {
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse rounded-lg bg-slate-100" />
});

const FILTERS = [
  { id: "today", label: "Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" }
];

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  finished: "bg-sky-100 text-sky-800",
  cancelled: "bg-slate-200 text-slate-700"
};

function shortId(id) {
  const s = String(id || "");
  return s.length > 8 ? s.slice(-8).toUpperCase() : s.toUpperCase();
}

function bookingDate(b) {
  return String(b.date || "").slice(0, 10);
}

function isUpcoming(b, today) {
  if (b.status === "finished" || b.status === "cancelled") return false;
  const d = bookingDate(b);
  return d >= today;
}

function matchesFilter(b, filter, today) {
  if (filter === "all") return true;
  if (filter === "today") return bookingDate(b) === today && b.status !== "cancelled";
  if (filter === "upcoming") return isUpcoming(b, today);
  return b.status === filter;
}

function holdLabel(b) {
  if (b.status !== "pending") return "";
  if (b.holdActive === false) return "Hold expired";
  if (b.expiresAt) {
    const t = new Date(b.expiresAt);
    if (Number.isNaN(t.getTime())) return "On hold";
    return `Hold until ${t.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}`;
  }
  return "On hold";
}

function driverOpsLabel(b) {
  if (b?.tripFinishedAt) return "Driver finished";
  if (b?.tripStartedAt && b?.status === "confirmed") return "On trip";
  return "";
}

function trackingLabel(b, liveState) {
  const state = liveState || (b?.tripFinishedAt || b?.status === "finished" ? "finished" : b?.tracking?.freshness);
  if (state === "finished" || b?.tripFinishedAt || b?.status === "finished") {
    return b?.tracking?.latestLocation || liveState === "finished" ? "FINISHED" : "";
  }
  const freshness = liveState || b?.tracking?.freshness;
  if (freshness === "live") return "LIVE";
  if (freshness === "recent") return "RECENT";
  if (freshness === "stale") return "STALE";
  if (!b?.tracking?.latestLocation) {
    return b?.tripStartedAt && b?.status === "confirmed" && !b?.tripFinishedAt ? "Tracking not available" : "";
  }
  return "STALE";
}

function OpsBookingMap({ booking, token }) {
  const enabled = Boolean(token && booking?._id && isTrackableBooking(booking));
  const headers = useMemo(() => (token ? { authorization: `Bearer ${token}` } : {}), [token]);
  const { data, error } = useBookingLocation(enabled ? String(booking._id) : "", {
    headers,
    enabled
  });

  const location = data ? data.latestLocation : booking?.tracking?.latestLocation || null;
  const state =
    data?.trackingState ||
    (booking?.tripFinishedAt || booking?.status === "finished" ? "finished" : booking?.tracking?.freshness);
  const label = trackingStateLabel(state) || trackingLabel(booking, state);
  const neverLive = state === "finished" || booking?.tripFinishedAt || booking?.status === "finished";

  return (
    <div className="mt-2 space-y-2 rounded-md border border-slate-200 bg-white p-2">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Driver location</p>
      {isTrackableBooking(booking) ? (
        <LiveTripMap
          pickupLat={data?.pickupLat ?? booking.pickupLat}
          pickupLng={data?.pickupLng ?? booking.pickupLng}
          dropLat={data?.dropLat ?? booking.dropLat}
          dropLng={data?.dropLng ?? booking.dropLng}
          vehicleLat={location?.latitude}
          vehicleLng={location?.longitude}
          className="h-48 w-full rounded-lg"
        />
      ) : (
        <p className="text-xs text-slate-500">Map tracking is available for cab trips.</p>
      )}
      <p className="text-xs text-slate-600">Booking #{shortId(booking._id)}</p>
      <p className="text-xs text-slate-600">Driver: {data?.driverName || booking.assignedDriverName || "Unassigned"}</p>
      {location ? (
        <>
          <p className="text-xs font-semibold text-slate-800">
            {neverLive ? "FINISHED" : label || "STALE"}
            {location.updatedAt ? ` · ${formatUpdatedAgo(location.updatedAt)}` : ""}
          </p>
          <p className="text-[11px] text-slate-600">
            {Number(location.latitude).toFixed(5)}, {Number(location.longitude).toFixed(5)}
          </p>
        </>
      ) : (
        <p className="text-xs text-slate-500">
          {booking.tripStartedAt && booking.status === "confirmed"
            ? "Tracking not available yet"
            : neverLive
              ? "Trip completed"
              : "Tracking starts after the driver starts the trip"}
        </p>
      )}
      {error ? <p className="text-[11px] text-amber-800">{error}</p> : null}
    </div>
  );
}

export default function AdminOpsDashboard({ token, isSuperAdmin }) {
  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};
  const today = todayStr();
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [saving, setSaving] = useState(false);
  const [contactPhone, setContactPhone] = useState("");
  const [assignVehicleId, setAssignVehicleId] = useState("");
  const [assignDriverId, setAssignDriverId] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [bRes, cRes, dRes] = await Promise.all([
        fetch("/api/bookings?admin=1", { headers: authHeaders, cache: "no-store" }),
        fetch("/api/cabs?admin=1&limit=200&page=1", { headers: authHeaders, cache: "no-store" }),
        fetch("/api/drivers?admin=1&limit=200&page=1", { headers: authHeaders, cache: "no-store" })
      ]);
      const [bJson, cJson, dJson] = await Promise.all([bRes.json(), cRes.json(), dRes.json()]);
      if (!bRes.ok || bJson?.success === false) throw new Error(bJson?.message || "Could not load bookings");
      setBookings(Array.isArray(bJson.data) ? bJson.data : []);
      setVehicles(extractCabList(cJson).filter((v) => !v.isDeleted));
      setDrivers(extractDriverList(dJson).filter((v) => !v.isDeleted));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load operations");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const next = { today: 0, upcoming: 0, pending: 0, confirmed: 0, cancelled: 0, all: bookings.length };
    for (const b of bookings) {
      if (bookingDate(b) === today && b.status !== "cancelled") next.today += 1;
      if (isUpcoming(b, today)) next.upcoming += 1;
      if (b.status === "pending") next.pending += 1;
      if (b.status === "confirmed") next.confirmed += 1;
      if (b.status === "cancelled") next.cancelled += 1;
    }
    return next;
  }, [bookings, today]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (!matchesFilter(b, filter, today)) return false;
      if (!q) return true;
      const hay = [
        b._id,
        b.customerName,
        b.phone,
        b.pickup,
        b.drop,
        b.itemTitle,
        b.assignedVehicleTitle,
        b.assignedDriverName,
        b.status
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ");
      return hay.includes(q);
    });
  }, [bookings, filter, query, today]);

  const selected = bookings.find((b) => String(b._id) === String(selectedId)) || null;

  useEffect(() => {
    if (!selected) return;
    setAssignVehicleId(String(selected.assignedVehicleId || selected.itemId || ""));
    setAssignDriverId(String(selected.assignedDriverId || (selected.type === "driver" ? selected.itemId : "") || ""));
    setContactPhone(selected.vendorContact?.phone || "");
  }, [selectedId, selected?._id]);

  const patchStatus = async (status) => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${selected._id}/status`, {
        method: "PATCH",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          vendorContact: status === "confirmed" ? { phone: contactPhone } : undefined
        })
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Update failed");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const assign = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const body = {};
      if (selected.type === "cab" && !assignVehicleId) {
        throw new Error("Select a vehicle to assign.");
      }
      if (assignVehicleId) body.assignedVehicleId = assignVehicleId;
      body.assignedDriverId = assignDriverId || null;
      const res = await fetch(`/api/bookings/${selected._id}/assign`, {
        method: "PATCH",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Assignment failed");
      trackEvent("driver_assignment_completed", {
        service_type: selected.type || "cab",
        vehicle_id: assignVehicleId || "",
        source_page: "/admin",
        cta_location: "ops_dashboard"
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setSaving(false);
    }
  };

  const activeVehicles = vehicles.filter((v) => !v.status || v.status === "active");
  const activeDrivers = drivers.filter((v) => !v.status || v.status === "active");
  const canOperate = selected && selected.status !== "finished" && selected.status !== "cancelled";
  const occupancyStarted = selected?.startAt ? new Date(selected.startAt).getTime() <= Date.now() : false;
  const tripStarted = occupancyStarted || Boolean(selected?.tripStartedAt);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900">{isSuperAdmin ? "Operations" : "Operator dashboard"}</h1>
        <p className="text-sm text-slate-600">
          Confirm bookings, assign your vehicles and drivers, then finish or cancel the trip.
        </p>
        {isSuperAdmin ? (
          <p className="mt-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-950">
            Google landing pages are under{" "}
            <Link href="/admin?tab=seoPagesHub" className="font-semibold underline">
              Content → Google SEO pages
            </Link>
            . City pages:{" "}
            <Link href="/admin?tab=seoCityPages" className="font-semibold underline">
              City landing pages
            </Link>
            . Vehicle SEO (Dzire Tour S):{" "}
            <Link href="/admin?tab=cabs" className="font-semibold underline">
              Catalog → Cabs
            </Link>
            .
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-xl border px-3 py-2 text-left ${
              filter === f.id ? "border-[#0056D2] bg-blue-50" : "border-slate-200 bg-white"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase text-slate-500">{f.label}</p>
            <p className="text-lg font-bold text-slate-900">{counts[f.id] ?? 0}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">Vehicles {vehicles.length}</span>
        <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">Drivers {drivers.length}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <input
            className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-600"
            placeholder="Search name, phone, route, vehicle, driver…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading ? (
            <p className="p-6 text-center text-sm text-slate-500">Loading bookings…</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500">No bookings in this queue.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((b) => {
                const active = String(b._id) === String(selectedId);
                return (
                  <li key={b._id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(String(b._id))}
                      className={`flex w-full flex-col gap-1 px-2 py-3 text-left sm:flex-row sm:items-start sm:justify-between ${
                        active ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">{b.customerName || "Guest"}</p>
                        <p className="text-xs text-slate-600">
                          {b.phone || "—"} · #{shortId(b._id)}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-700">
                          {b.pickup || "Pickup TBD"}
                          {b.drop ? ` → ${b.drop}` : ""}
                        </p>
                        <p className="text-xs text-slate-500">
                          {b.date || "—"} {b.pickupTime || ""} · {b.assignedVehicleTitle || b.itemTitle || "Vehicle TBD"}
                          {b.assignedDriverName ? ` · ${b.assignedDriverName}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[b.status] || STATUS_STYLES.pending}`}>
                          {b.status}
                        </span>
                        {driverOpsLabel(b) ? (
                          <span className="text-[10px] font-semibold text-sky-700">{driverOpsLabel(b)}</span>
                        ) : null}
                        {trackingLabel(b) ? (
                          <span className="text-[10px] font-semibold text-slate-600">{trackingLabel(b)}</span>
                        ) : null}
                        <span className="text-xs font-semibold text-slate-900">₹{Number(b.finalAmount ?? b.amount ?? 0).toLocaleString("en-IN")}</span>
                        {b.status === "pending" ? <span className="text-[10px] text-amber-700">{holdLabel(b)}</span> : null}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {!selected ? (
            <p className="text-sm text-slate-500">Select a booking to confirm, assign, finish, or cancel.</p>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Booking #{shortId(selected._id)}</p>
                <p className="text-base font-bold text-slate-900">{selected.customerName}</p>
                <p className="text-sm text-slate-700">{selected.phone}</p>
                {selected.email ? <p className="text-xs text-slate-500">{selected.email}</p> : null}
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <p className="font-semibold text-slate-900">
                  {selected.pickup || "Pickup TBD"}
                  {selected.drop ? ` → ${selected.drop}` : ""}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {selected.date} {selected.pickupTime ? `· ${selected.pickupTime}` : ""}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {selected.callDriver?.serviceType
                    ? `Call Driver · ${selected.callDriver.serviceType}${selected.callDriver.vehicleModel ? ` · ${selected.callDriver.vehicleModel}` : ""}`
                    : `Vehicle: ${selected.assignedVehicleTitle || selected.itemTitle || "—"}`}
                </p>
                <p className="text-xs text-slate-600">Driver: {selected.assignedDriverName || "Unassigned"}</p>
                {driverOpsLabel(selected) ? (
                  <p className="mt-1 text-xs font-semibold text-sky-700">{driverOpsLabel(selected)}</p>
                ) : null}
                {selected.tripStartedAt ? (
                  <p className="text-[11px] text-slate-500">
                    Started {new Date(selected.tripStartedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </p>
                ) : null}
                {selected.tripFinishedAt ? (
                  <p className="text-[11px] text-slate-500">
                    Driver finished {new Date(selected.tripFinishedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </p>
                ) : null}
                <OpsBookingMap booking={selected} token={token} />
                <p className="mt-1 text-sm font-bold text-slate-900">₹{Number(selected.finalAmount ?? selected.amount ?? 0).toLocaleString("en-IN")}</p>
                {selected.status === "pending" ? <p className="mt-1 text-xs text-amber-700">{holdLabel(selected)}</p> : null}
              </div>

              {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p> : null}

              {canOperate ? (
                <>
                  <label className="block text-xs font-semibold text-slate-600">
                    Assign vehicle
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      value={assignVehicleId}
                      onChange={(e) => setAssignVehicleId(e.target.value)}
                      disabled={saving || tripStarted}
                    >
                      <option value="">Select vehicle</option>
                      {activeVehicles.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.title || v.vehicleName || v._id}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-slate-600">
                    Assign driver
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      value={assignDriverId}
                      onChange={(e) => setAssignDriverId(e.target.value)}
                      disabled={saving || tripStarted}
                    >
                      <option value="">Unassigned</option>
                      {activeDrivers.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name || d._id}
                          {d.availabilityStatus ? ` · ${d.availabilityStatus}` : ""}
                          {d.phone ? ` · ${d.phone}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={assign}
                    disabled={saving || tripStarted}
                    className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Save assignment
                  </button>
                  {tripStarted ? (
                    <p className="text-[11px] text-slate-500">
                      {selected?.tripStartedAt
                        ? "Reassignment is locked after the driver started the trip."
                        : "Reassignment is locked after the trip start time."}
                    </p>
                  ) : null}
                </>
              ) : null}

              {selected.status === "pending" ? (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600">
                    Contact phone for customer
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Shown on My Bookings"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => patchStatus("confirmed")}
                    disabled={saving}
                    className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Confirm booking
                  </button>
                </div>
              ) : null}

              {selected.status === "confirmed" ? (
                <button
                  type="button"
                  onClick={() => patchStatus("finished")}
                  disabled={saving}
                  className="w-full rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Mark finished
                </button>
              ) : null}

              {canOperate ? (
                <button
                  type="button"
                  onClick={() => patchStatus("cancelled")}
                  disabled={saving}
                  className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 disabled:opacity-50"
                >
                  Cancel booking
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
