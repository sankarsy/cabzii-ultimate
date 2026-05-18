"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cabs", label: "Cabs" },
  { href: "/packages", label: "Tours" },
  { href: "/drivers", label: "Drivers" },
  { href: "/search?q=offers", label: "Offers" },
 
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    const query = searchTerm.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    if (href.startsWith("/search")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkClasses = (href) =>
    `whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
      isActive(href) ? "bg-blue-50 text-[#0056D2]" : "text-slate-700 hover:text-[#0056D2]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-3">
          <Link href="/" className="inline-flex shrink-0 items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#0056D2] text-white shadow-sm">
              <BrandIcon className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              cabzii<span className="text-[#0056D2]">.in</span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden items-center gap-2 md:flex lg:gap-3"
          >
            <div className="hidden items-center gap-1.5 xl:flex">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search cabs or tours..."
                className="w-40 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#0056D2] focus:bg-white lg:w-48"
                aria-label="Search cabs, drivers and tour packages"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Search
              </button>
            </div>

            <a
              href="tel:+919944197416"
              className="hidden items-center gap-1.5 whitespace-nowrap text-sm font-medium text-slate-700 hover:text-[#0056D2] lg:inline-flex"
            >
              <PhoneIcon className="h-4 w-4 text-[#0056D2]" />
              Call Us 24/7
            </a>

            <Link
              href="/signin"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0056D2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0047b3]"
            >
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          </motion.div>

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

        <div className="hidden border-t border-slate-100 pb-3 pt-2 md:block xl:hidden">
          <div className="flex items-center gap-2">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search cabs or tours..."
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#0056D2]"
            />
            <button type="button" onClick={handleSearch} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white">
              Search
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-100 py-3 md:hidden"
            >
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`block ${linkClasses(link.href)}`}>
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex gap-2">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search cabs or tours..."
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <button type="button" onClick={handleSearch} className="rounded-lg bg-[#0056D2] px-4 py-2 text-sm font-semibold text-white">
                  Go
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function BrandIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M5 12l1.4-4.1A2 2 0 0 1 8.3 6h7.4a2 2 0 0 1 1.9 1.4L19 12" />
      <path d="M3 12h18v5a1 1 0 0 1-1 1h-1M3 12v5a1 1 0 0 0 1 1h1" />
      <circle cx="7.5" cy="17" r="1.3" />
      <circle cx="16.5" cy="17" r="1.3" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function GlobeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChevronDown({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
