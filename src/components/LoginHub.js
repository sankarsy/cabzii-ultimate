"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OtpLogin from "./OtpLogin";
import { normalizeMobileInput, sanitizeMobileInput, setSession } from "../lib/auth";
import { BriefcaseIcon, ChevronRightIcon, ShieldIcon, UserIcon } from "./icons";

const ROLES = [
  {
    id: "customer",
    title: "Customer",
    description: "Book cabs, tours & drivers. Login with mobile OTP.",
    icon: UserIcon
  },
  {
    id: "partner",
    title: "Travel Partner",
    description: "Manage cabs, drivers & packages. Login with mobile & password.",
    icon: BriefcaseIcon
  },
  {
    id: "admin",
    title: "Admin",
    description: "Cabzii super admin. Login with mobile number & password.",
    icon: ShieldIcon
  }
];

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
  const initialRole = searchParams.get("role");
  const validInitial = ROLES.some((r) => r.id === initialRole) ? initialRole : null;

  const [selectedRole, setSelectedRole] = useState(validInitial);

  useEffect(() => {
    if (initialRole === "driver") router.replace("/driver/login");
  }, [initialRole, router]);

  if (initialRole === "driver") {
    return <div className="mx-auto max-w-md text-center text-sm text-slate-600">Opening driver login…</div>;
  }

  if (selectedRole === "customer") {
    return <OtpLogin nextUrl={nextUrl} onBack={() => setSelectedRole(null)} />;
  }

  if (selectedRole === "partner") {
    return <PasswordLoginForm mode="partner" onBack={() => setSelectedRole(null)} />;
  }

  if (selectedRole === "admin") {
    return <PasswordLoginForm mode="admin" onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-md">
        <div className="mb-3 text-center">
          <h1 className="text-base font-bold text-slate-900">Welcome to Cabzii</h1>
          <p className="mt-0.5 text-xs text-slate-600">Choose how you want to sign in</p>
        </div>
        <div className="grid gap-2">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 px-2.5 py-2 text-left transition hover:border-[#0056D2]/50 hover:bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-400">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold leading-tight text-slate-900">{role.title}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-slate-600">{role.description}</span>
                </span>
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PasswordLoginForm({ mode, onBack }) {
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
        throw new Error("This account is not a super admin. Use Travel Partner login.");
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

  const title = isAdmin ? "Admin Login" : "Travel Partner Login";
  const subtitle = isAdmin
    ? "Cabzii super admin access"
    : "Vendor / partner dashboard access";
  const btnClass = isAdmin ? "bg-slate-800 hover:bg-slate-700" : "bg-[#0056D2] hover:bg-[#0047b3]";

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-md">
        <button type="button" onClick={onBack} className="mb-3 text-xs font-medium text-[#0056D2] hover:underline">
          ← Back to login options
        </button>
        <div className="mb-4 text-center">
          <span
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
              isAdmin ? "bg-violet-50 text-violet-400" : "bg-sky-50 text-sky-400"
            }`}
          >
            {isAdmin ? <ShieldIcon className="h-4 w-4" /> : <BriefcaseIcon className="h-4 w-4" />}
          </span>
          <h1 className="mt-2 text-base font-bold text-slate-900">{title}</h1>
          <p className="mt-0.5 text-xs text-slate-600">{subtitle}</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Mobile number</label>
            <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-[#0056D2] focus-within:ring-2 focus-within:ring-blue-100">
              <span className="flex items-center bg-slate-50 px-2.5 text-xs font-medium text-slate-600">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(sanitizeMobileInput(e.target.value))}
                placeholder="10-digit number"
                disabled={loading}
                className="h-10 flex-1 px-3 text-sm text-slate-900 outline-none disabled:opacity-60"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Your password"
              disabled={loading}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            />
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={submit}
            className={`h-10 w-full rounded-lg text-sm font-bold text-white transition disabled:opacity-60 ${btnClass}`}
          >
            {loading ? "Signing in…" : isAdmin ? "Sign in to Admin" : "Sign in as Partner"}
          </button>
        </div>
        {error ? <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800">{error}</p> : null}
      </div>
    </div>
  );
}
