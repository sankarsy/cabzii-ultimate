"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminOpsDashboard from "../../components/admin/AdminOpsDashboard";
import AdminCatalogPanel from "../../components/admin/AdminCatalogPanel";
import VehicleAdminPanel from "../../components/admin/vehicles/VehicleAdminPanel";
import AdminSeoPagesIndex from "../../components/admin/AdminSeoPagesIndex";
import AdminCrm from "../../components/admin/AdminCrm";
import AdminCustomers from "../../components/admin/AdminCustomers";
import AdminMasterData from "../../components/admin/AdminMasterData";
import AdminReports from "../../components/admin/AdminReports";
import AdminEnterprise from "../../components/admin/enterprise/AdminEnterprise";
import AdminShell from "../../components/admin/AdminShell";
import AdminCallDriverPage from "../../components/admin/AdminCallDriverPage";
import AdminCities from "../../components/admin/cms/AdminCities";
import AdminCmsDashboard from "../../components/admin/cms/AdminCmsDashboard";
import AdminCmsServicePages from "../../components/admin/cms/AdminCmsServicePages";
import AdminReviewsHub from "../../components/admin/cms/AdminReviewsHub";
import AdminSettingsHub from "../../components/admin/cms/AdminSettingsHub";
import AdminRolesPage from "../../components/admin/cms/AdminRolesPage";
import AdminRouteFares from "../../components/admin/AdminRouteFares";
import AdminDriverAccounts from "../../components/admin/AdminDriverAccounts";
import CabziiLogo from "../../components/brand/CabziiLogo";
import { BRAND } from "../../lib/brand";
import { CATALOG_TAB_KEYS } from "../../lib/adminCatalogConfig";
import { MASTER_SECTION_KEYS } from "../../lib/adminMasterConfig";
import { ADMIN_TAB_KEYS, VENDOR_ALLOWED_TABS, filterNavGroups, resolveNavTarget } from "../../lib/adminNav";
import { clearSession, getToken } from "../../lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initialEditId, setInitialEditId] = useState("");
  const [initialViewId, setInitialViewId] = useState("");
  const [prefillCity, setPrefillCity] = useState("");
  const [prefillType, setPrefillType] = useState("");
  const [prefillSlug, setPrefillSlug] = useState("");
  const [panelMode, setPanelMode] = useState("list");
  const [activeTab, setActiveTab] = useState("ops");
  const [enterpriseSection, setEnterpriseSection] = useState("faqs");
  const [masterSection, setMasterSection] = useState("vendors");
  const [settingsSection, setSettingsSection] = useState("general");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const localToken = getToken() || "";
    if (localToken) setToken(localToken);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const edit = searchParams.get("edit");
    const view = searchParams.get("view");
    const mode = searchParams.get("mode");
    const section = searchParams.get("section");
    if (tab === "drivers") {
      setActiveTab("actingDriversOps");
      router.replace("/admin?tab=actingDriversOps");
    } else if (tab === "seoCityPages") {
      setActiveTab("seoPagesHub");
      router.replace("/admin?tab=seoPagesHub");
    } else if (tab === "reviews" || tab === "testimonials") {
      setActiveTab("reviewsHub");
    } else if (tab && (ADMIN_TAB_KEYS.has(tab) || CATALOG_TAB_KEYS.includes(tab))) {
      setActiveTab(tab);
    }
    const entSection = searchParams.get("section");
    if (entSection && tab === "enterprise") setEnterpriseSection(entSection);
    if (tab === "settings" && section) setSettingsSection(section);
    const createVendor = searchParams.get("createVendor");
    if (tab === "master" && section === "cities") {
      setActiveTab("cities");
      router.replace("/admin?tab=cities");
    } else if (section && MASTER_SECTION_KEYS.includes(section) && tab !== "enterprise" && tab !== "settings") {
      setMasterSection(section);
      setActiveTab("master");
    }
    if (createVendor === "1") {
      setMasterSection("vendors");
      setActiveTab("master");
    }
    setInitialEditId(edit || "");
    setInitialViewId(view || "");
    setPrefillCity(searchParams.get("prefillCity") || "");
    setPrefillType(searchParams.get("prefillType") || "");
    setPrefillSlug(searchParams.get("prefillSlug") || "");
    if (mode && ["list", "create", "edit", "view"].includes(mode)) {
      setPanelMode(mode);
    } else if (!mode) {
      setPanelMode("list");
    }
  }, [searchParams, router]);

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
          router.replace("/login?role=admin&next=/admin");
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

  useEffect(() => {
    if (!user || user.role === "super_admin") return;
    if (!VENDOR_ALLOWED_TABS.has(activeTab)) {
      setActiveTab("ops");
      router.replace("/admin?tab=ops");
      return;
    }
    if (activeTab === "master") {
      setActiveTab("ops");
      router.replace("/admin?tab=ops");
    }
  }, [user, activeTab, masterSection, router]);

  const logout = async () => {
    clearSession();
    await fetch("/api/auth/session", { method: "DELETE" });
    setToken("");
    setUser(null);
    router.push("/login");
  };

  const sidebarGroups = filterNavGroups(isSuperAdmin);

  const adminSidebar = (
    <>
      {sidebarGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="mb-1.5 px-2 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{group.label}</p>
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const target = resolveNavTarget(item, !isSuperAdmin);
                const tab = target.tab;
                const section = target.section;
                const isActive =
                  activeTab === tab &&
                  (!section ||
                    (tab === "master" && masterSection === section) ||
                    (tab === "enterprise" && enterpriseSection === section) ||
                    (tab === "settings" && settingsSection === section));
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      if (tab === "master") setMasterSection(section || "vendors");
                      if (tab === "enterprise") setEnterpriseSection(section || "faqs");
                      if (tab === "settings") setSettingsSection(section || "general");
                      let qs = `?tab=${tab}`;
                      if (tab === "master") qs = `?tab=master&section=${section || "vendors"}`;
                      if (tab === "enterprise") qs = `?tab=enterprise&section=${section || "faqs"}`;
                      if (tab === "settings" && section) qs = `?tab=settings&section=${section}`;
                      router.push(`/admin${qs}`);
                      setNavOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium transition ${
                      isActive
                        ? "bg-sky-50 text-sky-800"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-90" /> : null}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
      ))}
    </>
  );

  const panel = (
    <>
      {authChecked && !token ? (
        <div className="mx-auto mt-6 max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--cabzii-shadow-card)]">
          <h2 className="text-lg font-bold text-slate-900">{BRAND.name} admin</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in as travel partner or super admin to manage {BRAND.domain}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/login?role=partner"
              className="rounded-lg bg-[var(--cabzii-brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--cabzii-brand-hover)]"
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
            {!isSuperAdmin && !VENDOR_ALLOWED_TABS.has(activeTab) ? (
              <AdminOpsDashboard token={token} isSuperAdmin={false} />
            ) : activeTab === "ops" ? (
              <AdminCmsDashboard token={token} isSuperAdmin={isSuperAdmin} />
            ) : activeTab === "cities" ? (
              <AdminCities token={token} />
            ) : activeTab === "seoServices" ? (
              <AdminCmsServicePages token={token} moduleKey="cab" />
            ) : activeTab === "cmsServices" ? (
              <AdminCmsServicePages token={token} moduleKey="service" />
            ) : activeTab === "airportTaxi" ? (
              <AdminCmsServicePages token={token} moduleKey="airport" />
            ) : activeTab === "actingDriverCms" ? (
              <AdminCmsServicePages token={token} moduleKey="actingDriver" />
            ) : activeTab === "reviewsHub" ? (
              <AdminReviewsHub token={token} isSuperAdmin={isSuperAdmin} />
            ) : activeTab === "actingDriversOps" ? (
              <AdminDriverAccounts token={token} isSuperAdmin={isSuperAdmin} />
            ) : activeTab === "settingsRoles" ? (
              <AdminRolesPage />
            ) : activeTab === "assignments" ? (
              <AdminOpsDashboard token={token} isSuperAdmin={isSuperAdmin} variant="assignments" />
            ) : activeTab === "reports" ? (
              <AdminReports token={token} isSuperAdmin={isSuperAdmin} />
            ) : activeTab === "crm" ? (
              <AdminCrm token={token} isSuperAdmin={isSuperAdmin} />
            ) : activeTab === "customers" ? (
              <AdminCustomers token={token} isSuperAdmin={isSuperAdmin} />
            ) : activeTab === "master" ? (
              <AdminMasterData
                token={token}
                isSuperAdmin={isSuperAdmin}
                initialSection={masterSection}
                focusCreateVendor={searchParams.get("createVendor") === "1"}
                hideTabs
              />
            ) : activeTab === "enterprise" ? (
              <AdminEnterprise token={token} initialSection={enterpriseSection === "dashboard" ? "faqs" : enterpriseSection} hideChrome />
            ) : activeTab === "routeFares" ? (
              <AdminRouteFares token={token} />
            ) : activeTab === "seoPagesHub" ? (
              <AdminSeoPagesIndex token={token} />
            ) : activeTab === "callDriverPage" ? (
              <AdminCallDriverPage token={token} isSuperAdmin={isSuperAdmin} />
            ) : activeTab === "settings" ? (
              <AdminSettingsHub token={token} isSuperAdmin={isSuperAdmin} initialSection={settingsSection} />
            ) : activeTab === "cabs" ? (
              <VehicleAdminPanel
                token={token}
                isSuperAdmin={isSuperAdmin}
                initialEditId={initialEditId}
                pageMode={panelMode}
              />
            ) : CATALOG_TAB_KEYS.includes(activeTab) ? (
              <div className="space-y-4">
                {activeTab === "seoRoutes" ? (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">CMS</p>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Routes</h1>
                    <p className="mt-1 text-sm text-slate-600">Origin and destination must both be cities you already created. Live URLs stay on the current outstation path.</p>
                  </div>
                ) : null}
                {activeTab === "bookings" ? (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Operations</p>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bookings</h1>
                  </div>
                ) : null}
                <AdminCatalogPanel
                  tabKey={activeTab}
                  token={token}
                  isSuperAdmin={isSuperAdmin}
                  initialEditId={initialEditId}
                  viewId={initialViewId}
                  pageMode={panelMode}
                  prefillCity={prefillCity}
                  prefillType={prefillType}
                  prefillSlug={prefillSlug}
                />
              </div>
            ) : null}
        </>
      ) : null}
    </>
  );

  if (token) {
    return (
      <AdminShell
        user={user}
        onLogout={logout}
        navOpen={navOpen}
        onToggleNav={() => setNavOpen((open) => !open)}
        onCloseNav={() => setNavOpen(false)}
        sidebar={adminSidebar}
      >
        {panel}
      </AdminShell>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--cabzii-bg)]">
      <header className="border-b border-white/10 bg-[var(--cabzii-header)] px-4 py-4">
        <Link href="/" className="inline-block rounded-lg bg-white px-2.5 py-1">
          <CabziiLogo showDomain />
        </Link>
      </header>
      <div className="px-4 md:px-6 lg:px-8">{panel}</div>
    </main>
  );
}
