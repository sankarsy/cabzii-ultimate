"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND, EARN_NAV } from "../../lib/brand";
import { clearSession, isLoggedIn } from "../../lib/auth";
import HeaderSearchBar from "./HeaderSearchBar";
import MobileSideNav from "../layout/MobileSideNav";
import EmtCategoryTabs from "../emt/EmtCategoryTabs";
import { useHeroSearch } from "../emt/HeroSearchContext";
import { productTabFromPath, productTabHref, resolveProductTab } from "../../lib/emt/productNav";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { resolveScopedCity } from "../../lib/cityShowcase";
import { isLiveCallDriverCitySlug } from "../../lib/cityCabPaths";

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

function ProfileMenu({ logout }) {
  return (
    <details className="group relative">
      <summary
        aria-label="Account menu"
        className="cabzii-tap flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full bg-[#eef2f7] text-slate-700 transition hover:bg-[#e4e9f1] [&::-webkit-details-marker]:hidden"
      >
        <AccountGlyph />
      </summary>
      <div className="absolute right-0 z-50 mt-1 min-w-[11rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
        <Link href="/account" className="block px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-orange-50 hover:text-[var(--cabzii-cta)]">
          My account
        </Link>
        <Link href="/my-bookings" className="block px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-orange-50 hover:text-[var(--cabzii-cta)]">
          My trips
        </Link>
        <button
          type="button"
          onClick={logout}
          className="block w-full px-3 py-2 text-left text-[13px] font-medium text-rose-600 hover:bg-rose-50"
        >
          Logout
        </button>
      </div>
    </details>
  );
}

function EarnNavButton({ pathname }) {
  const active = pathname === EARN_NAV.href || pathname.startsWith(`${EARN_NAV.href}/`);
  return (
    <Link
      href={EARN_NAV.href}
      aria-current={active ? "page" : undefined}
      className={`cabzii-tap inline-flex h-9 shrink-0 items-center justify-center px-2 text-[12px] font-extrabold tracking-tight sm:h-10 sm:px-2.5 sm:text-[13px] ${
        active ? "text-[var(--cabzii-cta)]" : "text-orange-700 hover:text-[var(--cabzii-cta)]"
      }`}
    >
      {EARN_NAV.label}
    </Link>
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

        <div className="hidden min-w-0 justify-center px-2 lg:flex">
          <HeaderSearchBar
            compact
            variant="light"
            className="w-full min-w-0 max-w-[24rem]"
            onSubmitted={closeMenu}
          />
        </div>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-0.5 sm:gap-1 lg:gap-2">
          <nav className="hidden min-w-0 items-center gap-2 lg:flex" aria-label="Book Cabs, Hire a Driver or Buses">
            <EmtCategoryTabs activeTab={activeTab} setActiveTab={onSelectTab} variant="nav" />
            <EarnNavButton pathname={pathname} />
          </nav>
          <div className="hidden shrink-0 items-center lg:flex">
            {loggedIn ? (
              <ProfileMenu logout={logout} />
            ) : onLoginPage ? null : (
              <Link
                href="/login"
                aria-label="Login"
                className="cabzii-tap flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2f7] text-slate-600 transition hover:bg-[#e4e9f1]"
              >
                <AccountGlyph className="h-5 w-5" />
              </Link>
            )}
          </div>
          <div className="relative z-[120] flex shrink-0 items-center lg:hidden">
            <button
              type="button"
              className="cabzii-tap pointer-events-auto relative z-[120] inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[var(--cabzii-brand)] hover:bg-blue-50/70"
              aria-expanded={menuOpen}
              aria-controls="mmt-mobile-nav"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setMenuOpen((open) => !open);
              }}
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
  const { city: selectedCity } = useSelectedCity();
  const clientCity = resolveScopedCity(selectedCity);
  const driverCitySlug = isLiveCallDriverCitySlug(clientCity.slug) ? clientCity.slug : "chennai";
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
    if (id === "cabs" && (pathname === "/" || pathname === "")) {
      hero?.setActiveTab?.("cabs");
      return;
    }
    const href = productTabHref(id, driverCitySlug);
    if (pathname === href) return;
    if (id === "buses" && pathname.startsWith("/buses")) return;
    router.push(href);
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
