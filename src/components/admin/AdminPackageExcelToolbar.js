"use client";

import { useRef, useState } from "react";
import {
  downloadAllPackagesExcel,
  downloadTabExcel,
  importAllPackagesFromWorkbook,
  importPackageRows,
  parseExcelFile
} from "../../lib/adminPackageExcel";

const PACKAGE_TABS = new Set(["cabs", "drivers", "packages"]);

export default function AdminPackageExcelToolbar({
  tabKey,
  items = [],
  token,
  canEdit,
  onImported
}) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!PACKAGE_TABS.has(tabKey)) return null;

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};
  const apiBase = tabKey === "cabs" ? "/api/cabs" : tabKey === "drivers" ? "/api/drivers" : "/api/packages";

  async function fetchAllCatalog() {
    const headers = authHeaders;
    const [cabsRes, driversRes, packagesRes] = await Promise.all([
      fetch("/api/cabs?limit=5000", { headers, cache: "no-store" }),
      fetch("/api/drivers?admin=1&limit=5000", { headers, cache: "no-store" }),
      fetch("/api/packages?limit=5000", { headers, cache: "no-store" })
    ]);
    const [cabsJson, driversJson, packagesJson] = await Promise.all([
      cabsRes.json(),
      driversRes.json(),
      packagesRes.json()
    ]);
    const pick = (json) => (Array.isArray(json?.data) ? json.data : []);
    return {
      cabs: pick(cabsJson),
      drivers: pick(driversJson),
      packages: pick(packagesJson)
    };
  }

  async function handleDownloadTab() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${apiBase}?admin=1&limit=5000`, {
        headers: authHeaders,
        cache: "no-store"
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load items");
      const rows = Array.isArray(json.data) ? json.data : items;
      downloadTabExcel(tabKey, rows);
      setMessage(`Downloaded ${rows.length} ${tabKey} row(s) as Excel.`);
    } catch (err) {
      setError(err.message || "Download failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDownloadAll() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const all = await fetchAllCatalog();
      downloadAllPackagesExcel(all);
      setMessage(
        `Downloaded all packages: ${all.cabs.length} cabs, ${all.drivers.length} drivers, ${all.packages.length} holiday packages.`
      );
    } catch (err) {
      setError(err.message || "Download failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(file) {
    if (!file || !canEdit) return;
    setBusy(true);
    setError("");
    setMessage("");
    setProgress("Reading file…");

    try {
      const parsed = await parseExcelFile(file);
      const hasMultiSheet =
        (parsed.cabs?.length || 0) + (parsed.drivers?.length || 0) + (parsed.packages?.length || 0) > 0 &&
        parsed.sheetNames?.length > 1;

      let result;
      if (hasMultiSheet) {
        result = await importAllPackagesFromWorkbook({
          parsed,
          authHeaders,
          onProgress: ({ done, total }) => setProgress(`Importing… ${done}/${total}`)
        });
      } else {
        const rows =
          parsed.singleSheet?.length > 0
            ? parsed.singleSheet
            : tabKey === "cabs"
              ? parsed.cabs
              : tabKey === "drivers"
                ? parsed.drivers
                : parsed.packages;

        result = await importPackageRows({
          tabKey,
          rows,
          apiBase,
          authHeaders,
          onProgress: ({ done, total }) => setProgress(`Importing ${tabKey}… ${done}/${total}`)
        });
      }

      const errPreview =
        result.errors.length > 0
          ? ` ${result.errors.length} row(s) failed (first: row ${result.errors[0].row} — ${result.errors[0].message}).`
          : "";

      setMessage(
        `Import complete: ${result.imported} created, ${result.updated} updated (${result.total} rows).${errPreview}`
      );
      if (result.errors.length) {
        setError(result.errors.slice(0, 5).map((e) => `Row ${e.row}${e.sheet ? ` (${e.sheet})` : ""}: ${e.message}`).join(" · "));
      }
      if (onImported) await onImported();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setBusy(false);
      setProgress("");
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mb-3 rounded-lg border border-indigo-200 bg-indigo-50/80 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Excel — download &amp; upload packages</p>
          <p className="mt-0.5 text-xs text-slate-600">
            Export all fare packages (local 4hr, 8hr, outstation). Upload updates rows with matching <strong>id</strong>, or creates new rows when id is empty.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={handleDownloadTab}
            className="rounded-md border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
          >
            Download {tabKey} Excel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleDownloadAll}
            className="rounded-md border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
          >
            Download all (3 sheets)
          </button>
          {canEdit ? (
            <>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => fileRef.current?.click()}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {busy ? "Importing…" : "Upload Excel"}
              </button>
            </>
          ) : null}
        </div>
      </div>
      {progress ? <p className="mt-2 text-xs font-medium text-indigo-700">{progress}</p> : null}
      {message ? <p className="mt-2 text-xs text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
    </div>
  );
}
