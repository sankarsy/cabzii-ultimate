"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MmtLayout from "../../components/mmt/MmtLayout";
import { BRAND } from "../../lib/brand";
import { clearSession, getUser, isLoggedIn } from "../../lib/auth";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login?next=/account");
      return;
    }
    setUser(getUser());
  }, [router]);

  async function logout() {
    clearSession();
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
  }

  if (!user) {
    return (
      <MmtLayout>
        <div className="py-16 text-center text-slate-500">Loading account…</div>
      </MmtLayout>
    );
  }

  return (
    <MmtLayout>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">My account</h1>
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Profile</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Mobile</dt>
              <dd className="font-semibold">{user.mobileNumber || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Role</dt>
              <dd className="font-semibold capitalize">{user.role || "customer"}</dd>
            </div>
          </dl>
        </section>
        <section className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/account/bookings"
            className="rounded-xl border border-slate-200 bg-white p-5 font-semibold text-[var(--emt-primary)] shadow-sm hover:shadow-md"
          >
            My bookings →
          </Link>
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <p className="font-bold text-slate-800">Cabzii wallet</p>
            <p className="mt-1">₹0 · coming soon on {BRAND.domain}</p>
          </div>
        </section>
        <button
          type="button"
          onClick={logout}
          className="mt-8 rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700"
        >
          Logout
        </button>
      </div>
    </MmtLayout>
  );
}
