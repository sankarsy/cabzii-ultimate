"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BookingForm from "../../components/BookingForm";
import EmtBookingFlow from "../../components/emt/EmtBookingFlow";

function CabTourBooking({ searchParams }) {
  const router = useRouter();
  const itemType = searchParams?.type ?? "cab";
  const itemId = String(searchParams?.id ?? searchParams?.cabId ?? "");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (itemType === "cab" && itemId && !searchParams?.step) {
      router.replace(`/cabs/${encodeURIComponent(itemId)}`);
    }
    if (itemType === "driver" && itemId && !searchParams?.step) {
      router.replace(`/drivers/${encodeURIComponent(itemId)}`);
    }
  }, [itemType, itemId, router, searchParams?.step]);

  useEffect(() => {
    if (!itemId || itemType === "cab" || itemType === "driver") return;
    const base =
      itemType === "tour" ? `/api/packages/${encodeURIComponent(itemId)}` : `/api/cabs/${encodeURIComponent(itemId)}`;
    const loadItem = async () => {
      try {
        const res = await fetch(base, { cache: "no-store" });
        const data = await res.json();
        setSelectedItem(data?.data ?? null);
      } catch {
        setSelectedItem(null);
      }
    };
    loadItem();
  }, [itemId, itemType]);

  const baseFare = useMemo(() => {
    if (!selectedItem) return 0;
    if (itemType === "tour") return Number(selectedItem.price) || 0;
    if (itemType === "driver") return Number(selectedItem.pricing?.day) || Number(selectedItem.pricing?.hourly) || 0;
    return Number(selectedItem.price) || 0;
  }, [itemType, selectedItem]);
  const total = baseFare;
  const itemPk = selectedItem ? String(selectedItem._id ?? selectedItem.id ?? "") : "";
  const proceedHref =
    selectedItem && itemPk
      ? `/payment?type=${encodeURIComponent(itemType)}&id=${encodeURIComponent(itemPk)}&total=${total}&baseFare=${baseFare}&taxes=0`
      : undefined;

  if ((itemType === "cab" || itemType === "driver") && itemId && !searchParams?.step) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-slate-600">
        Redirecting to {itemType === "driver" ? "driver" : "cab"} details…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <BookingForm selectedItem={selectedItem} itemType={itemType} proceedHref={proceedHref} />
    </div>
  );
}

function BookingRouter({ searchParams }) {
  const itemType = searchParams?.type ?? "cab";

  if (itemType === "flight" || itemType === "hotel") {
    return (
      <Suspense fallback={<div className="py-16 text-center">Loading…</div>}>
        <EmtBookingFlow />
      </Suspense>
    );
  }

  return <CabTourBooking searchParams={searchParams} />;
}

export default function Booking(props) {
  return <BookingRouter {...props} />;
}
