import { tariffInr } from "../../lib/publishedTariff";

function Cell({ label, value, emphasize = false }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 py-1.5 last:border-0 sm:block sm:border-0 sm:py-0">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:hidden">{label}</span>
      <span className={emphasize ? "text-sm font-extrabold text-slate-900" : "text-sm font-semibold text-slate-800"}>
        {value}
      </span>
    </div>
  );
}

function DesktopTable({ columns, rows }) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-slate-200 sm:block">
      <table className="min-w-full text-left text-xs">
        <thead className="bg-sky-50 text-[11px] font-bold uppercase tracking-wide text-slate-700">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-3 py-2.5">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.name} className={i % 2 ? "bg-slate-50" : "bg-white"}>
              {columns.map((col) => (
                <td key={col.key} className={`whitespace-nowrap px-3 py-2.5 ${col.key === "name" ? "font-bold text-slate-900" : "font-semibold text-slate-800"}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards({ fields, rows }) {
  return (
    <ul className="grid gap-3 sm:hidden">
      {rows.map((row) => (
        <li key={row.name} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <p className="text-[15px] font-extrabold text-slate-900">{row.name}</p>
          <div className="mt-2">
            {fields.map((field) => (
              <Cell key={field.key} label={field.label} value={field.render(row)} emphasize={field.key === "seats"} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CarTariffTable({ rows }) {
  const columns = [
    { key: "name", label: "Car type", render: (r) => r.name },
    { key: "seats", label: "Seaters", render: (r) => r.seats },
    { key: "local4", label: "4 Hrs / 40 Kms", render: (r) => tariffInr(r.local4) },
    { key: "local8", label: "8 Hrs / 80 Kms", render: (r) => tariffInr(r.local8) },
    { key: "extraKm", label: "Additional Kms", render: (r) => tariffInr(r.extraKm) },
    { key: "extraHr", label: "Additional Hrs", render: (r) => tariffInr(r.extraHr) },
    { key: "outMin", label: "Outstation Min. 250KM", render: (r) => tariffInr(r.outMin) },
    { key: "outKm", label: "Outstation Add Per KM", render: (r) => tariffInr(r.outKm) },
    { key: "batta", label: "Driver Batta / Day", render: (r) => tariffInr(r.batta) }
  ];
  return (
    <>
      <DesktopTable columns={columns} rows={rows} />
      <MobileCards fields={columns.filter((c) => c.key !== "name")} rows={rows} />
    </>
  );
}

export function VanTariffTable({ rows }) {
  const columns = [
    { key: "name", label: "Van type", render: (r) => r.name },
    { key: "seats", label: "Seaters", render: (r) => r.seats },
    { key: "local5", label: "5 Hrs / 50 Kms", render: (r) => tariffInr(r.local5) },
    { key: "local10", label: "10 Hrs / 100 Kms", render: (r) => tariffInr(r.local10) },
    { key: "local15", label: "15 Hrs / 150 Kms", render: (r) => tariffInr(r.local15) },
    { key: "extraKm", label: "Additional Kms", render: (r) => tariffInr(r.extraKm) },
    { key: "extraHr", label: "Additional Hrs", render: (r) => tariffInr(r.extraHr) },
    { key: "outMin", label: "Outstation Min. 300KM", render: (r) => tariffInr(r.outMin) },
    { key: "outKm", label: "Outstation Add Per KM", render: (r) => tariffInr(r.outKm) },
    { key: "batta", label: "Driver Batta / Day", render: (r) => tariffInr(r.batta) }
  ];
  return (
    <>
      <DesktopTable columns={columns} rows={rows} />
      <MobileCards fields={columns.filter((c) => c.key !== "name")} rows={rows} />
    </>
  );
}

export function BusTariffTable({ rows }) {
  const columns = [
    { key: "name", label: "Particulars", render: (r) => r.name },
    { key: "local10", label: "10 Hrs / 100 Kms", render: (r) => tariffInr(r.local10) },
    { key: "extraKm", label: "Local Add. Kms", render: (r) => tariffInr(r.extraKm) },
    { key: "extraHr", label: "Local Add. Hrs", render: (r) => tariffInr(r.extraHr) },
    { key: "outMin", label: "Outstation Min. 300KM", render: (r) => tariffInr(r.outMin) },
    { key: "outKm", label: "Outstation Add Per KM", render: (r) => tariffInr(r.outKm) },
    { key: "batta", label: "Driver Batta / Day", render: (r) => tariffInr(r.batta) }
  ];
  return (
    <>
      <DesktopTable columns={columns} rows={rows} />
      <MobileCards fields={columns.filter((c) => c.key !== "name")} rows={rows} />
    </>
  );
}
