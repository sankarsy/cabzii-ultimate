"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MmtLayout from "../../components/mmt/MmtLayout";
import { BRAND } from "../../lib/brand";
import { authHeaders, buildLoginHref, getToken, getUser, isLoggedIn, setSession } from "../../lib/auth";

function formatRole(role) {
  if (role === "super_admin") return "Super Admin";
  if (role === "vendor_admin") return "Travel Partner";
  return "Customer";
}

function AccountCard({ href, title, description, cta = "Open →" }) {
  const inner = (
    <>
      <p className="font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <p className="mt-3 text-sm font-semibold text-[var(--cabzii-brand)]">{cta}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="cabzii-tap rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
      <p className="font-bold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [adminHref, setAdminHref] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace(buildLoginHref("/account", "customer"));
      return;
    }

    const load = async () => {
      const local = getUser();
      try {
        const res = await fetch("/api/auth/me", { headers: authHeaders(), cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.data) {
          setUser(data.data);
          if (getToken() && data.data.mobileNumber) {
            setSession(getToken(), data.data);
          }
          const role = data.data.role;
          if (role === "super_admin") {
            setAdminHref("/admin");
          } else if (role === "vendor_admin") {
            setAdminHref("/admin?tab=cabs");
          } else {
            setAdminHref("");
          }
        } else {
          setUser(local);
        }
      } catch {
        setUser(local);
      }
    };

    load();
  }, [router]);

  const isAdmin = user?.role === "super_admin" || user?.role === "vendor_admin";

  if (!user) {
    return (
      <MmtLayout>
        <div className="py-16 text-center text-slate-500">Loading account…</div>
      </MmtLayout>
    );
  }

  return (
    <MmtLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Account</p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">My account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your bookings and profile on {BRAND.domain}.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">Profile</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile</dt>
              <dd className="mt-1 text-base font-bold text-slate-900">{user.mobileNumber || "—"}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account type</dt>
              <dd className="mt-1 text-base font-bold capitalize text-slate-900">{formatRole(user.role)}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AccountCard
            href="/my-bookings"
            title="My trips"
            description="View upcoming and past cab, driver and holiday bookings."
          />
          <AccountCard
            href="/cabs"
            title="Book a cab"
            description="Search airport, outstation and hourly cabs across South India."
            cta="Search cabs →"
          />
          {isAdmin && adminHref ? (
            <AccountCard
              href={adminHref}
              title="Admin dashboard"
              description={
                user.role === "super_admin"
                  ? "Manage bookings, SEO pages, vendors and site settings."
                  : "Manage your cabs, drivers and packages."
              }
              cta="Open admin →"
            />
          ) : (
            <AccountCard title="Cabzii wallet" description={`₹0 · coming soon on ${BRAND.domain}`} />
          )}
          {user.role === "super_admin" ? (
            <AccountCard
              href="/admin?tab=master&section=vendors&createVendor=1"
              title="Create vendor admin"
              description="Add a travel partner with mobile login and password for their admin panel."
              cta="Create vendor admin →"
            />
          ) : null}
        </section>

        {user.role === "super_admin" ? (
          <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-bold text-slate-900">Admin panel paths</p>
            <ul className="mt-2 space-y-1 text-xs sm:text-sm">
              <li>
                <Link href="/admin" className="font-semibold text-[var(--cabzii-brand)] hover:underline">/admin</Link>
                {" "}— main dashboard
              </li>
              <li>
                <Link href="/login?role=admin&next=/admin" className="font-semibold text-[var(--cabzii-brand)] hover:underline">/login?role=admin&next=/admin</Link>
                {" "}— super admin login
              </li>
              <li>
                <Link href="/login?role=partner&next=/admin" className="font-semibold text-[var(--cabzii-brand)] hover:underline">/login?role=partner&next=/admin</Link>
                {" "}— vendor / travel partner login
              </li>
              <li>
                <Link href="/admin?tab=seoPagesHub" className="font-semibold text-[var(--cabzii-brand)] hover:underline">/admin?tab=seoPagesHub</Link>
                {" "}— SEO hub (all pages)
              </li>
              <li>
                <Link href="/admin?tab=master&section=vendors&createVendor=1" className="font-semibold text-[var(--cabzii-brand)] hover:underline">/admin?tab=master&section=vendors&createVendor=1</Link>
                {" "}— create vendor admin
              </li>
            </ul>
          </section>
        ) : null}

        {isAdmin && !adminHref ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Admin access requires password login.{" "}
            <Link href="/login?role=admin&next=/admin" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
              Sign in as admin →
            </Link>
          </p>
        ) : null}
      </div>
    </MmtLayout>
  );
}
