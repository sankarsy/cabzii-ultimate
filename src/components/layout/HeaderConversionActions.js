"use client";

import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "../WhatsAppIcon";
import { telUrl, whatsappBookingUrl } from "../../lib/conversion";
import { SEO_CITIES } from "../../lib/seo/cities";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { useSiteSettings } from "../SiteSettingsProvider";

export default function HeaderConversionActions({ compact = false, onNavigate }) {
  const settings = useSiteSettings();
  const { city, setSelectedCity } = useSelectedCity();
  const [cityOpen, setCityOpen] = useState(false);
  const cityRef = useRef(null);
  const phone = settings.contact?.phone || "+91-9944197416";
  const whatsappNumber = String(settings.whatsappFab?.number || settings.contact?.whatsapp || "9944197416").replace(/\D/g, "");
  const waHref = whatsappBookingUrl({
    phone: whatsappNumber,
    message: `Hi Cabzii, I need a cab in ${city || "Chennai"}. Please share fare and availability.`
  });

  useEffect(() => {
    if (!cityOpen) return undefined;
    const onDoc = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [cityOpen]);

  const btnBase = compact
    ? "cabzii-tap inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold"
    : "cabzii-tap hidden items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold lg:inline-flex";

  return (
    <div className={`flex items-center gap-2 ${compact ? "w-full flex-col" : ""}`}>
      <div ref={cityRef} className={`relative ${compact ? "w-full" : ""}`}>
        <button
          type="button"
          onClick={() => setCityOpen((o) => !o)}
          className={`${btnBase} border border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700 ${compact ? "w-full" : ""}`}
          aria-expanded={cityOpen}
        >
          {city || "Chennai"}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </button>
        {cityOpen ? (
          <div className="absolute left-0 top-full z-[120] mt-1 max-h-64 w-48 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
            {SEO_CITIES.slice(0, 12).map((c) => (
              <button
                key={c.slug}
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-800"
                onClick={() => {
                  setSelectedCity(c.name);
                  setCityOpen(false);
                  onNavigate?.();
                }}
              >
                {c.name}
              </button>
            ))}
            <Link
              href="/locations"
              className="block border-t border-slate-100 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50"
              onClick={() => {
                setCityOpen(false);
                onNavigate?.();
              }}
            >
              All cities →
            </Link>
          </div>
        ) : null}
      </div>

      <a
        href={telUrl(phone)}
        className={`${btnBase} border border-slate-200 text-[var(--cabzii-brand)] hover:bg-sky-50 ${compact ? "w-full" : ""}`}
        onClick={onNavigate}
      >
        <Phone className="h-4 w-4" strokeWidth={2} />
        Call
      </a>
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        className={`${btnBase} border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ${compact ? "w-full" : ""}`}
        onClick={onNavigate}
      >
        <WhatsAppIcon className="h-4 w-4" />
        WhatsApp
      </a>
      <Link
        href="/cabs"
        className={`cabzii-tap inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 ${compact ? "w-full" : ""}`}
        style={{ background: "var(--cabzii-gradient-cta)" }}
        onClick={onNavigate}
      >
        Book now
      </Link>
    </div>
  );
}
