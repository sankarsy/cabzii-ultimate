"use client";

import { useEffect, useState } from "react";

export default function AdminSiteSettings({ token, isSuperAdmin }) {
  const [json, setJson] = useState("{}");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/site-settings", { headers: authHeaders, cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.data) {
          const { _id, key, createdAt, updatedAt, __v, ...editable } = data.data;
          setJson(JSON.stringify(editable, null, 2));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const save = async () => {
    if (!isSuperAdmin) {
      alert("Only super admin can update site settings.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const parsed = JSON.parse(json);
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(parsed)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Save failed");
      setMessage("Site settings saved. Refresh the homepage to see changes.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Invalid JSON");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Loading site settings…</p>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-md">
      <h2 className="text-lg font-bold text-slate-900">Site settings (Navbar, Footer, Hero, Home sections)</h2>
      <p className="mt-1 text-xs text-slate-600">
        Edit JSON for navbar links, footer contact, hero copy, stats, why-choose-us cards, and homepage section titles.
      </p>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={24}
        className="mt-4 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs outline-none focus:border-sky-600"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || !isSuperAdmin}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save site settings"}
        </button>
        {!isSuperAdmin ? <span className="text-xs text-amber-700">Super admin only</span> : null}
        {message ? <span className="text-xs text-emerald-700">{message}</span> : null}
      </div>
    </div>
  );
}
