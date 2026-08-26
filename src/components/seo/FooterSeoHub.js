"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PILGRIMAGE_PACKAGES } from "../../lib/domesticFocus";
import { HOLIDAY_CATEGORIES } from "../../lib/holidays";
import {
  actingDriverLinks,
  cabBookingLinks,
  routeLinks,
  serviceLinks,
  serviceLinksForCities
} from "../../lib/seo/internalLinks";

function chunkColumns(items, cols = 4) {
  const columns = Array.from({ length: cols }, () => []);
  items.forEach((item, index) => {
    columns[index % cols].push(item);
  });
  return columns;
}

function buildSections() {
  const packages = PILGRIMAGE_PACKAGES.map((p) => ({ href: p.href, label: p.name }));
  const categories = HOLIDAY_CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
    href: `/holidays?category=${c.id}`,
    label: c.label
  }));

  return [
    { id: "packages", label: "Popular tour packages", intro: "Pilgrimage and temple tour packages with cab pickup.", items: packages },
    { id: "categories", label: "Explore by category", intro: "Find holidays by trip style — pilgrimage, beach, hills and more.", items: categories },
    { id: "cab-booking", label: "Cab booking by city", intro: "City taxi booking pages for South India hubs.", items: cabBookingLinks() },
    { id: "drivers", label: "Acting drivers by city", intro: "Hire an acting driver for your own car, city by city.", items: actingDriverLinks() },
    { id: "one-way", label: "Popular one-way routes", intro: "Intercity one-way cab routes with upfront fares.", items: routeLinks(32) },
    { id: "chennai", label: "Services in Chennai", intro: "Airport taxi, outstation, hourly rental and more in Chennai.", items: serviceLinks("chennai") },
    {
      id: "other-cities",
      label: "Services — Bengaluru, Hyderabad & more",
      intro: "Cab and driver services in Bengaluru, Hyderabad, Coimbatore and Madurai.",
      items: serviceLinksForCities(["bengaluru", "hyderabad", "coimbatore", "madurai"], { servicesPerCity: 4 })
    }
  ];
}

function LinkColumns({ items }) {
  const columns = chunkColumns(items, items.length > 12 ? 4 : 3);
  return (
    <div className="grid max-h-56 grid-cols-2 gap-x-4 gap-y-1 overflow-y-auto overscroll-contain sm:grid-cols-3 lg:grid-cols-4">
      {columns.map((col, idx) => (
        <ul key={idx} className="space-y-1.5">
          {col.map((item) => (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                className="inline-block text-[11px] leading-snug text-slate-600 transition-colors hover:text-[var(--cabzii-cta)] sm:text-sm"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default function FooterSeoHub() {
  const sections = useMemo(() => buildSections(), []);
  const [activeId, setActiveId] = useState(sections[0].id);
  const active = sections.find((t) => t.id === activeId) || sections[0];

  return (
    <div className="border-t border-slate-200/80 pt-5 sm:pt-6" aria-label="Explore cab booking across South India">
      <h2 className="text-sm font-extrabold text-slate-900 sm:text-base">
        Explore cab booking, routes &amp; services across South India
      </h2>
      <p className="mt-1 hidden text-xs text-slate-500 sm:block">{active.intro}</p>

      <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex" role="tablist" aria-label="Footer SEO categories">
        {sections.map((tab) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(tab.id)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                selected
                  ? "bg-[var(--cabzii-brand)] text-white"
                  : "border border-slate-200 bg-white/80 text-slate-600 hover:border-[var(--cabzii-brand)]/35 hover:text-[var(--cabzii-brand)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 hidden sm:block" role="tabpanel">
        <LinkColumns items={active.items} />
      </div>

      <div className="mt-3 space-y-2 sm:hidden">
        {sections.map((tab) => {
          const open = tab.id === activeId;
          return (
            <div key={tab.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white/80">
              <button
                type="button"
                onClick={() => setActiveId(open ? "" : tab.id)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-[11px] font-bold ${
                  open ? "bg-[var(--cabzii-brand-light)] text-[var(--cabzii-brand)]" : "text-slate-800"
                }`}
                aria-expanded={open}
              >
                <span>{tab.label}</span>
                <span aria-hidden>{open ? "−" : "+"}</span>
              </button>
              {open ? (
                <div className="border-t border-slate-100 px-3 py-3">
                  <p className="mb-2 text-[11px] text-slate-500">{tab.intro}</p>
                  <LinkColumns items={tab.items} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
