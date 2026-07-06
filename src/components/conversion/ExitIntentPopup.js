"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Phone, X } from "lucide-react";
import WhatsAppIcon from "../WhatsAppIcon";
import { useSiteSettings } from "../SiteSettingsProvider";
import { telUrl, whatsappBookingUrl } from "../../lib/conversion";
import { shouldHideFloatingUi } from "../../lib/floatingUi";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "cabzii-exit-intent-dismissed";

function isDismissed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

export default function ExitIntentPopup() {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const [open, setOpen] = useState(false);
  const dismissedRef = useRef(isDismissed());
  const phone = settings.contact?.phone || "+91-9944197416";
  const whatsappNumber = String(settings.whatsappFab?.number || settings.contact?.whatsapp || "9944197416").replace(/\D/g, "");
  const waHref = whatsappBookingUrl({
    phone: whatsappNumber,
    message: "Hi Cabzii, I was about to leave — please share a quick cab quote for my trip."
  });

  const dismiss = useCallback(() => {
    dismissedRef.current = true;
    markDismissed();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (shouldHideFloatingUi(pathname)) return undefined;
    if (typeof window === "undefined") return undefined;
    if (dismissedRef.current || isDismissed()) return undefined;

    const onMouseOut = (e) => {
      if (dismissedRef.current || isDismissed()) return;
      if (e.clientY > 24) return;
      if (e.relatedTarget || e.toElement) return;

      dismissedRef.current = true;
      markDismissed();
      document.removeEventListener("mouseout", onMouseOut);
      setOpen(true);
    };

    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, [pathname]);

  useEffect(() => {
    if (shouldHideFloatingUi(pathname) && open) {
      setOpen(false);
    }
  }, [pathname, open]);

  if (!open || shouldHideFloatingUi(pathname)) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Get a quote before you go"
      onClick={dismiss}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--cabzii-brand)]">Instant quote</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Need a cab before you go?</h2>
            <p className="mt-2 text-sm text-slate-600">Call or WhatsApp us — get fares in under 30 seconds. No app download needed.</p>
          </div>
          <button type="button" onClick={dismiss} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <a href={waHref} target="_blank" rel="noreferrer" onClick={dismiss} className="cabzii-tap flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white">
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp quote
          </a>
          <a href={telUrl(phone)} onClick={dismiss} className="cabzii-tap flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-[var(--cabzii-brand)]">
            <Phone className="h-5 w-5" />
            Call now
          </a>
        </div>
        <Link
          href="/cabs"
          className="cabzii-tap mt-3 block w-full rounded-xl py-3 text-center text-sm font-bold text-white"
          style={{ background: "var(--cabzii-gradient-brand)" }}
          onClick={dismiss}
        >
          Search & book online
        </Link>
      </div>
    </div>
  );
}
