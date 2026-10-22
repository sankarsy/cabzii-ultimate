"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import CitySelect from "./cms/CitySelect";
import { CATEGORY_FARE_LABELS } from "../../lib/categoryRouteFare";

const emptyForm = {
  fromCitySlug: "",
  toCitySlug: "",
  hatchback: 0,
  sedan: 0,
  suv: 0,
  van: 0
};

const PRICE_FIELDS = [
  { key: "hatchback", label: "Hatchback" },
  { key: "sedan", label: "Sedan" },
  { key: "suv", label: "SUV" },
  { key: "van", label: "Van / Tempo" }
];

function inputCls() {
  return "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100";
}

function inr(n) {
  const v = Number(n) || 0;
  return v > 0 ? `₹${v.toLocaleString("en-IN")}` : "—";
}

export default function AdminRouteFares({ token = "" }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {})
    }),
    [token]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/route-fares?admin=1", { headers, cache: "no-store" });
      const json = await res.json();
      setRows(Array.isArray(json?.data) ? json.data : []);
      if (!res.ok) setMessage(json?.message || "Could not load route fares.");
    } catch {
      setMessage("Could not load route fares.");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      `${row.fromName} ${row.toName} ${row.fromCitySlug} ${row.toCitySlug}`.toLowerCase().includes(q)
    );
  }, [rows, search]);

  function closeForm() {
    setFormOpen(false);
    setEditId("");
    setForm(emptyForm);
  }

  function openCreate() {
    setMessage("");
    setEditId("");
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(row) {
    setMessage("");
    setEditId(String(row._id));
    setForm({
      fromCitySlug: row.fromCitySlug || "",
      toCitySlug: row.toCitySlug || "",
      hatchback: Number(row.hatchback) || 0,
      sedan: Number(row.sedan) || 0,
      suv: Number(row.suv) || 0,
      van: Number(row.van) || 0
    });
    setFormOpen(true);
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...form,
        hatchback: Number(form.hatchback) || 0,
        sedan: Number(form.sedan) || 0,
        suv: Number(form.suv) || 0,
        van: Number(form.van) || 0
      };
      const res = await fetch(editId ? `/api/route-fares/${editId}` : "/api/route-fares", {
        method: editId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json?.message || "Could not save fare.");
        return;
      }
      closeForm();
      await load();
    } catch {
      setMessage("Could not save fare.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row) {
    if (!window.confirm(`Delete ${row.fromName || row.fromCitySlug} → ${row.toName || row.toCitySlug} fares?`)) return;
    setMessage("");
    try {
      const res = await fetch(`/api/route-fares/${row._id}`, { method: "DELETE", headers });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json?.message || "Could not delete.");
        return;
      }
      await load();
    } catch {
      setMessage("Could not delete.");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">CMS</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Route fares</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Set one price per cab type for outstation, tour and route pages. Example: Chennai → Tirupati Sedan ₹5,500 — every
          sedan on that route shows ₹5,500.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          className={`${inputCls()} max-w-xs`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search city pair…"
        />
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--cabzii-brand)] px-3 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add fare
        </button>
      </div>

      {message ? <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{message}</p> : null}

      {formOpen ? (
        <form onSubmit={save} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">{editId ? "Edit route fare" : "New route fare"}</h2>
            <button type="button" onClick={closeForm} className="text-slate-400 hover:text-slate-700" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-slate-600">
              Pickup city
              <div className="mt-1">
                <CitySelect
                  token={token}
                  value={form.fromCitySlug}
                  onChange={(fromCitySlug) => setForm((p) => ({ ...p, fromCitySlug }))}
                  excludeSlug={form.toCitySlug}
                />
              </div>
            </label>
            <label className="block text-xs font-semibold text-slate-600">
              Drop city
              <div className="mt-1">
                <CitySelect
                  token={token}
                  value={form.toCitySlug}
                  onChange={(toCitySlug) => setForm((p) => ({ ...p, toCitySlug }))}
                  excludeSlug={form.fromCitySlug}
                />
              </div>
            </label>
            {PRICE_FIELDS.map((field) => (
              <label key={field.key} className="block text-xs font-semibold text-slate-600">
                {field.label} (₹)
                <input
                  type="number"
                  min={0}
                  className={`${inputCls()} mt-1`}
                  value={form[field.key] || ""}
                  onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                  placeholder="0"
                />
              </label>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Leave 0 to keep each cab’s own price for that type. Two {CATEGORY_FARE_LABELS[1].toLowerCase()}s always show the
            same sedan amount.
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.fromCitySlug || !form.toCitySlug}
              className="rounded-xl bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save fare"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Route</th>
              {PRICE_FIELDS.map((field) => (
                <th key={field.key} className="px-3 py-2">
                  {field.label}
                </th>
              ))}
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  Loading fares…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  No route fares yet. Add Chennai → Tirupati and enter Hatchback / Sedan / SUV / Van prices.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={String(row._id)} className="border-t border-slate-100">
                  <td className="px-3 py-2.5 font-semibold text-slate-800">
                    {row.fromName || row.fromCitySlug} → {row.toName || row.toCitySlug}
                  </td>
                  {PRICE_FIELDS.map((field) => (
                    <td key={field.key} className="px-3 py-2.5 font-bold text-slate-900">
                      {inr(row[field.key])}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-right">
                    <button type="button" onClick={() => openEdit(row)} className="mr-2 text-slate-500 hover:text-sky-700" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => remove(row)} className="text-slate-400 hover:text-rose-600" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
