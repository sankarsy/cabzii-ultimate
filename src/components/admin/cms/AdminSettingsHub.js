"use client";

import { useState } from "react";
import AdminSiteSettings from "../AdminSiteSettings";
import AdminRolesPage from "./AdminRolesPage";

const TABS = [
  { id: "general", label: "General" },
  { id: "callDriver", label: "Service" },
  { id: "homeSections", label: "SEO / homepage" },
  { id: "roles", label: "Roles" }
];

export default function AdminSettingsHub({ token, isSuperAdmin, initialSection = "general" }) {
  const [tab, setTab] = useState(initialSection === "roles" ? "roles" : initialSection || "general");

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Settings</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${tab === item.id ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === "roles" ? (
        <AdminRolesPage />
      ) : (
        <AdminSiteSettings token={token} isSuperAdmin={isSuperAdmin} initialSection={tab} />
      )}
    </div>
  );
}
