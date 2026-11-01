"use client";

import { Component, useMemo, useState } from "react";
import Link from "next/link";
import { popularRouteLinks } from "../../lib/cityOutstationRoutes";
import { resolveScopedCity } from "../../lib/cityShowcase";
import { useSelectedCity } from "../../lib/useSelectedCity";
import {
  actingDriverLinks,
  cabBookingLinks,
  serviceLinks,
  serviceLinksForCities
} from "../../lib/seo/internalLinks";

class ExploreLinksBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function chunkColumns(items, cols = 4) {
  const list = Array.isArray(items) ? items : [];
  const columns = Array.from({ length: cols }, () => []);
  list.forEach((item, index) => {
    columns[index % cols].push(item);
  });
  return columns;
}

function linkItems(fn, ...args) {
  if (typeof fn !== "function") return [];
  try {
    const out = fn(...args);
    return Array.isArray(out) ? out : [];
  } catch {
    return [];
  }
}

function buildSections(citySlug, cityName) {
  return [
    { id: "cab-booking", label: "Cab booking by city", intro: "City taxi booking pages for South India hubs.", items: linkItems(cabBookingLinks) },
    { id: "drivers", label: "Acting drivers by city", intro: "Hire an acting driver for your own car, city by city.", items: linkItems(actingDriverLinks) },
    {
      id: "one-way",
      label: `Popular routes from ${cityName}`,
      intro: `One-way and round-trip cabs from ${cityName} to other cities.`,
      items: linkItems(popularRouteLinks, citySlug, 16)
    },
    { id: "chennai", label: "Services in Chennai", intro: "Airport taxi, outstation, hourly rental and more in Chennai.", items: linkItems(serviceLinks, "chennai") },
    {
      id: "other-cities",
      label: "Services — Madurai, Tirupati & more",
      intro: "Cab and driver services in Madurai, Tirupati, Coimbatore, Trichy and Vellore.",
      items: linkItems(serviceLinksForCities, ["madurai", "tirupati", "coimbatore", "trichy", "vellore"], { servicesPerCity: 2 })
    }
  ];
}

function LinkColumns({ items }) {
  const list = Array.isArray(items) ? items : [];
  const columns = chunkColumns(list, list.length > 12 ? 4 : 3);
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

function ExploreLinksInner() {
  const { city } = useSelectedCity();
  const scoped = useMemo(() => resolveScopedCity(city) || { slug: "chennai", name: "Chennai" }, [city]);
  const sections = useMemo(() => {
    try {
      const next = buildSections(scoped.slug, scoped.name);
      return Array.isArray(next) && next.length ? next : [];
    } catch {
      return [];
    }
  }, [scoped.slug, scoped.name]);
  const [activeId, setActiveId] = useState(sections[0]?.id || "");
  const active = sections.find((t) => t.id === activeId) || sections[0];

  if (!sections.length || !active) return null;

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

export default function FooterExploreLinks() {
  return (
    <ExploreLinksBoundary>
      <ExploreLinksInner />
    </ExploreLinksBoundary>
  );
}
