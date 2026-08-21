/**
 * Client helper for Enterprise AI SEO APIs.
 */

const inflight = new Map();

export async function callAiSeo(task, payload = {}, { token, signal } = {}) {
  const key = `${task}:${JSON.stringify(payload)}`;
  if (inflight.has(key)) return inflight.get(key);

  const promise = (async () => {
    const res = await fetch(`/api/ai/${encodeURIComponent(task)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
      signal
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.success) {
      const err = new Error(json?.message || `AI ${task} failed`);
      err.status = res.status;
      err.openaiConfigured = json?.openaiConfigured;
      throw err;
    }
    return json;
  })();

  inflight.set(key, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(key);
  }
}

export function buildAiPayload(form = {}, pathPrefix = "/cabs") {
  return {
    vehicleName: form.vehicleName || form.title || form.name || form.operator || "",
    title: form.title || form.name || form.operator || "",
    name: form.name || form.operator || "",
    brand: form.brand || form.brandName || form.operator || "",
    brandName: form.brandName || form.brand || form.operator || "",
    city: form.city || form.fromCity || "",
    state: form.state || "Tamil Nadu",
    seats: form.seats || "",
    category: form.category || form.type || form.busType || "",
    type: form.type || form.category || form.busType || "",
    fuelType: form.fuelType || "",
    transmission: form.transmission || "",
    pricePerKm: form.pricePerKm,
    startingPrice: form.startingPrice || form.price || form.seaterPrice,
    price: form.price || form.seaterPrice,
    seoTitle: form.seoTitle || "",
    seoDescription: form.seoDescription || "",
    longSeoContent: form.longSeoContent || "",
    content: form.longSeoContent || form.shortDescription || "",
    customPrompt: form.customPrompt || form.aiPrompt || "",
    pathPrefix,
    images: form.images || []
  };
}
