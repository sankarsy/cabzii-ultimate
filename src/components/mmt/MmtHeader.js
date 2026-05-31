"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND, NAV_LINKS } from "../../lib/brand";
import { clearSession, isLoggedIn } from "../../lib/auth";
import HeaderSearchBar from "./HeaderSearchBar";

export default function MmtHeader({ transparent = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
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

  const linkClass = (href, block = false) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return `${block ? "block rounded-lg px-3 py-2" : "rounded-full px-3 py-2"} text-sm font-medium transition ${
      active
        ? "bg-white/20 text-white"
        : "text-white/90 hover:bg-white/10 hover:text-white"
    }`;
  };

  return (
    <header className={`sticky top-0 z-[100] text-white ${headerClass}`}>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6">
        <Link
          href="/"
          className="shrink-0 rounded-lg bg-white px-3 py-1.5 shadow-sm sm:px-3.5 sm:py-2"
          aria-label={`${BRAND.fullName} home`}
        >
          <CabziiLogo showDomain className="!text-[1.625rem] sm:!text-3xl" />
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
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white sm:inline-block"
              >
                Account
              </Link>
              <Link
                href="/my-bookings"
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white md:inline-block"
              >
                My Trips
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/25 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--cabzii-brand)] shadow-sm hover:bg-slate-50"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {menuOpen ? (
        <nav id="mmt-mobile-nav" className="border-t border-white/10 bg-cabzii-header px-4 py-3 lg:hidden" aria-label="Mobile">
          <div className="mb-3 md:hidden">
            <HeaderSearchBar compact onSubmitted={() => setMenuOpen(false)} />
          </div>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
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
                className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[var(--cabzii-brand)]"
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
