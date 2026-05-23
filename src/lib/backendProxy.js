const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export function backendUrl(path, searchParams) {
  const qs = searchParams?.toString();
  const base = `${BACKEND_URL}/api/v1${path}`;
  return qs ? `${base}?${qs}` : base;
}

async function parseResponseBody(response) {
  const text = await response.text();
  if (!text) return { success: response.ok, message: response.ok ? "OK" : "Empty response" };
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text.slice(0, 200) || "Invalid response from server" };
  }
}

export async function proxyRequest(req, path, options = {}) {
  const authHeader = req.headers.get("authorization") || "";
  const url = options.url || backendUrl(path, req.nextUrl?.searchParams);
  const method = options.method || req.method;
  const headers = {
    ...(authHeader ? { authorization: authHeader } : {}),
    ...options.headers
  };
  if (options.body) headers["Content-Type"] = "application/json";

  try {
    const response = await fetch(url, {
      method,
      headers,
      ...(options.body ? { body: options.body } : {}),
      cache: "no-store"
    });
    const data = await parseResponseBody(response);
    return Response.json(data, { status: response.status });
  } catch (error) {
    const message =
      error?.cause?.code === "ECONNREFUSED" || error?.code === "ECONNREFUSED"
        ? "Backend server is not running. Start cabzii-ultimate-backend on port 8000."
        : "Could not reach backend server. Check BACKEND_URL in .env.local.";

    return Response.json({ success: false, message, data: [] }, { status: 503 });
  }
}
