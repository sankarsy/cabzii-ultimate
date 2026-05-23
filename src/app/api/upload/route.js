import { resolveMediaUrl } from "../../../lib/media";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const authHeader = req.headers.get("authorization") || "";

    const response = await fetch(`${BACKEND_URL}/api/v1/upload`, {
      method: "POST",
      headers: authHeader ? { authorization: authHeader } : {},
      body: formData
    });

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      return Response.json({ success: false, message: text || "Upload failed" }, { status: response.status });
    }

    if (!response.ok || !data?.success) {
      return Response.json(
        { success: false, message: data?.message || "Upload failed" },
        { status: response.status }
      );
    }

    const relativeUrl = data.data?.url || "";
    const absoluteUrl = resolveMediaUrl(relativeUrl);

    return Response.json({
      success: true,
      data: {
        ...data.data,
        url: absoluteUrl,
        relativeUrl
      }
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error?.cause?.code === "ECONNREFUSED"
            ? "Backend is not running. Start cabzii-ultimate-backend on port 8000."
            : "Failed to upload image."
      },
      { status: 503 }
    );
  }
}
