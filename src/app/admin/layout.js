import { buildPageMetadata } from "../../lib/seo";
import AdminToastProvider from "../../components/admin/AdminToastProvider";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Admin",
  description: "Cabzii administration.",
  path: "/admin",
  noindex: true
});

export default function AdminLayout({ children }) {
  return (
    <>
      {children}
      <AdminToastProvider />
    </>
  );
}
