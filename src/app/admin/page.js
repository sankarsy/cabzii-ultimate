"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import AdminCatalogPanel from "../../components/admin/AdminCatalogPanel";
import AdminMasterData from "../../components/admin/AdminMasterData";
import AdminSiteSettings from "../../components/admin/AdminSiteSettings";
import { CATALOG_TAB_KEYS, CATALOG_TABS } from "../../lib/adminCatalogConfig";
import { clearSession, getToken } from "../../lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("master");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const localToken = getToken() || "";
    if (localToken) setToken(localToken);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    const loadMe = async () => {
      if (!token) return;
      const res = await fetch("/api/auth/me", {
        headers: authHeaders
      });
      const data = await res.json();
      if (res.ok && data?.data) {
        const role = data.data.role;
        if (role !== "super_admin" && role !== "vendor_admin") {
          setToken("");
          setUser(null);
          clearSession();
          return;
        }
        setUser(data.data);
      } else {
        setToken("");
        setUser(null);
        clearSession();
      }
    };
    loadMe();
  }, [token]);

  const isSuperAdmin = user?.role === "super_admin";

  const logout = async () => {
    clearSession();
    await fetch("/api/auth/session", { method: "DELETE" });
    setToken("");
    setUser(null);
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage cabs, drivers, packages, bookings, blogs, testimonials, and site content. Use <strong>Admin login</strong> for full access.
          </p>

          {authChecked && !token ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-md">
              <h2 className="text-lg font-bold text-slate-900">Sign in required</h2>
              <p className="mt-2 text-sm text-slate-600">
                Choose Travel Partner or Admin login on the sign-in page to access this panel.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/login?role=partner"
                  className="rounded-lg bg-[#0056D2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
                >
                  Travel Partner Login
                </Link>
                <Link
                  href="/login?role=admin"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          ) : token ? (
            <>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <p>
                  Logged in as <span className="font-semibold">{user?.mobileNumber || user?.phone}</span> ({user?.role})
                  {user?.vendorName ? ` - ${user.vendorName}` : ""}
                </p>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("master")}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    activeTab === "master" ? "bg-sky-600 text-white" : "border border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  Vendors & locations
                </button>
                {isSuperAdmin ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab("settings")}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                      activeTab === "settings" ? "bg-sky-600 text-white" : "border border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    Site settings
                  </button>
                ) : null}
                {CATALOG_TAB_KEYS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                      activeTab === tab ? "bg-sky-600 text-white" : "border border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    {CATALOG_TABS[tab].label}
                    {CATALOG_TABS[tab].superAdminOnly && !isSuperAdmin ? " (view)" : ""}
                  </button>
                ))}
              </div>

              {activeTab === "master" ? (
                <div className="mt-6">
                  <AdminMasterData token={token} isSuperAdmin={isSuperAdmin} />
                </div>
              ) : activeTab === "settings" ? (
                <div className="mt-6">
                  <AdminSiteSettings token={token} isSuperAdmin={isSuperAdmin} />
                </div>
              ) : CATALOG_TAB_KEYS.includes(activeTab) ? (
                <div className="mt-6">
                  <AdminCatalogPanel tabKey={activeTab} token={token} isSuperAdmin={isSuperAdmin} />
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
      <Footer />
    </main>
  );
}
