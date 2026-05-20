const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export function backendUrl(path, searchParams) {
  const qs = searchParams?.toString();
  const base = `${BACKEND_URL}/api/v1${path}`;
  return qs ? `${base}?${qs}` : base;
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

  const response = await fetch(url, {
    method,
    headers,
    ...(options.body ? { body: options.body } : {}),
    cache: "no-store"
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
