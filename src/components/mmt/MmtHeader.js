"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND } from "../../lib/brand";
import { clearSession, isLoggedIn } from "../../lib/auth";
import { useScrollHeader } from "../../lib/useScrollHeader";
import HeaderSearchBar from "./HeaderSearchBar";

function SiteHeader({ loggedIn, logout, menuOpen, setMenuOpen, linkClass, pathname }) {
  const onLoginPage = pathname === "/login" || pathname.startsWith("/login/");

  return (
    <>
      <div className="border-b border-slate-200/90 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-3 sm:px-6 sm:py-2.5">
          <Link href="/" className="min-w-0 shrink justify-self-start" aria-label={`${BRAND.fullName} home`}>
            <CabziiLogo
              showDomain
              showTagline
              className="!text-base sm:!text-lg lg:!text-xl max-md:[&>span:last-child]:hidden"
            />
          </Link>

          <div className="hidden min-w-0 justify-center px-2 lg:flex lg:px-4">
            <HeaderSearchBar variant="light" className="w-full max-w-xl" onSubmitted={() => setMenuOpen(false)} />
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:justify-self-end">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mmt-mobile-nav"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="sr-only">Menu</span>
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 lg:inline-block"
                >
                  Account
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 lg:inline-flex"
                >
                  Logout
                </button>
              </>
            ) : onLoginPage ? null : (
              <Link
                href="/login"
                className="cabzii-tap rounded-lg bg-[var(--cabzii-brand)] px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-[var(--cabzii-brand-hover)] sm:px-4"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mmt-mobile-nav" className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden" aria-label="Mobile">
          <div className="mb-4">
            <HeaderSearchBar variant="light" compact className="w-full" onSubmitted={() => setMenuOpen(false)} />
          </div>
          <div>
            {loggedIn ? (
              <div className="flex flex-wrap gap-2">
                <Link href="/account" className={linkClass("/account", true)} onClick={() => setMenuOpen(false)}>
                  Account
                </Link>
                <Link href="/my-bookings" className={linkClass("/my-bookings", true)} onClick={() => setMenuOpen(false)}>
                  My Trips
                </Link>
                <button type="button" onClick={logout} className={linkClass("/account", true)}>
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="cabzii-tap inline-flex w-full justify-center rounded-lg bg-[var(--cabzii-brand)] px-4 py-2.5 text-sm font-bold text-white"
                onClick={() => setMenuOpen(false)}
              >
                Login or Signup
              </Link>
            )}
          </div>
        </nav>
      ) : null}
    </>
  );
}

/** Same logo + search + login navbar on every page. */
export default function MmtHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { visible: headerVisible, forceVisible } = useScrollHeader(true);

  useEffect(() => {
    const sync = () => setLoggedIn(isLoggedIn());
    sync();
    window.addEventListener("cabzii-auth", sync);
    return () => window.removeEventListener("cabzii-auth", sync);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) forceVisible();
  }, [menuOpen, forceVisible]);

  useEffect(() => {
    const root = document.documentElement;
    if (menuOpen) root.classList.add("menu-scroll-lock");
    else root.classList.remove("menu-scroll-lock");
    return () => root.classList.remove("menu-scroll-lock");
  }, [menuOpen]);

  const logout = async () => {
    clearSession();
    await fetch("/api/auth/session", { method: "DELETE" });
    setLoggedIn(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const showHeader = headerVisible || menuOpen;

  const linkClass = (href, block = false) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    const base = block ? "block rounded-lg px-3 py-2" : "rounded-full px-3 py-2";
    return `${base} text-sm font-medium transition ${
      active ? "bg-blue-50 text-[var(--cabzii-brand)]" : "text-slate-600 hover:bg-slate-50 hover:text-[var(--cabzii-brand)]"
    }`;
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[100] border-b border-slate-200 bg-white text-slate-900 shadow-sm transition-transform duration-300 ease-out will-change-transform ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <SiteHeader
        loggedIn={loggedIn}
        logout={logout}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        linkClass={linkClass}
        pathname={pathname}
      />
    </header>
  );
}
