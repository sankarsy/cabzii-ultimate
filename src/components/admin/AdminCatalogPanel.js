"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  bookingFormFromItem,
  bookingFormToPayload,
  buildCatalogListUrl,
  CAB_PACKAGE_FIELDS,
  CATALOG_TABS,
  mergeStaticSeoRoutes,
  mergeStaticSeoServices,
  cabFormFromItem,
  cabFormToPayload,
  driverFormFromItem,
  driverFormToPayload,
  emptyBlogForm,
  emptyBookingForm,
  emptyCabForm,
  emptyDriverForm,
  emptySeoCityPageForm,
  emptySeoRouteForm,
  emptySeoServiceForm,
  emptyTestimonialForm,
  emptyTourPackageForm,
  DRIVER_PACKAGE_FIELDS,
  formatCabPackageSummary,
  formatDriverPackageSummary,
  seoCityPageFormFromItem,
  seoCityPageFormToPayload,
  seoRouteFormFromItem,
  seoRouteFormToPayload,
  seoServiceFormFromItem,
  seoServiceFormToPayload,
  tourPackageFormFromItem,
  tourPackageFormToPayload
} from "../../lib/adminCatalogConfig";
import {
  buildBookingStatsMap,
  catalogItemBookingKey,
  formatBookingStatsLine
} from "../../lib/bookingStats";
import { normalizeStoredImagePath, resolveMediaUrl } from "../../lib/media";
import AdminBookingEditor from "./AdminBookingEditor";
import { AdminSeoCityPageForm, AdminSeoRouteForm, AdminSeoServiceForm } from "./AdminSeoForm";
import { AdminProductSeoSection } from "./AdminProductSeoSection";
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
  if (tabKey === "seoServices") return item.seoTitle || item.name || item.slug || "Service";
  if (tabKey === "seoRoutes") return item.seoTitle || item.title || item.slug || "Route";
  if (tabKey === "seoCityPages") return item.seoTitle || `${item.pageType}/${item.citySlug}` || "City page";
  return item.title || item.name || item.slug || "Item";
}

function itemSubtitle(item, tabKey) {
  if (tabKey === "blogs") return `${item.slug || "—"} · ${item.published === false ? "Draft" : "Published"}`;
  if (tabKey === "testimonials") return `${item.location || "—"} · ${item.rating ?? 5}★`;
  if (tabKey === "bookings") {
    const parts = [
      item.status || "pending",
      item.phone || "",
      item.itemTitle || "",
      item.pickup ? `${item.pickup}${item.drop ? ` → ${item.drop}` : ""}` : "",
      `₹${Number(item.amount || 0).toLocaleString("en-IN")}`
    ];
    const contactPhone = item.vendorContact?.phone || item.vendorContact?.whatsapp;
    if (item.status === "confirmed" && contactPhone) {
      parts.push(`Contact: ${contactPhone}`);
    }
    return parts.filter(Boolean).join(" · ");
  }
  if (tabKey === "cabs") return `${item.vendor || "—"} · ${item.city || "No city"} · ${item.location || "No location"} · ${formatCabPackageSummary(item)}`;
  if (tabKey === "drivers") return `${item.vendor || "—"} · ${item.city || "No city"} · ${item.location || "No location"} · ${formatDriverPackageSummary(item)}`;
  if (tabKey === "packages") return `${item.vendor || "—"} · ${item.city || "No city"} · ₹${item.price ?? "—"}`;
  if (tabKey === "seoServices") {
    const base = item.publicPath || `/services/${item.slug}/chennai`;
    return item.isStatic
      ? `Built-in (read-only) · ${base} · Seed DB to edit in admin`
      : `${base} · ${item.published === false ? "Draft" : "Published"}${item.showInMenu ? " · Menu" : ""}`;
  }
  if (tabKey === "seoRoutes") {
    const base = item.publicPath || `/routes/${item.slug}`;
    return item.isStatic
      ? `Built-in (read-only) · ${base} · Seed DB to edit in admin`
      : `${base} · ${item.fromCitySlug || "—"} → ${item.toCitySlug || "—"} · ${item.published === false ? "Draft" : "Published"}`;
  }
  if (tabKey === "seoCityPages") {
    const base = item.publicPath || `/${item.pageType}/${item.citySlug}`;
    return `${base} · ${item.published === false ? "Draft" : "Published"}`;
  }
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
    router.push(url);
  };
  const createModeReady = useRef(false);

  const [items, setItems] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formJson, setFormJson] = useState("{}");
  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonialForm);
  const [cabForm, setCabForm] = useState(emptyCabForm());
  const [driverForm, setDriverForm] = useState(emptyDriverForm());
  const [tourPackageForm, setTourPackageForm] = useState(emptyTourPackageForm());
  const [bookingForm, setBookingForm] = useState(emptyBookingForm());
  const [seoServiceForm, setSeoServiceForm] = useState(emptySeoServiceForm());
  const [seoRouteForm, setSeoRouteForm] = useState(emptySeoRouteForm());
  const [seoCityPageForm, setSeoCityPageForm] = useState(emptySeoCityPageForm());
  const [bookingLoading, setBookingLoading] = useState(false);
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
    tab?.form === "tourPackage" ||
    tab?.form === "seoService" ||
    tab?.form === "seoRoute" ||
    tab?.form === "seoCityPage" ||
    tabKey === "bookings" ||
    tab?.form === "booking";

  const resetForm = useCallback(() => {
    setEditingId("");
    setFormJson("{}");
    setBlogForm(emptyBlogForm());
    setTestimonialForm(emptyTestimonialForm());
    setCabForm(emptyCabForm());
    setDriverForm(emptyDriverForm());
    setTourPackageForm(emptyTourPackageForm());
    setBookingForm(emptyBookingForm());
    setSeoServiceForm(emptySeoServiceForm());
    setSeoRouteForm(emptySeoRouteForm());
    setSeoCityPageForm(emptySeoCityPageForm());
    setErrorMessage("");
    setStatusMessage("");
  }, []);

  useEffect(() => {
    resetForm();
    createModeReady.current = false;
  }, [tabKey, resetForm]);

  useEffect(() => {
    if (pageMode === "create" && !createModeReady.current) {
      resetForm();
      setEditingId("");
      setViewingId("");
      createModeReady.current = true;
    }
    if (pageMode !== "create") {
      createModeReady.current = false;
    }
  }, [pageMode, resetForm]);

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
      let rows = Array.isArray(data.data) ? data.data : [];
      if (tabKey === "seoServices") rows = mergeStaticSeoServices(rows);
      if (tabKey === "seoRoutes") rows = mergeStaticSeoRoutes(rows);
      setItems(rows);
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

  const loadBookings = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/bookings?admin=1", {
        cache: "no-store",
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data?.data)) {
        setAllBookings(data.data);
      }
    } catch {
      setAllBookings([]);
    }
  }, [token]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const bookingStats = useMemo(() => buildBookingStatsMap(allBookings), [allBookings]);

  const catalogBookingSummary = useMemo(() => {
    if (!["cabs", "drivers", "packages"].includes(tabKey)) return null;
    let count = 0;
    let total = 0;
    for (const item of items) {
      const key = catalogItemBookingKey(tabKey, item);
      const stats = bookingStats.byItem[key];
      if (stats) {
        count += stats.count;
        total += stats.total;
      }
    }
    return { count, total };
  }, [items, tabKey, bookingStats]);

  useEffect(() => {
    if (tabKey === "bookings") return;
    if (!initialEditId || !items.length) return;
    const target = items.find((it) => String(it._id || it.id) === String(initialEditId));
    if (!target || target.isStatic) return;
    startEdit(target);
  }, [initialEditId, items, tabKey]);

  useEffect(() => {
    if (tabKey === "bookings") return;
    if (!items.length) return;
    if (pageMode === "create") return;
    const editTargetId = viewId || initialEditId;
    if ((pageMode === "edit" || pageMode === "view") && editTargetId) {
      const target = items.find((it) => String(it._id || it.id) === String(editTargetId));
      if (!target) return;
      if (target.isStatic) {
        if (pageMode === "edit") {
          setErrorMessage("Built-in pages are read-only. Run seed script or create a new entry with the same slug to override.");
        }
        setEditingId("");
        setViewingId(String(editTargetId));
        return;
      }
      if (pageMode === "edit") {
        startEdit(target);
        setViewingId("");
      } else {
        setEditingId("");
        setViewingId(String(editTargetId));
      }
    }
  }, [items, pageMode, viewId, initialEditId, tabKey]);

  useEffect(() => {
    if (tabKey !== "bookings" || !token || pageMode === "list") return;
    const editId = initialEditId || viewId;
    if (!editId) return;

    let cancelled = false;
    setBookingLoading(true);
    setErrorMessage("");

    fetch(`/api/bookings/${editId}`, { headers: authHeaders, cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Could not load booking");
        }
        setEditingId(String(editId));
        setBookingForm(bookingFormFromItem(json.data));
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMessage(err instanceof Error ? err.message : "Could not load booking");
        }
      })
      .finally(() => {
        if (!cancelled) setBookingLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tabKey, token, pageMode, initialEditId, viewId]);

  useEffect(() => {
    setListPage(1);
  }, [query, statusFilter, sortKey, tabKey]);

  const getPayload = () => {
    if (tab?.form === "blog") return { ...blogForm };
    if (tab?.form === "testimonial") return { ...testimonialForm };
    if (tab?.form === "cab") return cabFormToPayload(cabForm);
    if (tab?.form === "driver") return driverFormToPayload(driverForm);
    if (tab?.form === "tourPackage") return tourPackageFormToPayload(tourPackageForm);
    if (tabKey === "bookings" || tab?.form === "booking") return bookingFormToPayload(bookingForm);
    if (tab?.form === "seoService") return seoServiceFormToPayload(seoServiceForm);
    if (tab?.form === "seoRoute") return seoRouteFormToPayload(seoRouteForm);
    if (tab?.form === "seoCityPage") return seoCityPageFormToPayload(seoCityPageForm);
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

    if (tabKey === "bookings" || tab?.form === "booking") {
      setBookingForm(bookingFormFromItem(item));
      return;
    }

    if (tab?.form === "seoService") {
      setSeoServiceForm(seoServiceFormFromItem(item));
      return;
    }

    if (tab?.form === "seoRoute") {
      setSeoRouteForm(seoRouteFormFromItem(item));
      return;
    }

    if (tab?.form === "seoCityPage") {
      setSeoCityPageForm(seoCityPageFormFromItem(item));
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
    else if (tab?.form === "booking") setBookingForm({ ...emptyBookingForm(), status: "confirmed" });
    else if (tab?.form === "seoService") setSeoServiceForm(seoServiceFormFromItem(tab.sample));
    else if (tab?.form === "seoRoute") setSeoRouteForm(seoRouteFormFromItem(tab.sample));
    else if (tab?.form === "seoCityPage") setSeoCityPageForm(seoCityPageFormFromItem(tab.sample));
    else setFormJson(JSON.stringify(tab.sample, null, 2));
    setErrorMessage("");
  };

  const patchFormImage = (imagePath, fileName) => {
    const path =
      normalizeStoredImagePath(imagePath) ||
      (imagePath?.startsWith("/") ? imagePath : `/uploads/${fileName}`);
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

      const imagePath = normalizeStoredImagePath(data.data.relativeUrl || data.data.url);
      setUploadedUrl(imagePath);

      patchFormImage(imagePath, data.data.fileName);
      setStatusMessage("Image uploaded. Click Save below to publish it on the website.");
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

      if (tab?.form === "seoService") {
        if (!String(parsed.seoTitle || "").trim()) {
          throw new Error("SEO title is required.");
        }
      }
      if (tab?.form === "seoRoute") {
        if (!String(parsed.seoTitle || "").trim()) {
          throw new Error("SEO title is required.");
        }
      }
      if (tab?.form === "seoCityPage") {
        if (!String(parsed.seoTitle || "").trim()) {
          throw new Error("SEO title is required.");
        }
        if (!String(parsed.citySlug || "").trim()) {
          throw new Error("City slug is required (e.g. chennai).");
        }
        if (!String(parsed.fromCitySlug || "").trim() || !String(parsed.toCitySlug || "").trim()) {
          throw new Error("From city and to city are required (e.g. chennai, bengaluru).");
        }
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

      const body =
        isBookingsTab && editingId
          ? { status: parsed.status || "pending", vendorContact: parsed.vendorContact }
          : parsed;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        const detail = data?.message || data?.error || "Save failed";
        throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
      }
      const wasEditing = Boolean(editingId);
      if (wasEditing && tab?.form === "cab") setCabForm(cabFormFromItem(data.data));
      else if (wasEditing && tab?.form === "driver") setDriverForm(driverFormFromItem(data.data));
      else if (wasEditing && tab?.form === "tourPackage") setTourPackageForm(tourPackageFormFromItem(data.data));
      else if (wasEditing && (tabKey === "bookings" || tab?.form === "booking")) {
        setBookingForm(bookingFormFromItem(data.data));
      } else if (wasEditing && tab?.form === "seoService") {
        setSeoServiceForm(seoServiceFormFromItem(data.data));
      } else if (wasEditing && tab?.form === "seoRoute") {
        setSeoRouteForm(seoRouteFormFromItem(data.data));
      } else if (wasEditing && tab?.form === "seoCityPage") {
        setSeoCityPageForm(seoCityPageFormFromItem(data.data));
      }
      else resetForm();
      if (tab?.form === "seoService" && data.data?.publicPath) {
        setStatusMessage(`Saved. Live URL: ${data.data.publicPath} (added to sitemap when published)`);
      } else if (tab?.form === "seoRoute" && data.data?.publicPath) {
        setStatusMessage(`Saved. Live URL: ${data.data.publicPath} (added to sitemap when published)`);
      } else if (tab?.form === "seoCityPage" && data.data?.publicPath) {
        setStatusMessage(`Saved. Live URL: ${data.data.publicPath} — meta updates within ~10 minutes.`);
      } else if (wasEditing && tab?.form === "cab" && data.data?.image) {
        setStatusMessage(`Updated successfully. Image saved: ${data.data.image}`);
      } else if (wasEditing && tab?.form === "driver" && data.data?.image) {
        setStatusMessage(`Updated successfully. Image saved: ${data.data.image}`);
      } else {
        setStatusMessage(wasEditing ? "Updated successfully." : "Created successfully.");
      }
      if (tab?.form === "seoService" || tab?.form === "seoRoute" || tab?.form === "seoCityPage") {
        if (!wasEditing && data.data?._id) {
          setEditingId(String(data.data._id));
        }
      }
      await loadData();
      await loadBookings();
      if (!isListMode) {
        navigateAdmin(`/admin?tab=${tabKey}&mode=list`);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Invalid JSON or save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!token || !id || tabKey === "bookings" || !canEdit) return;
    if (String(id).startsWith("static:")) return;
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

  const filteredItems = useMemo(() => {
    if (!tab) return [];
    const q = query.trim().toLowerCase();
    const searched = items.filter((item) => {
      if (!q) return true;
      const hay = JSON.stringify(item).toLowerCase();
      return hay.includes(q);
    });
    const byStatus = searched.filter((item) => {
      if (statusFilter === "all") return true;
      if (tabKey === "bookings") {
        const st = (item.status || "pending").toLowerCase();
        if (statusFilter === "active") return st === "confirmed";
        if (statusFilter === "draft") return st === "pending";
        if (statusFilter === "finished") return st === "finished";
        return st === statusFilter;
      }
      if (tabKey === "blogs" || tabKey === "testimonials" || tabKey === "seoServices" || tabKey === "seoRoutes" || tabKey === "seoCityPages") {
        return statusFilter === "active" ? item.published !== false : item.published === false;
      }
      if (tabKey === "cabs" || tabKey === "drivers" || tabKey === "packages") {
        const st = (item.status || "active").toLowerCase();
        if (statusFilter === "active") return st === "active";
        if (statusFilter === "draft") return st === "inactive";
        return true;
      }
      return true;
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
  }, [items, query, statusFilter, sortKey, tabKey, tab]);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = filteredItems.slice((listPage - 1) * pageSize, listPage * pageSize);
  const viewingItem = viewingId ? items.find((x) => String(x._id || x.id) === viewingId) : null;

  if (!tab) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-md">
      {!canEdit ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <span className="font-semibold">View only.</span>{" "}
          {tabKey === "seoServices" || tabKey === "seoRoutes"
            ? "Services and Routes can only be created or edited by super admin. Use Admin Login (not Travel Partner)."
            : "Blogs and testimonials can only be edited by super admin. Log in with Admin login, not Travel Partner."}
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
          <p className="mt-1 text-xs text-slate-600">
            Upload a photo — the image path is filled automatically. You must click <strong>Save</strong> below for it to appear on the website.
          </p>
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
            <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800">
              <p>
                Image path: <span className="font-semibold">{uploadedUrl}</span>
              </p>
              <p className="mt-1 text-emerald-700">
                Use path <span className="font-mono">{uploadedUrl.startsWith("/") ? uploadedUrl : `/uploads/...`}</span> — click Save on the cab form to publish on cabzii.in.
              </p>
              <img
                src={resolveMediaUrl(uploadedUrl)}
                alt="Upload preview"
                className="mt-2 h-24 w-auto max-w-full rounded-md border border-emerald-200 bg-white object-contain"
              />
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
        {tabKey === "bookings" ? (
          bookingLoading ? (
            <p className="mt-4 text-sm text-slate-600">Loading booking…</p>
          ) : (
            <AdminBookingEditor form={bookingForm} onChange={setBookingForm} disabled={!canEdit} />
          )
        ) : tab.form === "blog" ? (
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
        ) : tab.form === "seoService" ? (
          <AdminSeoServiceForm form={seoServiceForm} onChange={setSeoServiceForm} />
        ) : tab.form === "seoRoute" ? (
          <AdminSeoRouteForm form={seoRouteForm} onChange={setSeoRouteForm} />
        ) : tab.form === "seoCityPage" ? (
          <AdminSeoCityPageForm form={seoCityPageForm} onChange={setSeoCityPageForm} />
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
              <Field label="Status" hint="Active cabs appear on the website">
                <select
                  className={inputCls()}
                  value={cabForm.status}
                  onChange={(e) => setCabForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="active">Active — show on website</option>
                  <option value="inactive">Inactive — admin only</option>
                </select>
              </Field>
              <Field label="Seats">
                <input type="number" min={1} className={inputCls()} value={cabForm.seats} onChange={(e) => setCabForm((p) => ({ ...p, seats: Number(e.target.value) }))} />
              </Field>
              <Field label="Base price (outstation reference) *" hint="Used when package price is missing">
                <input type="number" min={0} className={inputCls()} value={cabForm.price} onChange={(e) => setCabForm((p) => ({ ...p, price: Number(e.target.value) }))} />
              </Field>
              <Field label="Image path">
                <input
                  className={inputCls()}
                  value={cabForm.image}
                  onChange={(e) => setCabForm((p) => ({ ...p, image: normalizeStoredImagePath(e.target.value) }))}
                  placeholder="/uploads/cab.jpg"
                />
                {cabForm.image ? (
                  <img
                    src={resolveMediaUrl(cabForm.image)}
                    alt="Cab preview"
                    className="mt-2 h-20 w-auto max-w-full rounded-md border border-slate-200 bg-white object-contain"
                  />
                ) : null}
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

            <AdminProductSeoSection form={cabForm} onChange={setCabForm} pathPrefix="/cabs" titleField="title" cityField="city" />

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
                <input
                  className={inputCls()}
                  value={driverForm.image}
                  onChange={(e) => setDriverForm((p) => ({ ...p, image: normalizeStoredImagePath(e.target.value) }))}
                  placeholder="/uploads/driver.jpg"
                />
                {driverForm.image ? (
                  <img
                    src={resolveMediaUrl(driverForm.image)}
                    alt="Driver preview"
                    className="mt-2 h-20 w-auto max-w-full rounded-md border border-slate-200 bg-white object-contain"
                  />
                ) : null}
              </Field>
              <Field label="Status" hint="Active drivers appear on the website">
                <select
                  className={inputCls()}
                  value={driverForm.status}
                  onChange={(e) => setDriverForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="active">Active — show on website</option>
                  <option value="inactive">Inactive — admin only</option>
                </select>
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

            <AdminProductSeoSection form={driverForm} onChange={setDriverForm} pathPrefix="/drivers" titleField="name" cityField="city" />

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
              <Field label="Category">
                <select
                  className={inputCls()}
                  value={tourPackageForm.category || ""}
                  onChange={(e) => setTourPackageForm((p) => ({ ...p, category: e.target.value }))}
                >
                  <option value="">—</option>
                  <option value="pilgrimage">Pilgrimage</option>
                  <option value="beach">Beach</option>
                  <option value="hill">Hill station</option>
                  <option value="heritage">Heritage</option>
                  <option value="honeymoon">Honeymoon</option>
                  <option value="adventure">Adventure</option>
                  <option value="family">Family</option>
                </select>
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
                <input
                  className={inputCls()}
                  value={tourPackageForm.image}
                  onChange={(e) => setTourPackageForm((p) => ({ ...p, image: normalizeStoredImagePath(e.target.value) }))}
                  placeholder="/uploads/package.jpg"
                />
                {tourPackageForm.image ? (
                  <img
                    src={resolveMediaUrl(tourPackageForm.image)}
                    alt="Package preview"
                    className="mt-2 h-20 w-auto max-w-full rounded-md border border-slate-200 bg-white object-contain"
                  />
                ) : null}
              </Field>
              <Field label="Status" hint="Active packages appear on the website">
                <select
                  className={inputCls()}
                  value={tourPackageForm.status}
                  onChange={(e) => setTourPackageForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="active">Active — show on website</option>
                  <option value="inactive">Inactive — admin only</option>
                </select>
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

            <AdminProductSeoSection form={tourPackageForm} onChange={setTourPackageForm} pathPrefix="/holidays" titleField="name" cityField="city" />

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
            {saving
              ? "Saving..."
              : tabKey === "bookings" && bookingForm.status === "confirmed"
                ? "Confirm & send contact"
                : editingId
                  ? "Update"
                  : "Create"}
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
      {(tabKey === "seoServices" || tabKey === "seoRoutes") && items.length > 0 && !items.some((i) => !i.isStatic) ? (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <span className="font-semibold">Built-in pages only.</span> Click <strong>Create</strong> to add new pages, or run{" "}
          <code className="rounded bg-amber-100 px-1">node scripts/seedSeoCms.js</code> on the server once to import all built-in pages as editable rows.
        </div>
      ) : null}
      <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{tab.label}</p>
          {tabKey === "bookings" ? (
            <p className="mt-0.5 text-xs text-slate-600">
              {formatBookingStatsLine({ count: bookingStats.totalCount, total: bookingStats.totalAmount })}
            </p>
          ) : null}
          {catalogBookingSummary ? (
            <p className="mt-0.5 text-xs text-slate-600">
              {formatBookingStatsLine(catalogBookingSummary)} linked to these {tab.label.toLowerCase()}
            </p>
          ) : null}
        </div>
        {canEdit ? (
          <button
            type="button"
            onClick={() => navigateAdmin(`/admin?tab=${tabKey}&mode=create`)}
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
          <option value="draft">{tabKey === "blogs" || tabKey === "testimonials" || tabKey === "seoServices" || tabKey === "seoRoutes" ? "Draft" : "Inactive"}</option>
          {tabKey === "bookings" ? (
            <>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="finished">Finished</option>
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
            const isStatic = Boolean(item.isStatic);
            const isEditing = editingId === id;
            return (
              <tr key={id} className={`border-t border-slate-100 hover:bg-slate-50 ${isEditing ? "bg-sky-50/70" : ""}`}>
                <td className="px-3 py-2">
                  {item.image ? (
                    <img
                      src={resolveMediaUrl(item.image)}
                      alt={itemTitle(item, tabKey)}
                      className="h-10 w-14 rounded object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <p className="font-semibold text-slate-900">{itemTitle(item, tabKey)}</p>
                  {["cabs", "drivers", "packages"].includes(tabKey) ? (
                    <p className="mt-0.5 text-[11px] font-medium text-[#0056D2]">
                      {formatBookingStatsLine(bookingStats.byItem[catalogItemBookingKey(tabKey, item)])}
                    </p>
                  ) : null}
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">{itemSubtitle(item, tabKey)}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                    tabKey === "bookings"
                      ? item.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.status === "finished"
                          ? "bg-sky-100 text-sky-700"
                          : item.status === "cancelled"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                      : tabKey === "cabs" || tabKey === "drivers" || tabKey === "packages"
                        ? item.status === "inactive" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700"
                        : isStatic
                          ? "bg-sky-100 text-sky-800"
                          : item.published === false ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {tabKey === "bookings"
                      ? item.status || "pending"
                      : tabKey === "cabs" || tabKey === "drivers" || tabKey === "packages"
                        ? item.status === "inactive" ? "inactive" : "active"
                        : isStatic
                          ? "built-in"
                          : item.published === false ? "draft" : "active"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => navigateAdmin(`/admin?tab=${tabKey}&mode=view&view=${id}`)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      title="View"
                    >
                      View
                    </button>
                  {!isStatic ? (
                  <button
                    type="button"
                    onClick={() => navigateAdmin(`/admin?tab=${tabKey}&mode=edit&edit=${id}`)}
                    disabled={!canEdit}
                    className="rounded-md border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    title="Edit"
                  >
                    Edit
                  </button>
                  ) : item.publicPath ? (
                    <a
                      href={item.publicPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-sky-300 px-2 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-50"
                    >
                      Live page
                    </a>
                  ) : null}
                  {tabKey !== "bookings" && !isStatic ? (
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
