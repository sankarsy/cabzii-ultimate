"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import ImageUploadField, { ImageUploadRequirements } from "../ImageUploadField";
import { IMAGE_UPLOAD_RULES } from "../../../lib/imageUploadRules";

export default function VehicleGalleryEditor({ images = [], onChange, disabled, authToken = "" }) {
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

  const add = () => {
    if (images.length >= IMAGE_UPLOAD_RULES.maxGallery) return;
    onChange([...images, { url: "", type: images.length ? "gallery" : "cover", alt: "", sortOrder: images.length }]);
  };

  return (
    <div className="space-y-4">
      <ImageUploadRequirements maxGallery={IMAGE_UPLOAD_RULES.maxGallery} />
      <button
        type="button"
        disabled={disabled || images.length >= IMAGE_UPLOAD_RULES.maxGallery}
        onClick={add}
        className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
      >
        + Add image
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
              <ImageUploadField
                label="Image"
                value={img.url || ""}
                onChange={(url) => update(i, { url })}
                disabled={disabled}
                authToken={authToken}
                alt={img.alt || "Vehicle photo"}
              />
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
      <p className="text-xs text-slate-500">
        Drag rows to reorder. Cover photo is used on cards and the detail page. Photo size is not limited. Max{" "}
        {IMAGE_UPLOAD_RULES.maxGallery} photos.
      </p>
    </div>
  );
}
