import Link from "next/link";

function HubCard({ href, title, hint, heading = "h3" }) {
  const Heading = heading;
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-slate-200 bg-white px-3 py-2.5 hover:border-[var(--cabzii-brand)]"
    >
      <Heading className="text-sm font-bold text-slate-900 group-hover:text-[var(--cabzii-brand)]">{title}</Heading>
      {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
    </Link>
  );
}

function CityRouteCard({ link }) {
  const children = Array.isArray(link.children) ? link.children.filter((item) => item.href && item.label) : [];
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-3">
      <Link href={link.href} className="block hover:text-[var(--cabzii-brand)]">
        <h3 className="text-sm font-bold text-slate-900">{link.label}</h3>
        {link.hint ? <p className="mt-0.5 text-xs text-slate-500">{link.hint}</p> : null}
      </Link>
      {children.length ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {children.map((item) => (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                className="inline-block rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-sky-300 hover:text-[var(--cabzii-brand)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function PageHubLinks({ groups = [] }) {
  if (!groups?.length) return null;

  return (
    <div className="space-y-8">
      {groups.map((group) => {
        const layout = group.layout || "cards";
        return (
          <section key={group.id || group.title}>
            {group.title ? <h2 className="text-base font-bold text-slate-900 sm:text-lg">{group.title}</h2> : null}
            {group.intro ? <p className="mt-1 text-sm text-slate-600">{group.intro}</p> : null}

            {layout === "pills" ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.links.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-sky-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            {layout === "city-routes" ? (
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {group.links.map((item) => (
                  <CityRouteCard key={`${item.href}-${item.label}`} link={item} />
                ))}
              </ul>
            ) : null}

            {layout === "cards" ? (
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {group.links.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <HubCard href={item.href} title={item.label} hint={item.hint} />
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
