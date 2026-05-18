"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BookingForm from "../../components/BookingForm";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function Booking({ searchParams }) {
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
    const base = itemType === "tour" ? `/api/packages/${encodeURIComponent(itemId)}` : `/api/cabs/${encodeURIComponent(itemId)}`;
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
      <main className="bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-slate-600">
          Redirecting to {itemType === "driver" ? "driver" : "cab"} details?
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <BookingForm selectedItem={selectedItem} itemType={itemType} proceedHref={proceedHref} />
      <Footer />
    </main>
  );
}
