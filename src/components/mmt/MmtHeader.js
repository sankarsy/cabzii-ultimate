"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND } from "../../lib/brand";
import { clearSession, isLoggedIn } from "../../lib/auth";
import HeaderSearchBar from "./HeaderSearchBar";
import MobileSideNav from "../layout/MobileSideNav";
import { useHeroSearch } from "../emt/HeroSearchContext";
import EmtCategoryTabs from "../emt/EmtCategoryTabs";
import { productTabFromPath, productTabHref, resolveProductTab } from "../../lib/emt/productNav";

function AccountGlyph({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.75 19.5c.85-3.4 3.25-5.5 6.25-5.5s5.4 2.1 6.25 5.5" />
    </svg>
  );
}

function AccountButton({ href, label }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="cabzii-tap inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2f7] text-slate-700 transition active:scale-95 hover:bg-[#e4e9f1]"
    >
      <AccountGlyph />
    </Link>
  );
}

function ProductTabs({ activeTab, onSelect, className = "" }) {
  return (
    <EmtCategoryTabs variant="nav" activeTab={activeTab} setActiveTab={onSelect} className={className} />
  );
}

function SiteHeader({ loggedIn, logout, menuOpen, setMenuOpen, pathname, activeTab, onSelectTab }) {
  const onLoginPage = pathname === "/login" || pathname.startsWith("/login/");
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="border-b border-slate-200/90 bg-white pt-[env(safe-area-inset-top,0px)]">
      <div className="section-shell grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 py-2.5 sm:gap-3 lg:gap-4">
        <Link href="/" className="min-w-0 shrink-0 justify-self-start" aria-label={`${BRAND.fullName} home`}>
          <CabziiLogo
            showDomain
            showTagline
            className="!text-base sm:!text-lg lg:!text-xl max-md:[&>span:last-child]:hidden"
          />
        </Link>

        <div className="flex min-w-0 justify-center px-0.5 sm:px-2">
          <HeaderSearchBar
            compact
            variant="light"
            className="w-full min-w-0 max-w-[20rem] lg:max-w-[24rem]"
            onSubmitted={closeMenu}
          />
        </div>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-1 sm:gap-1.5 lg:gap-2">
          <ProductTabs activeTab={activeTab} onSelect={onSelectTab} className="hidden lg:flex" />
          <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
            {loggedIn ? (
              <>
                <AccountButton href="/account" label="Account" />
                <button type="button" onClick={logout} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Logout
                </button>
              </>
            ) : onLoginPage ? null : (
              <AccountButton href="/login" label="Login" />
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            {onLoginPage ? null : <AccountButton href={loggedIn ? "/account" : "/login"} label={loggedIn ? "Account" : "Login"} />}
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
    </div>
  );
}

/** Same logo + product tabs + search + login on every page. */
export default function MmtHeader({ hideOnMobile = false, hidden = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hero = useHeroSearch();
  const queryTab = resolveProductTab(searchParams.get("tab"));
  const activeHeroTab = hero?.activeTab || queryTab;
  const activeTab = productTabFromPath(pathname, activeHeroTab);
  const onLoginPage = pathname === "/login" || pathname.startsWith("/login/");

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

  const onSelectTab = (id) => {
    if (pathname === "/") {
      hero?.setActiveTab?.(id);
      return;
    }
    router.push(productTabHref(id));
  };

  if (hidden) return null;

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[100] bg-white/92 text-slate-900 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-md ${
          hideOnMobile ? "max-lg:hidden" : ""
        }`}
      >
        <SiteHeader
          loggedIn={loggedIn}
          logout={logout}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          pathname={pathname}
          activeTab={activeTab}
          onSelectTab={onSelectTab}
        />
      </header>

      <MobileSideNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
        activeHeroTab={activeTab}
        onSelectTab={onSelectTab}
        loggedIn={loggedIn}
        onLogout={logout}
        onLoginPage={onLoginPage}
      />
    </>
  );
}
