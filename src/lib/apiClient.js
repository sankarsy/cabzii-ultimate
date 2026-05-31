/** Shared fetch helper — treats HTTP errors and `{ success: false }` as failures. */

export async function fetchJson(url, options = {}) {
  const res = await fetch(url, { cache: "no-store", ...options });
  let json = {};
  try {
    json = await res.json();
  } catch {
    json = {};
  }
  if (!res.ok || json?.success === false) {
    const err = new Error(json?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = json;
    throw err;
  }
  return json;
}

export function extractList(json) {
  return Array.isArray(json?.data) ? json.data : [];
}
