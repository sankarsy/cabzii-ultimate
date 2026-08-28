/** Shared vehicle image rules — keep in sync with backend src/utils/imageUploadRules.js */

export const IMAGE_UPLOAD_RULES = {
  maxBytes: 12 * 1024 * 1024,
  maxMb: 12,
  compressedMaxMb: 2,
  minWidth: 0,
  minHeight: 0,
  warnWidth: 400,
  warnHeight: 250,
  recommendedWidth: 1600,
  recommendedHeight: 1000,
  maxWidth: 1920,
  maxGallery: 8,
  mimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  acceptAttr: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
  formatsLabel: "JPG / JPEG / PNG / WebP"
};

export function formatBytesAsMb(bytes) {
  return `${(Number(bytes || 0) / (1024 * 1024)).toFixed(1)} MB`;
}

export function isBelowRecommendedSize(width, height) {
  return (
    Number(width) > 0 &&
    Number(height) > 0 &&
    (width < IMAGE_UPLOAD_RULES.warnWidth || height < IMAGE_UPLOAD_RULES.warnHeight)
  );
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
      const warning = isBelowRecommendedSize(width, height)
        ? `This photo is ${width} × ${height} px. Low resolution is allowed. ${IMAGE_UPLOAD_RULES.recommendedWidth} × ${IMAGE_UPLOAD_RULES.recommendedHeight} px looks sharper on cards.`
        : "";
      return { ok: true, width, height, warning };
    } catch {
      return { ok: true };
    }
  }
  return { ok: true };
}
