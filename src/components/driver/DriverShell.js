"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/driver", label: "Home" },
  { href: "/driver/trips", label: "Trips" }
];

export default function DriverShell({ driver, onLogout, children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-slate-50 pb-24 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-sky-700">Cabzii Driver</p>
            <p className="truncate text-base font-bold">{driver?.name || "Driver"}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-4">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          {NAV.map((item) => {
            const active = item.href === "/driver" ? pathname === "/driver" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-3 text-center text-base font-bold ${
                  active ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
