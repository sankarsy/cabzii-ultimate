"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AdminAiChat({ token, isSuperAdmin }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/chat-leads?limit=200", { headers: authHeaders });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Could not load AI chats.");
      setRows(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Could not load AI chats.");
      setRows([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (isSuperAdmin) load();
  }, [isSuperAdmin, load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      JSON.stringify({
        name: row.name,
        mobile: row.mobile,
        last: row.lastUserMessage,
        source: row.source
      })
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  const open = filtered.find((r) => r._id === selected) || null;

  if (!isSuperAdmin) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">AI chat list</h2>
        <p className="mt-2 text-sm text-slate-600">Only a super admin can view Zii chatbot conversations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI chat list</h2>
          <p className="text-sm text-slate-600">Zii chatbot conversations saved from the website. Mobile is collected before chat.</p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, mobile or message…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-600"
            />
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {loading ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">Loading chats…</p>
            ) : filtered.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">No AI chats yet.</p>
            ) : (
              <ul>
                {filtered.map((row) => (
                  <li key={row._id}>
                    <button
                      type="button"
                      onClick={() => setSelected(row._id)}
                      className={`w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-sky-50 ${
                        selected === row._id ? "bg-sky-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">{row.name || "Guest"} · {row.mobile}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-600">{row.lastUserMessage || "No message yet"}</p>
                        </div>
                        <div className="shrink-0 text-right text-[10px] text-slate-500">
                          <p>{row.messageCount || 0} msgs</p>
                          <p>{fmtDate(row.lastMessageAt || row.createdAt)}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {!open ? (
            <p className="text-sm text-slate-500">Select a chat to read the conversation.</p>
          ) : (
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{open.name || "Guest"}</h3>
                <p className="text-sm text-slate-600">{open.mobile}</p>
                <p className="mt-1 text-xs text-slate-500">Source: {open.source || "zii-chatbot"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`tel:+91${open.mobile}`} className="rounded-lg bg-[var(--cabzii-brand)] px-3 py-1.5 text-xs font-bold text-white">
                  Call
                </a>
                <a
                  href={`https://wa.me/91${open.mobile}?text=${encodeURIComponent(`Hi ${open.name || ""}, this is Cabzii regarding your chat enquiry.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white"
                >
                  WhatsApp
                </a>
              </div>
              <div className="max-h-[52vh] space-y-1.5 overflow-y-auto rounded-lg bg-slate-50 p-2">
                {(open.messages || []).length ? (
                  open.messages.map((m, idx) => (
                    <p
                      key={`${open._id}-${idx}`}
                      className={`rounded-md px-2 py-1.5 text-xs ${
                        m.role === "user" ? "bg-white text-slate-800 ring-1 ring-slate-200" : "bg-sky-50 text-slate-700"
                      }`}
                    >
                      <span className="font-bold">{m.role === "user" ? "Customer" : "Zii"}: </span>
                      {m.content}
                    </p>
                  ))
                ) : (
                  <p className="px-2 py-6 text-center text-xs text-slate-500">Mobile collected — no chat yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
