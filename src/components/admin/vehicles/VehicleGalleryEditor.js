"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import { resolveMediaUrl } from "../../../lib/media";

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

export default function VehicleGalleryEditor({ images = [], onChange, disabled }) {
  const [dragIndex, setDragIndex] = useState(null);

  const update = (index, patch) => {
    onChange(images.map((img, i) => (i === index ? { ...img, ...patch } : img)));
  };

  const remove = (index) => onChange(images.filter((_, i) => i !== index));

  const setCover = (index) => {
    onChange(images.map((img, i) => ({ ...img, type: i === index ? "cover" : img.type === "cover" ? "gallery" : img.type })));
  };

  const onDragStart = (index) => setDragIndex(index);
  const onDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex == null || dragIndex === index) return;
    const next = [...images];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setDragIndex(index);
    onChange(next.map((img, i) => ({ ...img, sortOrder: i })));
  };
  const onDragEnd = () => setDragIndex(null);

  const add = () => onChange([...images, { url: "", type: "gallery", alt: "", sortOrder: images.length }]);

  return (
    <div className="space-y-4">
      <button type="button" disabled={disabled} onClick={add} className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white">
        + Add image URL
      </button>
      <div className="grid gap-3">
        {images.map((img, i) => (
          <div
            key={`img-${i}`}
            draggable={!disabled}
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDragEnd={onDragEnd}
            className={`flex gap-3 rounded-xl border bg-white p-3 transition ${dragIndex === i ? "border-sky-400 shadow-md" : "border-slate-200"}`}
          >
            <div className="flex cursor-grab items-center text-slate-400 active:cursor-grabbing">
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <Field label="Image URL">
                <input className={inputCls()} disabled={disabled} value={img.url || ""} onChange={(e) => update(i, { url: e.target.value })} />
              </Field>
              {img.url ? (
                <img loading="lazy" src={resolveMediaUrl(img.url)} alt={img.alt || ""} className="h-28 w-full max-w-xs rounded-lg border object-cover" />
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={disabled} onClick={() => setCover(i)} className="rounded border px-2 py-1 text-xs">
                  {img.type === "cover" ? "Cover ✓" : "Set cover"}
                </button>
                <button type="button" disabled={disabled} onClick={() => remove(i)} className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">Drag rows to reorder. First cover image is used on cards and detail page.</p>
    </div>
  );
}
