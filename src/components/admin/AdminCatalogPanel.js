"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildCatalogListUrl,
  CAB_PACKAGE_FIELDS,
  CATALOG_TABS,
  cabFormFromItem,
  cabFormToPayload,
  driverFormFromItem,
  driverFormToPayload,
  emptyBlogForm,
  emptyCabForm,
  emptyDriverForm,
  emptyTestimonialForm,
  emptyTourPackageForm,
  DRIVER_PACKAGE_FIELDS,
  formatCabPackageSummary,
  formatDriverPackageSummary,
  tourPackageFormFromItem,
  tourPackageFormToPayload
} from "../../lib/adminCatalogConfig";
import FarePackagesEditor from "./FarePackagesEditor";

function Field({ label, children, hint }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

function itemTitle(item, tabKey) {
  if (tabKey === "blogs") return item.title || item.slug;
  if (tabKey === "testimonials") return item.name;
  if (tabKey === "bookings") return item.customerName || item.phone || "Booking";
  return item.title || item.name || item.slug || "Item";
}

function itemSubtitle(item, tabKey) {
  if (tabKey === "blogs") return `${item.slug || "—"} · ${item.published === false ? "Draft" : "Published"}`;
  if (tabKey === "testimonials") return `${item.location || "—"} · ${item.rating ?? 5}★`;
  if (tabKey === "bookings") return `${item.status || "pending"} · ${item.phone || ""}`;
  if (tabKey === "cabs") return `${item.vendor || "—"} · ${item.city || "No city"} · ${item.location || "No location"} · ${formatCabPackageSummary(item)}`;
  if (tabKey === "drivers") return `${item.vendor || "—"} · ${item.city || "No city"} · ${item.location || "No location"} · ${formatDriverPackageSummary(item)}`;
  if (tabKey === "packages") return `${item.vendor || "—"} · ${item.city || "No city"} · ${item.duration || "—"} · ₹${item.price ?? "—"}`;
  return item.vendor || item.experience || item.type || "N/A";
}

export default function AdminCatalogPanel({
  tabKey,
  token,
  isSuperAdmin,
  initialEditId = "",
  pageMode = "list",
  viewId = ""
}) {
  const router = useRouter();
  const tab = CATALOG_TABS[tabKey];
  const canEdit = isSuperAdmin || !tab?.superAdminOnly;
  const isListMode = pageMode === "list";
  const singularLabel = tab?.label?.endsWith("s") ? tab.label.slice(0, -1) : "Item";
  const navigateAdmin = (url) => {
    if (typeof window !== "undefined") window.location.assign(url);
    else router.push(url);
  };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formJson, setFormJson] = useState("{}");
  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonialForm);
  const [cabForm, setCabForm] = useState(emptyCabForm());
  const [driverForm, setDriverForm] = useState(emptyDriverForm());
  const [tourPackageForm, setTourPackageForm] = useState(emptyTourPackageForm());
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("latest");
  const [listPage, setListPage] = useState(1);
  const [viewingId, setViewingId] = useState("");

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};
  const usesStructuredForm =
    tab?.form === "blog" ||
    tab?.form === "testimonial" ||
    tab?.form === "cab" ||
    tab?.form === "driver" ||
    tab?.form === "tourPackage";

  const resetForm = useCallback(() => {
    setEditingId("");
    setFormJson("{}");
    setBlogForm(emptyBlogForm());
    setTestimonialForm(emptyTestimonialForm());
    setCabForm(emptyCabForm());
    setDriverForm(emptyDriverForm());
    setTourPackageForm(emptyTourPackageForm());
    setErrorMessage("");
    setStatusMessage("");
  }, []);

  useEffect(() => {
    resetForm();
  }, [tabKey, resetForm]);

  const loadData = useCallback(async () => {
    if (!token || !tab) return;
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(buildCatalogListUrl(tabKey), {
        cache: "no-store",
        headers: authHeaders
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || `Failed to load ${tab.label.toLowerCase()}`);
      }
      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setItems([]);
      setErrorMessage(error instanceof Error ? error.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [tabKey, token, tab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!initialEditId || !items.length) return;
    const target = items.find((it) => String(it._id || it.id) === String(initialEditId));
    if (target) startEdit(target);
  }, [initialEditId, items]);

  useEffect(() => {
    if (!items.length) return;
    if (pageMode === "create") {
      resetForm();
      setViewingId("");
      return;
    }
    if ((pageMode === "edit" || pageMode === "view") && viewId) {
      const target = items.find((it) => String(it._id || it.id) === String(viewId));
      if (!target) return;
      if (pageMode === "edit") {
        startEdit(target);
        setViewingId("");
      } else {
        setEditingId("");
        setViewingId(String(viewId));
      }
    }
  }, [items, pageMode, viewId, resetForm]);

  useEffect(() => {
    setListPage(1);
  }, [query, statusFilter, sortKey, tabKey]);

  const getPayload = () => {
    if (tab?.form === "blog") return { ...blogForm };
    if (tab?.form === "testimonial") return { ...testimonialForm };
    if (tab?.form === "cab") return cabFormToPayload(cabForm);
    if (tab?.form === "driver") return driverFormToPayload(driverForm);
    if (tab?.form === "tourPackage") return tourPackageFormToPayload(tourPackageForm);
    return JSON.parse(formJson);
  };

  const startEdit = (item) => {
    setErrorMessage("");
    setStatusMessage("");
    setEditingId(item._id || item.id);

    if (tab?.form === "blog") {
      setBlogForm({
        slug: item.slug || "",
        title: item.title || "",
        excerpt: item.excerpt || "",
        body: item.body || "",
        author: item.author || "Cabzii Editorial",
        date: item.date || "",
        seoTitle: item.seoTitle || "",
        seoDescription: item.seoDescription || "",
        published: item.published !== false
      });
      return;
    }

    if (tab?.form === "testimonial") {
      setTestimonialForm({
        name: item.name || "",
        location: item.location || "",
        message: item.message || "",
        rating: item.rating ?? 5,
        sortOrder: item.sortOrder ?? 0,
        published: item.published !== false
      });
      return;
    }

    if (tab?.form === "cab") {
      setCabForm(cabFormFromItem(item));
      return;
    }

    if (tab?.form === "driver") {
      setDriverForm(driverFormFromItem(item));
      return;
    }

    if (tab?.form === "tourPackage") {
      setTourPackageForm(tourPackageFormFromItem(item));
      return;
    }

    const cleanItem = { ...item };
    delete cleanItem._id;
    delete cleanItem.__v;
    delete cleanItem.createdAt;
    delete cleanItem.updatedAt;
    delete cleanItem.vendorAdminPhone;
    setFormJson(JSON.stringify(cleanItem, null, 2));
  };

  const insertSample = () => {
    if (!tab?.sample) return;
    if (tab?.form === "cab") setCabForm(cabFormFromItem(tab.sample));
    else if (tab?.form === "driver") setDriverForm(driverFormFromItem(tab.sample));
    else if (tab?.form === "tourPackage") setTourPackageForm(tourPackageFormFromItem(tab.sample));
    else setFormJson(JSON.stringify(tab.sample, null, 2));
    setErrorMessage("");
  };

  const patchFormImage = (imagePath, fileName) => {
    const path = imagePath.startsWith("/") ? imagePath : `/uploads/${fileName}`;
    if (tab?.form === "cab") {
      setCabForm((p) => {
        const gallery = String(p.gallery || "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
        if (!gallery.includes(path)) gallery.push(path);
        return { ...p, image: path, gallery: gallery.slice(0, 3).join(", ") };
      });
    } else if (tab?.form === "driver") {
      setDriverForm((p) => {
        const gallery = String(p.gallery || "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
        if (!gallery.includes(path)) gallery.push(path);
        return { ...p, image: path, gallery: gallery.slice(0, 3).join(", ") };
      });
    } else if (tab?.form === "tourPackage") {
      setTourPackageForm((p) => {
        const gallery = String(p.gallery || "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
        if (!gallery.includes(path)) gallery.push(path);
        return { ...p, image: path, gallery: gallery.slice(0, 3).join(", ") };
      });
    }
    else {
      try {
        const parsed = formJson.trim() ? JSON.parse(formJson) : {};
        parsed.image = path;
        setFormJson(JSON.stringify(parsed, null, 2));
      } catch {
        setFormJson(JSON.stringify({ image: path }, null, 2));
      }
    }
  };

  const updateCabFare = (packageKey, field, value) => {
    setCabForm((prev) => ({
      ...prev,
      farePackages: {
        ...prev.farePackages,
        [packageKey]: { ...prev.farePackages[packageKey], [field]: value }
      }
    }));
  };

  const updateCabLabel = (packageKey, value) => {
    setCabForm((prev) => ({
      ...prev,
      farePackageLabels: { ...prev.farePackageLabels, [packageKey]: value }
    }));
  };

  const updateDriverFare = (packageKey, field, value) => {
    setDriverForm((prev) => ({
      ...prev,
      farePackages: {
        ...prev.farePackages,
        [packageKey]: { ...prev.farePackages[packageKey], [field]: value }
      }
    }));
  };

  const updateDriverLabel = (packageKey, value) => {
    setDriverForm((prev) => ({
      ...prev,
      farePackageLabels: { ...prev.farePackageLabels, [packageKey]: value }
    }));
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      setUploadError("Please choose an image first.");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedImage.type)) {
      setUploadError("Only jpg, jpeg, png, and webp are allowed.");
      return;
    }
    if (selectedImage.size > 5 * 1024 * 1024) {
      setUploadError("Image must be less than 5MB.");
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

      if (usesStructuredForm) {
        patchFormImage(imagePath, data.data.fileName);
        return;
      }

      patchFormImage(imagePath, data.data.fileName);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveItem = async () => {
    if (!token || !canEdit) {
      setErrorMessage("You do not have permission to edit this section. Use Admin login (super admin).");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      let parsed;
      if (usesStructuredForm) {
        parsed = getPayload();
      } else {
        parsed = JSON.parse(formJson);
      }

      const isBookingsTab = tabKey === "bookings";
      const base = tab.base;
      const saveEndpoint = isBookingsTab && !editingId ? "/api/book" : base;
      const method = editingId ? (isBookingsTab ? "PATCH" : "PUT") : "POST";
      const url =
        isBookingsTab && editingId
          ? `${base}/${editingId}/status`
          : editingId
            ? `${base}/${editingId}`
            : saveEndpoint;

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
        const detail = data?.message || data?.error || "Save failed";
        throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
      }
      const wasEditing = Boolean(editingId);
      if (wasEditing && tab?.form === "cab") setCabForm(cabFormFromItem(data.data));
      else if (wasEditing && tab?.form === "driver") setDriverForm(driverFormFromItem(data.data));
      else if (wasEditing && tab?.form === "tourPackage") setTourPackageForm(tourPackageFormFromItem(data.data));
      else resetForm();
      setStatusMessage(wasEditing ? "Updated successfully." : "Created successfully.");
      await loadData();
      if (!isListMode) {
        navigateAdmin(`/admin?tab=${tabKey}`);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Invalid JSON or save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!token || !id || tabKey === "bookings" || !canEdit) return;
    const ok = window.confirm("Delete this item?");
    if (!ok) return;

    setErrorMessage("");
    const res = await fetch(`${tab.base}/${id}`, {
      method: "DELETE",
      headers: authHeaders
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMessage(data?.message || "Delete failed");
      return;
    }
    setStatusMessage("Deleted successfully.");
    await loadData();
  };

  if (!tab) return null;
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const searched = items.filter((item) => {
      if (!q) return true;
      const hay = JSON.stringify(item).toLowerCase();
      return hay.includes(q);
    });
    const byStatus = searched.filter((item) => {
      if (statusFilter === "all") return true;
      if (tabKey === "bookings") return (item.status || "").toLowerCase() === statusFilter;
      if (tabKey === "blogs" || tabKey === "testimonials") {
        return statusFilter === "active" ? item.published !== false : item.published === false;
      }
      return statusFilter === "active";
    });
    const sorted = [...byStatus];
    if (sortKey === "name") {
      sorted.sort((a, b) => itemTitle(a, tabKey).localeCompare(itemTitle(b, tabKey)));
    } else if (sortKey === "price") {
      sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return sorted;
  }, [items, query, statusFilter, sortKey, tabKey]);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = filteredItems.slice((listPage - 1) * pageSize, listPage * pageSize);
  const viewingItem = viewingId ? items.find((x) => String(x._id || x.id) === viewingId) : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-md">
      {!canEdit ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <span className="font-semibold">View only.</span> Blogs and testimonials can only be edited by super admin. Log in with Admin login, not Travel Partner.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{errorMessage}</div>
      ) : null}
      {statusMessage ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{statusMessage}</div>
      ) : null}

      {!isListMode && tabKey !== "bookings" && tabKey !== "testimonials" ? (
        <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-800">Image upload</p>
          <p className="mt-1 text-xs text-slate-600">Upload a photo and use the returned path in your JSON or content.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => setSelectedImage(event.target.files?.[0] ?? null)}
              className="block w-full text-xs text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-sky-700"
            />
            <button
              type="button"
              onClick={handleUploadImage}
              disabled={uploading || !canEdit}
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
      ) : null}

      {!isListMode ? (
      <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-800">
          {pageMode === "view" ? `View ${singularLabel}` : editingId ? `Edit ${singularLabel}` : `Create ${singularLabel}`}
        </p>
        <div className="mt-2">
          <button
            type="button"
            onClick={() => navigateAdmin(`/admin?tab=${tabKey}`)}
            className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Back to list
          </button>
        </div>

        {pageMode === "view" ? null : (
        <>
        {tab.form === "blog" ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Slug *" hint="URL-friendly, e.g. chennai-airport-taxi-tips">
              <input className={inputCls()} value={blogForm.slug} onChange={(e) => setBlogForm((p) => ({ ...p, slug: e.target.value }))} />
            </Field>
            <Field label="Title *">
              <input className={inputCls()} value={blogForm.title} onChange={(e) => setBlogForm((p) => ({ ...p, title: e.target.value }))} />
            </Field>
            <Field label="Author">
              <input className={inputCls()} value={blogForm.author} onChange={(e) => setBlogForm((p) => ({ ...p, author: e.target.value }))} />
            </Field>
            <Field label="Date">
              <input className={inputCls()} value={blogForm.date} onChange={(e) => setBlogForm((p) => ({ ...p, date: e.target.value }))} placeholder="May 2026" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Excerpt">
                <textarea className={inputCls()} rows={2} value={blogForm.excerpt} onChange={(e) => setBlogForm((p) => ({ ...p, excerpt: e.target.value }))} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Body (HTML or plain text)">
                <textarea className={inputCls()} rows={6} value={blogForm.body} onChange={(e) => setBlogForm((p) => ({ ...p, body: e.target.value }))} />
              </Field>
            </div>
            <Field label="SEO title">
              <input className={inputCls()} value={blogForm.seoTitle} onChange={(e) => setBlogForm((p) => ({ ...p, seoTitle: e.target.value }))} />
            </Field>
            <Field label="SEO description">
              <input className={inputCls()} value={blogForm.seoDescription} onChange={(e) => setBlogForm((p) => ({ ...p, seoDescription: e.target.value }))} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
              <input type="checkbox" checked={blogForm.published} onChange={(e) => setBlogForm((p) => ({ ...p, published: e.target.checked }))} />
              Published (visible on website)
            </label>
          </div>
        ) : tab.form === "testimonial" ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Name *">
              <input className={inputCls()} value={testimonialForm.name} onChange={(e) => setTestimonialForm((p) => ({ ...p, name: e.target.value }))} />
            </Field>
            <Field label="Location">
              <input className={inputCls()} value={testimonialForm.location} onChange={(e) => setTestimonialForm((p) => ({ ...p, location: e.target.value }))} placeholder="Chennai" />
            </Field>
            <Field label="Rating (1–5)">
              <input type="number" min={1} max={5} className={inputCls()} value={testimonialForm.rating} onChange={(e) => setTestimonialForm((p) => ({ ...p, rating: Number(e.target.value) }))} />
            </Field>
            <Field label="Sort order">
              <input type="number" className={inputCls()} value={testimonialForm.sortOrder} onChange={(e) => setTestimonialForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Message *">
                <textarea className={inputCls()} rows={4} value={testimonialForm.message} onChange={(e) => setTestimonialForm((p) => ({ ...p, message: e.target.value }))} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
              <input type="checkbox" checked={testimonialForm.published} onChange={(e) => setTestimonialForm((p) => ({ ...p, published: e.target.checked }))} />
              Published (visible on website)
            </label>
          </div>
        ) : tab.form === "cab" ? (
          <div className="mt-3 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title *">
                <input className={inputCls()} value={cabForm.title} onChange={(e) => setCabForm((p) => ({ ...p, title: e.target.value }))} />
              </Field>
              <Field label="Vendor *">
                <input className={inputCls()} value={cabForm.vendor} onChange={(e) => setCabForm((p) => ({ ...p, vendor: e.target.value }))} />
              </Field>
              <Field label="Type *">
                <select className={inputCls()} value={cabForm.type} onChange={(e) => setCabForm((p) => ({ ...p, type: e.target.value }))}>
                  {["Sedan", "SUV", "Van", "Bus"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Seats">
                <input type="number" min={1} className={inputCls()} value={cabForm.seats} onChange={(e) => setCabForm((p) => ({ ...p, seats: Number(e.target.value) }))} />
              </Field>
              <Field label="Base price (outstation reference) *" hint="Used when package price is missing">
                <input type="number" min={0} className={inputCls()} value={cabForm.price} onChange={(e) => setCabForm((p) => ({ ...p, price: Number(e.target.value) }))} />
              </Field>
              <Field label="Image path">
                <input className={inputCls()} value={cabForm.image} onChange={(e) => setCabForm((p) => ({ ...p, image: e.target.value }))} placeholder="/uploads/cab.jpg" />
              </Field>
              <Field label="City">
                <input className={inputCls()} value={cabForm.city} onChange={(e) => setCabForm((p) => ({ ...p, city: e.target.value }))} placeholder="Bengaluru" />
              </Field>
              <Field label="Location">
                <input className={inputCls()} value={cabForm.location} onChange={(e) => setCabForm((p) => ({ ...p, location: e.target.value }))} placeholder="Airport, Indiranagar, etc." />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Gallery images (max 3)" hint="Comma-separated image paths">
                  <input className={inputCls()} value={cabForm.gallery} onChange={(e) => setCabForm((p) => ({ ...p, gallery: e.target.value }))} placeholder="/uploads/cab1.jpg, /uploads/cab2.jpg, /uploads/cab3.jpg" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Features" hint="Comma-separated, e.g. AC, GPS, Music">
                  <input className={inputCls()} value={cabForm.features} onChange={(e) => setCabForm((p) => ({ ...p, features: e.target.value }))} />
                </Field>
              </div>
            </div>

            <FarePackagesEditor
              title="Cab fare packages"
              hint="Edit package names and prices. Names appear on cab cards."
              packageFields={CAB_PACKAGE_FIELDS}
              farePackages={cabForm.farePackages}
              farePackageLabels={cabForm.farePackageLabels}
              onUpdateFare={updateCabFare}
              onUpdateLabel={updateCabLabel}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="SEO title">
                <input className={inputCls()} value={cabForm.seoTitle} onChange={(e) => setCabForm((p) => ({ ...p, seoTitle: e.target.value }))} />
              </Field>
              <Field label="SEO description">
                <input className={inputCls()} value={cabForm.seoDescription} onChange={(e) => setCabForm((p) => ({ ...p, seoDescription: e.target.value }))} />
              </Field>
            </div>

            {tab.sample ? (
              <button
                type="button"
                onClick={insertSample}
                disabled={!canEdit}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Load sample cab
              </button>
            ) : null}
          </div>
        ) : tab.form === "driver" ? (
          <div className="mt-3 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name *">
                <input className={inputCls()} value={driverForm.name} onChange={(e) => setDriverForm((p) => ({ ...p, name: e.target.value }))} />
              </Field>
              <Field label="Vendor">
                <input className={inputCls()} value={driverForm.vendor} onChange={(e) => setDriverForm((p) => ({ ...p, vendor: e.target.value }))} />
              </Field>
              <Field label="Type">
                <select className={inputCls()} value={driverForm.type} onChange={(e) => setDriverForm((p) => ({ ...p, type: e.target.value }))}>
                  <option value="local">Local</option>
                  <option value="outstation">Outstation</option>
                </select>
              </Field>
              <Field label="Experience">
                <input className={inputCls()} value={driverForm.experience} onChange={(e) => setDriverForm((p) => ({ ...p, experience: e.target.value }))} placeholder="5 Years" />
              </Field>
              <Field label="Trips">
                <input type="number" min={0} className={inputCls()} value={driverForm.trips} onChange={(e) => setDriverForm((p) => ({ ...p, trips: Number(e.target.value) }))} />
              </Field>
              <Field label="Rating">
                <input className={inputCls()} value={driverForm.rating} onChange={(e) => setDriverForm((p) => ({ ...p, rating: e.target.value }))} placeholder="4.9" />
              </Field>
              <Field label="Discount %">
                <input type="number" min={0} max={99} className={inputCls()} value={driverForm.discountPercentage} onChange={(e) => setDriverForm((p) => ({ ...p, discountPercentage: Number(e.target.value) }))} />
              </Field>
              <Field label="Image path">
                <input className={inputCls()} value={driverForm.image} onChange={(e) => setDriverForm((p) => ({ ...p, image: e.target.value }))} placeholder="/uploads/driver.jpg" />
              </Field>
              <Field label="City">
                <input className={inputCls()} value={driverForm.city} onChange={(e) => setDriverForm((p) => ({ ...p, city: e.target.value }))} placeholder="Bengaluru" />
              </Field>
              <Field label="Location">
                <input className={inputCls()} value={driverForm.location} onChange={(e) => setDriverForm((p) => ({ ...p, location: e.target.value }))} placeholder="Koramangala, Whitefield, etc." />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Gallery images (max 3)" hint="Comma-separated image paths">
                  <input className={inputCls()} value={driverForm.gallery} onChange={(e) => setDriverForm((p) => ({ ...p, gallery: e.target.value }))} placeholder="/uploads/driver1.jpg, /uploads/driver2.jpg, /uploads/driver3.jpg" />
                </Field>
              </div>
              <Field label="Languages" hint="Comma-separated">
                <input className={inputCls()} value={driverForm.languages} onChange={(e) => setDriverForm((p) => ({ ...p, languages: e.target.value }))} placeholder="English, Tamil" />
              </Field>
              <Field label="Supported vehicles" hint="Comma-separated">
                <input className={inputCls()} value={driverForm.supportedVehicles} onChange={(e) => setDriverForm((p) => ({ ...p, supportedVehicles: e.target.value }))} placeholder="Sedan, SUV" />
              </Field>
              <Field label="Pricing — hourly ₹">
                <input type="number" min={0} className={inputCls()} value={driverForm.pricingHourly} onChange={(e) => setDriverForm((p) => ({ ...p, pricingHourly: Number(e.target.value) }))} />
              </Field>
              <Field label="Pricing — day ₹">
                <input type="number" min={0} className={inputCls()} value={driverForm.pricingDay} onChange={(e) => setDriverForm((p) => ({ ...p, pricingDay: Number(e.target.value) }))} />
              </Field>
              <Field label="Pricing — extra hour ₹">
                <input type="number" min={0} className={inputCls()} value={driverForm.pricingExtraHour} onChange={(e) => setDriverForm((p) => ({ ...p, pricingExtraHour: Number(e.target.value) }))} />
              </Field>
            </div>

            <FarePackagesEditor
              title="Driver fare packages"
              hint="Edit package names and prices shown on driver cards."
              packageFields={DRIVER_PACKAGE_FIELDS}
              farePackages={driverForm.farePackages}
              farePackageLabels={driverForm.farePackageLabels}
              onUpdateFare={updateDriverFare}
              onUpdateLabel={updateDriverLabel}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="SEO title">
                <input className={inputCls()} value={driverForm.seoTitle} onChange={(e) => setDriverForm((p) => ({ ...p, seoTitle: e.target.value }))} />
              </Field>
              <Field label="SEO description">
                <input className={inputCls()} value={driverForm.seoDescription} onChange={(e) => setDriverForm((p) => ({ ...p, seoDescription: e.target.value }))} />
              </Field>
            </div>

            {tab.sample ? (
              <button
                type="button"
                onClick={insertSample}
                disabled={!canEdit}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Load sample driver
              </button>
            ) : null}
          </div>
        ) : tab.form === "tourPackage" ? (
          <div className="mt-3 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name *">
                <input className={inputCls()} value={tourPackageForm.name} onChange={(e) => setTourPackageForm((p) => ({ ...p, name: e.target.value }))} />
              </Field>
              <Field label="Vendor *">
                <input className={inputCls()} value={tourPackageForm.vendor} onChange={(e) => setTourPackageForm((p) => ({ ...p, vendor: e.target.value }))} />
              </Field>
              <Field label="Duration *">
                <input className={inputCls()} value={tourPackageForm.duration} onChange={(e) => setTourPackageForm((p) => ({ ...p, duration: e.target.value }))} placeholder="2 Days" />
              </Field>
              <Field label="Price ₹ *">
                <input type="number" min={0} className={inputCls()} value={tourPackageForm.price} onChange={(e) => setTourPackageForm((p) => ({ ...p, price: Number(e.target.value) }))} />
              </Field>
              <Field label="Original price ₹">
                <input type="number" min={0} className={inputCls()} value={tourPackageForm.originalPrice} onChange={(e) => setTourPackageForm((p) => ({ ...p, originalPrice: Number(e.target.value) }))} />
              </Field>
              <Field label="Discount %">
                <input type="number" min={0} max={99} className={inputCls()} value={tourPackageForm.discountPercentage} onChange={(e) => setTourPackageForm((p) => ({ ...p, discountPercentage: Number(e.target.value) }))} />
              </Field>
              <Field label="Hourly rate ₹">
                <input type="number" min={0} className={inputCls()} value={tourPackageForm.hourlyRate} onChange={(e) => setTourPackageForm((p) => ({ ...p, hourlyRate: Number(e.target.value) }))} />
              </Field>
              <Field label="Day rate ₹">
                <input type="number" min={0} className={inputCls()} value={tourPackageForm.dayRate} onChange={(e) => setTourPackageForm((p) => ({ ...p, dayRate: Number(e.target.value) }))} />
              </Field>
              <Field label="Extra hour rate ₹">
                <input type="number" min={0} className={inputCls()} value={tourPackageForm.extraHourRate} onChange={(e) => setTourPackageForm((p) => ({ ...p, extraHourRate: Number(e.target.value) }))} />
              </Field>
              <Field label="Image path">
                <input className={inputCls()} value={tourPackageForm.image} onChange={(e) => setTourPackageForm((p) => ({ ...p, image: e.target.value }))} placeholder="/uploads/package.jpg" />
              </Field>
              <Field label="City">
                <input className={inputCls()} value={tourPackageForm.city} onChange={(e) => setTourPackageForm((p) => ({ ...p, city: e.target.value }))} placeholder="Bengaluru" />
              </Field>
              <Field label="Location">
                <input className={inputCls()} value={tourPackageForm.location} onChange={(e) => setTourPackageForm((p) => ({ ...p, location: e.target.value }))} placeholder="Pickup / destination hub" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Gallery images (max 3)" hint="Comma-separated image paths">
                  <input className={inputCls()} value={tourPackageForm.gallery} onChange={(e) => setTourPackageForm((p) => ({ ...p, gallery: e.target.value }))} placeholder="/uploads/pkg1.jpg, /uploads/pkg2.jpg, /uploads/pkg3.jpg" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Tags" hint="Comma-separated, e.g. Family, Outstation">
                  <input className={inputCls()} value={tourPackageForm.tags} onChange={(e) => setTourPackageForm((p) => ({ ...p, tags: e.target.value }))} />
                </Field>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="SEO title">
                <input className={inputCls()} value={tourPackageForm.seoTitle} onChange={(e) => setTourPackageForm((p) => ({ ...p, seoTitle: e.target.value }))} />
              </Field>
              <Field label="SEO description">
                <input className={inputCls()} value={tourPackageForm.seoDescription} onChange={(e) => setTourPackageForm((p) => ({ ...p, seoDescription: e.target.value }))} />
              </Field>
            </div>

            {tab.sample ? (
              <button
                type="button"
                onClick={insertSample}
                disabled={!canEdit}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Load sample tour package
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <p className="mt-1 text-xs text-slate-600">Required fields: {tab.required?.join(", ") || "see sample JSON"}</p>
            <textarea
              value={formJson}
              onChange={(event) => setFormJson(event.target.value)}
              rows={10}
              disabled={!canEdit}
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs outline-none focus:border-sky-600 disabled:bg-slate-100"
            />
            {tab.sample ? (
              <button
                type="button"
                onClick={insertSample}
                disabled={!canEdit}
                className="mt-2 rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Insert sample JSON
              </button>
            ) : null}
          </>
        )}

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={saveItem}
            disabled={saving || !canEdit}
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
        </>
        )}
      </div>
      ) : null}

      {!isListMode && pageMode === "view" ? (
        viewingItem ? (
          <div className="mb-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm">
            <p className="font-semibold text-slate-900">View details</p>
            <pre className="mt-2 max-h-[32rem] overflow-auto rounded-md bg-white p-3 text-xs text-slate-700">
              {JSON.stringify(viewingItem, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            Loading details...
          </p>
        )
      ) : null}

      {isListMode ? (
      <>
      <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-800">{tab.label}</p>
        {canEdit ? (
          <button
            type="button"
            onClick={() => navigateAdmin(`/admin/${tabKey}/create`)}
            className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
          >
            Create {singularLabel}
          </button>
        ) : null}
      </div>
      <div className="mb-3 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4">
        <input
          className={inputCls()}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${tab.label.toLowerCase()}...`}
        />
        <select className={inputCls()} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="draft">Draft/Inactive</option>
          {tabKey === "bookings" ? (
            <>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </>
          ) : null}
        </select>
        <select className={inputCls()} value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="latest">Latest first</option>
          <option value="name">Name A-Z</option>
          <option value="price">Price high-low</option>
        </select>
        <div className="text-xs text-slate-600 sm:self-center">Rows: {filteredItems.length}</div>
      </div>

      {viewingItem ? (
        <div className="mb-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-900">View details</p>
            <button type="button" onClick={() => setViewingId("")} className="text-xs font-semibold text-sky-700">Close</button>
          </div>
          <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-white p-2 text-xs text-slate-700">{JSON.stringify(viewingItem, null, 2)}</pre>
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-600">Loading {tab.label.toLowerCase()}...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="max-h-[28rem] overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-3 py-2">Image</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Details</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
          {pagedItems.map((item) => {
            const id = item._id || item.id;
            const isEditing = editingId === id;
            return (
              <tr key={id} className={`border-t border-slate-100 hover:bg-slate-50 ${isEditing ? "bg-sky-50/70" : ""}`}>
                <td className="px-3 py-2">
                  {item.image ? <img src={item.image} alt={itemTitle(item, tabKey)} className="h-10 w-14 rounded object-cover" /> : <span className="text-xs text-slate-400">—</span>}
                </td>
                <td className="px-3 py-2 font-semibold text-slate-900">{itemTitle(item, tabKey)}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{itemSubtitle(item, tabKey)}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                    tabKey === "bookings"
                      ? item.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : item.status === "cancelled" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                      : (item.published === false ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700")
                  }`}>
                    {tabKey === "bookings" ? item.status || "pending" : item.published === false ? "draft" : "active"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => navigateAdmin(`/admin/${tabKey}/${id}/view`)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      title="View"
                    >
                      View
                    </button>
                  <button
                    type="button"
                    onClick={() => navigateAdmin(`/admin/${tabKey}/${id}/edit`)}
                    disabled={!canEdit}
                    className="rounded-md border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    title="Edit"
                  >
                    Edit
                  </button>
                  {tabKey !== "bookings" ? (
                    <button
                      type="button"
                      onClick={() => deleteItem(id)}
                      disabled={!canEdit}
                      className="rounded-md border border-rose-300 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                      title="Delete"
                    >
                      Delete
                    </button>
                  ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
              </tbody>
            </table>
          </div>
          {!filteredItems.length && <p className="p-3 text-sm text-slate-500">No {tab.label.toLowerCase()} found.</p>}
          <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2 text-xs">
            <span className="text-slate-500">Page {listPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setListPage((p) => Math.max(1, p - 1))} disabled={listPage <= 1} className="rounded border border-slate-300 px-2 py-1 disabled:opacity-40">Prev</button>
              <button type="button" onClick={() => setListPage((p) => Math.min(totalPages, p + 1))} disabled={listPage >= totalPages} className="rounded border border-slate-300 px-2 py-1 disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      )}
      </>
      ) : null}
    </div>
  );
}
