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
    vehicleName: form.vehicleName || form.title || form.name || "",
    title: form.title || form.name || "",
    name: form.name || "",
    brand: form.brand || form.brandName || "",
    brandName: form.brandName || form.brand || "",
    city: form.city || "",
    state: form.state || "Tamil Nadu",
    seats: form.seats || "",
    category: form.category || form.type || "",
    type: form.type || form.category || "",
    fuelType: form.fuelType || "",
    transmission: form.transmission || "",
    pricePerKm: form.pricePerKm,
    startingPrice: form.startingPrice || form.price,
    price: form.price,
    seoTitle: form.seoTitle || "",
    seoDescription: form.seoDescription || "",
    longSeoContent: form.longSeoContent || "",
    content: form.longSeoContent || form.shortDescription || "",
    pathPrefix,
    images: form.images || []
  };
}
