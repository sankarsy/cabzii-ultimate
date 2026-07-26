"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND } from "../../lib/brand";
import { clearSession, isLoggedIn } from "../../lib/auth";
import { useScrollHeader } from "../../lib/useScrollHeader";
import HeaderSearchBar from "./HeaderSearchBar";
import MobileSideNav from "../layout/MobileSideNav";

function SiteHeader({ loggedIn, logout, menuOpen, setMenuOpen, pathname }) {
  const onLoginPage = pathname === "/login" || pathname.startsWith("/login/");
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="border-b border-slate-200/90 bg-white pt-[env(safe-area-inset-top,0px)]">
        <div className="section-shell flex items-center justify-between gap-3 py-3 sm:py-3.5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4">
          <Link href="/" className="min-w-0 shrink justify-self-start" aria-label={`${BRAND.fullName} home`}>
            <CabziiLogo
              showDomain
              showTagline
              className="!text-base sm:!text-lg lg:!text-xl max-md:[&>span:last-child]:hidden"
            />
          </Link>

          <div className="hidden min-w-0 justify-center px-2 lg:flex lg:px-4">
            <HeaderSearchBar variant="light" className="w-full max-w-sm" onSubmitted={closeMenu} />
          </div>

          <div className="hidden shrink-0 items-center justify-end gap-2 lg:flex sm:justify-self-end">
            {loggedIn ? (
              <>
                <Link href="/account" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  Account
                </Link>
                <button type="button" onClick={logout} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Logout
                </button>
              </>
            ) : onLoginPage ? null : (
              <Link href="/login" className="cabzii-btn cabzii-btn-cta cabzii-tap px-4 text-sm hover:-translate-y-px">
                Login
              </Link>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-1.5 lg:hidden">
            {loggedIn ? (
              <Link
                href="/account"
                className="cabzii-tap inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[var(--cabzii-brand)] hover:bg-blue-50/70"
                aria-label="Account"
              >
                <UserRound className="h-5 w-5" strokeWidth={1.75} />
              </Link>
            ) : null}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[var(--cabzii-brand)] hover:bg-blue-50/70"
              aria-expanded={menuOpen}
              aria-controls="mmt-mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/** Same logo + search + login navbar on every page. */
export default function MmtHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
  const activeHeroTab = searchParams.get("tab") || "cabs";
  const onLoginPage = pathname === "/login" || pathname.startsWith("/login/");

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[100] border-b border-slate-200 bg-white text-slate-900 shadow-sm transition-transform duration-300 ease-out will-change-transform max-xl:translate-y-0 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <SiteHeader
          loggedIn={loggedIn}
          logout={logout}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          pathname={pathname}
        />
      </header>

      <MobileSideNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
        activeHeroTab={activeHeroTab}
        loggedIn={loggedIn}
        onLogout={logout}
        onLoginPage={onLoginPage}
      />
    </>
  );
}
