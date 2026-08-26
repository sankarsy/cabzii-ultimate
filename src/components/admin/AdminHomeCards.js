"use client";

import { useCallback, useEffect, useState } from "react";
import ImageUploadField from "./ImageUploadField";
import { HOME_CARD_COPY } from "../../lib/homeShowcase";

const ICON_OPTIONS = ["car", "holiday", "route", "airport", "driver"];
const COLOR_OPTIONS = [
  "from-[var(--cabzii-brand)] to-blue-500",
  "from-rose-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-indigo-500 to-violet-400",
  "from-amber-500 to-orange-400",
  "from-slate-700 to-slate-500"
];

function emptyCard(section) {
  return {
    section,
    tag: "",
    title: "",
    desc: "",
    iconKey: "car",
    color: "from-[var(--cabzii-brand)] to-blue-500",
    image: "",
    href: "/cabs",
    code: "",
    fare: "",
    validTill: "",
    sortOrder: 0,
    published: true
  };
}

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function inputCls() {
  return "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

export default function AdminHomeCards({ token, section = "offers" }) {
  const copy = HOME_CARD_COPY[section] || HOME_CARD_COPY.offers;
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState(() => emptyCard(section));
  const [editId, setEditId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`
  };

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/offers?admin=1&section=${encodeURIComponent(section)}`, {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store"
      });
      const json = await res.json();
      setCards(Array.isArray(json?.data) ? json.data : []);
    } catch {
      setMessage(`Failed to load ${copy.noun}s.`);
    } finally {
      setLoading(false);
    }
  }, [token, section, copy.noun]);

  useEffect(() => {
    setForm(emptyCard(section));
    setEditId("");
    setMessage("");
    load();
  }, [load, section]);

  const save = async () => {
    if (!form.title.trim()) {
      setMessage("Title is required.");
      return;
    }
    const payload = { ...form, section };
    const url = editId ? `/api/offers/${editId}` : "/api/offers";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.message || "Save failed");
      return;
    }
    setForm(emptyCard(section));
    setEditId("");
    setMessage(`${copy.title} card saved. It will show on the homepage.`);
    await load();
  };

  const remove = async (id) => {
    if (!window.confirm(`Delete this ${copy.noun}?`)) return;
    const res = await fetch(`/api/offers/${id}`, { method: "DELETE", headers });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.message || "Delete failed");
      return;
    }
    setMessage("Deleted.");
    if (editId === id) {
      setEditId("");
      setForm(emptyCard(section));
    }
    await load();
  };

  const showPromo = section === "offers";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-bold text-slate-800">{editId ? `Edit ${copy.noun}` : `Create ${copy.noun}`}</p>
        <p className="mt-1 text-xs text-slate-600">{copy.hint}</p>
        {message ? <p className="mt-2 text-sm text-slate-700">{message}</p> : null}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Title *">
            <input
              className={inputCls()}
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder={section === "services" ? "Cab services in Chennai" : section === "routes" ? "Chennai → Tirupati" : "Chennai airport taxi"}
            />
          </Field>
          <Field label="Tag">
            <input
              className={inputCls()}
              value={form.tag}
              onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
              placeholder={section === "services" ? "CHENNAI" : "AIRPORT"}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea className={inputCls()} rows={2} value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} />
            </Field>
          </div>
          {showPromo ? (
            <>
              <Field label="Promo code">
                <input className={inputCls()} value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} placeholder="CHNAIR" />
              </Field>
              <Field label="Valid till">
                <input className={inputCls()} value={form.validTill} onChange={(e) => setForm((p) => ({ ...p, validTill: e.target.value }))} placeholder="31st Jul, 2026" />
              </Field>
            </>
          ) : (
            <Field label="Fare badge">
              <input className={inputCls()} value={form.fare} onChange={(e) => setForm((p) => ({ ...p, fare: e.target.value }))} placeholder="From ₹899" />
            </Field>
          )}
          <Field label="Link (href)">
            <input className={inputCls()} value={form.href} onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))} placeholder="/cabs" />
          </Field>
          <div className="sm:col-span-2">
            <ImageUploadField
              label="Card image"
              hint="Upload a WebP/JPG or paste a path such as /images/showcase/chennai.webp"
              value={form.image}
              onChange={(image) => setForm((p) => ({ ...p, image }))}
              authToken={token}
              alt={form.title || copy.noun}
            />
          </div>
          <Field label="Icon">
            <select className={inputCls()} value={form.iconKey} onChange={(e) => setForm((p) => ({ ...p, iconKey: e.target.value }))}>
              {ICON_OPTIONS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Banner colour">
            <select className={inputCls()} value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}>
              {COLOR_OPTIONS.map((key) => (
                <option key={key} value={key}>
                  {key.replace("from-[var(--cabzii-brand)] to-blue-500", "Brand blue")}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sort order">
            <input
              type="number"
              className={inputCls()}
              value={form.sortOrder}
              onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) || 0 }))}
            />
          </Field>
        </div>
        <label className="mt-3 flex items-center gap-2 text-xs text-slate-600">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))} />
          Published on homepage
        </label>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={save} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
            {editId ? "Update" : "Create"} {copy.noun}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm(emptyCard(section));
              setEditId("");
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        {loading ? <p className="p-3 text-sm text-slate-500">Loading…</p> : null}
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Card</th>
              <th className="px-3 py-2 text-left">{showPromo ? "Code" : "Fare"}</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((o) => (
              <tr key={o._id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2">
                  <p className="font-semibold text-slate-900">{o.title}</p>
                  <p className="text-[11px] text-slate-500">{o.tag || "—"}</p>
                </td>
                <td className="px-3 py-2 font-mono text-xs">{showPromo ? o.code || "—" : o.fare || "—"}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${o.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                    {o.published ? "Live" : "Hidden"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs font-semibold text-sky-700"
                      onClick={() => {
                        setEditId(o._id);
                        setForm({
                          ...emptyCard(section),
                          tag: o.tag || "",
                          title: o.title || "",
                          desc: o.desc || "",
                          iconKey: o.iconKey || "car",
                          color: o.color || emptyCard(section).color,
                          image: o.image || "",
                          href: o.href || "/cabs",
                          code: o.code || "",
                          fare: o.fare || "",
                          validTill: o.validTill || "",
                          sortOrder: o.sortOrder || 0,
                          published: o.published !== false
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="text-xs font-semibold text-rose-700" onClick={() => remove(o._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!cards.length && !loading ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-500">
                  No cards yet. Create one or reload — defaults are seeded on first open.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
