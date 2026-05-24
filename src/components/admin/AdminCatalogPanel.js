"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildCatalogListUrl,
  CATALOG_TABS,
  cabFormFromItem,
  cabFormToPayload,
  emptyBlogForm,
  emptyCabForm,
  emptyTestimonialForm,
  FARE_PACKAGE_FIELDS,
  formatCabPackageSummary
} from "../../lib/adminCatalogConfig";

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
  if (tabKey === "cabs") return `${item.vendor || "—"} · ${item.type || "Cab"} · ${formatCabPackageSummary(item)}`;
  return item.vendor || item.experience || item.type || "N/A";
}

export default function AdminCatalogPanel({ tabKey, token, isSuperAdmin }) {
  const tab = CATALOG_TABS[tabKey];
  const canEdit = isSuperAdmin || !tab?.superAdminOnly;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formJson, setFormJson] = useState("{}");
  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonialForm);
  const [cabForm, setCabForm] = useState(emptyCabForm());
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};
  const usesStructuredForm = tab?.form === "blog" || tab?.form === "testimonial" || tab?.form === "cab";

  const resetForm = useCallback(() => {
    setEditingId("");
    setFormJson("{}");
    setBlogForm(emptyBlogForm());
    setTestimonialForm(emptyTestimonialForm());
    setCabForm(emptyCabForm());
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

  const getPayload = () => {
    if (tab?.form === "blog") return { ...blogForm };
    if (tab?.form === "testimonial") return { ...testimonialForm };
    if (tab?.form === "cab") return cabFormToPayload(cabForm);
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
    if (tab?.form === "cab") {
      setCabForm(cabFormFromItem(tab.sample));
    } else {
      setFormJson(JSON.stringify(tab.sample, null, 2));
    }
    setErrorMessage("");
  };

  const updateCabPackageField = (packageKey, field, value) => {
    setCabForm((prev) => ({
      ...prev,
      farePackages: {
        ...prev.farePackages,
        [packageKey]: {
          ...prev.farePackages[packageKey],
          [field]: value
        }
      }
    }));
  };

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

      if (usesStructuredForm) {
        if (tab?.form === "cab") {
          setCabForm((prev) => ({
            ...prev,
            image: imagePath.startsWith("/") ? imagePath : data.data.relativeUrl || `/uploads/${data.data.fileName}`
          }));
          return;
        }
        return;
      }

      try {
        const parsed = formJson.trim() ? JSON.parse(formJson) : {};
        parsed.image = imagePath.startsWith("/") ? imagePath : data.data.relativeUrl || `/uploads/${data.data.fileName}`;
        setFormJson(JSON.stringify(parsed, null, 2));
      } catch {
        setFormJson(JSON.stringify({ image: data.data.relativeUrl || data.data.url }, null, 2));
      }
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
        throw new Error(data?.message || "Save failed");
      }
      const wasEditing = Boolean(editingId);
      resetForm();
      setStatusMessage(wasEditing ? "Updated successfully." : "Created successfully.");
      await loadData();
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

      {tabKey !== "bookings" && tabKey !== "testimonials" ? (
        <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-800">Image upload</p>
          <p className="mt-1 text-xs text-slate-600">Upload a photo and use the returned path in your JSON or content.</p>
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

      <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-800">
          {editingId ? `Edit ${tab.label.slice(0, -1)}` : `Create ${tab.label.slice(0, -1)}`}
        </p>

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
              <div className="sm:col-span-2">
                <Field label="Features" hint="Comma-separated, e.g. AC, GPS, Music">
                  <input className={inputCls()} value={cabForm.features} onChange={(e) => setCabForm((p) => ({ ...p, features: e.target.value }))} />
                </Field>
              </div>
            </div>

            <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3">
              <p className="text-sm font-semibold text-slate-900">Fare packages</p>
              <p className="mt-1 text-xs text-slate-600">
                Set local (4hr/40km, 8hr/80km) and outstation (one-way, round-trip) prices. These are saved in the database under <code className="rounded bg-white px-1">farePackages</code>.
              </p>
              <div className="mt-3 space-y-4">
                {FARE_PACKAGE_FIELDS.map(({ key, label }) => {
                  const pkg = cabForm.farePackages[key] || {};
                  return (
                    <div key={key} className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs font-bold text-slate-800">{label}</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                        <Field label="Original ₹">
                          <input type="number" min={0} className={inputCls()} value={pkg.originalPrice} onChange={(e) => updateCabPackageField(key, "originalPrice", Number(e.target.value))} />
                        </Field>
                        <Field label="Price ₹">
                          <input type="number" min={0} className={inputCls()} value={pkg.price} onChange={(e) => updateCabPackageField(key, "price", Number(e.target.value))} />
                        </Field>
                        <Field label="Discount %">
                          <input type="number" min={0} max={99} className={inputCls()} value={pkg.discountPercentage} onChange={(e) => updateCabPackageField(key, "discountPercentage", Number(e.target.value))} />
                        </Field>
                        <Field label="Extra km ₹">
                          <input type="number" min={0} className={inputCls()} value={pkg.extraKmRate} onChange={(e) => updateCabPackageField(key, "extraKmRate", Number(e.target.value))} />
                        </Field>
                        <Field label="Extra hr ₹">
                          <input type="number" min={0} className={inputCls()} value={pkg.extraHourRate} onChange={(e) => updateCabPackageField(key, "extraHourRate", Number(e.target.value))} />
                        </Field>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

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
      </div>

      {loading ? (
        <p className="text-sm text-slate-600">Loading {tab.label.toLowerCase()}...</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const id = item._id || item.id;
            const isEditing = editingId === id;
            return (
              <div
                key={id}
                className={`rounded-lg border p-3 ${isEditing ? "border-sky-300 bg-sky-50/50" : "border-slate-200 bg-white"}`}
              >
                <p className="font-semibold text-slate-900">{itemTitle(item, tabKey)}</p>
                <p className="text-sm text-slate-600">{itemSubtitle(item, tabKey)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    disabled={!canEdit}
                    className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  {tabKey !== "bookings" ? (
                    <button
                      type="button"
                      onClick={() => deleteItem(id)}
                      disabled={!canEdit}
                      className="rounded-md border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
          {!items.length && <p className="text-sm text-slate-500">No {tab.label.toLowerCase()} found.</p>}
        </div>
      )}
    </div>
  );
}
