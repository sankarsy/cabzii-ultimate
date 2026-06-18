"use client";

import { useCallback, useEffect, useState } from "react";
import { normalizeTrustBadges, EMOJI_BY_KEY } from "../TrustBadges";

const SECTIONS = [
  { id: "general", label: "General & contact" },
  { id: "navbar", label: "Navbar" },
  { id: "footer", label: "Footer links" },
  { id: "hero", label: "Hero banner" },
  { id: "heroStats", label: "Hero stats (counters)" },
  { id: "whyChooseUs", label: "Why Cabzii section" },
  { id: "homeSections", label: "Homepage sections" },
  { id: "whatsapp", label: "WhatsApp button" }
];

function Field({ label, children, hint }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

function emptyNavLink() {
  return { label: "", href: "", visible: true, sortOrder: 0 };
}

function emptyFooterLink() {
  return { label: "", href: "" };
}

function emptyHeroStat() {
  return { value: "", label: "", iconKey: "users" };
}

function emptyWhyStat() {
  return { value: "", label: "" };
}

function emptyWhyCard() {
  return { title: "", subtitle: "", iconKey: "shield" };
}

function emptyTrustBadge() {
  return { label: "", iconKey: "verified", icon: "✅" };
}

const TRUST_ICON_OPTIONS = [
  { value: "verified", label: "✅ Verified" },
  { value: "price", label: "💰 Best price" },
  { value: "support", label: "🎧 24/7 support" },
  { value: "secure", label: "🔒 Secure" },
  { value: "cancel", label: "🔄 Free cancellation" }
];

function emptyHomeSection() {
  return { key: "cabs", enabled: true, eyebrow: "", title: "", subtitle: "", limit: 6, sortOrder: 1, viewAllHref: "" };
}

function stripMeta(data) {
  const { _id, key, createdAt, updatedAt, __v, ...rest } = data || {};
  return rest;
}

export default function AdminSiteSettings({ token, isSuperAdmin }) {
  const [activeSection, setActiveSection] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [general, setGeneral] = useState({
    siteName: "",
    brandColor: "#0056D2",
    tagline: "",
    contact: { email: "", phone: "", whatsapp: "", address: "", hours: "" }
  });
  const [navbar, setNavbar] = useState([]);
  const [footerQuickLinks, setFooterQuickLinks] = useState([]);
  const [footerLegalLinks, setFooterLegalLinks] = useState([]);
  const [hero, setHero] = useState({
    eyebrow: "",
    title: "",
    titleHighlight: "",
    subtitle: "",
    image: "",
    promoBadge: "",
    promoTitle: "",
    promoSubtitle: "",
    searchPlaceholder: "",
    tabs: [],
    cabTypes: [],
    trustBadges: []
  });
  const [heroStats, setHeroStats] = useState([]);
  const [whySection, setWhySection] = useState({ eyebrow: "", title: "", subtitle: "" });
  const [whyStats, setWhyStats] = useState([]);
  const [whyChooseUs, setWhyChooseUs] = useState([]);
  const [homeSections, setHomeSections] = useState([]);
  const [whatsappFab, setWhatsappFab] = useState({ enabled: true, number: "" });

  const authHeaders = token ? { authorization: `Bearer ${token}` } : {};

  const applyLoaded = useCallback((data) => {
    const s = stripMeta(data);
    setGeneral({
      siteName: s.siteName || "",
      brandColor: s.brandColor || "#0056D2",
      tagline: s.tagline || "",
      contact: {
        email: s.contact?.email || "",
        phone: s.contact?.phone || "",
        whatsapp: s.contact?.whatsapp || "",
        address: s.contact?.address || "",
        hours: s.contact?.hours || ""
      }
    });
    setNavbar(Array.isArray(s.navbar) ? s.navbar.map((l) => ({ ...l })) : []);
    setFooterQuickLinks(Array.isArray(s.footerQuickLinks) ? s.footerQuickLinks.map((l) => ({ ...l })) : []);
    setFooterLegalLinks(Array.isArray(s.footerLegalLinks) ? s.footerLegalLinks.map((l) => ({ ...l })) : []);
    setHero({
      eyebrow: s.hero?.eyebrow || "",
      title: s.hero?.title || "",
      titleHighlight: s.hero?.titleHighlight || "",
      subtitle: s.hero?.subtitle || "",
      image: s.hero?.image || "",
      promoBadge: s.hero?.promoBadge || "",
      promoTitle: s.hero?.promoTitle || "",
      promoSubtitle: s.hero?.promoSubtitle || "",
      searchPlaceholder: s.hero?.searchPlaceholder || "",
      tabs: Array.isArray(s.hero?.tabs) ? s.hero.tabs.map((t) => ({ ...t })) : [],
      cabTypes: Array.isArray(s.hero?.cabTypes) ? [...s.hero.cabTypes] : [],
      trustBadges: normalizeTrustBadges(s.hero?.trustBadges)
    });
    setHeroStats(Array.isArray(s.heroStats) ? s.heroStats.map((x) => ({ ...x })) : []);
    setWhySection({
      eyebrow: s.whySection?.eyebrow || "",
      title: s.whySection?.title || "",
      subtitle: s.whySection?.subtitle || ""
    });
    setWhyStats(Array.isArray(s.whyStats) ? s.whyStats.map((x) => ({ ...x })) : []);
    setWhyChooseUs(Array.isArray(s.whyChooseUs) ? s.whyChooseUs.map((x) => ({ ...x })) : []);
    setHomeSections(Array.isArray(s.homeSections) ? s.homeSections.map((x) => ({ ...x })) : []);
    setWhatsappFab({
      enabled: s.whatsappFab?.enabled !== false,
      number: s.whatsappFab?.number || ""
    });
  }, []);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const res = await fetch("/api/site-settings", { headers: authHeaders, cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.data) {
          applyLoaded(data.data);
        } else {
          setErrorMessage(data?.message || "Failed to load site settings");
        }
      } catch {
        setErrorMessage("Failed to load site settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, applyLoaded]);

  const buildSectionPayload = (sectionId) => {
    switch (sectionId) {
      case "general":
        return { siteName: general.siteName, brandColor: general.brandColor, tagline: general.tagline, contact: general.contact };
      case "navbar":
        return { navbar };
      case "footer":
        return { footerQuickLinks, footerLegalLinks };
      case "hero":
        return { hero };
      case "heroStats":
        return { heroStats };
      case "whyChooseUs":
        return { whySection, whyStats, whyChooseUs };
      case "homeSections":
        return { homeSections };
      case "whatsapp":
        return { whatsappFab };
      default:
        return {};
    }
  };

  const saveSection = async (sectionId = activeSection) => {
    if (!isSuperAdmin) {
      setErrorMessage("Only super admin can update site settings.");
      return;
    }
    setSaving(true);
    setMessage("");
    setErrorMessage("");
    try {
      const payload = buildSectionPayload(sectionId);
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Save failed");
      if (data?.data) applyLoaded(data.data);
      const label = SECTIONS.find((s) => s.id === sectionId)?.label || "Section";
      setMessage(`${label} saved. Refresh the homepage to see changes.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateListItem = (setter, index, field, value) => {
    setter((list) => list.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const removeListItem = (setter, index) => {
    setter((list) => list.filter((_, i) => i !== index));
  };

  if (loading) return <p className="text-sm text-slate-600">Loading site settings…</p>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-md">
      <h2 className="text-lg font-bold text-slate-900">Site settings</h2>
      <p className="mt-1 text-xs text-slate-600">Edit each part of the website separately. Save one section at a time.</p>

      {!isSuperAdmin ? (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">Super admin only — you can view but not save.</p>
      ) : null}

      {errorMessage ? <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{errorMessage}</p> : null}
      {message ? <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => {
              setActiveSection(section.id);
              setMessage("");
              setErrorMessage("");
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              activeSection === section.id ? "bg-sky-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {activeSection === "general" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Site name">
              <input className={inputCls()} value={general.siteName} onChange={(e) => setGeneral((p) => ({ ...p, siteName: e.target.value }))} />
            </Field>
            <Field label="Brand color">
              <input className={inputCls()} value={general.brandColor} onChange={(e) => setGeneral((p) => ({ ...p, brandColor: e.target.value }))} placeholder="#0056D2" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Tagline">
                <textarea className={inputCls()} rows={2} value={general.tagline} onChange={(e) => setGeneral((p) => ({ ...p, tagline: e.target.value }))} />
              </Field>
            </div>
            <Field label="Email">
              <input className={inputCls()} value={general.contact.email} onChange={(e) => setGeneral((p) => ({ ...p, contact: { ...p.contact, email: e.target.value } }))} />
            </Field>
            <Field label="Phone">
              <input className={inputCls()} value={general.contact.phone} onChange={(e) => setGeneral((p) => ({ ...p, contact: { ...p.contact, phone: e.target.value } }))} />
            </Field>
            <Field label="WhatsApp number">
              <input className={inputCls()} value={general.contact.whatsapp} onChange={(e) => setGeneral((p) => ({ ...p, contact: { ...p.contact, whatsapp: e.target.value } }))} />
            </Field>
            <Field label="Business hours">
              <input className={inputCls()} value={general.contact.hours} onChange={(e) => setGeneral((p) => ({ ...p, contact: { ...p.contact, hours: e.target.value } }))} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address">
                <input className={inputCls()} value={general.contact.address} onChange={(e) => setGeneral((p) => ({ ...p, contact: { ...p.contact, address: e.target.value } }))} />
              </Field>
            </div>
          </div>
        )}

        {activeSection === "navbar" && (
          <div className="space-y-3">
            {navbar.map((link, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="grid gap-3 sm:grid-cols-4">
                  <Field label="Label">
                    <input className={inputCls()} value={link.label} onChange={(e) => updateListItem(setNavbar, index, "label", e.target.value)} />
                  </Field>
                  <Field label="Link (href)">
                    <input className={inputCls()} value={link.href} onChange={(e) => updateListItem(setNavbar, index, "href", e.target.value)} />
                  </Field>
                  <Field label="Sort order">
                    <input type="number" className={inputCls()} value={link.sortOrder ?? 0} onChange={(e) => updateListItem(setNavbar, index, "sortOrder", Number(e.target.value))} />
                  </Field>
                  <label className="flex items-end gap-2 pb-2 text-sm text-slate-700">
                    <input type="checkbox" checked={link.visible !== false} onChange={(e) => updateListItem(setNavbar, index, "visible", e.target.checked)} />
                    Visible
                  </label>
                </div>
                <button type="button" onClick={() => removeListItem(setNavbar, index)} className="mt-2 text-xs font-semibold text-rose-700 hover:underline">
                  Remove link
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setNavbar((p) => [...p, emptyNavLink()])} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              + Add navbar link
            </button>
          </div>
        )}

        {activeSection === "footer" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-bold text-slate-800">Quick links</p>
              <div className="space-y-3">
                {footerQuickLinks.map((link, index) => (
                  <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Field label="Label">
                        <input className={inputCls()} value={link.label} onChange={(e) => updateListItem(setFooterQuickLinks, index, "label", e.target.value)} />
                      </Field>
                      <Field label="Href">
                        <input className={inputCls()} value={link.href} onChange={(e) => updateListItem(setFooterQuickLinks, index, "href", e.target.value)} />
                      </Field>
                    </div>
                    <button type="button" onClick={() => removeListItem(setFooterQuickLinks, index)} className="mt-2 text-xs font-semibold text-rose-700 hover:underline">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setFooterQuickLinks((p) => [...p, emptyFooterLink()])} className="text-xs font-semibold text-sky-700 hover:underline">
                  + Add quick link
                </button>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-slate-800">Legal links</p>
              <div className="space-y-3">
                {footerLegalLinks.map((link, index) => (
                  <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Field label="Label">
                        <input className={inputCls()} value={link.label} onChange={(e) => updateListItem(setFooterLegalLinks, index, "label", e.target.value)} />
                      </Field>
                      <Field label="Href">
                        <input className={inputCls()} value={link.href} onChange={(e) => updateListItem(setFooterLegalLinks, index, "href", e.target.value)} />
                      </Field>
                    </div>
                    <button type="button" onClick={() => removeListItem(setFooterLegalLinks, index)} className="mt-2 text-xs font-semibold text-rose-700 hover:underline">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setFooterLegalLinks((p) => [...p, emptyFooterLink()])} className="text-xs font-semibold text-sky-700 hover:underline">
                  + Add legal link
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "hero" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow text">
              <input className={inputCls()} value={hero.eyebrow} onChange={(e) => setHero((p) => ({ ...p, eyebrow: e.target.value }))} />
            </Field>
            <Field label="Hero image path">
              <input className={inputCls()} value={hero.image} onChange={(e) => setHero((p) => ({ ...p, image: e.target.value }))} placeholder="/images/hero-banner.png" />
            </Field>
            <Field label="Main title">
              <input className={inputCls()} value={hero.title} onChange={(e) => setHero((p) => ({ ...p, title: e.target.value }))} />
            </Field>
            <Field label="Highlighted words in title">
              <input className={inputCls()} value={hero.titleHighlight} onChange={(e) => setHero((p) => ({ ...p, titleHighlight: e.target.value }))} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Subtitle">
                <textarea className={inputCls()} rows={2} value={hero.subtitle} onChange={(e) => setHero((p) => ({ ...p, subtitle: e.target.value }))} />
              </Field>
            </div>
            <Field label="Promo badge">
              <input className={inputCls()} value={hero.promoBadge} onChange={(e) => setHero((p) => ({ ...p, promoBadge: e.target.value }))} />
            </Field>
            <Field label="Promo title">
              <input className={inputCls()} value={hero.promoTitle} onChange={(e) => setHero((p) => ({ ...p, promoTitle: e.target.value }))} />
            </Field>
            <Field label="Promo subtitle">
              <input className={inputCls()} value={hero.promoSubtitle} onChange={(e) => setHero((p) => ({ ...p, promoSubtitle: e.target.value }))} />
            </Field>
            <Field label="Search placeholder">
              <input className={inputCls()} value={hero.searchPlaceholder} onChange={(e) => setHero((p) => ({ ...p, searchPlaceholder: e.target.value }))} />
            </Field>
            <Field label="Cab types (comma separated)" hint="e.g. Sedan, SUV, Innova">
              <input
                className={inputCls()}
                value={hero.cabTypes.join(", ")}
                onChange={(e) => setHero((p) => ({ ...p, cabTypes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
              />
            </Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-bold text-slate-800">Trust badges</p>
              <div className="space-y-2">
                {hero.trustBadges.map((badge, index) => (
                  <div key={index} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4">
                    <Field label="Label">
                      <input
                        className={inputCls()}
                        value={badge.label}
                        onChange={(e) =>
                          setHero((p) => ({
                            ...p,
                            trustBadges: p.trustBadges.map((b, i) => (i === index ? { ...b, label: e.target.value } : b))
                          }))
                        }
                      />
                    </Field>
                    <Field label="Icon preset">
                      <select
                        className={inputCls()}
                        value={badge.iconKey}
                        onChange={(e) => {
                          const iconKey = e.target.value;
                          setHero((p) => ({
                            ...p,
                            trustBadges: p.trustBadges.map((b, i) =>
                              i === index ? { ...b, iconKey, icon: EMOJI_BY_KEY[iconKey] || b.icon } : b
                            )
                          }));
                        }}
                      >
                        {TRUST_ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Emoji" hint="Same style as search tabs">
                      <input
                        className={inputCls()}
                        value={badge.icon || ""}
                        onChange={(e) =>
                          setHero((p) => ({
                            ...p,
                            trustBadges: p.trustBadges.map((b, i) => (i === index ? { ...b, icon: e.target.value } : b))
                          }))
                        }
                        placeholder="✅"
                      />
                    </Field>
                    <button
                      type="button"
                      onClick={() => setHero((p) => ({ ...p, trustBadges: p.trustBadges.filter((_, i) => i !== index) }))}
                      className="self-end text-xs font-semibold text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setHero((p) => ({ ...p, trustBadges: [...p.trustBadges, emptyTrustBadge()] }))}
                  className="text-xs font-semibold text-sky-700 hover:underline"
                >
                  + Add trust badge
                </button>
              </div>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-bold text-slate-800">Search tabs</p>
              <div className="space-y-2">
                {hero.tabs.map((tab, index) => (
                  <div key={index} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4">
                    <Field label="ID">
                      <input className={inputCls()} value={tab.id} onChange={(e) => setHero((p) => ({ ...p, tabs: p.tabs.map((t, i) => (i === index ? { ...t, id: e.target.value } : t)) }))} />
                    </Field>
                    <Field label="Label">
                      <input className={inputCls()} value={tab.label} onChange={(e) => setHero((p) => ({ ...p, tabs: p.tabs.map((t, i) => (i === index ? { ...t, label: e.target.value } : t)) }))} />
                    </Field>
                    <Field label="Icon">
                      <input className={inputCls()} value={tab.icon} onChange={(e) => setHero((p) => ({ ...p, tabs: p.tabs.map((t, i) => (i === index ? { ...t, icon: e.target.value } : t)) }))} />
                    </Field>
                    <button type="button" onClick={() => setHero((p) => ({ ...p, tabs: p.tabs.filter((_, i) => i !== index) }))} className="self-end text-xs font-semibold text-rose-700">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setHero((p) => ({ ...p, tabs: [...p.tabs, { id: "", label: "", icon: "" }] }))} className="text-xs font-semibold text-sky-700 hover:underline">
                  + Add tab
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "heroStats" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Controls the animated trust counters on the homepage (Happy customers, Trips completed, etc.). Use values like{" "}
              <code className="rounded bg-slate-100 px-1">50K+</code>, <code className="rounded bg-slate-100 px-1">50000</code>, or{" "}
              <code className="rounded bg-slate-100 px-1">4.9/5</code>.
            </p>
            {heroStats.map((stat, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4">
                <Field label="Value">
                  <input className={inputCls()} value={stat.value} onChange={(e) => updateListItem(setHeroStats, index, "value", e.target.value)} />
                </Field>
                <Field label="Label">
                  <input className={inputCls()} value={stat.label} onChange={(e) => updateListItem(setHeroStats, index, "label", e.target.value)} />
                </Field>
                <Field label="Icon key" hint="users, car, driver, pin, star">
                  <input className={inputCls()} value={stat.iconKey} onChange={(e) => updateListItem(setHeroStats, index, "iconKey", e.target.value)} />
                </Field>
                <button type="button" onClick={() => removeListItem(setHeroStats, index)} className="self-end text-xs font-semibold text-rose-700">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setHeroStats((p) => [...p, emptyHeroStat()])} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              + Add stat
            </button>
          </div>
        )}

        {activeSection === "whyChooseUs" && (
          <div className="space-y-6">
            <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
              <Field label="Section eyebrow">
                <input className={inputCls()} value={whySection.eyebrow} onChange={(e) => setWhySection((p) => ({ ...p, eyebrow: e.target.value }))} />
              </Field>
              <Field label="Section title">
                <input className={inputCls()} value={whySection.title} onChange={(e) => setWhySection((p) => ({ ...p, title: e.target.value }))} />
              </Field>
              <Field label="Section subtitle">
                <input className={inputCls()} value={whySection.subtitle} onChange={(e) => setWhySection((p) => ({ ...p, subtitle: e.target.value }))} />
              </Field>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-slate-700">Top stat pills (4 cards above features)</p>
              <div className="space-y-3">
                {whyStats.map((stat, index) => (
                  <div key={index} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
                    <Field label="Value">
                      <input className={inputCls()} value={stat.value} onChange={(e) => updateListItem(setWhyStats, index, "value", e.target.value)} />
                    </Field>
                    <Field label="Label">
                      <input className={inputCls()} value={stat.label} onChange={(e) => updateListItem(setWhyStats, index, "label", e.target.value)} />
                    </Field>
                    <button type="button" onClick={() => removeListItem(setWhyStats, index)} className="self-end text-xs font-semibold text-rose-700">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setWhyStats((p) => [...p, emptyWhyStat()])} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  + Add stat pill
                </button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-slate-700">Feature cards (first 4 shown on homepage)</p>
              <div className="space-y-3">
            {whyChooseUs.map((card, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4">
                <Field label="Title">
                  <input className={inputCls()} value={card.title} onChange={(e) => updateListItem(setWhyChooseUs, index, "title", e.target.value)} />
                </Field>
                <Field label="Subtitle">
                  <input className={inputCls()} value={card.subtitle} onChange={(e) => updateListItem(setWhyChooseUs, index, "subtitle", e.target.value)} />
                </Field>
                <Field label="Icon key">
                  <input className={inputCls()} value={card.iconKey} onChange={(e) => updateListItem(setWhyChooseUs, index, "iconKey", e.target.value)} />
                </Field>
                <button type="button" onClick={() => removeListItem(setWhyChooseUs, index)} className="self-end text-xs font-semibold text-rose-700">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setWhyChooseUs((p) => [...p, emptyWhyCard()])} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              + Add card
            </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "homeSections" && (
          <div className="space-y-3">
            {homeSections.map((section, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Section key" hint="cabs, drivers, tours, testimonials, blogs">
                    <input className={inputCls()} value={section.key} onChange={(e) => updateListItem(setHomeSections, index, "key", e.target.value)} />
                  </Field>
                  <Field label="Sort order">
                    <input type="number" className={inputCls()} value={section.sortOrder ?? 0} onChange={(e) => updateListItem(setHomeSections, index, "sortOrder", Number(e.target.value))} />
                  </Field>
                  <Field label="Items to show (limit)">
                    <input type="number" className={inputCls()} value={section.limit ?? 6} onChange={(e) => updateListItem(setHomeSections, index, "limit", Number(e.target.value))} />
                  </Field>
                  <Field label="Eyebrow">
                    <input className={inputCls()} value={section.eyebrow} onChange={(e) => updateListItem(setHomeSections, index, "eyebrow", e.target.value)} />
                  </Field>
                  <Field label="Title">
                    <input className={inputCls()} value={section.title} onChange={(e) => updateListItem(setHomeSections, index, "title", e.target.value)} />
                  </Field>
                  <Field label="View all link">
                    <input className={inputCls()} value={section.viewAllHref || ""} onChange={(e) => updateListItem(setHomeSections, index, "viewAllHref", e.target.value)} />
                  </Field>
                  <div className="sm:col-span-3">
                    <Field label="Subtitle">
                      <textarea className={inputCls()} rows={2} value={section.subtitle} onChange={(e) => updateListItem(setHomeSections, index, "subtitle", e.target.value)} />
                    </Field>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={section.enabled !== false} onChange={(e) => updateListItem(setHomeSections, index, "enabled", e.target.checked)} />
                    Show on homepage
                  </label>
                </div>
                <button type="button" onClick={() => removeListItem(setHomeSections, index)} className="mt-2 text-xs font-semibold text-rose-700 hover:underline">
                  Remove section
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setHomeSections((p) => [...p, emptyHomeSection()])} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              + Add homepage section
            </button>
          </div>
        )}

        {activeSection === "whatsapp" && (
          <div className="max-w-md space-y-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={whatsappFab.enabled} onChange={(e) => setWhatsappFab((p) => ({ ...p, enabled: e.target.checked }))} />
              Show floating WhatsApp button
            </label>
            <Field label="WhatsApp number (digits only)">
              <input className={inputCls()} value={whatsappFab.number} onChange={(e) => setWhatsappFab((p) => ({ ...p, number: e.target.value }))} placeholder="9944197416" />
            </Field>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => saveSection(activeSection)}
          disabled={saving || !isSuperAdmin}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : `Save ${SECTIONS.find((s) => s.id === activeSection)?.label || "section"}`}
        </button>
      </div>
    </div>
  );
}
