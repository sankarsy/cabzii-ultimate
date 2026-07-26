"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";

async function toWebp(file) {
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: "image/webp"
    });
    return compressed;
  } catch {
    return file;
  }
}

export default function SeoOgImageDropzone({ value, onUploaded, disabled, token, onGenerateAlt }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = useCallback(
    async (file) => {
      if (!file || disabled) return;
      setUploading(true);
      setError("");
      try {
        const webp = await toWebp(file);
        const fd = new FormData();
        fd.append("file", webp, (webp.name || "seo-image").replace(/\.\w+$/, ".webp"));
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: token ? { authorization: `Bearer ${token}` } : {},
          body: fd
        });
        const json = await res.json();
        if (!res.ok || !json?.success) throw new Error(json?.message || "Upload failed");
        const url = json.data?.relativeUrl || json.data?.url || "";
        onUploaded?.(url, json.data);
        onGenerateAlt?.(url);
      } catch (e) {
        setError(e.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [disabled, token, onUploaded, onGenerateAlt]
  );

  const onDrop = useCallback(
    (accepted) => {
      if (accepted?.[0]) void upload(accepted[0]);
    },
    [upload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    multiple: false,
    disabled: disabled || uploading,
    noClick: false
  });

  const onPaste = async (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
    if (!item) return;
    const file = item.getAsFile();
    if (file) {
      e.preventDefault();
      await upload(file);
    }
  };

  return (
    <div className="space-y-2" onPaste={onPaste}>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-6 text-center text-xs transition ${
          isDragActive ? "border-sky-500 bg-sky-50" : "border-slate-300 bg-slate-50 hover:border-sky-400"
        } ${disabled || uploading ? "opacity-60" : ""}`}
      >
        <input {...getInputProps()} />
        <p className="font-semibold text-slate-700">{uploading ? "Compressing & uploading…" : "Drag & drop OG / Twitter image"}</p>
        <p className="mt-1 text-slate-500">or click / paste · auto WebP compress · max ~1600px</p>
      </div>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-36 w-full rounded-xl border border-slate-200 object-cover" />
      ) : null}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
