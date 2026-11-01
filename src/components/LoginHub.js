"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import OtpLogin from "./OtpLogin";
import { buildLoginHref, normalizeMobileInput, sanitizeMobileInput, setSession } from "../lib/auth";
import { BriefcaseIcon, ShieldIcon } from "./icons";
import { inputBaseClass, typo } from "../lib/typography";

function parseJsonResponse(res) {
  return res.text().then((text) => {
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  });
}

export default function LoginHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const role = searchParams.get("role");

  useEffect(() => {
    if (role === "driver") router.replace("/driver/login");
  }, [role, router]);

  if (role === "driver") {
    return <div className="mx-auto max-w-md text-center text-sm text-slate-600">Opening driver login…</div>;
  }

  if (role === "partner") {
    return <PasswordLoginForm mode="partner" nextUrl={nextUrl} />;
  }

  if (role === "admin") {
    return <PasswordLoginForm mode="admin" nextUrl={nextUrl} />;
  }

  return (
    <OtpLogin
      nextUrl={nextUrl}
      showRoleLinks
      subtitle="Book cabs and drivers with your 6-digit mobile OTP."
    />
  );
}

function RoleLinks({ nextUrl, current }) {
  const items = [
    current !== "customer" ? { href: buildLoginHref(nextUrl), label: "Customer login" } : null,
    current !== "partner" ? { href: buildLoginHref(nextUrl, "partner"), label: "Vendor login" } : null,
    current !== "admin" ? { href: buildLoginHref(nextUrl, "admin"), label: "Admin login" } : null
  ].filter(Boolean);

  return (
    <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="text-[var(--cabzii-cta)] hover:underline">
          {item.label}
        </Link>
      ))}
    </p>
  );
}

function PasswordLoginForm({ mode, nextUrl }) {
  const isAdmin = mode === "admin";
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    const mobileNumber = normalizeMobileInput(mobile);
    if (!mobileNumber) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }
    setLoading(true);
    try {
      const endpoint = isAdmin ? "/api/auth/admin-login" : "/api/auth/partner-login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber, phone: mobileNumber, password })
      });
      const data = await parseJsonResponse(res);
      if (!res.ok || !data?.data?.token) {
        throw new Error(data?.message || "Login failed");
      }
      if (isAdmin && data.data.user?.role !== "super_admin") {
        throw new Error("This account is not a super admin. Use Vendor login.");
      }
      setSession(data.data.token, data.data.user);
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.data.token })
      });
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const title = isAdmin ? "Admin login" : "Vendor login";
  const subtitle = isAdmin ? "Cabzii super admin access" : "Travel partner dashboard access";

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="cabzii-card p-4 sm:p-5">
        <div className="mb-4 text-center">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-[var(--cabzii-cta)]">
            {isAdmin ? <ShieldIcon className="h-4 w-4" /> : <BriefcaseIcon className="h-4 w-4" />}
          </span>
          <h1 className="mt-2 text-base font-bold text-slate-900">{title}</h1>
          <p className="mt-0.5 text-xs text-slate-600">{subtitle}</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className={`mb-1 block ${typo.label}`}>Mobile number</label>
            <div className="flex overflow-hidden rounded-xl border border-slate-200/90 focus-within:border-[var(--cabzii-cta)] focus-within:ring-2 focus-within:ring-orange-100">
              <span className="flex items-center bg-slate-50 px-2.5 text-xs font-medium text-slate-600">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(sanitizeMobileInput(e.target.value))}
                placeholder="10-digit number"
                disabled={loading}
                className="h-10 flex-1 bg-transparent px-3 text-sm font-semibold text-slate-900 outline-none disabled:opacity-60"
              />
            </div>
          </div>
          <div>
            <label className={`mb-1 block ${typo.label}`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Your password"
              disabled={loading}
              className={`${inputBaseClass} focus:border-[var(--cabzii-cta)] focus:ring-orange-100`}
            />
          </div>
          <button type="button" disabled={loading} onClick={submit} className="cabzii-btn cabzii-btn-cta cabzii-tap h-11 w-full">
            {loading ? "Signing in…" : isAdmin ? "Sign in to Admin" : "Sign in as Vendor"}
          </button>
        </div>
        {error ? <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800">{error}</p> : null}
        <RoleLinks nextUrl={nextUrl} current={isAdmin ? "admin" : "partner"} />
      </div>
    </div>
  );
}
