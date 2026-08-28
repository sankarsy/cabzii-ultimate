"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  bookingFormFromItem,
  bookingFormToPayload,
  buildCatalogListUrl,
  CATALOG_TABS,
  mergeStaticSeoRoutes,
  mergeStaticSeoServices,
  driverFormFromItem,
  driverFormToPayload,
  emptyBlogForm,
  emptyBookingForm,
  emptyDriverForm,
  emptySeoCityPageForm,
  emptySeoRouteForm,
  emptySeoServiceForm,
  emptyTestimonialForm,
  emptyTourPackageForm,
  DRIVER_PACKAGE_FIELDS,
  formatDriverPackageSummary,
  seoCityPageFormFromItem,
  seoCityPageFormToPayload,
  seoRouteFormFromItem,
  seoRouteFormToPayload,
  seoServiceFormFromItem,
  seoServiceFormToPayload,
  tourPackageFormFromItem,
  tourPackageFormToPayload,
  emptyBusTripForm,
  busTripFormFromItem,
  busTripFormToPayload
} from "../../lib/adminCatalogConfig";
import {
  buildBookingStatsMap,
  catalogItemBookingKey,
  formatBookingStatsLine
} from "../../lib/bookingStats";
import { normalizeStoredImagePath, resolveMediaUrl } from "../../lib/media";
import { IMAGE_UPLOAD_RULES } from "../../lib/imageUploadRules";
import imageCompression from "browser-image-compression";
import AdminBookingEditor from "./AdminBookingEditor";
import { AdminSeoCityPageForm, AdminSeoRouteForm, AdminSeoServiceForm } from "./AdminSeoForm";
import { AdminProductSeoSection } from "./AdminProductSeoSection";
import { AdminGalleryField, AdminProductImageField, parseGallery } from "./AdminProductImageField";
import ImageUploadField from "./ImageUploadField";
import FarePackagesEditor from "./FarePackagesEditor";
import AdminPackageExcelToolbar from "./AdminPackageExcelToolbar";
import TourPackageContentEditor from "./TourPackageContentEditor";
import {
  builtInSeoRoutePayloads,
  builtInSeoServicePayloads,
  sampleBusTripPayloads,
  staticRouteToCreatePayload,
  staticServiceToCreatePayload
} from "../../lib/adminSeoImport";

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
  if (tabKey === "buses") return item.operator?.name || item.operator || `${item.fromCity} → ${item.toCity}`;
  return item.title || item.name || item.slug || "Item";
}

function itemSubtitle(item, tabKey) {
  if (tabKey === "blogs") return `${item.slug || "—"} · ${item.published === false ? "Draft" : "Published"}`;
  if (tabKey === "testimonials") {
    const state = item.sampleReview ? "Sample" : item.published === false ? "Pending" : "Published";
    return `${item.location || "—"} · ${item.rating ?? 5}★ · ${state}`;
  }
  if (tabKey === "bookings") {
    const parts = [
      item.type || "cab",
      item.status || "pending",
      item.phone || "",
      item.type === "bus"
        ? [item.busMeta?.operator, item.busMeta?.fromCity && item.busMeta?.toCity ? `${item.busMeta.fromCity} → ${item.busMeta.toCity}` : "", item.busMeta?.seats?.length ? `Seats ${item.busMeta.seats.join(",")}` : ""].filter(Boolean).join(" · ")
        : item.itemTitle || "",
      item.pickup ? `${item.pickup}${item.drop ? ` → ${item.drop}` : ""}` : "",
      `₹${Number(item.amount || 0).toLocaleString("en-IN")}`
    ];
    const contactPhone = item.vendorContact?.phone || item.vendorContact?.whatsapp;
    if (item.status === "confirmed" && contactPhone) {
      parts.push(`Contact: ${contactPhone}`);
    }
    return parts.filter(Boolean).join(" · ");
  }
  if (tabKey === "drivers") return `${item.vendor || "—"} · ${item.city || "No city"} · ${item.location || "No location"} · ${formatDriverPackageSummary(item)}`;
  if (tabKey === "packages") return `${item.vendor || "—"} · ${item.city || "No city"} · ₹${item.price ?? "—"}`;
  if (tabKey === "buses") {
    const op = item.operator?.name || item.operator || "—";
    return `${op} · ${item.fromCity || "—"} → ${item.toCity || "—"} · ₹${item.seaterPrice ?? item.fares?.seater ?? "—"}`;
  }
  if (tabKey === "seoServices") {
    const base = item.publicPath || `/services/${item.slug}/chennai`;
    return item.isStatic
      ? `Built-in · ${base} · Import or Edit to make editable`
      : `${base} · ${item.published === false ? "Draft" : "Published"}${item.showInMenu ? " · Menu" : ""}`;
  }
  if (tabKey === "seoRoutes") {
    const base = item.publicPath || `/routes/${item.slug}`;
    return item.isStatic
      ? `Built-in · ${base} · Import or Edit to save in database`
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
  viewId = "",
  prefillCity = "",
  prefillType = "",
  prefillSlug = ""
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
  const [driverForm, setDriverForm] = useState(emptyDriverForm());
  const [tourPackageForm, setTourPackageForm] = useState(emptyTourPackageForm());
  const [busTripForm, setBusTripForm] = useState(emptyBusTripForm());
  const [bookingForm, setBookingForm] = useState(emptyBookingForm());
  const [seoServiceForm, setSeoServiceForm] = useState(emptySeoServiceForm());
  const [seoRouteForm, setSeoRouteForm] = useState(emptySeoRouteForm());
  const [seoCityPageForm, setSeoCityPageForm] = useState(emptySeoCityPageForm());
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [deletingImagePath, setDeletingImagePath] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortKey, setSortKey] = useState("latest");
  const [listPage, setListPage] = useState(1);
  const [viewingId, setViewingId] = useState("");

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};
  const usesStructuredForm =
    tab?.form === "blog" ||
    tab?.form === "testimonial" ||
    tab?.form === "driver" ||
    tab?.form === "tourPackage" ||
    tab?.form === "busTrip" ||
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
    setDriverForm(emptyDriverForm());
    setTourPackageForm(emptyTourPackageForm());
    setBusTripForm(emptyBusTripForm());
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
      if (tabKey === "seoCityPages" && prefillCity) {
        setSeoCityPageForm({
          ...emptySeoCityPageForm(),
          citySlug: prefillCity,
          pageType: prefillType || "cab-booking"
        });
      }
      if (tabKey === "seoServices" && prefillSlug) {
        setSeoServiceForm({
          ...emptySeoServiceForm(),
          slug: prefillSlug,
          menuCitySlug: prefillCity || "chennai"
        });
      }
      if (tabKey === "seoRoutes" && prefillSlug) {
        const parts = prefillSlug.match(/^([a-z]+)-to-([a-z]+)-cab$/);
        setSeoRouteForm({
          ...emptySeoRouteForm(),
          slug: prefillSlug,
          fromCitySlug: parts?.[1] || "",
          toCitySlug: parts?.[2] || ""
        });
      }
      createModeReady.current = true;
    }
    if (pageMode !== "create") {
      createModeReady.current = false;
    }
  }, [pageMode, resetForm, tabKey, prefillCity, prefillType, prefillSlug]);

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
    if (!["cabs", "drivers", "packages", "buses"].includes(tabKey)) return null;
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
          setErrorMessage("This is a built-in page. Use Import to database, or click Edit on the row to save it first.");
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
  }, [query, statusFilter, typeFilter, sortKey, tabKey]);

  const getPayload = () => {
    if (tab?.form === "blog") return { ...blogForm };
    if (tab?.form === "testimonial") return { ...testimonialForm };
    if (tab?.form === "driver") return driverFormToPayload(driverForm);
    if (tab?.form === "tourPackage") return tourPackageFormToPayload(tourPackageForm);
    if (tab?.form === "busTrip") return busTripFormToPayload(busTripForm);
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
        published: item.published !== false,
        sampleReview: Boolean(item.sampleReview)
      });
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

    if (tab?.form === "busTrip") {
      setBusTripForm(busTripFormFromItem(item));
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
    if (tab?.form === "driver") setDriverForm(driverFormFromItem(tab.sample));
    else if (tab?.form === "tourPackage") setTourPackageForm(tourPackageFormFromItem(tab.sample));
    else if (tab?.form === "busTrip") setBusTripForm(busTripFormFromItem(tab.sample));
    else if (tab?.form === "booking") setBookingForm({ ...emptyBookingForm(), status: "confirmed" });
    else if (tab?.form === "seoService") setSeoServiceForm(seoServiceFormFromItem(tab.sample));
    else if (tab?.form === "seoRoute") setSeoRouteForm(seoRouteFormFromItem(tab.sample));
    else if (tab?.form === "seoCityPage") setSeoCityPageForm(seoCityPageFormFromItem(tab.sample));
    else setFormJson(JSON.stringify(tab.sample, null, 2));
    setErrorMessage("");
  };

  const clearImageOnForm = (setter, path) => {
    const normalized = normalizeStoredImagePath(path) || path;
    setter((prev) => {
      const gallery = parseGallery(prev.gallery).filter((g) => g !== normalized);
      return {
        ...prev,
        image: prev.image === normalized ? "" : prev.image,
        gallery: gallery.join(", ")
      };
    });
  };

  const deleteProductImage = async (imagePath) => {
    const path = normalizeStoredImagePath(imagePath) || String(imagePath || "").trim();
    if (!path) return;
    if (!window.confirm("Remove this image from the product and delete the file from the server?")) return;

    setDeletingImagePath(path);
    setUploadError("");
    try {
      if (path.startsWith("/uploads/")) {
        const res = await fetch("/api/upload", {
          method: "DELETE",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ path })
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Could not delete image file.");
        }
      }

      if (tab?.form === "driver") clearImageOnForm(setDriverForm, path);
      else if (tab?.form === "tourPackage") clearImageOnForm(setTourPackageForm, path);
      else if (tab?.form === "busTrip") {
        /* bus trips have no image field */
      }
      else {
        try {
          const parsed = formJson.trim() ? JSON.parse(formJson) : {};
          if (parsed.image === path) parsed.image = "";
          setFormJson(JSON.stringify(parsed, null, 2));
        } catch {
          /* ignore */
        }
      }

      if (uploadedUrl === path) setUploadedUrl("");
      setStatusMessage("Image deleted. Click Save to update the live product.");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not delete image.");
    } finally {
      setDeletingImagePath("");
    }
  };

  const patchFormImage = (imagePath, fileName) => {
    const path =
      normalizeStoredImagePath(imagePath) ||
      (imagePath?.startsWith("/") ? imagePath : `/uploads/${fileName}`);
    if (tab?.form === "driver") {
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
    if (selectedImage.size > IMAGE_UPLOAD_RULES.maxBytes) {
      setUploadError(`Image is oversized. Maximum original size is ${IMAGE_UPLOAD_RULES.maxMb} MB.`);
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadedUrl("");

    try {
      let file = selectedImage;
      try {
        file = await imageCompression(selectedImage, {
          maxSizeMB: IMAGE_UPLOAD_RULES.compressedMaxMb || 2,
          maxWidthOrHeight: IMAGE_UPLOAD_RULES.maxWidth,
          useWebWorker: true,
          fileType: "image/webp"
        });
      } catch {
        file = selectedImage;
      }
      const formData = new FormData();
      const name = String(file.name || selectedImage.name || "upload").replace(/\.\w+$/, ".webp");
      formData.append("file", file, name);

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
      if (wasEditing && tab?.form === "driver") setDriverForm(driverFormFromItem(data.data));
      else if (wasEditing && tab?.form === "tourPackage") setTourPackageForm(tourPackageFormFromItem(data.data));
      else if (wasEditing && tab?.form === "busTrip") setBusTripForm(busTripFormFromItem(data.data));
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

  const duplicateItem = async (id) => {
    if (!token || !id || !canEdit) return;
    setErrorMessage("");
    const res = await fetch(`${tab.base}/${id}/duplicate`, {
      method: "POST",
      headers: authHeaders
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMessage(data?.message || "Duplicate failed");
      return;
    }
    setStatusMessage("Duplicated as inactive draft — edit and activate when ready.");
    await loadData();
  };

  const importBuiltInPages = async () => {
    if (!token || !canEdit) return;
    setErrorMessage("");
    setStatusMessage("");
    try {
      if (tabKey === "seoServices") {
        const res = await fetch("/api/seo-services/import-static", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ items: builtInSeoServicePayloads() })
        });
        const json = await res.json();
        if (!res.ok || json?.success === false) throw new Error(json?.message || "Import failed");
        setStatusMessage(json.message || `Imported ${json?.data?.upserted || 0} services.`);
      } else if (tabKey === "seoRoutes") {
        const res = await fetch("/api/seo-routes/import-static", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ items: builtInSeoRoutePayloads() })
        });
        const json = await res.json();
        if (!res.ok || json?.success === false) throw new Error(json?.message || "Import failed");
        setStatusMessage(json.message || `Imported ${json?.data?.upserted || 0} routes.`);
      } else if (tabKey === "buses") {
        const res = await fetch("/api/buses/import-sample", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ items: sampleBusTripPayloads() })
        });
        const json = await res.json();
        if (!res.ok || json?.success === false) throw new Error(json?.message || "Import failed");
        setStatusMessage(json.message || `Imported ${json?.data?.created || 0} bus trips.`);
      } else {
        return;
      }
      await loadData();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Import failed");
    }
  };

  const promoteStaticAndEdit = async (item) => {
    if (!token || !canEdit || !item?.isStatic) return;
    setErrorMessage("");
    const payload =
      tabKey === "seoServices"
        ? staticServiceToCreatePayload(item)
        : tabKey === "seoRoutes"
          ? staticRouteToCreatePayload(item)
          : null;
    if (!payload) return;
    const importPath =
      tabKey === "seoServices" ? "/api/seo-services/import-static" : "/api/seo-routes/import-static";
    const res = await fetch(importPath, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ items: [payload] })
    });
    const json = await res.json();
    if (!res.ok || json?.success === false) {
      setErrorMessage(json?.message || "Could not convert built-in page");
      return;
    }
    const id = json?.data?.results?.[0]?.id;
    setStatusMessage("Saved to database — you can edit now.");
    await loadData();
    if (id) navigateAdmin(`/admin?tab=${tabKey}&mode=edit&edit=${id}`);
  };

  const hideStaticPage = async (item) => {
    if (!token || !canEdit || !item?.isStatic) return;
    const ok = window.confirm(
      "Hide this built-in page? It will be saved as a draft in the database and removed from the live site."
    );
    if (!ok) return;
    setErrorMessage("");
    const payload =
      tabKey === "seoServices"
        ? { ...staticServiceToCreatePayload(item), published: false }
        : tabKey === "seoRoutes"
          ? { ...staticRouteToCreatePayload(item), published: false }
          : null;
    if (!payload) return;
    const importPath =
      tabKey === "seoServices" ? "/api/seo-services/import-static" : "/api/seo-routes/import-static";
    const res = await fetch(importPath, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ items: [payload] })
    });
    const json = await res.json();
    if (!res.ok || json?.success === false) {
      setErrorMessage(json?.message || "Could not hide page");
      return;
    }
    setStatusMessage("Page hidden (draft). Edit and publish to restore.");
    await loadData();
  };

  const deleteItem = async (id) => {
    if (!token || !id || tabKey === "bookings" || !canEdit) return;
    if (String(id).startsWith("static:")) return;
    const isSeo = tabKey === "seoServices" || tabKey === "seoRoutes" || tabKey === "seoCityPages";
    const ok = window.confirm(
      isSeo
        ? "Delete this page from the database? Built-in fallback may return unless you keep a draft row."
        : "Delete this item?"
    );
    if (!ok) return;

    setErrorMessage("");
    if (isSeo && (tabKey === "seoServices" || tabKey === "seoRoutes")) {
      // Soft-delete: unpublish so static/synthesized fallback stays blocked.
      const target = items.find((it) => String(it._id || it.id) === String(id));
      if (target) {
        const payload =
          tabKey === "seoServices"
            ? { ...seoServiceFormToPayload(seoServiceFormFromItem(target)), published: false }
            : { ...seoRouteFormToPayload(seoRouteFormFromItem(target)), published: false };
        const soft = await fetch(`${tab.base}/${id}`, {
          method: "PUT",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const softJson = await soft.json();
        if (soft.ok && softJson?.success !== false) {
          setStatusMessage("Page unpublished (hidden from site).");
          await loadData();
          return;
        }
      }
    }

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
    const byType = searched.filter((item) => {
      if (tabKey !== "bookings" || typeFilter === "all") return true;
      return String(item.type || "cab") === typeFilter;
    });
    const byStatus = byType.filter((item) => {
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
      if (tabKey === "cabs" || tabKey === "drivers" || tabKey === "packages" || tabKey === "buses") {
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
  }, [items, query, statusFilter, typeFilter, sortKey, tabKey, tab]);
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
          {tabKey === "seoServices" || tabKey === "seoRoutes" || tabKey === "seoCityPages"
            ? "SEO landing pages can only be created or edited by super admin. Use Admin Login (not Travel Partner). Open Content → Google SEO pages to see every live URL."
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
            Upload a photo up to {IMAGE_UPLOAD_RULES.maxMb} MB — it is compressed automatically. Click <strong>Save</strong> below for it to appear on the website.
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
                Use path <span className="font-mono">{uploadedUrl.startsWith("/") ? uploadedUrl : `/uploads/...`}</span> — click Save on the form below to publish on cabzii.in.
              </p>
              <img
                src={resolveMediaUrl(uploadedUrl)}
                alt="Upload preview"
                className="mt-2 h-24 w-auto max-w-full rounded-md border border-emerald-200 bg-white object-contain"
              />
              <button
                type="button"
                disabled={!canEdit || deletingImagePath === uploadedUrl}
                onClick={() => deleteProductImage(uploadedUrl)}
                className="mt-2 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              >
                {deletingImagePath === uploadedUrl ? "Deleting…" : "Delete uploaded image"}
              </button>
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
          <AdminSeoServiceForm form={seoServiceForm} onChange={setSeoServiceForm} authToken={token} />
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
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={testimonialForm.published} onChange={(e) => setTestimonialForm((p) => ({ ...p, published: e.target.checked }))} />
              Published (visible on website)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={Boolean(testimonialForm.sampleReview)} onChange={(e) => setTestimonialForm((p) => ({ ...p, sampleReview: e.target.checked }))} />
              Sample — never show on the public site
            </label>
          </div>
        ) : tab.form === "driver" ? (
          <div className="mt-3 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Product name *">
                <input className={inputCls()} value={driverForm.name} onChange={(e) => setDriverForm((p) => ({ ...p, name: e.target.value }))} placeholder="Rajesh — Acting Driver Chennai" />
              </Field>
              <Field label="Driver mobile *">
                <input
                  className={inputCls()}
                  inputMode="numeric"
                  maxLength={10}
                  value={driverForm.phone}
                  onChange={(e) => setDriverForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="10-digit mobile (driver's own number)"
                />
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
              <div className="sm:col-span-2">
                <AdminProductImageField
                  label="Product image"
                  hint="Upload a photo or paste /uploads/ path — click Save to publish"
                  value={driverForm.image}
                  onChange={(v) => setDriverForm((p) => ({ ...p, image: normalizeStoredImagePath(v) }))}
                  onDelete={() => deleteProductImage(driverForm.image)}
                  deleting={deletingImagePath === driverForm.image}
                  disabled={!canEdit}
                  authToken={token}
                  alt={driverForm.name || "Driver preview"}
                />
              </div>
              <Field label="Status" hint="Inactive drivers cannot be assigned to new bookings">
                <select
                  className={inputCls()}
                  value={driverForm.status}
                  onChange={(e) => setDriverForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="active">Active — can be assigned</option>
                  <option value="inactive">Inactive — do not assign</option>
                </select>
              </Field>
              <Field label="City">
                <input className={inputCls()} value={driverForm.city} onChange={(e) => setDriverForm((p) => ({ ...p, city: e.target.value }))} placeholder="Bengaluru" />
              </Field>
              <Field label="Location">
                <input className={inputCls()} value={driverForm.location} onChange={(e) => setDriverForm((p) => ({ ...p, location: e.target.value }))} placeholder="Koramangala, Whitefield, etc." />
              </Field>
              <Field label="Service areas">
                <input className={inputCls()} value={driverForm.serviceAreas || ""} onChange={(e) => setDriverForm((p) => ({ ...p, serviceAreas: e.target.value }))} placeholder="Chennai, ECR, OMR" />
              </Field>
              <Field label="Availability">
                <select className={inputCls()} value={driverForm.availabilityStatus || "available"} onChange={(e) => setDriverForm((p) => ({ ...p, availabilityStatus: e.target.value }))}>
                  <option value="available">Available</option>
                  <option value="assigned">Assigned</option>
                  <option value="on_trip">On Trip</option>
                  <option value="offline">Offline</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
              <Field label="Licence number">
                <input className={inputCls()} value={driverForm.licenseNumber || ""} onChange={(e) => setDriverForm((p) => ({ ...p, licenseNumber: e.target.value }))} />
              </Field>
              <Field label="Licence expiry">
                <input className={inputCls()} value={driverForm.licenseExpiry || ""} onChange={(e) => setDriverForm((p) => ({ ...p, licenseExpiry: e.target.value }))} placeholder="YYYY-MM-DD" />
              </Field>
              <div className="sm:col-span-2">
                <AdminGalleryField
                  label="Gallery images (max 3)"
                  hint="Upload photos or paste comma-separated /uploads/ paths"
                  value={driverForm.gallery}
                  onChange={(v) => setDriverForm((p) => ({ ...p, gallery: v }))}
                  onRemoveImage={(path) => deleteProductImage(path)}
                  removingPath={deletingImagePath}
                  disabled={!canEdit}
                  authToken={token}
                />
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

            <AdminProductSeoSection form={driverForm} onChange={setDriverForm} pathPrefix="/drivers" titleField="name" cityField="city" authToken={token} />

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
              <Field label="Product name *">
                <input className={inputCls()} value={tourPackageForm.name} onChange={(e) => setTourPackageForm((p) => ({ ...p, name: e.target.value }))} placeholder="Madurai Rameswaram 2D Tour" />
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
              <Field label="Duration">
                <input className={inputCls()} value={tourPackageForm.duration} onChange={(e) => setTourPackageForm((p) => ({ ...p, duration: e.target.value }))} placeholder="2 Days" />
              </Field>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-700">Pricing & vehicles</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                <strong>Package price</strong> is the public fare shown on cards, booking, and SEO. Discounts are disabled for all packages.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Package price ₹ *" hint="Selling price shown on site & in Google (no auto discount)">
                  <input type="number" min={0} className={inputCls()} value={tourPackageForm.price} onChange={(e) => setTourPackageForm((p) => ({ ...p, price: Number(e.target.value) }))} />
                </Field>
                <Field label="Included pickup hub" hint="Round-trip transport from this city is bundled in price">
                  <input className={inputCls()} value={tourPackageForm.pricingOriginCity || "Chennai"} onChange={(e) => setTourPackageForm((p) => ({ ...p, pricingOriginCity: e.target.value }))} placeholder="Chennai" />
                </Field>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Destination city" hint="Transport route ends here — e.g. Tirupati">
                  <input className={inputCls()} value={tourPackageForm.city} onChange={(e) => setTourPackageForm((p) => ({ ...p, city: e.target.value }))} placeholder="Tirupati" />
                </Field>
                <Field label="Meeting point / location" hint="Optional landmark shown on package card">
                  <input className={inputCls()} value={tourPackageForm.location} onChange={(e) => setTourPackageForm((p) => ({ ...p, location: e.target.value }))} placeholder="Tirumala foothills" />
                </Field>
                <div className="sm:col-span-2">
                  <Field
                    label="Cab types (JSON)"
                    hint='Vehicle options & fare multipliers — e.g. [{"id":"sedan","label":"Sedan","seats":4,"multiplier":1}]'
                  >
                    <textarea
                      rows={6}
                      className={`${inputCls()} font-mono text-xs`}
                      value={tourPackageForm.cabTypes || ""}
                      onChange={(e) => setTourPackageForm((p) => ({ ...p, cabTypes: e.target.value }))}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <AdminProductImageField
                  label="Product image"
                  hint="Choose a tour photo here — then click Save"
                  value={tourPackageForm.image}
                  onChange={(v) => setTourPackageForm((p) => ({ ...p, image: normalizeStoredImagePath(v) }))}
                  onDelete={() => deleteProductImage(tourPackageForm.image)}
                  deleting={deletingImagePath === tourPackageForm.image}
                  disabled={!canEdit}
                  authToken={token}
                  alt={tourPackageForm.name || tourPackageForm.title || "Package preview"}
                />
              </div>
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
              <div className="sm:col-span-2">
                <AdminGalleryField
                  label="Gallery images (max 3)"
                  hint="Upload extra tour photos (max 3). Click Save after upload."
                  value={tourPackageForm.gallery}
                  onChange={(v) => setTourPackageForm((p) => ({ ...p, gallery: v }))}
                  onRemoveImage={(path) => deleteProductImage(path)}
                  removingPath={deletingImagePath}
                  disabled={!canEdit}
                  authToken={token}
                />
              </div>
              <div className="sm:col-span-2">
                <Field label="Tags" hint="Comma-separated, e.g. Family, Outstation">
                  <input className={inputCls()} value={tourPackageForm.tags} onChange={(e) => setTourPackageForm((p) => ({ ...p, tags: e.target.value }))} />
                </Field>
              </div>
            </div>

            <TourPackageContentEditor
              form={tourPackageForm}
              onChange={setTourPackageForm}
              disabled={!canEdit}
            />

            <AdminProductSeoSection form={tourPackageForm} onChange={setTourPackageForm} pathPrefix="/tour-packages" titleField="name" cityField="city" authToken={token} />

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
        ) : tab.form === "busTrip" ? (
          <div className="mt-3 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Operator *">
                <input className={inputCls()} value={busTripForm.operator} onChange={(e) => setBusTripForm((p) => ({ ...p, operator: e.target.value }))} placeholder="Orange Travels" />
              </Field>
              <Field label="Operator code">
                <input className={inputCls()} value={busTripForm.operatorCode} onChange={(e) => setBusTripForm((p) => ({ ...p, operatorCode: e.target.value }))} placeholder="OT" />
              </Field>
              <Field label="Vendor">
                <input className={inputCls()} value={busTripForm.vendor} onChange={(e) => setBusTripForm((p) => ({ ...p, vendor: e.target.value }))} placeholder="Cabzii Partner" />
              </Field>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Operator logo"
                  value={busTripForm.operatorLogo}
                  onChange={(url) => setBusTripForm((p) => ({ ...p, operatorLogo: url }))}
                  authToken={token}
                  alt={busTripForm.operator || "Bus operator"}
                />
              </div>
              <Field label="From city *">
                <input className={inputCls()} value={busTripForm.fromCity} onChange={(e) => setBusTripForm((p) => ({ ...p, fromCity: e.target.value }))} placeholder="Chennai" />
              </Field>
              <Field label="To city *">
                <input className={inputCls()} value={busTripForm.toCity} onChange={(e) => setBusTripForm((p) => ({ ...p, toCity: e.target.value }))} />
              </Field>
              <Field label="Departure time">
                <input className={inputCls()} value={busTripForm.departureTime} onChange={(e) => setBusTripForm((p) => ({ ...p, departureTime: e.target.value }))} placeholder="22:00" />
              </Field>
              <Field label="Arrival time">
                <input className={inputCls()} value={busTripForm.arrivalTime} onChange={(e) => setBusTripForm((p) => ({ ...p, arrivalTime: e.target.value }))} placeholder="06:00" />
              </Field>
              <Field label="Duration">
                <input className={inputCls()} value={busTripForm.duration} onChange={(e) => setBusTripForm((p) => ({ ...p, duration: e.target.value }))} placeholder="8h" />
              </Field>
              <Field label="Duration (minutes)">
                <input type="number" min={0} className={inputCls()} value={busTripForm.durationMin} onChange={(e) => setBusTripForm((p) => ({ ...p, durationMin: Number(e.target.value) }))} />
              </Field>
              <Field label="Rating">
                <input type="number" min={0} max={5} step={0.1} className={inputCls()} value={busTripForm.rating} onChange={(e) => setBusTripForm((p) => ({ ...p, rating: Number(e.target.value) }))} />
              </Field>
              <Field label="Review count">
                <input type="number" min={0} className={inputCls()} value={busTripForm.reviewCount} onChange={(e) => setBusTripForm((p) => ({ ...p, reviewCount: Number(e.target.value) }))} />
              </Field>
              <Field label="Bus type">
                <select className={inputCls()} value={busTripForm.busType} onChange={(e) => setBusTripForm((p) => ({ ...p, busType: e.target.value }))}>
                  {["AC Seater", "AC Sleeper", "Volvo AC Sleeper", "Non-AC Seater"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Seater price (₹) *">
                <input type="number" min={0} className={inputCls()} value={busTripForm.seaterPrice} onChange={(e) => setBusTripForm((p) => ({ ...p, seaterPrice: Number(e.target.value) }))} />
              </Field>
              <Field label="Sleeper price (₹)">
                <input type="number" min={0} className={inputCls()} value={busTripForm.sleeperPrice} onChange={(e) => setBusTripForm((p) => ({ ...p, sleeperPrice: Number(e.target.value) }))} />
              </Field>
              <Field label="Lower berth (₹)">
                <input type="number" min={0} className={inputCls()} value={busTripForm.lowerBerthPrice} onChange={(e) => setBusTripForm((p) => ({ ...p, lowerBerthPrice: Number(e.target.value) }))} />
              </Field>
              <Field label="Upper berth (₹)">
                <input type="number" min={0} className={inputCls()} value={busTripForm.upperBerthPrice} onChange={(e) => setBusTripForm((p) => ({ ...p, upperBerthPrice: Number(e.target.value) }))} />
              </Field>
              <Field label="Status">
                <select className={inputCls()} value={busTripForm.status} onChange={(e) => setBusTripForm((p) => ({ ...p, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
              <Field label="Booked / sold seats" hint="Leave empty for sample sold seats. Type none to open every seat. Or list IDs: L1A, U2C">
                <input className={inputCls()} value={busTripForm.bookedSeats} onChange={(e) => setBusTripForm((p) => ({ ...p, bookedSeats: e.target.value }))} placeholder="none  or  L1A, L1B, U2C" />
              </Field>
              <Field label="Trip guarantee (₹ / passenger)">
                <input type="number" min={0} className={inputCls()} value={busTripForm.tripGuaranteePrice} onChange={(e) => setBusTripForm((p) => ({ ...p, tripGuaranteePrice: Number(e.target.value) }))} />
              </Field>
              <Field label="Distance (km)">
                <input type="number" min={0} className={inputCls()} value={busTripForm.distanceKm} onChange={(e) => setBusTripForm((p) => ({ ...p, distanceKm: Number(e.target.value) }))} />
              </Field>
              <Field label="On-time %">
                <input type="number" min={0} max={100} className={inputCls()} value={busTripForm.onTimePercent} onChange={(e) => setBusTripForm((p) => ({ ...p, onTimePercent: Number(e.target.value) }))} />
              </Field>
              <Field label="Live tracking">
                <select className={inputCls()} value={busTripForm.liveTrackingEnabled ? "on" : "off"} onChange={(e) => setBusTripForm((p) => ({ ...p, liveTrackingEnabled: e.target.value === "on" }))}>
                  <option value="on">On — show map on booking</option>
                  <option value="off">Off</option>
                </select>
              </Field>
              <Field label="GPS latitude">
                <input className={inputCls()} value={busTripForm.liveLat} onChange={(e) => setBusTripForm((p) => ({ ...p, liveLat: e.target.value }))} placeholder="13.0827" />
              </Field>
              <Field label="GPS longitude">
                <input className={inputCls()} value={busTripForm.liveLng} onChange={(e) => setBusTripForm((p) => ({ ...p, liveLng: e.target.value }))} placeholder="80.2707" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Cancellation policy" hint="One rule per line: hours_before | refund_percent  e.g. 8 | 85">
                  <textarea rows={3} className={inputCls()} value={busTripForm.cancellationPolicyText} onChange={(e) => setBusTripForm((p) => ({ ...p, cancellationPolicyText: e.target.value }))} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Rest stops" hint="One per line: Name | Time | Minutes | Feature, Feature">
                  <textarea rows={2} className={inputCls()} value={busTripForm.restStopsText} onChange={(e) => setBusTripForm((p) => ({ ...p, restStopsText: e.target.value }))} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Bus route stops" hint="Chennai → Villupuram → Salem → Coimbatore">
                  <input className={inputCls()} value={busTripForm.routeStopsText} onChange={(e) => setBusTripForm((p) => ({ ...p, routeStopsText: e.target.value }))} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Luggage policy">
                  <input className={inputCls()} value={busTripForm.policyLuggage} onChange={(e) => setBusTripForm((p) => ({ ...p, policyLuggage: e.target.value }))} />
                </Field>
              </div>
              <Field label="Pets policy">
                <input className={inputCls()} value={busTripForm.policyPets} onChange={(e) => setBusTripForm((p) => ({ ...p, policyPets: e.target.value }))} />
              </Field>
              <Field label="Liquor policy">
                <input className={inputCls()} value={busTripForm.policyLiquor} onChange={(e) => setBusTripForm((p) => ({ ...p, policyLiquor: e.target.value }))} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Pickup time policy">
                  <input className={inputCls()} value={busTripForm.policyPickup} onChange={(e) => setBusTripForm((p) => ({ ...p, policyPickup: e.target.value }))} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Boarding points" hint="One per line: Name | Time | Landmark">
                  <textarea rows={3} className={inputCls()} value={busTripForm.boardingPointsText} onChange={(e) => setBusTripForm((p) => ({ ...p, boardingPointsText: e.target.value }))} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Dropping points" hint="One per line: Name | Time | Landmark">
                  <textarea rows={3} className={inputCls()} value={busTripForm.droppingPointsText} onChange={(e) => setBusTripForm((p) => ({ ...p, droppingPointsText: e.target.value }))} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Amenities" hint="Comma-separated">
                  <input className={inputCls()} value={busTripForm.amenities} onChange={(e) => setBusTripForm((p) => ({ ...p, amenities: e.target.value }))} />
                </Field>
              </div>
            </div>
            <AdminProductSeoSection form={busTripForm} onChange={setBusTripForm} pathPrefix="/buses" titleField="operator" cityField="fromCity" productNameLabel="Operator" hideProductName enterprise authToken={token} />
            {tab.sample ? (
              <button type="button" onClick={insertSample} disabled={!canEdit} className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">
                Load sample bus
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
      <AdminPackageExcelToolbar
        tabKey={tabKey}
        items={items}
        token={token}
        canEdit={canEdit}
        onImported={loadData}
      />
      {(tabKey === "seoServices" || tabKey === "seoRoutes") && items.some((i) => i.isStatic) ? (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <span className="font-semibold">Built-in pages still listed.</span> Click{" "}
          <strong>Import to database</strong> to make all of them editable, or <strong>Edit</strong> on one row to save that page first.
        </div>
      ) : null}
      {tabKey === "seoCityPages" && canEdit ? (
        <div className="mb-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-950">
          <p className="font-semibold">These are the city pages Google ranks — not the Cabs catalog.</p>
          <p className="mt-1">
            Click <strong>Create</strong>, choose <em>Cab booking city</em>, city slug <code>chennai</code>. That publishes{" "}
            <a className="font-semibold underline" href="/cab-booking/chennai" target="_blank" rel="noreferrer">
              /cab-booking/chennai
            </a>
            . For a Dzire Tour S product page, use Catalog → Cabs instead.
          </p>
        </div>
      ) : null}
      {tabKey === "buses" && canEdit ? (
        <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-900">
          All bus trips live in the database and are fully editable. Set status Active to sell a bus. For seats, leave Booked seats empty for a sample sold map, type none to open every seat, or list IDs such as L1A, U2C. GPS lat/lng powers Live tracking. Customer tickets are under{" "}
          <button type="button" className="font-bold underline" onClick={() => navigateAdmin("/admin?tab=bookings")}>
            Bookings → Bus
          </button>
          .
        </div>
      ) : null}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
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
          <div className="flex flex-wrap gap-2">
            {(tabKey === "seoServices" || tabKey === "seoRoutes") && items.some((i) => i.isStatic) ? (
              <button
                type="button"
                onClick={importBuiltInPages}
                className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                Import to database
              </button>
            ) : null}
            {tabKey === "buses" ? (
              <button
                type="button"
                onClick={importBuiltInPages}
                className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                Import sample buses
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => navigateAdmin(`/admin?tab=${tabKey}&mode=create`)}
              className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
            >
              Create {singularLabel}
            </button>
          </div>
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
        {tabKey === "bookings" ? (
          <select className={inputCls()} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All types</option>
            <option value="cab">Cab</option>
            <option value="bus">Bus</option>
            <option value="driver">Driver</option>
            <option value="tour">Holiday</option>
          </select>
        ) : null}
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
                  {["cabs", "drivers", "packages", "buses"].includes(tabKey) ? (
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
                      : tabKey === "cabs" || tabKey === "drivers" || tabKey === "packages" || tabKey === "buses"
                        ? item.status === "inactive" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700"
                        : isStatic
                          ? "bg-sky-100 text-sky-800"
                          : item.published === false ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {tabKey === "bookings"
                      ? item.status || "pending"
                      : tabKey === "cabs" || tabKey === "drivers" || tabKey === "packages" || tabKey === "buses"
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
                  ) : (tabKey === "seoServices" || tabKey === "seoRoutes") && canEdit ? (
                    <button
                      type="button"
                      onClick={() => promoteStaticAndEdit(item)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      title="Save to database and edit"
                    >
                      Edit
                    </button>
                  ) : null}
                  {item.publicPath ? (
                    <a
                      href={item.publicPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-sky-300 px-2 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-50"
                    >
                      Live
                    </a>
                  ) : null}
                  {(tabKey === "packages" || tabKey === "buses") && !isStatic ? (
                    <button
                      type="button"
                      onClick={() => duplicateItem(id)}
                      disabled={!canEdit}
                      className="rounded-md border border-violet-300 px-2 py-1 text-[11px] font-semibold text-violet-700 hover:bg-violet-50 disabled:opacity-50"
                      title="Duplicate as inactive draft"
                    >
                      Duplicate
                    </button>
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
                  {isStatic && (tabKey === "seoServices" || tabKey === "seoRoutes") && canEdit ? (
                    <button
                      type="button"
                      onClick={() => hideStaticPage(item)}
                      className="rounded-md border border-rose-300 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
                      title="Hide built-in page (save as draft)"
                    >
                      Hide
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
