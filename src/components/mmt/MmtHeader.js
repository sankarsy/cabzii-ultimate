"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND, NAV_LINKS } from "../../lib/brand";
import { clearSession, isLoggedIn } from "../../lib/auth";
import { useScrollHeader } from "../../lib/useScrollHeader";
import HeaderSearchBar from "./HeaderSearchBar";

export default function MmtHeader({ transparent = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { visible: headerVisible, forceVisible } = useScrollHeader(true);

  useEffect(() => {
    const sync = () => {
      setLoggedIn(isLoggedIn());
    };
    sync();
    window.addEventListener("cabzii-auth", sync);
    return () => window.removeEventListener("cabzii-auth", sync);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!transparent) {
      setScrolled(false);
      return undefined;
    }
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent, pathname]);

  useEffect(() => {
    if (menuOpen) forceVisible();
  }, [menuOpen, forceVisible]);

  useEffect(() => {
    const root = document.documentElement;
    if (menuOpen) {
      root.classList.add("menu-scroll-lock");
    } else {
      root.classList.remove("menu-scroll-lock");
    }
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

  const solidHeader = !transparent || scrolled;
  const headerClass = solidHeader
    ? "border-b border-white/10 bg-cabzii-header shadow-md"
    : "border-b border-white/10 bg-cabzii-header/80 backdrop-blur-md";

  const showHeader = headerVisible || menuOpen;

  const linkClass = (href, block = false) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return `${block ? "block rounded-lg px-3 py-2" : "rounded-full px-3 py-2"} text-sm font-medium transition ${
      active
        ? "bg-white/20 text-white"
        : "text-white/90 hover:bg-white/10 hover:text-white"
    }`;
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[100] text-white transition-transform duration-300 ease-out will-change-transform ${headerClass} ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-3 sm:h-[4.25rem] sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="min-w-0 shrink py-0.5"
          aria-label={`${BRAND.fullName} home`}
        >
          <CabziiLogo onDark showDomain className="!text-xl sm:!text-2xl lg:!text-[1.75rem]" />
        </Link>

        <nav className="hidden shrink-0 items-center gap-0.5 lg:flex" aria-label="Main">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-0 flex-1 md:block md:max-w-md lg:max-w-xl">
          <HeaderSearchBar onSubmitted={() => setMenuOpen(false)} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 text-white hover:bg-white/10 lg:hidden"
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
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white lg:inline-block"
              >
                Account
              </Link>
              <Link
                href="/my-bookings"
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white lg:inline-block"
              >
                My Trips
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-full border border-white/25 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 lg:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 lg:inline-flex"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {menuOpen ? (
        <nav id="mmt-mobile-nav" className="border-t border-white/10 bg-cabzii-header px-4 py-4 shadow-lg lg:hidden" aria-label="Mobile">
          <div className="mb-3 md:hidden">
            <HeaderSearchBar compact onSubmitted={() => setMenuOpen(false)} />
          </div>
          <div className="flex flex-col gap-0.5 sm:grid sm:grid-cols-2 sm:gap-1 lg:grid-cols-3">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href, true)} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/search" className={linkClass("/search", true)} onClick={() => setMenuOpen(false)}>
              Search
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
            {loggedIn ? (
              <>
                <Link href="/account" className={linkClass("/account")} onClick={() => setMenuOpen(false)}>
                  Account
                </Link>
                <Link href="/my-bookings" className={linkClass("/my-bookings")} onClick={() => setMenuOpen(false)}>
                  My Trips
                </Link>
                <button type="button" onClick={logout} className={linkClass("/account")}>
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={linkClass("/login", true)}
                onClick={() => setMenuOpen(false)}
              >
                Login / Sign up
              </Link>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
