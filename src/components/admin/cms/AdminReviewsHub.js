"use client";

import { useState } from "react";
import AdminReviews from "../AdminReviews";
import AdminCatalogPanel from "../AdminCatalogPanel";

export default function AdminReviewsHub({ token, isSuperAdmin }) {
  const [tab, setTab] = useState("reviews");
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">CMS</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reviews & Testimonials</h1>
        <p className="mt-1 text-sm text-slate-600">Trip reviews from finished bookings, plus homepage testimonials.</p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("reviews")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${tab === "reviews" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"}`}
        >
          Reviews
        </button>
        <button
          type="button"
          onClick={() => setTab("testimonials")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${tab === "testimonials" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"}`}
        >
          Testimonials
        </button>
      </div>
      {tab === "reviews" ? (
        <AdminReviews token={token} />
      ) : (
        <AdminCatalogPanel tabKey="testimonials" token={token} isSuperAdmin={isSuperAdmin} pageMode="list" />
      )}
    </div>
  );
}
