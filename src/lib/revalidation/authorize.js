import { timingSafeEqual } from "crypto";
import { backendUrl } from "../backendProxy";

function secretsMatch(expected, provided) {
  if (!expected || !provided) return false;
  const a = Buffer.from(String(expected));
  const b = Buffer.from(String(provided));
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function authorizeRevalidateRequest(req) {
  const configuredSecret = String(process.env.REVALIDATION_SECRET || "").trim();
  const providedSecret = String(
    req.headers.get("x-revalidation-secret") || req.headers.get("x-revalidate-secret") || ""
  ).trim();

  if (configuredSecret && secretsMatch(configuredSecret, providedSecret)) {
    return { ok: true, via: "secret" };
  }

  const authorization = req.headers.get("authorization") || "";
  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  try {
    const response = await fetch(backendUrl("/auth/me"), {
      headers: { authorization },
      cache: "no-store"
    });
    const json = await response.json().catch(() => ({}));
    const role = json?.data?.role;
    if (response.ok && role === "super_admin") {
      return { ok: true, via: "super_admin" };
    }
  } catch {
    return { ok: false, status: 503, message: "Could not verify admin session" };
  }

  return { ok: false, status: 403, message: "Forbidden" };
}
