import { redirect } from "next/navigation";

/** Legacy /packages URL → canonical /holidays */
export default function PackagesRedirectPage({ searchParams }) {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams || {})) {
    if (Array.isArray(value)) value.forEach((v) => q.append(key, v));
    else if (value != null) q.set(key, String(value));
  }
  const suffix = q.toString() ? `?${q.toString()}` : "";
  redirect(`/holidays${suffix}`);
}
