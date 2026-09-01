import { proxyRequest } from "../backendProxy";
import { pathsFromKind } from "./paths";
import { revalidateSeoPages } from "./revalidateSeoPage";

function parseJson(text) {
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function jsonFromResponse(res) {
  try {
    const cloned = res.clone();
    return await cloned.json();
  } catch {
    return {};
  }
}

/**
 * Proxy an admin CMS mutation, then refresh only the affected SEO paths.
 * Authorization is the existing backend check on the proxied request.
 */
export async function proxySeoMutation(req, backendPath, { method, body, kind, extra = {} } = {}) {
  const res = await proxyRequest(req, backendPath, { method, body });
  if (!res.ok) return res;

  const requestRecord = typeof body === "string" ? parseJson(body) : extra.bodyRecord || {};
  const responseJson = await jsonFromResponse(res);
  const responseRecord = responseJson?.data && typeof responseJson.data === "object" ? responseJson.data : {};
  const record = { ...responseRecord, ...(extra.bodyRecord || {}), ...requestRecord };

  revalidateSeoPages(pathsFromKind(kind, record, extra));
  return res;
}

export async function proxySeoDelete(req, backendPath, { kind, extra = {}, lookupPath } = {}) {
  let record = extra.record || {};
  if (lookupPath) {
    const existing = await proxyRequest(req, lookupPath, { method: "GET" });
    if (existing.ok) {
      const json = await jsonFromResponse(existing);
      if (json?.data && typeof json.data === "object") record = { ...json.data, ...record };
    }
  }
  const res = await proxyRequest(req, backendPath, { method: "DELETE" });
  if (res.ok) revalidateSeoPages(pathsFromKind(kind, record, extra));
  return res;
}
