"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import MmtLayout from "../../../components/mmt/MmtLayout";
import { MOCK_HOTELS } from "../../../lib/mock-data/hotels";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function HotelDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const hotel = MOCK_HOTELS.find((h) => h.id === id);

  if (!hotel) {
    return (
      <MmtLayout>
        <div className="py-16 text-center">Hotel not found.</div>
      </MmtLayout>
    );
  }

  const bookHref = `/booking?type=hotel&id=${hotel.id}&${searchParams.toString()}`;

  return (
    <MmtLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="relative mb-6 h-64 overflow-hidden rounded-2xl">
          <Image src={hotel.images[0]} alt={hotel.name} fill className="object-cover" />
        </div>
        <h1 className="text-2xl font-bold">{hotel.name}</h1>
        <p className="text-slate-600">{hotel.location.address}</p>
        <p className="mt-4 text-3xl font-extrabold text-[var(--emt-primary)]">{formatINR(hotel.pricePerNight)} / night</p>
        <Link
          href={bookHref}
          className="mt-6 inline-block rounded-full bg-[var(--emt-primary)] px-8 py-3 font-bold text-white"
        >
          Book this hotel
        </Link>
        <Link href={`/hotels?${searchParams.toString()}`} className="ml-4 text-sm font-semibold text-[var(--emt-primary)]">
          ← Back to results
        </Link>
      </div>
    </MmtLayout>
  );
}
