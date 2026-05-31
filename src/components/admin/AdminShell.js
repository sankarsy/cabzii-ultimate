"use client";

import Link from "next/link";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND } from "../../lib/brand";

/**
 * Cabzii.in admin chrome — matches public site header colors.
 */
export default function AdminShell({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-[var(--cabzii-bg)]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--cabzii-header)] text-white shadow-md">
        <div className="flex min-h-[56px] flex-wrap items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="rounded-lg bg-white px-2.5 py-1">
              <CabziiLogo showDomain />
            </Link>
            <div className="hidden border-l border-white/20 pl-4 sm:block">
              <p className="text-sm font-bold">Admin panel</p>
              <p className="text-xs text-white/70">{BRAND.domain}</p>
            </div>
          </div>
          {user ? (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-white/90">
                <span className="font-semibold text-white">{user.mobileNumber || user.phone}</span>
                <span className="text-white/60"> · {user.role}</span>
                {user.vendorName ? <span className="text-white/60"> · {user.vendorName}</span> : null}
              </span>
              <Link
                href="/"
                className="rounded-lg border border-white/25 px-3 py-1.5 font-semibold hover:bg-white/10"
              >
                View site
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </header>
      <div className="px-4 py-8 md:px-6 lg:px-8">{children}</div>
    </div>
  );
}
