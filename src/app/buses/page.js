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
    <div className="section-shell py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
          <BusIcon className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Book bus tickets online</h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-600">
          Compare AC seater & sleeper buses across South India. Choose boarding point, seat or berth, and pay securely on Cabzii.
        </p>
      </div>

      <EmtBusSearchForm emtHero />

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Live seat map", desc: "Pick seater, lower or upper berth like top OTAs" },
          { title: "Boarding & drop", desc: "Select your nearest boarding and dropping points" },
          { title: "Instant confirm", desc: "SMS & email ticket after booking" }
        ].map((f) => (
          <div key={f.title} className="cabzii-card p-4 text-center">
            <p className="font-bold text-slate-900">{f.title}</p>
            <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
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
