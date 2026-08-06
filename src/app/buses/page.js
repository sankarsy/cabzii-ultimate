"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MmtLayout from "../../components/mmt/MmtLayout";
import EmtBusSearchForm from "../../components/emt/EmtBusSearchForm";
import { HERO_TAB_ICONS } from "../../components/icons/heroIcons";
import Link from "next/link";

const BusIcon = HERO_TAB_ICONS.buses;

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
    <div className="section-shell cabzii-seo-landing">
      <div className="mb-3 text-center sm:mb-4">
        <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 sm:h-10 sm:w-10">
          <BusIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
        </div>
        <h1 className="text-base font-bold text-slate-900 sm:text-lg md:text-xl">Book bus tickets online</h1>
        <p className="mx-auto mt-1 max-w-xl text-[11px] text-slate-600 sm:text-xs">
          Compare AC seater & sleeper buses across South India. Choose boarding point, seat or berth, and pay securely on Cabzii.
        </p>
      </div>

      <EmtBusSearchForm emtHero />

      <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
        {[
          { title: "Live seat map", desc: "Pick seater, lower or upper berth like top OTAs" },
          { title: "Boarding & drop", desc: "Select your nearest boarding and dropping points" },
          { title: "Instant confirm", desc: "SMS & email ticket after booking" }
        ].map((f) => (
          <div key={f.title} className="cabzii-card p-2.5 text-center sm:p-3">
            <p className="text-xs font-bold text-slate-900 sm:text-sm">{f.title}</p>
            <p className="mt-0.5 text-[11px] text-slate-600">{f.desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Popular:{" "}
        <Link href="/buses/results?from=Chennai&to=Bengaluru" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
          Chennai → Bengaluru
        </Link>
        {" · "}
        <Link href="/buses/results?from=Chennai&to=Madurai" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
          Chennai → Madurai
        </Link>
      </p>
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
