"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Light sidebar-only admin chrome.
 * Phones: a compact menu button opens the same drawer.
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
    <div className="admin-app flex h-dvh overflow-hidden bg-slate-50">
      {hasSidebar && navOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="absolute inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={onCloseNav}
        />
      ) : null}
      {hasSidebar ? (
        <aside
          id="admin-sidenav"
          className={`absolute inset-y-0 left-0 z-50 flex w-[min(16.5rem,88vw)] flex-col overflow-hidden border-r border-slate-200 bg-white lg:relative lg:z-auto lg:h-full lg:w-60 ${
            navOpen ? "mmt-mobile-nav-drawer shadow-xl" : "hidden lg:flex"
          }`}
        >
          {onCloseNav ? (
            <div className="flex justify-end px-2 pt-2 lg:hidden">
              <button
                type="button"
                onClick={onCloseNav}
                className="rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          ) : null}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2.5">{sidebar}</div>
          <div className="shrink-0 space-y-1 border-t border-slate-200 p-2.5">
            {user ? (
              <div className="px-2.5 py-1.5">
                <p className="truncate text-[12px] font-semibold text-slate-800">{user.mobileNumber || user.phone || "Signed in"}</p>
                <p className="truncate text-[10px] text-slate-500">
                  {user.role}
                  {user.vendorName ? ` · ${user.vendorName}` : ""}
                </p>
              </div>
            ) : null}
            <Link
              href="/"
              onClick={onCloseNav}
              className="flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium text-slate-600 hover:bg-slate-100"
            >
              View site
            </Link>
            {onLogout ? (
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium text-slate-600 hover:bg-slate-100"
              >
                Logout
              </button>
            ) : null}
          </div>
        </aside>
      ) : null}
      <div className="admin-workspace relative min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50 px-3 py-4 md:px-6 lg:px-8 lg:py-6">
        {hasSidebar && onToggleNav ? (
          <button
            type="button"
            onClick={onToggleNav}
            className="mb-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 lg:hidden"
            aria-expanded={navOpen}
            aria-controls="admin-sidenav"
            aria-label={navOpen ? "Hide menu" : "Show menu"}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
            Menu
          </button>
        ) : null}
        {children}
      </div>
    </div>
  );
}
