"use client";

import { useCallback, useEffect, useState } from "react";
import { CRM_PIPELINE_STAGES } from "../../lib/domesticFocus";

function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function stageStyle(stage) {
  return CRM_PIPELINE_STAGES.find((s) => s.id === stage)?.color || "bg-slate-100 text-slate-600";
}

function stageLabel(stage) {
  return CRM_PIPELINE_STAGES.find((s) => s.id === stage)?.label || stage;
}

const EMPTY_LEAD = {
  name: "",
  mobile: "",
  email: "",
  source: "website",
  stage: "new",
  route: "",
  vehicleType: "",
  estimatedFare: "",
  assignedTo: "",
  followUpAt: ""
};

export default function AdminCrm({ token, isSuperAdmin }) {
  const [dashboard, setDashboard] = useState(null);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [stageFilter, setStageFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [callOutcome, setCallOutcome] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_LEAD);
  const [importing, setImporting] = useState(false);

  const authHeaders = token ? { authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};

  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/dashboard", { headers: authHeaders });
      const data = await res.json();
      if (res.ok && data?.data) setDashboard(data.data);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (stageFilter) params.set("stage", stageFilter);
      const res = await fetch(`/api/crm?${params}`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Could not load leads.");
      setRows(Array.isArray(data.data) ? data.data : []);
      setMeta(data.meta || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.message || "Could not load leads.");
      setRows([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, stageFilter, token]);

  useEffect(() => {
    if (isSuperAdmin) {
      loadDashboard();
      loadLeads();
    }
  }, [isSuperAdmin, loadDashboard, loadLeads]);

  const openLead = async (id) => {
    setSelected(id);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/crm/${id}`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok && data?.data) setDetail(data.data);
    } finally {
      setDetailLoading(false);
    }
  };

  const updateLead = async (payload) => {
    if (!selected) return;
    const res = await fetch(`/api/crm/${selected}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    setDetail(data.data);
    loadLeads();
    loadDashboard();
  };

  const addNote = async () => {
    if (!noteText.trim() || !selected) return;
    const res = await fetch(`/api/crm/${selected}/notes`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ text: noteText.trim() })
    });
    const data = await res.json();
    if (res.ok && data?.data) {
      setDetail(data.data);
      setNoteText("");
    }
  };

  const addCallLog = async () => {
    if (!selected) return;
    const res = await fetch(`/api/crm/${selected}/call-logs`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ outcome: callOutcome, notes: callOutcome })
    });
    const data = await res.json();
    if (res.ok && data?.data) {
      setDetail(data.data);
      setCallOutcome("");
    }
  };

  const createLead = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/crm", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          ...form,
          estimatedFare: Number(form.estimatedFare) || 0,
          followUpAt: form.followUpAt || null
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Could not create lead");
      setShowCreate(false);
      setForm(EMPTY_LEAD);
      loadLeads();
      loadDashboard();
      if (data?.data?._id) openLead(data.data._id);
    } catch (err) {
      setError(err.message);
    }
  };

  const importChatLeads = async () => {
    setImporting(true);
    try {
      const res = await fetch("/api/crm/import-chat-leads", { method: "POST", headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Import failed");
      loadLeads();
      loadDashboard();
      alert(`Imported ${data?.data?.imported ?? 0} chat leads into CRM.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">CRM</h2>
        <p className="mt-2 text-sm text-slate-600">Only a super admin can manage leads.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">CRM & lead pipeline</h2>
          <p className="text-sm text-slate-600">Track enquiries from chat, website & calls through to booking.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--cabzii-brand-hover)]"
          >
            + New lead
          </button>
          <button
            type="button"
            onClick={importChatLeads}
            disabled={importing}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
          >
            {importing ? "Importing…" : "Import Zii chat leads"}
          </button>
        </div>
      </div>

      {dashboard ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">Total leads</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{dashboard.total ?? 0}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">Completed</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-600">{dashboard.completed ?? 0}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">Conversion</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--cabzii-brand)]">{dashboard.conversionRate ?? 0}%</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-amber-700">Due follow-ups</p>
            <p className="mt-1 text-2xl font-extrabold text-amber-800">{dashboard.dueFollowUps ?? 0}</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setStageFilter(""); setPage(1); }}
          className={`rounded-full px-3 py-1 text-xs font-bold ${!stageFilter ? "bg-[var(--cabzii-brand)] text-white" : "bg-slate-100 text-slate-700"}`}
        >
          All
        </button>
        {CRM_PIPELINE_STAGES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => { setStageFilter(s.id); setPage(1); }}
            className={`rounded-full px-3 py-1 text-xs font-bold ${stageFilter === s.id ? "bg-[var(--cabzii-brand)] text-white" : "bg-slate-100 text-slate-700"}`}
          >
            {s.label}
            {dashboard?.byStage?.[s.id] != null ? ` (${dashboard.byStage[s.id]})` : ""}
          </button>
        ))}
      </div>

      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No leads yet.</td></tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row._id}
                      onClick={() => openLead(row._id)}
                      className={`cursor-pointer border-b border-slate-100 hover:bg-blue-50/50 ${selected === row._id ? "bg-blue-50" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.mobile}{row.repeatCustomer ? " · Repeat" : ""}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.route || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${stageStyle(row.stage)}`}>
                          {stageLabel(row.stage)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{fmtDate(row.followUpAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {meta.totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="text-sm font-semibold text-[var(--cabzii-brand)] disabled:opacity-40">Previous</button>
              <span className="text-xs text-slate-500">Page {page} of {meta.totalPages}</span>
              <button type="button" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} className="text-sm font-semibold text-[var(--cabzii-brand)] disabled:opacity-40">Next</button>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {!selected ? (
            <p className="text-sm text-slate-500">Select a lead to view details, notes & call logs.</p>
          ) : detailLoading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : detail ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{detail.name}</h3>
                <p className="text-sm text-slate-600">{detail.mobile}{detail.email ? ` · ${detail.email}` : ""}</p>
                <p className="mt-1 text-xs text-slate-500">Source: {detail.source || "website"}</p>
              </div>

              <label className="block">
                <span className="text-xs font-bold uppercase text-slate-500">Pipeline stage</span>
                <select
                  value={detail.stage}
                  onChange={(e) => updateLead({ ...detail, stage: e.target.value }).catch((err) => setError(err.message))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {CRM_PIPELINE_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-xs font-bold uppercase text-slate-500">Assigned to</span>
                  <input
                    value={detail.assignedTo || ""}
                    onChange={(e) => setDetail({ ...detail, assignedTo: e.target.value })}
                    onBlur={() => updateLead(detail).catch((err) => setError(err.message))}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase text-slate-500">Follow-up</span>
                  <input
                    type="datetime-local"
                    value={detail.followUpAt ? new Date(detail.followUpAt).toISOString().slice(0, 16) : ""}
                    onChange={(e) => {
                      const val = e.target.value ? new Date(e.target.value).toISOString() : null;
                      const next = { ...detail, followUpAt: val };
                      setDetail(next);
                      updateLead(next).catch((err) => setError(err.message));
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              {detail.mobile ? (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/91${String(detail.mobile).replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(`Hi ${detail.name}, regarding your Cabzii enquiry…`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-[#25D366] px-3 py-2 text-xs font-bold text-white"
                  >
                    WhatsApp
                  </a>
                  <a href={`tel:+91${String(detail.mobile).replace(/\D/g, "").slice(-10)}`} className="rounded-lg bg-[var(--cabzii-brand)] px-3 py-2 text-xs font-bold text-white">
                    Call
                  </a>
                </div>
              ) : null}

              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Notes</p>
                <div className="mt-2 max-h-32 space-y-2 overflow-y-auto">
                  {(detail.notes || []).map((n, i) => (
                    <div key={i} className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                      <p>{n.text}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{fmtDate(n.createdAt)} · {n.author || "admin"}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add note…" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                  <button type="button" onClick={addNote} className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-white">Add</button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Call logs</p>
                <div className="mt-2 max-h-24 space-y-2 overflow-y-auto">
                  {(detail.callLogs || []).map((c, i) => (
                    <div key={i} className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                      {c.outcome || c.notes || "Call logged"}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input value={callOutcome} onChange={(e) => setCallOutcome(e.target.value)} placeholder="Call outcome…" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                  <button type="button" onClick={addCallLog} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700">Log call</button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {showCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={createLead} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">New lead</h3>
            <div className="mt-4 space-y-3">
              {["name", "mobile", "email", "route", "vehicleType", "assignedTo"].map((field) => (
                <label key={field} className="block">
                  <span className="text-xs font-bold uppercase text-slate-500">{field}</span>
                  <input
                    required={field === "name" || field === "mobile"}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
              <button type="submit" className="rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white">Create</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
