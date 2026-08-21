"use client";

import Link from "next/link";
import { Ban } from "lucide-react";
import MmtLayout from "../mmt/MmtLayout";

const ALTERNATIVES = [
  { href: "/cabs", label: "Book a cab" },
  { href: "/buses", label: "Book a bus" },
  { href: "/call-driver", label: "Call Driver" },
  { href: "/holidays", label: "Holiday packages" }
];

export default function InactiveServicePage({
  title = "This service is paused",
  blurb = "This booking service is inactive on Cabzii for now."
}) {
  return (
    <MmtLayout>
      <div className="section-shell py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Ban className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">{blurb}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {ALTERNATIVES.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="rounded-full bg-[var(--cabzii-brand)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--cabzii-brand-hover)]"
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </MmtLayout>
  );
}
