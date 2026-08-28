"use client";

import { useEffect } from "react";
import Link from "next/link";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND } from "../../lib/brand";

/**
 * Cabzii.in admin chrome — matches public site header colors.
 * Phones: hamburger opens a left side drawer over the page.
 * Desktop: persistent left sidenav; only the main panel scrolls.
 */
export default function AdminShell({
  user,
  onLogout,
  navOpen = false,
  onToggleNav,
  onCloseNav,
  sidebar,
  children
}) {
  useEffect(() => {
    document.documentElement.classList.add("admin-scroll-lock");
    return () => document.documentElement.classList.remove("admin-scroll-lock");
  }, []);

  useEffect(() => {
    if (!navOpen || !onCloseNav) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onCloseNav();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen, onCloseNav]);

  const hasSidebar = Boolean(sidebar);

  return (
    <div className="admin-app flex h-dvh flex-col overflow-hidden bg-[var(--cabzii-bg)]">
      <header className="relative z-[60] shrink-0 border-b border-white/10 bg-[var(--cabzii-header)] text-white shadow-md">
        <div className="flex min-h-[48px] items-center gap-2 px-3 md:px-6 lg:px-8">
          <Link href="/" className="shrink-0 rounded-md bg-white px-1.5 py-0.5 lg:px-2.5 lg:py-1">
            <CabziiLogo compact showDomain className="[&>span]:!text-[13px] lg:[&>span]:!text-xl" />
          </Link>
          <div className="hidden min-w-0 border-l border-white/20 pl-3 lg:block">
            <p className="truncate text-sm font-bold">{user?.role === "vendor_admin" ? "Operator panel" : "Admin panel"}</p>
            <p className="text-xs text-white/70">{BRAND.domain}</p>
          </div>
          <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 text-sm">
            {user ? (
              <>
                <span className="hidden min-w-0 truncate text-white/90 lg:inline">
                  <span className="font-semibold text-white">{user.mobileNumber || user.phone}</span>
                  <span className="text-white/60"> · {user.role}</span>
                  {user.vendorName ? <span className="text-white/60"> · {user.vendorName}</span> : null}
                </span>
                <Link
                  href="/"
                  className="hidden rounded-lg border border-white/25 px-2.5 py-1.5 text-sm font-semibold hover:bg-white/10 lg:inline-flex"
                >
                  View site
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="hidden rounded-lg bg-white/10 px-2.5 py-1.5 text-sm font-semibold hover:bg-white/20 lg:inline-flex"
                >
                  Logout
                </button>
              </>
            ) : null}
            {hasSidebar && onToggleNav ? (
              <button
                type="button"
                onClick={onToggleNav}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/25 px-2.5 lg:hidden"
                aria-expanded={navOpen}
                aria-controls="admin-sidenav"
                aria-label={navOpen ? "Hide menu" : "Show menu"}
              >
                {navOpen ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
                    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                  </svg>
                )}
                <span className="text-xs font-semibold">{navOpen ? "Close" : "Menu"}</span>
              </button>
            ) : null}
          </div>
        </div>
        {user ? (
          <p className="truncate px-3 pb-2 text-[11px] text-white/80 md:hidden">
            {user.mobileNumber || user.phone}
            {user.role ? ` · ${user.role}` : ""}
            {user.vendorName ? ` · ${user.vendorName}` : ""}
          </p>
        ) : null}
      </header>
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {hasSidebar && navOpen ? (
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 z-40 bg-slate-900/40 lg:hidden"
            onClick={onCloseNav}
          />
        ) : null}
        {hasSidebar ? (
          <aside
            id="admin-sidenav"
            className={`absolute inset-y-0 left-0 z-50 w-[min(18rem,86vw)] flex-col overflow-y-auto overscroll-contain border-r border-slate-200 bg-white p-2 shadow-2xl lg:relative lg:z-auto lg:!flex lg:h-full lg:w-[12.5rem] lg:shadow-none ${
              navOpen ? "mmt-mobile-nav-drawer flex" : "hidden"
            }`}
          >
            <div className="mb-1 flex items-center justify-between px-2 py-1 lg:hidden">
              <p className="text-xs font-bold text-slate-700">Menu</p>
              <button
                type="button"
                onClick={onCloseNav}
                className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            {sidebar}
            <div className="mt-auto space-y-1 border-t border-slate-100 px-1 pt-2 lg:hidden">
              <Link
                href="/"
                onClick={onCloseNav}
                className="flex w-full items-center rounded-md px-2 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                View site
              </Link>
              {onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center rounded-md px-2 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </button>
              ) : null}
            </div>
          </aside>
        ) : null}
        <div className="admin-workspace min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 md:px-6 lg:px-8 lg:py-4">{children}</div>
      </div>
    </div>
  );
}
