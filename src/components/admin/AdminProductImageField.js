"use client";

import { resolveMediaUrl } from "../../lib/media";

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
 * Product image field with preview and delete (clears form + optional server file delete).
 */
export function AdminProductImageField({
  label = "Product image",
  hint,
  value,
  onChange,
  onDelete,
  deleting = false,
  disabled = false,
  alt = "Product preview"
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        className={inputCls()}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/uploads/product.jpg"
        disabled={disabled}
      />
      {value ? (
        <div className="mt-2 flex flex-wrap items-start gap-3">
          <img
            src={resolveMediaUrl(value)}
            alt={alt}
            className="h-28 w-auto max-w-full rounded-md border border-slate-200 bg-white object-contain"
          />
          <button
            type="button"
            disabled={disabled || deleting}
            onClick={onDelete}
            className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete image"}
          </button>
        </div>
      ) : null}
    </Field>
  );
}

/** Gallery paths with per-image remove buttons. */
export function AdminGalleryField({
  label = "Gallery (max 3)",
  hint,
  value,
  onChange,
  onRemoveImage,
  removingPath = "",
  disabled = false
}) {
  const items = parseGallery(value);

  return (
    <Field label={label} hint={hint}>
      <input
        className={inputCls()}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/uploads/a.jpg, /uploads/b.jpg"
        disabled={disabled}
      />
      {items.length ? (
        <ul className="mt-2 flex flex-wrap gap-2">
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
    </Field>
  );
}

export { parseGallery };
