"use client";

import { useCallback, useEffect, useState } from "react";
import AdminSeoNoindexReview from "./AdminSeoNoindexReview";

function showMetric(m) {
  if (m == null) return "DATA UNAVAILABLE";
  if (typeof m === "number") return String(m);
  if (m.available === false) return m.label || "DATA UNAVAILABLE";
  if (m.percent != null) return `${m.percent}%`;
  if (m.label === "booking_fare_gmv" && m.value != null) return `₹${Number(m.value).toLocaleString("en-IN")}`;
  if (typeof m.value === "number") return String(m.value);
  return "DATA UNAVAILABLE";
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

function Table({ columns, rows, empty, stickyFirst = false }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-xs">
        <thead>
          <tr className="border-b bg-slate-50 text-slate-500">
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!rows?.length ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center text-slate-400">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={row.key || row.landingPage || row.url || row.city || row.service || row.route || i} className="border-b border-slate-100">
                {row.cells.map((cell, j) => (
                  <td key={j} className={`px-3 py-2 text-slate-800 ${stickyFirst && j === 0 ? "sticky left-0 bg-white" : ""}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const EMPTY_INSIGHT = {
  landingPage: "",
  pageType: "service",
  city: "",
  service: "",
  vendorSupplyNote: "unknown",
  investFlag: false,
  recommendation: "",
  notes: ""
};

export default function AdminSeoRevenue({ token }) {
  const [days, setDays] = useState(30);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [gscRows, setGscRows] = useState([]);
  const [insightForm, setInsightForm] = useState(EMPTY_INSIGHT);
  const [editInsightId, setEditInsightId] = useState("");
  const [gscForm, setGscForm] = useState({
    keyword: "",
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
    landingPage: "",
    snapshotDate: ""
  });
  const [editGscId, setEditGscId] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [section, setSection] = useState("overview");
  const [syncing, setSyncing] = useState(false);

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};

  const loadReport = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams();
      if (from && to) {
        q.set("from", from);
        q.set("to", to);
      } else {
        q.set("days", String(days));
      }
      const res = await fetch(`/api/analytics/seo-revenue?${q.toString()}`, { headers: authHeaders, cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || "Could not load SEO revenue report.");
      setData(json.data);
    } catch (err) {
      setError(err.message || "Could not load SEO revenue report.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token, days, from, to]);

  const loadCrud = useCallback(async () => {
    if (!token) return;
    try {
      const [ins, gsc] = await Promise.all([
        fetch("/api/seo-events/insights", { headers: authHeaders, cache: "no-store" }).then((r) => r.json()),
        fetch("/api/enterprise/search-console?limit=100", { headers: authHeaders, cache: "no-store" }).then((r) => r.json())
      ]);
      setInsights(ins.data || []);
      setGscRows(gsc.data || []);
    } catch {
      /* report still usable */
    }
  }, [token]);

  useEffect(() => {
    loadReport();
    loadCrud();
  }, [loadReport, loadCrud]);

  async function saveInsight(e) {
    e.preventDefault();
    setFormMsg("");
    const path = editInsightId ? `/api/seo-events/insights/${editInsightId}` : "/api/seo-events/insights";
    const res = await fetch(path, {
      method: editInsightId ? "PUT" : "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(insightForm)
    });
    const json = await res.json();
    if (!res.ok) {
      setFormMsg(json.message || "Save failed");
      return;
    }
    setInsightForm(EMPTY_INSIGHT);
    setEditInsightId("");
    setFormMsg("Insight saved.");
    loadCrud();
    loadReport();
  }

  async function removeInsight(id) {
    if (!window.confirm("Delete this insight note?")) return;
    await fetch(`/api/seo-events/insights/${id}`, { method: "DELETE", headers: authHeaders });
    loadCrud();
    loadReport();
  }

  async function saveGsc(e) {
    e.preventDefault();
    setFormMsg("");
    const path = editGscId ? `/api/enterprise/search-console/${editGscId}` : "/api/enterprise/search-console";
    const res = await fetch(path, {
      method: editGscId ? "PUT" : "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        ...gscForm,
        clicks: Number(gscForm.clicks) || 0,
        impressions: Number(gscForm.impressions) || 0,
        ctr: Number(gscForm.ctr) || 0,
        position: Number(gscForm.position) || 0
      })
    });
    const json = await res.json();
    if (!res.ok) {
      setFormMsg(json.message || "GSC save failed");
      return;
    }
    setGscForm({ keyword: "", clicks: 0, impressions: 0, ctr: 0, position: 0, landingPage: "", snapshotDate: "" });
    setEditGscId("");
    setFormMsg("Search Console row saved. These are imported figures, not live API data.");
    loadCrud();
    loadReport();
  }

  async function removeGsc(id) {
    if (!window.confirm("Delete this Search Console snapshot row?")) return;
    await fetch(`/api/enterprise/search-console/${id}`, { method: "DELETE", headers: authHeaders });
    loadCrud();
    loadReport();
  }

  async function syncGsc() {
    setSyncing(true);
    setFormMsg("");
    setError("");
    try {
      const body = from && to ? { from, to } : { days };
      const res = await fetch("/api/enterprise/search-console/sync", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "GSC DATA NOT CONNECTED");
      setFormMsg(
        `Search Console sync stored ${json.data?.stored ?? 0} rows for ${json.data?.startDate} → ${json.data?.endDate} (${json.data?.property}).`
      );
      await loadReport();
      await loadCrud();
    } catch (err) {
      setError(err.message || "GSC DATA NOT CONNECTED");
    } finally {
      setSyncing(false);
    }
  }

  const src = data?.sources;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">SEO → booking → revenue</h2>
        <p className="mt-1 text-sm text-slate-600">
          Super-admin only. Numbers come from Mongo bookings, first-party SEO events, and imported Search Console
          snapshots. Empty history is shown as 0 or DATA UNAVAILABLE — never as placeholders.
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setFrom("");
                setTo("");
                setDays(d);
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                !from && days === d ? "bg-sky-600 text-white" : "border border-slate-200 text-slate-700"
              }`}
            >
              Last {d} days
            </button>
          ))}
          <label className="text-xs text-slate-600">
            From
            <input className="ml-1 rounded border border-slate-300 px-2 py-1" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="text-xs text-slate-600">
            To
            <input className="ml-1 rounded border border-slate-300 px-2 py-1" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button type="button" onClick={loadReport} className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
            Apply
          </button>
          <button
            type="button"
            onClick={syncGsc}
            disabled={syncing}
            className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            {syncing ? "Syncing…" : "Sync Search Console"}
          </button>
        </div>
        {data?.period ? (
          <div className="mt-3 space-y-1 text-xs text-slate-700">
            <p className="font-semibold">Selected period: {data.period.label}</p>
            <p>Booking date range: {data.period.bookingRange?.start} → {data.period.bookingRange?.end}</p>
            <p>GSC date range: {data.period.gscRange?.start} → {data.period.gscRange?.end}</p>
            {data.period.rangeWarning ? (
              <p className="rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-900">{data.period.rangeWarning}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
      {formMsg ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{formMsg}</p> : null}
      {loading && !data ? <p className="text-sm text-slate-500">Loading report…</p> : null}

      {data ? (
        <>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <SourceCard title="GA4" status={src.ga4.status} detail={src.ga4.detail} />
            <SourceCard title="Search Console" status={src.gsc.status} detail={src.gsc.detail} />
            <SourceCard title="Bookings" status={src.bookings.status} detail={src.bookings.detail} />
            <SourceCard title="Money field" status={src.moneyField.label} detail={src.moneyField.detail} />
          </div>
          <p className="text-xs text-slate-600">
            Attribution: {data.attribution.method} Window: {data.attribution.window}
          </p>
          {data.attribution?.conversionWarning ? (
            <p className="rounded-md bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
              {data.attribution.conversionWarning} GSC is used for impressions, clicks, CTR, position, and queries only.
            </p>
          ) : null}
          <p className="text-xs text-slate-600">
            Cabzii commission: {showMetric(src.cabziiCommission)} · Vendor payout: {showMetric(src.vendorPayout)}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <Kpi label="Operational starts" value={String(data.totals.operationalBookingStarts)} />
            <Kpi label="Operational completed" value={String(data.totals.operationalCompletedBookings)} />
            <Kpi label="Operational GMV" value={`₹${Number(data.totals.operationalGmv).toLocaleString("en-IN")}`} />
            <Kpi label="SEO-attributed starts" value={String(data.totals.attributedBookingStarts)} />
            <Kpi label="SEO-attributed completed" value={String(data.totals.attributedCompletedBookings)} />
            <Kpi label="SEO-attributed GMV" value={`₹${Number(data.totals.attributedGmv).toLocaleString("en-IN")}`} />
          </div>

          <nav className="flex flex-wrap gap-1">
            {[
              ["overview", "Overview"],
              ["pages", "Pages"],
              ["queries", "Queries"],
              ["opportunities", "Opportunities"],
              ["noindex", "Noindex review"],
              ["notes", "Notes & GSC rows"]
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSection(id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  section === id ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {section === "overview" ? (
            <>
          <div className="grid gap-3 lg:grid-cols-3">
            {(data.spotlight || []).map((spot) => (
              <div key={spot.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{spot.title}</p>
                <h3 className="text-base font-bold text-slate-900">{spot.subtitle}</h3>
                <p className="mt-1 truncate text-[11px] text-slate-500">{spot.landingPage}</p>
                <dl className="mt-3 space-y-1 text-xs text-slate-700">
                  <Row k="Google/Search traffic" v={showMetric(spot.googleSearchTraffic)} />
                  <Row k="Search impressions" v={showMetric(spot.impressions)} />
                  <Row k="Clicks" v={showMetric(spot.clicks)} />
                  <Row k="Booking starts" v={String(spot.bookingStarts)} />
                  <Row k="Completed bookings" v={String(spot.completedBookings)} />
                  <Row k="GMV" v={showInr(spot.gmv)} />
                  <Row k="Average booking value" v={showInr(spot.averageBookingValue)} />
                  <Row k="SEO → booking conversion" v={showMetric(spot.seoToCompleted)} />
                  <Row k="Booking start → completion" v={showMetric(spot.bookingStartToCompletion)} />
                </dl>
                <p className="mt-2 text-[11px] text-slate-500">{spot.attributionNote}</p>
                {spot.operationalCompletedBookings ? (
                  <p className="mt-1 text-[11px] text-slate-400">
                    Operational completed (not SEO-attributed): {spot.operationalCompletedBookings} · {showInr(spot.operationalGmv)}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold text-slate-900">Top SEO pages by completed bookings (attributed only)</h3>
          <Table
            columns={["Page", "Starts", "Completed", "GMV", "Avg", "SEO conversion"]}
            empty="No SEO-attributed bookings in this period."
            rows={(data.topSeoPagesByCompletedBookings || []).map((r) => ({
              landingPage: r.landingPage,
              cells: [r.landingPage, r.bookingStarts, r.completedBookings, showInr(r.gmv), showInr(r.averageBookingValue), showMetric(r.seoToCompleted)]
            }))}
          />

          <h3 className="text-sm font-bold text-slate-900">Top SEO pages by GMV (attributed only)</h3>
          <Table
            columns={["Page", "Completed", "GMV", "Avg"]}
            empty="No SEO-attributed GMV in this period."
            rows={(data.topSeoPagesByGmv || []).map((r) => ({
              landingPage: r.landingPage,
              cells: [r.landingPage, r.completedBookings, showInr(r.gmv), showInr(r.averageBookingValue)]
            }))}
          />

          <h3 className="text-sm font-bold text-slate-900">Cities (operational trip fields — not SEO attribution)</h3>
          <Table
            columns={["Rank", "City", "SEO traffic", "Bookings", "GMV", "Avg booking", "Conversion"]}
            empty="No in-scope bookings in this period."
            rows={(data.topCities || []).map((r, i) => ({
              city: r.city,
              cells: [i + 1, r.city, showMetric(r.seoTraffic), r.bookings, showInr(r.gmv), showInr(r.avgBooking), showMetric(r.conversion)]
            }))}
          />

          <h3 className="text-sm font-bold text-slate-900">Services (operational)</h3>
          <Table
            columns={["Service", "SEO traffic", "Bookings", "GMV", "Avg", "Conversion"]}
            empty="No in-scope bookings in this period."
            rows={(data.topServices || []).map((r) => ({
              service: r.service,
              cells: [r.service, showMetric(r.seoTraffic), r.bookings, showInr(r.gmv), showInr(r.avgBooking), showMetric(r.conversion)]
            }))}
          />

          <h3 className="text-sm font-bold text-slate-900">Featured routes</h3>
          <Table
            columns={["Route", "Traffic", "Bookings", "GMV", "Avg", "Conversion"]}
            empty="No route data."
            rows={(data.topRoutes || []).map((r) => ({
              route: r.route,
              cells: [r.route, showMetric(r.googleSearchTraffic), r.completedBookings, showInr(r.gmv), showInr(r.averageBookingValue), showMetric(r.seoToCompleted)]
            }))}
          />

          <h3 className="text-sm font-bold text-slate-900">Airport pages</h3>
          <Table
            columns={["Page", "Bookings", "GMV"]}
            empty="No airport-page bookings."
            rows={(data.topAirportPages || []).map((r) => ({
              landingPage: r.landingPage,
              cells: [r.landingPage, r.completedBookings, showInr(r.gmv)]
            }))}
          />

          <h3 className="text-sm font-bold text-slate-900">Acting driver</h3>
          <Table
            columns={["Page", "Bookings", "GMV"]}
            empty="No acting-driver bookings."
            rows={(data.actingDriverPerformance || []).map((r) => ({
              landingPage: r.landingPage,
              cells: [r.landingPage, r.completedBookings, showInr(r.gmv)]
            }))}
          />

          <h3 className="text-sm font-bold text-slate-900">Tours / pilgrimage</h3>
          <Table
            columns={["Page", "Bookings", "GMV"]}
            empty="No tour/pilgrimage attributed bookings."
            rows={(data.tourPilgrimagePerformance || []).map((r) => ({
              landingPage: r.landingPage,
              cells: [r.landingPage, r.completedBookings, showInr(r.gmv)]
            }))}
          />

          <h3 className="text-sm font-bold text-slate-900">Vendor expansion signal</h3>
          <p className="text-xs text-slate-500">Active cab listings vs operational completed bookings. Does not change vendor records.</p>
          <Table
            columns={["City", "Completed bookings", "Active cab listings", "GSC impressions", "Recommendation"]}
            empty="No city signal."
            rows={(data.vendorExpansion || []).slice(0, 20).map((r) => ({
              city: r.city,
              cells: [r.city, r.operationalCompletedBookings, r.activeCabListings, showMetric(r.gscImpressions), r.recommendation]
            }))}
          />
            </>
          ) : null}

          {section === "pages" ? (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">SEO pages with Search Console + bookings</h3>
              <p className="text-xs text-slate-500">
                Conversion uses first-party SEO sessions, not GSC clicks. Swipe horizontally on small screens.
              </p>
              <Table
                stickyFirst
                columns={[
                  "Page",
                  "City",
                  "Service",
                  "Origin",
                  "Destination",
                  "Impressions",
                  "Clicks",
                  "CTR",
                  "Avg position",
                  "SEO views",
                  "Booking starts",
                  "Completed",
                  "GMV",
                  "Avg booking",
                  "Conversion"
                ]}
                empty="No page rows for this period."
                rows={(data.pagePerformance || []).map((r) => ({
                  landingPage: r.landingPage,
                  cells: [
                    r.landingPage,
                    r.city || "—",
                    r.service || "—",
                    r.origin || "—",
                    r.destination || "—",
                    showMetric(r.impressions),
                    showMetric(r.clicks),
                    showCtr(r.ctr),
                    showMetric(r.position),
                    showMetric(r.seoSessions),
                    r.bookingStarts,
                    r.completedBookings,
                    showInr(r.gmv),
                    showInr(r.averageBookingValue),
                    showMetric(r.seoToCompleted)
                  ]
                }))}
              />
            </div>
          ) : null}

          {section === "queries" ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                {data.queries?.status || "GSC DATA NOT CONNECTED"}. Queries map to canonical landing pages — no new URLs are created.
              </p>
              <h3 className="text-sm font-bold text-slate-900">Top queries by clicks</h3>
              <Table
                columns={["Query", "Clicks", "Impressions", "CTR", "Position", "Canonical page"]}
                empty="GSC DATA NOT CONNECTED"
                rows={(data.queries?.topByClicks || []).map((r) => ({
                  key: `c-${r.keyword}`,
                  cells: [r.keyword, r.clicks, r.impressions, r.ctr, r.position, r.landingPage || "DATA UNAVAILABLE"]
                }))}
              />
              <h3 className="text-sm font-bold text-slate-900">Top queries by impressions</h3>
              <Table
                columns={["Query", "Impressions", "Clicks", "CTR", "Canonical page"]}
                empty="GSC DATA NOT CONNECTED"
                rows={(data.queries?.topByImpressions || []).map((r) => ({
                  key: `i-${r.keyword}`,
                  cells: [r.keyword, r.impressions, r.clicks, r.ctr, r.landingPage || "DATA UNAVAILABLE"]
                }))}
              />
              <h3 className="text-sm font-bold text-slate-900">Queries with attributed bookings</h3>
              <p className="text-[11px] text-slate-500">
                Attributed bookings on the mapped canonical page. This is not clicks ÷ bookings.
              </p>
              <Table
                columns={["Query", "Clicks", "Attributed completed", "Canonical page"]}
                empty="GSC DATA NOT CONNECTED"
                rows={(data.queries?.topByAttributedBookings || []).map((r) => ({
                  key: `b-${r.keyword}`,
                  cells: [r.keyword, r.clicks, r.attributedCompletedBookings, r.landingPage || "DATA UNAVAILABLE"]
                }))}
              />
            </div>
          ) : null}

          {section === "opportunities" ? (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Opportunity report</h3>
              <p className="text-xs text-slate-500">Recommendations only. No pages or vendors are created automatically.</p>
              <h4 className="text-xs font-bold text-slate-800">High impressions + low CTR</h4>
              <Table
                columns={["Page", "Impressions", "Clicks", "CTR"]}
                empty="GSC DATA NOT CONNECTED"
                rows={(data.opportunities?.highImpressionsLowCtr || []).map((r) => ({
                  landingPage: r.landingPage,
                  cells: [r.landingPage, r.impressions, r.clicks, r.ctr]
                }))}
              />
              <h4 className="text-xs font-bold text-slate-800">High clicks + low bookings</h4>
              <Table
                columns={["Page", "GSC clicks", "Completed bookings", "Note"]}
                empty="GSC DATA NOT CONNECTED"
                rows={(data.opportunities?.highClicksLowBookings || []).map((r) => ({
                  landingPage: r.landingPage,
                  cells: [r.landingPage, r.clicks, r.completedBookings, r.note]
                }))}
              />
              <h4 className="text-xs font-bold text-slate-800">Low traffic + high conversion</h4>
              <Table
                columns={["Page", "SEO sessions", "Completed", "Conversion"]}
                empty="No first-party sessions to score this list."
                rows={(data.opportunities?.lowTrafficHighConversion || []).map((r) => ({
                  landingPage: r.landingPage,
                  cells: [r.landingPage, r.traffic, r.completedBookings, showMetric(r.conversion)]
                }))}
              />
              <h4 className="text-xs font-bold text-slate-800">High bookings + high GMV</h4>
              <Table
                columns={["Page", "Completed", "GMV"]}
                empty="No SEO-attributed GMV in this period."
                rows={(data.opportunities?.highBookingsHighGmv || []).map((r) => ({
                  landingPage: r.landingPage,
                  cells: [r.landingPage, r.completedBookings, showInr(r.gmv)]
                }))}
              />
              <h4 className="text-xs font-bold text-slate-800">High search demand + low supply</h4>
              <Table
                columns={["City", "Completed bookings", "Active listings", "GSC impressions", "Recommendation"]}
                empty="No city demand/supply signal."
                rows={(data.opportunities?.highDemandLowSupply || []).map((r) => ({
                  city: r.city,
                  cells: [r.city, r.operationalCompletedBookings, r.activeCabListings, showMetric(r.gscImpressions), r.recommendation]
                }))}
              />
              <h3 className="text-sm font-bold text-slate-900">Business decision report</h3>
              <p className="text-xs text-slate-500">{data.decisions?.note}</p>
              <Table
                columns={["City", "Operational bookings", "GMV"]}
                empty="No city booking data in this period."
                rows={(data.decisions?.investCities || []).map((r) => ({
                  city: r.city,
                  cells: [r.city, r.bookings, showInr(r.gmv)]
                }))}
              />
            </div>
          ) : null}

          {section === "noindex" ? <AdminSeoNoindexReview rows={data.noindexReport || []} /> : null}
        </>
      ) : null}

      {section === "notes" ? (
      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={saveInsight} className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-bold text-slate-900">{editInsightId ? "Edit" : "Add"} SEO insight note</h3>
          <p className="text-xs text-slate-500">Operational notes only — not search volume.</p>
          <input className="mt-2 w-full rounded border px-2 py-1.5 text-sm" placeholder="/services/airport-taxi/chennai" value={insightForm.landingPage} onChange={(e) => setInsightForm((p) => ({ ...p, landingPage: e.target.value }))} required />
          <select className="mt-2 w-full rounded border px-2 py-1.5 text-sm" value={insightForm.vendorSupplyNote} onChange={(e) => setInsightForm((p) => ({ ...p, vendorSupplyNote: e.target.value }))}>
            <option value="unknown">Supply unknown</option>
            <option value="low">Supply low</option>
            <option value="adequate">Supply adequate</option>
            <option value="strong">Supply strong</option>
          </select>
          <select className="mt-2 w-full rounded border px-2 py-1.5 text-sm" value={insightForm.recommendation} onChange={(e) => setInsightForm((p) => ({ ...p, recommendation: e.target.value }))}>
            <option value="">No recommendation</option>
            <option value="keep">Keep</option>
            <option value="improve_content">Improve content</option>
            <option value="add_vendors">Add vendors</option>
            <option value="review_indexation">Review indexation</option>
          </select>
          <label className="mt-2 flex items-center gap-2 text-xs">
            <input type="checkbox" checked={insightForm.investFlag} onChange={(e) => setInsightForm((p) => ({ ...p, investFlag: e.target.checked }))} />
            Invest flag
          </label>
          <textarea className="mt-2 w-full rounded border px-2 py-1.5 text-sm" rows={3} placeholder="Notes" value={insightForm.notes} onChange={(e) => setInsightForm((p) => ({ ...p, notes: e.target.value }))} />
          <div className="mt-2 flex gap-2">
            <button type="submit" className="rounded bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white">
              {editInsightId ? "Update" : "Add"}
            </button>
            {editInsightId ? (
              <button type="button" className="text-xs" onClick={() => { setEditInsightId(""); setInsightForm(EMPTY_INSIGHT); }}>
                Cancel
              </button>
            ) : null}
          </div>
          <ul className="mt-3 space-y-1 text-xs">
            {insights.map((i) => (
              <li key={i._id} className="flex justify-between gap-2 border-b border-slate-100 py-1">
                <span>{i.landingPage}</span>
                <span className="flex gap-2">
                  <button type="button" className="text-sky-700" onClick={() => { setEditInsightId(i._id); setInsightForm({ landingPage: i.landingPage, pageType: i.pageType || "service", city: i.city || "", service: i.service || "", vendorSupplyNote: i.vendorSupplyNote || "unknown", investFlag: Boolean(i.investFlag), recommendation: i.recommendation || "", notes: i.notes || "" }); }}>
                    Edit
                  </button>
                  <button type="button" className="text-rose-600" onClick={() => removeInsight(i._id)}>
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </form>

        <form onSubmit={saveGsc} className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-bold text-slate-900">{editGscId ? "Edit" : "Add"} Search Console snapshot</h3>
          <p className="text-xs text-slate-500">Manual/imported rows only. Live GSC API is not connected.</p>
          <input className="mt-2 w-full rounded border px-2 py-1.5 text-sm" placeholder="keyword" value={gscForm.keyword} onChange={(e) => setGscForm((p) => ({ ...p, keyword: e.target.value }))} required />
          <input className="mt-2 w-full rounded border px-2 py-1.5 text-sm" placeholder="/services/airport-taxi/chennai" value={gscForm.landingPage} onChange={(e) => setGscForm((p) => ({ ...p, landingPage: e.target.value }))} />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input className="rounded border px-2 py-1.5 text-sm" type="number" placeholder="clicks" value={gscForm.clicks} onChange={(e) => setGscForm((p) => ({ ...p, clicks: e.target.value }))} />
            <input className="rounded border px-2 py-1.5 text-sm" type="number" placeholder="impressions" value={gscForm.impressions} onChange={(e) => setGscForm((p) => ({ ...p, impressions: e.target.value }))} />
            <input className="rounded border px-2 py-1.5 text-sm" type="number" step="0.01" placeholder="ctr" value={gscForm.ctr} onChange={(e) => setGscForm((p) => ({ ...p, ctr: e.target.value }))} />
            <input className="rounded border px-2 py-1.5 text-sm" type="number" step="0.1" placeholder="position" value={gscForm.position} onChange={(e) => setGscForm((p) => ({ ...p, position: e.target.value }))} />
          </div>
          <input className="mt-2 w-full rounded border px-2 py-1.5 text-sm" placeholder="snapshotDate YYYY-MM-DD" value={gscForm.snapshotDate} onChange={(e) => setGscForm((p) => ({ ...p, snapshotDate: e.target.value }))} />
          <div className="mt-2 flex gap-2">
            <button type="submit" className="rounded bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white">
              {editGscId ? "Update" : "Add"}
            </button>
            {editGscId ? (
              <button type="button" className="text-xs" onClick={() => { setEditGscId(""); setGscForm({ keyword: "", clicks: 0, impressions: 0, ctr: 0, position: 0, landingPage: "", snapshotDate: "" }); }}>
                Cancel
              </button>
            ) : null}
          </div>
          <ul className="mt-3 max-h-64 space-y-1 overflow-auto text-xs">
            {gscRows.map((r) => (
              <li key={r._id} className="flex justify-between gap-2 border-b border-slate-100 py-1">
                <span>
                  {r.keyword} → {r.landingPage || "(no page)"}
                </span>
                <span className="flex gap-2">
                  <button
                    type="button"
                    className="text-sky-700"
                    onClick={() => {
                      setEditGscId(r._id);
                      setGscForm({
                        keyword: r.keyword || "",
                        clicks: r.clicks || 0,
                        impressions: r.impressions || 0,
                        ctr: r.ctr || 0,
                        position: r.position || 0,
                        landingPage: r.landingPage || "",
                        snapshotDate: r.snapshotDate || ""
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="text-rose-600" onClick={() => removeGsc(r._id)}>
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </form>
      </div>
      ) : null}
    </div>
  );
}

function SourceCard({ title, status, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-[10px] font-semibold uppercase text-slate-500">{title}</p>
      <p className="text-sm font-bold text-slate-900">{status}</p>
      <p className="mt-1 text-[11px] text-slate-500">{detail}</p>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="text-sm font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-2">
      <dt>{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}
