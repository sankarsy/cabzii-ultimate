"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import AdminMasterData from "../../components/admin/AdminMasterData";
import AdminSiteSettings from "../../components/admin/AdminSiteSettings";
import { clearSession, getToken } from "../../lib/auth";

const endpointMap = {
  cabs: "/api/cabs",
  drivers: "/api/drivers",
  packages: "/api/packages",
  bookings: "/api/bookings",
  blogs: "/api/blogs?admin=1",
  testimonials: "/api/testimonials?admin=1"
};

const catalogTabs = ["cabs", "drivers", "packages", "bookings", "blogs", "testimonials"];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("master");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [formJson, setFormJson] = useState("{}");
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${endpointMap[activeTab]}?limit=100&page=1`, {
        cache: "no-store",
        headers: authHeaders
      });
      const data = await res.json();
      setItems(Array.isArray(data.data) ? data.data : []);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (!token || activeTab === "master" || activeTab === "settings") return;
    loadData();
  }, [activeTab, token]);

  const isSuperAdmin = user?.role === "super_admin";

  const handleUploadImage = async () => {
    if (!selectedImage) {
      setUploadError("Please choose an image first.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadedUrl("");

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: authHeaders,
        body: formData
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Upload failed");
      }

      const imagePath = data.data.relativeUrl || data.data.url;
      setUploadedUrl(data.data.url);

      try {
        const parsed = formJson.trim() ? JSON.parse(formJson) : {};
        parsed.image = imagePath.startsWith("/") ? imagePath : data.data.relativeUrl || `/uploads/${data.data.fileName}`;
        setFormJson(JSON.stringify(parsed, null, 2));
      } catch {
        setFormJson(
          JSON.stringify(
            { image: data.data.relativeUrl || data.data.url },
            null,
            2
          )
        );
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (item) => {
    const cleanItem = { ...item };
    delete cleanItem._id;
    delete cleanItem.__v;
    delete cleanItem.createdAt;
    delete cleanItem.updatedAt;
    setEditingId(item._id || item.id);
    setFormJson(JSON.stringify(cleanItem, null, 2));
  };

  const resetForm = () => {
    setEditingId("");
    setFormJson("{}");
  };

  const tabBase = (tab) => (endpointMap[tab] || "").split("?")[0];

  const saveItem = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const parsed = JSON.parse(formJson);
      const isBookingsTab = activeTab === "bookings";
      const base = tabBase(activeTab);
      const saveEndpoint = isBookingsTab && !editingId ? "/api/book" : base;
      const method = editingId ? (isBookingsTab ? "PATCH" : "PUT") : "POST";
      const url = isBookingsTab && editingId ? `${base}/${editingId}/status` : editingId ? `${base}/${editingId}` : saveEndpoint;

      const body = isBookingsTab && editingId ? { status: parsed.status || "pending" } : parsed;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Save failed");
      }
      resetForm();
      await loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Invalid JSON");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!token || !id || activeTab === "bookings") return;
    const ok = window.confirm("Delete this item?");
    if (!ok) return;
    const res = await fetch(`${tabBase(activeTab)}/${id}`, {
      method: "DELETE",
      headers: authHeaders
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data?.message || "Delete failed");
      return;
    }
    await loadData();
  };

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
          <p className="mt-2 text-sm text-slate-600">Role-based control for super admin and vendor admin operations.</p>

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
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    activeTab === "settings" ? "bg-sky-600 text-white" : "border border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  Site settings
                </button>
                {catalogTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${
                      activeTab === tab ? "bg-sky-600 text-white" : "border border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    {tab}
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
              ) : (
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-md">
                <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">Image Upload</p>
                  <p className="mt-1 text-xs text-slate-600">Upload a photo and use the returned URL in your data.</p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={(event) => setSelectedImage(event.target.files?.[0] ?? null)}
                      className="block w-full text-xs text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-sky-700"
                    />
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      disabled={uploading}
                      className="inline-flex justify-center rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  {uploadedUrl ? (
                    <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
                      Uploaded URL: <span className="font-semibold">{uploadedUrl}</span>
                    </div>
                  ) : null}
                  {uploadError ? (
                    <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">{uploadError}</div>
                  ) : null}
                </div>

                <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {editingId ? `Edit ${activeTab.slice(0, -1)} (${editingId})` : `Create ${activeTab.slice(0, -1)}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">Use JSON payload for full control.</p>
                  <textarea
                    value={formJson}
                    onChange={(event) => setFormJson(event.target.value)}
                    rows={10}
                    className="mt-3 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs outline-none focus:border-sky-600"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={saveItem}
                      disabled={saving}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {saving ? "Saving..." : editingId ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {loading ? (
                  <p className="text-sm text-slate-600">Loading {activeTab}...</p>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => {
                      const id = item._id || item.id;
                      return (
                        <div key={id} className="rounded-lg border border-slate-200 p-3">
                          <p className="font-semibold text-slate-900">
                            {item.title || item.name || item.customerName || item.slug}
                          </p>
                          <p className="text-sm text-slate-600">{item.vendor || item.experience || item.phone || "N/A"}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              Edit
                            </button>
                            {activeTab !== "bookings" ? (
                              <button
                                type="button"
                                onClick={() => deleteItem(id)}
                                className="rounded-md border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                    {!items.length && <p className="text-sm text-slate-500">No data available.</p>}
                  </div>
                )}
              </div>
              )}
            </>
          ) : null}
        </div>
      </section>
      <Footer />
    </main>
  );
}
