"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Bus, ShieldCheck, Armchair, Ticket } from "lucide-react";
import MmtLayout from "../../components/mmt/MmtLayout";
import EmtBusSearchForm from "../../components/emt/EmtBusSearchForm";
import { POPULAR_BUS_ROUTES, busResultsHref } from "../../lib/popularBusRoutes";

function BusesLandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  useEffect(() => {
    if (from || to) {
      router.replace(`/buses/results?${searchParams.toString()}`);
    }
  }, [from, to, router, searchParams]);

  return (
    <div className="rdb-hero-body">
      <div className="section-shell py-8 sm:py-10">
        <div className="mb-5 text-center text-white">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
            <Bus className="h-5 w-5" aria-hidden />
          </div>
          <h1 className="text-xl font-extrabold sm:text-2xl md:text-3xl">Book bus tickets online</h1>
          <p className="mx-auto mt-1.5 max-w-xl text-sm text-white/85">
            Search AC seater & sleeper buses from Chennai and across South India. Pick seats, boarding point and confirm instantly.
          </p>
        </div>

        <EmtBusSearchForm emtHero />
      </div>

      <div className="bg-[var(--cabzii-bg)] py-8">
        <div className="section-shell">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Armchair, title: "Live seat map", desc: "Choose seater, lower or upper berth before you pay" },
              { icon: Ticket, title: "Boarding & drop", desc: "Select the stop nearest to you — like RedBus" },
              { icon: ShieldCheck, title: "Instant confirm", desc: "SMS ticket after booking · 24×7 WhatsApp support" }
            ].map((f) => (
              <div key={f.title} className="rdb-card p-4">
                <f.icon className="mb-2 h-5 w-5 text-[#d84e55]" aria-hidden />
                <p className="text-sm font-bold text-slate-900">{f.title}</p>
                <p className="mt-0.5 text-xs text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm font-semibold text-slate-700">Popular bus routes from Chennai</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {POPULAR_BUS_ROUTES.filter((r) => r.from === "Chennai").map((r) => (
              <Link
                key={`${r.from}-${r.to}`}
                href={busResultsHref(r.from, r.to)}
                className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-50"
              >
                {r.from} → {r.to}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BusesPage() {
  return (
    <MmtLayout>
      <Suspense fallback={<div className="section-shell py-16 text-center text-slate-500">Loading…</div>}>
        <BusesLandingContent />
      </Suspense>
    </MmtLayout>
  );
}
