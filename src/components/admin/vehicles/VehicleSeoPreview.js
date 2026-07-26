"use client";

import { buildSeoPreview } from "../../../lib/vehicleAdminConfig";

export default function VehicleSeoPreview({ form }) {
  const preview = buildSeoPreview(form);
  const titleLen = preview.title.length;
  const descLen = preview.description.length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Google search preview</p>
        <div className="max-w-2xl rounded-lg bg-white p-4 font-[Arial,sans-serif]">
          <div className="truncate text-xl text-[#1a0dab]">{preview.title}</div>
          <div className="mt-0.5 truncate text-sm text-[#006621]">{preview.url}</div>
          <div className="mt-1 line-clamp-2 text-sm text-[#545454]">{preview.description}</div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`rounded-lg border p-3 text-xs ${titleLen > 60 ? "border-amber-300 bg-amber-50 text-amber-800" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
          Title: {titleLen} chars {titleLen > 60 ? "(recommended ≤ 60)" : ""}
        </div>
        <div className={`rounded-lg border p-3 text-xs ${descLen > 160 ? "border-amber-300 bg-amber-50 text-amber-800" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
          Description: {descLen} chars {descLen > 160 ? "(recommended ≤ 160)" : ""}
        </div>
      </div>
    </div>
  );
}
