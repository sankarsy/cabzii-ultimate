"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminCatalogPanel from "../../components/admin/AdminCatalogPanel";
import AdminCustomers from "../../components/admin/AdminCustomers";
import AdminMasterData from "../../components/admin/AdminMasterData";
import AdminReports from "../../components/admin/AdminReports";
import AdminSiteSettings from "../../components/admin/AdminSiteSettings";
import { CATALOG_TAB_KEYS, CATALOG_TABS } from "../../lib/adminCatalogConfig";
import { clearSession, getToken } from "../../lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [initialEditId, setInitialEditId] = useState("");
  const [initialViewId, setInitialViewId] = useState("");
  const [panelMode, setPanelMode] = useState("list");
  const [activeTab, setActiveTab] = useState("master");
  const [masterSection, setMasterSection] = useState("vendors");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const localToken = getToken() || "";
    if (localToken) setToken(localToken);
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const edit = params.get("edit");
    const view = params.get("view");
    const mode = params.get("mode");
    const section = params.get("section");
    if (
      tab &&
      (tab === "master" ||
        tab === "settings" ||
        tab === "customers" ||
        tab === "reports" ||
        CATALOG_TAB_KEYS.includes(tab))
    ) {
      setActiveTab(tab);
    }
    if (section && ["vendors", "cities", "locations"].includes(section)) {
      setMasterSection(section);
      setActiveTab("master");
    }
    if (edit) setInitialEditId(edit);
    if (view) setInitialViewId(view);
    if (mode && ["list", "create", "edit", "view"].includes(mode)) {
      setPanelMode(mode);
    }
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

  const sidebarItems = [
    { key: "reports", label: "Reports & analytics", superAdminOnly: true },
    { key: "customers", label: "Customers", superAdminOnly: true },
    { key: "master", label: "Vendors & locations" },
    { key: "settings", label: "Site settings", superAdminOnly: true },
    ...CATALOG_TAB_KEYS.map((tab) => ({ key: tab, label: CATALOG_TABS[tab].label })),
    { key: "vendors", label: "vendors", tab: "master", section: "vendors" },
    { key: "cities", label: "cities", tab: "master", section: "cities" },
    { key: "locations", label: "locations", tab: "master", section: "locations" }
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      {token ? (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="flex min-h-[64px] flex-wrap items-center justify-between gap-3 py-2 text-sm text-slate-700">
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
          </div>
        </header>
      ) : null}

      <section className={`py-10 md:py-14 ${token ? "pt-6 md:pt-8" : ""}`}>
        <div className="w-full px-4 md:px-6 lg:px-8">

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
              <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="sticky top-24 h-fit self-start rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <nav className="space-y-1">
                    {sidebarItems
                      .filter((item) => !item.superAdminOnly || isSuperAdmin)
                      .map((item) => {
                        const tab = item.tab || item.key;
                        const section = item.section || "";
                        const isActive =
                          activeTab === tab &&
                          (!section || (tab === "master" && masterSection === section));
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                              setActiveTab(tab);
                              if (tab === "master") setMasterSection(section || "vendors");
                              setPanelMode("list");
                              setInitialEditId("");
                              setInitialViewId("");
                            }}
                            className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                              isActive
                                ? "bg-sky-600 text-white"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                  </nav>
                </aside>

                <div>
                  {activeTab === "reports" ? (
                    <AdminReports token={token} isSuperAdmin={isSuperAdmin} />
                  ) : activeTab === "customers" ? (
                    <AdminCustomers token={token} isSuperAdmin={isSuperAdmin} />
                  ) : activeTab === "master" ? (
                    <AdminMasterData
                      token={token}
                      isSuperAdmin={isSuperAdmin}
                      initialSection={masterSection}
                    />
                  ) : activeTab === "settings" ? (
                    <AdminSiteSettings token={token} isSuperAdmin={isSuperAdmin} />
                  ) : CATALOG_TAB_KEYS.includes(activeTab) ? (
                    <AdminCatalogPanel
                      tabKey={activeTab}
                      token={token}
                      isSuperAdmin={isSuperAdmin}
                      initialEditId={initialEditId}
                      viewId={initialViewId}
                      pageMode={panelMode}
                    />
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}
