"use client";

import AdminSearchSelect from "../AdminSearchSelect";
import { useAdminCities } from "../../../lib/admin/useAdminCities";

/**
 * Searchable city picker bound to the Cities collection.
 * valueMode: slug (CMS URLs) | name (legacy vendor/driver strings) | id
 */
export default function CitySelect({
  token = "",
  value = "",
  onChange,
  activeOnly = true,
  service = "",
  valueMode = "slug",
  allowCustom = false,
  placeholder = "Search an existing city…",
  disabled = false,
  excludeSlug = "",
  className = ""
}) {
  const { options, loading, error } = useAdminCities({ token, activeOnly, service });
  const filtered = excludeSlug
    ? options.filter((row) => row.slug !== String(excludeSlug).toLowerCase())
    : options;

  const selectOptions = filtered.map((row) => ({
    label: row.label,
    value: valueMode === "name" ? row.name : valueMode === "id" ? row.id : row.slug
  }));

  return (
    <div className={className}>
      <AdminSearchSelect
        value={value}
        onChange={onChange}
        options={selectOptions}
        placeholder={loading ? "Loading cities…" : placeholder}
        disabled={disabled || loading}
        allowCustom={allowCustom}
        emptyLabel={error || (loading ? "Loading…" : "No active cities — add one in Cities first")}
      />
      {error ? <p className="mt-1 text-[11px] text-rose-600">{error}</p> : null}
    </div>
  );
}
