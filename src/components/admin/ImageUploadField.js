"use client";

import { useState } from "react";
import { normalizeStoredImagePath, resolveMediaUrl } from "../../lib/media";

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

/** Upload or paste an image path — used for homepage categories & SEO service covers. */
export default function ImageUploadField({
  label = "Image",
  hint = "Upload a photo or paste /uploads/… path",
  value = "",
  onChange,
  disabled = false,
  authToken = "",
  alt = "Preview"
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file) => {
    if (!file || !authToken) {
      setError(!authToken ? "Login required to upload." : "Choose a file.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { authorization: `Bearer ${authToken}` },
        body: formData
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Upload failed");
      const path = normalizeStoredImagePath(json?.data?.url || json?.data?.path || json?.url || "");
      if (!path) throw new Error("Upload returned no path");
      onChange(path);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      {hint ? <span className="mt-0.5 block font-normal text-slate-500">{hint}</span> : null}
      <div className="mt-1 space-y-2">
        <input
          className={inputCls()}
          value={value || ""}
          disabled={disabled}
          onChange={(e) => onChange(normalizeStoredImagePath(e.target.value) || e.target.value)}
          placeholder="/uploads/cover.jpg"
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept="image/*"
            disabled={disabled || uploading || !authToken}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = "";
            }}
            className="block max-w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-sky-50 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-sky-800"
          />
          {value ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange("")}
              className="rounded-md border border-rose-200 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
            >
              Clear
            </button>
          ) : null}
          {uploading ? <span className="text-[11px] text-slate-500">Uploading…</span> : null}
        </div>
        {error ? <p className="text-[11px] text-rose-600">{error}</p> : null}
        {value ? (
          <img
            src={resolveMediaUrl(value)}
            alt={alt}
            className="h-24 w-40 rounded-lg border border-slate-200 object-cover"
          />
        ) : null}
      </div>
    </label>
  );
}
