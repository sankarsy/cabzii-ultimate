"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clearSession, formatMobileDisplay, getUser, isLoggedIn } from "../lib/auth";
import { isTravelShellPath } from "../lib/travelShellPaths";
import { useSiteSettings } from "./SiteSettingsProvider";
import { CarIcon, ChevronDownIcon, UserIcon } from "./icons";

function BrandIcon(props) {
  return <CarIcon {...props} />;
}

const fallbackNavLinks = [
  { href: "/", label: "Home" },
  { href: "/cabs", label: "Cabs" },
  { href: "/buses", label: "Buses" },
  { href: "/call-driver", label: "Call Driver" },
  { href: "/holidays", label: "Holidays" }
];

export default function Navbar({ variant = "default" }) {
  const pathname = usePathname();
  const hideOnTravelShell = variant !== "mmt" && isTravelShellPath(pathname);
  const isMmt = variant === "mmt";
  const settings = useSiteSettings();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const sync = () => {
      setLoggedIn(isLoggedIn());
      setUser(getUser());
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("cabzii-auth", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cabzii-auth", sync);
    };
  }, [pathname]);

  useEffect(() => {
    const onDoc = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleSearch = () => {
    const query = searchTerm.trim();
    if (!query) return;
    const params = new URLSearchParams({ q: query });
    router.push(`/search?${params.toString()}`);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    clearSession();
    await fetch("/api/auth/session", { method: "DELETE" });
    setUserMenuOpen(false);
    setMenuOpen(false);
    setLoggedIn(false);
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/search")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkClasses = (href) =>
    isMmt
      ? `whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
          isActive(href) ? "bg-white/15 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"
        }`
      : `whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
          isActive(href) ? "bg-slate-100 text-[#0056D2]" : "text-slate-700 hover:text-[#0056D2]"
        }`;

  const cmsMenuLinks = (settings.seoMenuLinks || []).map((link, index) => ({
    label: link.label,
    href: link.href,
    visible: true,
    sortOrder: 100 + (link.sortOrder ?? index)
  }));

  const navLinks = [
    ...(settings.navbar?.length ? settings.navbar : fallbackNavLinks),
    ...cmsMenuLinks
  ]
    .filter((link) => link.visible !== false)
    .filter((link) => !["/hotels", "/flights", "/trains"].includes(String(link.href || "").split("?")[0]))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const brandName = settings.siteName || "cabzii.in";
  const brandColor = settings.brandColor || "#0056D2";
  const searchPlaceholder = settings.hero?.searchPlaceholder || "Search cabs, buses, drivers, holidays…";

  if (hideOnTravelShell) return null;

  return (
    <header
      className={
        isMmt
          ? "sticky top-0 z-50 border-b border-white/10 bg-mmt-header shadow-md"
          : "sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm"
      }
    >
      <div className="section-shell">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-[4.25rem]">
          <Link href="/" className="inline-flex shrink-0 items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm" style={{ backgroundColor: brandColor }}>
              <BrandIcon className="h-5 w-5" />
            </span>
            <span
              className={`text-lg font-bold tracking-tight ${isMmt ? "text-white" : "text-slate-900"}`}
            >
              {brandName}
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex lg:gap-3">
            <div className="hidden items-center gap-1.5 xl:flex">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={searchPlaceholder}
                className="w-40 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#0056D2] focus:bg-white lg:w-48"
                aria-label="Search"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Search
              </button>
            </div>

            {loggedIn && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-[#0056D2]/40"
                >
                  <UserIcon className="h-4 w-4 text-sky-400" />
                  <span className="hidden max-w-[100px] truncate sm:inline">
                    {formatMobileDisplay(user.mobileNumber)}
                  </span>
                  <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                    >
                      <Link
                        href="/my-bookings"
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      {["super_admin", "vendor_admin"].includes(user.role) ? (
                        <Link
                          href="/admin"
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--cabzii-cta)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(249,115,22,0.32)] transition hover:bg-[var(--cabzii-cta-hover)]"
              >
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>

          <button
            type="button"
            className="inline-flex rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-100 py-3 md:hidden"
            >
              <div className="mb-3 flex flex-col gap-2 px-2 sm:flex-row">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={searchPlaceholder}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#0056D2] focus:bg-white"
                  aria-label="Search"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
                >
                  Search
                </button>
              </div>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`block ${linkClasses(link.href)}`}>
                  {link.label}
                </Link>
              ))}
              {loggedIn && user ? (
                <div className="mt-3 space-y-1 border-t border-slate-100 pt-3">
                  <p className="px-2 text-xs text-slate-500">{formatMobileDisplay(user.mobileNumber)}</p>
                  <Link href="/my-bookings" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-sm font-medium text-slate-700">
                    My Bookings
                  </Link>
                  <button type="button" onClick={handleLogout} className="block w-full px-2 py-2 text-left text-sm font-medium text-rose-600">
                    Logout
                  </button>
                </div>
              ) : null}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
