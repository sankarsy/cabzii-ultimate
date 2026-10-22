"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Building2,
  Bus,
  CalendarCheck,
  MapPin,
  Palmtree,
  Route,
  Star,
  Tag,
  UserCircle,
  Users
} from "lucide-react";
import AdminOpsDashboard from "../AdminOpsDashboard";

function asRows(json) {
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json)) return json;
  return [];
}

async function loadList(url, headers) {
  try {
    const res = await fetch(url, { headers, cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.success === false) {
      return { data: [], meta: {}, ok: false };
    }
    return {
      data: asRows(json),
      meta: json?.meta && typeof json.meta === "object" ? json.meta : {},
      ok: true
    };
  } catch {
    return { data: [], meta: {}, ok: false };
  }
}

function n(rows, pred) {
  return rows.filter(pred).length;
}

function display(loaded, value) {
  if (!loaded) return "—";
  return value;
}

function Stat({ label, value, hint, href, icon: Icon }) {
  const inner = (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-sky-200">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        {Icon ? <Icon className="h-4 w-4 text-slate-400" /> : null}
      </div>
      <p className="mt-1.5 text-2xl font-bold tabular-nums leading-none text-slate-900">{value}</p>
      {hint ? <p className="mt-1.5 text-[11px] text-slate-500">{hint}</p> : null}
    </div>
  );
  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}

function Flag({ on, label }) {
  return (
    <span className={`rounded px-1 py-px text-[10px] font-semibold ${on ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
      {label}
    </span>
  );
}

export default function AdminCmsDashboard({ token, isSuperAdmin }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !isSuperAdmin) return undefined;
    const headers = { authorization: `Bearer ${token}` };
    let cancelled = false;

    const apply = (patch) => {
      if (cancelled) return;
      setStats((prev) => ({ ...(prev || {}), ...patch, loaded: true }));
    };

    const run = async (url, toPatch) => {
      const result = await loadList(url, headers);
      if (!cancelled) apply(toPatch(result));
    };

    Promise.all([
      run("/api/cities?active=0", ({ ok, data }) => ({
        citiesOk: ok,
        citiesTotal: data.length,
        citiesActive: n(data, (row) => row.isActive !== false),
        cities: data
      })),
      run("/api/vendors?active=0", ({ ok, data }) => ({
        vendorsOk: ok,
        vendorsActive: n(data, (row) => row.isActive !== false),
        vendorsTotal: data.length
      })),
      run("/api/drivers?admin=1&limit=200&page=1", ({ ok, data }) => ({
        driversOk: ok,
        driversActive: n(data, (row) => !row.isDeleted && row.status !== "inactive"),
        driversTotal: data.length
      })),
      run("/api/customers?limit=1", ({ ok, data, meta }) => ({
        clientsOk: ok,
        clients: Number(meta.total || data.length || 0)
      })),
      run("/api/seo-services?admin=1&limit=200", ({ ok, data }) => ({
        servicesOk: ok,
        servicesPublished: n(data, (row) => row.published !== false),
        servicesDraft: n(data, (row) => row.published === false)
      })),
      run("/api/seo-routes?admin=1&limit=200", ({ ok, data }) => ({
        routesOk: ok,
        routesPublished: n(data, (row) => row.published !== false),
        routesDraft: n(data, (row) => row.published === false)
      })),
      run("/api/bookings?admin=1&limit=100&page=1", ({ ok, data, meta }) => ({
        bookingsOk: ok,
        bookingsTotal: Number(meta.total || data.length),
        bookingPending: n(data, (row) => (row.status || "pending") === "pending"),
        bookingConfirmed: n(data, (row) => row.status === "confirmed"),
        bookingFinished: n(data, (row) => row.status === "finished"),
        bookingCancelled: n(data, (row) => row.status === "cancelled"),
        recentBookings: data.slice(0, 8)
      })),
      run("/api/cabs?admin=1&limit=200&page=1", ({ ok, data, meta }) => ({
        vehiclesOk: ok,
        vehiclesActive: n(data, (row) => row.status === "active" || !row.status),
        vehiclesTotal: Number(meta.total || data.length),
        cabVerify: n(data, (row) => row.status === "under_verification" || row.verificationStatus === "pending")
      })),
      run("/api/packages?admin=1&limit=200&page=1", ({ ok, data, meta }) => ({
        holidaysOk: ok,
        holidaysActive: n(data, (row) => row.status !== "inactive"),
        holidaysTotal: Number(meta.total || data.length)
      })),
      run("/api/blogs?admin=1&limit=100&page=1", ({ ok, data, meta }) => ({
        blogsOk: ok,
        blogsPublished: n(data, (row) => row.published !== false),
        blogsTotal: Number(meta.total || data.length)
      })),
      run("/api/testimonials?admin=1&limit=100", ({ ok, data }) => {
        const pending = n(data, (row) => row.published === false);
        return {
          testimonialsPublished: n(data, (row) => row.published !== false),
          attentionExtra: pending ? [{ label: `${pending} testimonials waiting`, href: "/admin?tab=reviewsHub" }] : []
        };
      }),
      run("/api/reviews?admin=1&limit=100", ({ ok, data, meta }) => ({
        reviewsOk: ok,
        reviewsTotal: Number(meta.total || data.length)
      })),
      run("/api/offers?admin=1", ({ ok, data }) => ({
        offersOk: ok,
        offersPublished: n(data, (row) => row.published !== false && (row.section || "offers") === "offers")
      }))
    ]).catch(() => {
      if (!cancelled) setError("Could not load dashboard counts.");
    });

    return () => {
      cancelled = true;
    };
  }, [token, isSuperAdmin]);

  if (!isSuperAdmin) {
    return <AdminOpsDashboard token={token} isSuperAdmin={false} />;
  }

  const dash = stats || {};
  const loaded = Boolean(dash.loaded);
  const attention = [
    dash.bookingPending ? { label: `${dash.bookingPending} pending bookings`, href: "/admin?tab=bookings" } : null,
    dash.cabVerify ? { label: `${dash.cabVerify} vehicles need verification`, href: "/admin?tab=cabs" } : null,
    dash.servicesDraft ? { label: `${dash.servicesDraft} service pages in draft`, href: "/admin?tab=cmsServices" } : null,
    dash.routesDraft ? { label: `${dash.routesDraft} routes in draft`, href: "/admin?tab=seoRoutes" } : null,
    dash.cities?.some((row) => row.isActive === false)
      ? { label: `${dash.cities.filter((row) => row.isActive === false).length} inactive cities`, href: "/admin?tab=cities" }
      : null,
    ...(dash.attentionExtra || [])
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-xs text-slate-500">Live counts from MongoDB.</p>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        <Stat label="Cities" value={display(dash.citiesOk, dash.citiesActive)} hint={dash.citiesOk ? `${dash.citiesTotal} total` : undefined} href="/admin?tab=cities" icon={MapPin} />
        <Stat label="Service pages" value={display(dash.servicesOk, dash.servicesPublished)} hint={dash.servicesOk ? (dash.servicesDraft ? `${dash.servicesDraft} draft` : "published") : undefined} href="/admin?tab=cmsServices" icon={Route} />
        <Stat label="Routes" value={display(dash.routesOk, dash.routesPublished)} hint={dash.routesOk ? (dash.routesDraft ? `${dash.routesDraft} draft` : "published") : undefined} href="/admin?tab=seoRoutes" icon={Route} />
        <Stat label="Holiday trips" value={display(dash.holidaysOk, dash.holidaysActive)} hint={dash.holidaysOk ? `${dash.holidaysTotal} total` : undefined} href="/admin?tab=packages" icon={Palmtree} />
        <Stat label="Vehicles" value={display(dash.vehiclesOk, dash.vehiclesActive)} hint={dash.vehiclesOk ? (dash.cabVerify ? `${dash.cabVerify} to verify` : `${dash.vehiclesTotal} total`) : undefined} href="/admin?tab=cabs" icon={Bus} />
        <Stat label="Vendors" value={display(dash.vendorsOk, dash.vendorsActive)} hint={dash.vendorsOk ? `${dash.vendorsTotal} total` : undefined} href="/admin?tab=master&section=vendors" icon={Building2} />
        <Stat label="Acting drivers" value={display(dash.driversOk, dash.driversActive)} hint={dash.driversOk ? `${dash.driversTotal} total` : undefined} href="/admin?tab=actingDriversOps" icon={UserCircle} />
        <Stat label="Clients" value={display(dash.clientsOk, dash.clients)} href="/admin?tab=customers" icon={Users} />
        <Stat label="Bookings" value={display(dash.bookingsOk, dash.bookingsTotal)} hint={dash.bookingsOk ? (dash.bookingPending ? `${dash.bookingPending} pending` : "all clear") : undefined} href="/admin?tab=bookings" icon={CalendarCheck} />
        <Stat label="Blogs" value={display(dash.blogsOk, dash.blogsPublished)} hint={dash.blogsOk ? `${dash.blogsTotal} total` : undefined} href="/admin?tab=blogs" icon={BookOpen} />
        <Stat label="Offers" value={display(dash.offersOk, dash.offersPublished)} href="/admin?tab=master&section=offers" icon={Tag} />
        <Stat label="Reviews" value={display(dash.reviewsOk, dash.reviewsTotal)} hint={dash.reviewsOk ? `${dash.testimonialsPublished || 0} testimonials` : undefined} href="/admin?tab=reviewsHub" icon={Star} />
      </div>

      {attention.length ? (
        <div className="flex flex-wrap gap-1.5">
          {attention.map((item) => (
            <Link key={item.label} href={item.href} className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100">
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <h2 className="text-sm font-bold text-slate-900">Cities & services</h2>
            <Link href="/admin?tab=cities" className="text-xs font-semibold text-sky-700 hover:underline">
              Manage
            </Link>
          </div>
          <div className="max-h-72 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-semibold">City</th>
                  <th className="px-4 py-2 font-semibold">Services</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(dash.cities || []).map((city) => {
                  const flags = city.services || {};
                  return (
                    <tr key={city._id || city.slug}>
                      <td className="px-4 py-2 font-semibold text-slate-800">{city.name}</td>
                      <td className="px-4 py-2">
                        <span className="flex flex-wrap gap-1">
                          <Flag on={flags.cabBooking !== false} label="Cab" />
                          <Flag on={flags.airportTaxi !== false} label="Airport" />
                          <Flag on={flags.actingDriver !== false} label="Driver" />
                          <Flag on={flags.holidayTrips !== false} label="Holiday" />
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`text-[11px] font-bold uppercase ${city.isActive === false ? "text-slate-400" : "text-emerald-700"}`}>
                          {city.isActive === false ? "Off" : "Active"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {loaded && dash.citiesOk && !dash.cities?.length ? <p className="px-4 py-4 text-sm text-slate-500">No cities yet.</p> : null}
            {loaded && dash.citiesOk === false ? <p className="px-4 py-4 text-sm text-rose-600">Could not load cities.</p> : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <h2 className="text-sm font-bold text-slate-900">Bookings</h2>
            <Link href="/admin?tab=bookings" className="text-xs font-semibold text-sky-700 hover:underline">
              Open
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5 px-4 py-2.5">
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">Pending {dash.bookingPending || 0}</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">Confirmed {dash.bookingConfirmed || 0}</span>
            <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-800">Finished {dash.bookingFinished || 0}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">Cancelled {dash.bookingCancelled || 0}</span>
          </div>
          {dash.recentBookings?.length ? (
            <ul className="divide-y divide-slate-100">
              {dash.recentBookings.map((booking) => (
                <li key={booking._id} className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
                  <span className="min-w-0 truncate font-semibold text-slate-800">{booking.customerName || "Guest"}</span>
                  <span className="hidden min-w-0 truncate text-xs text-slate-500 sm:inline">
                    {booking.pickup || booking.type || "—"}
                    {booking.drop ? ` → ${booking.drop}` : ""}
                  </span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600">
                    {booking.status || "pending"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-slate-500">{loaded ? "No bookings yet." : "Loading…"}</p>
          )}
        </div>
      </div>
    </div>
  );
}
