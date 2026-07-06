"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND } from "../../lib/brand";
import { clearSession, isLoggedIn } from "../../lib/auth";
import { HERO_TABS } from "../../lib/emt/constants";
import { useScrollHeader } from "../../lib/useScrollHeader";
import HeaderSearchBar from "./HeaderSearchBar";
import HeaderConversionActions from "../layout/HeaderConversionActions";

const EXPLORE_LINKS = [
  { href: "/cabs", label: "Cabs" },
  { href: "/drivers", label: "Drivers" },
  { href: "/outstation-cabs", label: "Outstation" },
  { href: "/airport-taxi", label: "Airport taxi" },
  { href: "/holidays", label: "Holidays" },
  { href: "/blogs", label: "Blog" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/track-booking", label: "Track booking" }
];

function SiteHeader({ loggedIn, logout, menuOpen, setMenuOpen, linkClass, pathname }) {
  const onLoginPage = pathname === "/login" || pathname.startsWith("/login/");
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="border-b border-slate-200/90 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-6 sm:py-2.5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-3">
          <Link href="/" className="min-w-0 shrink justify-self-start" aria-label={`${BRAND.fullName} home`}>
            <CabziiLogo
              showDomain
              showTagline
              className="!text-base sm:!text-lg lg:!text-xl max-md:[&>span:last-child]:hidden"
            />
          </Link>

          <div className="hidden min-w-0 justify-center px-2 lg:flex lg:px-4">
            <HeaderSearchBar variant="light" className="w-full max-w-xl" onSubmitted={closeMenu} />
          </div>

          <div className="hidden shrink-0 items-center justify-end gap-2 lg:flex sm:justify-self-end">
            <HeaderConversionActions onNavigate={closeMenu} />
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
              <Link href="/login" className="cabzii-tap rounded-lg bg-[var(--cabzii-brand)] px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-[var(--cabzii-brand-hover)] sm:px-4">
                Login
              </Link>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-end lg:hidden">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              aria-expanded={menuOpen}
              aria-controls="mmt-mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
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
          </div>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[105] bg-slate-900/40 lg:hidden"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <nav
            id="mmt-mobile-nav"
            className="fixed inset-x-0 bottom-0 z-[110] flex max-h-[min(92dvh,720px)] flex-col overflow-hidden rounded-t-2xl border-t border-slate-200 bg-white shadow-[0_-12px_40px_rgba(15,23,42,0.18)] lg:hidden"
            aria-label="Mobile menu"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-bold text-slate-900">Menu</p>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Search</p>
                  <HeaderSearchBar variant="light" className="w-full" onSubmitted={closeMenu} />
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Quick actions</p>
                  <HeaderConversionActions compact onNavigate={closeMenu} />
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Book</p>
                  <div className="grid grid-cols-2 gap-2">
                    {HERO_TABS.map((tab) => (
                      <Link
                        key={tab.id}
                        href={`/?tab=${tab.id}`}
                        className={linkClass(`/?tab=${tab.id}`, true)}
                        onClick={closeMenu}
                      >
                        {tab.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Explore</p>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPLORE_LINKS.map((link) => (
                      <Link key={link.href} href={link.href} className={linkClass(link.href, true)} onClick={closeMenu}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-4">
              {loggedIn ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/account" className={linkClass("/account", true)} onClick={closeMenu}>
                    Account
                  </Link>
                  <Link href="/my-bookings" className={linkClass("/my-bookings", true)} onClick={closeMenu}>
                    My Trips
                  </Link>
                  <button type="button" onClick={logout} className={`${linkClass("/account", true)} col-span-2`}>
                    Logout
                  </button>
                </div>
              ) : onLoginPage ? null : (
                <Link
                  href="/login"
                  className="cabzii-tap inline-flex w-full justify-center rounded-xl bg-[var(--cabzii-brand)] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[var(--cabzii-brand-hover)]"
                  onClick={closeMenu}
                >
                  Login or Signup
                </Link>
              )}
            </div>
          </nav>
        </>
      ) : null}
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

  const linkClass = (href, block = false) => {
    let active = pathname === href || (href.startsWith("/") && !href.includes("?") && pathname.startsWith(`${href}/`));
    if (href.startsWith("/?tab=")) {
      const tab = href.replace("/?tab=", "");
      active = pathname === "/" && activeHeroTab === tab;
    }
    const base = block ? "block rounded-lg px-3 py-2.5 text-center" : "rounded-full px-3 py-2";
    return `${base} text-sm font-medium transition ${
      active ? "bg-blue-50 text-[var(--cabzii-brand)]" : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-[var(--cabzii-brand)]"
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
