/** Shared vehicle image rules — keep in sync with backend src/utils/imageUploadRules.js */

export const IMAGE_UPLOAD_RULES = {
  maxBytes: 1 * 1024 * 1024,
  maxMb: 1,
  minWidth: 1200,
  minHeight: 750,
  recommendedWidth: 1600,
  recommendedHeight: 1000,
  maxWidth: 1600,
  maxGallery: 8,
  mimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  acceptAttr: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
  formatsLabel: "JPG / JPEG / PNG / WebP"
};

export function formatBytesAsMb(bytes) {
  return `${(Number(bytes || 0) / (1024 * 1024)).toFixed(1)} MB`;
}

export async function readImageDimensions(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read image dimensions."));
      el.src = url;
    });
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function validateImageFile(file, { skipDimensions = false } = {}) {
  if (!file) return { ok: false, message: "Choose a file." };
  const type = String(file.type || "").toLowerCase();
  const allowed = IMAGE_UPLOAD_RULES.mimeTypes.includes(type) || /\.(jpe?g|png|webp)$/i.test(file.name || "");
  if (!allowed) {
    return { ok: false, message: `Invalid image type. Use ${IMAGE_UPLOAD_RULES.formatsLabel}.` };
  }
  if (file.size > IMAGE_UPLOAD_RULES.maxBytes) {
    return {
      ok: false,
      message: `Image is ${formatBytesAsMb(file.size)}. Maximum allowed size is ${IMAGE_UPLOAD_RULES.maxMb} MB.`
    };
  }
  if (!skipDimensions) {
    try {
      const { width, height } = await readImageDimensions(file);
      if (width < IMAGE_UPLOAD_RULES.minWidth || height < IMAGE_UPLOAD_RULES.minHeight) {
        return {
          ok: false,
          message: `Image is ${width} × ${height} px. Minimum is ${IMAGE_UPLOAD_RULES.minWidth} × ${IMAGE_UPLOAD_RULES.minHeight} px.`
        };
      }
      return { ok: true, width, height };
    } catch (err) {
      return { ok: false, message: err.message || "Could not read image dimensions." };
    }
  }
  return { ok: true };
}
