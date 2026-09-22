"use client";

import { emptyPageLink, emptyPageLinkGroup, PAGE_LINK_LAYOUTS } from "../../lib/seo/pageLinks";

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

export default function AdminPageLinksEditor({ groups = [], onChange, onLoadDefaults }) {
  const list = Array.isArray(groups) ? groups : [];

  const setGroups = (next) => onChange(next);

  const updateGroup = (index, patch) => {
    setGroups(list.map((group, i) => (i === index ? { ...group, ...patch } : group)));
  };

  const updateLink = (groupIndex, linkIndex, patch) => {
    const group = list[groupIndex];
    if (!group) return;
    const links = (group.links || []).map((link, i) => (i === linkIndex ? { ...link, ...patch } : link));
    updateGroup(groupIndex, { links });
  };

  const updateChild = (groupIndex, linkIndex, childIndex, patch) => {
    const link = list[groupIndex]?.links?.[linkIndex];
    if (!link) return;
    const children = (link.children || []).map((child, i) => (i === childIndex ? { ...child, ...patch } : child));
    updateLink(groupIndex, linkIndex, { children });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-800">Page hubs (FastTrack-style links)</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Add city, route and service links for this URL. Nested destinations sit under a city card. Empty groups fall back to the built-in template.
          </p>
        </div>
        {onLoadDefaults ? (
          <button
            type="button"
            onClick={onLoadDefaults}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Load template
          </button>
        ) : null}
      </div>

      {list.map((group, groupIndex) => (
        <div key={group.id || groupIndex} className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600">
              Section title
              <input
                className={`${inputCls()} mt-1`}
                value={group.title || ""}
                onChange={(e) => updateGroup(groupIndex, { title: e.target.value })}
                placeholder="Our top cities"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Layout
              <select
                className={`${inputCls()} mt-1`}
                value={group.layout || "cards"}
                onChange={(e) => updateGroup(groupIndex, { layout: e.target.value })}
              >
                {PAGE_LINK_LAYOUTS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="sm:col-span-2 text-xs font-semibold text-slate-600">
              Intro
              <input
                className={`${inputCls()} mt-1`}
                value={group.intro || ""}
                onChange={(e) => updateGroup(groupIndex, { intro: e.target.value })}
                placeholder="City cab booking with unique destinations"
              />
            </label>
          </div>

          <div className="mt-3 space-y-2">
            {(group.links || []).map((link, linkIndex) => (
              <div key={`${group.id}-${linkIndex}`} className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    className={inputCls()}
                    value={link.label || ""}
                    onChange={(e) => updateLink(groupIndex, linkIndex, { label: e.target.value })}
                    placeholder="Cab booking in Chennai"
                  />
                  <input
                    className={inputCls()}
                    value={link.href || ""}
                    onChange={(e) => updateLink(groupIndex, linkIndex, { href: e.target.value })}
                    placeholder="/car-rental/chennai-city-cabs"
                  />
                  <input
                    className={`sm:col-span-2 ${inputCls()}`}
                    value={link.hint || ""}
                    onChange={(e) => updateLink(groupIndex, linkIndex, { hint: e.target.value })}
                    placeholder="Optional hint — Airport, local and outstation"
                  />
                </div>

                {group.layout === "city-routes" ? (
                  <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-2">
                    <p className="text-[11px] font-semibold text-slate-500">Destinations under this city</p>
                    {(link.children || []).map((child, childIndex) => (
                      <div key={`${linkIndex}-${childIndex}`} className="grid gap-1.5 sm:grid-cols-[1fr_1fr_auto]">
                        <input
                          className={inputCls()}
                          value={child.label || ""}
                          onChange={(e) => updateChild(groupIndex, linkIndex, childIndex, { label: e.target.value })}
                          placeholder="Chennai to Pondicherry"
                        />
                        <input
                          className={inputCls()}
                          value={child.href || ""}
                          onChange={(e) => updateChild(groupIndex, linkIndex, childIndex, { href: e.target.value })}
                          placeholder="/routes/chennai-to-pondicherry-cab"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateLink(groupIndex, linkIndex, {
                              children: (link.children || []).filter((_, i) => i !== childIndex)
                            })
                          }
                          className="text-xs font-semibold text-rose-700 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        updateLink(groupIndex, linkIndex, {
                          children: [...(link.children || []), emptyPageLink()]
                        })
                      }
                      className="text-xs font-semibold text-sky-700 hover:underline"
                    >
                      + Destination
                    </button>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => updateGroup(groupIndex, { links: (group.links || []).filter((_, i) => i !== linkIndex) })}
                  className="mt-2 text-xs font-semibold text-rose-700 hover:underline"
                >
                  Remove link
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateGroup(groupIndex, { links: [...(group.links || []), emptyPageLink()] })}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              + Add link
            </button>
            <button
              type="button"
              onClick={() => setGroups(list.filter((_, i) => i !== groupIndex))}
              className="text-xs font-semibold text-rose-700 hover:underline"
            >
              Remove section
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setGroups([...list, emptyPageLinkGroup()])}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        + Add section
      </button>
    </div>
  );
}
