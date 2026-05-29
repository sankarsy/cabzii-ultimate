"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cabzii_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
      document.cookie = `${STORAGE_KEY}=${choice}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
    } catch {
      /* storage unavailable — dismiss anyway */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-60 px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.12)] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-slate-600">
          We use cookies to keep you signed in, remember your bookings and improve cabzii.in. See our{" "}
          <a href="/terms-and-conditions" className="font-semibold text-[#0056D2] underline">
            terms
          </a>{" "}
          for details.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-xl bg-[#0056D2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0047b3]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
