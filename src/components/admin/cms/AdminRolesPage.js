"use client";

const ROLES = [
  {
    role: "super_admin",
    label: "Super admin",
    access: "Full CMS, operations, settings, customers, vendors and SEO."
  },
  {
    role: "vendor_admin",
    label: "Cab vendor",
    access: "Own cabs, bookings, assignments, holiday trips and reports. Phone-scoped JWT. Cannot see other vendors."
  },
  {
    role: "driver",
    label: "Acting driver",
    access: "OTP login at /driver/login. Assigned trips only. Not a public SEO profile."
  },
  {
    role: "customer",
    label: "Client",
    access: "Public OTP/JWT booking. Self-register on the website or created by admin. Same User collection."
  }
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Settings</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Roles & Permissions</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Cabzii uses the existing JWT roles. Admin APIs still require a valid token and role — hiding a menu item is not enough.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {ROLES.map((item) => (
          <article key={item.role} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-slate-900">{item.label}</p>
            <p className="mt-1 font-mono text-[11px] text-sky-700">{item.role}</p>
            <p className="mt-2 text-sm text-slate-600">{item.access}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
