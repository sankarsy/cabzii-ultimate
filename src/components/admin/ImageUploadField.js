"use client";

import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { normalizeStoredImagePath, resolveMediaUrl } from "../../lib/media";
import { IMAGE_UPLOAD_RULES, formatBytesAsMb, validateImageFile } from "../../lib/imageUploadRules";

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

export function ImageUploadRequirements({ maxGallery }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
      <p className="font-semibold text-slate-800">Vehicle images</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-4">
        <li>Recommended: {IMAGE_UPLOAD_RULES.recommendedWidth} × {IMAGE_UPLOAD_RULES.recommendedHeight} px</li>
        <li>Minimum: {IMAGE_UPLOAD_RULES.minWidth} × {IMAGE_UPLOAD_RULES.minHeight} px</li>
        <li>Format: {IMAGE_UPLOAD_RULES.formatsLabel} (recommended: WebP)</li>
        <li>Maximum file size: {IMAGE_UPLOAD_RULES.maxMb} MB per image</li>
        {maxGallery ? <li>Maximum gallery: {maxGallery} images</li> : null}
      </ul>
      <p className="mt-1.5">Use clear real vehicle photos. Avoid screenshots, blurry, watermarked, or duplicate images.</p>
    </div>
  );
}

async function compressForUpload(file) {
  try {
    return await imageCompression(file, {
      maxSizeMB: IMAGE_UPLOAD_RULES.maxMb,
      maxWidthOrHeight: IMAGE_UPLOAD_RULES.maxWidth,
      useWebWorker: true,
      fileType: "image/webp"
    });
  } catch {
    return file;
  }
}

/** Upload or paste an image path — used for homepage categories, SEO covers, and vehicle gallery. */
export default function ImageUploadField({
  label = "Image",
  hint = "",
  value = "",
  onChange,
  disabled = false,
  authToken = "",
  alt = "Preview",
  showRequirements = false,
  maxGallery
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [staged, setStaged] = useState(null);

  useEffect(() => {
    return () => {
      if (staged?.preview) URL.revokeObjectURL(staged.preview);
    };
  }, [staged]);

  const clearStaged = () => {
    if (staged?.preview) URL.revokeObjectURL(staged.preview);
    setStaged(null);
  };

  const stageFile = async (file) => {
    if (!file) return;
    setError("");
    const checked = await validateImageFile(file);
    if (!checked.ok) {
      setError(checked.message);
      return;
    }
    if (staged?.preview) URL.revokeObjectURL(staged.preview);
    setStaged({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      width: checked.width,
      height: checked.height
    });
  };

  const upload = async () => {
    if (!staged?.file || !authToken) {
      setError(!authToken ? "Login required to upload." : "Choose a file.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const compressed = await compressForUpload(staged.file);
      const formData = new FormData();
      const name = String(compressed.name || staged.name || "vehicle").replace(/\.\w+$/, ".webp");
      formData.append("file", compressed, name);
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
      clearStaged();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="block text-xs font-semibold text-slate-600">
      {label}
      {showRequirements ? <div className="mt-1 mb-2 font-normal"><ImageUploadRequirements maxGallery={maxGallery} /></div> : null}
      {hint ? <span className="mt-0.5 block font-normal text-slate-500">{hint}</span> : null}
      <div className="mt-1 space-y-2">
        <input
          className={inputCls()}
          value={value || ""}
          disabled={disabled}
          onChange={(e) => onChange(normalizeStoredImagePath(e.target.value) || e.target.value)}
          placeholder="/uploads/cover.webp"
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept={IMAGE_UPLOAD_RULES.acceptAttr}
            disabled={disabled || uploading || !authToken}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void stageFile(file);
              e.target.value = "";
            }}
            className="block max-w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-sky-50 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-sky-800"
          />
          {value ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                onChange("");
                clearStaged();
              }}
              className="rounded-md border border-rose-200 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
            >
              Remove
            </button>
          ) : null}
          {uploading ? <span className="text-[11px] text-slate-500">Uploading…</span> : null}
        </div>
        {staged ? (
          <div className="flex flex-wrap items-start gap-3 rounded-lg border border-slate-200 bg-white p-2">
            <img src={staged.preview} alt="Selected file preview" width={160} height={100} className="h-20 w-32 rounded object-cover" />
            <div className="min-w-0 flex-1 text-[11px] font-normal text-slate-600">
              <p className="truncate font-semibold text-slate-800">{staged.name}</p>
              <p>
                {formatBytesAsMb(staged.size)}
                {staged.width ? ` · ${staged.width} × ${staged.height} px` : ""}
              </p>
              <div className="mt-1.5 flex gap-2">
                <button
                  type="button"
                  disabled={disabled || uploading || !authToken}
                  onClick={() => void upload()}
                  className="rounded-md bg-sky-600 px-2 py-1 text-[11px] font-semibold text-white disabled:opacity-50"
                >
                  Upload
                </button>
                <button
                  type="button"
                  disabled={disabled || uploading}
                  onClick={clearStaged}
                  className="rounded-md border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {error ? <p className="text-[11px] text-rose-600">{error}</p> : null}
        {value ? (
          <img
            src={resolveMediaUrl(value)}
            alt={alt}
            width={160}
            height={100}
            className="h-24 w-40 rounded-lg border border-slate-200 object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}
