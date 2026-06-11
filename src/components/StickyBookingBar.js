"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { telUrl, whatsappBookingUrl } from "../lib/conversion";

/* No sticky bar where it would block checkout/admin flows */
const HIDDEN_PREFIXES = ["/admin", "/payment", "/login", "/cabs/passenger", "/drivers/passenger"];

/**
 * Mobile-only sticky bottom booking bar — Call · WhatsApp · Book Now.
 * The single highest-converting pattern for local service sites.
 */
export default function StickyBookingBar() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))) return null;

  return (
    <>
      {/* In-flow spacer so the fixed bar never covers footer content */}
      <div className="h-[4.25rem] sm:hidden" aria-hidden />
      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-px border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(15,23,42,0.08)] sm:hidden"
        aria-label="Quick booking"
      >
        <a
          href={telUrl()}
          className="cabzii-tap flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 text-[var(--cabzii-brand)]"
          aria-label="Call Cabzii now"
        >
          <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
          <span className="text-[11px] font-bold leading-none">Call now</span>
        </a>
        <a
          href={whatsappBookingUrl()}
          target="_blank"
          rel="noreferrer"
          className="cabzii-tap flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 text-[#1da851]"
          aria-label="Get instant quote on WhatsApp"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span className="text-[11px] font-bold leading-none">WhatsApp</span>
        </a>
        <Link
          href="/cabs"
          className="cabzii-tap flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 text-white"
          style={{ background: "var(--cabzii-gradient-brand)" }}
          aria-label="Book a cab now"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 5c-.3-.8-1-1.3-1.8-1.3H7.8c-.8 0-1.5.5-1.8 1.3L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2M7 17h10" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
          <span className="text-[11px] font-bold leading-none">Book now</span>
        </Link>
      </nav>
    </>
  );
}
