"use client";

import { resolveMediaUrl, normalizeStoredImagePath } from "../../lib/media";
import ImageUploadField from "./ImageUploadField";

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

function Field({ label, children, hint }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}

function parseGallery(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

/**
 * Product image field with file upload, preview and delete.
 */
export function AdminProductImageField({
  label = "Product image",
  hint = "Choose a photo — it is compressed automatically. Then click Save on the form.",
  value,
  onChange,
  onDelete,
  deleting = false,
  disabled = false,
  alt = "Product preview",
  authToken = ""
}) {
  return (
    <div className="space-y-2">
      <ImageUploadField
        label={label}
        hint={hint}
        value={value || ""}
        onChange={(path) => onChange(normalizeStoredImagePath(path) || path)}
        disabled={disabled}
        authToken={authToken}
        alt={alt}
      />
      {value ? (
        <button
          type="button"
          disabled={disabled || deleting}
          onClick={onDelete}
          className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete image from server"}
        </button>
      ) : null}
    </div>
  );
}

/** Gallery paths with upload + per-image remove. */
export function AdminGalleryField({
  label = "Gallery (max 3)",
  hint,
  value,
  onChange,
  onRemoveImage,
  removingPath = "",
  disabled = false,
  authToken = ""
}) {
  const items = parseGallery(value);

  const addPath = (path) => {
    const next = normalizeStoredImagePath(path);
    if (!next || items.includes(next) || items.length >= 3) {
      onChange(items.join(", "));
      return;
    }
    onChange([...items, next].join(", "));
  };

  return (
    <div className="space-y-2">
      <ImageUploadField
        label={label}
        hint={hint || "Upload a gallery photo (max 3). Click Save on the form after upload."}
        value=""
        onChange={addPath}
        disabled={disabled || items.length >= 3}
        authToken={authToken}
        alt="Gallery"
      />
      <Field label="Gallery paths">
        <input
          className={inputCls()}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/a.jpg, /uploads/b.jpg"
          disabled={disabled}
        />
      </Field>
      {items.length ? (
        <ul className="flex flex-wrap gap-2">
          {items.map((path) => (
            <li key={path} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1.5">
              <img src={resolveMediaUrl(path)} alt="" className="h-12 w-16 rounded object-cover" />
              <code className="max-w-[120px] truncate text-[10px] text-slate-600">{path}</code>
              <button
                type="button"
                disabled={disabled || removingPath === path}
                onClick={() => onRemoveImage(path)}
                className="rounded-md px-2 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              >
                {removingPath === path ? "…" : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export { parseGallery };
