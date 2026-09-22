"use client";

import { useEffect, useState } from "react";
import TourPackageLanding from "./TourPackageLanding";

export default function TourPackageClientFallback({ slug }) {
  const [pkg, setPkg] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch(`/api/packages/${encodeURIComponent(slug)}`, { cache: "no-store" });
        const json = await res.json();
        const data = json?.data;
        if (!live) return;
        if (!res.ok || !data || data.status === "inactive" || data.isDeleted) {
          setStatus("missing");
          return;
        }
        setPkg(data);
        const listRes = await fetch("/api/packages?limit=12&page=1", { cache: "no-store" });
        const listJson = await listRes.json();
        const all = Array.isArray(listJson?.data) ? listJson.data : [];
        setRelated(
          all
            .filter(
              (row) =>
                String(row._id) !== String(data._id) &&
                (row.category === data.category || row.city === data.city || !data.category)
            )
            .slice(0, 3)
        );
        setStatus("ready");
      } catch {
        if (live) setStatus("missing");
      }
    })();
    return () => {
      live = false;
    };
  }, [slug]);

  if (status === "loading") {
    return <div className="section-shell py-16 text-center text-slate-500">Loading tour package…</div>;
  }
  if (status === "missing" || !pkg) {
    return (
      <div className="section-shell py-16 text-center text-slate-600">
        This tour package is not available.
      </div>
    );
  }
  return <TourPackageLanding pkg={pkg} related={related} />;
}
