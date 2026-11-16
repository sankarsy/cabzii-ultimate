"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CabziiLogo from "../brand/CabziiLogo";
import { BRAND, EARN_NAV } from "../../lib/brand";
import { clearSession, isLoggedIn } from "../../lib/auth";
import MobileSideNav from "../layout/MobileSideNav";
import HeaderSearchBar from "./HeaderSearchBar";
import { isSiteNavActive, SITE_NAV, siteNavHref } from "../../lib/siteNav";
import { useScrollHeader } from "../../lib/useScrollHeader";

export default function MmtHeader({ hideOnMobile = false, hidden = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { visible: headerVisible } = useScrollHeader(!menuOpen);
  const onLoginPage = pathname === "/login" || pathname.startsWith("/login/");
  const earnActive = pathname === EARN_NAV.href || pathname.startsWith(`${EARN_NAV.href}/`);

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

  if (hidden) return null;

  return (
    <>
      <header
        className={`cabzii-site-header fixed left-0 right-0 top-0 z-[100] bg-[var(--cabzii-brand)] text-white shadow-[0_1px_0_rgba(255,255,255,0.18)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          hideOnMobile ? "max-lg:hidden" : ""
        } ${headerVisible ? "translate-y-0" : "max-lg:-translate-y-full max-lg:pointer-events-none"}`}
      >
        <div className="pt-[env(safe-area-inset-top,0px)]">
          <div className="section-shell flex items-center justify-between gap-3 py-2.5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)_minmax(0,1fr)] lg:gap-4 lg:py-3">
            <div className="min-w-0 shrink-0">
              <Link href="/" className="block min-w-0" aria-label={`${BRAND.fullName} home`}>
                <CabziiLogo showDomain showTagline={false} onDark className="!text-[1.5rem] lg:!text-[1.625rem]" />
              </Link>
            </div>

            <div className="hidden min-w-0 lg:block lg:-translate-x-10">
              <HeaderSearchBar compact variant="dark" className="w-full" />
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 lg:gap-5">
              <nav className="flex items-center gap-2 whitespace-nowrap lg:gap-4 xl:gap-5" aria-label="Cabzii">
                <div className="hidden items-center gap-4 lg:flex xl:gap-5">
                  {SITE_NAV.map((item) => {
                    const href = siteNavHref(item);
                    const active = isSiteNavActive(item, pathname);
                    return (
                      <Link
                        key={item.id}
                        href={href}
                        className={`text-[15px] font-semibold no-underline transition ${
                          active ? "text-white" : "text-[#d6e0ff] hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href={EARN_NAV.href}
                  aria-current={earnActive ? "page" : undefined}
                  className={`text-[13px] font-semibold no-underline transition lg:text-[15px] ${
                    earnActive ? "text-white" : "text-[#d6e0ff] hover:text-white"
                  }`}
                >
                  {EARN_NAV.label}
                </Link>
              </nav>
              {loggedIn ? (
                <Link
                  href="/account"
                  className="cabzii-tap hidden h-10 items-center rounded-full bg-white px-4 text-[14px] font-bold text-[var(--cabzii-brand)] hover:bg-[var(--cabzii-sky)] lg:inline-flex"
                >
                  Account
                </Link>
              ) : onLoginPage ? null : (
                <Link
                  href="/login"
                  className="cabzii-tap hidden h-10 items-center rounded-full bg-white px-5 text-[14px] font-bold text-[var(--cabzii-brand)] hover:bg-[var(--cabzii-sky)] lg:inline-flex"
                >
                  Login
                </Link>
              )}

              <button
                type="button"
                className="cabzii-tap relative z-[120] inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/15 lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="mmt-mobile-nav"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setMenuOpen((open) => !open);
                }}
              >
                <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
                {menuOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 6l12 12M18 6L6 18" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileSideNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
        loggedIn={loggedIn}
        onLogout={logout}
        onLoginPage={onLoginPage}
      />
    </>
  );
}
