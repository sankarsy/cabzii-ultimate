import { revalidatePath } from "next/cache";
import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/site-settings");
}

export async function PUT(req) {
  const body = await req.text();
  const res = await proxyRequest(req, "/site-settings", { method: "PUT", body });
  if (res.ok) {
    revalidatePath("/", "layout");
  }
  return res;
}
